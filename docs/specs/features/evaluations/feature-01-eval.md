# Evaluation: Feature 01 - dark-mode

**Mode:** Fleet (Multi-agent comparison)

## Spec
See: `./docs/specs/features/04-in-evaluation/feature-01-dark-mode.md`

## Implementations to Compare

- [x] **cc** (Claude): `/Users/jviner/src/brewboard-worktrees/feature-01-cc-dark-mode`
- [x] **gg** (Gemini): `/Users/jviner/src/brewboard-worktrees/feature-01-gg-dark-mode`

## Evaluation Criteria

| Criteria | cc | gg |
|---|---|---|
| Code Quality | 7/10 | 8/10 |
| Spec Compliance | 9/10 | 9/10 |
| Performance | 6/10 | 9/10 |
| Maintainability | 8/10 | 7/10 |
| **Total** | **30/40** | **33/40** |

## Summary

| Agent | Lines | Score |
|---|---|---|
| cc | 45 | 30/40 |
| gg | 64 | 33/40 |

### Strengths & Weaknesses

#### cc (Claude)
- Strengths:
  - Clean, minimal code — easy to understand at a glance
  - Two separate `useEffect` hooks with clear responsibilities (read vs. apply)
  - Named export follows project conventions
  - Fixed-position toggle is unobtrusive and works on all pages
- Weaknesses:
  - No FOUC prevention — dark class only applied after React hydration, causing a visible flash on dark-mode page loads
  - `useState(false)` initializes to light mode, so dark-mode users see a light flash before the effect runs
  - Writes to localStorage on every render cycle of the `isDark` effect, including the initial mount (writes "light" even when no choice was made)

#### gg (Gemini)
- Strengths:
  - Inline `<script>` in `<head>` prevents Flash of Unstyled Content — dark class applied before paint
  - `suppressHydrationWarning` correctly handles the server/client class mismatch
  - Placeholder `<div>` while `theme === null` avoids hydration mismatches on the button itself
  - Only writes to localStorage on explicit user toggle, not on mount
- Weaknesses:
  - `dangerouslySetInnerHTML` inline script adds complexity and a maintenance surface
  - Default export instead of named export (minor style inconsistency)
  - Header wrapper adds layout structure beyond what the spec asked for
  - `dark:bg-stone-950` vs cc's `dark:bg-stone-900` — slightly different shade choice (subjective)

## Recommendation

**Winner:** gg (Gemini)

**Rationale:** Both implementations meet the spec requirements. The decisive factor is gg's inline script for FOUC prevention — without it, dark-mode users see a jarring white flash on every page load. This is a meaningful UX difference that makes gg the stronger implementation.

Before merging, consider adopting from cc: the fixed-position toggle placement (`fixed top-2 right-2 z-50`) instead of gg's header layout, as it's less invasive to the existing page structure and doesn't add a `<header>` element that wasn't in the spec.

