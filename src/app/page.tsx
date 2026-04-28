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

export default function Home() {
  const [minRating, setMinRating] = useState(0);

  const filtered = BEERS.filter(beer => beer.rating >= minRating);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">BrewBoard</h1>
        <p className="text-stone-500 mt-2">Your craft beer collection</p>
      </header>

      <div className="mb-6 flex gap-2 items-center">
        <span className="text-sm text-stone-500">Min rating:</span>
        {[0, 3.5, 4.0, 4.5].map(threshold => (
          <button
            key={threshold}
            onClick={() => setMinRating(threshold)}
            style={{ fontWeight: minRating === threshold ? 700 : 400 }}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              minRating === threshold
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400'
            }`}
          >
            {threshold === 0 ? 'All' : `${threshold}★+`}
          </button>
        ))}
        <span style={{ color: '#78716c', fontSize: '13px' }}>
          {filtered.length} of {BEERS.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(beer => (
          <BeerCard key={beer.id} {...beer} />
        ))}
      </div>
    </main>
  );
}
