# Evaluation: Feature 01 - dark-mode

**Mode:** Fleet (Multi-agent comparison)

## Spec
See: `./docs/specs/features/04-in-evaluation/feature-01-dark-mode.md`

## Implementations to Compare

- [x] **cc** (Claude): `/Users/jviner/.aigon/worktrees/brewboard/feature-01-cc-dark-mode`
- [x] **gg** (Gemini): `/Users/jviner/.aigon/worktrees/brewboard/feature-01-gg-dark-mode`

## Evaluation Criteria

| Criteria | cc | gg |
|---|---|---|
| Code Quality | 9/10 | 5/10 |
| Spec Compliance | 9/10 | 4/10 |
| Performance | 8/10 | 7/10 |
| Maintainability | 7/10 | 6/10 |
| **Total** | **33/40** | **22/40** |

## Summary

| Agent | Lines | Score |
|---|---|---|
| cc | 48 | 33/40 |
| gg | 99 | 22/40 |

### Strengths & Weaknesses

#### cc (Claude)
- Strengths:
  - Clean, minimal implementation — single component, no unnecessary abstractions
  - Correct file path (`src/components/theme-toggle.tsx`) matching spec exactly
  - Only touches files listed in acceptance criteria (`layout.tsx` + new `theme-toggle.tsx`)
  - Proper OS preference detection with localStorage override
  - Good accessibility (`aria-label`)
- Weaknesses:
  - No context API — theme state is local to the toggle component (acceptable given spec scope)
  - Fixed positioning of toggle button is opinionated but functional

#### gg (Gemini)
- Strengths:
  - Context-based architecture (ThemeProvider + useTheme hook) is extensible
  - Toggle placed in page header is arguably better UX positioning
  - Added `suppressHydrationWarning` on `<html>` to handle SSR flash
- Weaknesses:
  - **Critical bug:** Added `'use client'` to `layout.tsx` — this breaks Next.js App Router because `metadata` cannot be exported from a Client Component. The app will fail to build.
  - Wrong file names: `ThemeToggle.tsx` and `ThemeProvider.tsx` instead of spec-required `theme-toggle.tsx`
  - Modified `page.tsx` which is explicitly out of scope ("Only create/edit the files listed in the acceptance criteria")
  - Over-engineered: Context API + provider + hook for a simple toggle
  - Removed body background/text classes from layout, partially moving styling concerns to page.tsx

## Recommendation

**Winner:** cc (Claude)

**Rationale:** cc delivers a clean, spec-compliant implementation with no bugs. gg has a critical build-breaking bug (`'use client'` on the layout with metadata export), violates the spec by using wrong file names and modifying out-of-scope files, and over-engineers the solution with an unnecessary Context API. The other implementation doesn't have particular features or aspects worth adopting beyond what the winner already provides — gg's `suppressHydrationWarning` is a nice touch but not necessary for this scope.
