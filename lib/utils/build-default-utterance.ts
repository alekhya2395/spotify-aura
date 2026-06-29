import type { DiscoveryContext } from "@/lib/utils/types";

export function buildDefaultUtterance(context: DiscoveryContext): string {
  const parts: string[] = [];

  if (context.mood) parts.push(`I'm feeling ${context.mood.toLowerCase()}`);
  if (context.activity) parts.push(`while ${context.activity.toLowerCase()}`);
  if (context.discoveryIntent.length > 0) {
    parts.push(`— I want to ${context.discoveryIntent[0].toLowerCase()}`);
  }
  if (context.personalityTags.length > 0) {
    parts.push(`with a ${context.personalityTags[0].toLowerCase()} vibe`);
  }
  if (context.preferredGenres.length > 0) {
    parts.push(`leaning toward ${context.preferredGenres.slice(0, 3).join(", ")}`);
  }

  if (parts.length === 0) return "Recommend me some music";
  return parts.join(" ");
}
