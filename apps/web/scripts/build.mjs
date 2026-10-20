import { cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const src = fileURLToPath(new URL("public", root));
const dist = fileURLToPath(new URL("dist", root));

rmSync(dist, { recursive: true, force: true });
cpSync(src, dist, { recursive: true });
console.log(`copied ${src} -> ${dist}`);
