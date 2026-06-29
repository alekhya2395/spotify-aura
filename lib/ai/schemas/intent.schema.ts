import { z } from "zod/v4";

export const IntentSchema = z.object({
  mood: z.string(),
  activity: z.string().optional(),
  energyTarget: z.number().min(0).max(1),
  valenceTarget: z.number().min(0).max(1),
  danceabilityTarget: z.number().min(0).max(1).optional(),
  tempoRange: z.tuple([z.number(), z.number()]).optional(),
  seedGenres: z.array(z.string()).max(5),
  noveltyLevel: z.enum(["familiar", "adjacent", "exploratory", "left_field"]),
  avoidArtists: z.array(z.string()),
  avoidGenres: z.array(z.string()),
  rationale: z.string(),
});

export const DiscoveryOutputSchema = z.object({
  intent: IntentSchema,
  recommendedGenres: z.array(z.string()).min(1).max(10),
  strategy: z.string(),
  noveltyScore: z.number().min(0).max(1),
  diversityScore: z.number().min(0).max(1),
  explanation: z.string(),
});

export type IntentOutput = z.infer<typeof IntentSchema>;
export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;
