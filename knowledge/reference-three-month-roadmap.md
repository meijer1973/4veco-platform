# Reference Folder Three-Month Roadmap

Generated: 2026-04-23  
Scope: `references/`, `build-scripts/references/`, `build-scripts/reports/`, and `reports/`

## Executive Direction

The reference folder is no longer just background documentation. It is becoming the production backbone for lesson goals, unit coverage, terminology, exam alignment, and quality control.

The next three months should make that backbone dependable:

> Bring reports back in sync with the current catalog, close structural drift between units and terms, repair skilltree/catalog consistency, and turn the blueprint/exam data into a curated production backlog.

## Current State

### Folder Roles

| Folder | Role | Current assessment |
|---|---|---|
| `references/authored/` | Human-authored expert judgement and planning data | Useful, but still a legacy maintenance surface |
| `references/external/` | Mirrored/extracted outside authority: CvTE, inspectie, school standards | Strong source base; should remain machine-refreshed |
| `references/machine/` | Validated machine-edited registries | Strong core, but moving faster than reports/tests |
| `references/qc-prompts/` | Versioned audit prompts | Good early QC system, not yet wired into routine build gates |

### Machine Unit Catalog

- `192` total units.
- `190` live units.
- `2` deprecated units: `D23`, `H26`.
- Domain spread:
  - `A`: 44
  - `D`: 36
  - `H`: 30
  - `L`: 21
  - `I`: 20
  - `F`: 18
  - `G`: 12
  - `E`: 7
  - `B`: 2
- Mastery spread:
  - `understand`: 89
  - `apply`: 80
  - `analyze`: 18
  - `evaluate`: 3
- Dependency graph:
  - `199` prerequisite edges.
  - `61` live units still have no `needs` edges.
- Coverage:
  - `188/190` live units have exam-code links.
  - `146/190` live units have term links.
  - `101/101` apply/analyze/evaluate units have procedures.

### Skilltree Consistency

- The catalog has `44` A-domain units.
- Skilltree generators currently cover `37`.
- Missing generators: `A38`, `A39`, `A40`, `A41`, `A42`, `A43`, `A44`.
- This is currently reflected in failing tests.

### Begrippen Registry

- `225` live terms.
- `225/225` have definitions.
- `225/225` have examples.
- `60/225` have pitfall text.
- `94/225` are reverse-linked to teaching units.
- `34/225` carry formulas.
- Main risk: unit `terms` fields still include many old canonical text strings, while `begrippen.json` uses slug IDs. This needs a deliberate migration.

### External Exam Data

- `24` PDFs are present: havo/vwo, 2023-2025, opgaven and correctievoorschriften.
- `349` extracted question records.
- `322/349` question records have required-skill links.
- `330/349` question records have exam-code links.
- Question type distribution:
  - `uitleg_dat`: 171
  - `berekenen`: 76
  - `uitleg_of`: 33
  - `noem`: 25
  - `classificatie`: 23
  - `bron`: 12
  - `grafisch`: 9

### Blueprint Target Exercises

- `49` target exercises across Books 1-4.
- All `49` have required skills.
- `223` total required-skill citations.
- `84` `missing_units_flagged` entries remain across `39` exercises.
- These flags are a useful backlog, but some are likely stale because units have since been minted.

### Reports

The report layer is stale in places.

- Several reports still mention `143-145` live units.
- The current catalog has `190` live units.
- `begrippen-coverage.md` is current as of 2026-04-22.
- Most other reports were generated on 2026-04-21 and predate later catalog edits.
- `build-scripts/references/README.md` says the CLI suite is "yet to be built", but many scripts now exist.

## Priority Tasks

### 1. Make Reports Trustworthy Again

- Regenerate all reports from the current catalog.
- Fix report scripts that still assume the old unit count or old terminology source.
- Add a compact reference-health report with:
  - unit counts
  - term counts
  - exam-question coverage
  - target-exercise coverage
  - deprecated refs
  - missing term links
  - stale report warnings

### 2. Close Unit-Term Drift

- Decide the canonical unit `terms` format: slug IDs from `begrippen.json`.
- Build or run a migration that maps old canonical text strings to slugs.
- Fail loudly when a unit cites a term that does not exist in `begrippen.json`.
- Increase teaching-unit reverse links from `42%` toward at least `80%`.

### 3. Repair A-Domain and Skilltree Consistency

- Decide whether A38-A44 are interactive skilltree skills or catalog-only primitives.
- If interactive: add `GEN.A38` through `GEN.A44`.
- If catalog-only: update tests and engine assumptions so only interactive A-units require generators.
- Keep the skilltree tests aligned with the machine catalog, not with hard-coded historical counts.

### 4. Curate Blueprint Missing-Unit Flags

- Convert all `84` raw flags into statuses:
  - minted
  - duplicate
  - still needed
  - defer
  - reject
- Prioritize repeated/high-leverage hubs:
  - graph region shading on P-Q diagrams
  - percentage/index family
  - movement along vs shift of curve
  - externality mirror logic
  - tax/subsidy supply transformations
  - labor-market transfer skills
- Do not bulk-mint from syllabus prose.

### 5. Improve Exam Extraction Completeness

- Fill missing required-skill links for the remaining `27` exam-question records.
- Fill missing exam-code links for the remaining `19` records.
- Replace deprecated `D23` references in `exam-questions.json`.
- Refresh exam-vs-program and blueprint-vs-exam diagnostic reports.

### 6. Keep Machine Editing Real

- Update `build-scripts/references/README.md` to reflect implemented scripts.
- Ensure every machine-reference mutation goes through CLI scripts.
- Add tests around term and unit CLI behavior where gaps are easiest to regress.

## Timeline

### Month 1: Stabilize

Primary goal: make the reference system tell the truth about itself.

- Regenerate reports.
- Fix stale report scripts.
- Add the reference-health report.
- Resolve deprecated `D23` references.
- Decide and fix A38-A44 skilltree/generator policy.
- Update stale CLI documentation.

Deliverable:

- Current reports match the current catalog.
- Platform tests related to references and skilltree are green or have explicit documented exceptions.

### Month 2: Curate

Primary goal: turn raw backlog into usable production signal.

- Triage all `84` blueprint missing-unit flags.
- Mint/update only high-leverage and active-production units.
- Fill the remaining exam-question skill/code gaps.
- Run a fresh reference QC pass and close severe findings.

Deliverable:

- Blueprint flags become a curated backlog instead of raw text debt.
- Exam extraction becomes nearly complete for 2023-2025.

### Month 3: Integrate

Primary goal: make the reference system useful during Book 2 production.

- Push `begrippen` teaching-unit reverse links toward `80%`.
- Add pitfall text for high-use terms first.
- Verify formula-bearing terms against the precision reference.
- Use the cleaned references directly in Book 2 chapter planning and QC.

Deliverable:

- A reference layer that actively guides production instead of merely documenting it.

## Realistic End State

By 2026-07-23, the team can plausibly have:

- Current, trustworthy generated reports.
- Green reference/skilltree tests.
- A curated missing-unit backlog.
- Clean unit-to-term linkage policy.
- Nearly complete exam-question skill/code coverage.
- A `begrippen` registry that is usable in production, not just seeded.

## Metrics To Track

| Metric | Current | Three-month target |
|---|---:|---:|
| Live units | 190 | Stable, only exercise-driven growth |
| Apply/analyze/evaluate units with procedures | 101/101 | 100% maintained |
| Units with exam codes | 188/190 | 100% or justified exceptions |
| Units with term links | 146/190 | 85%+ |
| Begrippen with teaching-unit reverse links | 94/225 | 180/225+ |
| Begrippen with pitfalls | 60/225 | High-use terms covered first |
| Exam questions with required skills | 322/349 | 345+ |
| Exam questions with exam codes | 330/349 | 345+ |
| Blueprint missing flags | 84 raw | 0 raw; all triaged |

