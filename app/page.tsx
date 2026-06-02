"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestions } from "@/lib/engine/autocomplete";
import { getTrendingWords } from "@/lib/engine/trending";

export default function Page() {
  const [letters, setLetters] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const trending = getTrendingWords(12);

  function handleInputChange(value: string) {
    setLetters(value);
    setSuggestions(getSuggestions(value));
  }

  async function handleSearch(queryOverride?: string) {
    const query = (queryOverride ?? letters).trim().toLowerCase();

    if (!query) {
      setResults([]);
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
      setSuggestions([]);

      if (words.length === 1) {
        router.push(`/unscramble/${query}`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Unscramble Words
          </h1>

          <p className="text-lg text-slate-600">
            Enter scrambled letters and find all valid English words.
          </p>
        </header>

        {/* Search Card */}
        <section className="bg-white rounded-2xl shadow-lg p-6">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Letters
          </label>

          <input
            id="letters"
            type="text"
            value={letters}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="e.g. aelpp"
            className="w-full border border-slate-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* AUTOCOMPLETE */}
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

          {error && (
            <p className="mt-4 text-red-600 text-sm">{error}</p>
          )}
        </section>

        {/* 🔥 TRENDING SECTION (NEW) */}
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

        {/* Results */}
        <section className="mt-10 bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Results
          </h2>

          {results.length === 0 ? (
            <p className="text-slate-500">
              Enter letters and click Unscramble.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {results.map((word) => (
                <button
                  key={word}
                  onClick={() =>
                    router.push(`/words-starting-with/${word[0]}`)
                  }
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 font-medium transition"
                >
                  {word}
                </button>
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}