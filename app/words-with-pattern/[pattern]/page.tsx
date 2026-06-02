import { findByPattern } from "@/lib/engine/search";
import { buildPatternContent } from "@/lib/seo/content";
import RelatedLinks from "@/components/RelatedLinks";

type Props = {
  params: {
    pattern: string;
  };
};

export default function Page({ params }: Props) {
  const pattern = params.pattern;

  const words = findByPattern(pattern);

  const content = buildPatternContent(pattern, words.length);

  return (
    <main className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold">
        {content.title}
      </h1>

      <p className="mt-3 text-gray-600">
        {content.description}
      </p>

      <div className="mt-6 text-gray-700">
        {content.intro}
      </div>

      <div className="mt-4 font-semibold">
        {content.stats}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {words.map((word) => (
          <span
            key={word}
            className="px-3 py-1 bg-gray-100 rounded-full"
          >
            {word}
          </span>
        ))}
      </div>

      <div className="mt-10 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        {content.seoBlock}
      </div>

      <RelatedLinks pattern={pattern} />
    </main>
  );
}