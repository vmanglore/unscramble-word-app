import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Unscramble Word Now
        </Link>

        <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/word-finder" className="hover:text-blue-600">
            Word Finder
          </Link>
          <Link href="/word-length/5" className="hover:text-blue-600">
            5 Letter Words
          </Link>
        </nav>
      </div>
    </header>
  );
}
