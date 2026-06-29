"use client";

import { Pill } from "@/components/ui/Pill";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { GENRES } from "@/lib/utils/constants";

export function GenrePicker() {
  const preferredGenres = useDiscoveryStore(
    (s) => s.session.context.preferredGenres
  );
  const togglePreferredGenre = useDiscoveryStore(
    (s) => s.togglePreferredGenre
  );

  const isMaxed = preferredGenres.length >= 5;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-spotify-text-subdued">
          Preferred Genres
        </h3>
        <span className="text-[10px] font-medium text-spotify-text-subdued">
          {preferredGenres.length}/5
        </span>
      </div>
      <div className="aura-chip-grid">
        {GENRES.map((genre) => {
          const selected = preferredGenres.includes(genre);
          return (
            <Pill
              key={genre}
              label={genre}
              selected={selected}
              onClick={() => {
                if (!selected && isMaxed) return;
                togglePreferredGenre(genre);
              }}
            />
          );
        })}
      </div>
      {isMaxed && (
        <p className="text-[10px] text-spotify-text-subdued">
          Maximum 5 genres. Deselect one to change.
        </p>
      )}
    </section>
  );
}
