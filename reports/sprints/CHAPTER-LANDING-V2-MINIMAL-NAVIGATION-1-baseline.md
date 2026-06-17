# CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1 Baseline

Date: 2026-06-17

## Branches

- Platform: `codex/chapter-landing-v2-minimal-navigation-1-20260617`
- Lesson: `codex/chapter-landing-v2-minimal-navigation-1-20260617`

Both branches were created from current `origin/main`.

## Starting State

- The chapter page renderer in
  `build-scripts/platform/build-landing-page.js` still emitted the legacy
  shared lesson shell.
- Generated chapter pages included legacy shell markers such as
  `page-layout`, `sidebar-toggle`, `sidebar-overlay`, `viewer-panel`, and
  `../shared/voorkennis.css`.
- Chapter paragraph cards linked to paragraph `index.html` pages, but showed
  the fallback visible aspect label `Rekenen` through domain-token fallback.
- Paragraph Landing V2 was already implemented and had to remain unchanged.

## Blocked Authority Preserved

This baseline does not close the check-surface gate and does not authorize
Scale Gate 1, product-route adoption, diagnostics, mastery, PV, or
student/product-use claims.
