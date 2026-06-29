"use client";

import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { Card } from "@/components/ui/Card";

export function ContextSummary() {
  const context = useDiscoveryStore((s) => s.session.context);

  const items: Array<{ label: string; value: string }> = [];

  if (context.mood) items.push({ label: "Mood", value: context.mood });
  if (context.activity) items.push({ label: "Activity", value: context.activity });
  if (context.discoveryIntent.length > 0)
    items.push({ label: "Intent", value: context.discoveryIntent.join(", ") });
  if (context.personalityTags.length > 0)
    items.push({ label: "Personality", value: context.personalityTags.join(", ") });
  if (context.preferredGenres.length > 0)
    items.push({ label: "Genres", value: context.preferredGenres.join(", ") });
  if (context.avoidArtists.length > 0)
    items.push({
      label: "Avoiding",
      value: context.avoidArtists.map((a) => a.name).join(", "),
    });

  if (items.length === 0) {
    return (
      <Card className="text-center py-4 border border-dashed border-white/[0.06]">
        <p className="text-[11px] text-spotify-text-subdued">
          Start selecting preferences below to build your context.
        </p>
      </Card>
    );
  }

  return (
    <Card elevated className="space-y-1.5 p-3">
      <h4 className="text-[9px] font-bold uppercase tracking-wider text-spotify-green">
        Your Context
      </h4>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex gap-2 text-[11px]">
            <span className="text-spotify-text-subdued min-w-[60px] font-medium">
              {item.label}
            </span>
            <span className="text-spotify-text-secondary truncate">
              {item.value}
            </span>
          </div>
        ))}
        <div className="flex gap-2 text-[11px] pt-1 border-t border-white/[0.04]">
          <span className="text-spotify-text-subdued min-w-[60px] font-medium">Energy</span>
          <span className="text-spotify-text-secondary">
            {Math.round(context.energy * 100)}%
          </span>
          <span className="text-spotify-text-subdued ml-3">Explore</span>
          <span className="text-spotify-text-secondary">
            {Math.round(context.exploration * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
}
