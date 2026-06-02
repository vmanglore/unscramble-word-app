export function getRelatedPatterns(pattern: string) {
  const suggestions: string[] = [];

  if (!pattern) return [];

  // Replace one character at a time with wildcard
  for (let i = 0; i < pattern.length; i++) {
    const arr = pattern.split("");
    arr[i] = "_";
    suggestions.push(arr.join(""));
  }

  return suggestions.slice(0, 5);
}

/**
 * Get related starting letters pages
 */
export function getRelatedStarts(letter: string) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  return alphabet
    .split("")
    .filter((l) => l !== letter)
    .slice(0, 5);
}

/**
 * Get related word lengths
 */
export function getRelatedLengths(length: number) {
  return [length - 1, length + 1, length + 2].filter((n) => n > 1);
}