import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { projectId } = await context.params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        createdByUser: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found or unauthorized", {
        status: 404,
      });
    }

    const taskFlows = await prisma.taskFlow.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(taskFlows);
  } catch (error) {
    console.error("Error fetching taskflows:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { projectId } = await context.params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        createdByUser: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found or unauthorized", {
        status: 404,
      });
    }

    const taskFlow = await prisma.taskFlow.create({
      data: {
        name,
        projectId,
      },
    });

    return NextResponse.json(taskFlow);
  } catch (error) {
    console.error("Error creating taskflow:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
