import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { TaskPriority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type TaskUpdateData = {
  title?: string;
  description?: string | null;
  priority?: TaskPriority | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  position?: number;
};

/**
 * POST /api/projects/[projectId]/statuses/[statusId]/task
 * Creates a new task in the specified status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; statusId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, statusId } = await params;
    if (!projectId || !statusId) {
      return NextResponse.json(
        { error: "Project ID and Status ID are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        statuses: true,
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

    const status = project.statuses.find((s) => s.id === statusId);
    if (!status) {
      return NextResponse.json(
        { error: "Status not found in project" },
        { status: 404 }
      );
    }

    const { title, description, priority, startDate, dueDate } =
      await request.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Create the task and update positions in a transaction
    const task = await prisma.$transaction(async (tx) => {
      // First, increment positions of all existing tasks in this status
      await tx.task.updateMany({
        where: { statusId },
        data: {
          position: {
            increment: 1,
          },
        },
      });

      // Then create the new task at position 0
      return tx.task.create({
        data: {
          title,
          statusId,
          description,
          priority,
          position: 0, // New task always at position 0
          startDate: startDate ? new Date(startDate) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[projectId]/statuses/[statusId]/task/[taskId]
 * Updates an existing task's details
 */
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
        statuses: true,
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

    const status = project.statuses.find((s) => s.id === statusId);
    if (!status) {
      return NextResponse.json(
        { error: "Status not found in project" },
        { status: 404 }
      );
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, statusId },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found in this status" },
        { status: 404 }
      );
    }

    const { title, description, priority, startDate, dueDate, position } =
      await request.json();

    // Validate that at least one field is being updated
    if (
      !title &&
      description === undefined &&
      priority === undefined &&
      startDate === undefined &&
      dueDate === undefined &&
      position === undefined
    ) {
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    const updateData: TaskUpdateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority as TaskPriority;
    if (startDate !== undefined)
      updateData.startDate = startDate ? new Date(startDate) : null;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (position !== undefined) updateData.position = position;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
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
