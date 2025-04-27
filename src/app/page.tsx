import Link from "next/link";
import { Button } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Manage your tasks with <span className="text-primary">RootTask</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
          A modern task management and collaboration platform that helps you
          organize your work, collaborate with your team, and get things done.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Link href="/dashboard">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link
            href="https://github.com/yourusername/root-task"
            className="text-sm font-semibold leading-6 text-foreground"
          >
            View on GitHub <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why choose RootTask?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Task Management</h3>
              <p className="text-muted-foreground">
                Organize and track your tasks with our intuitive card-based
                interface.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together with threaded discussions and real-time updates.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Flow-Based Interface</h3>
              <p className="text-muted-foreground">
                Visualize your workflow with our modern, flow-based task
                organization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
