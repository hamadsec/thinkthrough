import { describe, expect, it } from "vitest";
import { assertClaimGate, Finding } from "./finding.js";

const base = { id: "f1", verification: "unverified" as const, evidenceIds: [] as string[] };

describe("claim gate", () => {
  it("accepts a fact with evidence", () => {
    const f = { ...base, kind: "fact", statement: "Revenue was 10M", evidenceIds: ["e1"] };
    expect(Finding.safeParse(f).success).toBe(true);
    expect(() => assertClaimGate(Finding.parse(f))).not.toThrow();
  });

  it("rejects a fact without evidence", () => {
    const r = Finding.safeParse({
      ...base,
      kind: "fact",
      statement: "The company is based in Helsinki",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an estimate without a method", () => {
    const r = Finding.safeParse({
      ...base,
      kind: "estimate",
      statement: "Roughly 5 users",
      estimate: { inputs: ["a"], method: "" },
    });
    expect(r.success).toBe(false);
  });

  it("rejects an estimate with empty inputs", () => {
    const r = Finding.safeParse({
      ...base,
      kind: "estimate",
      statement: "Roughly many users",
      estimate: { inputs: [], method: "top-down" },
    });
    expect(r.success).toBe(false);
  });

  it("accepts a valid estimate", () => {
    const r = Finding.safeParse({
      ...base,
      kind: "estimate",
      statement: "About 5000 users",
      estimate: { inputs: ["TAM"], method: "top-down" },
    });
    expect(r.success).toBe(true);
  });

  it("rejects a numeric inference without evidence", () => {
    const r = Finding.safeParse({
      ...base,
      kind: "inference",
      statement: "Churn is likely above 5%",
    });
    expect(r.success).toBe(false);
  });

  it("accepts an unknown without evidence", () => {
    expect(
      Finding.safeParse({ ...base, kind: "unknown", statement: "Market size in 2030 is unknown" })
        .success,
    ).toBe(true);
  });

  it("assertClaimGate throws a readable error", () => {
    expect(() => assertClaimGate({ ...base, kind: "fact", statement: "x" })).toThrow(
      /Claim gate failed for finding "f1"/,
    );
  });
});
