import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

//GET /api/projects/[projectId]/tasks
//takes in a projectId and returns all tasks in the project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    //if statusId is provided, return all tasks in the status
    const statusId = request.nextUrl.searchParams.get("statusId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    //check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        statuses: true,
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    //check if user is a member of the project
    const user = project.team.members.find(
      (member) => member.userId === session.user.id
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not a member of project" },
        { status: 403 }
      );
    }

    //check if status exists in project
    if (statusId) {
      const status = project.statuses.find((status) => status.id === statusId);

      if (!status) {
        return NextResponse.json(
          { error: "Status not found in project" },
          { status: 404 }
        );
      }
    }

    //if statusId is provided, return all tasks in the status
    const tasks = await prisma.task.findMany({
      where: {
        status: {
          id: statusId || undefined,
          projectId: projectId,
        },
      },
      include: {
        status: true,
        assignments: {
          include: {
            teamMember: {
              include: {
                user: true,
              },
            },
          },
        },
        checklist: true,
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
