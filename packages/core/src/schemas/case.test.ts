import { describe, expect, it } from "vitest";
import { Case, Statement } from "./case.js";
import { Evidence } from "./evidence.js";

describe("Case", () => {
  it("round-trips a case with statements", () => {
    const statements = [
      { id: "s1", caseId: "c1", version: 1, text: "Should we enter market X?", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "s2", caseId: "c1", version: 2, text: "Should we enter market X in 2027?", createdAt: "2026-01-02T00:00:00.000Z" },
    ];
    const c = {
      id: "c1",
      workspaceId: "w1",
      title: "Market X",
      status: "active",
      statementIds: ["s1", "s2"],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    };
    const parsed = Case.parse(JSON.parse(JSON.stringify(c)));
    expect(parsed).toEqual(c);
    expect(statements.map((s) => Statement.parse(s))).toEqual(statements);
  });

  it("rejects statement version 0", () => {
    expect(Statement.safeParse({ id: "s", caseId: "c", version: 0, text: "t", createdAt: "2026-01-01T00:00:00Z" }).success).toBe(false);
  });
});

describe("Evidence", () => {
  const e = { id: "e1", tier: "A", title: "t", retrievedAt: "2026-01-01T00:00:00Z", quote: "q" };
  it("requires sourceUrl unless tier U", () => {
    expect(Evidence.safeParse(e).success).toBe(false);
    expect(Evidence.safeParse({ ...e, tier: "U" }).success).toBe(true);
    expect(Evidence.safeParse({ ...e, sourceUrl: "https://example.com" }).success).toBe(true);
  });
});
