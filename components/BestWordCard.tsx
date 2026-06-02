type Props = {
  word: string;
};

/**
 * Primary result card (most important UX element)
 */
export default function BestWordCard({ word }: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-2xl p-8 text-center shadow-sm">
      
      <div className="text-sm uppercase tracking-widest text-gray-500">
        Best Match
      </div>

      <div className="mt-3 text-4xl font-bold tracking-wide">
        {word.toUpperCase()}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Highest scoring word found
      </div>
    </div>
  );
}