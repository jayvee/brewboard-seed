# Research: Caching Strategy

## Summary

Choose one cache approach for launch: in-memory or Redis. Keep recommendation to local dev + small prod traffic.

## Questions

- [ ] Which option should we choose right now?

## Findings

Research completed 2026-04-02. All sources cited inline.

---

## 1. Next.js 14 Built-in Caching (App Router)

Next.js 14 provides **four caching layers** out of the box, all enabled by default:

| Mechanism | What it caches | Where | Duration | Opt-out |
|-----------|---------------|-------|----------|---------|
| **Request Memoization** | Return values of `fetch` calls | Server (memory) | Per-request lifecycle | Pass `AbortController` signal |
| **Data Cache** | Fetched data | Server (persistent) | Persistent across requests & deployments | `{ cache: 'no-store' }` or `dynamic = 'force-dynamic'` |
| **Full Route Cache** | HTML + RSC payload for static routes | Server (persistent) | Until revalidation or redeployment | Use dynamic functions (`cookies`, `headers`) or `dynamic = 'force-dynamic'` |
| **Router Cache** | RSC payload | Client (in-memory) | Session-based; 30s for dynamic routes, 5min for static | Cannot fully opt out; `router.refresh()` clears it |

**Key behaviors:**
- `fetch()` results are cached by default (`force-cache`). Use `{ cache: 'no-store' }` to opt out.
- Time-based revalidation: `fetch(url, { next: { revalidate: 3600 } })` -- stale-while-revalidate pattern.
- On-demand revalidation: `revalidateTag('tag')` or `revalidatePath('/path')` from Server Actions or Route Handlers.
- `unstable_cache` wraps non-fetch async functions (e.g., direct DB queries) with the same Data Cache. It accepts `tags` and `revalidate` options. **Note:** `unstable_cache` is being replaced by `use cache` directive in Next.js 15+.

**What this means for BrewBoard:** The built-in caching already handles a lot. For API fetches and static pages, we get caching for free. The question is what to do for **custom application-level caching** (e.g., caching DB query results, brewery lookups, user beer lists).

Sources:
- [Next.js 14 Caching Documentation](https://nextjs.org/docs/14/app/building-your-application/caching)
- [unstable_cache API Reference](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)
- [Next.js Caching Deep Dive Discussion](https://github.com/vercel/next.js/discussions/54075)

---

## 2. In-Memory Caching Options

### 2a. `lru-cache` (Recommended in-memory option)

- **GitHub stars:** ~5,850 | **Last updated:** actively maintained (days ago)
- **How it works:** LRU eviction policy -- removes least-recently-used items when max size is reached. Supports both size limits and TTL.
- **Performance:** Sub-millisecond (<1ms) lookups. Zero network overhead.
- **Setup complexity:** Minimal -- `npm install lru-cache`, ~10 lines of code.
- **Bundle size:** ~844 kB (includes types + all features)
- **Serverless behavior:** Cache is **per-process and ephemeral**. Each serverless function cold start begins with an empty cache. In long-running servers (e.g., `next start`), the cache persists for the process lifetime.

```ts
import { LRUCache } from 'lru-cache';
const cache = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 5 });
```

### 2b. `node-cache`

- **GitHub stars:** ~2,375 | **Last updated:** 6 years ago (effectively unmaintained)
- **How it works:** TTL-based expiration, no LRU eviction. Stores in a simple object.
- **Weekly downloads:** ~3.9M (legacy usage)
- **Verdict:** **Not recommended** -- unmaintained, no size-based eviction, `lru-cache` is strictly better.

### 2c. Plain `Map` / `globalThis` caching

- Zero dependencies. Use `global.cache = new Map()` or module-level `Map`.
- No automatic eviction or TTL -- you must implement your own cleanup.
- Risk of memory leaks in long-running processes.
- **Verdict:** Fine for 1-2 simple values; use `lru-cache` for anything more.

### 2d. Next.js `unstable_cache`

- Wraps async functions with the built-in Data Cache (same store as `fetch` caching).
- Supports `tags` for on-demand invalidation and `revalidate` for time-based.
- Works with direct DB calls, ORM queries, etc.
- **Limitation:** Cannot access `cookies()` or `headers()` inside the cached function.
- **Verdict:** Best choice for caching DB queries within Next.js server components. No extra dependency needed.

### In-Memory Trade-offs Summary

| Factor | In-Memory (lru-cache) | unstable_cache |
|--------|----------------------|----------------|
| Setup | npm install + code | Built-in |
| Works in serverless | Poorly (cache lost on cold start) | Yes (uses Next.js Data Cache) |
| Works self-hosted | Great (persistent process) | Great |
| Shared across instances | No (per-process) | Depends on deployment (Vercel: yes) |
| Invalidation | Manual TTL/LRU | `revalidateTag` / `revalidatePath` |
| Extra dependency | Yes | No |

Sources:
- [lru-cache npm](https://www.npmjs.com/package/lru-cache)
- [npm-compare: lru-cache vs node-cache vs memory-cache vs quick-lru](https://npm-compare.com/lru-cache,memory-cache,node-cache,quick-lru)
- [Node.js Caching Strategies in Production](https://dev.to/axiom_agent/nodejs-caching-strategies-in-production-in-memory-redis-and-cdn-3kb4)
- [LRU Cache in Node.js Backend Projects](https://dev.to/darkmavis1980/when-and-how-to-use-lru-cache-in-nodejs-backend-projects-42c8)

---

## 3. Redis Caching Options

### 3a. `@upstash/redis` (Serverless-friendly -- Recommended for Vercel)

- **Connection model:** HTTP-based REST API (no TCP connection pool). Solves the serverless connection exhaustion problem.
- **Setup:** `npm install @upstash/redis` + create free DB at upstash.com. Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- **Free tier (updated March 2025):**
  - 500K commands/month (was 10K/day)
  - 256MB data
  - 200GB bandwidth/month (free)
  - Up to 10 databases
- **Pay-as-you-go:** $0.20 per 100K commands beyond free tier. Storage: $0.25/GB.
- **Latency:** ~1-2ms per command (HTTP overhead vs TCP).
- **Edge compatible:** Works in Vercel Edge Functions, Cloudflare Workers, etc.
- **Failure mode:** If Upstash is down, cache misses fall through to DB. HTTP-based so no connection pool leaks.

### 3b. `ioredis`

- **Connection model:** Persistent TCP connections. Requires a running Redis server.
- **Setup:** More complex -- need Redis instance (local Docker for dev, managed service for prod).
- **Performance:** Slightly lower latency than HTTP-based (~0.5-1ms) due to persistent connections.
- **Serverless behavior:** **Problematic.** TCP connections accumulate across serverless invocations, leading to connection pool exhaustion. Requires careful connection management.
- **Best for:** Traditional always-on servers (Railway, Render, EC2, VPS).
- **Free tier:** Redis itself is free/OSS, but you need hosting. Redis Cloud free tier: 30MB.

### 3c. `redis` (node-redis)

- Official Node.js Redis client. Similar to ioredis (TCP-based).
- Less feature-rich than ioredis for cluster/sentinel support.
- Same serverless problems as ioredis.

### When Redis Becomes Worth It

Redis adds value when:
1. You have **multiple server instances** that need a shared cache.
2. You need cache **persistence across deployments/restarts**.
3. You need **cross-request state** (rate limiting, sessions, real-time features).
4. Your cache data is **too large for process memory**.

Redis is overkill when:
1. Single instance, small traffic, data fits in memory.
2. Next.js built-in caching covers your needs.
3. You want zero operational dependencies at launch.

Sources:
- [Upstash Redis New Pricing](https://upstash.com/blog/redis-new-pricing)
- [Upstash Redis Pricing & Limits](https://upstash.com/docs/redis/overall/pricing)
- [@upstash/redis npm](https://www.npmjs.com/package/@upstash/redis)
- [Speed up Next.js with Redis - Upstash Blog](https://upstash.com/blog/nextjs-caching-with-redis)
- [Upstash vs Redis Cloud (2026)](https://www.buildmvpfast.com/compare/upstash-vs-redis-cloud)
- [Scaling Next.js with Redis cache handler](https://dev.to/rafalsz/scaling-nextjs-with-redis-cache-handler-55lh)

---

## 4. Vercel-Specific Caching

### Vercel KV (Deprecated)

**Vercel KV no longer exists.** Existing stores were automatically migrated to Upstash Redis in December 2024. New projects should use a Redis integration from the Vercel Marketplace.

### Vercel Marketplace Redis (via Upstash)

- Install Upstash Redis through Vercel Marketplace -- auto-provisions DB and injects env vars.
- Same Upstash free tier applies (500K commands/month).
- Seamless integration with `@upstash/redis`.

### Vercel Edge Config

- **Purpose:** Ultra-low-latency read-only config store (<1ms reads, 99th percentile <10ms).
- **Use cases:** Feature flags, redirects, A/B test configs. Data replicated to all CDN regions.
- **Not suitable for:** General caching, frequently-written data, user-specific data.
- **Free tier:** Included in Vercel Hobby plan with limits.

### ISR (Incremental Static Regeneration) on Vercel

- Vercel manages the Full Route Cache and Data Cache natively.
- ISR pages are cached at the CDN edge and revalidated in the background.
- On Vercel, the Data Cache is shared across all serverless function instances (unlike self-hosted where it is per-process).
- `revalidateTag` and `revalidatePath` work globally across all edge nodes on Vercel.

### Vercel Data Cache

- Vercel provides a managed Data Cache that persists across deployments.
- This is what powers `fetch` caching and `unstable_cache` on Vercel -- no extra setup needed.
- On self-hosted Next.js, this defaults to an in-memory LRU cache (per-process, lost on restart).

Sources:
- [Redis on Vercel docs](https://vercel.com/docs/redis)
- [Vercel Storage Overview](https://vercel.com/docs/storage)
- [Vercel KV Deprecation Notice](https://vercel.com/docs/redis) (note at top of page)
- [Vercel Edge Config Guide](https://digitalthriveai.com/en-us/resources/platform-docs/vercel/vercel-kv/)

---

## 5. Real-World Recommendations

### Community Consensus for Early-Stage Apps

**Start simple, add complexity when needed:**

1. **Use Next.js built-in caching first.** The Data Cache (`fetch` + `unstable_cache`) handles most needs for free. On Vercel, this is persistent and shared. Self-hosted, it is per-process but sufficient for single-instance deployments.

2. **Add `lru-cache` for hot application data** if running a long-lived server (e.g., `next start` on a VPS). Good for caching parsed configs, brewery lookup tables, or denormalized data that is expensive to compute.

3. **Add Upstash Redis when you need shared state or scale beyond one instance.** The free tier (500K commands/month) is generous for small apps. HTTP-based client works everywhere.

4. **Skip ioredis/node-redis unless self-hosting on always-on infrastructure.** TCP connection management in serverless is a footgun.

### Decision Matrix for BrewBoard

| Scenario | Recommendation |
|----------|---------------|
| Local dev | `unstable_cache` + built-in Next.js caching |
| Single Vercel instance, <1K users | `unstable_cache` (Vercel Data Cache handles persistence) |
| Multiple instances or need sessions/rate-limiting | Add `@upstash/redis` via Vercel Marketplace |
| Self-hosted single instance | `unstable_cache` + `lru-cache` for hot data |
| Self-hosted multiple instances | Redis (Upstash or self-managed) required |

### Comparison Table

| Factor | unstable_cache (built-in) | lru-cache | @upstash/redis |
|--------|--------------------------|-----------|----------------|
| **Setup complexity** | Zero | Minimal (npm install) | Low (npm install + Upstash account) |
| **Cost** | Free | Free | Free up to 500K commands/month |
| **Latency** | <1ms (in-process) | <1ms (in-process) | 1-2ms (HTTP) |
| **Serverless-safe** | Yes | No (cold start = empty cache) | Yes |
| **Shared across instances** | On Vercel: yes. Self-hosted: no | No | Yes |
| **Persistence** | On Vercel: yes. Self-hosted: no | No (process lifetime) | Yes |
| **Scalability ceiling** | Vercel plan limits | Process memory | Upstash plan limits (effectively unlimited) |
| **Failure mode** | Transparent (falls through to data source) | Transparent (cache miss = refetch) | HTTP timeout -> cache miss -> refetch |
| **Invalidation** | `revalidateTag`/`revalidatePath` | Manual TTL/eviction | Manual TTL or pub/sub |
| **Extra dependency** | None | `lru-cache` | `@upstash/redis` |

Sources:
- [Next.js 15 Self-Hosted Apps Need Redis](https://dev.to/technnik/nextjs-15-app-router-caching-why-self-hosted-apps-need-redis-and-how-to-implement-it-23op)
- [Redis Caching Strategies: Next.js Production Guide 2025](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)
- [Optimizing Next.js Scaling with Redis Caching](https://www.ybentaleb.me/blog/nextjs-redis-caching-enhanced)
- [Next.js cacheHandlers config](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)

---

## Recommendation for BrewBoard Launch

**Phase 1 (Now -- Launch):** Use `unstable_cache` for DB query caching + Next.js built-in `fetch` caching. Zero extra dependencies. Works on both local dev and Vercel.

**Phase 2 (When needed):** Add `@upstash/redis` via Vercel Marketplace when any of these triggers hit:
- Need rate limiting or session storage
- Scaling to multiple serverless instances with cache consistency issues
- Need cache persistence across deployments (self-hosted)
- Approaching data volumes where in-memory is insufficient

**Why not Redis from day one?** It adds an external dependency, an account to manage, and network latency to every cached read. For a small craft beer tracking app at launch, the built-in caching is sufficient and simpler to reason about. The migration path to Redis is straightforward when the time comes.
