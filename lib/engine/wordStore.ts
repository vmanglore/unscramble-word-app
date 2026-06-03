import signatureMapRaw from "@/data/compiled/signatureMap.json";
import startsWithRaw from "@/data/compiled/startsWithMap.json";
import endsWithRaw from "@/data/compiled/endsWithMap.json";
import lengthRaw from "@/data/compiled/lengthMap.json";
import frequencyRaw from "@/data/compiled/frequencyMap.json";
import definitionsRaw from "@/data/compiled/definitions.json";

type WordMap = Record<string, string[]>;
type FrequencyMap = Record<string, number>;
type DefinitionMap = Record<string, string>;

// Typed maps
const signatureMap: WordMap = signatureMapRaw;
const startsWithMap: WordMap = startsWithRaw;
const endsWithMap: WordMap = endsWithRaw;
const lengthMap: WordMap = lengthRaw;
const frequencyMap: FrequencyMap = frequencyRaw;
const definitions: DefinitionMap = definitionsRaw;

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
