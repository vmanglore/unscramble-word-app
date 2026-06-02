import Link from "next/link";
import {
  getRelatedPatterns,
} from "@/lib/seo/internalLinks";

/**
 * Shows internal links to improve SEO + crawl depth
 */
export default function RelatedLinks({
  pattern,
}: {
  pattern: string;
}) {
  const related = getRelatedPatterns(pattern);

  return (
    <div className="mt-10">
      <h3 className="font-semibold mb-3">
        Related Searches
      </h3>

      <div className="flex flex-wrap gap-2">
        {related.map((p) => (
          <Link
            key={p}
            href={`/words-with-pattern/${p}`}
            className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 text-sm"
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}