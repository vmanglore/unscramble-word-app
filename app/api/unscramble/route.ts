import { unscrambleLetters } from "@/lib/engine/unscrambleEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const letters = searchParams.get("letters") || "";

  const words = await unscrambleLetters(letters);

  return Response.json({ words });
}