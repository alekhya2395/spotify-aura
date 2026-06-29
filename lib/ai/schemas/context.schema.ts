import { z } from "zod/v4";

export const AvoidArtistSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const DiscoveryContextSchema = z.object({
  mood: z.string().nullable(),
  activity: z.string().nullable(),
  energy: z.number().min(0).max(1),
  exploration: z.number().min(0).max(1),
  discoveryIntent: z.array(z.string()).max(5),
  personalityTags: z.array(z.string()).max(5),
  avoidArtists: z.array(AvoidArtistSchema).max(10),
  preferredGenres: z.array(z.string()).max(5),
  freeText: z.string().max(1000),
});

export type ValidatedDiscoveryContext = z.infer<typeof DiscoveryContextSchema>;

export function validateContext(data: unknown) {
  return DiscoveryContextSchema.safeParse(data);
}
