---
id: 1
title: Search is unusable on mobile — 5+ seconds per keystroke
status: inbox
type: performance
severity: high
---

# Feedback: Search is unusable on mobile — 5+ seconds per keystroke

## Summary

Customer report from @hophead_jenny (Pro plan, 340 beers in collection):

"Every time I type in the search bar on my iPhone, the whole page freezes for 5-8 seconds. I'm on 4G and it's been like this since last week's update. Desktop is fine. I literally can't find anything in my collection anymore."

## Evidence

- Device: iPhone 14, Safari, iOS 17.4
- Network: 4G (verified with throttling in DevTools — reproduces on Slow 3G)
- Collection size: 340 beers
- First noticed after v0.8.2 deploy (March 12)
- Desktop Chrome: search responds in <200ms with same account

## Impact

3 other Pro users reported the same issue in Discord this week. All have collections >200 beers. Free-tier users (max 50 beers) are unaffected. Likely an N+1 query or missing index on the search endpoint.
