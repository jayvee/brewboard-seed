interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  const roundedRating = Math.round(Math.min(Math.max(rating, 0), 5) * 2) / 2;
  const stars = Array.from({ length: 5 }, (_, index) => {
    const position = index + 1;

    if (roundedRating >= position) {
      return '★';
    }

    if (roundedRating + 0.5 === position) {
      return '½';
    }

    return '☆';
  });

  return <span>{stars.join('')}</span>;
}
