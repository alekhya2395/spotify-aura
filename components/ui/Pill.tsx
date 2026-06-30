"use client";

import { cn } from "@/lib/utils/cn";

export const chipBaseClass =
  "flex items-center justify-center w-full h-[40px] px-1.5 text-[10px] font-medium rounded-full whitespace-nowrap";

interface PillProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Pill({ label, selected, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        chipBaseClass,
        "transition-all duration-150 active:scale-[0.96]",
        selected
          ? "bg-spotify-green text-black shadow-[0_2px_8px_rgba(29,185,84,0.25)]"
          : "bg-spotify-elevated text-spotify-text-secondary border border-white/[0.06] hover:bg-spotify-highlight hover:text-white hover:border-white/[0.1]"
      )}
    >
      {label}
    </button>
  );
}

export function ChipLabel({ label }: { label: string }) {
  return (
    <span
      className={cn(
        chipBaseClass,
        "bg-spotify-elevated text-spotify-text-secondary border border-white/[0.06]"
      )}
    >
      {label}
    </span>
  );
}
