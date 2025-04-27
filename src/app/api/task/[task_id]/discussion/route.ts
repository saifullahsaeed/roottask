import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { task_id } = await context.params;

    const comments = await prisma.taskComment.findMany({
      where: {
        taskId: task_id,
        parentId: null, // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likes: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[TASK_DISCUSSION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
    const body = await request.json();
    const { content, parentId, mentions } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const comment = await prisma.taskComment.create({
      data: {
        content,
        taskId: task_id,
        userId: session.user.id,
        parentId,
        mentions,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likes: true,
          },
        },
        likes: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[TASK_DISCUSSION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { task_id } = await context.params;
    const body = await request.json();
    const { commentId, content, isPinned } = body;

    if (!commentId) {
      return new NextResponse("Comment ID is required", { status: 400 });
    }

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.taskComment.findFirst({
      where: {
        id: commentId,
        taskId: task_id,
        userId: session.user.id,
      },
    });

    if (!existingComment) {
      return new NextResponse("Comment not found or unauthorized", {
        status: 404,
      });
    }

    const updatedComment = await prisma.taskComment.update({
      where: {
        id: commentId,
      },
      data: {
        ...(content !== undefined && { content }),
        ...(isPinned !== undefined && { isPinned }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likes: true,
          },
        },
        likes: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("[TASK_DISCUSSION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ task_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { task_id } = await context.params;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return new NextResponse("Comment ID is required", { status: 400 });
    }

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.taskComment.findFirst({
      where: {
        id: commentId,
        taskId: task_id,
        userId: session.user.id,
      },
    });

    if (!existingComment) {
      return new NextResponse("Comment not found or unauthorized", {
        status: 404,
      });
    }

    // Delete the comment and its replies (cascade delete)
    await prisma.taskComment.delete({
      where: {
        id: commentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TASK_DISCUSSION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
