import { z } from "zod/v4";

export const ExplanationSchema = z.object({
  moodMatch: z.string(),
  contextMatch: z.string(),
  noveltyLevel: z.string(),
  rationale: z.string(),
  energyMatch: z.string(),
  discoveryIntent: z.string(),
  confidenceScores: z.object({
    mood: z.number().min(0).max(1),
    context: z.number().min(0).max(1),
    energy: z.number().min(0).max(1),
    novelty: z.number().min(0).max(1),
    diversity: z.number().min(0).max(1),
  }),
});

export type ExplanationOutput = z.infer<typeof ExplanationSchema>;
