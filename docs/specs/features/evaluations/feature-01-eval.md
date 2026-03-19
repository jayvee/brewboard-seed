# Evaluation: Feature 01 - dark-mode

**Mode:** Fleet (Multi-agent comparison)
**Evaluator:** cc (anthropic/opus)

## Spec
See: `./docs/specs/features/04-in-evaluation/feature-01-dark-mode.md`

## Implementations to Compare

- [x] **cx** (Codex): `/Users/jviner/src/brewboard-worktrees/feature-01-cx-dark-mode`
- [x] **gg** (Gemini): `/Users/jviner/src/brewboard-worktrees/feature-01-gg-dark-mode`

## Evaluation Criteria

```
  ┌─────────────────┬──────┬──────┐
  │ Criteria        │  cx  │  gg  │
  ├─────────────────┼──────┼──────┤
  │ Code Quality    │ 9/10 │ 7/10 │
  │ Spec Compliance │ 9/10 │ 8/10 │
  │ Performance     │ 8/10 │ 8/10 │
  │ Maintainability │ 9/10 │ 7/10 │
  ├─────────────────┼──────┼──────┤
  │ Total           │35/40 │30/40 │
  └─────────────────┴──────┴──────┘
```

## Approach Comparison

Both implementations follow the same architecture: inline `<script>` in `<head>` to prevent FOUC, a `'use client'` toggle component with `useState`/`useEffect`, localStorage persistence under `brewboard-theme`, and OS preference fallback. Both add `dark:` Tailwind classes to `<body>`.

### Key Differences

| Aspect | cx (Codex) | gg (Gemini) |
|--------|-----------|-------------|
| **localStorage validation** | Validates value (`=== 'light' \|\| === 'dark'`) before using | Unsafe `as` cast — any stale string accepted |
| **Storage key** | Extracted to `STORAGE_KEY` constant | Hardcoded in 3 places |
| **Type safety** | `Theme` type alias, helper function | Inline type literal, `as` cast |
| **`suppressHydrationWarning`** | Missing | Present on `<html>` — prevents React warning |
| **try/catch in script** | No | Yes — defensive against blocked localStorage |
| **`type="button"`** | Present | Missing (defaults to `submit` in form contexts) |
| **Toggle positioning** | `fixed top-4 right-4` | Wrapper div with `max-w-4xl` layout |
| **Transition** | None | `transition-colors` on body |
| **Export style** | Named export | Default export |

## Summary

### Strengths & Weaknesses

#### cx (Codex)
- Strengths: Proper localStorage validation prevents corrupted state. Extracted constants reduce duplication. `type="button"` is correct semantics. Named export aids refactoring. Thorough log documenting the hydration-mismatch mitigation strategy.
- Weaknesses: Missing `suppressHydrationWarning` — will produce a React console warning when the inline script sets `dark` before hydration. No try/catch around localStorage in the inline script (fails if storage is blocked). Fixed positioning may overlap page content.

#### gg (Gemini)
- Strengths: `suppressHydrationWarning` correctly handles the server/client class mismatch. try/catch in inline script is defensive. `transition-colors` gives a polished feel. Simpler, fewer lines.
- Weaknesses: Unsafe `as` cast on localStorage value — any arbitrary string passes type check. Storage key hardcoded in 3 separate places (script, useEffect, toggleTheme). Missing `type="button"`. Wrapper div in layout adds layout concerns that border on scope creep. Emoji in button text not requested by spec.

## Recommendation

**Winner:** cx (Codex)

**Rationale:** cx delivers a more robust implementation with proper input validation, extracted constants, correct button semantics, and better type safety. These are the qualities that matter most for maintainability in a real codebase. However, gg has two specific techniques worth adopting before merging:

**Cross-pollination:** Before merging cx, consider adopting from gg: (1) `suppressHydrationWarning` on `<html>` to silence the React hydration warning, and (2) wrapping the inline script's localStorage access in a `try/catch` for resilience when storage is blocked. Both are one-line additions to cx's implementation.
