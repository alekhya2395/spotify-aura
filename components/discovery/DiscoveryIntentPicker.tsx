"use client";

import { Pill } from "@/components/ui/Pill";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { DISCOVERY_INTENTS } from "@/lib/utils/constants";

export function DiscoveryIntentPicker() {
  const discoveryIntent = useDiscoveryStore(
    (s) => s.session.context.discoveryIntent
  );
  const toggleDiscoveryIntent = useDiscoveryStore(
    (s) => s.toggleDiscoveryIntent
  );

  const isMaxed = discoveryIntent.length >= 5;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-spotify-text-subdued">
          Discovery Intent
        </h3>
        <span className="text-[10px] font-medium text-spotify-text-subdued">
          {discoveryIntent.length}/5
        </span>
      </div>
      <div className="aura-chip-grid">
        {DISCOVERY_INTENTS.map((intent) => {
          const selected = discoveryIntent.includes(intent);
          return (
            <Pill
              key={intent}
              label={intent}
              selected={selected}
              onClick={() => {
                if (!selected && isMaxed) return;
                toggleDiscoveryIntent(intent);
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
