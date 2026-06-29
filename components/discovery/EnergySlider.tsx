"use client";

import { Slider } from "@/components/ui/Slider";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export function EnergySlider() {
  const energy = useDiscoveryStore((s) => s.session.context.energy);
  const setEnergy = useDiscoveryStore((s) => s.setEnergy);

  return (
    <Slider
      value={energy}
      onChange={setEnergy}
      label="Energy Level"
      leftLabel="Low & chill"
      rightLabel="High & intense"
    />
  );
}
