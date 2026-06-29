import {
  BookOpen,
  Car,
  Dumbbell,
  Footprints,
  Laptop,
  Moon,
  Sparkles,
  TrainFront,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ACTIVITY_ICON_MAP: Record<string, LucideIcon> = {
  Studying: BookOpen,
  "Working Out": Dumbbell,
  Driving: Car,
  Cooking: UtensilsCrossed,
  Walking: Footprints,
  Sleeping: Moon,
  Working: Laptop,
  Meditating: Sparkles,
  Commuting: TrainFront,
};

interface ActivityIconProps {
  label: string;
  selected?: boolean;
  className?: string;
}

export function ActivityIcon({ label, selected, className }: ActivityIconProps) {
  const Icon = ACTIVITY_ICON_MAP[label] ?? Sparkles;

  return (
    <Icon
      className={cn(
        "w-5 h-5 transition-colors",
        selected ? "text-spotify-green" : "text-spotify-text-secondary",
        className
      )}
      strokeWidth={selected ? 2.25 : 1.75}
      aria-hidden
    />
  );
}
