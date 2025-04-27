import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string; checklist_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { task_id, checklist_id } = await params;
    if (!task_id || !checklist_id) {
      return NextResponse.json(
        { error: "Task ID and Checklist ID are required" },
        { status: 400 }
      );
    }

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id: task_id, assignees: { some: { userId: session.user.id } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const checklist = await prisma.taskChecklist.update({
      where: {
        id: checklist_id,
        taskId: task_id,
      },
      data: {
        content: name,
      },
    });

    return NextResponse.json(checklist);
  } catch (error) {
    console.error("Error updating checklist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string; checklist_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { task_id, checklist_id } = await params;
    if (!task_id || !checklist_id) {
      return NextResponse.json(
        { error: "Task ID and Checklist ID are required" },
        { status: 400 }
      );
    }

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id: task_id, assignees: { some: { userId: session.user.id } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify checklist exists and belongs to the task
    const checklist = await prisma.taskChecklist.findFirst({
      where: {
        id: checklist_id,
        taskId: task_id,
      },
    });

    if (!checklist) {
      return NextResponse.json(
        { error: "Checklist not found" },
        { status: 404 }
      );
    }

    await prisma.taskChecklist.delete({
      where: {
        id: checklist_id,
        taskId: task_id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting checklist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
