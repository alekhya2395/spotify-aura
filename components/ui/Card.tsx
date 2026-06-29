import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-150",
        elevated
          ? "border-white/8 bg-spotify-elevated shadow-[0_8px_24px_rgba(0,0,0,0.24)] hover:border-white/12 hover:bg-spotify-highlight hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
          : "border-white/5 bg-spotify-surface shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:border-white/8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
