export function buildShareUrl(
  beerName: string,
  rating: number,
  platform: "twitter" | "facebook"
): string {
  if (platform === "twitter") {
    const text = `Beer review: ${beerName} — ${rating}/5`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }

  const reviewUrl = new URL("https://brewboard.app/review");
  reviewUrl.searchParams.set("beer", beerName);
  reviewUrl.searchParams.set("rating", String(rating));
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reviewUrl.toString())}`;
}
