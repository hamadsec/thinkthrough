import { describe, expect, it } from "vitest";
import { CORE_VERSION } from "@thinkthrough/core";
import { app, HealthSchema } from "./app.js";

describe("api", () => {
  it("GET /v1/health matches the schema", async () => {
    const res = await app.request("/v1/health");
    expect(res.status).toBe(200);
    const body = HealthSchema.parse(await res.json());
    expect(body.version).toBe(CORE_VERSION);
  });

  it("GET /v1/openapi.json lists /v1/health", async () => {
    const res = await app.request("/v1/openapi.json");
    const doc = (await res.json()) as { openapi: string; info: { title: string; version: string }; paths: Record<string, unknown> };
    expect(doc.openapi).toMatch(/^3\.1/);
    expect(doc.info).toEqual({ title: "ThinkThrough API", version: "0.0.1" });
    expect(Object.keys(doc.paths)).toContain("/v1/health");
  });
});
