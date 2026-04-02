type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));
  const r = Math.round(clamped * 2) / 2;

  const chars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    if (r >= i) chars.push('★');
    else if (r >= i - 0.5) chars.push('½');
    else chars.push('☆');
  }

  return (
    <span aria-label={`${r} out of 5 stars`} role="img">
      {chars.join('')}
    </span>
  );
}
