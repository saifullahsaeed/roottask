import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TaskPriority } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; statusId: string; taskId: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, statusId, taskId } = await params;
    if (!projectId || !statusId || !taskId) {
      return NextResponse.json(
        { error: "Project ID, Status ID, and Task ID are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: { include: { members: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isMember = project.team.members.some(
      (member) => member.userId === session.user.id
    );
    if (!isMember) {
      return NextResponse.json(
        { error: "User is not a member of this project" },
        { status: 403 }
      );
    }

    // Get the task to verify it exists and belongs to the project
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        status: {
          projectId: projectId,
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found in this project" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      priority,
      startDate,
      dueDate,
      position,
      statusId: newStatusId,
    } = body;

    // If status is changing, we need to handle positions in both old and new status
    if (newStatusId && newStatusId !== existingTask.statusId) {
      return await prisma.$transaction(async (tx) => {
        // First, update positions in the old status
        if (existingTask.position !== undefined) {
          await tx.task.updateMany({
            where: {
              statusId: existingTask.statusId,
              position: {
                gt: existingTask.position,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        }

        // Then, make space in the new status at the desired position
        await tx.task.updateMany({
          where: {
            statusId: newStatusId,
            position: {
              gte: position ?? 0,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });

        // Finally, update the task itself
        const updatedTask = await tx.task.update({
          where: { id: taskId },
          data: {
            title: title,
            description: description,
            priority: priority as TaskPriority | null,
            startDate: startDate ? new Date(startDate) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            position: position ?? 0,
            statusId: newStatusId,
          },
        });

        return NextResponse.json(updatedTask);
      });
    }

    // If just updating other fields (no status change)
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title,
        description: description,
        priority: priority as TaskPriority | null,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        position: position,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
