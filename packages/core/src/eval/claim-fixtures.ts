import { z } from "zod";
import { Verification } from "../schemas/finding.js";

/** One labelled claim: what to verify, against what, and the label the verifier must produce. */
export const ClaimFixture = z.object({
  id: z.string().min(1),
  claim: z.string().min(1),
  sourceExcerpt: z.string().min(1),
  expectedLabel: Verification,
});
export type ClaimFixture = z.infer<typeof ClaimFixture>;

const ClaimFixtureFileShape = z.object({
  fixtures: z.array(ClaimFixture).min(1),
});

export const ClaimFixtureFile = ClaimFixtureFileShape.superRefine((file, ctx) => {
  const seen = new Set<string>();
  for (const fixture of file.fixtures) {
    if (seen.has(fixture.id)) {
      ctx.addIssue({ code: "custom", message: `duplicate fixture id "${fixture.id}"` });
    }
    seen.add(fixture.id);
  }
});
export type ClaimFixtureFile = z.infer<typeof ClaimFixtureFile>;

/** Validates raw fixture data (JSON object, parsed file, literal) and returns the fixtures. */
export function loadClaimFixtures(input: unknown): ClaimFixture[] {
  const checked = ClaimFixtureFile.safeParse(input);
  if (!checked.success) {
    const issues = checked.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid claim fixture file: ${issues}`);
  }
  return checked.data.fixtures;
}
