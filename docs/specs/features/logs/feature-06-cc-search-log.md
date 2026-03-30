# Implementation Log: Feature 06 - search
Agent: cc

## Plan

Explored the codebase: a simple Next.js app with a static BEERS array in `page.tsx`, a `BeerCard` component, and a minimal `lib/api.ts`. The spec asks for full-text search across beers, breweries, and styles with relevance ranking and highlighted matches.

Approach:
- Create `SearchableBeerList` as a `'use client'` component (search requires interactivity)
- Keep `page.tsx` as a server component; pass the static data down
- Update `BeerCard` to accept optional `ReactNode` props for highlighted display

## Progress

1. Created `src/components/SearchableBeerList.tsx` — search input, `useMemo` for filtered/ranked results, `highlight()` helper that splits text on matches and wraps them in `<mark>`
2. Updated `src/components/BeerCard.tsx` — added `highlightedName`, `highlightedBrewery`, `highlightedStyle` optional ReactNode props; falls back to plain string when no query
3. Updated `src/app/page.tsx` — replaced manual grid with `<SearchableBeerList beers={BEERS} />`
4. Build passed cleanly; dev server running at http://cc-06.brewboard.localhost

## Decisions

- **Relevance scoring**: name match weighted highest (100 exact, 60 prefix, 30 contains), then brewery (80/50/20), then style (60/40/10). Results with score > 0 shown, sorted descending.
- **Client component boundary**: pushed 'use client' into `SearchableBeerList` only; `page.tsx` stays a server component.
- **No tests**: spec explicitly says do not write tests.
- **Highlighting**: `text.split(/(query)/gi)` with a capturing group is idiomatic and avoids manual index tracking.
