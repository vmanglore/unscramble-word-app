import signatureMapRaw from "@/data/compiled/signatureMap.json";
import startsWithRaw from "@/data/compiled/startsWithMap.json";
import endsWithRaw from "@/data/compiled/endsWithMap.json";
import lengthRaw from "@/data/compiled/lengthMap.json";

type WordMap = Record<string, string[]>;

// Typed maps
const signatureMap: WordMap = signatureMapRaw;
const startsWithMap: WordMap = startsWithRaw;
const endsWithMap: WordMap = endsWithRaw;
const lengthMap: WordMap = lengthRaw;

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

  return signatureMap[key] ?? [];
}

/* ---------------------------
   PREFIX
----------------------------*/
export function getWordsByStart(letter = ""): string[] {
  const key = letter.toLowerCase();
  return startsWithMap[key] ?? [];
}

/* ---------------------------
   SUFFIX
----------------------------*/
export function getWordsByEnd(suffix = ""): string[] {
  const key = suffix.toLowerCase();
  return endsWithMap[key] ?? [];
}

/* ---------------------------
   LENGTH
----------------------------*/
export function getWordsByLength(length: string | number = ""): string[] {
  return lengthMap[String(length)] ?? [];
}