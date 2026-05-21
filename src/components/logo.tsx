import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M4 18 L12 6 L20 18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14 L16 14" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
      {!compact && (
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
      )}
    </div>
  );
}
