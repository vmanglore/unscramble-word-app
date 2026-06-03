const exampleWords = [
  "apple",
  "table",
  "stone",
  "plant",
  "chair",
  "heart",
  "water",
  "light",
  "green",
  "house",
  "dream",
  "world",
];

/**
 * Returns stable static word suggestions for the homepage.
 *
 * This intentionally avoids deriving the list from JSON data or using random
 * ordering because the homepage is a client component that is pre-rendered on
 * the server and then hydrated in the browser.
 */
export function getTrendingWords(limit = 12): string[] {
  return exampleWords.slice(0, limit);
}
