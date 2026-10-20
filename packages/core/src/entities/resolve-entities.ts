import { Entity, type EntityKind } from "../schemas/entity.js";

export interface EntityMention {
  kind: EntityKind;
  name: string;
  externalIds?: Record<string, string>;
}

/** Trim, collapse internal whitespace, case-fold. */
export function entityKey(name: string): string {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Canonical, de-duplicated entities. Mentions with the same kind and normalized
 * name are one entity; the first-seen display form wins. Blank names are dropped.
 * The id is derived (`kind:key`), so output is deterministic.
 */
export function resolveEntities(mentions: readonly EntityMention[]): Entity[] {
  const byKey = new Map<string, Entity>();
  for (const m of mentions) {
    const key = entityKey(m.name);
    if (key === "") continue;
    const id = `${m.kind}:${key}`;
    const existing = byKey.get(id);
    if (existing) {
      if (m.externalIds) {
        existing.externalIds = { ...m.externalIds, ...existing.externalIds };
      }
      continue;
    }
    const display = m.name.trim().replace(/\s+/g, " ");
    byKey.set(
      id,
      Entity.parse({
        id,
        kind: m.kind,
        name: display,
        ...(m.externalIds && { externalIds: { ...m.externalIds } }),
      }),
    );
  }
  return [...byKey.values()];
}
