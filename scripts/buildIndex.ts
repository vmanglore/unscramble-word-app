import fs from "fs";
import path from "path";

type DictionaryEntry = {
  word: string;
  frequency?: number;
  log_frequency?: number;
  definition?: string;
};

type WordMap = Record<string, string[]>;
type FrequencyMap = Record<string, number>;
type DefinitionMap = Record<string, string>;

const SOURCE_PATH = path.join("data", "source", "dictionary.json");
const COMPILED_DIR = path.join("data", "compiled");
const MIN_WORD_LENGTH = 2;
const MAX_WORD_LENGTH = 20;

function signature(word: string) {
  return word.split("").sort().join("");
}

function normalizeWord(value: unknown) {
  if (typeof value !== "string") return "";

  return value.trim().toLowerCase();
}

function isValidWord(word: string) {
  return (
    word.length >= MIN_WORD_LENGTH &&
    word.length <= MAX_WORD_LENGTH &&
    /^[a-z]+$/.test(word)
  );
}

function generatePatterns(word: string) {
  return word.split("").map((_, index) =>
    `${word.slice(0, index)}_${word.slice(index + 1)}`
  );
}

function addToMap(map: WordMap, key: string, word: string) {
  if (!map[key]) {
    map[key] = [];
  }

  map[key].push(word);
}

function sortMapValues(map: WordMap) {
  for (const key of Object.keys(map)) {
    map[key] = Array.from(new Set(map[key])).sort();
  }
}

function writeJson(filename: string, data: unknown) {
  fs.writeFileSync(
    path.join(COMPILED_DIR, filename),
    JSON.stringify(data),
    "utf-8"
  );
}

if (!fs.existsSync(SOURCE_PATH)) {
  throw new Error(`Dictionary source not found: ${SOURCE_PATH}`);
}

fs.mkdirSync(COMPILED_DIR, { recursive: true });

const source = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf-8")) as DictionaryEntry[];

if (!Array.isArray(source)) {
  throw new Error("Dictionary source must be a JSON array.");
}

const words = new Set<string>();
const frequencyMap: FrequencyMap = {};
const definitions: DefinitionMap = {};

for (const entry of source) {
  const word = normalizeWord(entry.word);

  if (!isValidWord(word)) {
    continue;
  }

  words.add(word);

  if (typeof entry.frequency === "number" && Number.isFinite(entry.frequency)) {
    frequencyMap[word] = entry.frequency;
  } else if (
    typeof entry.log_frequency === "number" &&
    Number.isFinite(entry.log_frequency)
  ) {
    frequencyMap[word] = entry.log_frequency;
  }

  if (typeof entry.definition === "string" && entry.definition.trim()) {
    definitions[word] = entry.definition.trim();
  }
}

const sortedWords = Array.from(words).sort();

const signatureMap: WordMap = {};
const startsWithMap: WordMap = {};
const endsWithMap: WordMap = {};
const lengthMap: WordMap = {};
// Pattern search is a full approved-source index to satisfy WQ-001/DD-002/DD-007.
const patternIndex: WordMap = {};

for (const word of sortedWords) {
  addToMap(signatureMap, signature(word), word);
  addToMap(startsWithMap, word[0], word);
  addToMap(lengthMap, String(word.length), word);

  for (const pattern of generatePatterns(word)) {
    addToMap(patternIndex, pattern, word);
  }

  for (let suffixLength = 1; suffixLength <= Math.min(5, word.length); suffixLength++) {
    addToMap(endsWithMap, word.slice(-suffixLength), word);
  }
}

sortMapValues(signatureMap);
sortMapValues(startsWithMap);
sortMapValues(endsWithMap);
sortMapValues(lengthMap);
sortMapValues(patternIndex);

fs.writeFileSync(
  path.join("data", "source", "words.txt"),
  `${sortedWords.join("\n")}\n`,
  "utf-8"
);

writeJson("signatureMap.json", signatureMap);
writeJson("startsWithMap.json", startsWithMap);
writeJson("endsWithMap.json", endsWithMap);
writeJson("lengthMap.json", lengthMap);
writeJson("patternIndex.json", patternIndex);
writeJson("frequencyMap.json", frequencyMap);
writeJson("definitions.json", definitions);

console.log("✅ Dictionary indexes built successfully");
console.log(`Words: ${sortedWords.length}`);
console.log(`Definitions: ${Object.keys(definitions).length}`);
console.log(`Frequencies: ${Object.keys(frequencyMap).length}`);
console.log(`Patterns: ${Object.keys(patternIndex).length}`);