import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");

describe("built landing page", () => {
  it("contains the tagline", () => {
    expect(html).toContain("Think it through before you build it.");
  });

  it("has no external script tags", () => {
    expect(html).not.toMatch(/<script[^>]+src\s*=\s*["']?(https?:)?\/\//i);
  });

  it("has no script tags at all (no JS required)", () => {
    expect(html).not.toMatch(/<script/i);
  });

  it("links the waitlist via mailto", () => {
    expect(html).toMatch(/href="mailto:/);
  });
});
