import patternIndex from "@/data/compiled/patternIndex.json";

/**
 * Instant lookup instead of computation
 */
export function findByPattern(pattern: string) {
  return (
    (patternIndex as Record<string, string[]>)[pattern] || []
  );
}