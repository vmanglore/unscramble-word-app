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

  const bestWord = words[0];
  const definition = bestWord ? getWordDefinition(bestWord) : undefined;

  return Response.json({ words, bestWord, definition });
}
