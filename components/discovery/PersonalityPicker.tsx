"use client";

import { Pill } from "@/components/ui/Pill";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { PERSONALITY_TAGS } from "@/lib/utils/constants";

export function PersonalityPicker() {
  const personalityTags = useDiscoveryStore(
    (s) => s.session.context.personalityTags
  );
  const togglePersonalityTag = useDiscoveryStore(
    (s) => s.togglePersonalityTag
  );

  const isMaxed = personalityTags.length >= 5;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-spotify-text-subdued">
          Personality
        </h3>
        <span className="text-[10px] font-medium text-spotify-text-subdued">
          {personalityTags.length}/5
        </span>
      </div>
      <div className="aura-chip-grid">
        {PERSONALITY_TAGS.map((tag) => {
          const selected = personalityTags.includes(tag);
          return (
            <Pill
              key={tag}
              label={tag}
              selected={selected}
              onClick={() => {
                if (!selected && isMaxed) return;
                togglePersonalityTag(tag);
              }}
            />
          );
        })}
      </div>
      {isMaxed && (
        <p className="text-[10px] text-spotify-text-subdued">
          Maximum 5 selected. Deselect one to change.
        </p>
      )}
    </section>
  );
}
