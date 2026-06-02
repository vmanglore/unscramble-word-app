import signatureMap from "@/data/compiled/signatureMap.json";

type WordMap = Record<string, string[]>;

const allWords = Object.values(signatureMap as WordMap).flat();

// simple deterministic shuffle (stable output)
function shuffle(array: string[]) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Returns trending words (static-based, no API dependency)
 */
export function getTrendingWords(limit = 12): string[] {
  const uniqueWords = Array.from(new Set(allWords));

  const shuffled = shuffle([...uniqueWords]);

  return shuffled.slice(0, limit);
}