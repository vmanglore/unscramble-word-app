import type { Metadata } from "next";
import { getWordsByEnd } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{ suffix: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suffix } = await params;

  return {
    title: `Words Ending With ${suffix} | Unscramble Word Now`,
    description: `Find words ending with ${suffix} for Scrabble, crossword puzzles, word games, and vocabulary building.`,
  };
}

export default async function Page({ params }: Props) {
  const { suffix } = await params;

  const words = getWordsByEnd(suffix);

  return (
    <main className="p-10">
      <h1>Words ending with {suffix}</h1>
      <p>{words.length} words found</p>

      {/* Results */}
      <div className="mt-4 flex flex-wrap gap-2">
        {words.map((word) => (
          <span
            key={word}
            className="px-3 py-1 bg-slate-100 rounded-md"
          >
            {word}
          </span>
        ))}
      </div>

      {/* SEO Content */}
      <section className="mt-10 max-w-3xl text-slate-700">
        <h2 className="text-2xl font-semibold mb-3">
          Words That End With &quot;{suffix}&quot;
        </h2>

        <p>
          Browse words ending with {suffix} for crossword puzzles, Scrabble,
          Words With Friends, anagrams, and vocabulary practice. This page helps
          you quickly find matching words by ending pattern.
        </p>
      </section>

      {/* Related Links */}
      <div className="mt-10">
        <RelatedLinks />
      </div>
    </main>
  );
}
