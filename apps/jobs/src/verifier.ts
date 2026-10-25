import type { Evidence, Finding } from "@thinkthrough/core";
import { z } from "zod";
import type { LlmGateway } from "./llm/gateway.js";

export const VerifierVerdict = z.enum(["entailed", "contradicted", "neutral"]);
export type VerifierVerdict = z.infer<typeof VerifierVerdict>;

const VerifierResponse = z.object({ verdict: VerifierVerdict });

export interface VerifyClaimInput {
  /** The claim under test: the statement of a finding (Finding.statement). */
  claim: z.infer<typeof Finding>["statement"];
  /** The quote the claim is judged against (Evidence.quote). */
  evidenceQuote: z.infer<typeof Evidence>["quote"];
}

export interface VerifierResult {
  verdict: VerifierVerdict;
  /** Present when the gateway call failed; verdict is then "neutral". */
  error?: string;
}

const SYSTEM_PROMPT = [
  "You are an independent verifier. Given a claim and an evidence quote,",
  "reply 'entailed' if the quote supports the claim, 'contradicted' if it",
  "contradicts the claim, or 'neutral' if it does neither. Judge only from",
  "the quote itself; do not use outside knowledge.",
].join(" ");

/** A verdict needs no prose, so bound the call. */
const MAX_TOKENS = 64;

/**
 * Independent NLI pass: one claim judged against one evidence quote on its own
 * gateway call, separate from the extractor's. Never throws; a gateway failure
 * resolves to a neutral result with `error` set, so only a clean "entailed"
 * outcome can carry a claim gate.
 */
export async function verifyClaim(
  gateway: LlmGateway,
  input: VerifyClaimInput,
): Promise<VerifierResult> {
  try {
    const userMessage = `Claim: ${input.claim}\n\nEvidence quote: ${input.evidenceQuote}`;
    const result = await gateway.complete({
      model: "verifier",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      schema: VerifierResponse,
      maxTokens: MAX_TOKENS,
      cacheHint: "system",
    });
    const { verdict } = VerifierResponse.parse(result.parsed);
    return { verdict };
  } catch (error) {
    return {
      verdict: "neutral",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
