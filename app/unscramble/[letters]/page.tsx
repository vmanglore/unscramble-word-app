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
  const decodedLetters = decodeURIComponent(letters);
  const displayLetters = decodedLetters.toUpperCase();

  return {
    title: `Unscramble ${displayLetters} | Word Solver`,
    description: `Find all valid English words from the scrambled letters ${displayLetters} using our fast anagram solver.`,
    keywords: ["unscramble words", "anagram solver", "word finder", decodedLetters],
  };
}

export default async function Page({ params }: Props) {
  const { letters } = await params;
  const decodedLetters = decodeURIComponent(letters);
  const displayLetters = decodedLetters.toUpperCase();

  const words = getUnscramble(decodedLetters);
  const topResult = words[0];
  const hasSingleResult = words.length === 1;
  const sortedWords = [...words].sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    return a.localeCompare(b);
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">
          Unscramble {displayLetters}
        </h1>

        <p className="text-slate-600 mb-6">
          {hasSingleResult && topResult ? (
            <>
              The letters <strong>{displayLetters}</strong> can be rearranged
              to form <strong>{topResult}</strong>.
            </>
          ) : (
            <>
              Find all valid words formed from the scrambled letters{" "}
              <strong>{displayLetters}</strong>.
            </>
          )}
        </p>

        <div className="mb-6 text-sm text-slate-500">
          {words.length} {words.length === 1 ? "word" : "words"} found
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {words.length === 1 ? "Matching Word" : "Matching Words"}
          </h2>

          {words.length === 0 ? (
            <p className="text-slate-500">No words found.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {sortedWords.map((word) => (
                <span
                  key={word}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-slate-900 font-semibold text-lg"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>

        <section className="mt-10 prose max-w-none">
          <h2 className="text-2xl font-semibold mb-3">
            Words formed from {displayLetters}
          </h2>

          <p className="text-slate-700">
            {hasSingleResult && topResult ? (
              <>
                The letters <strong>{displayLetters}</strong> can be rearranged
                to form <strong>{topResult}</strong>. Use this word solver for
                anagrams, Scrabble, Words With Friends, crossword puzzles, and
                vocabulary building.
              </>
            ) : (
              <>
                Use our word finder to discover valid English words that can be
                formed from the letters <strong>{displayLetters}</strong>. This
                tool is useful for word games, anagrams, Scrabble, Words With
                Friends, crossword puzzles, and vocabulary building.
              </>
            )}
          </p>
        </section>

        <div className="mt-10">
          <RelatedLinks />
        </div>
      </div>
    </main>
  );
}
