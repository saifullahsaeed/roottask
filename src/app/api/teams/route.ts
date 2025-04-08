import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/teams - Get all teams for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        projects: true,
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("[TEAMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/teams - Create a new team
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("[TEAMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT /api/teams - Update a team
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description } = body;

    // Validate required fields
    if (!id || !name) {
      return NextResponse.json(
        { error: "Team ID and name are required" },
        { status: 400 }
      );
    }

    // Check if user is an owner or admin of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId: session.user.id,
      },
    });

    if (!teamMember || !["OWNER", "ADMIN"].includes(teamMember.role)) {
      return NextResponse.json(
        { error: "You don't have permission to update this team" },
        { status: 403 }
      );
    }

    // Update the team
    const team = await prisma.team.update({
      where: { id },
      data: {
        name,
        description,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/teams - Delete a team
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Check if user is an owner of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId: session.user.id,
      },
    });

    if (!teamMember || teamMember.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only team owners can delete the team" },
        { status: 403 }
      );
    }

    // Delete the team (cascade will handle related records)
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
