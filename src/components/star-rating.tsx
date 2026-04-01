export function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => {
        const pos = i + 1;
        if (rounded >= pos) return '★';
        if (rounded >= pos - 0.5) return '½';
        return '☆';
      }).join('')}
    </span>
  );
}
