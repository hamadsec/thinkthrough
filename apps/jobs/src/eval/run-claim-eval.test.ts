import { CLAIMS_V0, loadClaimFixtures, runClaimEval } from "@thinkthrough/core";
import { describe, expect, it } from "vitest";
import { FakeGateway } from "../llm/fake-gateway.js";

/** Integration seam: the core eval runner against this app's FakeGateway. */
describe("runClaimEval against FakeGateway", () => {
  const fixtures = loadClaimFixtures(CLAIMS_V0);

  it("passes every fixture when the script returns the expected labels", async () => {
    const gateway = new FakeGateway(fixtures.map((f) => ({ json: f.expectedLabel })));
    const summary = await runClaimEval(fixtures, gateway);
    expect(summary.total).toBe(fixtures.length);
    expect(summary.passed).toBe(fixtures.length);
    expect(summary.failed).toBe(0);
    expect(summary.results.map((r) => r.id)).toEqual(fixtures.map((f) => f.id));
    expect(gateway.calls.every((c) => c.model === "verifier")).toBe(true);
  });

  it("is deterministic with FakeGateway", async () => {
    const run = () =>
      runClaimEval(fixtures, new FakeGateway(fixtures.map((f) => ({ json: f.expectedLabel }))));
    expect(await run()).toEqual(await run());
  });

  it("counts mismatches and gateway errors as failures", async () => {
    const two = fixtures.slice(0, 2);
    const gateway = new FakeGateway([{ json: "contradicted" }]);
    const summary = await runClaimEval(two, gateway);
    expect(summary.total).toBe(2);
    expect(summary.passed).toBe(0);
    expect(summary.failed).toBe(2);
    expect(summary.results[0]).toEqual({
      id: two[0].id,
      expected: two[0].expectedLabel,
      actual: "contradicted",
      passed: false,
    });
    expect(summary.results[1].actual).toBeNull();
    expect(summary.results[1].error).toMatch(/script exhausted/);
  });
});
