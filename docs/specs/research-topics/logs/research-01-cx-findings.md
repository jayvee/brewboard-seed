# Research Findings: Caching Strategy

**Agent:** Codex (cx)
**Research ID:** 01
**Date:** 2026-04-01

---

## Key Findings

### Main trade-offs

- **In-memory cache** is the fastest and simplest option, but it only helps a single server or process. Microsoft’s caching guidance treats in-memory caching as a fit for single-server scenarios, while distributed caching is the right choice once the app needs to scale across multiple instances.
- **Redis** is the best shared-cache choice for a read-heavy beer catalogue. Redis recommends cache-aside for read-heavy apps, and the trade-off is predictable: one extra network hop in exchange for shared state, better scale-out, and more consistent cache behavior across app nodes.
- **CDN edge caching** is the right place for public static assets and cacheable public pages. Cloudflare’s docs separate browser TTL from edge TTL, and their purge tooling supports practical invalidation when catalogue images or public pages change.
- **Cache invalidation is the real cost center.** A cache strategy looks simple until imports, edits, moderation, or merges need to invalidate multiple cache layers in a coordinated way.
- **Stampede protection matters for hot items.** Microsoft’s HybridCache docs explicitly call out stampede protection, which is the right pattern for popular catalogue entries and search keys even if we do not adopt that exact library.

### Competitor patterns

- **Untappd** is fronted by Cloudflare. A live header check on `https://untappd.com/` returned `server: cloudflare` and `cf-cache-status: DYNAMIC`. That proves a CDN/security edge layer is in place, but it does not prove the HTML is edge-cached.
- **BeerAdvocate** also sits behind Cloudflare. A live header check returned Cloudflare challenge headers, which again shows an edge layer rather than the internal cache design.
- The visible pattern across these consumer catalogue sites is a **layered approach**: CDN at the edge, shared application caching for hot data, and no reliance on in-process memory alone. That is an inference from the public evidence plus the official caching guidance above.

## Sources

- [Redis caching overview](https://redis.io/solutions/caching/)
- [Redis cache-aside tutorial](https://redis.io/tutorials/howtos/solutions/microservices/caching/)
- [Microsoft caching guidance](https://learn.microsoft.com/en-us/dotnet/core/extensions/caching)
- [Cloudflare edge and browser cache TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/)
- [Cloudflare cache purge methods](https://developers.cloudflare.com/changelog/post/2025-04-01-purge-for-all/)
- [Untappd homepage](https://untappd.com/) - live header check observed `server: cloudflare` and `cf-cache-status: DYNAMIC` on 2026-04-01
- [BeerAdvocate homepage](https://www.beeradvocate.com/) - live header check observed Cloudflare challenge headers on 2026-04-01

## Recommendation

Use a **layered cache strategy**:

- **CDN edge cache** for public beer pages, images, CSS, JS, and any anonymous API responses that can tolerate TTL-based freshness.
- **Redis cache-aside** for shared hot catalogue data, search results, and other read-heavy dynamic objects that are expensive to recompute or repeatedly fetch.
- **Small per-process L1 cache** only for ultra-hot, low-risk lookups where a slightly stale value for a short period is acceptable.

The implementation should favor **TTL plus event-driven invalidation**:

- TTL handles the default expiry path.
- Event-driven purge handles imports, edits, and moderation changes.
- Tag-based or grouped purges are preferable at the CDN layer where available.
- Request coalescing or single-flight protection should be added for hot keys to avoid cache stampedes.

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| redis-catalog-cache-aside | Add Redis cache-aside for shared catalogue lookups and repeated search responses. | high | none |
| cdn-public-catalog-cache | Cache public beer pages and static assets at the CDN edge with explicit TTLs. | high | none |
| cache-invalidation-events | Emit invalidation events for imports, edits, and moderation changes. | medium | redis-catalog-cache-aside, cdn-public-catalog-cache |
| cache-stampede-protection | Coalesce concurrent misses for hot keys and popular catalogue items. | medium | redis-catalog-cache-aside |
| process-l1-hot-cache | Add a tiny per-process L1 for ultra-hot immutable lookups. | low | redis-catalog-cache-aside |
