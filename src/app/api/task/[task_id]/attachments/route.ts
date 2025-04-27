import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { task_id } = await params;
    const body = await request.json();
    const { fileId, commentId } = body;

    if (!fileId) {
      return new NextResponse("File ID is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const task = await prisma.task.findUnique({
      where: { id: task_id },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const attachment = await prisma.taskAttachment.create({
      data: {
        taskId: task_id,
        fileId,
        userId: [user.id],
        commentId,
      },
      include: {
        file: true,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("Error creating attachment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { task_id } = await params;

    const attachments = await prisma.taskAttachment.findMany({
      where: { taskId: task_id },
      include: {
        file: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
