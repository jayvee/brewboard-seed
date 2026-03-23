# Implementation Log: Feature 01 - dark-mode
Agent: cc

## Plan

Create `ThemeToggle` client component and mount it in layout.

## Progress

- Created `src/components/theme-toggle.tsx` — reads OS preference on mount, persists to `localStorage` under `brewboard-theme`, toggles `dark` class on `<html>`
- Updated `src/app/layout.tsx` — imports and renders `ThemeToggle` in a fixed top-right container

## Decisions

- Used `document.documentElement.classList.toggle` directly (no context/provider) per spec's "small client component" guidance
- Positioned toggle fixed top-right so it's accessible on all pages without changing page layout
