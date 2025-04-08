import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
  size?: number;
  color?: string;
  message?: string;
}

export const LoaderAnimated = ({
  className,
  size,
  color,
  message,
}: LoaderProps) => {
  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center ${className}`}
    >
      <Loader2 className={`h-${size} w-${size} animate-spin ${color}`} />
      {message && <span> {message} </span>}
    </div>
  );
};
