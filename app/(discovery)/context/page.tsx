"use client";

import { MoodPicker } from "@/components/discovery/MoodPicker";
import { ActivitySelector } from "@/components/discovery/ActivitySelector";
import { EnergySlider } from "@/components/discovery/EnergySlider";
import { ExplorationSlider } from "@/components/discovery/ExplorationSlider";
import { DiscoveryIntentPicker } from "@/components/discovery/DiscoveryIntentPicker";
import { PersonalityPicker } from "@/components/discovery/PersonalityPicker";
import { AvoidArtistInput } from "@/components/discovery/AvoidArtistInput";
import { GenrePicker } from "@/components/discovery/GenrePicker";
import { ContextSummary } from "@/components/discovery/ContextSummary";
import { StartDiscoveryButton } from "@/components/discovery/StartDiscoveryButton";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export default function ContextPage() {
  const isHydrated = useDiscoveryStore((s) => s.isHydrated);
  const resetContext = useDiscoveryStore((s) => s.resetContext);

  if (!isHydrated) {
    return <ContextSkeleton />;
  }

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <section className="space-y-0.5 pt-1">
        <h2 className="text-[18px] font-bold text-white">Preferences</h2>
        <p className="text-[12px] text-spotify-text-secondary">
          Fine-tune what Aura discovers for you.
        </p>
      </section>

      {/* Context Summary Card */}
      <ContextSummary />

      {/* Mood */}
      <MoodPicker />

      {/* Activity */}
      <ActivitySelector />

      {/* Sliders */}
      <section className="space-y-4">
        <EnergySlider />
        <ExplorationSlider />
      </section>

      {/* Discovery Intent */}
      <DiscoveryIntentPicker />

      {/* Personality */}
      <PersonalityPicker />

      {/* Preferred Genres */}
      <GenrePicker />

      {/* Avoid Artists */}
      <AvoidArtistInput />

      {/* Actions */}
      <section className="space-y-2.5 pt-2">
        <StartDiscoveryButton />
        <button
          onClick={resetContext}
          className="w-full text-center text-[11px] font-medium text-spotify-text-subdued hover:text-spotify-text-secondary transition-colors py-2"
        >
          Reset all preferences
        </button>
      </section>
    </div>
  );
}

function ContextSkeleton() {
  return (
    <div className="space-y-6 pt-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-20 bg-spotify-elevated rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, j) => (
              <div
                key={j}
                className="h-8 w-20 bg-spotify-elevated rounded-pill animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
