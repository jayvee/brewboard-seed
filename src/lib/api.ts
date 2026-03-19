export async function fetchBeers() {
  const res = await fetch('/api/beers');
  return res.json();
}
