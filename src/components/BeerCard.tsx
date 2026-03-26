import React from 'react';

type BeerCardProps = {
  name: React.ReactNode;
  brewery: React.ReactNode;
  style: React.ReactNode;
  rating: number;
};

export function BeerCard({ name, brewery, style, rating }: BeerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="font-semibold text-lg text-stone-900 leading-snug">{name}</h2>
          <p className="text-stone-500 text-sm mt-0.5">{brewery}</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">{style}</span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <span className="text-amber-500">{'★'.repeat(Math.round(rating))}</span>
        <span className="text-stone-200">{'★'.repeat(5 - Math.round(rating))}</span>
        <span className="text-stone-400 text-sm ml-1 font-medium">{rating}</span>
      </div>
    </div>
  );
}
