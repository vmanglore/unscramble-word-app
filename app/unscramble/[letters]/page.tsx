import type { Metadata } from "next";
import { getUnscramble } from "@/lib/engine/wordStore";
import { groupWordsByLength } from "@/lib/engine/wordsFromLetters";
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
  const cleanLetters = decodedLetters.toLowerCase().replace(/[^a-z]/g, "");
  const displayLetters = cleanLetters.toUpperCase();

  const words = getUnscramble(cleanLetters);
  const groups = groupWordsByLength(words);
  const topResult = words[0];
  const hasSingleResult = words.length === 1;
  const detailWord = topResult || cleanLetters;
  const detailLetters = Array.from(new Set(detailWord.toUpperCase().split(""))).sort();

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
            <div className="space-y-6">
              {groups.map((group) => (
                <section
                  key={group.length}
                  className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0"
                >
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    {group.length} Letter Words ({group.words.length})
                  </h3>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {group.words.map((word) => (
                      <span
                        key={word}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-base font-semibold text-slate-900 sm:px-4 sm:text-lg"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {detailWord && (
          <section className="mt-10 bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Word Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <div>
                <p className="text-sm text-slate-500">Letters searched</p>
                <p className="font-semibold text-slate-900">{displayLetters}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Best match</p>
                <p className="font-semibold text-slate-900">
                  {topResult ? topResult : "No valid word found"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Length</p>
                <p className="font-semibold text-slate-900">
                  {detailWord.length} {detailWord.length === 1 ? "letter" : "letters"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Starts / Ends</p>
                <p className="font-semibold text-slate-900">
                  {detailWord[0]?.toUpperCase()} / {detailWord[detailWord.length - 1]?.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-500 mb-2">Unique letters</p>
              <div className="flex flex-wrap gap-2">
                {detailLetters.map((letter) => (
                  <span
                    key={letter}
                    className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800 font-medium"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

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

        <RelatedLinks word={topResult} letters={cleanLetters} />
      </div>
    </main>
  );
}
