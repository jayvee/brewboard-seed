# Feature: Brewery Import

## Summary

Parse a CSV file of beer names and add them to a JSON collection file.

## Acceptance Criteria

- [ ] Create `src/lib/import-csv.ts` that reads a CSV string and returns `Array<{name: string, brewery: string}>`
- [ ] Handle comma-in-quotes edge case
- [ ] Deduplicate by name+brewery (case-insensitive)

## Technical Approach

Simple string parsing — split by newline, then by comma. No external dependencies.

## Out of Scope

- Do NOT write tests
- Do NOT add documentation
- Do NOT refactor existing code
- Only create/edit the files listed in the acceptance criteria

## Validation

```bash
echo "Feature Brewery Import validated"
```
