type BeerImport = {
  name: string;
  brewery: string;
};

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(cell.trim());
      cell = '';
      continue;
    }

    cell += char;
  }

  cells.push(cell.trim());
  return cells;
}

export function importCsv(csv: string): BeerImport[] {
  const seen = new Set<string>();
  const beers: BeerImport[] = [];
  const lines = csv.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const [name = '', brewery = ''] = parseCsvLine(line);
    if (!name || !brewery) {
      continue;
    }

    if (name.toLowerCase() === 'name' && brewery.toLowerCase() === 'brewery') {
      continue;
    }

    const key = `${name.toLowerCase()}|${brewery.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    beers.push({ name, brewery });
  }

  return beers;
}
