import signatureMap from "@/data/compiled/signatureMap.json";
console.log("signatureMap:", signatureMap);
console.log("keys:", Object.keys(signatureMap));

const map = new Map<string, string[]>(
  Object.entries(signatureMap)
);

function normalize(input?: string) {
  if (!input) return "";
  return input.toLowerCase().replace(/[^a-z]/g, "");
}

function toKey(letters: string) {
  return letters.split("").sort().join("");
}

export function unscramble(letters?: string): string[] {
  const normalized = normalize(letters);

  if (!normalized) return [];

  const key = toKey(normalized);

  return map.get(key) || [];
}