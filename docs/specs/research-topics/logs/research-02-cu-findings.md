# Research Findings: offline sync

**Agent:** Cursor (cu)
**Research ID:** 02
**Date:** 2026-04-02

---

## Key Findings

### Scope recap

The open question is an **MVP read-only offline** story: either a **basic service worker cache** or **no offline in v1**.

### Codebase today

- **Next.js 14** App Router (`package.json`); no `next-pwa`, Serwist, Workbox, or `public/sw.js` in-repo yet.
- No existing offline hooks to extend — any SW path is **new surface area** (registration, update strategy, cache busting, QA matrix).

### Option A — No offline in v1

**Pros**

- **Zero** SW/RSC interaction risk. App Router relies on React Server Components and **Flight** payloads; caching the wrong responses is a common source of “stale UI”, hydration mismatches, or infinite loading when returning online ([community reports of RSC + manual SW](https://stackoverflow.com/questions/79896906/next-js-16-app-router-pwa-supabase-ssr-infinite-loading-on-mobile-pwa-manual-service-worker-likely-caching-rsc-flight) illustrate the failure mode class).
- Keeps the MVP backlog small: no cache invalidation policy, no offline UX copy, no iOS/Safari SW quirks.
- Aligns with **progressive enhancement**: ship core value online-first; add offline when there is a measured need (spotty cellars, festivals, etc.).

**Cons**

- No “airplane mode” story for browsing past sessions; users see the browser offline page.

### Option B — Basic service worker cache (read-only)

**What “basic” can safely mean**

- **Static shell**: precache `/_next/static/*`, fonts, icons, and immutable assets (typical **cache-first**).
- **Never** blindly cache document navigations or RSC/Flight traffic. Next’s own PWA guide points to **Serwist** as one offline option and notes webpack-oriented setup ([Next.js — Progressive Web Apps](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)); that reflects that **generic** SW recipes need integration work for App Router.
- For **read-only data**, offline is more reliable if the **canonical read model** is plain **GET JSON** (or a small set of URLs) you control, with explicit versioning — not “whatever HTML/RSC the router fetched last.”

**Pros**

- Can deliver **installability + faster repeat visits** even before “full offline” if paired with manifest + careful caching.
- True read-only viewing (cached list/detail JSON) is **simpler** than sync.

**Cons**

- **Engineering cost** is not “a day”: must define routes to cache, **bypass Flight**, test Chrome + Safari + installed PWA, and plan updates (skipWaiting, clientsClaim, cache revision).
- Easy to **ship bugs** that only show up offline or after deploy.

### Comparison

| Criterion | No offline v1 | SW + targeted caching |
|-----------|-----------------|------------------------|
| Time to ship | Lowest | Medium–high |
| Risk to App Router correctness | None | Non-trivial if misconfigured |
| User value (MVP) | Depends on audience | Higher only if offline is a real workflow |

## Sources

- [Next.js: Progressive Web Apps](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps) — manifest, SW registration pattern, Serwist mention for offline.
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) — lifecycle, caching model.
- [Serwist — Next.js example](https://github.com/serwist/serwist/tree/main/examples/next-basic) — maintained integration path when the team chooses SW (note webpack-oriented constraints in upstream docs).
- Illustrative failure mode discussion: [Stack Overflow — Next.js App Router PWA / RSC caching](https://stackoverflow.com/questions/79896906/next-js-16-app-router-pwa-supabase-ssr-infinite-loading-on-mobile-pwa-manual-service-worker-likely-caching-rsc-flight) (symptoms when Flight/RSC responses are cached incorrectly).

## Recommendation

**Choose “no offline in v1”** unless product research shows a must-have scenario (e.g., judges scoring offline at events). The app is greenfield SW-wise; **read-only offline** still needs a **deliberate data contract** (what URLs are cached, TTL, and explicit non-caching of RSC). Deferring avoids shipping subtle router bugs in MVP.

**If leadership insists on offline sooner**, do **not** ship a “cache everything” SW. Prefer a **phased** approach: (1) web app manifest + installability without offline, then (2) **Serwist or Workbox** with **network-only** for `Next-Router-*` / RSC-style requests and **cache-first** only for hashed static assets and optionally versioned JSON reads — with QA time budgeted.

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| offline-strategy-defer | Explicitly ship v1 without offline; document revisit criteria (user research + usage in poor connectivity). | high | none |
| pwa-manifest-install | Add `app/manifest.ts` + icons so the app can be installed without claiming offline support. | medium | none |
| offline-read-cache-phase-2 | If needed: integrate Serwist/Workbox with RSC-safe routing rules and cache only static assets + explicit read API responses. | low | offline-strategy-defer (or product decision to prioritize) |
