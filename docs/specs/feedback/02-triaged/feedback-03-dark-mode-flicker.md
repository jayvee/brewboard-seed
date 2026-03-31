---
id: 3
title: White flash on every page navigation in dark mode
status: triaged
type: bug
severity: low
---

# Feedback: White flash on every page navigation in dark mode

## Summary

Multiple users in Discord #bugs channel:

@beersnob_dave: "Every time I click a link, there's a white flash before the dark theme kicks in. It's like a flashbang at 2am."
@ales_and_errors: "Same here, been happening since I signed up. I thought it was my browser."

## Evidence

- Classic FOUC (Flash of Unstyled Content) — the `<html>` class is set by a client-side script that runs after first paint
- Fix: inject a blocking `<script>` in `<head>` that reads the theme preference from localStorage before any rendering
- Affects 100% of dark mode users on every navigation
- Safari is worst (longer white flash), Chrome recovers faster

## Impact

Cosmetic but affects perceived quality. Dark mode is used by 67% of users (analytics). Low severity but high visibility — every user sees it every time.
