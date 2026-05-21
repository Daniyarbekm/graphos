"use client";

import { AppSidebar } from "@/widgets/app-sidebar";
import { AppToolbar } from "@/widgets/app-toolbar";
import { GraphViewport } from "@/widgets/graph-viewport";

export function AppShell() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background transition-theme">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppToolbar />
        <GraphViewport />
      </div>
    </div>
  );
}
