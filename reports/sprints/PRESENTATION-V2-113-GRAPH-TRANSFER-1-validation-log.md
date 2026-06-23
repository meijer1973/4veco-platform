# PRESENTATION-V2-113-GRAPH-TRANSFER-1 Validation Log

Date: 2026-06-23
Status: READY_FOR_HUMAN_REVIEW

## Generated Output

Platform source:

- `build-scripts/content/book-1/b1-113-presentation-v2-model.js`
- `build-scripts/content/book-1/b1-113-presentation-v2.js`
- `build-scripts/content/book-1/b1-113-student-web.js`
- `engines/tests/presentation-v2-113-graph-transfer.test.js`
- `reports/sprints/PRESENTATION-V2-113-GRAPH-TRANSFER-1-human-review/`

Lesson output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - presentatie.html`
- rich-page graph helper output in the 1.1.3 learning pages

## Commands

- `npm.cmd run build:presentation-113`
  - Passes and writes the 1.1.3 web presentation HTML.
- `node build-scripts/content/book-1/b1-113-student-web.js`
  - Passes and writes the same presentation HTML from the standalone deck.
  - Does not regenerate the PPTX.
- `npx.cmd jest engines/tests/presentation-v2-113-graph-transfer.test.js --runInBand`
  - Passes: 9 tests passed.
- `node scripts/validate-paragraph.js --mode complete --profile student-web "<1.1.3 folder>"`
  - Passes.
- committed screenshot packet verification
  - Passes: 11 PNG files plus manifest and human-review index.
- `npm.cmd test -- --runInBand`
  - Passes: 69 suites passed, 6 skipped, 983 tests passed.
  - Console output includes existing validation-fixture warnings; Jest exit code is 0.
- `git diff --check`
  - Passes in platform and lesson repos.

## Active Route Scan

The active 1.1.3 presentation HTML contains:

- `Lespresentatie`
- `Studentgerichte uitleg`
- `Presentatiemodus`
- graph visual ids for ice table, P-Q graph, interpolation graph, and axis comparison
- eight slides including route success criteria, misleading-axis retrieval, and summary bridge

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
- `Laat leerlingen`
