type Props = {
  words: string[];
};

/**
 * Word chips (interactive feel)
 */
export default function WordGroup({ words }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word) => (
        <button
          key={word}
          className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm"
        >
          {word}
        </button>
      ))}
    </div>
  );
}