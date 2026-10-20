import { z } from "zod";

export const Statement = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  version: z.number().int().min(1),
  text: z.string().min(1),
  createdAt: z.iso.datetime(),
});
export type Statement = z.infer<typeof Statement>;

export const CaseStatus = z.enum(["draft", "active", "decided", "archived"]);
export type CaseStatus = z.infer<typeof CaseStatus>;

export const Case = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  title: z.string().min(1),
  status: CaseStatus,
  statementIds: z.array(z.string()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Case = z.infer<typeof Case>;
