import signatureMap from "@/data/compiled/signatureMap.json";

type WordMap = Record<string, string[]>;

const allWords = Object.values(signatureMap as WordMap).flat();

/**
 * Returns stable static word suggestions.
 *
 * This must stay deterministic because the homepage is a client component that
 * is pre-rendered on the server and then hydrated in the browser. Using
 * Math.random() here causes server/client text mismatches during hydration.
 */
export function getTrendingWords(limit = 12): string[] {
  const uniqueWords = Array.from(new Set(allWords));

  return uniqueWords
    .filter((word) => word.length >= 3)
    .sort((a, b) => {
      if (a.length !== b.length) return b.length - a.length;
      return a.localeCompare(b);
    })
    .slice(0, limit);
}
