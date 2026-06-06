import type { Metadata } from "next";
import Link from "next/link";
import RelatedLinks from "@/components/RelatedLinks";
import WordsFromLettersResults from "@/components/WordsFromLettersResults";
import {
  getWordsFromLetters,
  getWordsFromLettersSummary,
  groupWordsByLength,
} from "@/lib/engine/wordsFromLetters";

type Props = {
  params: Promise<{
    letters: string;
  }>;
  searchParams: Promise<{
    length?: string;
  }>;
};

function cleanLetters(value = "") {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function buildDescription(displayLetters: string, summaries: { length: number }[]) {
  const lengthPhrases = summaries
    .slice(0, 3)
    .map((summary) => `${summary.length}-letter`)
    .join(", ");

  if (!lengthPhrases) {
    return `Find all words that can be made from the letters ${displayLetters}.`;
  }

  return `Find all words that can be made from the letters ${displayLetters} including ${lengthPhrases} words.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letters } = await params;
  const cleanSearchLetters = cleanLetters(decodeURIComponent(letters));
  const displayLetters = cleanSearchLetters.toUpperCase();
  const groups = groupWordsByLength(getWordsFromLetters(cleanSearchLetters));
  const summary = getWordsFromLettersSummary(groups);

  return {
    title: {
      absolute: `Words From Letters ${displayLetters} | Unscramble Word App`,
    },
    description: buildDescription(displayLetters, summary),
    keywords: [
      `words from letters ${cleanSearchLetters}`,
      `words made from ${cleanSearchLetters}`,
      `words with letters ${cleanSearchLetters}`,
      "scrabble words from letters",
      "word finder",
    ],
  };
}

export default async function WordsFromLettersDynamicPage({
  params,
  searchParams,
}: Props) {
  const { letters } = await params;
  const query = await searchParams;
  const cleanSearchLetters = cleanLetters(decodeURIComponent(letters));
  const displayLetters = cleanSearchLetters.toUpperCase();
  const length = query.length ?? "";

  const words = getWordsFromLetters(cleanSearchLetters, { length });
  const groups = groupWordsByLength(words);
  const summary = getWordsFromLettersSummary(groups);
  const topWord = words[0] ?? "";
  const firstLetter = topWord[0] ?? cleanSearchLetters[0] ?? "a";
  const endingLetter =
    topWord[topWord.length - 1] ??
    cleanSearchLetters[cleanSearchLetters.length - 1] ??
    "e";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase text-blue-600">
            Words From Letters
          </p>
          <h1 className="text-4xl font-bold text-slate-900">
            {length ? `${length} Letter Words From ` : "Words From Letters "}
            {displayLetters}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Find every valid word that can be made from the letters{" "}
            <strong>{displayLetters}</strong>. Letter frequency is respected, so
            each result only uses letters that are available.
          </p>
        </div>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Results Summary
              </h2>
              <p className="mt-1 text-slate-600">
                Total Words Found: {words.length}
              </p>
            </div>

            <Link
              href={`/words-from-letters?letters=${cleanSearchLetters}`}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Edit letters and filters
            </Link>
          </div>

          {summary.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
              {summary.map((item) => (
                <span key={item.length} className="rounded-lg bg-slate-100 px-3 py-1">
                  {item.length} Letter Words: {item.count}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <WordsFromLettersResults
            groups={groups}
            letters={cleanSearchLetters}
            showLengthLinks={!length}
          />
        </section>

        <section className="mt-10 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900">
            Related Searches
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/unscramble/${cleanSearchLetters}`}
              className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-200"
            >
              Unscramble {displayLetters}
            </Link>
            {summary.slice(0, 2).map((item) => (
              <Link
                key={item.length}
                href={`/words-from-letters/${cleanSearchLetters}?length=${item.length}`}
                className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-200"
              >
                {item.length} Letter Words from {displayLetters}
              </Link>
            ))}
            <Link
              href={`/words-starting-with/${firstLetter}`}
              className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-200"
            >
              Words Starting With {firstLetter.toUpperCase()}
            </Link>
            <Link
              href={`/words-ending-with/${endingLetter}`}
              className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-200"
            >
              Words Ending With {endingLetter.toUpperCase()}
            </Link>
          </div>
        </section>

        <RelatedLinks word={topWord} letters={cleanSearchLetters} />
      </div>
    </main>
  );
}
