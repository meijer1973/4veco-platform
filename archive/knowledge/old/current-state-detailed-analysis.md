# Current State Detailed Analysis

Generated: 2026-04-23  
Scope: `4veco-platform`, `../4veco-lessen`, and `references/`

## Purpose

This document records the current observed state in more detail than the roadmap files. It is intended as a starting point for deeper follow-up analysis, not as a final architecture decision.

## Sprint 0.5 Update

Updated on 2026-04-24 after explicit platform unfreeze sign-off. This supersedes the original 2026-04-23 snapshot where the companion path had not yet been proven.

Current gate status:

- `npm.cmd run check:platform` passes: 10 passing suites, 363 passing tests, 6 skipped tests.
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passes: 26/26 checks.
- Book 1 Part A textbook/chapter delivery is green.
- The Phase 0 deployment/output freeze is lifted for controlled `../4veco-lessen` production under the normal build/validation workflow.

Current companion status:

- `1.1.1 Schaarste en economisch denken` proves the first full Part A + Part B companion path end-to-end.
- `build-scripts/content/book-1/` exists.
- `source-data/book-1/reasoning/` exists.
- Book 1 has a book-root `deploy-config.json` and `shared/` game-data/engine layer.
- Companion production can now scale in Sprint P1.2, starting with `1.1.2 Percentages en indexcijfers`.

## How This Was Assessed

The analysis was based on local inspection of:

- `../CLAUDE.md`
- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `build-scripts/README.md`
- `skills/`
- `build-scripts/`
- `scripts/`
- `references/`
- `reports/`
- `../4veco-lessen/`

Validation commands run during inspection included:

```powershell
node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen"
node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.2 Hoofdstuk Vraag"
node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en kosten"
node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.4 Hoofdstuk Marktevenwicht en marginale analyse"
node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.5 Hoofdstuk Toetsvoorbereiding"
npm.cmd test -- --runInBand
```

## Repository Architecture

`4veco-platform` is the source repo for:

- game engines
- build scripts
- reusable templates
- content-builder scripts
- reference registries
- skills/prompts
- validation scripts
- generated diagnostic reports

It is not intended to contain student-facing output directly.

The main output paths are:

- Module 3 legacy output via `scripts/deploy.js`.
- Markdown-native books in `../4veco-lessen`.

Strategically, `../4veco-lessen` is the forward path. Module 3 is frozen until September 2026 and should not receive expensive structural investment.

## Companion Output Directory

Observed companion directory:

```text
C:\Projects\4veco\4veco-lessen
```

The user referred to `4veco-lesson`; local inspection found `4veco-lessen`, which appears to be the intended companion output directory.

Current top-level contents:

- `course_blueprint_v4.md`
- `vw-1022-a-25-1-o.pdf`
- `Boek 1 - Grondslagen, vraag en aanbod/`

## Book 1 State

Book 1 exists at:

```text
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod
```

It contains:

- 5 chapter folders.
- 21 paragraph folders.
- book-level markdown, HTML, and PDF.
- book-level `_assets/`.
- no `deploy-config.json` at the book root as of Sprint 0.5 verification.
- no book-level `shared/` engine/game-data layer as of Sprint 0.5 verification.

File-type counts under `../4veco-lessen` at inspection time:

| Extension | Count |
|---|---:|
| `.svg` | 324 |
| `.png` | 324 |
| `.html` | 84 |
| `.md` | 75 |
| `.pdf` | 68 |
| `.py` | 26 |
| `.js` | 14 |
| `.css` | 6 |
| `.yaml` | 4 |
| `.pyc` | 2 |
| `.json` | 1 |

No `.docx` or `.pptx` files were found in Book 1 during inspection.

## Book 1 Chapter Validation

Sprint 0.5 update: all five chapters now pass through `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"`. The chapter notes below record the current status after the QC backfill and blocker fixes.

### Chapter 1.1

Status: passed.

The validator reported:

- 3 theory paragraphs.
- 1 consolidation paragraph.
- all required markdown/PDF files present.
- reviews present.
- quality refs present.
- assets paired and referenced correctly.
- chapter assembly present.
- 0 errors, 0 warnings.

### Chapter 1.2

Status: passed after Sprint 0.5.

Resolved in Sprint 0.5:

- Added the missing `_chapter-plan.md`.
- Added missing review reports and quality refs.
- Fixed the blocking 1.2.3 table/formula mismatch and slope-language errors.

### Chapter 1.3

Status: passed after Sprint 0.5.

Resolved in Sprint 0.5:

- Added the missing `_chapter-plan.md`.
- Added missing review reports and quality refs.
- Fixed the blocking 1.3.1 graph-text numeric mismatch.

### Chapter 1.4

Status: passed after Sprint 0.5.

Resolved in Sprint 0.5:

- Added missing review reports and quality refs.
- Existing chapter plan remains accepted by the validator.

### Chapter 1.5

Status: passed after Sprint 0.5.

Resolved in Sprint 0.5:

- Added missing review reports and quality refs.
- Fixed the blocking 1.5.1, 1.5.3, and 1.5.4 review findings.
- Existing chapter plan remains accepted by the validator.

## Platform Test State

Command:

```powershell
npm.cmd test -- --runInBand
```

Observed result after Sprint 0.2:

- 10 passing suites.
- 4 skipped suites.
- 362 tests passed.
- 5 tests skipped.
- 0 tests failed.

Resolved areas:

### Skilltree Data Tests

The tests are now catalog-driven instead of hard-coded to the older 37-skill state.
`GEN.A38` through `GEN.A44` are implemented as interactive skilltree generators:

- A38: Procentuele verandering berekenen
- A39: Prijsindex (CPI) berekenen
- A40: Welvaartsgebied op P-Q diagram arceren
- A41: Na-belasting of na-subsidie aanbodfunctie afleiden
- A42: Grafische verschuiving met voor-en-na pijlen
- A43: Totale winst uit gemengde allocatie berekenen
- A44: Individuele stapfunctie-vraagcurve tekenen uit betalingsbereidheid

### Validate-Chapter Tests

The validator tests now pass. The warning/error lines visible during `npm.cmd test -- --runInBand` come from deliberate negative fixtures, not failing Jest assertions.

## Validator State

`scripts/validate-chapter.js` is useful and already reflects much of the Part A chapter contract.

`scripts/validate-paragraph.js` was aligned in Sprint 0.2. It now supports the current flat `4veco-lessen` layout:

- `--mode part-a`: textbook markdown, PDFs, `build_pdf.py`, assets, review, and quality ref.
- `--mode part-b`: the 24 flat companion root files, `_paragraph-plan.md`, and shared game data.
- `--mode complete`: Part A plus Part B.
- `--mode auto`: Part A unless companion markers are present.

It has focused Jest coverage and has been checked against real Book 1 Part A paragraphs `1.1.1` and `1.1.4`. Complete-mode validation correctly fails on current Book 1 paragraphs because the Part B companion layer is not present yet.

## Build Script State

The active build-script architecture is clear:

- `build-scripts/platform/`: reusable automated layer.
- `build-scripts/lib/`: shared libraries, converters, verifiers.
- `build-scripts/templates/`: reusable content scaffolds.
- `build-scripts/content/`: paragraph-specific content builders.
- `build-scripts/books/`: book assembly pipeline.
- `build-scripts/references/`: machine-reference CLI suite.
- `build-scripts/reports/`: generated diagnostics.

Current rich document builders are split between current Book 1 work and retained legacy references:

- `build-scripts/content/book-1/`
- `build-scripts/content/legacy-target/`

This supports the conclusion that Book 1 Part A is broad, while Book 1 Part B still needs a new flat-layout production pattern.

## Reference Folder State

### Authored References

`references/authored/` contains:

- `course-target-exercises.json`
- `didactiek-principes.md`
- `economic_mathematical_precision_reference.md`
- `economie-terminologie.md`
- `skill-categories.md`
- `vraagtypen-en-opgaveontwerp.md`

This folder is the remaining human-maintained knowledge surface. Some files should likely remain authored because they encode expert judgement. Others are candidates for migration to machine-edited references over time.

### External References

`references/external/` contains:

- syllabus PDF for VWO economie 2026.
- extracted syllabus markdown/JSON.
- school/inspectie standards.
- 24 CvTE exam PDFs across havo/vwo, 2023-2025, opgaven and correctievoorschriften.
- extracted `exam-questions.json`.

The external source base is strong and reproducible.

### Machine References

`references/machine/` contains:

- `micro-teaching-units.md`
- `micro-teaching-units.json`
- `begrippen.md`
- `begrippen.json`

These are supposed to be edited only through CLI scripts.

## Machine Unit Catalog Details

Current measured state:

| Metric | Value |
|---|---:|
| Total units | 192 |
| Live units | 190 |
| Deprecated units | 2 |
| Dependency edges | 199 |
| Units with no `needs` | 61 |
| Units with exam codes | 188 |
| Units with terms | 146 |
| Units with procedures | 101 |
| Apply/analyze/evaluate units without procedure | 0 |

Deprecated units:

- `D23`
- `H26`

Domain distribution:

| Domain | Units |
|---|---:|
| A | 44 |
| B | 2 |
| D | 36 |
| E | 7 |
| F | 18 |
| G | 12 |
| H | 30 |
| I | 20 |
| L | 21 |

Mastery distribution:

| Mastery | Units |
|---|---:|
| understand | 89 |
| apply | 80 |
| analyze | 18 |
| evaluate | 3 |

Main catalog strengths:

- The graph is acyclic in prior reports.
- Apply-level and higher units all have procedures.
- Exam-code coverage is high.
- The L-domain labor-market set exists as a coherent unit group.

Main catalog risks:

- Many units still have no `needs` edges.
- Many units still lack term links.
- Reports were refreshed in Sprint 0.4; keep them regenerated after catalog changes.
- A-domain catalog expansion has outrun the skilltree generator layer.

## Begrippen Registry Details

Current measured state:

| Metric | Value |
|---|---:|
| Live terms | 225 |
| Deprecated terms | 0 |
| Terms with definitions | 225 |
| Terms with examples | 225 |
| Terms with pitfalls | 60 |
| Terms with teaching-unit links | 94 |
| Terms with formulas | 34 |

Domain distribution:

| Domain | Terms |
|---|---:|
| D | 58 |
| E | 20 |
| F | 15 |
| G | 17 |
| H | 50 |
| I | 65 |

The registry is already usable for definitions and examples. The main unfinished areas are:

- pitfall coverage.
- reverse links to teaching units.
- migration of unit term citations to the new slug IDs.

## Exam Data Details

Current measured state:

| Metric | Value |
|---|---:|
| Extracted question records | 349 |
| havo question records | 175 |
| vwo question records | 174 |
| Records from 2023 | 119 |
| Records from 2024 | 116 |
| Records from 2025 | 114 |
| Distinct opgaven exam files | 12 |
| Records with required skills | 322 |
| Records with exam codes | 330 |

Question type distribution:

| Type | Count |
|---|---:|
| uitleg_dat | 171 |
| berekenen | 76 |
| uitleg_of | 33 |
| noem | 25 |
| classificatie | 23 |
| bron | 12 |
| grafisch | 9 |

Most-cited required skills in exam questions:

| Unit | Citations |
|---|---:|
| A15 | 16 |
| D15 | 14 |
| A04 | 13 |
| A21 | 13 |
| I01 | 12 |
| I08 | 12 |
| F09 | 11 |
| G04 | 11 |
| G02 | 9 |
| A19 | 9 |
| F07 | 9 |
| A20 | 9 |
| E01 | 9 |
| A06 | 8 |
| H04 | 6 |

Risks:

- `27` question records still lack required-skill links.
- `19` question records still lack exam-code links.
- Deprecated unit `D23` still appears in two exam-question records.

## Blueprint Target Exercise Data

`references/authored/course-target-exercises.json` contains:

- `49` target exercises.
- `13` for Book 1.
- `12` each for Books 2, 3, and 4.
- `223` total required-skill citations.
- `84` missing-unit flags across `39` exercises.

Difficulty distribution:

| Difficulty | Exercises |
|---|---:|
| LIGHT | 7 |
| MEDIUM | 41 |
| HEAVY | 1 |

Most-cited required skills in target exercises:

| Unit | Citations |
|---|---:|
| A06 | 14 |
| A10 | 13 |
| A19 | 10 |
| A04 | 7 |
| A32 | 7 |
| A40 | 6 |
| A07 | 5 |
| A21 | 5 |
| A13 | 5 |
| A11 | 5 |

The target exercise data is valuable, but `missing_units_flagged` should become a curated backlog with explicit statuses. Raw text flags are useful during design, but poor as a long-term operational queue.

## Report Layer State

Reports under `reports/` are generated diagnostics and should not be hand-edited.

Sprint 0.4 regenerated the core reports. The old `143-145` live-unit counts are no longer current.

Current report state:

- `dag-integrity.md`: PASS, 192 total units.
- `terminology-drift.md`: PASS, 0 drift.
- `unresolved-refs.md`: warning only; 6 deprecated-ID citations in planning docs.
- `needs-coverage.md`: 190 live units, 61 with no `needs`.
- `terms-coverage.md`: 190 live units, 44 with no `terms`.
- `procedure-coverage.md`: 101/101 apply+ units have procedures.
- `aspects-coverage.md`: 190 live units, 69 without exam citation.
- `dead-units.md`: 137 uncited live units; this is an exercise-first triage signal, not a bulk-deprecation list.
- `begrippen-coverage.md`: 225 live terms, 0 deprecated terms.

Details live in `knowledge/reference-report-sanity.md`.

## Main Risks

### 1. Stale Green Signals

Resolved for Phase 0 report freshness in Sprint 0.4. Future risk remains if generated reports are not refreshed after catalog changes.

### 2. Layout Drift

`validate-paragraph.js` now follows the flat `4veco-lessen` layout. The next layout risk is wiring that standalone validator into the book-level health command.

### 3. Catalog Ahead Of Engine

Resolved for A38-A44 in Sprint 0.1. Non-A prerequisites are still kept in the catalog and filtered out of the executable skilltree graph.

### 4. Half-Migrated Terminology

The new `begrippen.json` registry is strong, but unit term citations are not fully migrated to its slug IDs.

### 5. Part B Production Pattern Not Yet Proven

There is no `book-1` content-builder folder yet. Rich companion production for the new `4veco-lessen` layout still needs a pilot.

### 6. Module 3 Distraction

Module 3 is important operationally, but strategically frozen. Expensive fixes there should be questioned before starting.

## Suggested Further Analysis

1. **Term migration map**
   - Map old human-readable unit term strings to `begrippen.json` slug IDs.
   - Decide whether to preserve aliases for backwards compatibility.

2. **Book 1 cleanup pass**
   - Use `npm run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` as the single failure list.
   - Resolve the chapter 1.2-1.5 review, quality-ref, chapter-plan, and asset issues.

3. **Book 1 companion pilot plan**
   - Pick chapter 1.1.
   - Inventory which current Book 1 builders and retained legacy references can be adapted.
   - Identify missing flat-layout library support before writing content.

4. **Book 2 readiness check**
   - Extract Book 2 target exercises.
   - Check whether required skills exist and are adequately defined.
   - Decide which missing flags must be resolved before Book 2 production.
