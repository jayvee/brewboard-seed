'use client';

import { BeerCard } from '@/components/BeerCard';
import { useState } from 'react';

const BEERS = [
  { id: 1, name: 'Hazy IPA', brewery: 'Mountain Goat', style: 'IPA', rating: 4.5 },
  { id: 2, name: 'Pale Ale', brewery: 'Stone & Wood', style: 'Pale Ale', rating: 4.2 },
  { id: 3, name: 'Stout', brewery: 'Pirate Life', style: 'Stout', rating: 4.8 },
  { id: 4, name: 'Lager', brewery: 'Balter', style: 'Lager', rating: 3.9 },
  { id: 5, name: 'Sour Cherry', brewery: 'Wildflower', style: 'Sour', rating: 4.6 },
  { id: 6, name: 'West Coast IPA', brewery: 'Hop Nation', style: 'IPA', rating: 4.3 },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredBeers = BEERS.filter(beer => 
    beer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beer.brewery.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beer.style.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">BrewBoard</h1>
        <p className="text-stone-500 mt-2">Your craft beer collection</p>
      </header>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search beers, breweries, or styles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeers.map(beer => (
          <BeerCard key={beer.id} {...beer} />
        ))}
      </div>
    </main>
  );
}
