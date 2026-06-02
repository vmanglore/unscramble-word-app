import { getWordsByLength } from "@/lib/engine/wordStore";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: Promise<{ length: string }>;
};

export default async function Page({ params }: Props) {
  const { length } = await params;

  const words = getWordsByLength(length);

  return (
    <main className="p-10">
      <h1>Words with {length} letters</h1>
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