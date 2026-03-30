# Implementation Log: Feature 06 - search
Agent: cx

## Plan
- Add a search input that filters beers by name, brewery, and style.
- Rank matches by relevance (exact > prefix > contains).
- Highlight matched query terms in rendered card text.

## Progress
- Implemented client-side search on the home page using a query state and memoized relevance scoring.
- Added empty-state feedback when no matches are found.
- Updated beer cards to highlight matching terms in beer name, brewery, and style.
- Installed dependencies and verified the app builds successfully.

## Decisions
- Implemented the feature entirely on the existing page/card components to keep changes minimal.
- Used a weighted scoring model to satisfy relevance ranking without introducing backend/API changes.
