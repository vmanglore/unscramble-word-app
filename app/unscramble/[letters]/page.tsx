import type { Metadata } from "next";
import { getUnscramble } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{
    letters: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { letters } = await params;

  return {
    title: `Unscramble "${letters}" | Word Solver`,
    description: `Find all valid English words from the letters "${letters}" using our fast anagram solver.`,
    keywords: ["unscramble words", "anagram solver", "word finder", letters],
  };
}

export default async function Page({ params }: Props) {
  const { letters } = await params;

  const words = getUnscramble(letters);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">
          Unscramble "{letters}"
        </h1>

        <p className="text-slate-600 mb-6">
          Find all valid words formed from these letters.
        </p>

        {/* Stats */}
        <div className="mb-6 text-sm text-slate-500">
          {words.length} word(s) found
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl shadow p-6">
          {words.length === 0 ? (
            <p className="text-slate-500">No words found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {words.map((word) => (
                <span
                  key={word}
                  className="px-3 py-2 bg-slate-100 rounded-lg text-slate-800"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEO Content */}
        <section className="mt-10 prose max-w-none">
          <h2 className="text-2xl font-semibold mb-3">
            Words from "{letters}"
          </h2>

          <p className="text-slate-700">
            Use our word finder to discover valid English words that can be
            formed from the letters <strong>{letters}</strong>. This tool is
            useful for word games, anagrams, Scrabble, Words With Friends,
            crossword puzzles, and vocabulary building.
          </p>

          {words.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-3">
                Matching Words
              </h3>

              <ul className="list-disc pl-6">
                {words.map((word) => (
                  <li key={`list-${word}`}>{word}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* RELATED LINKS (FIXED POSITION) */}
        <div className="mt-10">
          <RelatedLinks />
        </div>
      </div>
    </main>
  );
}