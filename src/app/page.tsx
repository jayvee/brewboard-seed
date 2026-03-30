'use client';

import { useMemo, useState } from 'react';
import { BeerCard } from '@/components/BeerCard';

const BEERS = [
  { id: 1, name: 'Hazy IPA', brewery: 'Mountain Goat', style: 'IPA', rating: 4.5 },
  { id: 2, name: 'Pale Ale', brewery: 'Stone & Wood', style: 'Pale Ale', rating: 4.2 },
  { id: 3, name: 'Stout', brewery: 'Pirate Life', style: 'Stout', rating: 4.8 },
  { id: 4, name: 'Lager', brewery: 'Balter', style: 'Lager', rating: 3.9 },
  { id: 5, name: 'Sour Cherry', brewery: 'Wildflower', style: 'Sour', rating: 4.6 },
  { id: 6, name: 'West Coast IPA', brewery: 'Hop Nation', style: 'IPA', rating: 4.3 },
];

export default function Home() {
  const [query, setQuery] = useState('');

  const filteredBeers = useMemo(() => {
    const terms = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(term => term.trim())
      .filter(Boolean);

    if (terms.length === 0) return BEERS;

    return [...BEERS]
      .map(beer => {
        const fields = [beer.name, beer.brewery, beer.style];
        const normalizedFields = fields.map(field => field.toLowerCase());

        let score = 0;

        for (const term of terms) {
          for (const field of normalizedFields) {
            if (field === term) {
              score += 30;
            } else if (field.startsWith(term)) {
              score += 20;
            } else if (field.includes(term)) {
              score += 10;
            }
          }
        }

        return { beer, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.beer);
  }, [query]);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">BrewBoard</h1>
        <p className="text-stone-500 mt-2">Your craft beer collection</p>
      </header>
      <div className="mb-6">
        <label htmlFor="search" className="sr-only">
          Search beers
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search beers, breweries, or styles..."
          className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeers.map(beer => (
          <BeerCard key={beer.id} {...beer} query={query} />
        ))}
      </div>
      {filteredBeers.length === 0 && (
        <p className="text-center text-stone-500 mt-6">No beers match your search.</p>
      )}
      <footer className="text-sm text-stone-400 text-center pt-8">Built with BrewBoard</footer>
    </main>
  );
}
