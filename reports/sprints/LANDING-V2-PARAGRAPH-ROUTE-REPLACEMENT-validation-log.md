# LANDING-V2-PARAGRAPH-ROUTE-REPLACEMENT Validation Log

Date: 2026-06-11
Owner: codex
Status: complete
Rebase refresh: rebased on current `main` for platform (`19e34817`) and
lesson content (`911b577`) before final force-with-lease push.

## Scope

Implemented the V2 paragraph landing route as a replacement for the old
paragraph landing renderer. The source contract used for implementation was the
human sprint report plus the new canonical spec in
`4veco-lessen/specifications/paragraph-landing-layout-v2.md`. No separate
prototype artifact was present in the workspace, so comparison was made against
the report's explicit approved route contract.

## Core Requirements

- Six route rows render for every generated paragraph: Start, Skill-tree games,
  Leer, Oefen, Check, Open & verdiep.
- Sixteen route tiles render in a stable order.
- Missing future surfaces render as disabled `in-preparation` placeholders.
- No `href="#"` fake links remain in the generated landing route.
- Old paragraph landing structure is no longer the production paragraph render
  path.
- Existing scanner, deploy-config, chapter page, and book page generation remain
  active.

## Static Proof

Checked generated pages for 1.1.1, 1.1.2, and 1.1.3:

- 1.1.1: 6 rows, 16 tiles, 3 disabled placeholders, no fake links, no legacy
  route marker.
- 1.1.2: 6 rows, 16 tiles, 1 disabled placeholder, no fake links, no legacy
  route marker.
- 1.1.3: 6 rows, 16 tiles, 1 disabled placeholder, no fake links, no legacy
  route marker.

## Commands

- `node --check build-scripts\platform\build-landing-page.js`
- `node build-scripts\platform\build-landing-page.js`
- `node scripts\check-links.js`
- `node scripts\validate-paragraph.js --mode complete --profile student-web "<1.1.1 path>"`
- `node scripts\validate-paragraph.js --mode complete --profile student-web "<1.1.2 path>"`
- `node scripts\validate-paragraph.js --mode complete --profile student-web "<1.1.3 path>"`
- `npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js`
- `npm.cmd run check:platform`

## Results

- Link check passed: 108 HTML files and 585 local references checked.
- Paragraph validators passed for 1.1.1, 1.1.2, and 1.1.3.
- Targeted Jest suite passed: 4 tests.
- Full platform check passed: 52 suites passed, 6 skipped; 783 tests passed, 8
  skipped.

## Screenshot Proof

Screenshots are stored in
`4veco-platform/reports/sprints/LANDING-V2-PARAGRAPH-ROUTE-REPLACEMENT-screenshots/`:

- `1.1.1-landing-v2-desktop-light.png`
- `1.1.1-landing-v2-desktop-dark.png`
- `1.1.1-landing-v2-mobile-narrow.png`
