import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * @description - This API endpoint creates a new task flow.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, projectId } = body;

    if (!name || !projectId) {
      return new NextResponse("Name and projectId are required", {
        status: 400,
      });
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
