import { CalendarDays, Clock, Sparkles } from "lucide-react";

interface ComingSoonProps {
  feature: string;
  description?: string;
}

export function ComingSoon({ feature, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-dot-pattern">
      <div className="relative max-w-md w-full">
        {/* Decorative elements */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition animate-tilt"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary opacity-[0.15] rounded-2xl blur-2xl group-hover:opacity-30 transition"></div>

        {/* Main content */}
        <div className="relative bg-card/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-border/50">
          {/* Icon container with floating animation */}
          <div className="flex justify-center mb-6 relative">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-md"></div>
              <Clock className="w-16 h-16 text-primary" strokeWidth={1.5} />
              <CalendarDays
                className="w-10 h-10 text-secondary absolute -bottom-2 -right-2"
                strokeWidth={1.5}
              />
              <Sparkles
                className="w-6 h-6 text-primary absolute -top-1 -right-3 animate-pulse"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {feature}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description ||
                "This feature is coming soon. Stay tuned for updates!"}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mt-8 space-y-2">
            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r from-primary to-secondary rounded-full animate-progress"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Development in progress...
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes tilt {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-tilt {
          animation: tilt 10s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .bg-dot-pattern {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgb(var(--muted) / 0.1) 1px,
            transparent 0
          );
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
}
