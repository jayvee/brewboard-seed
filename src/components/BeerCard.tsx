type BeerCardProps = {
  name: string;
  brewery: string;
  style: string;
  rating: number;
};

export function BeerCard({ name, brewery, style, rating }: BeerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg text-stone-900">{name}</h2>
          <p className="text-stone-500 text-sm">{brewery}</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">{style}</span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
        <span className="text-stone-400 text-sm ml-1">{rating}</span>
      </div>
    </div>
  );
}
