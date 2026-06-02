import signatureMap from "@/data/compiled/signatureMap.json";
import { fetchWordsFromAPI } from "./wordApi";

type SignatureMap = Record<string, string[]>;

const map = signatureMap as SignatureMap;

// cache uses sorted letters (true lookup key)
const cache = new Map<string, string[]>();

export async function unscrambleLetters(letters: string): Promise<string[]> {
  const cleaned = letters.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return [];

  const sorted = cleaned.split("").sort().join("");

  // 1. cache
  if (cache.has(sorted)) {
    return cache.get(sorted)!;
  }

  // 2. static lookup (FAST PATH)
  const staticResult = map[sorted] ?? [];

  if (staticResult.length > 0) {
    cache.set(sorted, staticResult);
    return staticResult;
  }

  // 3. API fallback (SLOW PATH)
  const apiResult = await fetchWordsFromAPI(cleaned);

  cache.set(sorted, apiResult);

  return apiResult;
}