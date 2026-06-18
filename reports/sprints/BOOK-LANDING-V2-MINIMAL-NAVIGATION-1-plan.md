# BOOK-LANDING-V2-MINIMAL-NAVIGATION-1 Plan

Status: implementation plan for paired platform/lesson PRs.

## Goal

Replace generated book index pages with Book Landing V2 Minimal Navigation.
The book page is navigation/orientation only and helps students choose a
chapter.

## Scope

Platform owns generator, fixture, checker, tests, and evidence:

- `build-scripts/platform/build-landing-page.js`
- `build-scripts/platform/check-book-landing-v2.js`
- `scripts/tests/build-landing-page.test.js`
- `references/ui/book-landing-v2/`
- `package.json`
- sprint evidence under `reports/sprints/`

Lesson owns generated student-facing output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/index.html`

## Non-Negotiables

- Book pages link to chapter `index.html` pages only.
- No book-level Start / Leer / Check / Oefen / Exit-ticket route.
- No book-level games, checks, exercises, textbook files, or resource tiles.
- No direct links to paragraph pages or companion artifacts.
- Chapter cards use neutral `Hoofdstuk N` / `Hoofdstukroute` labels.
- Domain tokens may be styling metadata only, not visible student-facing
  aspect claims.
- Paragraph Landing V2 and Chapter Landing V2 semantics remain unchanged.

## Validation Plan

- Syntax check generator and checker.
- Run focused Jest generator tests.
- Run `check:book-landing-v2`, `check:chapter-landing-v2`, and
  `check:landing-v2`.
- Run full platform Jest suite.
- Regenerate Book 1 output.
- Run lesson link validation.
- Capture desktop light, desktop dark, mobile light screenshots, and DOM proof.

## Authority Boundary

This sprint does not close Scale Gate 1, product-route adoption, diagnostics,
mastery/PV, or student/product-use authority.
