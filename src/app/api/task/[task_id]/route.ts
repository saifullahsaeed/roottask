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
        cover: true,
        checklist: {
          include: {
            items: true,
          },
        },
        attachments: true,
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
