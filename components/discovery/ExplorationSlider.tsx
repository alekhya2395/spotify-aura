"use client";

import { Slider } from "@/components/ui/Slider";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export function ExplorationSlider() {
  const exploration = useDiscoveryStore((s) => s.session.context.exploration);
  const setExploration = useDiscoveryStore((s) => s.setExploration);

  return (
    <Slider
      value={exploration}
      onChange={setExploration}
      label="Exploration Level"
      leftLabel="Stay close"
      rightLabel="Surprise me"
    />
  );
}
