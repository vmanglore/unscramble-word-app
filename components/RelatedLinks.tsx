import Link from "next/link";

type Props = {
  pattern?: string;
  word?: string;
  letters?: string;
  length?: string | number;
  startsWith?: string;
  suffix?: string;
  title?: string;
  currentPath?: string;
};

type LinkItem = {
  href: string;
  label: string;
};

function cleanText(value?: string | number) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function cleanLetters(value?: string) {
  return value?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
}

function normalizeLength(value?: string | number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) return undefined;
  if (parsed < 1 || parsed > 15) return undefined;

  return parsed;
}

function uniqueLinks(links: LinkItem[]) {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function addLengthLinks(links: LinkItem[], length?: number) {
  if (!length) return;

  const lengths = uniqueLinks(
    [length, length - 1, length + 1]
      .filter((value) => value >= 2 && value <= 15)
      .map((value) => ({
        href: `/word-length/${value}`,
        label: `${value} Letter Words`,
      })),
  );

  links.push(...lengths);
}

export default function RelatedLinks({
  pattern,
  word,
  letters,
  length,
  startsWith,
  suffix,
  title = "Related word searches",
  currentPath,
}: Props) {
  const cleanWord = cleanLetters(word);
  const cleanSearchLetters = cleanLetters(letters);
  const cleanPattern = cleanText(pattern);
  const cleanStartsWith = cleanLetters(startsWith).slice(0, 1);
  const cleanSuffix = cleanLetters(suffix).slice(-4);

  const firstLetter = cleanStartsWith || cleanWord[0] || cleanSearchLetters[0] || "a";
  const ending =
    cleanSuffix ||
    (cleanWord.length >= 2 ? cleanWord.slice(-2) : "") ||
    (cleanSearchLetters.length >= 2 ? cleanSearchLetters.slice(-2) : "") ||
    "ing";
  const activeLength =
    normalizeLength(length) || cleanWord.length || cleanSearchLetters.length || 5;
  const example = cleanSearchLetters || cleanWord || "aelpp";
  const links: LinkItem[] = [
    {
      href: "/",
      label: "Unscramble Words",
    },
    {
      href: "/word-finder",
      label: "Word Finder",
    },
    {
      href: "/words-from-letters",
      label: "Words From Letters",
    },
  ];

  addLengthLinks(links, activeLength);

  links.push(
    {
      href: `/words-starting-with/${firstLetter}`,
      label: `Words Starting With ${firstLetter.toUpperCase()}`,
    },
    {
      href: `/words-ending-with/${ending}`,
      label: `Words Ending With ${ending.toUpperCase()}`,
    },
    {
      href: `/unscramble/${example}`,
      label: `Unscramble ${example.toUpperCase()}`,
    },
    {
      href: `/words-from-letters/${example}`,
      label: `Words From Letters ${example.toUpperCase()}`,
    },
  );

  const relatedStartingLetters = ["s", "t", "a"].filter(
    (letter) => letter !== firstLetter,
  );
  links.push(
    ...relatedStartingLetters.slice(0, 2).map((letter) => ({
      href: `/words-starting-with/${letter}`,
      label: `Words Starting With ${letter.toUpperCase()}`,
    })),
  );

  const displayContext =
    cleanPattern || cleanWord || cleanSearchLetters || cleanStartsWith || cleanSuffix;

  return (
    <section className="mt-10 bg-white rounded-2xl shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {displayContext && (
          <p className="text-sm text-slate-500 mt-1">
            More word lists related to{" "}
            <strong>{displayContext.toUpperCase()}</strong>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {uniqueLinks(links)
          .filter((link) => link.href !== currentPath)
          .slice(0, 10)
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
      </div>
    </section>
  );
}
