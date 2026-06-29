"use client";

interface AudioFeatureRadarProps {
  features: {
    energy: number;
    valence: number;
    danceability: number;
    acousticness: number;
    instrumentalness: number;
  };
}

export function AudioFeatureRadar({ features }: AudioFeatureRadarProps) {
  const items = [
    { label: "Energy", value: features.energy, color: "bg-green-500" },
    { label: "Valence", value: features.valence, color: "bg-blue-500" },
    { label: "Dance", value: features.danceability, color: "bg-purple-500" },
    { label: "Acoustic", value: features.acousticness, color: "bg-amber-500" },
    { label: "Instrumental", value: features.instrumentalness, color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-[10px] text-spotify-text-subdued w-20 text-right">
            {item.label}
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${item.color} transition-all duration-700 ease-out`}
              style={{ width: `${Math.round(item.value * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-spotify-text-subdued w-8">
            {item.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
