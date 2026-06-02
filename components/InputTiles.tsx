type Props = {
  value: string;
};

/**
 * Letter tiles (Wordle-style UX)
 */
export default function InputTiles({ value }: Props) {
  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {value.split("").map((char, i) => (
        <div
          key={i}
          className="w-12 h-12 rounded-lg bg-gray-100 border flex items-center justify-center font-bold text-lg shadow-sm"
        >
          {char.toUpperCase()}
        </div>
      ))}
    </div>
  );
}