import type { Metadata } from "next";
import { getWordsByStart } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{ letter: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letter } = await params;

  return {
    title: `Words Starting With ${letter.toUpperCase()} | Unscramble Word Now`,
    description: `Find words that start with ${letter.toUpperCase()} for Scrabble, Words With Friends, crossword puzzles, and vocabulary building.`,
  };
}

export default async function Page({ params }: Props) {
  const { letter } = await params;

  const words = getWordsByStart(letter);

  return (
    <main className="p-10">
      <h1>Words starting with {letter}</h1>
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
          Words Beginning With {letter.toUpperCase()}
        </h2>

        <p>
          Browse words that start with {letter.toUpperCase()} for word games,
          crossword puzzles, Scrabble, Words With Friends, and vocabulary
          practice. This page helps you quickly find matching words by starting
          letter.
        </p>
      </section>

      {/* Related Links */}
      <div className="mt-10">
        <RelatedLinks
          startsWith={letter}
          title="Browse similar words"
          currentPath={`/words-starting-with/${letter.toLowerCase()}`}
        />
      </div>
    </main>
  );
}
