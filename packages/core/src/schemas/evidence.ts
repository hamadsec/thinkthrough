import { z } from "zod";

/** A primary/official, B reputable secondary, C weak/unknown, U user-provided. */
export const EvidenceTier = z.enum(["A", "B", "C", "U"]);
export type EvidenceTier = z.infer<typeof EvidenceTier>;

export const Evidence = z
  .object({
    id: z.string().min(1),
    tier: EvidenceTier,
    sourceUrl: z.url().optional(),
    title: z.string(),
    retrievedAt: z.iso.datetime(),
    quote: z.string().min(1),
    publishedAt: z.iso.datetime().optional(),
    conflictOfInterest: z.boolean().optional(),
  })
  .refine((e) => e.tier === "U" || e.sourceUrl !== undefined, {
    message: "sourceUrl is required unless tier is U (user-provided)",
    path: ["sourceUrl"],
  });
export type Evidence = z.infer<typeof Evidence>;
