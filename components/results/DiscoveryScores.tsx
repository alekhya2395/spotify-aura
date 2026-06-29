"use client";

interface DiscoveryScoresProps {
  noveltyScore: number;
  diversityScore: number;
  energy: number;
}

export function DiscoveryScores({
  noveltyScore,
  diversityScore,
  energy,
}: DiscoveryScoresProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <ScoreBadge label="Novelty" value={noveltyScore} color="purple" />
      <ScoreBadge label="Diversity" value={diversityScore} color="blue" />
      <ScoreBadge label="Energy" value={energy} color="green" />
    </div>
  );
}

interface ScoreBadgeProps {
  label: string;
  value: number;
  color: "green" | "blue" | "purple";
}

function ScoreBadge({ label, value, color }: ScoreBadgeProps) {
  const percentage = Math.round(value * 100);

  const colorMap = {
    green: { text: "text-spotify-green", bar: "bg-spotify-green" },
    blue: { text: "text-blue-400", bar: "bg-blue-400" },
    purple: { text: "text-purple-400", bar: "bg-purple-400" },
  };

  const c = colorMap[color];

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-spotify-surface border border-white/[0.04]">
      <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-xl font-bold tabular-nums leading-none ${c.text}`}>
        {percentage}
        <span className="text-[11px] font-semibold text-white/30">%</span>
      </span>
      <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
