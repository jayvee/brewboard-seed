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
