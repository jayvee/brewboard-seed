# Feature: Add Footer

## Summary

Add a simple footer to the bottom of the page showing "Built with BrewBoard".

## Acceptance Criteria

- [ ] A `<footer>` element exists at the bottom of the page
- [ ] It displays the text "Built with BrewBoard"
- [ ] It uses Tailwind classes for styling (text-sm, text-stone-400, centered, padding)

## Technical Approach

Add a `<footer>` element inside the `<main>` tag in `src/app/page.tsx`. One line of JSX.

## Validation

```bash
grep -q "Built with BrewBoard" src/app/page.tsx
```

## Out of Scope

- Links, logos, or complex layout
