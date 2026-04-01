export function buildShareUrl(
  beerName: string,
  rating: number,
  platform: "twitter" | "facebook"
): string {
  if (platform === "twitter") {
    const text = encodeURIComponent(`${beerName} - Rating: ${rating}/5`);
    return `https://twitter.com/intent/tweet?text=${text}`;
  }
  const u = encodeURIComponent(`https://brewboard.app/beers/${encodeURIComponent(beerName)}`);
  return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
}
