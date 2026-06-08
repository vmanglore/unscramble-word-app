import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

type DictionaryEntry = {
  word?: unknown;
  frequency?: unknown;
  log_frequency?: unknown;
};

type WordMap = Record<string, string[]>;
type FrequencyMap = Record<string, number>;

const SOURCE_PATH = path.join(process.cwd(), "data", "source", "dictionary.json");
const COMPILED_DIR = path.join(process.cwd(), "data", "compiled");
const MIN_WORD_LENGTH = 2;
const MAX_WORD_LENGTH = 20;
const VALID_WORD_PATTERN = /^[a-z]+$/;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function normalizeWord(value: unknown) {
  if (typeof value !== "string") return "";

  return value.trim().toLowerCase();
}

function isValidWord(word: string) {
  return (
    word.length >= MIN_WORD_LENGTH &&
    word.length <= MAX_WORD_LENGTH &&
    VALID_WORD_PATTERN.test(word)
  );
}

function signature(word: string) {
  return word.split("").sort().join("");
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

function getWordMapWords(map: WordMap) {
  return new Set(Object.values(map).flat());
}

function assertStringSetEqual(actual: Set<string>, expected: Set<string>, message: string) {
  const actualOnly = [...actual].filter((word) => !expected.has(word)).sort();
  const expectedOnly = [...expected].filter((word) => !actual.has(word)).sort();

  assert.deepEqual(
    { actualOnly, expectedOnly },
    { actualOnly: [], expectedOnly: [] },
    message
  );
}

function assertNoDuplicateWords(mapName: string, map: WordMap) {
  for (const [key, words] of Object.entries(map)) {
    const duplicateWords = words.filter((word, index) => words.indexOf(word) !== index);

    assert.deepEqual(
      duplicateWords,
      [],
      `${mapName}[${key}] must not contain duplicate words`
    );
  }
}

function assertCompiledWordsAreValid(mapName: string, words: Iterable<string>) {
  for (const word of words) {
    assert.ok(
      isValidWord(word),
      `${mapName} contains malformed/non-alphabetic word ${JSON.stringify(word)}`
    );
  }
}

function buildExpectedCompiledData() {
  const source = readJson<DictionaryEntry[]>(SOURCE_PATH);

  assert.ok(Array.isArray(source), "dictionary source must be a JSON array");

  const words = new Set<string>();
  const frequencyMap: FrequencyMap = {};

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
  }

  const sortedWords = [...words].sort();
  const signatureMap: WordMap = {};
  const startsWithMap: WordMap = {};
  const endsWithMap: WordMap = {};
  const lengthMap: WordMap = {};
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

  return {
    approvedWords: words,
    signatureMap,
    startsWithMap,
    endsWithMap,
    lengthMap,
    patternIndex,
    frequencyMap,
  };
}

test("WQ-001/DD-002/DD-003/DD-007/TR-004: main compiled dictionary maps exactly match normalized approved source words", () => {
  const expected = buildExpectedCompiledData();
  const compiledMaps: Record<string, WordMap> = {
    "signatureMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "signatureMap.json")),
    "startsWithMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "startsWithMap.json")),
    "endsWithMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "endsWithMap.json")),
    "lengthMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "lengthMap.json")),
  };

  assert.deepEqual(compiledMaps["signatureMap.json"], expected.signatureMap);
  assert.deepEqual(compiledMaps["startsWithMap.json"], expected.startsWithMap);
  assert.deepEqual(compiledMaps["endsWithMap.json"], expected.endsWithMap);
  assert.deepEqual(compiledMaps["lengthMap.json"], expected.lengthMap);

  for (const [mapName, map] of Object.entries(compiledMaps)) {
    assertStringSetEqual(
      getWordMapWords(map),
      expected.approvedWords,
      `${mapName} word set must match normalized approved dictionary source`
    );
  }
});

test("WQ-001/DD-002/DD-003/DD-007/TR-004: compiled frequency map word set matches normalized approved source words", () => {
  const expected = buildExpectedCompiledData();
  const frequencyMap = readJson<FrequencyMap>(path.join(COMPILED_DIR, "frequencyMap.json"));

  assertStringSetEqual(
    new Set(Object.keys(frequencyMap)),
    expected.approvedWords,
    "frequencyMap.json keys must match normalized approved dictionary source"
  );
  assertStringSetEqual(
    new Set(Object.keys(frequencyMap)),
    new Set(Object.keys(expected.frequencyMap)),
    "frequencyMap.json keys must match the buildIndex frequency output"
  );

  for (const [word, frequency] of Object.entries(frequencyMap)) {
    assert.ok(
      Number.isFinite(frequency),
      `frequencyMap.json must contain a finite numeric frequency for ${word}`
    );
  }
});

test("WQ-001/DD-003/DD-007/TR-004: compiled maps contain only valid alphabetic words and no duplicate array entries", () => {
  const compiledMaps: Record<string, WordMap> = {
    "signatureMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "signatureMap.json")),
    "startsWithMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "startsWithMap.json")),
    "endsWithMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "endsWithMap.json")),
    "lengthMap.json": readJson<WordMap>(path.join(COMPILED_DIR, "lengthMap.json")),
  };
  const frequencyMap = readJson<FrequencyMap>(path.join(COMPILED_DIR, "frequencyMap.json"));

  for (const [mapName, map] of Object.entries(compiledMaps)) {
    assertCompiledWordsAreValid(mapName, getWordMapWords(map));
    assertNoDuplicateWords(mapName, map);
  }

  assertCompiledWordsAreValid("frequencyMap.json", Object.keys(frequencyMap));
});

test("WQ-001/DD-002/DD-007/RH-003/TR-004: pattern index is fully regenerated from approved source words", () => {
  const expected = buildExpectedCompiledData();
  const patternIndex = readJson<WordMap>(path.join(COMPILED_DIR, "patternIndex.json"));
  const patternWords = getWordMapWords(patternIndex);

  assert.deepEqual(
    patternIndex,
    expected.patternIndex,
    "patternIndex.json must be a full approved-source-derived wildcard index"
  );

  assertStringSetEqual(
    patternWords,
    expected.approvedWords,
    "patternIndex.json results must all be backed by the normalized approved dictionary source"
  );

  for (const staleWord of ["amble", "inlets", "peal", "tamers"]) {
    assert.ok(
      !patternWords.has(staleWord),
      `patternIndex.json must not expose stale non-source word ${staleWord}`
    );
  }

  assert.ok(
    patternIndex["a_le"]?.includes("able"),
    "patternIndex.json should include full-source approved words, not legacy/demo subsets"
  );
});