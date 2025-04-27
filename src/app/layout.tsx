import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeScript } from "@/lib/theme-script";
import { SessionProvider } from "@/providers/session-provider";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RootTask - Task Management & Collaboration Platform",
  description:
    "A modern task management and collaboration platform with card-based organization, threaded discussions, and flow-based interface.",
};

const mantineTheme = createTheme({
  fontFamily: "var(--font-geist-sans)",
  radius: {
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "16px",
    xl: "32px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  defaultRadius: "md",
  primaryColor: "primary",
  colors: {
    primary: [
      "hsl(var(--primary) / 0.1)", // 0
      "hsl(var(--primary) / 0.2)", // 1
      "hsl(var(--primary) / 0.3)", // 2
      "hsl(var(--primary) / 0.4)", // 3
      "hsl(var(--primary) / 0.5)", // 4
      "hsl(var(--primary))", // 5 - Default
      "hsl(var(--primary) / 0.7)", // 6
      "hsl(var(--primary) / 0.8)", // 7
      "hsl(var(--primary) / 0.9)", // 8
      "hsl(var(--primary))", // 9
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: ThemeScript(),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <SessionProvider>
            <ThemeProvider
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
            </ThemeProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
