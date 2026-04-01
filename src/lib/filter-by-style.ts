export type Beer = {
  id?: number;
  name: string;
  brewery: string;
  style: string;
  rating: number;
};

export function filterByStyle(beers: Beer[], styles: string[]): Beer[] {
  const lower = styles.map((s) => s.toLowerCase());
  return beers.filter((beer) => lower.includes(beer.style.toLowerCase()));
}
