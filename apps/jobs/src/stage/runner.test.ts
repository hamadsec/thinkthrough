import { describe, expect, it } from "vitest";
import {
  isStageBudgetExceededError,
  type Stage,
  type StageBudgetExceededError,
  StageRunner,
} from "./runner.js";

const budget = { maxSteps: 100, maxTokens: 100_000 };

/** Awaits a stage expected to abort, asserting the abort is the typed error. */
async function budgetAbort(promise: Promise<unknown>): Promise<StageBudgetExceededError> {
  try {
    await promise;
  } catch (error) {
    if (isStageBudgetExceededError(error)) {
      return error;
    }
    throw error;
  }
  throw new Error("expected the stage to abort with StageBudgetExceededError");
}

describe("StageRunner", () => {
  it("runs steps launched together in parallel", async () => {
    const runner = new StageRunner(budget);
    // Rendezvous: neither step may finish until both have started. A runner
    // that serialised steps would hang here instead of returning.
    let started = 0;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const stage: Stage<string[]> = async (step) =>
      Promise.all([
        step.run("left", async () => {
          started += 1;
          if (started === 2) {
            release();
          }
          await gate;
          return "L";
        }),
        step.run("right", async () => {
          started += 1;
          if (started === 2) {
            release();
          }
          await gate;
          return "R";
        }),
      ]);

    expect(await runner.run(stage)).toEqual(["L", "R"]);
  });

  it("memoises completed step results across attempts", async () => {
    const runner = new StageRunner({ maxSteps: 2, maxTokens: 100 });
    let aCalls = 0;
    let failB = true;
    const stage: Stage<string> = async (step) => {
      const a = await step.run("a", async (spend) => {
        aCalls += 1;
        spend.tokens(70);
        return "A";
      });
      return await step.run("b", async (spend) => {
        if (failB) {
          throw new Error("boom");
        }
        spend.tokens(50);
        return `${a}-B`;
      });
    };

    await expect(runner.run(stage)).rejects.toThrow("boom");
    failB = false;

    // Attempt 2: "a" replays for free, so "b" alone fits the token cap; a
    // runner that re-charged memoised steps would abort at 70 + 50 > 100.
    expect(await runner.run(stage)).toBe("A-B");
    expect(aCalls).toBe(1);
  });

  it("replays a memoised result when the same step name runs again", async () => {
    const runner = new StageRunner({ maxSteps: 1, maxTokens: 100_000 });
    let calls = 0;
    const stage: Stage<string> = async (step) => {
      const first = await step.run("once", async () => {
        calls += 1;
        return "v";
      });
      const again = await step.run("once", async () => {
        calls += 1;
        return "other";
      });
      return `${first}/${again}`;
    };

    expect(await runner.run(stage)).toBe("v/v");
    expect(calls).toBe(1);
  });

  it("aborts the attempt with a typed error when the step cap is exceeded", async () => {
    const runner = new StageRunner({ maxSteps: 2, maxTokens: 100_000 });
    let thirdRan = false;
    const stage: Stage<number> = async (step) => {
      let total = 0;
      total += await step.run("one", async () => 1);
      total += await step.run("two", async () => 2);
      total += await step.run("three", async () => {
        thirdRan = true;
        return 3;
      });
      return total;
    };

    const error = await budgetAbort(runner.run(stage));
    expect(error).toMatchObject({ kind: "steps", limit: 2, used: 3 });
    expect(error.message).toBe("Stage budget exceeded: used 3 steps, cap is 2");
    expect(thirdRan).toBe(false);
  });

  it("aborts the attempt with a typed error when the token cap is exceeded", async () => {
    const runner = new StageRunner({ maxSteps: 10, maxTokens: 100 });
    const stage: Stage<string> = async (step) => {
      const draft = await step.run("draft", async (spend) => {
        spend.tokens(60);
        return "draft";
      });
      return await step.run("polish", async (spend) => {
        spend.tokens(60);
        return `${draft}!`;
      });
    };

    const error = await budgetAbort(runner.run(stage));
    expect(error).toMatchObject({ kind: "tokens", limit: 100, used: 120 });
  });

  it("rejects a negative token spend instead of refunding the budget", async () => {
    const runner = new StageRunner(budget);
    const stage: Stage<string> = async (step) =>
      await step.run("bad", async (spend) => {
        spend.tokens(-5);
        return "never";
      });

    const error = await runner.run(stage).then(
      () => {
        throw new Error("expected the stage to fail");
      },
      (caught) => caught,
    );
    expect(isStageBudgetExceededError(error)).toBe(false);
    expect((error as Error).message).toMatch(/non-negative/);
  });
});
