---
depends_on:
  - beer-data-model
---

# Feature: Beer API Routes

## Summary

Create Next.js API route handlers that serve beer data from the data model.

## Acceptance Criteria

- [ ] Create `src/app/api/beers/route.ts` returning all beers as JSON
- [ ] Create `src/app/api/beers/[id]/route.ts` returning a single beer by ID
- [ ] Return 404 JSON response when beer not found

## Technical Approach

Use Next.js App Router route handlers. Import beer data from `src/data/beers.ts` (feature 08). Filter by ID for the detail endpoint.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Beer API Routes validated"
```
## Dependency Graph

<!-- AIGON_DEP_GRAPH_START -->
<svg xmlns="http://www.w3.org/2000/svg" width="568" height="132" viewBox="0 0 568 132" role="img" aria-label="Feature dependency graph for feature 09" style="font-family: system-ui, -apple-system, sans-serif"><defs><marker id="dep-arrow-09" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#94a3b8"/></marker></defs><path d="M 244 66 C 284 66, 284 66, 324 66" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#dep-arrow-09)"/><g><rect x="24" y="24" width="220" height="84" rx="12" ry="12" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"/><text x="36" y="48" font-size="14" font-weight="700" fill="#0f172a">#08</text><text x="36" y="70" font-size="13" font-weight="500" fill="#1f2937">beer data model</text><text x="36" y="90" font-size="12" fill="#475569">backlog</text></g><g><rect x="324" y="24" width="220" height="84" rx="12" ry="12" fill="#e5e7eb" stroke="#f59e0b" stroke-width="3"/><text x="336" y="48" font-size="14" font-weight="700" fill="#0f172a">#09</text><text x="336" y="70" font-size="13" font-weight="500" fill="#1f2937">beer api routes</text><text x="336" y="90" font-size="12" fill="#475569">backlog</text></g></svg>
<!-- AIGON_DEP_GRAPH_END -->
