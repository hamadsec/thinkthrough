import type { components } from "./schema.js";

export type Health = components["schemas"]["Health"];
export type Case = components["schemas"]["Case"];
export type CreateCase = components["schemas"]["CreateCase"];
export type CaseList = components["schemas"]["CaseList"];
export type { components, paths } from "./schema.js";

export function createClient(baseUrl: string, fetchImpl: typeof fetch = fetch) {
  const root = baseUrl.replace(/\/+$/, "");
  return {
    async health(): Promise<Health> {
      const res = await fetchImpl(`${root}/v1/health`);
      if (!res.ok) throw new Error(`GET /v1/health failed: ${res.status}`);
      return (await res.json()) as Health;
    },
    async createCase(input: CreateCase): Promise<Case> {
      const res = await fetchImpl(`${root}/v1/cases`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.status !== 201) throw new Error(`POST /v1/cases failed: ${res.status}`);
      return (await res.json()) as Case;
    },
    async listCases(): Promise<CaseList> {
      const res = await fetchImpl(`${root}/v1/cases`);
      if (!res.ok) throw new Error(`GET /v1/cases failed: ${res.status}`);
      return (await res.json()) as CaseList;
    },
    /** Resolves to null when the case does not exist (404). */
    async getCase(id: string): Promise<Case | null> {
      const res = await fetchImpl(`${root}/v1/cases/${encodeURIComponent(id)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`GET /v1/cases/${id} failed: ${res.status}`);
      return (await res.json()) as Case;
    },
  };
}
