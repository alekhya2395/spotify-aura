"use client";

import { Pill } from "@/components/ui/Pill";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { MOODS } from "@/lib/utils/constants";

export function MoodPicker() {
  const mood = useDiscoveryStore((s) => s.session.context.mood);
  const setMood = useDiscoveryStore((s) => s.setMood);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-spotify-text-subdued">
          Mood
        </h3>
        {mood && (
          <button
            onClick={() => setMood(null)}
            className="text-[10px] font-semibold text-spotify-green hover:text-spotify-green-light transition-colors min-h-[36px] px-2 -mr-2"
          >
            Clear
          </button>
        )}
      </div>
      <div className="aura-chip-grid">
        {MOODS.map((m) => (
          <Pill
            key={m}
            label={m}
            selected={mood === m}
            onClick={() => setMood(mood === m ? null : m)}
          />
        ))}
      </div>
    </section>
  );
}
