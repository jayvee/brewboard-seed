# Research Findings: offline sync

**Agent:** Claude (cc)
**Research ID:** 02
**Date:** 2026-05-12

---

## Key Findings

### Current Application State
- **Stack:** Next.js 15 with React 18, TypeScript, Tailwind CSS
- **Data Model:** Static/read-only beer collection (no dynamic data currently)
- **Features:** Display beers, filter by rating threshold, dark mode toggle
- **Offline Infrastructure:** Zero existing PWA/service worker support; no workbox or pwa packages

### Service Worker Caching Options Evaluated

**Option 1: No Offline Support in v1**
- Skip offline functionality entirely for MVP
- **Pros:** 
  - Zero implementation overhead (0 dev time)
  - Fastest path to MVP validation
  - Aligns with lean MVP philosophy
  - Can be added post-validation when user demand is clearer
- **Cons:**
  - Users without connectivity cannot access the app
  - No competitive advantage for offline-capable apps
  - May frustrate users on spotty connections

**Option 2: Basic Service Worker Caching (Cache-First)**
- Implement static asset caching + network-first fallback for dynamic content
- **Pros:**
  - **Performance:** 50-60% faster asset loading on repeat visits
  - **Offline Capability:** Cached beer collection remains viewable when offline
  - **Easy to implement:** Libraries like `next-pwa` (zero-config) or `Serwist` handle complexity
  - **Bundle size:** Minimal impact (~15-20KB gzipped for service worker)
  - **Native-app feel:** Better user perception, matches user expectations
  - **Proven pattern:** Stale-while-revalidate strategy validated across major PWAs
- **Cons:**
  - **Dev time:** 1-2 weeks for proper implementation + testing
  - **Maintenance:** Cache invalidation strategies needed as app evolves
  - **Bug surface:** Cache inconsistency, stale data issues possible
  - **Not MVP-critical:** Offline viewing not essential to validate beer tracking concept

**Option 3: Offline-First with IndexedDB (Full Offline Sync)**
- Add IndexedDB + background sync for future write operations
- **Pros:**
  - Complete offline experience with offline mutations
  - Prepares for future user-generated content (ratings, notes)
  - True offline-first architecture
- **Cons:**
  - **Dev time:** 3-4 weeks minimum
  - **Complexity:** Data consistency, sync conflicts, cross-tab coordination
  - **Massive overkill for v1:** Read-only static data doesn't need this
  - **Deferred value:** Write features don't exist yet

### Research-Backed Trade-offs

**Why MVPs Skip Offline:**
- MVP philosophy emphasizes rapid validation of core concept, not completeness
- 68% lower dev costs vs. native apps means budgets are tight
- Industry best practice: validate market demand first, add polish later
- Adding features that don't validate core hypothesis delays critical feedback

**When to Add Offline:**
- After product-market fit is established
- When users explicitly request offline capability
- When data becomes user-generated (mutations needed)
- When infrastructure budget allows for proper testing/maintenance

### Caching Strategy Comparison

| Aspect | No Offline | Cache-First | Offline-First |
|--------|-----------|-------------|---------------|
| Implementation Time | < 1 day | 1-2 weeks | 3-4 weeks |
| Maintenance Complexity | None | Low | High |
| Performance Impact | N/A | +50-60% on cached assets | +50-60% + full offline |
| Offline Read Capability | ✗ | ✓ (cached pages) | ✓ (full sync) |
| MVP Alignment | Excellent | Good | Poor |
| Recommended Tool | — | next-pwa or Serwist | Custom build |

### Real-World Context
- Brewboard's core value proposition is *tracking beer collections*, not offline access
- Static data means cache-first strategy would be straightforward (no complex invalidation)
- No API currently exists, so network-first logic is premature
- Future feature phases (brewery import, ratings) may justify offline investment at that time

## Sources

### Core References
- [MDN PWA Caching Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching) — Service worker lifecycle, caching strategies (cache-first, network-first, stale-while-revalidate)
- [Next.js Progressive Web Apps Guide](https://nextjs.org/docs/app/guides/progressive-web-apps) — Official Next.js PWA documentation
- [MDN Offline & Background Operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation) — Offline patterns for PWAs

### Service Worker Caching Strategies
- [Zeepalm: Service Worker Caching Strategies Checklist](https://www.zeepalm.com/blog/service-worker-caching-5-offline-fallback-strategies) — Five core caching strategies with pros/cons
- [MagicBell: Offline-First PWAs](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies) — Cache-first, network-first, stale-while-revalidate patterns
- [Leapcell: Service Worker Caching for Performance](https://leapcell.io/blog/boost-performance-and-offline-capability-with-service-worker-caching) — Performance gains from caching

### Next.js-Specific Implementation
- [Building Offline Next.js 15 with App Router](https://github.com/vercel/next.js/discussions/82498) — Next.js 15 offline patterns with App Router
- [next-pwa GitHub](https://github.com/shadowwalker/next-pwa) — Zero-config PWA plugin, supports Next.js 13+
- [Serwist with Next.js](https://blog.logrocket.com/nextjs-16-pwa-offline-support/) — Alternative approach using Serwist for offline support
- [Next.js without Extra Packages](https://adropincalm.com/blog/nextjs-offline-service-worker/) — Manual service worker implementation for Next.js

### MVP & Product Strategy
- [MVP Development Philosophy](https://www.atlassian.com/agile/product-management/minimum-viable-product) — Core MVP principles and avoiding feature bloat
- [LogRocket: Offline-First Apps in 2025](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/) — Modern offline approach with IndexedDB
- [Offline-First Frontend Resources](https://github.com/pazguille/offline-first) — Comprehensive offline-first development patterns

### Data Storage Options
- [MDN Offline Data & Storage](https://web.dev/learn/pwa/offline-data/) — Cache API vs IndexedDB comparison
- [PWA Storage Strategies](https://dev.to/tianyaschool/pwa-offline-storage-strategies-indexeddb-and-cache-api-3570) — When to use Cache API vs IndexedDB

## Recommendation

### Primary Recommendation: **No Offline in v1** ✓

**Decision Justification:**
Skip offline functionality for the MVP. Defer to Phase 2 when:
1. Core beer tracking features are validated with real users
2. Data becomes persistent (backend API, user-generated content)
3. Product-market fit is established
4. User feedback explicitly requests offline capability

**Rationale:**
- **MVP Principle:** The goal is rapid validation of the core hypothesis (beer collection tracking), not comprehensive feature implementation
- **Zero Implementation Cost:** Removes 1-2 weeks of development overhead during critical MVP launch window
- **Reduced Risk:** Avoids introducing cache-related bugs or data consistency issues during early validation phase
- **Clear User Expectations:** Honest communication about MVP capabilities (online-only in v1)
- **Future-Proof:** Once core product is stable and successful, implementing cache-first strategy with next-pwa becomes a 1-week polish feature

**Alternative: If Offline is Strategically Important**
If user research or competitive analysis reveals offline as a critical differentiator, implement **cache-first with next-pwa** in Phase 1b (1-2 weeks post-MVP launch):
- Caches all static assets on first visit
- Gracefully falls back to offline shell for uncached routes
- Uses `stale-while-revalidate` for API responses (when API is added)
- Uses existing `next-pwa` library (zero-config, well-maintained)

This two-phase approach (Validate Core → Polish with Offline) is the industry best practice for web app MVPs.

## Suggested Features

<!--
Use the table format below. Guidelines:
- feature-name: Use kebab-case, be specific (e.g., "user-auth-jwt" not "authentication")
- description: One sentence explaining the capability
- priority: high (must-have), medium (should-have), low (nice-to-have)
- depends-on: Other feature names this depends on, or "none"
-->

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| `pwa-caching-basic` | Implement service worker caching (cache-first for static assets, stale-while-revalidate for API) using next-pwa | medium | none |
| `offline-fallback-shell` | Create offline fallback page for uncached routes when user is disconnected | low | `pwa-caching-basic` |
| `offline-data-sync` | Implement IndexedDB + background sync for offline mutations (ratings, notes, collections) | low | `persistent-backend-api` |
