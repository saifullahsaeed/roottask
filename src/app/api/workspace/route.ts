import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all workspaces where the user is a member
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            user: { email: session.user.email },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "desc", // Sort members by role (ADMIN first)
          },
        },
      },
    });

    // Sort workspaces to show ones where user is admin first
    const sortedWorkspaces = workspaces.sort((a, b) => {
      const aUserRole = a.members.find(
        (m) => m.user.email === session.user.email
      )?.role;
      const bUserRole = b.members.find(
        (m) => m.user.email === session.user.email
      )?.role;

      if (aUserRole === "ADMIN" && bUserRole !== "ADMIN") return -1;
      if (aUserRole !== "ADMIN" && bUserRole === "ADMIN") return 1;
      return 0;
    });

    return NextResponse.json(sortedWorkspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
