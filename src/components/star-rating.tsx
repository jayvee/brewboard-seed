import React from 'react';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (roundedRating >= i) {
      stars.push('★');
    } else if (roundedRating >= i - 0.5) {
      stars.push('½');
    } else {
      stars.push('☆');
    }
  }

  return (
    <div className="flex gap-1 text-yellow-500 text-xl font-semibold">
      {stars.map((star, index) => (
        <span key={index}>{star}</span>
      ))}
    </div>
  );
};

export default StarRating;
