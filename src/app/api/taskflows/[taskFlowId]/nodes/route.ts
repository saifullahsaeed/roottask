import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Task } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
/**
 * @description - This API endpoint retrieves all nodes for a taskflow.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await params;
    const nodes = await prisma.taskNode.findMany({
      where: {
        flowId: taskFlowId,
      },
      include: {
        sourceDependencies: true,
        targetDependencies: true,
        task: {
          include: {
            assignees: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Error fetching nodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}

/**
 * @description - This API endpoint creates a new node for a taskflow.
 */
export type CreateNodeBody = {
  type: string;
  positionX: number;
  positionY: number;
  data: Task;
  id: string;
};
export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { type, positionX, positionY, data, id } = body;
    const { taskFlowId } = await params;
    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // //validate the body
    // if (!type || !positionX || !positionY || !data || !id) {
    //   return NextResponse.json({ error: "Invalid body" }, { status: 403 });
    // }
    //if data cointain assigneesIds,
    const assigneesIds = data.assigneesIds;
    delete data.assigneesIds;
    assigneesIds.push(session.user.id);
    //create new task
    const newTask = await prisma.task.create({
      data: data,
    });

    if (assigneesIds && assigneesIds.length > 0) {
      await prisma.taskAssignee.createMany({
        data: assigneesIds.map((assigneeId: string) => ({
          taskId: newTask.id,
          userId: assigneeId,
        })),
      });
    }
    const node = await prisma.taskNode.create({
      data: {
        id,
        type,
        positionX,
        positionY,
        taskId: newTask.id,
        flowId: taskFlowId,
      },
    });

    return NextResponse.json(node);
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Failed to create node" },
      { status: 500 }
    );
  }
}

// PUT update a node
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const body = await request.json();
    const { id, type, positionX, positionY } = body;
    const { taskFlowId } = await context.params;
    if (!id || (!type && !positionX && !positionY)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    // First check if the node exists
    const existingNode = await prisma.taskNode.findUnique({
      where: {
        id,
        flowId: taskFlowId,
      },
    });

    if (!existingNode) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }
    // Update only the node properties
    const node = await prisma.taskNode.update({
      where: {
        id,
        flowId: taskFlowId,
      },
      data: {
        type,
        positionX,
        positionY,
      },
    });

    return NextResponse.json(node);
  } catch (error) {
    console.error("Error updating node:", error);
    return NextResponse.json(
      { error: "Failed to update node" },
      { status: 500 }
    );
  }
}

// DELETE a node
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await params;
    const { searchParams } = new URL(request.url);
    const nodeId = searchParams.get("nodeId");

    if (!nodeId) {
      return NextResponse.json(
        { error: "Node ID is required" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure all deletions succeed or none do
    await prisma.$transaction(async (tx) => {
      // 1. Delete all edges connected to this node
      await tx.taskDependency.deleteMany({
        where: {
          OR: [{ sourceId: nodeId }, { targetId: nodeId }],
          flowId: taskFlowId,
        },
      });

      // 2. Get the taskId before deleting the node
      const node = await tx.taskNode.findUnique({
        where: {
          id: nodeId,
          flowId: taskFlowId,
        },
        select: {
          taskId: true,
        },
      });

      // 3. Delete the taskNode
      await tx.taskNode.delete({
        where: {
          id: nodeId,
          flowId: taskFlowId,
        },
      });

      // 4. If there's an associated task, delete it
      if (node?.taskId) {
        await tx.task.delete({
          where: {
            id: node.taskId,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting node:", error);
    return NextResponse.json(
      { error: "Failed to delete node and its associated data" },
      { status: 500 }
    );
  }
}
