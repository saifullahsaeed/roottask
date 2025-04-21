"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { User, Settings, Activity, LogOut, Loader2 } from "lucide-react";
import { ThemeSwitcher } from "@/components/common";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { User as UserType } from "next-auth";
import AvatarInitials from "@/components/ui/avatar_intitals/AvatarInitials";

interface UserWithImage extends UserType {
  image?: string | null;
}

export function ProfileDropdown() {
  const { data: session, status } = useSession();
  const user = session?.user as UserWithImage | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {status === "loading" ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50"
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User avatar"}
                fill
                className="rounded-full object-cover"
                sizes="40px"
              />
            ) : (
              <AvatarInitials
                name={user?.name || "User"}
                size="md"
                variant="default"
                className="h-full w-full"
              />
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Activity className="mr-2 h-4 w-4" />
          <span>Activity</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <ThemeSwitcher />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
