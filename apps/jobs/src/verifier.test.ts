import { describe, expect, it } from "vitest";
import { FakeGateway } from "./llm/fake-gateway.js";
import { verifyClaim } from "./verifier.js";

const base = {
  claim: "The Eiffel Tower is 330 metres tall",
  evidenceQuote: "The Eiffel Tower stands 330 metres tall.",
};

describe("verifyClaim", () => {
  it("returns entailed when the quote supports the claim", async () => {
    const gw = new FakeGateway([{ json: { verdict: "entailed" } }]);
    expect(await verifyClaim(gw, base)).toEqual({ verdict: "entailed" });
  });

  it("returns contradicted when the quote contradicts the claim", async () => {
    const gw = new FakeGateway([{ json: { verdict: "contradicted" } }]);
    expect(await verifyClaim(gw, base)).toEqual({ verdict: "contradicted" });
  });

  it("returns neutral when the quote neither supports nor contradicts the claim", async () => {
    const gw = new FakeGateway([{ json: { verdict: "neutral" } }]);
    const result = await verifyClaim(gw, base);
    expect(result).toEqual({ verdict: "neutral" });
    expect(result.error).toBeUndefined();
  });

  it("returns a neutral result with the error when the gateway call fails", async () => {
    const gw = new FakeGateway([]);
    const result = await verifyClaim(gw, base);
    expect(result.verdict).toBe("neutral");
    expect(result.error).toMatch(/FakeGateway script exhausted/);
  });

  it("returns a neutral result with the error when the response fails schema validation", async () => {
    const gw = new FakeGateway([{ json: { verdict: "bogus" } }]);
    const result = await verifyClaim(gw, base);
    expect(result.verdict).toBe("neutral");
    expect(result.error).toMatch(/failed schema validation/);
  });

  it("makes one independent call on the verifier model", async () => {
    const gw = new FakeGateway([{ json: { verdict: "entailed" } }]);
    await verifyClaim(gw, base);
    expect(gw.calls).toHaveLength(1);
    expect(gw.calls[0].model).toBe("verifier");
    expect(gw.calls[0].schema).toBeDefined();
    expect(gw.calls[0].messages[0].content).toContain(base.claim);
    expect(gw.calls[0].messages[0].content).toContain(base.evidenceQuote);
  });
});
