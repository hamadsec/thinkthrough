import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const spec = JSON.parse(readFileSync(new URL("../openapi.json", import.meta.url), "utf8")) as {
  paths: Record<string, { get?: { responses?: Record<string, { content?: unknown }> } }>;
};

describe("openapi.json contract", () => {
  it("documents GET /v1/health with a 200 response schema", () => {
    const ok = spec.paths["/v1/health"]?.get?.responses?.["200"];
    expect(ok).toBeDefined();
    expect(ok?.content).toMatchObject({
      "application/json": { schema: { $ref: "#/components/schemas/Health" } },
    });
  });
});
