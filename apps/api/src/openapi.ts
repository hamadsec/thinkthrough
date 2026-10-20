import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "./app.js";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../../../packages/client/openapi.json");
const res = await app.request("/v1/openapi.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(await res.json(), null, 2) + "\n");
console.log(`wrote ${out}`);
