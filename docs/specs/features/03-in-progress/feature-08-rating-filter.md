---
complexity: low
---

# Feature: Rating Filter

## Summary

Add a filter bar above the beer grid that lets users narrow cards by minimum star rating. Buttons for All / 3.5★+ / 4.0★+ / 4.5★+. Active state is visually distinct. A count shows how many beers match.

## Acceptance Criteria

- [ ] Filter bar renders above the grid with four threshold buttons
- [ ] Clicking a button hides cards below that rating
- [ ] Active button is visually distinguished from inactive ones
- [ ] Count of matching beers is displayed
- [ ] All beers shown by default (threshold = 0)

## Technical Approach

Implement as a client component in `src/app/page.tsx` using `useState` for the active threshold. Filter the BEERS array before mapping to `BeerCard`.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code beyond what the feature requires

## Validation

```bash
echo "Feature Rating Filter validated"
```
