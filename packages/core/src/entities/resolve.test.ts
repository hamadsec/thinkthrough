import { describe, expect, it } from "vitest";
import { Entity } from "../schemas/entity.js";
import { resolveEntities } from "./resolve.js";

describe("resolveEntities", () => {
  it("returns an empty list for empty input", () => {
    expect(resolveEntities([])).toEqual([]);
  });

  it("de-duplicates exact duplicates", () => {
    const out = resolveEntities([
      { name: "Acme", kind: "company" },
      { name: "Acme", kind: "company" },
    ]);
    expect(out).toHaveLength(1);
  });

  it("merges case and whitespace variants, keeping first-seen display form", () => {
    const out = resolveEntities([
      { name: "  Acme   Corp ", kind: "company" },
      { name: "ACME corp", kind: "company" },
      { name: "acme\tCorp", kind: "company" },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]?.name).toBe("Acme Corp");
  });

  it("keeps distinct entities in first-seen order", () => {
    const out = resolveEntities([
      { name: "Beta", kind: "product" },
      { name: "Acme", kind: "company" },
      { name: "Acme", kind: "product" },
    ]);
    expect(out.map((e) => e.name)).toEqual(["Beta", "Acme", "Acme"]);
    expect(new Set(out.map((e) => e.id)).size).toBe(3);
  });

  it("drops blank mentions and is deterministic", () => {
    const input = [
      { name: "   ", kind: "other" as const },
      { name: "GDPR", kind: "law" as const },
    ];
    expect(resolveEntities(input)).toEqual(resolveEntities(input));
    expect(resolveEntities(input)).toHaveLength(1);
  });

  it("outputs parse against the Entity schema", () => {
    const out = resolveEntities([
      { name: "Acme", kind: "company", externalIds: { lei: "123" } },
      { name: "GDPR", kind: "law" },
    ]);
    for (const e of out) expect(Entity.safeParse(e).success).toBe(true);
    expect(out[0]?.externalIds).toEqual({ lei: "123" });
  });
});
