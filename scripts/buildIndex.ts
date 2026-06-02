import fs from "fs";

/**
 * Converts word into "signature key"
 * Example:
 *  listen → eilnst
 */
function signature(word: string) {
  return word.split("").sort().join("");
}

// 1. Load raw word list
const words = fs
  .readFileSync("data/source/words.txt", "utf-8")
  .split("\n")
  .map(w => w.trim().toLowerCase())
  .filter(Boolean);

// 2. Build lookup map
const map: Record<string, string[]> = {};

for (const word of words) {
  const key = signature(word);

  if (!map[key]) {
    map[key] = [];
  }

  map[key].push(word);
}

// 3. Save optimized index
fs.writeFileSync(
  "data/signatureMap.json",
  JSON.stringify(map, null, 2)
);

console.log("✅ Dictionary index built successfully!");