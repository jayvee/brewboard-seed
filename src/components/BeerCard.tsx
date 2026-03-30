type BeerCardProps = {
  name: string;
  brewery: string;
  style: string;
  rating: number;
  highlightedName?: React.ReactNode;
  highlightedBrewery?: React.ReactNode;
  highlightedStyle?: React.ReactNode;
};

export function BeerCard({
  name,
  brewery,
  style,
  rating,
  highlightedName,
  highlightedBrewery,
  highlightedStyle,
}: BeerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg text-stone-900">{highlightedName ?? name}</h2>
          <p className="text-stone-500 text-sm">{highlightedBrewery ?? brewery}</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
          {highlightedStyle ?? style}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
        <span className="text-stone-400 text-sm ml-1">{rating}</span>
      </div>
    </div>
  );
}
