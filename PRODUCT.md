# BrewBoard — Product Spec

## Vision

BrewBoard is a web app for craft beer enthusiasts to track, rate, and discover beers and breweries.

The core loop is simple: you find a beer you like, you log it, you rate it, you remember it. Over time your collection becomes a personal taste profile — and BrewBoard uses that to help you discover what to drink next.

The secondary loop is social: your ratings and collection are shareable, breweries can be followed, and a community feed surfaces what people around you are drinking.

**Target user:** Craft beer drinker who goes to bottle shops and taprooms regularly, wants to remember what they've tried, and trusts peer recommendations over marketing.

---

## MVP

The MVP is the minimum surface that feels like a real beer-tracking app — browseable, filterable, and good enough that a user could open it at a bottle shop and get value.

- **Beer listing** — grid of beer cards (name, brewery, style, rating)
- **Rating filter** — show only beers above a chosen star threshold
- **Search** — live text search across name, brewery, and style
- **Onboarding** — first-time flow that explains the app and sets the user up
- **Footer** — standard site footer with links and attribution
- **Responsive layout** — usable on a phone at a bottle shop

No auth, no persistence, no backend. Data is hardcoded. The MVP exists to validate the shape of the product before investing in a data layer.

---

## Current State

UI shell. No backend, no auth, no persistence.

- **Beer listing page** (`src/app/page.tsx`) — displays 6 hardcoded beers in a card grid
- **BeerCard component** (`src/components/BeerCard.tsx`) — name, brewery, style badge, star rating
- **Rating filter** — buttons to filter by minimum threshold (All / 3.5★+ / 4.0★+ / 4.5★+)
- **Search** — full-text search across name, brewery, style
- **Onboarding** — first-time user flow
- **Footer** — site footer
- **CSV import lib** (`src/lib/import-csv.ts`) — stub, not connected
- **API lib** (`src/lib/api.ts`) — stub `fetchBeers()`, not connected

**Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS.

---

## Roadmap

Features are tracked in `docs/specs/features/` and research topics in `docs/specs/research-topics/`. The phases below are rough priority order; each phase should be shippable on its own.

### Phase 1 — Polish the basics

Round out the discovery experience so the MVP feels finished.

| Feature | Description |
|---|---|
| Format date | Display "added X days ago" for each beer |
| Beer style filters | Filter by style (IPA, Stout, Pale Ale, …), combinable with rating filter |
| Brewery pages | Each brewery gets a page listing all their beers |
| Brewery import | UI for the existing `import-csv.ts` stub to bulk-load brewery/beer data |
| Real data layer | Replace hardcoded `BEERS` array with a proper data source; separate brewery and beer entities |

### Phase 2 — Identity & ratings

Add accounts so users can log their own ratings and build a personal collection.

| Feature | Description |
|---|---|
| User profiles | Public profile showing rated beers, favourite styles, stats |
| Rating system | Authenticated users rate beers 1–5 stars; aggregate is the average |
| Dark mode | System-preference-aware; toggle persists |

### Phase 3 — Social & sharing

Make collections and discoveries shareable.

| Feature | Description |
|---|---|
| Social sharing | Shareable URLs for beers and profiles, with OG images |

### Phase 4 — Data & performance

Operationalise the data layer and make the app fast at scale.

- **Research:** caching strategy (edge cache vs search index)
- **Research:** offline sync (service workers vs local-first)

### Phase 5 — Monetisation

Premium features that could support a paid tier.

- **Research:** payment providers (Stripe vs alternatives)
- Premium accounts, "on tap near you", taste recommendations

---

## Non-goals (for now)

- Native mobile app — web-first, but responsive design is required
- Brewery admin portal — breweries cannot manage their own listings
- Real-time features (websockets, live tap lists)
- User-generated content beyond ratings (no reviews, no photos)

---

## Design principles

1. **Fast by default** — listings and search should feel instant
2. **No account required to browse** — discovery is public; ratings require auth
3. **Mobile-first layout** — most users will be on phones at a bottle shop
4. **Opinionated defaults** — sensible filters pre-selected, no configuration overload
