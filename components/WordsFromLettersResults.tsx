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
      {groups.map((group, index) => (
        <details
          key={group.length}
          open={index === 0}
          className="group border-t border-slate-200 pt-5 first:border-t-0 first:pt-0"
        >
          <summary className="mb-3 cursor-pointer list-none rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <h2 className="text-xl font-semibold text-slate-900">
              <span className="mr-2 inline-block text-slate-500 transition group-open:rotate-90">
                &gt;
              </span>
              {group.length} Letter Words ({group.words.length})
            </h2>
          </summary>

          {showLengthLinks && (
            <Link
              href={`/words-from-letters/${letters}?length=${group.length}`}
              className="mb-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View {group.length} letter words
            </Link>
          )}

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
        </details>
      ))}
    </div>
  );
}
