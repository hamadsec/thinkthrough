import { describe, expect, it } from "vitest";
import { clamp } from "./clamp.js";

describe("clamp", () => {
  it("returns n when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when n is below min", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("returns max when n is above max", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("returns n when equal to min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns n when equal to max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
