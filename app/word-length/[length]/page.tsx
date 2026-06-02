import type { Metadata } from "next";
import { getWordsByLength } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{ length: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { length } = await params;

  return {
    title: `${length} Letter Words | Unscramble Word Now`,
    description: `Find ${length} letter words for word games, puzzles, Scrabble, and vocabulary building.`,
  };
}

export default async function Page({ params }: Props) {
  const { length } = await params;

  const words = getWordsByLength(length);

  return (
    <main className="p-10">
      <h1>Words with {length} letters</h1>
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
          {length} Letter Word Finder
        </h2>
        <p>
          Browse words with {length} letters for word games, anagrams,
          crossword puzzles, Scrabble, Words With Friends, and vocabulary
          practice.
        </p>
      </section>

      {/* Related Links */}
      <div className="mt-10">
        <RelatedLinks />
      </div>
    </main>
  );
}