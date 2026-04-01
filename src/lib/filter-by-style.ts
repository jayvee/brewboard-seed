export type Beer = {
  style: string;
  [key: string]: unknown;
};

export function filterByStyle(beers: Beer[], styles: string[]): Beer[] {
  const normalizedStyles = styles.map(style => style.toLowerCase());

  return beers.filter(beer =>
    normalizedStyles.includes(beer.style.toLowerCase())
  );
}
