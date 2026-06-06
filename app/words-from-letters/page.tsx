import type { Metadata } from "next";
import Link from "next/link";
import WordsFromLettersResults from "@/components/WordsFromLettersResults";
import {
  getWordsFromLetters,
  getWordsFromLettersSummary,
  groupWordsByLength,
} from "@/lib/engine/wordsFromLetters";

export const metadata: Metadata = {
  title: "Words From Letters",
  description:
    "Find all valid words that can be made from your letters, grouped by word length with advanced filters.",
};

type Props = {
  searchParams: Promise<{
    letters?: string;
    length?: string;
    startsWith?: string;
    endsWith?: string;
    contains?: string;
  }>;
};

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-300 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500";

function cleanLetters(value = "") {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

export default async function WordsFromLettersPage({ searchParams }: Props) {
  const params = await searchParams;

  const letters = params.letters ?? "";
  const length = params.length ?? "";
  const startsWith = params.startsWith ?? "";
  const endsWith = params.endsWith ?? "";
  const contains = params.contains ?? "";
  const cleanSearchLetters = cleanLetters(letters);
  const displayLetters = cleanSearchLetters.toUpperCase();
  const hasSearch = Boolean(cleanSearchLetters);

  const words = hasSearch
    ? getWordsFromLetters(cleanSearchLetters, {
        length,
        startsWith,
        endsWith,
        contains,
      })
    : [];

  const groups = groupWordsByLength(words);
  const summary = getWordsFromLettersSummary(groups);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Words From Letters
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Enter letters to find every valid word that can be made from them.
          </p>
        </div>

        <form
          action="/words-from-letters"
          method="GET"
          className="mb-8 rounded-2xl bg-white p-6 shadow-lg"
        >
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Letters
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              name="letters"
              defaultValue={letters}
              className={inputClass}
              placeholder="aelpp"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Find Words
            </button>
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-blue-600">
              Advanced Filters
            </summary>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Number of letters
                </label>
                <input
                  type="number"
                  name="length"
                  min="1"
                  step="1"
                  defaultValue={length}
                  className={inputClass}
                  placeholder="5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Starts with
                </label>
                <input
                  type="text"
                  name="startsWith"
                  defaultValue={startsWith}
                  className={inputClass}
                  placeholder="a"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Ends with
                </label>
                <input
                  type="text"
                  name="endsWith"
                  defaultValue={endsWith}
                  className={inputClass}
                  placeholder="e"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Contains
                </label>
                <input
                  type="text"
                  name="contains"
                  defaultValue={contains}
                  className={inputClass}
                  placeholder="ea"
                />
              </div>
            </div>
          </details>
        </form>

        <section className="rounded-2xl bg-white p-6 shadow-lg">
          {!hasSearch ? (
            <p className="text-slate-500">
              Enter letters above to see grouped word results.
            </p>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Words From Letters {displayLetters}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Total Words Found: {words.length}
                  </p>
                </div>

                <Link
                  href={`/words-from-letters/${cleanSearchLetters}`}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Open indexable page
                </Link>
              </div>

              {summary.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 text-sm text-slate-600">
                  {summary.map((item) => (
                    <span key={item.length} className="rounded-lg bg-slate-100 px-3 py-1">
                      {item.length} Letter Words: {item.count}
                    </span>
                  ))}
                </div>
              )}

              <WordsFromLettersResults groups={groups} letters={cleanSearchLetters} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
