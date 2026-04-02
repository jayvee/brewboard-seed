export function importCsv(csvString: string): Array<{ name: string; brewery: string }> {
  const lines = csvString.trim().split('
');
  const result: Array<{ name: string; brewery: string }> = [];
  const seen = new Set<string>();

  for (const line of lines) {
    // Handle comma-in-quotes edge case
    const parts = parseCsvLine(line);

    if (parts.length >= 2) {
      const name = parts[0].trim();
      const brewery = parts[1].trim();

      const uniqueKey = `${name.toLowerCase()}||${brewery.toLowerCase()}`;

      if (!seen.has(uniqueKey)) {
        result.push({ name, brewery });
        seen.add(uniqueKey);
      }
    }
  }

  return result;
}

// Helper function to parse a CSV line, handling quoted commas
function parseCsvLine(line: string): string[] {
  const parts: string[] = [];
  let inQuote = false;
  let currentPart = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuote = !inQuote;
    } else if (char === ',' && !inQuote) {
      parts.push(currentPart);
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  parts.push(currentPart); // Add the last part

  return parts;
}
