import Link from "next/link";
import { Button } from "@/components/ui";
import { CheckCircle, Users, ChartArea } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Manage your tasks with <span className="text-primary">RootTask</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
          A modern task management and collaboration platform that helps you
          organize your work, collaborate with your team, and get things done.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
          <Link href="/dashboard">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link
            href="https://github.com/saifullahsaeed/roottask"
            className="text-sm font-semibold leading-6 text-foreground hover:underline flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="#features"
            className="text-sm font-semibold leading-6 text-primary hover:underline"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Why choose RootTask?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 flex flex-col items-center text-center">
              <CheckCircle className="w-10 h-10 text-primary mb-2" />
              <h3 className="text-xl font-semibold">Task Management</h3>
              <p className="text-muted-foreground">
                Organize and track your tasks with our intuitive card-based
                interface.
              </p>
            </div>
            <div className="space-y-4 flex flex-col items-center text-center">
              <Users className="w-10 h-10 text-primary mb-2" />
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together with threaded discussions and real-time updates.
              </p>
            </div>
            <div className="space-y-4 flex flex-col items-center text-center">
              <ChartArea className="w-10 h-10 text-primary mb-2" />
              <h3 className="text-xl font-semibold">Flow-Based Interface</h3>
              <p className="text-muted-foreground">
                Visualize your workflow with our modern, flow-based task
                organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm bg-background border-t">
        &copy; {new Date().getFullYear()} RootTask. All rights reserved.
      </footer>
    </div>
  );
}
