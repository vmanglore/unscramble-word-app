import fs from "fs";

const words = fs
  .readFileSync("data/raw/words.txt", "utf-8")
  .split("\n")
  .map(w => w.trim().toLowerCase())
  .filter(Boolean);

// -------------------------
// Helpers
// -------------------------
function sortLetters(word: string) {
  return word.split("").sort().join("");
}

// -------------------------
// Maps
// -------------------------
const signatureMap: Record<string, string[]> = {};
const startsWithMap: Record<string, string[]> = {};
const endsWithMap: Record<string, string[]> = {};
const lengthMap: Record<string, string[]> = {};

// -------------------------
// Build
// -------------------------
for (const word of words) {
  // signature (anagram)
  const key = sortLetters(word);
  if (!signatureMap[key]) signatureMap[key] = [];
  signatureMap[key].push(word);

  // starts with
  const start = word[0];
  if (!startsWithMap[start]) startsWithMap[start] = [];
  startsWithMap[start].push(word);

  // ends with
  const end = word[word.length - 1];
  if (!endsWithMap[end]) endsWithMap[end] = [];
  endsWithMap[end].push(word);

  // length
  const len = String(word.length);
  if (!lengthMap[len]) lengthMap[len] = [];
  lengthMap[len].push(word);
}

// -------------------------
// Write output
// -------------------------
fs.writeFileSync(
  "data/compiled/signatureMap.json",
  JSON.stringify(signatureMap, null, 2)
);

fs.writeFileSync(
  "data/compiled/startsWithMap.json",
  JSON.stringify(startsWithMap, null, 2)
);

fs.writeFileSync(
  "data/compiled/endsWithMap.json",
  JSON.stringify(endsWithMap, null, 2)
);

fs.writeFileSync(
  "data/compiled/lengthMap.json",
  JSON.stringify(lengthMap, null, 2)
);

console.log("✅ Word maps generated successfully");