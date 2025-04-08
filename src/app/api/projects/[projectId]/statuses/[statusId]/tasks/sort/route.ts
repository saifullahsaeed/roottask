import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const { taskIds } = await request.json();
    if (!Array.isArray(taskIds)) {
      return NextResponse.json(
        { error: "Task IDs must be an array" },
        { status: 400 }
      );
    }

    // Verify all tasks exist and belong to the status
    const existingTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        statusId: statusId,
      },
    });

    if (existingTasks.length !== taskIds.length) {
      return NextResponse.json(
        {
          error: "One or more tasks not found or do not belong to this status",
        },
        { status: 404 }
      );
    }

    // Update all task positions in a transaction
    const updatedTasks = await prisma.$transaction(
      taskIds.map((taskId, index) =>
        prisma.task.update({
          where: { id: taskId },
          data: { position: index },
        })
      )
    );

    return NextResponse.json(updatedTasks);
  } catch (error) {
    console.error("Error sorting tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
