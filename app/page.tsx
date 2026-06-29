"use client";

import { MoodPicker } from "@/components/discovery/MoodPicker";
import { ActivitySelector } from "@/components/discovery/ActivitySelector";
import { EnergySlider } from "@/components/discovery/EnergySlider";
import { ExplorationSlider } from "@/components/discovery/ExplorationSlider";
import { Button } from "@/components/ui/Button";
import { StartDiscoveryButton } from "@/components/discovery/StartDiscoveryButton";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import Link from "next/link";

export default function DiscoveryHome() {
  const isHydrated = useDiscoveryStore((s) => s.isHydrated);
  const mood = useDiscoveryStore((s) => s.session.context.mood);
  const activity = useDiscoveryStore((s) => s.session.context.activity);

  if (!isHydrated) {
    return <HomeSkeleton />;
  }

  return (
    <div className="space-y-5 pb-4">
      {/* Hero */}
      <section className="space-y-1 pt-1">
        <p className="text-[14px] font-semibold text-white">
          {getGreeting()} 👋
        </p>
        <h2 className="text-[20px] font-bold tracking-tight text-spotify-text-primary leading-tight">
          Ready to discover something new?
        </h2>
      </section>

      {/* Current selection badge */}
      {(mood || activity) && (
        <div className="inline-flex items-center gap-2 rounded-full border border-spotify-green/20 bg-spotify-elevated px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-spotify-green" />
          <p className="text-[11px] font-semibold text-spotify-text-secondary">
            {[mood, activity].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}

      {/* Mood Picker */}
      <MoodPicker />

      {/* Activity Selector */}
      <ActivitySelector />

      {/* Quick Sliders */}
      <section className="space-y-4 rounded-lg border border-white/[0.04] bg-spotify-surface p-4">
        <EnergySlider />
        <ExplorationSlider />
      </section>

      {/* Action Buttons */}
      <section className="space-y-2.5 pt-1">
        <StartDiscoveryButton />
        <Link href="/context">
          <Button variant="secondary" fullWidth size="md">
            Fine-tune preferences
          </Button>
        </Link>
      </section>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function HomeSkeleton() {
  return (
    <div className="space-y-7 pt-4">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-spotify-elevated rounded animate-pulse" />
        <div className="h-7 w-56 bg-spotify-elevated rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-12 bg-spotify-elevated rounded animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-spotify-elevated rounded-pill animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-spotify-elevated rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
