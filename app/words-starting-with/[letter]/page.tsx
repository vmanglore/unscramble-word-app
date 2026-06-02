import { getWordsByStart } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{ letter: string }>;
};

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

      {/* Related Links */}
      <div className="mt-10">
        <RelatedLinks />
      </div>
    </main>
  );
}