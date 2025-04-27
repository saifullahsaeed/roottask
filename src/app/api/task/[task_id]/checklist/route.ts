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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { task_id } = await params;
    const task = await prisma.task.findUnique({
      where: { id: task_id, assignees: { some: { userId: session.user.id } } },
      include: {
        checklist: {
          include: {
            items: true,
          },
        },
      },
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task.checklist);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { task_id } = await params;
    if (!task_id) {
      return NextResponse.json(
        { error: "Task ID is required" },
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

    const checklist = await prisma.taskChecklist.create({
      data: {
        taskId: task_id,
        content: name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(checklist);
  } catch (error) {
    console.error("Error creating checklist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
