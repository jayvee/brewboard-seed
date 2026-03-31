# Feature: Dark Mode

## Summary

Add a dark mode toggle. Read OS preference, persist choice in localStorage, apply via CSS class on <html>.

## Acceptance Criteria

- [ ] Add a `dark` class toggle to `src/app/layout.tsx` that reads `prefers-color-scheme`
- [ ] Add a `ThemeToggle` button component in `src/components/theme-toggle.tsx`
- [ ] Persist theme choice to localStorage under key `brewboard-theme`

## Technical Approach

Add a small client component for the toggle. Use `useEffect` to read localStorage on mount. Apply `className="dark"` to `<html>`.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Dark Mode validated"
```
