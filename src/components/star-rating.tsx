type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  // Round to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Create array of 5 positions
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const position = i + 0.5;
    
    if (roundedRating >= i + 1) {
      // Full star
      stars.push('★');
    } else if (roundedRating >= position) {
      // Half star
      stars.push('½');
    } else {
      // Empty star
      stars.push('☆');
    }
  }
  
  return <span>{stars.join('')}</span>;
}