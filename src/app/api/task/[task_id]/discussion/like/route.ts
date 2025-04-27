import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { task_id } = await context.params;
    const { commentId } = await request.json();

    if (!commentId) {
      return new NextResponse("Comment ID is required", { status: 400 });
    }

    // Check if the comment exists and belongs to the task
    const comment = await prisma.taskComment.findFirst({
      where: {
        id: commentId,
        taskId: task_id,
      },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    // Check if user already liked the comment
    const existingLike = await prisma.taskCommentLike.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      // Unlike the comment
      await prisma.taskCommentLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like the comment
      await prisma.taskCommentLike.create({
        data: {
          commentId,
          userId: session.user.id,
        },
      });
    }

    // Get updated comment with likes
    const updatedComment = await prisma.taskComment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        likes: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("[TASK_DISCUSSION_LIKE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
