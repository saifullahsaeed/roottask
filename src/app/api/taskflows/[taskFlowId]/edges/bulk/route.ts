import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ taskFlowId: string }> }
) {
  try {
    const { taskFlowId } = await context.params;
    const body = await request.json();
    const { edges } = body;

    if (!edges || !Array.isArray(edges) || edges.length === 0) {
      return NextResponse.json(
        { error: "Edges array is required" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure all edges are created or none are
    const dependencies = await prisma.$transaction(
      edges.map((edge) =>
        prisma.taskDependency.create({
          data: {
            sourceId: edge.source,
            targetId: edge.target,
            type: edge.type || "default",
            data: edge.data || {},
            flowId: taskFlowId,
            id: edge.id,
          },
        })
      )
    );

    return NextResponse.json(dependencies);
  } catch (error) {
    console.error("Error creating bulk edges:", error);
    return NextResponse.json(
      { error: "Failed to create bulk edges" },
      { status: 500 }
    );
  }
}
