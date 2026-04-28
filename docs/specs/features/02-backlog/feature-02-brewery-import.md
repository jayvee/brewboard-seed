---
complexity: high
set: brewboard-data
---

# Feature: Brewery Import

## Summary

Parse a CSV file of beer names and add them to a JSON collection file.

## Acceptance Criteria

- [ ] Create `src/lib/import-csv.ts` that reads a CSV string and returns `Array<{name: string, brewery: string}>`
- [ ] Handle comma-in-quotes edge case
- [ ] Deduplicate by name+brewery (case-insensitive)

## Technical Approach

Simple string parsing — split by newline, then by comma. No external dependencies.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Brewery Import validated"
```
## Dependency Graph

<!-- AIGON_DEP_GRAPH_START -->
<svg xmlns="http://www.w3.org/2000/svg" width="868" height="132" viewBox="0 0 868 132" role="img" aria-label="Feature dependency graph for feature 02" style="font-family: system-ui, -apple-system, sans-serif"><defs><marker id="dep-arrow-02" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#94a3b8"/></marker></defs><path d="M 244 66 C 284 66, 284 66, 324 66" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#dep-arrow-02)"/><path d="M 544 66 C 584 66, 584 66, 624 66" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#dep-arrow-02)"/><g><rect x="24" y="24" width="220" height="84" rx="12" ry="12" fill="#e5e7eb" stroke="#f59e0b" stroke-width="3"/><text x="36" y="48" font-size="14" font-weight="700" fill="#0f172a">#02</text><text x="36" y="70" font-size="13" font-weight="500" fill="#1f2937">brewery import</text><text x="36" y="90" font-size="12" fill="#475569">backlog</text></g><g><rect x="324" y="24" width="220" height="84" rx="12" ry="12" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"/><text x="336" y="48" font-size="14" font-weight="700" fill="#0f172a">#03</text><text x="336" y="70" font-size="13" font-weight="500" fill="#1f2937">user profiles</text><text x="336" y="90" font-size="12" fill="#475569">backlog</text></g><g><rect x="624" y="24" width="220" height="84" rx="12" ry="12" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"/><text x="636" y="48" font-size="14" font-weight="700" fill="#0f172a">#04</text><text x="636" y="70" font-size="13" font-weight="500" fill="#1f2937">rating system</text><text x="636" y="90" font-size="12" fill="#475569">backlog</text></g></svg>
<!-- AIGON_DEP_GRAPH_END -->
