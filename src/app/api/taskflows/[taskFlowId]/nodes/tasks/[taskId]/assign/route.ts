import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskFlowId: string; taskId: string }> }
) {
  const { taskFlowId, taskId } = await params;
  return NextResponse.json({ taskFlowId, taskId });
}
