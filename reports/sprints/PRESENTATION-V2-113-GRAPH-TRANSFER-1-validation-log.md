# PRESENTATION-V2-113-GRAPH-TRANSFER-1 Validation Log

Date: 2026-06-23
Status: ready for human review

## Generated Output

Platform source:

- `build-scripts/content/book-1/b1-113-presentation-v2-model.js`
- `build-scripts/content/book-1/b1-113-presentation-v2.js`
- `build-scripts/content/book-1/b1-113-student-web.js`
- `engines/tests/presentation-v2-113-graph-transfer.test.js`

Lesson output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - presentatie.html`

## Commands

- `npm.cmd run build:presentation-113`
  - Passes and writes the 1.1.3 web presentation HTML.
- `node build-scripts/content/book-1/b1-113-student-web.js`
  - Passes and writes the same presentation HTML from the standalone deck.
  - Does not regenerate the PPTX.
- `npx.cmd jest --runTestsByPath engines/tests/presentation-v2-113-graph-transfer.test.js engines/tests/l1-6r-dual-coding.test.js engines/tests/graphical-data.test.js --runInBand`
  - Passes: 2 suites passed, 1 skipped; 10 tests passed, 1 skipped.
- `npm.cmd run check:golden-presentation-111`
  - Passes.
- `npm.cmd run check:golden-graph-advisory-113`
  - Passes.
- `node scripts/validate-paragraph.js --mode complete --profile student-web "<1.1.3 folder>"`
  - Passes.
- `node scripts/qa-presentation-v2-html.js "<1.1.3 presentation.html>" "C:\wt\PARA-LANDING-20260610\reports\presentation-v2-113-graph-transfer-1\presentation-v2-qa"`
  - Passes.
  - Captures 42 screenshots across desktop, notes, fullscreen, dark, dark-notes, and mobile states.
- `npm.cmd run check:platform`
  - Passes: 60 suites passed, 6 skipped, 898 tests passed.
  - Console output includes existing validation-fixture warnings; Jest exit code is 0.
- `git diff --check`
  - Passes in platform and lesson repos.

## Active Route Scan

The active 1.1.3 presentation HTML contains:

- `Lespresentatie`
- `Studentgerichte uitleg`
- `Presentatiemodus`
- graph visual ids for ice table, P-Q graph, interpolation graph, and axis comparison

The active 1.1.3 presentation HTML does not contain:

- `beheers*`
- `golden webpresentatie`
- `webpresentatie</span>`
- `Docentcue`
- `<h3>Visual`
- `<h3>Data`
- `Speaker notes`
- `Download PowerPoint`
- `Full screen`
- `Exit full screen`
