import { Entity, type EntityKind } from "../schemas/entity.js";

export interface EntityMention {
  name: string;
  kind: EntityKind;
  externalIds?: Record<string, string>;
}

/** Trim, collapse internal whitespace, and case-fold for comparison. */
export function entityKey(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Resolve raw mentions to a canonical, de-duplicated entity list.
 * Mentions with the same kind and normalized name are one entity; the first-seen
 * display form wins and order is first-seen. Ids are derived (`kind:key`), so the
 * result is deterministic. Blank mentions are dropped.
 */
export function resolveEntities(mentions: readonly EntityMention[]): Entity[] {
  const seen = new Map<string, Entity>();
  for (const m of mentions) {
    const key = entityKey(m.name);
    if (key === "") continue;
    const id = `${m.kind}:${key}`;
    if (seen.has(id)) continue;
    const display = m.name.trim().replace(/\s+/g, " ");
    seen.set(
      id,
      Entity.parse({
        id,
        kind: m.kind,
        name: display,
        ...(m.externalIds ? { externalIds: m.externalIds } : {}),
      }),
    );
  }
  return [...seen.values()];
}
