# Research: Caching Strategy

## Summary

Research Redis vs in-memory vs CDN edge caching for the beer catalogue. Consider cold-start times and invalidation complexity.

## Questions

- [x] What are the main trade-offs?
- [x] What do competitors do?

## Findings

Codex (cx) and Gemini (gg) agree on a **layered strategy**: CDN edge for public static assets and cacheable responses, **Redis cache-aside** for shared read-heavy catalogue and search data, and optional **small per-process L1** only for ultra-hot acceptable-stale paths. Invalidation is the dominant cost: pair **TTL** with **event-driven** updates for imports, edits, and moderation; plan **stampede / hot-key** mitigation for popular entries.

**Competitors:** Both point to **Cloudflare (or similar)** at the edge for beer-catalogue sites. cx validated live headers (Untappd/BeerAdvocate show Cloudflare; HTML may remain dynamic). gg adds secondary-source detail on Untappd-style multi-layer stacks (Redis, search tier, mobile caching)—directionally aligned, not contradictory.

## Recommendation

Adopt the layered model in implementation order: **(1)** Redis cache-aside for shared hot data, **(2)** CDN rules for public catalogue surfaces and static assets, **(3)** coordinated invalidation events across those layers, **(4)** stampede protection on hot keys after Redis is in place. Defer optional per-process L1 and separate “hot-key management” backlog items unless profiling demands them.

## Output

### Selected Features

| Feature Name | Description | Priority | Create Command |
|--------------|-------------|----------|----------------|
| redis-catalog-cache-aside | Redis cache-aside for shared catalogue lookups and repeated search responses. | high | `aigon feature-create "redis-catalog-cache-aside"` |
| cdn-public-catalog-cache | Cache public beer pages and static assets at the CDN edge with explicit TTLs. | high | `aigon feature-create "cdn-public-catalog-cache"` |
| cache-invalidation-events | Emit invalidation events for imports, edits, and moderation; coordinate Redis and CDN. | medium | `aigon feature-create "cache-invalidation-events"` |
| cache-stampede-protection | Coalesce concurrent misses for hot keys and popular catalogue items. | medium | `aigon feature-create "cache-stampede-protection"` |

### Feature Dependencies

- `cache-invalidation-events` depends on `redis-catalog-cache-aside` and `cdn-public-catalog-cache`.
- `cache-stampede-protection` depends on `redis-catalog-cache-aside`.

### Not Selected

- `process-l1-hot-cache` (cx): optional L1; defer until measured need.
- `hot-key-management` (gg): folded into stampede protection scope for now.
