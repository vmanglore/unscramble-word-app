import assert from "node:assert/strict";
import test from "node:test";
import { getAllWords, getFilteredUnscramble } from "@/lib/engine/wordStore";
import { groupWordsByLength } from "@/lib/engine/wordsFromLetters";

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

test("SB-002/SB-003/RH-001/RH-004/TR-004: alphabet subset search returns buildable words through the @/ alias harness", () => {
  const alphabetWordsWithoutFilters = getFilteredUnscramble(alphabet);

  assert.ok(
    alphabetWordsWithoutFilters.length > 0,
    "expected alphabet search without filters to return buildable words"
  );
  alphabetWordsWithoutFilters.forEach((word) => assertCanBuild(word, alphabet));
});

test("SB-001/TR-004: exact anagram search includes aelpp -> apple", () => {
  const appleWords = getFilteredUnscramble("aelpp");

  assert.ok(appleWords.includes("apple"), "expected aelpp to include apple");
});

test("SB-002/SB-003/RH-004/TR-004: listen subset search keeps expected anagrams available without requiring unrelated letters", () => {
  const listenWords = getFilteredUnscramble("listen");

  for (const word of ["listen", "silent", "enlist"]) {
    assert.ok(
      listenWords.includes(word),
      `expected listen results to include ${word} when available`
    );
  }
});

test("SB-002/SB-003/FLT-002/RH-001/RH-004/TR-004: length filters keep alphabet searches as subset searches", () => {
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
});

test("SB-004/SB-005/FLT-006/RH-002/TR-004: blank filters and placeholders do not affect results", () => {
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
});


test("WQ-001/WQ-002/WQ-003/DD-002/DD-004/DD-005/RH-003/TR-004: dictionary-backed uncommon words remain available without generated strings", () => {
  const approvedWords = new Set(getAllWords());

  for (const letters of ["eta", "ers", "ems", "ret"]) {
    const words = getFilteredUnscramble(letters);

    assert.ok(words.length > 0, `expected ${letters} to return dictionary-backed words`);
    assert.ok(
      words.every((word) => approvedWords.has(word)),
      `expected every ${letters} result to be present in the approved dictionary source`
    );
  }

  for (const word of ["eta", "tae", "ers", "ems", "ret"]) {
    assert.ok(
      getFilteredUnscramble(word).includes(word),
      `expected uncommon approved dictionary word ${word} to remain available`
    );
  }

  assert.ok(
    !getFilteredUnscramble("zzq").includes("zzq"),
    "expected generated/non-dictionary strings to remain excluded"
  );
});

test("FLT-007/RH-006/TR-004: combined filters use AND logic without changing search ranking behavior", () => {
  const words = getFilteredUnscramble(alphabet, {
    length: 5,
    startsWith: "st",
    endsWith: "e",
    contains: "a",
  });

  assert.ok(words.length > 0, "expected combined-filter alphabet search results");
  assert.ok(words.includes("stare"), "expected known AND-match word to remain available");
  assert.ok(
    words.every(
      (word) => word.length === 5 &&
        word.startsWith("st") &&
        word.endsWith("e") &&
        word.includes("a")
    ),
    "expected every result to satisfy length, startsWith, endsWith, and contains filters"
  );
  words.forEach((word) => assertCanBuild(word, alphabet));
});

test("RH-007: grouped results sort by descending word length while preserving group order", () => {
  const words = ["ant", "zebra", "apple", "bee", "ox", "cat"];

  assert.deepEqual(groupWordsByLength(words), [
    { length: 5, words: ["zebra", "apple"] },
    { length: 3, words: ["ant", "bee", "cat"] },
    { length: 2, words: ["ox"] },
  ]);
});

test("WQ-005/RH-003/RH-005: default unscramble display hides documented low-value short entries without deleting rare-word access", () => {
  const defaultWords = getFilteredUnscramble("tislne");

  for (const word of ["tis", "ie", "ei", "ln", "nl", "ls", "tn", "sl", "lt", "tl"]) {
    assert.ok(
      !defaultWords.includes(word),
      `expected default display results to hide low-value short entry ${word}`
    );
  }

  for (const word of ["in", "is", "it"]) {
    assert.ok(
      defaultWords.includes(word),
      `expected common two-letter word ${word} to remain in default results`
    );
  }

  const rareWords = getFilteredUnscramble("tislne", {
    includeLowValueWords: true,
  });

  for (const word of ["tis", "ie", "ei", "ln", "nl", "ls", "tn", "sl", "lt", "tl"]) {
    assert.ok(
      rareWords.includes(word),
      `expected rare-word access to preserve source-backed entry ${word}`
    );
  }
});
