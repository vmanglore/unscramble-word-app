import startsWithMap from "@/data/compiled/startsWithMap.json";
import endsWithMap from "@/data/compiled/endsWithMap.json";
import lengthMap from "@/data/compiled/lengthMap.json";

export function getWordsByStart(letter: string) {
  const key = letter.toLowerCase();
  return (startsWithMap as Record<string, string[]>)[key] || [];
}

export function getWordsByEnd(suffix: string) {
  const key = suffix.toLowerCase();
  return (endsWithMap as Record<string, string[]>)[key] || [];
}

export function getWordsByLength(length: string | number) {
  return (lengthMap as Record<string, string[]>)[String(length)] || [];
}