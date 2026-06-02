import { NextResponse } from "next/server";
import { unscramble } from "@/lib/engine/unscrambleEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const letters = searchParams.get("letters") || "";

  const words = unscramble(letters);

  return NextResponse.json({ words });
}