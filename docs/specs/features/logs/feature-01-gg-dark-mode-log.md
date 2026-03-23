# Implementation Log: Feature 01 - dark-mode
Agent: gg

## Plan
- Create `src/components/theme-toggle.tsx` as a client component to handle theme logic.
- Update `src/app/layout.tsx` to include `ThemeToggle` and apply `dark` variants to `body`.
- Use `useEffect` to avoid hydration mismatch and read initial theme from `localStorage` or `prefers-color-scheme`.
- Persist theme choice to `localStorage` under key `brewboard-theme`.

## Progress
- [x] Create `src/components/theme-toggle.tsx`
- [x] Update `src/app/layout.tsx`
- [x] Test with dev-server

## Decisions
- Avoided hydration flicker/mismatch by returning `null` in `ThemeToggle` until mounted on the client.
- Followed "Out of Scope" constraint strictly: only modified `layout.tsx` and created `theme-toggle.tsx`.
- Used `fixed` positioning for the toggle to ensure it's always accessible.
