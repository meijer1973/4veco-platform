# LANDING-V2-FRANKENSTEIN-REPAIR Validation Log

Date: 2026-06-11
Owner: codex
Status: refreshed after check-surface gate closure
Branch: `codex/paragraph-landing-v2-prototype-port-20260611`

## Scope

Implemented the paragraph landing V2 repair from current `main`, not by
polishing PR #45/#11. The approved prototype fixtures were added first, then
the paragraph renderer was rebuilt from the prototype structure and dynamic
route data.

This repair does not close downstream Scale Gate 1, product-route adoption,
diagnostics/mastery/PV, or student/product-use work. Those remain blocked until
renewed human review confirms closure.

## Source Baseline

- Original platform `origin/main`: `19e34817`
- Refreshed platform `origin/main`: `91154093`
- Lesson `origin/main`: `883a1f7d`
- Approved fixtures:
  - `references/ui/paragraph-landing-v2/approved-light.html`
  - `references/ui/paragraph-landing-v2/approved-dark.html`
- Lesson contract:
  - `4veco-lessen/specifications/paragraph-landing-layout-v2.md`

## Core Requirements

- Generated paragraph pages use `.app-shell`, `.route-strip`, `.learning-row`,
  `.row-label`, `.tile-grid`, and `.tile`.
- Generated paragraph pages do not use `.page-layout`, `.sidebar-toggle`,
  `.sidebar-overlay`, `.resource-card`, `.route-secondary-group`,
  `.landing-v2-*`, `data-layout="paragraaf-v2"`, or
  `../../shared/voorkennis.css`.
- Six route rows and sixteen tile IDs render for 1.1.1, 1.1.2, and 1.1.3.
- Missing future surfaces render as disabled `in-preparation` placeholders with
  no `href`.
- Unscoped `wiskundevaardigheden.html` remains reachable through secondary
  material without becoming the primary Rekenen or Skill-engine tile.

## Static Proof

Checked generated pages for 1.1.1, 1.1.2, and 1.1.3:

- 1.1.1: 6 rows, 16 tiles, 4 disabled placeholders, no fake links, no
  forbidden legacy markers.
- 1.1.2: 6 rows, 16 tiles, 1 disabled placeholder, no fake links, no forbidden
  legacy markers.
- 1.1.3: 6 rows, 16 tiles, 1 disabled placeholder, no fake links, no forbidden
  legacy markers.

## Screenshot Proof

Screenshots are stored in
`reports/sprints/LANDING-V2-FRANKENSTEIN-REPAIR-screenshots/`.

- `approved-light.png`
- `generated-1.1.1-light.png`
- `comparison-light.png`
- `approved-dark.png`
- `generated-1.1.1-dark.png`
- `comparison-dark.png`
- `generated-1.1.1-mobile-narrow.png`
- `generated-1.1.1-phone-414.png`

The in-app browser screenshot API was attempted first but timed out on static
fixture capture. Chrome headless was used for the committed proof screenshots.
The initial narrow proof used a 760x844 viewport because Chrome's CLI screenshot
path produced a misleading cropped artifact while the responsive CSS was being
debugged. After the lead-review proof flag, a final Chrome DevTools Protocol
capture was added at a true CSS viewport width of 414px. The measured page
reported `innerWidth=414`, `clientWidth=414`, `scrollWidth=414`, and
`bodyScrollWidth=414`.

## Commands

- `node --check build-scripts\platform\build-landing-page.js`
- `node build-scripts\platform\build-landing-page.js`
- `npm.cmd run check:scope-language`
- `npm.cmd run agent:index`
- `npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js`
- `node scripts\check-links.js`
- `node scripts\validate-paragraph.js --mode complete --profile student-web "<1.1.1 path>"`
- `node scripts\validate-paragraph.js --mode complete --profile student-web "<1.1.2 path>"`
- `node scripts\validate-paragraph.js --mode complete --profile student-web "<1.1.3 path>"`
- `npm.cmd run check:platform`
- Chrome DevTools Protocol 414px generated screenshot capture for 1.1.1.

## Results

- Focused landing-page Jest suite passed: 4 tests.
- Link check passed: 108 HTML files and 589 local references checked; all
  interactive files reachable.
- Paragraph validators passed for 1.1.1, 1.1.2, and 1.1.3.
- Full platform check passed: 52 suites passed, 6 skipped; 785 tests passed, 8
  skipped.
- Lead-review proof flag addressed with `generated-1.1.1-phone-414.png`; the
  measured 414px CSS viewport had no horizontal overflow.

## Refresh 2026-06-12

PR #47 was rebased after `GATE-CHECK-SURFACE-EXCELLENT-1` closed on platform
main. The generated agent indexes were refreshed after rebase conflict
resolution. The closure artifacts remain separate from this landing V2 lane.
