"use client";
import { useTheme } from "@/providers/theme-provider";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-1 rounded-md border border-border bg-muted/50 p-1">
      <button
        onClick={() => setTheme("light")}
        className={`flex-1 rounded-sm px-1.5 py-1 text-sm transition-all hover:bg-background flex items-center justify-center ${
          theme === "light"
            ? "bg-background text-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex-1 rounded-sm px-1.5 py-1 text-sm transition-all hover:bg-background flex items-center justify-center ${
          theme === "dark"
            ? "bg-background text-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex-1 rounded-sm px-1.5 py-1 text-sm transition-all hover:bg-background flex items-center justify-center ${
          theme === "system"
            ? "bg-background text-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
