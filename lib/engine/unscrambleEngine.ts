import signatureMap from "@/data/compiled/signatureMap.json";

type SignatureMap = Record<string, string[]>;

const map = signatureMap as SignatureMap;

// cache uses sorted letters (true lookup key)
const cache = new Map<string, string[]>();

export async function unscrambleLetters(letters: string): Promise<string[]> {
  const cleaned = letters.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return [];

  const sorted = cleaned.split("").sort().join("");

  if (cache.has(sorted)) {
    return cache.get(sorted)!;
  }

  const result = map[sorted] ?? [];

  cache.set(sorted, result);

  return result;
}
