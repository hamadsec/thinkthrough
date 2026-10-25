import type { ZodType } from "zod";
import { Verification } from "../schemas/finding.js";
import type { ClaimFixture } from "./claim-fixtures.js";

/**
 * The gateway shape the eval runner needs. Structurally satisfied by the jobs app's
 * LlmGateway implementations (FakeGateway today), so the runner never imports them.
 */
export interface EvalGatewayRequest {
  model: string;
  system?: string;
  messages: { role: "user" | "assistant"; content: string }[];
  /** When set, the gateway must return `parsed` validated against this schema. */
  schema?: ZodType;
  maxTokens?: number;
}

export interface EvalGatewayResult {
  text: string;
  parsed?: unknown;
}

export interface EvalGateway {
  complete(req: EvalGatewayRequest): Promise<EvalGatewayResult>;
}

export interface ClaimEvalResult {
  id: string;
  expected: Verification;
  actual: Verification | null;
  passed: boolean;
  /** Set when the gateway call or its output failed; such fixtures count as failed. */
  error?: string;
}

export interface ClaimEvalSummary {
  total: number;
  passed: number;
  failed: number;
  results: ClaimEvalResult[];
}

const VERIFIER_SYSTEM_PROMPT = [
  "You are an independent verifier: given one claim and one source excerpt,",
  "label the claim against that excerpt with exactly one of:",
  "supported: the excerpt states or directly implies the claim.",
  "contradicted: the excerpt states the opposite.",
  "insufficient: the excerpt does not decide the claim.",
  "unverified: the excerpt is not a usable source for the claim.",
  "Abstain rather than guess: when in doubt, prefer insufficient or unverified.",
].join("\n");

function userPrompt(fixture: ClaimFixture): string {
  return `Claim: ${fixture.claim}\n\nSource excerpt:\n${fixture.sourceExcerpt}\n\nLabel the claim.`;
}

/** Runs each fixture through the gateway and reports pass/fail counts per fixture. */
export async function runClaimEval(
  fixtures: ClaimFixture[],
  gateway: EvalGateway,
): Promise<ClaimEvalSummary> {
  const results: ClaimEvalResult[] = [];
  for (const fixture of fixtures) {
    try {
      const res = await gateway.complete({
        model: "verifier",
        system: VERIFIER_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt(fixture) }],
        schema: Verification,
      });
      const label = Verification.safeParse(res.parsed);
      if (!label.success) {
        throw new Error(`gateway returned an invalid label for fixture "${fixture.id}"`);
      }
      results.push({
        id: fixture.id,
        expected: fixture.expectedLabel,
        actual: label.data,
        passed: label.data === fixture.expectedLabel,
      });
    } catch (err) {
      results.push({
        id: fixture.id,
        expected: fixture.expectedLabel,
        actual: null,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  const passed = results.filter((r) => r.passed).length;
  return { total: results.length, passed, failed: results.length - passed, results };
}
