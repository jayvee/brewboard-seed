export function buildShareUrl(
  beerName: string,
  rating: number,
  platform: "twitter" | "facebook"
): string {
  if (platform === "twitter") {
    const text = encodeURIComponent(`${beerName} - ${rating}/5`);
    return `https://twitter.com/intent/tweet?text=${text}`;
  }
  const u = encodeURIComponent(`https://brewboard.app/beer/${encodeURIComponent(beerName)}`);
  return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
}
