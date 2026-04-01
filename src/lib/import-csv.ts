export function importCsv(csv: string): Array<{ name: string; brewery: string }> {
  const lines = csv.trim().split('\n');
  const seen = new Set<string>();
  const results: Array<{ name: string; brewery: string }> = [];

  for (const line of lines) {
    const [name, brewery] = parseCsvLine(line);
    if (!name || !brewery) continue;

    const key = `${name.toLowerCase()}|${brewery.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ name, brewery });
    }
  }

  return results;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  fields.push(current.trim());
  return fields;
}
