'use client';

import { useState } from 'react';
import { BeerCard } from '@/components/BeerCard';

const BEERS = [
  { id: 1, name: 'Hazy IPA', brewery: 'Mountain Goat', style: 'IPA', rating: 4.5 },
  { id: 2, name: 'Pale Ale', brewery: 'Stone & Wood', style: 'Pale Ale', rating: 4.2 },
  { id: 3, name: 'Stout', brewery: 'Pirate Life', style: 'Stout', rating: 4.8 },
  { id: 4, name: 'Lager', brewery: 'Balter', style: 'Lager', rating: 3.9 },
  { id: 5, name: 'Sour Cherry', brewery: 'Wildflower', style: 'Sour', rating: 4.6 },
  { id: 6, name: 'West Coast IPA', brewery: 'Hop Nation', style: 'IPA', rating: 4.3 },
];

const RATING_FILTERS = [
  { label: 'All', threshold: 0 },
  { label: '3.5★+', threshold: 3.5 },
  { label: '4.0★+', threshold: 4.0 },
  { label: '4.5★+', threshold: 4.5 },
];

export default function Home() {
  const [activeThreshold, setActiveThreshold] = useState(0);

  const filteredBeers = BEERS.filter(beer => beer.rating >= activeThreshold);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">BrewBoard</h1>
        <p className="text-stone-500 mt-2">Your craft beer collection</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {RATING_FILTERS.map(filter => (
          <button
            key={filter.threshold}
            onClick={() => setActiveThreshold(filter.threshold)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeThreshold === filter.threshold
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
        <span className="ml-4 text-stone-600 font-medium">
          {filteredBeers.length} beer{filteredBeers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeers.map(beer => (
          <BeerCard key={beer.id} {...beer} />
        ))}
      </div>
    </main>
  );
}
