import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskFlowId: string; taskId: string }> }
) {
  try {
    const { taskFlowId, taskId } = await params;
    const data = await request.json();

    const task = await prisma.task.update({
      where: {
        id: taskId,
        nodes: {
          some: {
            flowId: taskFlowId,
          },
        },
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
