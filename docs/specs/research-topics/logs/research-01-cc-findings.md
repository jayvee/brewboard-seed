# Research Findings: caching strategy

**Agent:** Claude (cc)
**Research ID:** 01
**Date:** 2026-04-01

---

## Key Findings

### Current State

Brewboard is a minimal Next.js 14.2 (App Router) project deployed on Vercel. The beer catalogue is currently a hard-coded array in `src/app/page.tsx` — no database, no API routes, no caching. An unused `fetchBeers()` stub exists in `src/lib/api.ts`. This means the caching strategy should be designed for when a real data layer is introduced.

### Option 1: Redis (via Upstash)

**How it works:** External key-value store shared across all serverless function instances. Upstash provides an HTTP-based Redis client purpose-built for serverless/edge environments.

| Dimension | Detail |
|-----------|--------|
| Latency | ~1–5ms per request (HTTP to Upstash) |
| Cold-start impact | **None** — cache is external and shared; new function instances immediately benefit |
| Cross-instance sharing | Yes — single cache for all instances |
| Invalidation complexity | **3/5** — TTL alone is simple, but proper tag-based or pub/sub invalidation requires deliberate design |
| Cost | Free tier: 500K commands/mo. Pay-per-request after: $0.2/100K commands |

**Best patterns for catalogue data:**
- **Cache-aside (lazy loading):** Check Redis first → on miss, query DB, store result with TTL → return. Ideal for high-read/low-write catalogue data.
- **TTL strategy:** Catalogue metadata (1hr TTL), search results (5min TTL), user-specific data (15min TTL).
- **Tag-based invalidation:** Group keys into Redis Sets by category (e.g., all IPAs, all beers from a brewery) for bulk invalidation.

**Why Upstash over alternatives:**
- ElastiCache is VPC-only — unusable from Vercel.
- Redis Cloud requires TCP — unavailable in edge runtimes.
- Upstash is a first-class Vercel integration (provision via dashboard, get `KV_REST_API_URL` + `KV_REST_API_TOKEN`).

**Watch out:** One team reported Upstash costs spiking from $25 to $600/mo due to N+1 cache access patterns. Batch reads where possible.

### Option 2: In-Memory Caching (lru-cache, node-cache)

**How it works:** Cache lives in the Node.js process heap. Zero network overhead.

| Dimension | Detail |
|-----------|--------|
| Latency | ~0ms (in-process memory access) |
| Cold-start impact | **Severe** — cache starts completely empty on every new function instance |
| Cross-instance sharing | No — each Vercel function instance has its own isolated cache |
| Invalidation complexity | **1/5** — trivially simple within one instance, but cross-instance invalidation is impossible |
| Cost | Free (no infrastructure) |

**Critical problem in serverless:** Under traffic spikes, Vercel spins up many function instances. Each starts with an empty cache, creating a "thundering herd" of database queries. Different users may see inconsistent data because their requests hit different instances with different cache states.

**Only useful for:** Deduplicating repeated computations within a single request lifecycle (micro-optimization). Not a viable primary caching strategy for serverless.

**Memory limits:** Vercel functions get 2GB (Hobby) or 4GB (Pro). A 1000-beer catalogue at ~2-5KB/beer is only ~2-5MB, so memory isn't the constraint — the isolation and cold-start problems are.

### Option 3: CDN Edge Caching (Vercel ISR)

**How it works:** Next.js Incremental Static Regeneration pre-renders pages and caches them at Vercel's 126+ global edge PoPs. Uses stale-while-revalidate: users always get fast responses while regeneration happens in the background.

| Dimension | Detail |
|-----------|--------|
| Latency | ~0ms (served from nearest edge PoP) |
| Cold-start impact | **None** — edge cache serves pre-generated content; no serverless function invoked for cache hits |
| Cross-instance sharing | Yes — globally distributed CDN cache |
| Invalidation complexity | **2/5** — on-demand ISR with cache tags is straightforward: tag fetches, call `revalidateTag()` from a webhook |
| Cost | Included in Vercel plan (Pro: $20/mo with generous ISR limits) |

**Key mechanisms:**
- **Time-based revalidation:** Set `revalidate = 3600` (1hr) on the page — automatically regenerates in background.
- **On-demand revalidation:** Call `revalidateTag('product-123')` from a webhook when data changes — global invalidation in ~300ms.
- **Cache tags:** Up to 128 tags per response. Design taxonomy: per-product, per-category, per-brewery.

**Limitations:**
- Not suitable for personalized content (carts, user-specific pricing).
- First request after invalidation still serves stale content (by design — users never see loading states).
- Debugging cache behavior can be opaque.

### Competitor / Industry Analysis

**No public architecture docs** were found for Untappd, BeerMenus, Tavour, or RateBeer.

**Shopify Hydrogen** (most relevant public reference):
- Uses stale-while-revalidate with 1-second revalidation as default.
- Classifies data by volatility: product titles get `CacheLong()`, inventory gets `CacheShort()`.
- Runs on V8 Isolates (Shopify Oxygen) — no cold starts.
- Rule: never cache personalized content.

**Next.js Commerce** (Vercel's reference e-commerce template):
- ISR for all catalogue pages.
- Webhook-based revalidation: subscribe to Shopify product webhooks → `revalidateTag()`.
- Product updates appear site-wide within 2-3 seconds.

**Industry consensus:** Multi-layer caching (CDN edge + application cache + DB query cache) is standard. Proper caching can eliminate ~80% of database calls.

### Comparison Matrix

| Dimension | Redis (Upstash) | In-Memory | CDN Edge (ISR) |
|-----------|----------------|-----------|----------------|
| Latency | ~1-5ms | ~0ms | ~0ms |
| Cold-start impact | None | Severe | None |
| Cross-instance sharing | Yes | No | Yes (global) |
| Invalidation complexity | 3/5 | 1/5 | 2/5 |
| Infrastructure cost | Free → pay-per-use | Free | Included in Vercel |
| Additional dependencies | Upstash SDK | None | None (built into Next.js) |
| Best for | API responses, search, rate limiting, shared state | Single-request dedup | Page-level catalogue data |
| Worst for | Simple static pages | Serverless environments | Personalized/real-time data |

---

## Sources

- [Redis Caching Patterns — Cache-Aside, Write-Through, TTL](https://dev.to/myougatheaxo/redis-caching-with-claude-code-cache-aside-write-through-and-ttl-strategy-1fdd)
- [Redis Cache Optimization Strategies](https://redis.io/blog/guide-to-cache-optimization-strategies/)
- [AWS Database Caching Strategies Using Redis](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html)
- [Upstash Redis on Vercel](https://medium.com/@amarharolikar/upstash-redis-on-vercel-the-tool-i-didnt-know-i-needed-7ecfbb6e7a6e)
- [Redis Caching Strategies: Next.js Production Guide](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)
- [Upstash vs Redis Cloud vs ElastiCache](https://upstash.com/docs/redis/overall/compare)
- [Upstash Pricing](https://upstash.com/pricing/redis)
- [Optimizing Upstash Redis Bill ($600 → $25)](https://www.linkedin.com/posts/stefanmai_how-we-dropped-our-upstash-redis-bill-from-activity-7422085818980360192-4aUr)
- [Redis Cache Invalidation Strategies](https://oneuptime.com/blog/post/2026-01-25-redis-cache-invalidation/view)
- [AWS Serverless and Node.js In-Memory Cache](https://medium.com/@code.context/aws-serverless-and-node-js-in-memory-cache-what-you-need-to-know-241d41f54539)
- [lru-cache npm](https://www.npmjs.com/package/lru-cache)
- [Vercel ISR Documentation](https://vercel.com/docs/incremental-static-regeneration)
- [Next.js ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Next.js Caching Guide](https://nextjs.org/docs/app/getting-started/caching)
- [Vercel Functions Memory Limits](https://vercel.com/docs/functions/configuring-functions/memory)
- [Vercel CDN Overview](https://vercel.com/docs/cdn)
- [Shopify Hydrogen Caching](https://shopify.dev/docs/storefronts/headless/hydrogen/caching)
- [High Performance Hydrogen Storefronts — Shopify Engineering](https://shopify.engineering/high-performance-hydrogen-powered-storefronts)
- [Next.js Commerce 2.0 (Vercel)](https://vercel.com/blog/introducing-next-js-commerce-2-0)
- [Vercel Edge Rate Limiting with Upstash](https://upstash.com/blog/edge-rate-limiting)

---

## Recommendation

**Use a two-layer caching strategy: CDN Edge (ISR) as primary, Upstash Redis as secondary.**

### Layer 1: CDN Edge Caching (ISR) — Primary

Use Next.js ISR for all beer catalogue pages (listing, detail, brewery pages). This is the highest-impact, lowest-effort option:
- Zero additional infrastructure — built into Next.js + Vercel.
- Fastest possible response times — content served from edge PoP nearest to user.
- No cold-start penalty — cache hits bypass serverless functions entirely.
- Set `revalidate = 3600` (1hr) for catalogue pages; use on-demand `revalidateTag()` for immediate updates when beers are added/modified.

### Layer 2: Upstash Redis — Secondary

Add Upstash Redis when the app needs caching beyond page-level:
- **Search results:** Cache filtered/sorted queries that ISR can't cover (dynamic query combinations).
- **API responses:** Cache data fetched by client components that bypass ISR.
- **Rate limiting:** Protect API routes from abuse.
- **Shared counters:** View counts, rating aggregations.

### Skip: In-Memory Caching

In-memory caching is not viable as a primary strategy in Vercel's serverless model. The cold-start and instance isolation problems make it unreliable. Only use it as a micro-optimization within single request lifecycles (e.g., deduplicating repeated computations in a React Server Component tree).

### Implementation Order

1. **First:** Implement ISR when building catalogue pages (trivial — just add `revalidate` export).
2. **Later:** Add Upstash Redis when search/filtering or API routes are introduced.
3. **Never as primary:** In-memory caching.

---

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| catalogue-isr-caching | Add ISR with time-based revalidation (1hr) to beer catalogue pages | high | none |
| catalogue-cache-tags | Implement on-demand revalidation with cache tags (per-beer, per-brewery, per-style) triggered by data change webhooks | medium | catalogue-isr-caching |
| upstash-redis-setup | Integrate Upstash Redis via Vercel integration for application-level caching | medium | none |
| search-result-caching | Cache search/filter query results in Upstash Redis with 5-minute TTL | medium | upstash-redis-setup |
| api-rate-limiting | Add rate limiting to API routes using Upstash Redis | low | upstash-redis-setup |
