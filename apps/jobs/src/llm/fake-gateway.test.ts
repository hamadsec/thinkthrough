import { Verification } from "@thinkthrough/core";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { FakeGateway } from "./fake-gateway.js";
import type { LlmRequest } from "./gateway.js";

const req = (over: Partial<LlmRequest> = {}): LlmRequest => ({
  model: "fast",
  messages: [{ role: "user", content: "hi" }],
  ...over,
});

describe("FakeGateway", () => {
  it("returns scripted results in order with defaults", async () => {
    const gw = new FakeGateway([
      { text: "one" },
      {
        text: "two",
        model: "m",
        provider: "p",
        usage: { inputTokens: 1, outputTokens: 2, cachedInputTokens: 3 },
      },
    ]);
    expect(await gw.complete(req())).toEqual({
      text: "one",
      parsed: undefined,
      usage: { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 },
      model: "fake-fast",
      provider: "fake",
    });
    const second = await gw.complete(req({ model: "strong" }));
    expect(second.text).toBe("two");
    expect(second.usage.cachedInputTokens).toBe(3);
    expect(second.provider).toBe("p");
    expect(gw.remaining).toBe(0);
  });

  it("records calls", async () => {
    const gw = new FakeGateway([{ text: "a" }, { text: "b" }]);
    const r1 = req({ system: "sys", cacheHint: "system" });
    const r2 = req({ model: "verifier", maxTokens: 10 });
    await gw.complete(r1);
    await gw.complete(r2);
    expect(gw.calls).toEqual([r1, r2]);
  });

  it("validates parsed output against a core Zod schema", async () => {
    const gw = new FakeGateway([{ json: "supported" }]);
    const res = await gw.complete(req({ schema: Verification }));
    expect(res.parsed).toBe("supported");
    expect(res.text).toBe(JSON.stringify("supported"));
  });

  it("rejects output that fails the schema", async () => {
    const gw = new FakeGateway([{ json: "bogus" }]);
    await expect(gw.complete(req({ schema: Verification }))).rejects.toThrow(
      /failed schema validation/,
    );
  });

  it("falls back to parsing text, or preset parsed, when schema is given", async () => {
    const schema = z.object({ n: z.number() });
    const gw = new FakeGateway([
      { text: '{"n":1}' },
      { text: "x", parsed: { n: 2 } },
      { text: "nope" },
    ]);
    expect((await gw.complete(req({ schema }))).parsed).toEqual({ n: 1 });
    expect((await gw.complete(req({ schema }))).parsed).toEqual({ n: 2 });
    await expect(gw.complete(req({ schema }))).rejects.toThrow(/schema validation/);
  });

  it("fails clearly when the script is exhausted", async () => {
    const gw = new FakeGateway([{ text: "only" }]);
    await gw.complete(req());
    await expect(gw.complete(req())).rejects.toThrow(
      "FakeGateway script exhausted: call #2 but only 1 response(s) scripted",
    );
    expect(gw.calls).toHaveLength(2);
  });
});
