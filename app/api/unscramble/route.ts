import { getUnscramble } from "@/lib/engine/wordStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const letters = searchParams.get("letters") || "";
  const words = getUnscramble(letters);

  return Response.json({ words });
}
