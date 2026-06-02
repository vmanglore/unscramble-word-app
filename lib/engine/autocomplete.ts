import startsWithMap from "@/data/compiled/startsWithMap.json";
import { levenshtein } from "./fuzzy";

type WordMap = Record<string, string[]>;

const prefixIndex = startsWithMap as WordMap;

/**
 * Fast autocomplete using precomputed index + lightweight refinement
 */
export function getSuggestions(query: string, limit = 10): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // 1. O(1) lookup from index
  const candidates = prefixIndex[q] || [];

  if (candidates.length === 0) return [];

  // 2. Lightweight ranking (ONLY top N candidates, not full dataset)
  const ranked = candidates
    .slice(0, 200) // safety cap (prevents large compute)
    .map((word) => ({
      word,
      score: levenshtein(q, word),
    }))
    .sort((a, b) => a.score - b.score)
    .map((x) => x.word);

  // 3. merge (already mostly sorted, but safe dedupe)
  return Array.from(new Set(ranked)).slice(0, limit);
}