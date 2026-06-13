import signatureMapRaw from "@/data/compiled/signatureMap.json";
import startsWithRaw from "@/data/compiled/startsWithMap.json";
import endsWithRaw from "@/data/compiled/endsWithMap.json";
import lengthRaw from "@/data/compiled/lengthMap.json";
import frequencyRaw from "@/data/compiled/frequencyMap.json";
import definitionsRaw from "@/data/compiled/definitions.json";
import { isDefaultDisplayWord } from "@/lib/engine/displayQuality";

type WordMap = Record<string, string[]>;
type FrequencyMap = Record<string, number>;
type DefinitionMap = Record<string, string>;

export type WordFinderFilters = {
  length?: string | number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  includeLowValueWords?: boolean;
  limit?: number;
};

// Typed maps
const signatureMap: WordMap = signatureMapRaw;
const startsWithMap: WordMap = startsWithRaw;
const endsWithMap: WordMap = endsWithRaw;
const lengthMap: WordMap = lengthRaw;
const frequencyMap: FrequencyMap = frequencyRaw;
const definitions: DefinitionMap = definitionsRaw;
const buildableWordsCache = new Map<string, string[]>();

function cleanLetters(value = "") {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function cleanLengthFilter(length: WordFinderFilters["length"]): string {
  return length ? String(length).replace(/[^0-9]/g, "") : "";
}

function countLetters(value: string): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const letter of value) {
    counts[letter] = (counts[letter] ?? 0) + 1;
  }

  return counts;
}

function canBuildWordFromCounts(
  word: string,
  availableCounts: Record<string, number>
): boolean {
  const usedCounts: Record<string, number> = {};

  for (const letter of word) {
    usedCounts[letter] = (usedCounts[letter] ?? 0) + 1;

    if (usedCounts[letter] > (availableCounts[letter] ?? 0)) {
      return false;
    }
  }

  return true;
}

export function getAllWords(): string[] {
  return Array.from(new Set(Object.values(lengthMap).flat()));
}

export function getWordFrequency(word = ""): number | undefined {
  return frequencyMap[word.toLowerCase()];
}

export function getWordDefinition(word = ""): string | undefined {
  return definitions[word.toLowerCase()];
}

export function hasWordDefinition(word = ""): boolean {
  return Boolean(getWordDefinition(word));
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

export function filterWords(
  words: string[],
  { length, startsWith = "", endsWith = "", contains = "", limit }: WordFinderFilters = {}
): string[] {
  const cleanLength = cleanLengthFilter(length);
  const cleanStartsWith = cleanLetters(startsWith);
  const cleanEndsWith = cleanLetters(endsWith);
  const cleanContains = cleanLetters(contains);

  let filteredWords = Array.from(new Set(words));

  if (cleanLength) {
    filteredWords = filteredWords.filter((word) => word.length === Number(cleanLength));
  }

  if (cleanStartsWith) {
    filteredWords = filteredWords.filter((word) => word.startsWith(cleanStartsWith));
  }

  if (cleanEndsWith) {
    filteredWords = filteredWords.filter((word) => word.endsWith(cleanEndsWith));
  }

  if (cleanContains) {
    filteredWords = filteredWords.filter((word) => word.includes(cleanContains));
  }

  const rankedWords = rankWords(filteredWords);

  return typeof limit === "number" ? rankedWords.slice(0, limit) : rankedWords;
}

export function findWords(filters: WordFinderFilters = {}): string[] {
  const cleanLength = cleanLengthFilter(filters.length);

  const numericLength = Number(cleanLength);

  if (cleanLength && numericLength < 1) {
    return [];
  }

  const baseWords = cleanLength
    ? lengthMap[cleanLength] ?? []
    : getAllWords();

  return filterWords(baseWords, filters);
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

function getBuildableWords(letters: string, length = ""): string[] {
  const cacheKey = `${letters.split("").sort().join("")}:${length}`;
  const cachedWords = buildableWordsCache.get(cacheKey);

  if (cachedWords) {
    return cachedWords;
  }

  const availableCounts = countLetters(letters);
  const candidates = length
    ? lengthMap[length] ?? []
    : Object.entries(lengthMap).flatMap(([wordLength, words]) =>
        Number(wordLength) <= letters.length ? words : []
      );
  const buildableWords = rankWords(
    candidates.filter((word) => canBuildWordFromCounts(word, availableCounts))
  );

  buildableWordsCache.set(cacheKey, buildableWords);

  return buildableWords;
}

export function getFilteredUnscramble(
  letters = "",
  filters: WordFinderFilters = {}
): string[] {
  const cleanAvailableLetters = cleanLetters(letters);
  const cleanLength = cleanLengthFilter(filters.length);

  if (!cleanAvailableLetters) {
    return [];
  }

  const buildableWords = getBuildableWords(cleanAvailableLetters, cleanLength);
  const displayableWords = filters.includeLowValueWords
    ? buildableWords
    : buildableWords.filter(isDefaultDisplayWord);

  return filterWords(displayableWords, filters);
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
