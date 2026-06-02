import fs from "fs";
import path from "path";

/**
 * SOURCE WORD LIST
 * This is your raw dictionary input
 */
const WORD_FILE = path.join(process.cwd(), "data/source/words.txt");

/**
 * OUTPUT FILES (precomputed production assets)
 */
const OUTPUT_DIR = path.join(process.cwd(), "data/compiled");
const SIGNATURE_PATH = path.join(OUTPUT_DIR, "signatureMap.json");
const PATTERN_PATH = path.join(OUTPUT_DIR, "patternIndex.json");

/**
 * Ensure output directory exists
 */
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Load and normalize words
 */
const words = fs
  .readFileSync(WORD_FILE, "utf-8")
  .split("\n")
  .map(w => w.trim().toLowerCase())
  .filter(w => /^[a-z]+$/.test(w)); // keep only clean words

/**
 * Convert word → sorted signature key
 * Example:
 *  listen → eilnst
 */
function signature(word: string) {
  return word.split("").sort().join("");
}

/**
 * Generate wildcard SEO patterns
 * Example:
 *  listen → _isten, l_sten, li_ten, ...
 */
function generatePatterns(word: string) {
  const patterns: string[] = [];

  for (let i = 0; i < word.length; i++) {
    const arr = word.split("");
    arr[i] = "_";
    patterns.push(arr.join(""));
  }

  return patterns;
}

/**
 * MAIN INDEXES
 */
const signatureMap: Record<string, string[]> = {};
const patternIndex: Record<string, string[]> = {};

/**
 * BUILD PHASE
 */
for (const word of words) {
  // --- SIGNATURE INDEX (anagrams) ---
  const sig = signature(word);

  if (!signatureMap[sig]) {
    signatureMap[sig] = [];
  }
  signatureMap[sig].push(word);

  // --- PATTERN INDEX (SEO pages) ---
  const patterns = generatePatterns(word);

  for (const p of patterns) {
    if (!patternIndex[p]) {
      patternIndex[p] = [];
    }
    patternIndex[p].push(word);
  }
}

/**
 * OPTIONAL: Deduplicate + sort for consistency
 */
for (const key in signatureMap) {
  signatureMap[key] = [...new Set(signatureMap[key])].sort();
}

for (const key in patternIndex) {
  patternIndex[key] = [...new Set(patternIndex[key])].sort();
}

/**
 * WRITE OUTPUT FILES (production-ready JSON)
 */
fs.writeFileSync(
  SIGNATURE_PATH,
  JSON.stringify(signatureMap)
);

fs.writeFileSync(
  PATTERN_PATH,
  JSON.stringify(patternIndex)
);

/**
 * LOG SUMMARY
 */
console.log("===================================");
console.log("🚀 SEO BUILD COMPLETE");
console.log(`Words processed: ${words.length}`);
console.log(`Signatures: ${Object.keys(signatureMap).length}`);
console.log(`Patterns: ${Object.keys(patternIndex).length}`);
console.log("Output written to: data/compiled/");
console.log("===================================");