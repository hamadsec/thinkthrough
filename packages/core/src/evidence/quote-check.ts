export interface QuoteCheckResult {
  found: boolean;
  normalizedQuote: string;
  /** Index of the quote within the normalized source text (only when found). */
  position?: number;
  /** Longest common substring length / quote length, 0..1 (only when not found). */
  similarity?: number;
}

const INVISIBLE = /[­​-‍⁠﻿]/g;
const SINGLE_QUOTES = /[‘’‚‛′]/g;
const DOUBLE_QUOTES = /[“”„‟″]/g;
const DASHES = /[‐-―−]/g;

export function normalizeText(s: string): string {
  return s
    .normalize("NFKC")
    .replace(INVISIBLE, "")
    .replace(SINGLE_QUOTES, "'")
    .replace(DOUBLE_QUOTES, '"')
    .replace(DASHES, "-")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function longestCommonSubstring(a: string, b: string): number {
  let best = 0;
  let prev = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array<number>(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        const len = (prev[j - 1] ?? 0) + 1;
        cur[j] = len;
        if (len > best) best = len;
      }
    }
    prev = cur;
  }
  return best;
}

export function quoteCheck(quote: string, sourceText: string): QuoteCheckResult {
  const normalizedQuote = normalizeText(quote);
  if (normalizedQuote.length === 0) {
    throw new Error("quoteCheck: quote must not be empty");
  }
  const normalizedSource = normalizeText(sourceText);
  const position = normalizedSource.indexOf(normalizedQuote);
  if (position !== -1) {
    return { found: true, normalizedQuote, position };
  }
  const similarity =
    longestCommonSubstring(normalizedQuote, normalizedSource) / normalizedQuote.length;
  return { found: false, normalizedQuote, similarity };
}
