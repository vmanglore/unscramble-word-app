import { findWords } from "@/lib/engine/wordStore";

export const metadata = {
  title: "Word Finder",
  description:
    "Find words by length, starting letters, ending letters, and contained letters.",
};

type Props = {
  searchParams: Promise<{
    length?: string;
    startsWith?: string;
    endsWith?: string;
    contains?: string;
  }>;
};

const inputClass =
  "w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-300 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500";

export default async function WordFinderPage({ searchParams }: Props) {
  const params = await searchParams;

  const length = params.length || "";
  const startsWith = params.startsWith || "";
  const endsWith = params.endsWith || "";
  const contains = params.contains || "";

  const hasSearch = Boolean(length || startsWith || endsWith || contains);

  const words = hasSearch
    ? findWords({
        length,
        startsWith,
        endsWith,
        contains,
        limit: 500,
      })
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Word Finder
        </h1>

        <p className="text-slate-600 mb-8">
          Find words by length, starting letters, ending letters, or contained letters.
        </p>

        <form
          action="/word-finder"
          method="GET"
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Starts with
              </label>
              <input
                type="text"
                name="startsWith"
                defaultValue={startsWith}
                className={inputClass}
                placeholder="st"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Ends with
              </label>
              <input
                type="text"
                name="endsWith"
                defaultValue={endsWith}
                className={inputClass}
                placeholder="h"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
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

          <button
            type="submit"
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
          >
            Find Words
          </button>
        </form>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          {!hasSearch ? (
            <p className="text-slate-500">
              Enter one or more filters above and click Find Words.
            </p>
          ) : words.length === 0 ? (
            <p className="text-slate-500">No words found.</p>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">
                {words.length} {words.length === 1 ? "word" : "words"} found
              </p>

              <div className="flex flex-wrap gap-2">
                {words.map((word) => (
                  <a
                    key={word}
                    href={`/unscramble/${word}`}
                    className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium"
                  >
                    {word}
                  </a>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}