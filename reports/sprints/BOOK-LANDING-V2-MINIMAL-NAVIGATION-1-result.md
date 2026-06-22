# BOOK-LANDING-V2-MINIMAL-NAVIGATION-1 Result

Status: implementation complete, awaiting human review.

## Summary

Implemented Book Landing V2 Minimal Navigation in the platform generator, added
a clean canonical fixture, added guardrails, regenerated Book 1 book output,
and captured rendered proof.

The book page now functions as navigation/orientation only. It points to
chapter landing pages. Paragraph routes, checks, games, textbook files, and
companion resources remain below the book page.

## Changed Files

Platform:

- `build-scripts/platform/build-landing-page.js`
- `build-scripts/platform/check-book-landing-v2.js`
- `scripts/tests/build-landing-page.test.js`
- `references/ui/book-landing-v2/approved-minimal.html`
- `references/ui/book-landing-v2/README.md`
- `build-scripts/README.md`
- `package.json`
- sprint proof/report files under `reports/sprints/`

Lesson:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/index.html`

## Proof

- Screenshot manifest:
  `reports/sprints/BOOK-LANDING-V2-MINIMAL-NAVIGATION-1-screenshot-manifest.md`
- DOM proof:
  `reports/sprints/BOOK-LANDING-V2-MINIMAL-NAVIGATION-1-screenshots/dom-proof.json`

DOM proof confirms:

- `body[data-layout="book-landing-v2"]`;
- app shell, sidebar, book overview, and chapter list exist;
- one Book 1 chapter card renders;
- chapter card href targets chapter `index.html`;
- no direct paragraph hrefs;
- no direct resource hrefs;
- no `.chapter-card-domain`;
- old shell markers are absent.

## Validation

Passed:

- `node --check build-scripts/platform/build-landing-page.js`
- `node --check build-scripts/platform/check-book-landing-v2.js`
- `cmd /c npx jest --runInBand scripts/tests/build-landing-page.test.js`
- `cmd /c npm run check:book-landing-v2`
- `cmd /c npm run check:chapter-landing-v2`
- `cmd /c npm run check:landing-v2`
- `cmd /c npm run check:platform`
- `MODULE_ROOT=<Book 1 target> node build-scripts/platform/build-landing-page.js`
- `MODULE_ROOT=<Book 1 target> node scripts/check-links.js`
- `git diff --check` in platform and lesson repos

Notes:

- `check:platform` passed with 54 suites passed, 6 skipped, and 809 tests
  passed.
- Link checking passed for 108 HTML files and 586 local references.
- Direct `npm` / `npx` through PowerShell is blocked by local execution
  policy, so validation used `cmd /c npm` and `cmd /c npx`.

## Authority Boundary

This result does not close Scale Gate 1, product-route adoption, diagnostics,
mastery/PV, or student/product-use authority. Human review is still required.
