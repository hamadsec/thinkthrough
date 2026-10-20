import { z } from "zod";

export const FindingKind = z.enum([
  "fact",
  "inference",
  "estimate",
  "unknown",
  "general_knowledge",
]);
export type FindingKind = z.infer<typeof FindingKind>;

export const Verification = z.enum(["supported", "contradicted", "insufficient", "unverified"]);
export type Verification = z.infer<typeof Verification>;

const FindingShape = z.object({
  id: z.string().min(1),
  kind: FindingKind,
  statement: z.string().min(1),
  evidenceIds: z.array(z.string()),
  estimate: z.object({ inputs: z.array(z.string()), method: z.string() }).optional(),
  verification: Verification,
  entityIds: z.array(z.string()).optional(),
});

type FindingInput = z.infer<typeof FindingShape>;

/** Returns the claim-gate violations for a finding; empty when it passes. */
export function claimGateIssues(f: FindingInput): string[] {
  const issues: string[] = [];
  const hasEvidence = f.evidenceIds.length > 0;
  if (f.kind === "fact" && !hasEvidence) {
    issues.push("a fact must reference at least one evidenceId");
  }
  if (f.kind === "estimate") {
    if (!f.estimate || f.estimate.inputs.length === 0) {
      issues.push("an estimate must have non-empty estimate.inputs");
    }
    if (!f.estimate || f.estimate.method.trim() === "") {
      issues.push("an estimate must have estimate.method");
    }
  }
  if ((f.kind === "fact" || f.kind === "inference") && /\d/.test(f.statement) && !hasEvidence) {
    issues.push(`a ${f.kind} containing a number must reference evidence`);
  }
  return issues;
}

export const Finding = FindingShape.superRefine((f, ctx) => {
  for (const message of claimGateIssues(f)) ctx.addIssue({ code: "custom", message });
});
export type Finding = z.infer<typeof Finding>;

/** Throws a readable error if the finding violates the claim gate. */
export function assertClaimGate(finding: FindingInput): void {
  const issues = claimGateIssues(finding);
  if (issues.length > 0) {
    throw new Error(`Claim gate failed for finding "${finding.id}": ${issues.join("; ")}`);
  }
}
