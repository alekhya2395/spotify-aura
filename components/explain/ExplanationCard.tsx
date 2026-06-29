"use client";

import { cn } from "@/lib/utils/cn";

interface ExplanationCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  accentColor?: "green" | "blue" | "purple" | "amber" | "pink";
}

const borderStyles = {
  green: "border-l-spotify-green",
  blue: "border-l-blue-400",
  purple: "border-l-purple-400",
  amber: "border-l-amber-400",
  pink: "border-l-pink-400",
};

const titleStyles = {
  green: "text-spotify-green",
  blue: "text-blue-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
  pink: "text-pink-400",
};

const badgeStyles = {
  green: "bg-spotify-green/10 text-spotify-green",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  amber: "bg-amber-500/10 text-amber-400",
  pink: "bg-pink-500/10 text-pink-400",
};

export function ExplanationCard({
  icon,
  title,
  content,
  accentColor = "green",
}: ExplanationCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.04] border-l-[3px] bg-spotify-surface p-3 space-y-2",
        borderStyles[accentColor]
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            badgeStyles[accentColor]
          )}
        >
          {icon}
        </span>
        <h3 className={cn("text-[13px] font-bold tracking-tight", titleStyles[accentColor])}>
          {title}
        </h3>
      </div>
      <p className="text-[12px] text-white/65 leading-relaxed">{content}</p>
    </div>
  );
}
