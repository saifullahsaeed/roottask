import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { projectId } = await context.params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        createdByUser: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found or unauthorized", {
        status: 404,
      });
    }

    // Use a transaction to fetch all taskflows and their related data efficiently
    const taskFlows = await prisma.taskFlow.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        nodes: {
          include: {
            task: {
              include: {
                assignees: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    // Aggregate the required metadata for each taskflow in memory
    const result = taskFlows.map((flow) => {
      // Gather all tasks from nodes
      const tasks = flow.nodes.map((node) => node.task).filter(Boolean);
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(
        (t) => t.status === "COMPLETED"
      ).length;
      const todoTasks = tasks.filter((t) => t.status === "TODO").length;
      // Collect all unique assignee users
      const assigneeMap = new Map();
      for (const task of tasks) {
        for (const assignee of task.assignees) {
          if (assignee.user) {
            assigneeMap.set(assignee.user.id, assignee.user);
          }
        }
      }
      const assignedTo = Array.from(assigneeMap.values());
      // Calculate date range
      const startDates = tasks.map((t) => t.startDate).filter((d) => !!d);
      const dueDates = tasks.map((t) => t.dueDate).filter((d) => !!d);
      const minStartDate =
        startDates.length > 0
          ? new Date(
              Math.min(...startDates.map((d) => new Date(String(d)).getTime()))
            ).toISOString()
          : null;
      const maxDueDate =
        dueDates.length > 0
          ? new Date(
              Math.max(...dueDates.map((d) => new Date(String(d)).getTime()))
            ).toISOString()
          : null;
      const dateRange = { startDate: minStartDate, endDate: maxDueDate };
      // Return the taskflow with metadata
      return {
        ...flow,
        totalTasks,
        completedTasks,
        todoTasks,
        assignedTo,
        dateRange,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching taskflows:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { projectId } = await context.params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        createdByUser: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found or unauthorized", {
        status: 404,
      });
    }

    const taskFlow = await prisma.taskFlow.create({
      data: {
        name,
        projectId,
      },
    });

    return NextResponse.json(taskFlow);
  } catch (error) {
    console.error("Error creating taskflow:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
