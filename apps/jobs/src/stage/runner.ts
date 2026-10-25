/**
 * Durable-style stage runner: one stage is one function over named, memoisable
 * steps, executed in plain TypeScript with no executor dependency. The step API
 * is kept narrow (a name and a function) so an Inngest-backed runner can take
 * over later without touching stage code.
 */

/** Per-attempt budget; the caps are abstract counters, not measured usage. */
export interface StageBudget {
  /** Max step executions per attempt; memoised replays are free. */
  maxSteps: number;
  /** Max abstract token units per attempt, reported through the step spend hook. */
  maxTokens: number;
}

/** Typed abort: the attempt exceeded one of its budget caps. */
export class StageBudgetExceededError extends Error {
  constructor(
    /** Which cap was exceeded. */
    readonly kind: "steps" | "tokens",
    /** The cap that was exceeded. */
    readonly limit: number,
    /** The count that busted the cap. */
    readonly used: number,
  ) {
    super(`Stage budget exceeded: used ${used} ${kind}, cap is ${limit}`);
    this.name = "StageBudgetExceededError";
  }
}

/** Narrow guard so callers can tell a budget abort from a step failure. */
export function isStageBudgetExceededError(error: unknown): error is StageBudgetExceededError {
  return error instanceof StageBudgetExceededError;
}

/** Spend reporting for one step run; tokens are abstract counter units. */
export interface StepSpend {
  /**
   * Record token spend for the running step. Aborts the attempt with a
   * StageBudgetExceededError once the reported total passes the cap.
   */
  tokens(count: number): void;
}

/** Narrow step API; a future Inngest runner implements the same surface. */
export interface StepApi {
  /** Run a named step; results are memoised by name across attempts. */
  run<T>(name: string, fn: (spend: StepSpend) => T | Promise<T>): Promise<T>;
}

/** One stage: a single function over the step API. */
export type Stage<T> = (step: StepApi) => Promise<T>;

interface AttemptCounters {
  steps: number;
  tokens: number;
}

/** Executes stages: replays memoised steps on retry, enforces the budget. */
export class StageRunner {
  private readonly memo = new Map<string, unknown>();

  constructor(readonly budget: StageBudget) {}

  /**
   * One attempt. Steps that completed on an earlier attempt replay their
   * memoised result instead of executing again. Each attempt gets fresh
   * counters, so replays cost neither steps nor tokens. A budget abort
   * rejects the attempt; steps already in flight are not cancelled.
   */
  async run<T>(stage: Stage<T>): Promise<T> {
    const { memo, budget } = this;
    const counters: AttemptCounters = { steps: 0, tokens: 0 };
    const step: StepApi = {
      async run<T>(name: string, fn: (spend: StepSpend) => T | Promise<T>): Promise<T> {
        if (memo.has(name)) {
          return memo.get(name) as T;
        }
        if (counters.steps + 1 > budget.maxSteps) {
          throw new StageBudgetExceededError("steps", budget.maxSteps, counters.steps + 1);
        }
        counters.steps += 1;
        const result = await fn({
          tokens: (count) => {
            if (!Number.isFinite(count) || count < 0) {
              throw new Error(`token spend must be a non-negative number, got ${count}`);
            }
            counters.tokens += count;
            if (counters.tokens > budget.maxTokens) {
              throw new StageBudgetExceededError("tokens", budget.maxTokens, counters.tokens);
            }
          },
        });
        memo.set(name, result);
        return result;
      },
    };
    return stage(step);
  }
}
