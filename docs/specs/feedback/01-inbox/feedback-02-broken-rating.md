---
id: 2
title: Half-star ratings round down silently
status: inbox
type: bug
severity: medium
---

# Feedback: Half-star ratings round down silently

## Summary

Reported by @craft_mike via support email:

"I rated Pliny the Elder 4.5 stars. When I go back to the beer page, it shows 4 stars. Happened three times now with different beers — only when I pick a half star. Whole stars save fine."

## Evidence

- Reproduced locally: POST /api/ratings sends `4.5`, DB stores `4.5`, but GET /api/beers/:id returns `4`
- Root cause likely in `Math.floor()` in the rating serializer (src/lib/ratings.ts:47)
- Only affects the read path, not the write path — data is correct in DB

## Impact

12 ratings in the last week have been silently rounded down. Users lose trust in the rating system when their input isn't preserved.
