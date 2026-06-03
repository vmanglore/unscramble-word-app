import signatureMapRaw from "@/data/compiled/signatureMap.json";
import startsWithRaw from "@/data/compiled/startsWithMap.json";
import endsWithRaw from "@/data/compiled/endsWithMap.json";
import lengthRaw from "@/data/compiled/lengthMap.json";
import frequencyRaw from "@/data/compiled/frequencyMap.json";
import definitionsRaw from "@/data/compiled/definitions.json";

type WordMap = Record<string, string[]>;
type FrequencyMap = Record<string, number>;
type DefinitionMap = Record<string, string>;

type WordFinderFilters = {
  length?: string | number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  limit?: number;
};

// Typed maps
const signatureMap: WordMap = signatureMapRaw;
const startsWithMap: WordMap = startsWithRaw;
const endsWithMap: WordMap = endsWithRaw;
const lengthMap: WordMap = lengthRaw;
const frequencyMap: FrequencyMap = frequencyRaw;
const definitions: DefinitionMap = definitionsRaw;

function cleanLetters(value = "") {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function getAllWords(): string[] {
  return Array.from(new Set(Object.values(lengthMap).flat()));
}

export function getWordFrequency(word = ""): number | undefined {
  return frequencyMap[word.toLowerCase()];
}

export function getWordDefinition(word = ""): string | undefined {
  return definitions[word.toLowerCase()];
}

export function rankWords(words: string[]): string[] {
  return [...words].sort((a, b) => {
    const frequencyA = frequencyMap[a] ?? 0;
    const frequencyB = frequencyMap[b] ?? 0;

    if (frequencyA !== frequencyB) {
      return frequencyB - frequencyA;
    }

    if (a.length !== b.length) {
      return b.length - a.length;
    }

    return a.localeCompare(b);
  });
}

export function findWords({
  length,
  startsWith = "",
  endsWith = "",
  contains = "",
  limit = 200,
}: WordFinderFilters = {}): string[] {
  const cleanLength = length ? String(length).replace(/[^0-9]/g, "") : "";
  const cleanStartsWith = cleanLetters(startsWith);
  const cleanEndsWith = cleanLetters(endsWith);
  const cleanContains = cleanLetters(contains);

  let words = cleanLength ? lengthMap[cleanLength] ?? [] : getAllWords();

  if (cleanStartsWith) {
    words = words.filter((word) => word.startsWith(cleanStartsWith));
  }

  if (cleanEndsWith) {
    words = words.filter((word) => word.endsWith(cleanEndsWith));
  }

  if (cleanContains) {
    words = words.filter((word) => word.includes(cleanContains));
  }

  return rankWords(Array.from(new Set(words))).slice(0, limit);
}

/* ---------------------------
   UNSCRAMBLE
----------------------------*/
export function getUnscramble(letters = ""): string[] {
  const key = letters
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .sort()
    .join("");

  return rankWords(signatureMap[key] ?? []);
}

/* ---------------------------
   PREFIX
----------------------------*/
export function getWordsByStart(letter = ""): string[] {
  const key = letter.toLowerCase();
  return rankWords(startsWithMap[key] ?? []);
}

/* ---------------------------
   SUFFIX
----------------------------*/
export function getWordsByEnd(suffix = ""): string[] {
  const key = suffix.toLowerCase();
  return rankWords(endsWithMap[key] ?? []);
}

/* ---------------------------
   LENGTH
----------------------------*/
export function getWordsByLength(length: string | number = ""): string[] {
  return rankWords(lengthMap[String(length)] ?? []);
}
