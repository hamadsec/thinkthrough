import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Case } from "@thinkthrough/core";

export const CaseSchema = Case.meta({ id: "Case" });

export const CreateCaseSchema = z
  .object({
    workspaceId: z.string().min(1),
    title: z.string().min(1),
  })
  .openapi("CreateCase");

export const CaseListSchema = z.object({ items: z.array(CaseSchema) }).openapi("CaseList");

export const ErrorSchema = z.object({ error: z.string() }).openapi("Error");

const createCaseRoute = createRoute({
  method: "post",
  path: "/v1/cases",
  request: {
    body: { content: { "application/json": { schema: CreateCaseSchema } }, required: true },
  },
  responses: {
    201: {
      content: { "application/json": { schema: CaseSchema } },
      description: "Case created",
    },
  },
});

const listCasesRoute = createRoute({
  method: "get",
  path: "/v1/cases",
  responses: {
    200: {
      content: { "application/json": { schema: CaseListSchema } },
      description: "All cases",
    },
  },
});

const getCaseRoute = createRoute({
  method: "get",
  path: "/v1/cases/{id}",
  request: { params: z.object({ id: z.string().min(1) }) },
  responses: {
    200: {
      content: { "application/json": { schema: CaseSchema } },
      description: "The case",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "No case with that id",
    },
  },
});

/** In-memory stub: state lives in the Map and resets on restart. */
export function createCasesApp(store: Map<string, Case> = new Map()) {
  const cases = new OpenAPIHono();

  cases.openapi(createCaseRoute, (c) => {
    const { workspaceId, title } = c.req.valid("json");
    const now = new Date().toISOString();
    const created = Case.parse({
      id: crypto.randomUUID(),
      workspaceId,
      title,
      status: "draft",
      statementIds: [],
      createdAt: now,
      updatedAt: now,
    });
    store.set(created.id, created);
    return c.json(created, 201);
  });

  cases.openapi(listCasesRoute, (c) => c.json({ items: [...store.values()] }, 200));

  cases.openapi(getCaseRoute, (c) => {
    const found = store.get(c.req.valid("param").id);
    if (!found) return c.json({ error: "case not found" }, 404);
    return c.json(found, 200);
  });

  return cases;
}
