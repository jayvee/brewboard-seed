---
complexity: low
transitions:
  - { from: "inbox", to: "backlog", at: "2026-05-12T01:41:41.961Z", actor: "cli/feature-prioritise" }
---

# Feature: Social Sharing

## Summary

Add a function that generates a share URL for a beer review.

## Acceptance Criteria

- [ ] Create `src/lib/share-url.ts` exporting `function buildShareUrl(beerName: string, rating: number, platform: "twitter" | "facebook"): string`
- [ ] Twitter: return a URL in the form `https://twitter.com/intent/tweet?text=I+rated+{beerName}+{rating}/5+stars` with the beer name and rating substituted in
- [ ] Facebook: return `https://www.facebook.com/sharer/sharer.php?u=https://brewboard.app`

## Technical Approach

String template building. One file, one function. Use the exact URL format shown in the acceptance criteria.

Do NOT use `encodeURIComponent` or any encoding utility. Manually replace spaces with `+`, `&` with `%26`, and `=` with `%3D` using string `.replace()` calls.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Social Sharing validated"
```
