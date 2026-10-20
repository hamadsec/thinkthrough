import { describe, expect, it } from "vitest";
import { Entity } from "../schemas/entity.js";
import { resolveEntities } from "./resolve-entities.js";

describe("resolveEntities", () => {
  it("returns [] for empty input", () => {
    expect(resolveEntities([])).toEqual([]);
  });
  it("collapses exact duplicates", () => {
    const out = resolveEntities([
      { kind: "company", name: "Holvi" },
      { kind: "company", name: "Holvi" },
    ]);
    expect(out).toHaveLength(1);
    expect(Entity.parse(out[0])).toEqual(out[0]);
  });
  it("merges case/whitespace variants, keeping first-seen display form", () => {
    const out = resolveEntities([
      { kind: "company", name: "  Push   AI " },
      { kind: "company", name: "push ai" },
      { kind: "company", name: "PUSH\tAI" },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]?.name).toBe("Push AI");
  });
  it("keeps distinct entities, including same name with different kind, in first-seen order", () => {
    const out = resolveEntities([
      { kind: "company", name: "Push.ai" },
      { kind: "company", name: "PushAI" },
      { kind: "product", name: "push.ai" },
    ]);
    expect(out.map((e) => e.name)).toEqual(["Push.ai", "PushAI", "push.ai"]);
    expect(new Set(out.map((e) => e.id)).size).toBe(3);
    for (const e of out) expect(Entity.safeParse(e).success).toBe(true);
  });
  it("merges externalIds across duplicates and drops blank names", () => {
    const out = resolveEntities([
      { kind: "company", name: "Acme", externalIds: { wikidata: "Q1" } },
      { kind: "company", name: "ACME", externalIds: { github: "acme", wikidata: "Q2" } },
      { kind: "company", name: "   " },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]?.externalIds).toEqual({ wikidata: "Q1", github: "acme" });
  });
  it("is deterministic and does not mutate input", () => {
    const input = [{ kind: "law" as const, name: "GDPR", externalIds: { a: "1" } }];
    expect(resolveEntities(input)).toEqual(resolveEntities(input));
    expect(input[0]?.externalIds).toEqual({ a: "1" });
  });
});
