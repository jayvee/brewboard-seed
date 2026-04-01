import { BeerCard } from '@/components/BeerCard';
import { ThemeToggle } from '@/components/theme-toggle';

const BEERS = [
  { id: 1, name: 'Hazy IPA', brewery: 'Mountain Goat', style: 'IPA', rating: 4.5 },
  { id: 2, name: 'Pale Ale', brewery: 'Stone & Wood', style: 'Pale Ale', rating: 4.2 },
  { id: 3, name: 'Stout', brewery: 'Pirate Life', style: 'Stout', rating: 4.8 },
  { id: 4, name: 'Lager', brewery: 'Balter', style: 'Lager', rating: 3.9 },
  { id: 5, name: 'Sour Cherry', brewery: 'Wildflower', style: 'Sour', rating: 4.6 },
  { id: 6, name: 'West Coast IPA', brewery: 'Hop Nation', style: 'IPA', rating: 4.3 },
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100">BrewBoard</h1>
          <p className="text-stone-500 mt-2 dark:text-stone-400">Your craft beer collection</p>
        </div>
        <ThemeToggle />
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BEERS.map(beer => (
          <BeerCard key={beer.id} {...beer} />
        ))}
      </div>
    </main>
  );
}
