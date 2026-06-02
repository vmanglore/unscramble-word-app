import { getWordsByEnd } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{ suffix: string }>;
};

export default async function Page({ params }: Props) {
  const { suffix } = await params;

  const words = getWordsByEnd(suffix);

  return (
    <main className="p-10">
      <h1>Words ending with {suffix}</h1>
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

      {/* Related Links (correct placement) */}
      <div className="mt-10">
        <RelatedLinks />
      </div>
    </main>
  );
}