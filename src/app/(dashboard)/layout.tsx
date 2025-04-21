import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
