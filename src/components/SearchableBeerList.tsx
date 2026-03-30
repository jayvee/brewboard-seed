'use client';

import { useState, useMemo } from 'react';
import { BeerCard } from './BeerCard';

type Beer = {
  id: number;
  name: string;
  brewery: string;
  style: string;
  rating: number;
};

function highlight(text: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function relevanceScore(beer: Beer, query: string): number {
  const q = query.toLowerCase().trim();
  let score = 0;
  const nameLc = beer.name.toLowerCase();
  const breweryLc = beer.brewery.toLowerCase();
  const styleLc = beer.style.toLowerCase();

  if (nameLc === q) score += 100;
  else if (nameLc.startsWith(q)) score += 60;
  else if (nameLc.includes(q)) score += 30;

  if (breweryLc === q) score += 80;
  else if (breweryLc.startsWith(q)) score += 50;
  else if (breweryLc.includes(q)) score += 20;

  if (styleLc === q) score += 60;
  else if (styleLc.startsWith(q)) score += 40;
  else if (styleLc.includes(q)) score += 10;

  return score;
}

export function SearchableBeerList({ beers }: { beers: Beer[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return beers;
    return beers
      .map(b => ({ beer: b, score: relevanceScore(b, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ beer }) => beer);
  }, [beers, query]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search beers, breweries, styles…"
          className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {query.trim() && (
          <p className="mt-2 text-sm text-stone-500">
            {results.length === 0
              ? 'No results'
              : `${results.length} result${results.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(beer => (
            <BeerCard
              key={beer.id}
              name={beer.name}
              brewery={beer.brewery}
              style={beer.style}
              rating={beer.rating}
              highlightedName={highlight(beer.name, query)}
              highlightedBrewery={highlight(beer.brewery, query)}
              highlightedStyle={highlight(beer.style, query)}
            />
          ))}
        </div>
      ) : (
        query.trim() && (
          <p className="text-center text-stone-400 py-12">No beers match &ldquo;{query}&rdquo;</p>
        )
      )}
    </div>
  );
}
