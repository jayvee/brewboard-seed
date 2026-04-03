# Evaluation: Feature 01 - dark-mode

**Mode:** Fleet (Multi-agent comparison)

## Spec
See: `./docs/specs/features/04-in-evaluation/feature-01-dark-mode.md`

## Implementations to Compare

- [x] **cc** (Claude): `/Users/jviner/.aigon/worktrees/brewboard/feature-01-cc-dark-mode`
- [x] **cu** (Cursor): `/Users/jviner/.aigon/worktrees/brewboard/feature-01-cu-dark-mode`

## Evaluation Criteria

| Criteria | cc | cu |
|---|---|---|
| Code Quality | 8/10 | 8/10 |
| Spec Compliance | 9/10 | 9/10 |
| Performance | 9/10 | 6/10 |
| Maintainability | 7/10 | 8/10 |
| **Total** | **33/40** | **31/40** |

## Summary

| Agent | Lines | Score |
|---|---|---|
| cc | 44 | 33/40 |
| cu | 75 | 31/40 |

### Strengths & Weaknesses

#### cc (Claude)
- Strengths:
  - Inline `<script>` in `<head>` prevents FOUC (flash of unstyled content) — critical for dark mode UX
  - Concise implementation at 44 lines; does exactly what the spec asks
  - Adds `dark:` utility classes to `<body>` for immediate visual feedback
- Weaknesses:
  - `dangerouslySetInnerHTML` with an inline script string is harder to maintain/read
  - Does not listen for runtime OS preference changes
  - Sparse implementation log

#### cu (Cursor)
- Strengths:
  - Well-structured with extracted helper functions (`readStoredTheme`, `systemTheme`, `applyHtmlClass`)
  - Typed `Theme` type for safety
  - Listens for OS `prefers-color-scheme` changes at runtime with proper cleanup
  - Uses `useCallback` and `suppressHydrationWarning` appropriately
- Weaknesses:
  - **No FOUC prevention** — dark mode users will see a flash of light mode on every page load
  - Over-engineered for the spec scope (69-line component vs 32 lines)
  - Text-based button ("Dark mode"/"Light mode") instead of icon toggle

## Recommendation

**Winner:** cc (Claude)

**Rationale:** The deciding factor is FOUC prevention. cc's inline `<head>` script applies the `dark` class before first paint, which is the standard approach for dark mode in SSR frameworks like Next.js. Without this, cu's implementation will flash light mode on every load for dark-mode users — a significant UX issue. cc is also more concise and scope-appropriate.

**Cross-pollination:** Before merging cc, consider adopting from cu: the `matchMedia('(prefers-color-scheme: dark)')` change listener with cleanup, so the theme reacts when the user changes their OS preference while the app is open.
