"use client";

import { cn } from "@/lib/utils/cn";

interface ConfidenceBarProps {
  label: string;
  value: number;
  color?: "green" | "blue" | "purple" | "amber" | "pink";
}

const colorStyles = {
  green: { bar: "bg-spotify-green", text: "text-spotify-green" },
  blue: { bar: "bg-blue-400", text: "text-blue-400" },
  purple: { bar: "bg-purple-400", text: "text-purple-400" },
  amber: { bar: "bg-amber-400", text: "text-amber-400" },
  pink: { bar: "bg-pink-400", text: "text-pink-400" },
};

export function ConfidenceBar({
  label,
  value,
  color = "green",
}: ConfidenceBarProps) {
  const percentage = Math.round(value * 100);
  const c = colorStyles[color];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-white/60">{label}</span>
        <span className={cn("text-[11px] font-bold tabular-nums", c.text)}>
          {percentage}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", c.bar)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
