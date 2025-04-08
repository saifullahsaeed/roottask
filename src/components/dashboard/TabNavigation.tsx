import { Share2, LayoutGrid, List, GanttChart, Calendar } from "lucide-react";
import { Tooltip } from "@/components/ui";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "flow", label: "Flow", icon: Share2 },
    { id: "board", label: "Board", icon: LayoutGrid },
    { id: "list", label: "List", icon: List },
    { id: "timeline", label: "Timeline", icon: GanttChart },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-1.5 flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Tooltip
              key={tab.id}
              content={tab.label}
              variant="dark"
              delayDuration={500}
            >
              <button
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 relative ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "hover:bg-muted/80 text-foreground/80 hover:text-foreground"
                }`}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 bg-primary/5 rounded-lg"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-primary" : "text-foreground/80"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isActive ? "text-primary font-medium" : "text-foreground/80"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
