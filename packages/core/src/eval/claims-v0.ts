/**
 * Eval harness v0 labelled-claim set. Data, not code: validate with loadClaimFixtures before use.
 * The 50-claim set from the phase-2 plan is a later content task.
 */
export const CLAIMS_V0: unknown = {
  fixtures: [
    {
      id: "c-001",
      claim: "Nimbus says its waitlist reached 2,000 sign-ups in March.",
      sourceExcerpt: "Nimbus product update, March: our waitlist just crossed 2,000 sign-ups.",
      expectedLabel: "supported",
    },
    {
      id: "c-002",
      claim: "Nimbus charges a monthly subscription fee.",
      sourceExcerpt: "Nimbus pricing page: free to use, no subscription, no monthly fee.",
      expectedLabel: "contradicted",
    },
    {
      id: "c-003",
      claim: "Nimbus will launch a mobile app in June.",
      sourceExcerpt: "Nimbus product update, March: our waitlist just crossed 2,000 sign-ups.",
      expectedLabel: "insufficient",
    },
    {
      id: "c-004",
      claim: "Fewer than 3% of Nimbus paying users churn each month.",
      sourceExcerpt: "Retrieval failed: the source page could not be fetched (HTTP 404).",
      expectedLabel: "unverified",
    },
    {
      id: "c-005",
      claim: "Nimbus raised a €1.2 million pre-seed round.",
      sourceExcerpt: "Funding note: Nimbus closed a €1.2M pre-seed with Nordic angels.",
      expectedLabel: "supported",
    },
  ],
};
