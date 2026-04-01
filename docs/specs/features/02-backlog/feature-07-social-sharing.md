# Feature: Social Sharing

## Summary

Add a function that generates a share URL for a beer review.

## Acceptance Criteria

- [ ] Create `src/lib/share-url.ts` exporting `function buildShareUrl(beerName: string, rating: number, platform: "twitter" | "facebook"): string`
- [ ] Twitter: return `https://twitter.com/intent/tweet?text=...` with beer name and rating
- [ ] Facebook: return `https://www.facebook.com/sharer/sharer.php?u=...`

## Technical Approach

String template building. One file, one function.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Social Sharing validated"
```
