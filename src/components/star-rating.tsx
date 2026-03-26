type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push('★');
    } else if (i - 0.5 === roundedRating) {
      stars.push('½');
    } else {
      stars.push('☆');
    }
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {stars.map((star, index) => (
        <span key={index} className="text-amber-500 font-medium">
          {star}
        </span>
      ))}
    </div>
  );
}
