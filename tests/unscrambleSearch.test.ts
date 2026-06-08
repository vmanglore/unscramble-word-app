import assert from "node:assert/strict";
import { getFilteredUnscramble } from "@/lib/engine/wordStore";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function assertEveryWordMatchesLength(words: string[], length: number) {
  assert.ok(words.length > 0, `expected ${length}-letter results`);
  assert.ok(
    words.every((word) => word.length === length),
    `expected every result to have length ${length}`
  );
}

function assertCanBuild(word: string, letters: string) {
  const available = new Map<string, number>();

  for (const letter of letters) {
    available.set(letter, (available.get(letter) ?? 0) + 1);
  }

  for (const letter of word) {
    const count = available.get(letter) ?? 0;

    assert.ok(count > 0, `expected ${word} to be buildable from ${letters}`);
    available.set(letter, count - 1);
  }
}

for (const length of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  const words = getFilteredUnscramble(alphabet, {
    length,
    startsWith: "",
    endsWith: "",
    contains: "",
  });

  assertEveryWordMatchesLength(words, length);
  words.forEach((word) => assertCanBuild(word, alphabet));
}

const threeLetterWords = getFilteredUnscramble(alphabet, { length: 3 });
const threeLetterWordsWithBlankFilters = getFilteredUnscramble(alphabet, {
  length: 3,
  startsWith: "",
  endsWith: "",
  contains: "",
});

assert.deepEqual(
  threeLetterWordsWithBlankFilters,
  threeLetterWords,
  "blank filters should not change length-filtered unscramble results"
);

assert.ok(
  !threeLetterWords.every((word) => word.startsWith("st")),
  "Starts with placeholder text should not be applied when the filter is blank"
);
assert.ok(
  !threeLetterWords.every((word) => word.endsWith("h")),
  "Ends with placeholder text should not be applied when the filter is blank"
);
assert.ok(
  !threeLetterWords.every((word) => word.includes("ea")),
  "Contains placeholder text should not be applied when the filter is blank"
);
