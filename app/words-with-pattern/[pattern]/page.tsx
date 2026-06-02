import { findByPattern } from "@/lib/engine/search";
import { buildPatternContent } from "@/lib/seo/content";
import RelatedLinks from "@/components/seo/RelatedLinks";

/**
 * SEO optimized pattern page
 */
export default function Page({
  params,
}: {
  params: { pattern: string };
}) {
  const words = findByPattern(params.pattern);

  const content = buildPatternContent(
    params.pattern,
    words.length
  );

  return (
    <main className="max-w-3xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold">
        {content.title}
      </h1>

      {/* Description */}
      <p className="mt-3 text-gray-600">
        {content.description}
      </p>

      {/* Intro block */}
      <div className="mt-6 text-gray-700 leading-relaxed">
        {content.intro}
      </div>

      {/* Stats */}
      <div className="mt-4 font-semibold">
        {content.stats}
      </div>

      {/* Results */}
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

      {/* SEO content block (VERY IMPORTANT) */}
      <div className="mt-10 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        {content.seoBlock}
      </div>

      {/* Internal linking */}
      <RelatedLinks pattern={params.pattern} />
    </main>
  );
}