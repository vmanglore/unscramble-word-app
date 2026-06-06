import Link from "next/link";
import type { WordLengthGroup } from "@/lib/engine/wordsFromLetters";

type Props = {
  groups: WordLengthGroup[];
  letters: string;
  showLengthLinks?: boolean;
};

export default function WordsFromLettersResults({
  groups,
  letters,
  showLengthLinks = false,
}: Props) {
  if (groups.length === 0) {
    return <p className="text-slate-500">No words found.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.length} className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {group.length} Letter Words ({group.words.length})
            </h2>

            {showLengthLinks && (
              <Link
                href={`/words-from-letters/${letters}?length=${group.length}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View {group.length} letter words
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {group.words.map((word) => (
              <Link
                key={word}
                href={`/unscramble/${word}`}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                {word}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
