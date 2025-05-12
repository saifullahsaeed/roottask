import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ProjectStatus } from "@prisma/client";

// GET /api/projects - Get projects for a specific team, with optional search
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();

    const projects = await prisma.project.findMany({
      where: {
        createdByUser: {
          email: session.user.email,
        },
        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
        ...(status && status !== "ALL"
          ? { status: status as ProjectStatus }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: { select: { taskFlows: true } },
        createdByUser: { select: { name: true, email: true } },
        taskFlows: {
          select: {
            _count: { select: { nodes: true } },
            updatedAt: true,
          },
        },
      },
    });

    // Enhance each project with taskCount and lastActivity
    const enhancedProjects = projects.map((project) => {
      const taskCount = project.taskFlows.reduce(
        (sum, tf) => sum + tf._count.nodes,
        0
      );
      const lastActivity = [
        project.updatedAt,
        ...project.taskFlows.map((tf) => tf.updatedAt),
      ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
      return {
        id: project.id,
        name: project.name,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        taskFlowCount: project._count.taskFlows,
        taskCount,
        lastActivity,
        createdByUser: project.createdByUser,
      };
    });

    return NextResponse.json(enhancedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, workspaceId } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        status: "ACTIVE",
        createdBy: user.id,
        workspaceId,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
