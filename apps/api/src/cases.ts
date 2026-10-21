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

const json = <T extends z.ZodType>(schema: T) => ({ "application/json": { schema } });

const createCaseRoute = createRoute({
  method: "post",
  path: "/v1/cases",
  request: { body: { content: json(CreateCaseSchema), required: true } },
  responses: {
    201: { content: json(CaseSchema), description: "Case created" },
  },
});

const listCasesRoute = createRoute({
  method: "get",
  path: "/v1/cases",
  responses: {
    200: { content: json(CaseListSchema), description: "All cases" },
  },
});

const getCaseRoute = createRoute({
  method: "get",
  path: "/v1/cases/{id}",
  request: { params: z.object({ id: z.string().min(1) }) },
  responses: {
    200: { content: json(CaseSchema), description: "The case" },
    404: { content: json(ErrorSchema), description: "Case not found" },
  },
});

export function createCasesRouter() {
  const store = new Map<string, z.infer<typeof CaseSchema>>();
  const router = new OpenAPIHono();

  router.openapi(createCaseRoute, (c) => {
    const input = c.req.valid("json");
    const now = new Date().toISOString();
    const created = CaseSchema.parse({
      id: crypto.randomUUID(),
      workspaceId: input.workspaceId,
      title: input.title,
      status: "draft",
      statementIds: [],
      createdAt: now,
      updatedAt: now,
    });
    store.set(created.id, created);
    return c.json(created, 201);
  });

  router.openapi(listCasesRoute, (c) => c.json({ items: [...store.values()] }, 200));

  router.openapi(getCaseRoute, (c) => {
    const found = store.get(c.req.valid("param").id);
    if (!found) return c.json({ error: "case not found" }, 404);
    return c.json(found, 200);
  });

  return router;
}
