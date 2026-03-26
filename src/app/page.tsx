'use client';

import { useState, useMemo } from 'react';
import { BeerCard } from '@/components/BeerCard';

const BEERS = [
  { id: 1, name: 'Hazy IPA', brewery: 'Mountain Goat', style: 'IPA', rating: 4.5 },
  { id: 2, name: 'Pale Ale', brewery: 'Stone & Wood', style: 'Pale Ale', rating: 4.2 },
  { id: 3, name: 'Stout', brewery: 'Pirate Life', style: 'Stout', rating: 4.8 },
  { id: 4, name: 'Lager', brewery: 'Balter', style: 'Lager', rating: 3.9 },
  { id: 5, name: 'Sour Cherry', brewery: 'Wildflower', style: 'Sour', rating: 4.6 },
  { id: 6, name: 'West Coast IPA', brewery: 'Hop Nation', style: 'IPA', rating: 4.3 },
];

function highlightText(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 text-amber-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');

  const filteredBeers = useMemo(() => {
    if (!query) return BEERS;

    const lowerQuery = query.toLowerCase();
    
    return BEERS
      .map(beer => {
        let score = 0;
        if (beer.name.toLowerCase().includes(lowerQuery)) score += 10;
        if (beer.brewery.toLowerCase().includes(lowerQuery)) score += 5;
        if (beer.style.toLowerCase().includes(lowerQuery)) score += 3;
        
        // Exact matches get higher priority
        if (beer.name.toLowerCase() === lowerQuery) score += 20;
        if (beer.brewery.toLowerCase() === lowerQuery) score += 10;
        if (beer.style.toLowerCase() === lowerQuery) score += 5;

        return { ...beer, score };
      })
      .filter(beer => beer.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">BrewBoard</h1>
        <p className="text-stone-500 mt-2">Your craft beer collection</p>
        
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search beers, breweries, or styles..."
            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeers.length > 0 ? (
          filteredBeers.map(beer => (
            <BeerCard 
              key={beer.id} 
              {...beer} 
              name={highlightText(beer.name, query)}
              brewery={highlightText(beer.brewery, query)}
              style={highlightText(beer.style, query)}
            />
          ))
        ) : (
          <p className="text-stone-500 col-span-full text-center py-12">
            No beers found matching "{query}"
          </p>
        )}
      </div>
    </main>
  );
}
