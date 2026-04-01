export type Beer = {
  id: number;
  name: string;
  brewery: string;
  style: string;
  rating: number;
};

export function filterByStyle(beers: Beer[], styles: string[]): Beer[] {
  const styleSet = new Set(styles.map((s) => s.toLowerCase()));
  return beers.filter((beer) => styleSet.has(beer.style.toLowerCase()));
}
