import Link from "next/link";
import { Button } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Organize your ideas with{" "}
          <span className="text-primary">Card Tree</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
          A modern card-based organization platform that helps you structure
          your thoughts and ideas. Built with Next.js and Tailwind CSS.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Link href="/dashboard">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link
            href="https://github.com/yourusername/card-tree"
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
            Why choose Card Tree?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Visual Organization</h3>
              <p className="text-muted-foreground">
                Create beautiful, interconnected card trees to organize your
                thoughts and ideas.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Flexible Structure</h3>
              <p className="text-muted-foreground">
                Build any type of hierarchy or relationship between your cards.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Intuitive Interface</h3>
              <p className="text-muted-foreground">
                Drag, drop, and connect cards with ease in our modern interface.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
