# NEWS-DETECTIVE-V2-PROTOTYPE-REPLACEMENT-1 Result

Date: 2026-06-18

Verdict: PASS for implementation readiness.

## Product End-State

The generated Nieuws-detective page is now a V2 product page: app shell,
sidebar, topbar, hero, progress rail, persistent article dossier, round card,
and result card. The active game keeps the complete article readable beside the
round on desktop and above the round on mobile.

## What Changed

- Added canonical V2 fixture and README:
  `references/ui/news-detective-v2/approved.html`.
- Rewrote `engines/newsdetective-ui.js` as a V2 adapter for the existing engine.
- Replaced `engines/newsdetective.css` with the V2 visual system and responsive
  game layout.
- Updated `build-newsdetective-shells.js` to generate V2 shells and copy the
  production engine/UI/CSS assets.
- Fixed `NewsDetectiveEngine.getDomainColors()` for real data without optional
  `domainColors`.
- Added `check:news-detective-v2` and focused V2 UI/layout tests.
- Regenerated Book 1 Nieuws-detective lesson output for 1.1.1, 1.1.2, and
  1.1.3.
- Captured rendered proof from generated 1.1.1 lesson output.

## Core-Requirement Checklist

- [x] V2 prototype is the production baseline.
- [x] Old `nd-header` / `nd-container` / compact article layout is not active.
- [x] Active game screen contains the exact complete article body.
- [x] No `renderArticleCompact`, `line-clamp`, or `-webkit-line-clamp`.
- [x] Concept, consequence-chain, model, and error rounds still work.
- [x] Score, feedback, replay, and paragraph navigation work.
- [x] Light/dark mode works without a competing theme system.
- [x] Mobile stacks the article above the active round.
- [x] Production output has no fake links.
- [x] Platform-generated lesson output exists.
- [x] Guardrails, link checks, unit tests, and rendered proof pass.

## Classified Findings

Blocker - closed:
`getDomainColors()` crashed when real data omitted optional `domainColors`.
Fixed in the engine and covered by a regression test.

Blocker - closed:
Desktop rendered proof showed 15px horizontal overflow from `100vw` content
sizing. Fixed in production CSS and guarded in `check-news-detective-v2`.

Non-blocking documentation/visual note:
The mobile screenshot shows the stacked article dossier first; the DOM proof
records that the active round card is below it and that there is no horizontal
overflow.

## Validation

Passed:

- `node --check engines/newsdetective-ui.js`
- `node --check build-scripts/platform/build-newsdetective-shells.js`
- `node --check build-scripts/platform/check-news-detective-v2.js`
- `npx jest --runInBand engines/tests/newsdetective-engine.test.js`
- `npx jest --runInBand engines/tests/newsdetective-v2-ui.test.js`
- `MODULE_ROOT=<Book 1> npx jest --runInBand engines/tests/newsdetective-data.test.js`
- `npm run check:news-detective-v2`
- `npm run check:landing-v2`
- `npm run check:chapter-landing-v2`
- `npm run check:book-landing-v2`
- `MODULE_ROOT=<Book 1> node scripts/check-links.js`
- `npm run check:platform`

Full platform validation exited 0 with 55 suites passed, 6 skipped, and 812
tests passed. The printed fixture warnings are existing test-fixture noise.

## Carried Issues

blocks: none for this sprint.

does_not_block: downstream Scale Gate 1, product-route adoption, diagnostics,
mastery/PV, and student/product-use authority remain outside this sprint and
must not be claimed closed by this PR pair.

proof_required_to_close: platform PR merge first, lesson PR merge second, then
post-merge regeneration from platform main into lesson main with no output
drift.
