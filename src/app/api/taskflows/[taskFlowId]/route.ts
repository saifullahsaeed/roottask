import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @description - This API endpoint retrieves a specific task flow by its ID.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await params;
    const taskFlow = await prisma.taskFlow.findUnique({
      where: {
        id: taskFlowId,
      },
      include: {
        nodes: true,
        dependencies: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!taskFlow) {
      return NextResponse.json(
        { error: "Taskflow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(taskFlow);
  } catch (error) {
    console.error("Error fetching taskflow:", error);
    return NextResponse.json(
      { error: "Failed to fetch taskflow" },
      { status: 500 }
    );
  }
}
