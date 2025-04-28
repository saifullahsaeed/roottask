import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { task_id } = await params;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const task = await prisma.task.findUnique({
      where: { id: task_id },
      include: {
        assignees: {
          include: {
            user: true,
          },
        },
        cover: {
          include: {
            file: true,
          },
        },
        checklist: {
          include: {
            items: true,
          },
        },
        attachments: {
          include: {
            file: true,
          },
        },
        nodes: true,
      },
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isAssignee = task.assignees.some(
      (assignee) => assignee.userId === session.user.id
    );

    if (!isAssignee) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { task_id } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { coverId } = body;

    // First check if the task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id: task_id },
      include: {
        assignees: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isAssignee = task.assignees.some(
      (assignee) => assignee.userId === session.user.id
    );

    if (!isAssignee) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If coverId is provided, verify it exists and belongs to this task
    if (coverId) {
      const attachment = await prisma.taskAttachment.findFirst({
        where: {
          id: coverId,
          taskId: task_id,
        },
      });

      if (!attachment) {
        return NextResponse.json(
          { error: "Attachment not found or doesn't belong to this task" },
          { status: 404 }
        );
      }
    }

    // Update the task cover
    const updatedTask = await prisma.task.update({
      where: { id: task_id },
      data: {
        coverId: coverId || null,
      },
      include: {
        cover: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task cover:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
