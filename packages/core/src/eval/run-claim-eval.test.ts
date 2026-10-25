import { describe, expect, it } from "vitest";
import { Verification } from "../schemas/finding.js";
import type { ClaimFixture } from "./claim-fixtures.js";
import type { EvalGateway, EvalGatewayRequest, EvalGatewayResult } from "./run-claim-eval.js";
import { runClaimEval } from "./run-claim-eval.js";

/** Minimal scripted gateway matching the runner's port, like the jobs FakeGateway. */
class ScriptedGateway implements EvalGateway {
  readonly requests: EvalGatewayRequest[] = [];
  #index = 0;

  constructor(private readonly responses: Array<Partial<EvalGatewayResult> | Error>) {}

  async complete(req: EvalGatewayRequest): Promise<EvalGatewayResult> {
    this.requests.push(req);
    const next = this.responses[this.#index++];
    if (next instanceof Error) throw next;
    return { text: next?.text ?? "", parsed: next?.parsed };
  }
}

const fixture = (id: string, expectedLabel: Verification, claim = `claim ${id}`): ClaimFixture => ({
  id,
  claim,
  sourceExcerpt: `source ${id}`,
  expectedLabel,
});

describe("runClaimEval", () => {
  it("returns an all-pass summary when every label matches", async () => {
    const fixtures = [fixture("a", "supported"), fixture("b", "contradicted")];
    const gw = new ScriptedGateway([{ parsed: "supported" }, { parsed: "contradicted" }]);
    const summary = await runClaimEval(fixtures, gw);
    expect(summary).toEqual({
      total: 2,
      passed: 2,
      failed: 0,
      results: [
        { id: "a", expected: "supported", actual: "supported", passed: true },
        { id: "b", expected: "contradicted", actual: "contradicted", passed: true },
      ],
    });
  });

  it("counts a label mismatch as failed with expected and actual recorded", async () => {
    const fixtures = [fixture("a", "supported"), fixture("b", "insufficient")];
    const gw = new ScriptedGateway([{ parsed: "contradicted" }, { parsed: "insufficient" }]);
    const summary = await runClaimEval(fixtures, gw);
    expect(summary).toEqual({
      total: 2,
      passed: 1,
      failed: 1,
      results: [
        { id: "a", expected: "supported", actual: "contradicted", passed: false },
        { id: "b", expected: "insufficient", actual: "insufficient", passed: true },
      ],
    });
  });

  it("counts a gateway error as failed without stopping the run", async () => {
    const fixtures = [fixture("a", "supported"), fixture("b", "contradicted")];
    const gw = new ScriptedGateway([new Error("boom"), { parsed: "contradicted" }]);
    const summary = await runClaimEval(fixtures, gw);
    expect(summary).toEqual({
      total: 2,
      passed: 1,
      failed: 1,
      results: [
        { id: "a", expected: "supported", actual: null, passed: false, error: "boom" },
        { id: "b", expected: "contradicted", actual: "contradicted", passed: true },
      ],
    });
  });

  it("counts a non-label gateway output as failed", async () => {
    const gw = new ScriptedGateway([{ parsed: "maybe" }]);
    const summary = await runClaimEval([fixture("a", "supported")], gw);
    expect(summary.failed).toBe(1);
    expect(summary.results[0].actual).toBeNull();
    expect(summary.results[0].error).toMatch(/invalid label for fixture "a"/);
  });

  it("sends one verifier request per fixture with claim and excerpt in the prompt", async () => {
    const fixtures = [
      fixture("a", "supported", "the claim text"),
      fixture("b", "insufficient"),
    ];
    const gw = new ScriptedGateway([{ parsed: "supported" }, { parsed: "insufficient" }]);
    await runClaimEval(fixtures, gw);
    expect(gw.requests).toHaveLength(2);
    const [first, second] = gw.requests;
    expect(first.model).toBe("verifier");
    expect(first.system).toBeDefined();
    expect(first.schema).toBe(Verification);
    expect(first.messages).toEqual([
      { role: "user", content: expect.stringContaining("the claim text") },
    ]);
    expect(second.messages[0]?.content).toContain("source b");
  });

  it("returns an empty summary for no fixtures", async () => {
    const summary = await runClaimEval([], new ScriptedGateway([]));
    expect(summary).toEqual({ total: 0, passed: 0, failed: 0, results: [] });
  });

  it("is deterministic: identical gateways produce identical summaries", async () => {
    const fixtures = [fixture("a", "supported"), fixture("b", "contradicted")];
    const script = [{ parsed: "supported" }, { parsed: "supported" }];
    const makeGateway = () => new ScriptedGateway(script);
    const first = await runClaimEval(fixtures, makeGateway());
    const second = await runClaimEval(fixtures, makeGateway());
    expect(first).toEqual(second);
  });
});
