# Research Findings: caching strategy

**Agent:** Cursor (cu)
**Research ID:** 01
**Date:** 2026-04-02

---

## Key Findings

**Question:** For launch, should we use an in-memory cache or Redis, scoped to local development and small production traffic?

### In-memory (process / Next.js defaults)

- **What it is:** Data lives in the Node.js process. Next.js App Router already provides request memoization, `fetch` caching, and Data Cache behavior documented for typical apps ([Next.js caching overview](https://nextjs.org/docs/14/app/building-your-application/caching)).
- **Pros:** No extra infrastructure; works out of the box in dev; no Redis to install or pay for; simplest mental model for a single running instance; aligns with official guidance that most apps do not need custom external cache handlers ([`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)).
- **Cons:** Cache is **not shared** across multiple server processes or regions; contents are lost on deploy/restart; if you later scale to several instances, each has its own view of cached data unless you add a shared store or accept divergence.

### Redis (or compatible hosted cache)

- **What it is:** A network-accessible key-value store used as a shared cache (and optionally for sessions, rate limits, etc.).
- **Pros:** One logical cache for many app instances; survives individual process restarts (depending on persistence settings); enables consistent invalidation across a fleet when paired with app design; Next.js allows custom `cacheHandlers` to back the Data Cache with Redis when you outgrow the default ([`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)).
- **Cons:** Operational overhead (local Docker or cloud service), latency of a network hop, secrets and monitoring; for **small traffic and a single instance**, it is often unnecessary complexity and cost.

### This codebase

- **brewboard** is a Next.js 14 app with no Redis dependency in `package.json` and no existing cache integration. Introducing Redis now would be a net-new service and dependency without a scaling trigger.

### Decision for “right now”

For **local dev + small prod traffic**, **start with in-memory / framework-default caching** (Next.js built-in layers plus any small in-process module if you need a keyed LRU later). **Defer Redis** until you have a concrete trigger: multiple Node instances behind a load balancer, need for cross-instance invalidation, or strict shared rate limiting / sessions that cannot live in-memory per instance.

**Migration trigger (examples):** horizontal scaling of the Node server; requirement that all users see identical cached responses immediately after invalidation; or moving to serverless with many concurrent isolates where a shared cache is required.

---

## Sources

| Topic | Link |
|--------|------|
| Next.js 14 — Caching (full data cache model) | https://nextjs.org/docs/14/app/building-your-application/caching |
| Next.js — `cacheHandlers` (custom handlers, e.g. Redis) | https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers |
| Redis + Next.js cache patterns (industry context) | https://medium.com/ekino-france/redis-ing-your-next-js-cache-fd0059f0c068 |

---

## Recommendation

**Choose in-memory / Next.js default caching for launch.** It matches the stated scope (small traffic, simple ops), avoids running Redis in every dev environment, and matches Next.js defaults that are explicitly aimed at typical single-instance deployments. **Plan Redis** only after you measure need or adopt multi-instance production—then implement via `cacheHandlers` or a dedicated cache client, not as a day-one requirement.

---

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| next-cache-conventions | Document and consistently use Next.js 14 fetch caching, `revalidatePath` / `revalidateTag`, and route segment options for hot paths. | high | none |
| optional-lru-module | Add a small in-process LRU (or similar) for non-fetch data that must be keyed and bounded, if profiling shows benefit. | low | next-cache-conventions |
| redis-cache-handler | When scaling beyond one instance, add Redis and optional custom `cacheHandlers` integration for shared Data Cache. | low | none |
