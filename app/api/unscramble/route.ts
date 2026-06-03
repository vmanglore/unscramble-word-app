import { getUnscramble, getWordDefinition } from "@/lib/engine/wordStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const letters = searchParams.get("letters") || "";
  const words = getUnscramble(letters);
  const bestWord = words[0];
  const definition = bestWord ? getWordDefinition(bestWord) : undefined;

  return Response.json({ words, bestWord, definition });
}