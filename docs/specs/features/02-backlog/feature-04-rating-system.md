---
depends_on:
  - beer-data-model
---

# Feature: Rating System

## Summary

Add a star rating display component that renders 1-5 stars with half-star support.

## Acceptance Criteria

- [ ] Create `src/components/star-rating.tsx` with props `{ rating: number }` (0.0 to 5.0)
- [ ] Render filled, half-filled, and empty star characters (★ ½ ☆)
- [ ] Round to nearest 0.5

## Technical Approach

Pure function component. Use Math.round(rating * 2) / 2 for rounding. Map 5 positions to star characters.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Rating System validated"
```
