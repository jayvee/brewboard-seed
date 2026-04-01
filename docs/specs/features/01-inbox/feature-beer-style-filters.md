# Feature: Beer Style Filters

## Summary

Add a utility function that filters an array of beers by style.

## Acceptance Criteria

- [ ] Create `src/lib/filter-by-style.ts` exporting `function filterByStyle(beers: Beer[], styles: string[]): Beer[]`
- [ ] Return beers where `beer.style` matches any of the given styles (case-insensitive)

## Technical Approach

Array.filter with includes check. One file, one function.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Beer Style Filters validated"
```
