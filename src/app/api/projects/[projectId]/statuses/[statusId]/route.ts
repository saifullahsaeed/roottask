import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT /api/projects/[projectId]/statuses/[statusId] - Update a specific status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; statusId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, statusId } = await params;
    const body = await request.json();
    const { name, description, position } = body;

    if (!projectId || !statusId) {
      return NextResponse.json(
        { error: "Project ID and Status ID are required" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!name && description === undefined && position === undefined) {
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    // Get the project to check if it exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is a member of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: project.teamId,
        userId: session.user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 403 }
      );
    }

    // Check if the status exists and belongs to the project
    const existingStatus = await prisma.taskStatus.findFirst({
      where: {
        id: statusId,
        projectId: projectId,
      },
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: "Status not found or does not belong to this project" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      name?: string;
      description?: string | null;
      position?: number;
    } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (position !== undefined) updateData.position = position;

    // Update the status
    const updatedStatus = await prisma.taskStatus.update({
      where: { id: statusId },
      data: updateData,
    });

    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId]/statuses/[statusId] - Delete a specific status
//takes in a statusId and deletes the status
// takes projectId as a param for authorization
// takes moveTasksTo arg to move tasks to a different status if task exists
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; statusId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, statusId } = await params;
    const { searchParams } = new URL(request.url);
    const moveTasksTo = searchParams.get("moveTasksTo");

    if (!projectId || !statusId) {
      return NextResponse.json(
        { error: "Project ID and Status ID are required" },
        { status: 400 }
      );
    }

    // Get the project to check if it exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is a member of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: project.teamId,
        userId: session.user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 403 }
      );
    }

    // Check if the status exists and belongs to the project and count the tasks in the status
    const existingStatus = await prisma.taskStatus.findFirst({
      where: { id: statusId, projectId: projectId },
      include: { _count: { select: { tasks: true } } },
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: "Status not found or does not belong to this project" },
        { status: 404 }
      );
    }

    // Check if this is the last status in the project
    const statusCount = await prisma.taskStatus.count({
      where: { projectId: projectId },
    });

    if (statusCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last status in a project" },
        { status: 400 }
      );
    }

    // Check if task exists and moveTasksTo is a valid status ID and if moveTasksTo is not the same as the statusId
    // move tasks if everything is valid
    if (existingStatus._count.tasks > 0) {
      // If there are tasks but no moveTasksTo provided, return an error
      if (!moveTasksTo) {
        return NextResponse.json(
          {
            error:
              "Cannot delete status with tasks. Please provide a moveTasksTo parameter to specify where to move the tasks.",
            taskCount: existingStatus._count.tasks,
          },
          { status: 400 }
        );
      }

      if (moveTasksTo === statusId) {
        return NextResponse.json(
          { error: "Cannot move tasks to the same status" },
          { status: 400 }
        );
      }

      const moveToStatus = await prisma.taskStatus.findFirst({
        where: { id: moveTasksTo, projectId: projectId },
      });

      if (!moveToStatus) {
        return NextResponse.json(
          {
            error:
              "Move tasks to status not found or does not belong to this project",
          },
          { status: 404 }
        );
      }

      // Use a transaction to ensure both operations succeed or fail together
      await prisma.$transaction(async (tx) => {
        // move tasks to the new status
        await tx.task.updateMany({
          where: { statusId: statusId },
          data: { statusId: moveTasksTo },
        });

        // delete the status
        await tx.taskStatus.delete({
          where: { id: statusId },
        });
      });
    } else {
      // If no tasks, just delete the status
      await prisma.taskStatus.delete({
        where: { id: statusId },
      });
    }

    return NextResponse.json({ message: "Status deleted successfully" });
  } catch (error) {
    console.error("Error deleting status:", error);

    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        return NextResponse.json(
          { error: "Cannot delete status due to related records" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
