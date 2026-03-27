---
depends_on: []
---

# Feature: Beer Data Model

## Summary

Create TypeScript types and a static data file for the beer catalog used across the app.

## Acceptance Criteria

- [ ] Create `src/types/beer.ts` with `Beer` interface (id, name, style, abv, brewery, rating)
- [ ] Create `src/data/beers.ts` with 5 sample beers
- [ ] Export types and data as named exports

## Technical Approach

Plain TypeScript interfaces and a static array. No database or API — just typed seed data.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Beer Data Model validated"
```
