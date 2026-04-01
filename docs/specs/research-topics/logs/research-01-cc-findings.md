# Research Findings: caching strategy

**Agent:** Claude (cc)
**Research ID:** 01
**Date:** 2026-04-02

---

## Key Findings

### 1. Next.js 14 Built-in Caching (Free, Zero Config)

Next.js 14 App Router provides **four caching layers** out of the box:

| Layer | Scope | Duration | What it caches |
|-------|-------|----------|----------------|
| **Request Memoization** | Per-request | Request lifetime | Deduplicates identical `fetch()` calls within a single render |
| **Data Cache** | Server-side | Persistent (revalidatable) | `fetch()` responses, `unstable_cache` results |
| **Full Route Cache** | Server-side | Persistent until revalidation | Static HTML + RSC payload for static routes |
| **Router Cache** | Client-side | Session (30s dynamic, 5min static) | Prefetched routes in the browser |

Key behaviors:
- `fetch()` is **cached by default** in Next.js 14 App Router (`force-cache` is the default)
- `unstable_cache` (now stable as of Next.js 15, but usable in 14) wraps non-fetch async functions (DB queries, computations) with the same Data Cache
- On **Vercel**, the Data Cache is persistent and shared across all serverless instances automatically
- **Self-hosted**, the Data Cache is per-process only (file-system based by default)

**This is the most important finding**: Next.js already provides substantial caching that many teams overlook. For BrewBoard's current stage (hardcoded data, no API yet), the built-in caching is more than sufficient.

### 2. In-Memory Caching Options

| Library | Maintenance | Features | Serverless-safe? |
|---------|------------|----------|-------------------|
| **`lru-cache`** | Active (v10+) | LRU eviction, TTL, size limits, sub-ms reads | No — cache lost on cold start |
| **`node-cache`** | Unmaintained (6+ years) | TTL, events | No — same cold start issue |
| **Plain `Map`** | N/A (built-in) | None (no eviction, no TTL) | No — and risks memory leaks |
| **`unstable_cache`** | Next.js core | TTL via `revalidate`, tag-based invalidation | Yes — backed by Data Cache |

**Verdict on in-memory**: `lru-cache` is the only viable third-party option if you need in-process caching. However, it has a critical limitation in serverless environments: **each function invocation may get a fresh instance**, so cache hit rates are unpredictable. On a traditional Node.js server (e.g., `next start`), `lru-cache` works reliably.

### 3. Redis Options

| Library | Best for | Connection type | Free tier |
|---------|----------|-----------------|-----------|
| **`@upstash/redis`** | Serverless / Vercel | HTTP (REST API) | 500K commands/mo, 256MB, 200GB bandwidth |
| **`ioredis`** | Long-running servers | TCP persistent connection | Requires self-hosted Redis |
| **`redis` (node-redis)** | Long-running servers | TCP | Requires self-hosted Redis |

**Why `@upstash/redis` is the right Redis choice for Next.js on Vercel:**
- HTTP-based — no TCP connection pool exhaustion in serverless
- Generous free tier covers early-stage apps easily
- Vercel Marketplace integration (auto-provisioned env vars)
- Edge Runtime compatible

**Why not Redis right now:**
- Adds an external dependency and operational surface area
- Requires error handling for Redis unavailability (network issues, quota limits)
- BrewBoard has no data that benefits from shared cache yet (no database, no API)
- Premature for the current project stage

### 4. Vercel Platform Caching

- **Vercel KV**: Deprecated as of December 2024. Migrated to Upstash Redis directly.
- **Vercel Edge Config**: Ultra-low-latency (~1ms) read-only store for feature flags and configuration. Not suitable for general-purpose caching (1KB per item, 512 items max on free tier).
- **ISR (Incremental Static Regeneration)**: Vercel automatically handles ISR caching. Pages with `revalidate` are cached at the CDN edge and regenerated in the background.
- **Data Cache on Vercel**: `fetch()` and `unstable_cache` results are persisted globally across all instances — this is free and automatic.

### 5. What Experienced Developers Recommend for Early-Stage Apps

The consensus across multiple sources is clear: **start simple, add complexity only when you have evidence you need it.**

- Next.js built-in caching handles most read-heavy patterns without any additional libraries
- Redis should be introduced when you need: shared state across instances, rate limiting, session storage, or real-time features (pub/sub)
- In-memory caching (lru-cache) is useful as a **hot cache in front of Redis** for extremely latency-sensitive paths, not as a primary cache
- The biggest mistake teams make is introducing Redis too early and then dealing with connection management, error handling, and operational monitoring before they have real traffic

## Sources

- Next.js Caching Documentation: https://nextjs.org/docs/app/building-your-application/caching
- Next.js `unstable_cache` API: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
- `lru-cache` npm package: https://www.npmjs.com/package/lru-cache
- Upstash Redis documentation: https://upstash.com/docs/redis/overall/getstarted
- Upstash free tier details: https://upstash.com/pricing
- Vercel KV deprecation announcement: https://vercel.com/changelog/vercel-kv-migration-to-upstash
- Vercel Edge Config documentation: https://vercel.com/docs/storage/edge-config
- Vercel Data Cache: https://vercel.com/docs/infrastructure/caches

## Recommendation

**Start with Next.js built-in caching only. Add `@upstash/redis` when a concrete need arises.**

### Phase 1 — Now (Launch)
Use Next.js Data Cache via `fetch()` options and `unstable_cache` for any server-side data fetching. This is:
- Zero additional dependencies
- Works in dev, self-hosted, and Vercel
- Supports time-based revalidation (`revalidate: 60`) and on-demand revalidation (`revalidateTag()`)
- Already optimized for the deployment target

### Phase 2 — When You Add a Database
When BrewBoard connects to a real database (Postgres, etc.), wrap DB queries with `unstable_cache` using appropriate TTLs and tags. This gives you caching without Redis.

### Phase 3 — When You Need Shared State
Add `@upstash/redis` when you need one or more of:
- Rate limiting (e.g., API abuse prevention)
- Session storage shared across serverless instances
- Real-time features (leaderboards, live tap lists)
- Cache that must survive deployments and be shared across regions

This phased approach avoids premature complexity while providing a clear upgrade path.

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| cache-fetch-layer | Add `unstable_cache` wrappers for server-side data fetching with tag-based revalidation | high | none |
| cache-revalidation-api | Create API route for on-demand cache revalidation via `revalidateTag()` | medium | cache-fetch-layer |
| redis-integration | Add `@upstash/redis` client with connection pooling and error fallback | low | none |
| cache-monitoring | Add cache hit/miss logging to track effectiveness before scaling | low | cache-fetch-layer |
