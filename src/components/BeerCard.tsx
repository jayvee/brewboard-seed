type BeerCardProps = {
  name: string;
  brewery: string;
  style: string;
  rating: number;
  query?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query?: string) {
  const terms = (query ?? '')
    .trim()
    .split(/\s+/)
    .map(term => term.trim())
    .filter(Boolean);

  if (terms.length === 0) return text;

  const pattern = terms.map(escapeRegExp).join('|');
  if (!pattern) return text;

  const parts = text.split(new RegExp(`(${pattern})`, 'gi'));

  return parts.map((part, idx) => {
    const matched = terms.some(term => part.toLowerCase() === term.toLowerCase());
    return matched ? (
      <mark key={`${part}-${idx}`} className="bg-amber-200 text-inherit px-0.5 rounded-sm">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    );
  });
}

export function BeerCard({ name, brewery, style, rating, query }: BeerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg text-stone-900">{highlightText(name, query)}</h2>
          <p className="text-stone-500 text-sm">{highlightText(brewery, query)}</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
          {highlightText(style, query)}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
        <span className="text-stone-400 text-sm ml-1">{rating}</span>
      </div>
    </div>
  );
}
