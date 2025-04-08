import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/projects/[projectId]/statuses/sort - Sort all statuses
export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await request.json();
    const { statusIds } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!statusIds || !Array.isArray(statusIds) || statusIds.length === 0) {
      return NextResponse.json(
        { error: "Status IDs array is required" },
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

    // Verify all statuses exist and belong to the project
    const existingStatuses = await prisma.taskStatus.findMany({
      where: {
        id: { in: statusIds },
        projectId: projectId,
      },
    });

    if (existingStatuses.length !== statusIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more statuses not found or do not belong to this project",
        },
        { status: 404 }
      );
    }

    // Update all statuses with their new positions in a transaction
    const updatedStatuses = await prisma.$transaction(
      statusIds.map((statusId, index) =>
        prisma.taskStatus.update({
          where: { id: statusId },
          data: { position: index },
        })
      )
    );

    return NextResponse.json(updatedStatuses);
  } catch (error) {
    console.error("Error sorting statuses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
