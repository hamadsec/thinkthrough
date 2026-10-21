import { describe, expect, it } from "vitest";
import { app } from "./app.js";
import { CaseSchema } from "./cases.js";

const post = (body: unknown) =>
  app.request("/v1/cases", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/v1/cases", () => {
  it("creates, lists, fetches and 404s", async () => {
    const res = await post({ workspaceId: "ws1", title: "Should we hire?" });
    expect(res.status).toBe(201);
    const created = CaseSchema.parse(await res.json());
    expect(created).toMatchObject({
      workspaceId: "ws1",
      title: "Should we hire?",
      status: "draft",
    });

    const list = await app.request("/v1/cases");
    expect(list.status).toBe(200);
    const { items } = (await list.json()) as { items: unknown[] };
    expect(items.map((i) => CaseSchema.parse(i).id)).toContain(created.id);

    const got = await app.request(`/v1/cases/${created.id}`);
    expect(got.status).toBe(200);
    expect(CaseSchema.parse(await got.json())).toEqual(created);

    const missing = await app.request("/v1/cases/nope");
    expect(missing.status).toBe(404);
  });

  it("rejects an invalid body", async () => {
    const res = await post({ workspaceId: "ws1" });
    expect(res.status).toBe(400);
  });

  it("documents the cases paths in the OpenAPI doc", async () => {
    const doc = (await (await app.request("/v1/openapi.json")).json()) as {
      paths: Record<string, unknown>;
    };
    expect(Object.keys(doc.paths)).toEqual(expect.arrayContaining(["/v1/cases", "/v1/cases/{id}"]));
  });
});
