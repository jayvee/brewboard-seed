export function buildShareUrl(beerName: string, rating: number, platform: "twitter" | "facebook"): string {
  const text = `I rated ${beerName} a ${rating}/5 on Brewboard!`;
  const encodedText = encodeURIComponent(text);

  if (platform === "twitter") {
    return `https://twitter.com/intent/tweet?text=${encodedText}`;
  } else if (platform === "facebook") {
    // Placeholder for the actual beer review URL, as it's not provided in the spec.
    // In a real application, this would link to the specific beer review page.
    const reviewUrl = `https://example.com/beer/${encodeURIComponent(beerName)}`;
    const encodedUrl = encodeURIComponent(reviewUrl);
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }

  // Should not happen given the type definition, but good for completeness
  return "";
}
