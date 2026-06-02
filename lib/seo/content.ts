export function buildPatternContent(pattern: string, count: number) {
  return {
    title: `Words matching "${pattern}"`,
    
    description: `Find all words that match the pattern "${pattern}". 
This includes anagrams and valid dictionary words filtered by structure.`,

    intro: `
The pattern "${pattern}" helps you find words that match a specific structure.
Wildcards like "_" or "?" represent any letter.
    `,

    stats: `We found ${count} possible matches for this pattern.`,

    seoBlock: `
Use this tool to solve word puzzles, Scrabble challenges, and word games.
Try variations like:
- ${pattern.replace(/_/g, "a")}
- ${pattern.replace(/_/g, "e")}
- ${pattern.replace(/_/g, "o")}
    `,
  };
}