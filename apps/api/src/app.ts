import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { CORE_VERSION } from "@thinkthrough/core";

export const HealthSchema = z
  .object({
    status: z.literal("ok"),
    version: z.string(),
    time: z.iso.datetime(),
  })
  .openapi("Health");

const healthRoute = createRoute({
  method: "get",
  path: "/v1/health",
  responses: {
    200: {
      content: { "application/json": { schema: HealthSchema } },
      description: "Service is healthy",
    },
  },
});

export const openApiInfo = { title: "ThinkThrough API", version: "0.0.1" };

export const app = new OpenAPIHono();

app.openapi(healthRoute, (c) =>
  c.json({ status: "ok" as const, version: CORE_VERSION, time: new Date().toISOString() }, 200),
);

app.doc31("/v1/openapi.json", { openapi: "3.1.0", info: openApiInfo });
