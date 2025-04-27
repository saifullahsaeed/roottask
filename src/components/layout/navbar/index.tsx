"use client";

import { Button } from "@/components/ui";
import { Bell } from "lucide-react";
import { ProfileDropdown } from "@/components/layout/navbar/ProfileDropdown";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex h-14 items-center px-4">
        {/* Left side - Logo */}
        <div className="absolute left-4 flex items-center">
          <h1 className="text-xl font-bold text-primary">RootTask</h1>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="absolute right-4 flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
