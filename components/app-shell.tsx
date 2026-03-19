"use client";

import { Navigation } from "@/components/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
