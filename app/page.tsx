"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestions } from "@/lib/engine/autocomplete";
import { getTrendingWords } from "@/lib/engine/trending";

export default function Page() {
  const [letters, setLetters] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searchedLetters, setSearchedLetters] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const trending = getTrendingWords(12);
  const sortedResults = [...results].sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    return a.localeCompare(b);
  });
  const topResult = sortedResults[0];
  const detailLetters = topResult
    ? Array.from(new Set(topResult.toUpperCase().split(""))).sort()
    : [];

  function handleInputChange(value: string) {
    setLetters(value);
    setSuggestions(getSuggestions(value));
  }

  async function handleSearch(queryOverride?: string) {
    const query = (queryOverride ?? letters).trim().toLowerCase();

    if (!query) {
      setResults([]);
      setSearchedLetters("");
      setError("Please enter some letters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/unscramble?letters=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      const words = data.words || [];

      setResults(words);
      setSearchedLetters(query.toUpperCase());
      setSuggestions([]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResults([]);
      setSearchedLetters("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Unscramble Words
          </h1>

          <p className="text-lg text-slate-600">
            Enter scrambled letters and find all valid English words.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Letters
          </label>

          <input
            id="letters"
            type="text"
            value={letters}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="e.g. aelpp"
            className="w-full border border-slate-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {suggestions.length > 0 && (
            <div className="border rounded-lg mt-2 bg-white shadow max-h-48 overflow-auto">
              {suggestions.map((word) => (
                <div
                  key={word}
                  onClick={() => {
                    setLetters(word);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                >
                  {word}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-xl p-4 transition"
          >
            {loading ? "Searching..." : "Unscramble"}
          </button>
        </section>

        {(searchedLetters || error) && (
          <section className="mt-10 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Matching Words
                </h2>
                {searchedLetters && (
                  <p className="text-sm text-slate-500 mt-1">
                    {results.length} {results.length === 1 ? "word" : "words"} found for {searchedLetters}
                  </p>
                )}
              </div>

              {searchedLetters && (
                <button
                  onClick={() => router.push(`/unscramble/${searchedLetters.toLowerCase()}`)}
                  className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                >
                  Open result page
                </button>
              )}
            </div>

            {error ? (
              <p className="text-red-600 text-sm">{error}</p>
            ) : results.length === 0 ? (
              <p className="text-slate-500">No words found.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  {sortedResults.map((word) => (
                    <button
                      key={word}
                      onClick={() =>
                        router.push(`/words-starting-with/${word[0]}`)
                      }
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900 font-semibold text-lg transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {topResult && (
                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Word Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Best match</p>
                        <p className="font-semibold text-slate-900">{topResult}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Length</p>
                        <p className="font-semibold text-slate-900">
                          {topResult.length} {topResult.length === 1 ? "letter" : "letters"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Starts / Ends</p>
                        <p className="font-semibold text-slate-900">
                          {topResult[0]?.toUpperCase()} / {topResult[topResult.length - 1]?.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-slate-500 mb-2">Unique letters</p>
                      <div className="flex flex-wrap gap-2">
                        {detailLetters.map((letter) => (
                          <span
                            key={letter}
                            className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800 font-medium text-sm"
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <section className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Trending Words
          </h2>

          <div className="flex flex-wrap gap-2">
            {trending.map((word) => (
              <button
                key={word}
                onClick={() => setLetters(word)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-sm"
              >
                {word}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
