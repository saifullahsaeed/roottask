import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;

    //check if user is a member of the project
    const isMember = await prisma.project.findFirst({
      where: {
        id: projectId,
        team: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!isMember) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
