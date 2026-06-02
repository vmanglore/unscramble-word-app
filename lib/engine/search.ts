import patternIndex from "@/data/compiled/patternIndex.json";

type PatternIndex = Record<string, string[]>;

/**
 * Instant lookup instead of computation
 */
export function findByPattern(pattern: string): string[] {
  const index = patternIndex as PatternIndex;

  return index[pattern] ?? [];
}