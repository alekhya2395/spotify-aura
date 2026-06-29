"use client";

import { cn } from "@/lib/utils/cn";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  label,
  leftLabel,
  rightLabel,
  className,
}: SliderProps) {
  const percentage = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label className="text-[13px] font-bold text-white">{label}</label>
          <span className="rounded-full bg-spotify-green/10 px-2 py-0.5 text-[10px] font-bold text-spotify-green">
            {percentage}%
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${percentage}%`}
        aria-label={label}
        className="aura-slider w-full"
        style={{
          background: `linear-gradient(to right, #1DB954 0%, #1ED760 ${percentage}%, #404040 ${percentage}%)`,
        }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between gap-3 text-[10px] font-medium">
          <span className="text-spotify-text-subdued">{leftLabel}</span>
          <span className="text-right text-spotify-text-subdued">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
