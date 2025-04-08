import { getInitials } from "@/utils/string/getinitials";

export default function AvatarInitials({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium ring-2 ring-background hover:scale-105 transition-transform cursor-pointer">
      {getInitials(name)}
    </div>
  );
}
