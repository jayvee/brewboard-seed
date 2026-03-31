# Implementation Log: Feature 01 - dark-mode
Agent: cc

## Plan

1. Create `src/components/theme-toggle.tsx` — client component with toggle button
2. Update `src/app/layout.tsx` — add inline script for FOUC prevention, render ThemeToggle

## Progress

- [x] Created ThemeToggle component
- [x] Updated layout.tsx with dark class management and inline script

## Decisions

- Added an inline `<script>` in `<head>` to apply the `dark` class before first paint, preventing flash-of-unstyled-content (FOUC). This reads localStorage and `prefers-color-scheme` synchronously.
- ThemeToggle uses `useEffect` on mount to sync its state with whatever the inline script applied.
- Added `dark:` Tailwind variants to `<body>` so dark mode has visible effect out of the box.
- The toggle manipulates `document.documentElement.classList` directly (rather than re-rendering) for instant response.
