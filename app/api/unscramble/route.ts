import {
  getFilteredUnscramble,
  getWordDefinition,
} from "@/lib/engine/wordStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const letters = searchParams.get("letters") || "";
  const length = searchParams.get("length") || "";
  const startsWith = searchParams.get("startsWith") || "";
  const endsWith = searchParams.get("endsWith") || "";
  const contains = searchParams.get("contains") || "";

  const words = getFilteredUnscramble(letters, {
    length,
    startsWith,
    endsWith,
    contains,
  });

  const definitionsByWord = Object.fromEntries(
    words.map((word) => [word, getWordDefinition(word) || ""])
  );

  const bestWord = words[0];
  const definition = bestWord ? definitionsByWord[bestWord] : undefined;

  return Response.json({ words, bestWord, definition, definitionsByWord });
}
