// Imported by path (not as a dependency) so api -> client does not form a turbo cycle with openapi generation.

import { Case } from "@thinkthrough/core";
import { describe, expect, it } from "vitest";
import { createClient } from "../../../packages/client/src/index.js";
import { app } from "./app.js";

const post = (body: unknown) =>
  app.request("/v1/cases", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/v1/cases", () => {
  it("creates, lists, fetches and 404s", async () => {
    const created = await post({ workspaceId: "ws_1", title: "Should we ship?" });
    expect(created.status).toBe(201);
    const c = Case.parse(await created.json());
    expect(c.status).toBe("draft");

    const list = await app.request("/v1/cases");
    expect(list.status).toBe(200);
    const { items } = (await list.json()) as { items: unknown[] };
    expect(items.map((i) => Case.parse(i).id)).toContain(c.id);

    const got = await app.request(`/v1/cases/${c.id}`);
    expect(got.status).toBe(200);
    expect(Case.parse(await got.json())).toEqual(c);

    const missing = await app.request("/v1/cases/nope");
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({ error: "case not found" });
  });

  it("rejects an invalid create body with 400", async () => {
    const res = await post({ workspaceId: "ws_1" });
    expect(res.status).toBe(400);
  });

  it("documents the cases paths in the OpenAPI doc", async () => {
    const doc = (await (await app.request("/v1/openapi.json")).json()) as {
      paths: Record<string, unknown>;
    };
    expect(Object.keys(doc.paths)).toEqual(expect.arrayContaining(["/v1/cases", "/v1/cases/{id}"]));
  });
});

describe("generated client against the app", () => {
  it("calls the cases routes", async () => {
    const client = createClient("http://localhost", (input, init) =>
      app.request(new Request(String(input), init)),
    );
    const created = await client.createCase({ workspaceId: "ws_c", title: "Via client" });
    expect(created.title).toBe("Via client");
    expect((await client.listCases()).items.map((i) => i.id)).toContain(created.id);
    expect(await client.getCase(created.id)).toEqual(created);
    expect(await client.getCase("missing")).toBeNull();
  });
});
