import type { ZodType } from "zod";

export type LlmModelTier = "fast" | "strong" | "verifier";

export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LlmRequest {
  model: LlmModelTier;
  system?: string;
  messages: LlmMessage[];
  /** When set, the gateway must return `parsed` validated against this schema. */
  schema?: ZodType;
  maxTokens?: number;
  cacheHint?: "none" | "system" | "all";
}

export interface LlmUsage {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
}

export interface LlmResult {
  text: string;
  parsed?: unknown;
  usage: LlmUsage;
  model: string;
  provider: string;
}

/** Provider boundary: the rest of the jobs app depends only on this interface. */
export interface LlmGateway {
  complete(req: LlmRequest): Promise<LlmResult>;
}
