import lengthRaw from "@/data/compiled/lengthMap.json";
import { isDefaultDisplayWord } from "@/lib/engine/displayQuality";
import {
  filterWords,
  getWordDefinition,
  rankWords,
  type WordFinderFilters,
} from "@/lib/engine/wordStore";

type WordMap = Record<string, string[]>;
type LetterCounts = Record<string, number>;

export type WordLengthGroup = {
  length: number;
  words: string[];
};

export type WordsFromLettersOptions = WordFinderFilters & {
  includeLowValueWords?: boolean;
};

const lengthMap: WordMap = lengthRaw;
const baseCache = new Map<string, string[]>();

function cleanLetters(value = "") {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function countLetters(value: string): LetterCounts {
  const counts: LetterCounts = {};

  for (const letter of value) {
    counts[letter] = (counts[letter] ?? 0) + 1;
  }

  return counts;
}

function canBuildWordFromCounts(word: string, available: LetterCounts) {
  const used: LetterCounts = {};

  for (const letter of word) {
    used[letter] = (used[letter] ?? 0) + 1;

    if (used[letter] > (available[letter] ?? 0)) {
      return false;
    }
  }

  return true;
}

export function canBuildWord(word = "", letters = ""): boolean {
  const cleanWord = cleanLetters(word);
  const cleanAvailableLetters = cleanLetters(letters);

  if (!cleanWord || !cleanAvailableLetters) {
    return false;
  }

  const dictionaryWords = lengthMap[String(cleanWord.length)] ?? [];

  return (
    dictionaryWords.includes(cleanWord) &&
    canBuildWordFromCounts(cleanWord, countLetters(cleanAvailableLetters))
  );
}

function getBaseWordsFromLetters(letters: string): string[] {
  const cleaned = cleanLetters(letters);

  if (!cleaned) {
    return [];
  }

  const cacheKey = cleaned.split("").sort().join("");
  const cached = baseCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const availableCounts = countLetters(cleaned);
  const maxLength = Math.min(cleaned.length, 20);
  const candidates: string[] = [];

  for (let length = 2; length <= maxLength; length++) {
    candidates.push(...(lengthMap[String(length)] ?? []));
  }

  const words = rankWords(
    candidates.filter((word) => canBuildWordFromCounts(word, availableCounts))
  );

  baseCache.set(cacheKey, words);

  return words;
}

export function getWordsFromLetters(
  letters = "",
  filters: WordsFromLettersOptions = {}
): string[] {
  const words = getBaseWordsFromLetters(letters);
  const displayableWords = filters.includeLowValueWords
    ? words
    : words.filter(isDefaultDisplayWord);

  return filterWords(displayableWords, filters);
}

export function groupWordsByLength(words: string[]): WordLengthGroup[] {
  const groups = new Map<number, string[]>();

  for (const word of words) {
    const length = word.length;
    const group = groups.get(length) ?? [];

    group.push(word);
    groups.set(length, group);
  }

  return Array.from(groups.entries())
    .sort(([lengthA], [lengthB]) => lengthB - lengthA)
    .map(([length, groupWords]) => ({
      length,
      words: groupWords,
    }));
}

export function getWordsFromLettersSummary(groups: WordLengthGroup[]) {
  return groups.map((group) => ({
    length: group.length,
    count: group.words.length,
  }));
}

export function getDefinitionsForWords(words: string[]) {
  return Object.fromEntries(
    words.map((word) => [word, getWordDefinition(word) ?? ""])
  );
}
