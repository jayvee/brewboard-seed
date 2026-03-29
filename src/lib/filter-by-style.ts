export interface Beer {
  style: string;
  // Other properties can be added here if needed, but for this task, only 'style' is relevant.
}

export function filterByStyle(beers: Beer[], styles: string[]): Beer[] {
  if (!styles || styles.length === 0) {
    return beers;
  }

  const lowerCaseStyles = styles.map(style => style.toLowerCase());

  return beers.filter(beer =>
    lowerCaseStyles.includes(beer.style.toLowerCase())
  );
}
