import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

// Create new checklist item
export async function POST(
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

    const { content } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const item = await prisma.taskChecklistItem.create({
      data: {
        content,
        userId: session.user.id,
        TaskChecklistId: checklist_id,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update checklist item
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

    const { itemId, content, completed } = await request.json();
    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const item = await prisma.taskChecklistItem.update({
      where: {
        id: itemId,
        TaskChecklistId: checklist_id,
      },
      data: {
        content: content,
        completed: completed,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete checklist item
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

    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await prisma.taskChecklistItem.delete({
      where: {
        id: itemId,
        TaskChecklistId: checklist_id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
