type Props = {
  pattern?: string;
  word?: string;
  letters?: string;
};

type LinkItem = {
  href: string;
  label: string;
};

function uniqueLinks(links: LinkItem[]) {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export default function RelatedLinks({ pattern, word, letters }: Props) {
  const cleanWord = word?.toLowerCase().replace(/[^a-z]/g, "");
  const cleanLetters = letters?.toLowerCase().replace(/[^a-z]/g, "");

  const firstLetter = cleanWord?.[0] ?? cleanLetters?.[0] ?? "a";
  const ending = cleanWord && cleanWord.length >= 3 ? cleanWord.slice(-3) : "ing";
  const length = cleanWord?.length ?? cleanLetters?.length ?? 5;
  const example = cleanLetters || "aelpp";

  const links = uniqueLinks([
    {
      href: `/words-starting-with/${firstLetter}`,
      label: `Words starting with ${firstLetter.toUpperCase()}`,
    },
    {
      href: `/words-ending-with/${ending}`,
      label: `Words ending with ${ending.toUpperCase()}`,
    },
    {
      href: `/word-length/${length}`,
      label: `${length}-letter words`,
    },
    {
      href: `/unscramble/${example}`,
      label: `Unscramble ${example.toUpperCase()}`,
    },
  ]);

  return (
    <section className="mt-10 bg-white rounded-2xl shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Related Searches</h2>
        {(pattern || cleanWord || cleanLetters) && (
          <p className="text-sm text-slate-500 mt-1">
            More word lists related to{" "}
            <strong>{(pattern || cleanWord || cleanLetters)?.toUpperCase()}</strong>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 font-medium transition"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
