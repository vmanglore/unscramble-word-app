"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestions } from "@/lib/engine/autocomplete";
import { getTrendingWords } from "@/lib/engine/trending";
import { groupWordsByLength } from "@/lib/engine/wordsFromLetters";

const inputClass =
  "w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-300 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function Page() {
  const [selectedWord, setSelectedWord] = useState("");
  const [definitionsByWord, setDefinitionsByWord] = useState<Record<string, string>>({});
  const [letters, setLetters] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searchedLetters, setSearchedLetters] = useState("");
  const [definition, setDefinition] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lengthFilter, setLengthFilter] = useState("");
  const [startsWithFilter, setStartsWithFilter] = useState("");
  const [endsWithFilter, setEndsWithFilter] = useState("");
  const [containsFilter, setContainsFilter] = useState("");

  const router = useRouter();

  const trending = getTrendingWords(12);
  const resultGroups = groupWordsByLength(results);
  const activeWord = selectedWord || results[0];
  const detailLetters = activeWord
    ? Array.from(new Set(activeWord.toUpperCase().split(""))).sort()
    : [];

  function resetSearch() {
    setLetters("");
    setResults([]);
    setDefinition("");
    setSearchedLetters("");
    setError("");
    setSuggestions([]);
    setLengthFilter("");
    setStartsWithFilter("");
    setEndsWithFilter("");
    setContainsFilter("");
    setSelectedWord("");
    setDefinitionsByWord({});
  }

  function handleInputChange(value: string) {
    setLetters(value);
    setSuggestions(getSuggestions(value));
  }

  async function handleSearch(queryOverride?: string) {
    const query = (queryOverride ?? letters).trim().toLowerCase();

    if (!query) {
      setResults([]);
      setDefinition("");
      setSearchedLetters("");
      setError("Please enter some letters.");
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      letters: query,
      length: lengthFilter,
      startsWith: startsWithFilter,
      endsWith: endsWithFilter,
      contains: containsFilter,
    });

    try {
      const response = await fetch(`/api/unscramble?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      const words = data.words || [];

      setResults(words);
      setSelectedWord(data.bestWord || "");
      setDefinitionsByWord(data.definitionsByWord || {});
      setDefinition(data.definition || "");
      setSearchedLetters(query.toUpperCase());
      setSuggestions([]);
    } catch {
      setError("Something went wrong. Please try again.");
      setResults([]);
      setDefinition("");
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Enter letters
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
            placeholder="aelpp"
            className="w-full border border-slate-300 rounded-xl p-4 text-lg placeholder:text-slate-300 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            {showAdvanced ? "Hide Advanced Filters ▲" : "Advanced Filters ▼"}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Number of letters
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={lengthFilter}
                  onChange={(e) => setLengthFilter(e.target.value)}
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
                  value={startsWithFilter}
                  onChange={(e) => setStartsWithFilter(e.target.value)}
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
                  value={endsWithFilter}
                  onChange={(e) => setEndsWithFilter(e.target.value)}
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
                  value={containsFilter}
                  onChange={(e) => setContainsFilter(e.target.value)}
                  className={inputClass}
                  placeholder="ea"
                />
              </div>
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
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <button
                  onClick={resetSearch}
                  className="text-sm text-blue-600 hover:underline mb-2"
                >
                  ← New Search
                </button>

                <h2 className="text-2xl font-semibold text-slate-900">
                  Matching Words
                </h2>

                {searchedLetters && (
                  <p className="mt-1 break-words text-sm text-slate-500">
                    {results.length} {results.length === 1 ? "word" : "words"} found for {searchedLetters}
                  </p>
                )}
              </div>

              {searchedLetters && (
                <button
                  onClick={() =>
                    router.push(`/unscramble/${searchedLetters.toLowerCase()}`)
                  }
                  className="self-start whitespace-nowrap text-sm text-blue-600 hover:underline"
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
                <div className="space-y-6">
                  {resultGroups.map((group) => (
                    <section
                      key={group.length}
                      className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0"
                    >
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">
                        {group.length} Letter Words ({group.words.length})
                      </h3>

                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {group.words.map((word) => (
                          <button
                            key={word}
                            onClick={() => {
                              setSelectedWord(word);
                              setDefinition(definitionsByWord[word] || "");
                            }}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-base font-semibold text-slate-900 transition hover:bg-slate-200 sm:px-4 sm:text-lg"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {activeWord && (
                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Word Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Best match</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {activeWord}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Length</p>
                        <p className="font-semibold text-slate-900">
                          {activeWord.length} {activeWord.length === 1 ? "letter" : "letters"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Starts / Ends</p>
                        <p className="font-semibold text-slate-900">
                          {activeWord[0]?.toUpperCase()} / {activeWord[activeWord.length - 1]?.toUpperCase()}
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

                    <section className="mt-10 bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Trending Words
                      </h2>

                      <div className="flex flex-wrap gap-2">
                        {trending.map((word) => (
                          <button
                            key={word}
                            onClick={() => {
                              setLetters(word);
                              handleSearch(word);
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-sm"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </section>

                    {definition && (
                      <div className="mt-6 border-t border-slate-200 pt-4">
                        <p className="text-sm text-slate-500 mb-2">Definition</p>
                        <p className="text-slate-700 leading-7">
                          {definition}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
