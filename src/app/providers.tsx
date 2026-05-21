"use client";

import { TooltipProvider } from "@/components/ui/tooltip";

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Client-side providers aggregator.
 * Add React Query, etc. here as the app grows.
 */
export function Providers({ children }: ProvidersProps) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
