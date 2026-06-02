import signatureMap from "@/data/compiled/signatureMap.json";
import { levenshtein } from "./fuzzy";

const allWords = Object.values(signatureMap).flat();

const wordList = Array.from(new Set(allWords)).map((w) =>
  w.toLowerCase()
);

export function getSuggestions(query: string, limit = 10) {
  const q = query.toLowerCase().trim();

  if (!q) return [];

  // 1. prefix matches (fast path)
  const prefixMatches = wordList.filter((w) => w.startsWith(q));

  // 2. fuzzy matches (typo handling)
  const fuzzyMatches = wordList
    .map((w) => ({
      word: w,
      distance: levenshtein(q, w),
    }))
    .filter((w) => w.distance <= 2)
    .sort((a, b) => a.distance - b.distance)
    .map((w) => w.word);

  // merge + dedupe
  const combined = Array.from(new Set([...prefixMatches, ...fuzzyMatches]));

  return combined.slice(0, limit);
}