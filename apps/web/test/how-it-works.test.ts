import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pagePath = new URL("../dist/how-it-works.html", import.meta.url);
const landing = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");

describe("built how-it-works page", () => {
  it("exists", () => {
    expect(existsSync(pagePath)).toBe(true);
  });

  const html = existsSync(pagePath) ? readFileSync(pagePath, "utf8") : "";

  it("has lang, title, description, one h1 and the shared stylesheet", () => {
    expect(html).toMatch(/<html lang="en"/);
    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta\s+name="description"/);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain('href="styles.css"');
  });

  it("has an ordered list of exactly 3 steps: Problem / Smallest thing / Evidence", () => {
    const list = html.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1] ?? "";
    expect(list.match(/<li>/g)).toHaveLength(3);
    const headings = [...list.matchAll(/<h3>([^<]+)<\/h3>/g)].map((m) => m[1]);
    expect(headings).toEqual(["Problem", "Smallest thing that solves it", "Evidence"]);
  });

  it("links back to the landing page and to its #waitlist", () => {
    expect(html).toContain('href="index.html"');
    expect(html).toContain('href="index.html#waitlist"');
  });

  it("has no script tags", () => {
    expect(html).not.toMatch(/<script/i);
  });
});

describe("landing page", () => {
  it("links to the how-it-works page with visible text", () => {
    expect(landing).toMatch(/<a[^>]+href="how-it-works.html"[^>]*>See how it works<\/a>/);
  });
});
