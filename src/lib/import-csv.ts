export type BreweryCsvRow = { name: string; brewery: string };

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let i = 0;
  let inQuotes = false;

  while (i < line.length) {
    const c = line[i];

    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (c === ',') {
      fields.push(field.trim());
      field = '';
      i++;
      continue;
    }

    field += c;
    i++;
  }

  fields.push(field.trim());
  return fields;
}

function dedupeKey(name: string, brewery: string): string {
  return `${name.toLowerCase()}\0${brewery.toLowerCase()}`;
}

export function importCsv(csv: string): BreweryCsvRow[] {
  const lines = csv.split(/\r?\n/);
  const seen = new Set<string>();
  const rows: BreweryCsvRow[] = [];

  for (const line of lines) {
    if (line.trim() === '') continue;

    const parts = parseCsvLine(line);
    const name = parts[0] ?? '';
    const brewery = parts[1] ?? '';
    const key = dedupeKey(name, brewery);

    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ name, brewery });
  }

  return rows;
}
