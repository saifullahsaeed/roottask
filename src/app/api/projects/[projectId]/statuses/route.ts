import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/projects/[projectId]/statuses - Get all statuses for a project
export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to continue." },
        { status: 401 }
      );
    }

    const { projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required. Please check the project ID." },
        { status: 400 }
      );
    }

    // Get the project to check if it exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found. Please check the project ID." },
        { status: 404 }
      );
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

    // Get all statuses for the project
    const statuses = await prisma.taskStatus.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    const statusesWithCount = statuses.map((status) => ({
      ...status,
      taskCount: status._count.tasks,
    }));

    return NextResponse.json(statusesWithCount);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/statuses - Create new status(es)
export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;
    const body = await request.json();
    const { statuses } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!statuses || !Array.isArray(statuses) || statuses.length === 0) {
      return NextResponse.json(
        { error: "At least one status is required" },
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

    // Create the statuses with positions
    const createdStatuses = await prisma.$transaction(
      statuses.map(
        (status: { name: string; description?: string; position?: number }) =>
          prisma.taskStatus.create({
            data: {
              name: status.name,
              description: status.description,
              position: status.position,
              projectId: projectId,
            },
          })
      )
    );

    return NextResponse.json(createdStatuses, { status: 201 });
  } catch (error) {
    console.error("Error creating statuses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[projectId]/statuses - Update status positions
export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const body = await request.json();
    const { statusUpdates } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate request body
    if (
      !statusUpdates ||
      !Array.isArray(statusUpdates) ||
      statusUpdates.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one status update is required" },
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

    // Update the status positions
    const updatedStatuses = await prisma.$transaction(
      statusUpdates.map((update: { id: string; position: number }) =>
        prisma.taskStatus.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );

    return NextResponse.json(updatedStatuses);
  } catch (error) {
    console.error("Error updating status positions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
