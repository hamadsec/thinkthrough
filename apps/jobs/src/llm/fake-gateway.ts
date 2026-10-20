import type { LlmGateway, LlmRequest, LlmResult } from "./gateway.js";

export type FakeResponse = Partial<LlmResult> & {
  /** Raw value to validate against `req.schema`; becomes `parsed` on success. */
  json?: unknown;
};

const ZERO_USAGE = { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 };

/** Deterministic scripted gateway for tests. Responses are consumed in order. */
export class FakeGateway implements LlmGateway {
  readonly calls: LlmRequest[] = [];
  private index = 0;

  constructor(private readonly script: FakeResponse[]) {}

  async complete(req: LlmRequest): Promise<LlmResult> {
    this.calls.push(req);
    const next = this.script[this.index++];
    if (next === undefined) {
      throw new Error(
        `FakeGateway script exhausted: call #${this.calls.length} but only ${this.script.length} response(s) scripted`,
      );
    }
    const { json, ...rest } = next;
    const result: LlmResult = {
      text: rest.text ?? (json === undefined ? "" : JSON.stringify(json)),
      usage: rest.usage ?? ZERO_USAGE,
      model: rest.model ?? `fake-${req.model}`,
      provider: rest.provider ?? "fake",
      parsed: rest.parsed,
    };
    if (req.schema) {
      const raw =
        json !== undefined ? json : rest.parsed !== undefined ? rest.parsed : tryJson(result.text);
      const checked = req.schema.safeParse(raw);
      if (!checked.success) {
        throw new Error(`FakeGateway response failed schema validation: ${checked.error.message}`);
      }
      result.parsed = checked.data;
    }
    return result;
  }

  get remaining(): number {
    return this.script.length - this.index;
  }
}

function tryJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
