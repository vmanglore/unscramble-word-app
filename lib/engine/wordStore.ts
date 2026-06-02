import signatureMapRaw from "@/data/compiled/signatureMap.json";
import startsWithRaw from "@/data/compiled/startsWithMap.json";
import endsWithRaw from "@/data/compiled/endsWithMap.json";
import lengthRaw from "@/data/compiled/lengthMap.json";

type MapType = Record<string, string[]>;

// Cache objects (important for performance)
const signatureMap: MapType = signatureMapRaw;
const startsWithMap: MapType = startsWithRaw;
const endsWithMap: MapType = endsWithRaw;
const lengthMap: MapType = lengthRaw;

/* ---------------------------
   UNSCRAMBLE
----------------------------*/
export function getUnscramble(letters?: string) {
  if (!letters) return [];

  const key = letters
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .sort()
    .join("");

  return signatureMap[key] || [];
}

/* ---------------------------
   PREFIX
----------------------------*/
export function getWordsByStart(letter?: string) {
  if (!letter) return [];
  return startsWithMap[letter.toLowerCase()] || [];
}

/* ---------------------------
   SUFFIX
----------------------------*/
export function getWordsByEnd(suffix?: string) {
  if (!suffix) return [];
  return endsWithMap[suffix.toLowerCase()] || [];
}

/* ---------------------------
   LENGTH
----------------------------*/
export function getWordsByLength(length?: string | number) {
  if (!length) return [];
  return lengthMap[String(length)] || [];
}