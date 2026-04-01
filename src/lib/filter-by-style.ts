export type Beer = {
  id: number;
  name: string;
  brewery: string;
  style: string;
  rating: number;
};

export function filterByStyle(beers: Beer[], styles: string[]): Beer[] {
  if (!styles || styles.length === 0) {
    return beers;
  }

  const lowercasedStyles = styles.map(style => style.toLowerCase());

  return beers.filter(beer =>
    lowercasedStyles.includes(beer.style.toLowerCase())
  );
}
