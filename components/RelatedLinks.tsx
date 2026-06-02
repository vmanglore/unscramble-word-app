type Props = {
  pattern?: string;
};

export default function RelatedLinks({ pattern }: Props) {
  return (
    <div className="mt-10 text-sm text-blue-600 flex flex-wrap gap-4 items-center">
      
      {/* Optional context label */}
      {pattern && (
        <span className="text-gray-500">
          Related: <strong>{pattern}</strong>
        </span>
      )}

      {/* Internal SEO links */}
      <a
        href="/words-starting-with/a"
        className="hover:underline"
      >
        A words
      </a>

      <a
        href="/words-ending-with/ing"
        className="hover:underline"
      >
        -ing words
      </a>

      <a
        href="/word-length/5"
        className="hover:underline"
      >
        5 letter words
      </a>

      <a
        href="/unscramble/aelpp"
        className="hover:underline"
      >
        Unscramble example
      </a>
    </div>
  );
}