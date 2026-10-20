import { z } from "zod";

export const EntityKind = z.enum(["company", "product", "law", "market", "person", "other"]);
export type EntityKind = z.infer<typeof EntityKind>;

export const Entity = z.object({
  id: z.string().min(1),
  kind: EntityKind,
  name: z.string().min(1),
  externalIds: z.record(z.string(), z.string()).optional(),
});
export type Entity = z.infer<typeof Entity>;
