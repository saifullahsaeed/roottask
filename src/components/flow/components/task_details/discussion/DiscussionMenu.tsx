import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/";
import type { DiscussionMenuProps } from "./types";

export const DiscussionMenu = ({ onEdit, onDelete }: DiscussionMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-muted/50">
        <MoreVertical className="h-3 w-3" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-36">
      <DropdownMenuItem className="text-xs" onClick={onEdit}>
        <Edit className="h-3 w-3 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="text-xs text-destructive" onClick={onDelete}>
        <Trash2 className="h-3 w-3 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
