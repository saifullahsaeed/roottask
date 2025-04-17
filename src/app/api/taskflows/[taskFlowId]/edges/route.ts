import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Edge } from "reactflow";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await context.params;

    const dependencies = await prisma.taskDependency.findMany({
      where: {
        flowId: taskFlowId,
      },
      include: {
        sourceNode: true,
        targetNode: true,
      },
    });

    // Transform dependencies to React Flow edges
    const edges: Edge[] = dependencies.map((dep) => ({
      id: dep.id,
      source: dep.sourceId,
      target: dep.targetId,
      type: dep.type,
      data: dep.data || {},
    }));

    return NextResponse.json(edges);
  } catch (error) {
    console.error("Error fetching edges:", error);
    return NextResponse.json(
      { error: "Failed to fetch edges" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await context.params;
    const body = await request.json();
    const { source, target, type = "default", data = {}, id } = body;

    const dependency = await prisma.taskDependency.create({
      data: {
        sourceId: source,
        targetId: target,
        type,
        data,
        flowId: taskFlowId,
        id,
      },
    });

    return NextResponse.json(dependency);
  } catch (error) {
    console.error("Error creating edge:", error);
    return NextResponse.json(
      { error: "Failed to create edge" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await context.params;
    const { searchParams } = new URL(request.url);
    const edgeIds = searchParams.get("edgeIds");

    if (!edgeIds) {
      return NextResponse.json(
        { error: "Edge IDs are required" },
        { status: 400 }
      );
    }

    await prisma.taskDependency.deleteMany({
      where: {
        id: { in: edgeIds.split(",") },
        flowId: taskFlowId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting edge:", error);
    return NextResponse.json(
      { error: "Failed to delete edge" },
      { status: 500 }
    );
  }
}
