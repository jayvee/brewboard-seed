# Research Findings: Offline Sync

**Agent:** Claude (cc)
**Research ID:** 02
**Date:** 2026-04-02

---

## Key Findings

### The Question

Should Brewboard use a basic service worker cache for read-only offline viewing, or skip offline entirely in v1?

### Current State

- Brewboard is a **Next.js 14 App Router** project (not Vite)
- **No service worker** exists today
- **No PWA manifest** configured
- Data is currently mock/static; API layer (`src/lib/api.ts`) exists but no backend routes yet
- The app displays a beer collection grid with ratings — a read-only viewing use case

### Service Worker Caching Strategies

Three core strategies exist, all supported by Google's **Workbox** library:

| Strategy | Best For | Trade-off |
|----------|----------|-----------|
| **Cache First** | Static assets (JS, CSS, images) | Fast but risks stale content |
| **Network First** | Dynamic API data where freshness matters | Offline fallback but slower online |
| **Stale While Revalidate** | Data that should be fresh but slightly stale is OK | Best compromise for read-only offline |

For read-only offline viewing of a beer collection, **Stale While Revalidate** for API responses + **Cache First** for static assets would be ideal — but only when offline is actually needed.

### Next.js PWA Tooling Options

Since Brewboard is Next.js (not Vite), `vite-plugin-pwa` is irrelevant. The actual options:

| Option | Status | Notes |
|--------|--------|-------|
| **Next.js manual SW** | Official docs | Focused on push notifications/installability; offline not covered |
| **Serwist** | Recommended by Next.js | Successor to next-pwa; requires webpack config; actively maintained |
| **@ducanh2912/next-pwa** | Community fork | Documented for Next.js 14+ |
| **next-pwa-pack** | Newer (July 2025) | App Router compatible but less proven |
| **Manual SW (no deps)** | Always available | Full control but high maintenance burden |

**None of these are zero-config.** All require meaningful setup and testing work.

### Read-Only Offline Storage

Two approaches for caching read-only data:

- **Cache Storage API** (via service worker): Stores complete HTTP responses keyed by URL. Simple, transparent to app code, sufficient for a small beer collection. No querying capability.
- **IndexedDB**: Stores structured JSON with indexes. Supports client-side search/filter. Overkill for read-only list viewing unless you need offline search across hundreds of items.

**For a read-only MVP, Cache Storage is the right choice** — if offline is implemented at all.

### Risks of Adding Service Workers Too Early

Real-world pain points from production post-mortems:

1. **Cache invalidation hell** — Teams have accidentally cached `sw.js` itself, preventing deployments from reaching users for ~24 hours ([source](https://medium.com/@ankit-kaushal/stuck-in-cache-hell-a-service-worker-nightmare-c878ae33abf4))
2. **Cross-user data leaks** — After logout, cached API responses served the previous user's data to the next user. Serious privacy bug that's easy to introduce ([source](https://iinteractive.com/resources/blog/taming-pwa-cache-behavior))
3. **Safari inconsistency** — iOS Safari caches so aggressively that even hard refresh + browser restart didn't clear stale content
4. **Broken reload button** — Cache-first SWs serve stale content before the page loads, breaking user expectations
5. **Debugging difficulty** — SWs run in separate threads, persist across page loads, don't appear in normal console logs. `create-react-app` removed its default SW because it "created issues for people who were not aware of what was happening"

### Arguments For Skipping Offline in v1

1. **Complexity cost is disproportionate** — SW implementation, testing, and debugging across browsers takes significant time that could go toward core features
2. **Offline bugs are the hardest to debug** — Stale data, cache invalidation, cross-browser issues slow MVP iteration
3. **Retrofitting is straightforward** — Unlike schema decisions, offline support can be added later without rewriting app logic. The SW sits at the network layer transparently
4. **Most users have connectivity** — A craft beer collection tracker implies connected use. Offline viewing is nice-to-have, not core workflow
5. **Next.js officially supports installability without offline** — You can ship `app/manifest.ts` and get "Add to Home Screen" with zero SW complexity
6. **Rapid iteration risk** — Aggressive caching hides new features and bug fixes from users during MVP phase

### Arguments For Adding Offline Now

1. **Lighthouse PWA score** — Offline is a criterion, but matters more for marketing than users
2. **User expectation after install** — Users who "Add to Home Screen" may expect offline. But many installed PWAs (Twitter Lite, Starbucks) have limited offline and users accept this
3. **Easier to add early** — Debatable. For read-only caching, retrofitting is not significantly harder

## Sources

- [Workbox Caching Strategies (Chrome Developers)](https://developer.chrome.com/docs/workbox/caching-strategies-overview)
- [Next.js Official PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Serwist Examples (GitHub)](https://github.com/serwist/serwist/tree/main/examples/next-basic)
- [Cache API vs IndexedDB (DEV Community)](https://dev.to/mino/browser-storage-deep-dive-cache-vs-indexeddb-for-scalable-pwas-35f4)
- [Stuck in Cache Hell: A Service Worker Nightmare](https://medium.com/@ankit-kaushal/stuck-in-cache-hell-a-service-worker-nightmare-c878ae33abf4)
- [Taming PWA Cache Behavior (Infinity Interactive)](https://iinteractive.com/resources/blog/taming-pwa-cache-behavior)
- [Build a Next.js 16 PWA with True Offline Support (LogRocket)](https://blog.logrocket.com/nextjs-16-pwa-offline-support/)
- [Building Native-Like Offline in Next.js PWAs (Fishtank)](https://www.getfishtank.com/insights/building-native-like-offline-experience-in-nextjs-pwas)
- [PWA Offline Storage Strategies (DEV Community)](https://dev.to/tianyaschool/pwa-offline-storage-strategies-indexeddb-and-cache-api-3570)
- [next-pwa-pack (dev.family)](https://dev.family/blog/article/effortless-pwa-integration-in-nextjs-with-next-pwa-pack)

## Recommendation

**Skip offline in v1. Add a web app manifest for installability only.**

### Rationale

1. The MVP is a beer collection tracker. Offline viewing is a convenience, not a core need.
2. Next.js officially supports installability without offline — ship `app/manifest.ts` with icons and get "Add to Home Screen" with zero service worker complexity.
3. The SW ecosystem for Next.js is still rough — Serwist requires webpack config, old next-pwa is unmaintained, and manual SW code is a maintenance burden.
4. The risks (cache invalidation bugs, stale data, cross-browser Safari issues, debugging difficulty) are disproportionate to the value for an MVP.
5. Retrofitting is straightforward — when offline becomes a real user need, adding Stale While Revalidate via Serwist is well-documented and doesn't require app rewrites.

### Suggested Phased Approach

- **v1 (now)**: Ship `manifest.ts` + icons only. App is installable, no service worker.
- **v2 (when users ask)**: Add Serwist with precaching for static assets only. No API caching.
- **v3 (if needed)**: Add Stale While Revalidate for API responses to enable read-only offline viewing.

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| pwa-manifest | Add Next.js `app/manifest.ts` with app metadata and icons for installability | high | none |
| pwa-icons | Create PWA icon set (192x192, 512x512) for home screen installation | high | none |
| offline-static-cache | Add Serwist service worker to precache static assets (JS, CSS, images) | low | pwa-manifest |
| offline-api-cache | Add Stale While Revalidate caching for API responses enabling read-only offline viewing | low | offline-static-cache |
