import { Calendar, Plus, Filter, User } from "lucide-react";
import { Button } from "@/components/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { TaskFlowWithMetaData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowTable() {
  const [nameFilter, setNameFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: session } = useSession();
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();

  // Fetch task flows from API
  const { data: workflows = [], isLoading } = useQuery<TaskFlowWithMetaData[]>({
    queryKey: ["taskflows", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/taskflows`);
      if (!res.ok) throw new Error("Failed to fetch taskflows");
      return res.json();
    },
    enabled: !!projectId,
  });

  // Get all unique team members for avatar buttons
  const allMembers = Array.from(
    new Set(
      workflows.flatMap((wf) =>
        (wf.assignedTo || []).map(
          (user) => user.name || user.email || "Unknown"
        )
      )
    )
  );

  // Get logged-in user's name (fallback to email or 'Me')
  const loggedInName = session?.user?.name || session?.user?.email || "Me";

  // Filtering logic
  const filteredWorkflows = workflows.filter((wf) => {
    const matchesName = wf.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const teamMemberNames = (wf.assignedTo || []).map(
      (user) => user.name || user.email || "Unknown"
    );
    const matchesMember =
      memberFilter === "" || teamMemberNames.includes(memberFilter);
    // If you have start/end dates in your TaskFlowWithMetaData, use them here. Otherwise, skip date filtering.
    return matchesName && matchesMember;
  });

  // Filter Bar (always shown)
  const FilterBar = (
    <div className="flex flex-wrap items-center gap-2 mb-4 bg-zinc-900/70 border border-zinc-800 rounded-lg shadow px-2 py-1.5 backdrop-blur-md transition-all">
      {/* Search */}
      <div className="relative flex items-center min-w-[160px]">
        <Filter className="h-3 w-3 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="workflow-search"
          type="text"
          placeholder="Search..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="pl-7 pr-2 py-1 rounded bg-zinc-800/80 text-zinc-100 placeholder:text-zinc-400 border border-zinc-700 focus:ring-1 focus:ring-primary focus:outline-none text-xs shadow-sm h-7 w-full min-w-0 transition"
          aria-label="Search workflows"
        />
      </div>
      {/* Divider */}
      <div className="w-px h-6 bg-zinc-800 mx-1" />
      {/* Team Member Avatars as filter buttons */}
      <div className="flex items-center gap-0.5">
        <Button
          size="icon"
          variant={memberFilter === "" ? "default" : "outline"}
          className={`!h-7 !w-7 rounded-full ${
            memberFilter === "" ? "ring-2 ring-primary" : "border-zinc-700"
          }`}
          onClick={() => setMemberFilter("")}
          title="All Team Members"
          aria-label="All Team Members"
        >
          <User className="h-3.5 w-3.5" />
        </Button>
        {allMembers.map((member) => (
          <Button
            key={member}
            size="icon"
            variant={memberFilter === member ? "default" : "outline"}
            className={`!h-7 !w-7 rounded-full ${
              memberFilter === member
                ? "ring-2 ring-primary"
                : "border-zinc-700"
            }`}
            onClick={() => setMemberFilter(member)}
            title={member}
            aria-label={member}
          >
            <Avatar className="w-5 h-5">
              <AvatarFallback name={member} />
            </Avatar>
          </Button>
        ))}
        <Button
          size="icon"
          variant={memberFilter === loggedInName ? "default" : "outline"}
          className={`!h-7 !w-7 rounded-full ${
            memberFilter === loggedInName
              ? "ring-2 ring-primary"
              : "border-zinc-700"
          }`}
          onClick={() => setMemberFilter(loggedInName)}
          title="Me"
          aria-label="Me"
        >
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[10px]" name={loggedInName} />
          </Avatar>
        </Button>
      </div>
      {/* Divider */}
      <div className="w-px h-6 bg-zinc-800 mx-1" />
      {/* Date filters */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <Calendar className="h-3 w-3 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-7 pr-1 py-1 rounded bg-zinc-800/80 text-zinc-100 border border-zinc-700 focus:ring-1 focus:ring-primary focus:outline-none w-24 text-xs shadow-sm h-7 transition"
            placeholder="Start date"
            aria-label="Start date"
            title="Start date"
          />
        </div>
        <span className="text-zinc-500 text-xs">-</span>
        <div className="relative">
          <Calendar className="h-3 w-3 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="pl-7 pr-1 py-1 rounded bg-zinc-800/80 text-zinc-100 border border-zinc-700 focus:ring-1 focus:ring-primary focus:outline-none w-24 text-xs shadow-sm h-7 transition"
            placeholder="End date"
            aria-label="End date"
            title="End date"
          />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        {FilterBar}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-zinc-800 dark:text-zinc-100 border-separate border-spacing-0 rounded-xl overflow-hidden shadow-lg bg-zinc-900">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800">
                <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
                  Workflow
                </th>
                <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
                  Team Member
                </th>
                <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
                  Tasks
                </th>
                <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
                  Progress
                </th>
                <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
                  Dates
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-zinc-800">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-32 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[1, 2].map((j) => (
                        <Skeleton key={j} className="h-7 w-7 rounded-full" />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-16 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-28 rounded-full" />
                      <Skeleton className="h-4 w-8 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  if (filteredWorkflows.length === 0) {
    return (
      <>
        {FilterBar}
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-zinc-900/60 rounded-xl border border-zinc-800 shadow-inner mx-auto max-w-lg mt-12">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-1">
            No Workflows Yet
          </h3>
          <p className="text-zinc-400 max-w-md text-base mb-2">
            Workflows help you organize your project into phases or sprints. Get
            started by creating your first workflow for this project.
          </p>
          <Button
            size="lg"
            className="h-10 px-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" /> Create Workflow
          </Button>
        </div>
      </>
    );
  }
  return (
    <div>
      {/* Filter Bar */}
      {FilterBar}
      <table className="w-full text-sm text-zinc-800 dark:text-zinc-100 border-separate border-spacing-0 rounded-xl overflow-hidden shadow-lg bg-zinc-900">
        <thead>
          <tr className="bg-zinc-900/80 border-b border-zinc-800">
            <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
              Workflow
            </th>
            <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
              Team Member
            </th>
            <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
              Tasks
            </th>
            <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
              Progress
            </th>
            <th className="px-4 py-3 font-bold text-left whitespace-nowrap text-zinc-300">
              Dates
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkflows.map((wf) => (
            <tr
              key={wf.id}
              className="border-b border-zinc-800 hover:bg-zinc-800/60 transition group"
            >
              <td
                className="px-4 py-3 font-medium max-w-xs truncate align-middle text-white cursor-pointer underline underline-offset-2 hover:text-primary focus:text-primary"
                onClick={() => router.push(`/taskflows/${wf.id}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    router.push(`/taskflows/${wf.id}`);
                }}
                role="button"
                aria-label={`View workflow ${wf.name}`}
              >
                {wf.name}
              </td>
              <td className="px-4 py-3 align-middle">
                {wf.assignedTo && wf.assignedTo.length > 0 ? (
                  <div
                    className="flex items-center gap-1"
                    title={(wf.assignedTo || [])
                      .map((u) => u.name || u.email || "Unknown")
                      .join(", ")}
                  >
                    {(wf.assignedTo || []).slice(0, 3).map((user, idx) => (
                      <Avatar
                        key={(user.id || user.email || "") + idx}
                        className={`w-7 h-7 text-xs font-bold border-2 ring-2 ring-background dark:ring-zinc-900 transition-all duration-150 ${
                          idx !== 0 ? "-ml-2" : ""
                        } hover:z-20 hover:ring-primary shadow-md`}
                        style={{ zIndex: 10 - idx }}
                      >
                        <AvatarFallback
                          name={user.name || user.email || "Unknown"}
                        />
                      </Avatar>
                    ))}
                    {(wf.assignedTo || []).length > 3 && (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-700 text-zinc-200 text-xs font-bold border-2 border-zinc-600 ml-2 shadow-md">
                        +{(wf.assignedTo || []).length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="italic text-zinc-500 flex items-center gap-1">
                    <span className="text-lg">–</span> No members
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-middle text-zinc-400">
                {/* If you have totalTasks/completedTasks in metadata, show them. Otherwise, show a better null state */}
                {typeof wf.completedTasks === "number" &&
                typeof wf.totalTasks === "number" ? (
                  `${wf.completedTasks} / ${wf.totalTasks}`
                ) : (
                  <span className="italic text-zinc-500 flex items-center gap-1">
                    <span className="text-lg">–</span> No tasks
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-middle">
                {/* If you have progress in metadata, show a progress bar. Otherwise, show a better null state */}
                {typeof wf.completedTasks === "number" &&
                typeof wf.totalTasks === "number" &&
                wf.totalTasks > 0 ? (
                  <>
                    <div className="w-28 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          wf.completedTasks === wf.totalTasks
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-blue-400 to-blue-600"
                        }`}
                        style={{
                          width: `${Math.round(
                            (wf.completedTasks / wf.totalTasks) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="ml-2 text-xs font-semibold text-zinc-300">
                      {Math.round((wf.completedTasks / wf.totalTasks) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="italic text-zinc-500 flex items-center gap-1">
                    <span className="text-lg">–</span> No progress
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-middle text-xs text-zinc-400 whitespace-nowrap">
                {/* Show date range if available, otherwise show a better null state */}
                {wf.dateRange &&
                wf.dateRange.startDate &&
                wf.dateRange.endDate ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-help">
                    <Calendar className="h-3 w-3 text-primary/70" />
                    <span>
                      {new Date(wf.dateRange.startDate).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                      {wf.dateRange.startDate !== wf.dateRange.endDate && (
                        <>
                          {" "}
                          –{" "}
                          {new Date(wf.dateRange.endDate).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </>
                      )}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-help italic">
                    <Calendar className="h-3 w-3 text-primary/70" />
                    <span>No dates</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
