import signatureMap from "@/data/compiled/signatureMap.json";

const allWords = Object.values(signatureMap).flat();

// simple frequency simulation (replace later with real analytics if needed)
const freqMap: Record<string, number> = {};

for (const word of allWords) {
  const w = word.toLowerCase();
  freqMap[w] = (freqMap[w] || 0) + 1;
}

export function getTrendingWords(limit = 20) {
  return Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}