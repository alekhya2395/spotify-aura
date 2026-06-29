"use client";

import { cn } from "@/lib/utils/cn";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { ACTIVITIES } from "@/lib/utils/constants";
import { ActivityIcon } from "@/components/discovery/ActivityIcon";

export function ActivitySelector() {
  const activity = useDiscoveryStore((s) => s.session.context.activity);
  const setActivity = useDiscoveryStore((s) => s.setActivity);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-spotify-text-subdued">
          Activity
        </h3>
        {activity && (
          <button
            onClick={() => setActivity(null)}
            className="text-[10px] font-semibold text-spotify-green hover:text-spotify-green-light transition-colors min-h-[36px] px-2 -mr-2"
          >
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ACTIVITIES.map((a) => {
          const isSelected = activity === a.label;

          return (
            <button
              key={a.label}
              onClick={() => setActivity(isSelected ? null : a.label)}
              className={cn(
                "flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all duration-150 active:scale-[0.97]",
                isSelected
                  ? "border-spotify-green/40 bg-spotify-green/[0.08] shadow-[0_0_0_1px_rgba(29,185,84,0.2)]"
                  : "border-white/[0.06] bg-spotify-surface hover:border-white/[0.1] hover:bg-spotify-elevated/60"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  isSelected ? "bg-spotify-green/15" : "bg-white/[0.04]"
                )}
              >
                <ActivityIcon label={a.label} selected={isSelected} />
              </div>
              <span
                className={cn(
                  "text-[10px] leading-tight",
                  isSelected
                    ? "font-bold text-white"
                    : "font-medium text-spotify-text-secondary"
                )}
              >
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
