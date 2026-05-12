# Research Findings: offline sync

**Agent:** Cursor (cu)
**Research ID:** 02
**Date:** 2026-05-12

---

## Key Findings

### Research question

**Which MVP approach should BrewBoard use for read-only viewing when offline: (a) a basic service-worker cache strategy, or (b) no offline support in v1?**

### BrewBoard context (repo)

The app ships as **Next.js 15 App Router + React 18**, with **`'use client'`** on `src/app/page.tsx` and purely in-memory demo data. There is **no service worker, no Workbox/Serwist, and no API surface** today. That means:

- **Low immediate coupling** to RSC flight payloads on the home route, but future **server-driven or mixed RSC pages** will interact with service workers in non-obvious ways (extra `/_next/*` requests, dynamic HTML). Any SW strategy should be validated again when routes move beyond pure client demos.

### Options compared (minimum three)

| Option | What it is | Pros | Cons / risks |
|--------|------------|------|----------------|
| **A. No offline in v1** | Ship without installable/offline UX; rely on normal browser behavior while online | Fastest MVP; avoids SW lifecycle bugs, stale-cache confusion, Safari/iOS PWA quirks, and build-tool integration drift | No “open in basement” reliability; churn from users who assume mobile apps work offline |
| **B. HTTP caching only (`Cache-Control`)** | Tune CDN/origin (`max-age`, `stale-while-revalidate`) for HTML + static assets; **no** SW | Less ongoing maintenance than a SW; aligns with caching guidance for freshness vs latency ([Google Web.dev on `stale-while-revalidate`](https://web.dev/articles/stale-while-revalidate)) | **Not true offline-first**: navigations still fail whenever the HTTP cache misses or policy prevents reuse; weaker control vs SW ([same article compares SW vs `Cache-Control`](https://web.dev/articles/stale-while-revalidate)) |
| **C. “Basic” hand-written SW** (`public/sw.js`, manual `precache`/runtime handlers) | Install event precache shell + runtime rules (often stale-while-revalidate per [Offline cookbook patterns](https://web.dev/articles/offline-cookbook)) | Conceptually straightforward; full control | Easy to get wrong with Next’s hashed assets and mixed routes; you re-implement what maintained stacks already ship |
| **D. Framework-aligned SW (Serwist / `@serwist/next`)** | Wrap `next.config` with Serwist, worker at `app/sw.ts`, precache manifest + `defaultCache` runtime strategies ([Serwist Next.js getting started](https://serwist.pages.dev/docs/next/getting-started)) | **Maintained defaults** for precaching and runtime caching; documented path for App Router; template includes **offline fallback** (`/~offline`) | Adds dependencies and build steps; requires manifest metadata, icons, and manual QA on iOS Safari; Turbopack vs webpack paths differ |

### Read-only scope (important nuance)

For **read-only** viewing, the requirement is **previously visited documents and static dependencies render without a live network**, with **eventual refresh** when back online. That maps to precache / cache-on-first-visit patterns from the [Offline cookbook](https://web.dev/articles/offline-cookbook) and freshness models from [`stale-while-revalidate` (Web.dev)](https://web.dev/articles/stale-while-revalidate). Write paths, conflict resolution, and backend sync belong in separate research/features.

### Decision for “right now”

**Recommendation: Option A — no dedicated offline/read-only caching in v1.**

1. **The brief poses a deliberate MVP trade**: basic SW cache versus no offline; deferring avoids PWA/service-worker risk in the earliest milestone ([research spec `research-02-offline-sync.md`](../03-in-progress/research-02-offline-sync.md)).
2. **“Basic” SW is rarely basic on Next**: incorrect splitting of navigations versus `/_next/static/*` shows up as flaky loads; Serwist exists because integrations need precache manifests and sane defaults ([Serwist docs](https://serwist.pages.dev/docs/next/getting-started)).
3. **HTTP-only (Option B)** helps latency but typically **does not satisfy** offline read-only expectations; treat it as complementary when a CDN exists.

**If offline is mandated in the same milestone:** Prefer **Option D (Serwist)** over hand-written SW, publish an offline fallback route, and plan explicit staleness UX.

## Sources

- [Keeping things fresh with stale-while-revalidate](https://web.dev/articles/stale-while-revalidate)
- [RFC 5861 — `stale-while-revalidate`](https://datatracker.ietf.org/doc/html/rfc5861)
- [The offline cookbook](https://web.dev/articles/offline-cookbook)
- [Getting started — `@serwist/next`](https://serwist.pages.dev/docs/next/getting-started)
- [Workbox strategies (Chrome Developers)](https://developer.chrome.com/docs/workbox/reference/workbox-strategies)
- [MDN — Progressive web apps — Caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)

## Recommendation

Ship **no offline/read-only MVP in v1**. Plan a follow-up with **`@serwist/next`** (not an ad hoc `sw.js`) plus CDN **`Cache-Control`** tuning when real deployments exist. QA **iOS Safari** separately before claiming offline support.

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| `defer-offline-readonly-v1` | Keep v1 online-only and record when offline rose to must-have priority | high | none |
| `readonly-pwa-shell-serwist` | Add `@serwist/next` with precached shell, `defaultCache`, and `/~offline` fallback for document navigations | medium | defer-offline-readonly-v1 |
| `pwa-manifest-icons` | Ship manifest, icons, and metadata for install UX when offline phase starts | medium | readonly-pwa-shell-serwist |
| `readonly-http-cache-headers` | Apply `Cache-Control` (including `stale-where-appropriate`) for static/read-only responses | low | none |
| `offline-staleness-indicator` | UI cue when read-only content is stale or offline-served | low | readonly-pwa-shell-serwist |
