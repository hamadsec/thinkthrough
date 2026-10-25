import { describe, expect, it } from "vitest";
import { loadClaimFixtures } from "./claim-fixtures.js";
import { CLAIMS_V0 } from "./claims-v0.js";

const valid = { id: "c1", claim: "a claim", sourceExcerpt: "a source", expectedLabel: "supported" };

describe("loadClaimFixtures", () => {
  it("loads the shipped v0 fixture file", () => {
    const fixtures = loadClaimFixtures(CLAIMS_V0);
    expect(fixtures.length).toBeGreaterThanOrEqual(1);
    expect(new Set(fixtures.map((f) => f.id)).size).toBe(fixtures.length);
  });

  it("covers all four labels in the shipped file", () => {
    const labels = new Set(loadClaimFixtures(CLAIMS_V0).map((f) => f.expectedLabel));
    expect(labels).toEqual(new Set(["supported", "contradicted", "insufficient", "unverified"]));
  });

  it("loads a valid fixture file", () => {
    expect(loadClaimFixtures({ fixtures: [valid] })).toEqual([valid]);
  });

  it("rejects non-object input", () => {
    expect(() => loadClaimFixtures("nope")).toThrow(/Invalid claim fixture file/);
  });

  it("rejects an empty fixtures array", () => {
    expect(() => loadClaimFixtures({ fixtures: [] })).toThrow(/Invalid claim fixture file/);
  });

  it("rejects a fixture with an empty claim", () => {
    expect(() => loadClaimFixtures({ fixtures: [{ ...valid, claim: "" }] })).toThrow(
      /Invalid claim fixture file/,
    );
  });

  it("rejects a fixture with an unknown expected label", () => {
    expect(() => loadClaimFixtures({ fixtures: [{ ...valid, expectedLabel: "maybe" }] })).toThrow(
      /Invalid claim fixture file/,
    );
  });

  it("rejects duplicate fixture ids with a readable error", () => {
    expect(() => loadClaimFixtures({ fixtures: [valid, valid] })).toThrow(
      /duplicate fixture id "c1"/,
    );
  });
});
