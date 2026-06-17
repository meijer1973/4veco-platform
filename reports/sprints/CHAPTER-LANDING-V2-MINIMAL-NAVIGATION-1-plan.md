# CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1 Plan

Sprint: `CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1`
Date: 2026-06-17

## Product End-State

This sprint supports the navigation/orientation layer described by
`../4veco-lessen/specifications/product-end-state.md` and keeps learning,
exercise, check, game, textbook, and exit-ticket work on paragraph landing
pages.

## Original Sprint Spec

Source handoff: user attachment `fdfa83dd-1593-4d07-9e18-c72abd71b3ef`
and workspace prototype
`../4veco-chapter-landing-minimal-prototype (1).html`.

Approved fixture target:
`references/ui/chapter-landing-v2/approved-minimal.html`.

## Non-Negotiable Requirements

- Implement through `4veco-platform`, not by hand-editing lesson output.
- Chapter pages are navigation/orientation only.
- Paragraph route rows and companion resources remain on paragraph pages.
- Paragraph cards link only to paragraph `index.html` pages.
- Paragraph cards use neutral `Paragraaf N` and `Lesroute` labels.
- Do not render fallback aspect/domain labels such as `Rekenen`.
- Preserve paragraph Landing V2 semantics and route navigation.
- Generate Book 1 chapter 1.1 lesson output from the platform generator.
- Keep Scale Gate 1, product-route adoption, diagnostics, mastery, PV, and
  student/product-use authority blocked pending renewed human review.

## Core-Requirement Checklist

- [x] Add approved chapter fixture and README.
- [x] Add Chapter Landing V2 minimal renderer.
- [x] Keep one DOM for light and dark themes.
- [x] Render sidebar, topbar, hero, chapter info panel, paragraph overview,
  paragraph cards, informational route tags, and footer.
- [x] Guard against old shell markers and direct companion-resource links.
- [x] Add focused Jest coverage and a chapter Landing V2 checker.
- [x] Regenerate Book 1 chapter 1.1 output.
- [x] Capture desktop light, desktop dark, and mobile/narrow proof.

## Validation Plan

- `node --check build-scripts/platform/build-landing-page.js`
- `node --check build-scripts/platform/check-chapter-landing-v2.js`
- `npx jest --runInBand scripts/tests/build-landing-page.test.js`
- `npm run check:landing-v2`
- `npm run check:chapter-landing-v2`
- `npm run check:platform`
- `MODULE_ROOT=<Book 1 target> node build-scripts/platform/build-landing-page.js`
- `MODULE_ROOT=<Book 1 target> node scripts/check-links.js`
- `git diff --check` in platform and lesson repos
