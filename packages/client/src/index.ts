import type { components } from "./schema.js";

export type Health = components["schemas"]["Health"];
export type { components, paths } from "./schema.js";

export function createClient(baseUrl: string, fetchImpl: typeof fetch = fetch) {
  const root = baseUrl.replace(/\/+$/, "");
  return {
    async health(): Promise<Health> {
      const res = await fetchImpl(`${root}/v1/health`);
      if (!res.ok) throw new Error(`GET /v1/health failed: ${res.status}`);
      return (await res.json()) as Health;
    },
  };
}
