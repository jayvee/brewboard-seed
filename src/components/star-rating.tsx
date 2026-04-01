type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));
  const rounded = Math.round(clamped * 2) / 2;

  const chars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) {
      chars.push("★");
    } else if (rounded >= i - 0.5) {
      chars.push("½");
    } else {
      chars.push("☆");
    }
  }

  return <span>{chars.join("")}</span>;
}
