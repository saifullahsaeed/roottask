import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ task_id: string; attachment_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { attachment_id } = await params;

    const attachment = await prisma.taskAttachment.findUnique({
      where: { id: attachment_id },
      include: { file: true },
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Delete the attachment
    await prisma.taskAttachment.delete({
      where: { id: attachment_id },
    });

    // Delete the file if no other attachments reference it
    const otherAttachments = await prisma.taskAttachment.findMany({
      where: { fileId: attachment.fileId },
    });

    if (otherAttachments.length === 0) {
      await prisma.file.delete({
        where: { id: attachment.fileId },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
