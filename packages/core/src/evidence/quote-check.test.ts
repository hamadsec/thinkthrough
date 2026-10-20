import { describe, expect, it } from "vitest";
import { normalizeText, quoteCheck } from "./quote-check.js";

const SOURCE = 'The committee said: "Revenue grew by 12% in Q3—a record." Nothing else changed.';

describe("normalizeText", () => {
  it("applies NFKC, case-fold and whitespace collapse", () => {
    expect(normalizeText("  ﬁnal \n\t Answer ")).toBe("final answer");
  });
  it("strips soft hyphens and zero-width chars", () => {
    expect(normalizeText("re­ve​nue﻿")).toBe("revenue");
  });
});

describe("quoteCheck", () => {
  it("finds an exact match with position", () => {
    const r = quoteCheck("Revenue grew by 12%", SOURCE);
    expect(r.found).toBe(true);
    expect(r.position).toBe(normalizeText(SOURCE).indexOf("revenue grew by 12%"));
  });
  it("tolerates whitespace and line-break differences", () => {
    expect(quoteCheck("Revenue   grew\nby 12%", SOURCE).found).toBe(true);
  });
  it("treats curly and straight quotes as equal", () => {
    expect(quoteCheck("“Revenue grew", SOURCE).found).toBe(true);
    expect(quoteCheck("it's", "It’s fine").found).toBe(true);
  });
  it("treats em dash and hyphen as equal", () => {
    expect(quoteCheck("12% in Q3-a record", SOURCE).found).toBe(true);
  });
  it("ignores soft hyphens in the source", () => {
    expect(quoteCheck("revenue grew", "The rev­enue gr­ew fast").found).toBe(true);
  });
  it("is case-insensitive", () => {
    expect(quoteCheck("REVENUE GREW BY 12%", SOURCE).found).toBe(true);
  });
  it("reports low similarity when not found", () => {
    const r = quoteCheck("Profits collapsed entirely overnight", SOURCE);
    expect(r.found).toBe(false);
    expect(r.similarity).toBeLessThan(0.6);
    expect(r.position).toBeUndefined();
  });
  it("reports near miss >= 0.9", () => {
    const r = quoteCheck("Revenue grew by 12% in Q3-a recorx", SOURCE);
    expect(r.found).toBe(false);
    expect(r.similarity).toBeGreaterThanOrEqual(0.9);
  });
  it("rejects an empty quote", () => {
    expect(() => quoteCheck("  ​ ", SOURCE)).toThrow();
  });
});
