export type SharePlatform = "twitter" | "facebook";

export function buildShareUrl(
  beerName: string,
  rating: number,
  platform: SharePlatform,
): string {
  const normalizedRating = Number.isFinite(rating) ? rating : 0;
  const ratingLabel = `${normalizedRating}/5`;
  const encodedBeerName = encodeURIComponent(beerName);
  const encodedRating = encodeURIComponent(ratingLabel);

  if (platform === "twitter") {
    const text = encodeURIComponent(
      `I gave ${beerName} a ${ratingLabel} review on Brewboard!`,
    );
    return `https://twitter.com/intent/tweet?text=${text}`;
  }

  const reviewUrl = `https://brewboard.app/reviews?beer=${encodedBeerName}&rating=${encodedRating}`;
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reviewUrl)}`;
}
