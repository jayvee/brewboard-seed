function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  fields.push(current);
  return fields;
}

export function importCsv(
  csv: string
): Array<{ name: string; brewery: string }> {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const seen = new Set<string>();
  const result: Array<{ name: string; brewery: string }> = [];

  for (const line of lines) {
    const fields = parseCsvLine(line);
    if (fields.length < 2) continue;
    const name = fields[0].trim();
    const brewery = fields[1].trim();
    const key = `${name.toLowerCase()}|${brewery.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ name, brewery });
  }

  return result;
}
