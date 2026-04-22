# reports/qc/

Outputs of the catalog quality-control pipeline.

Each `qc-run-YYYY-MM-DD.md` file is one **timestamped run** produced by the `/qc-references` slash command. The `SUMMARY.md` aggregates one row per run for trend analysis.

## How to read a run report

A run report has one section per test (currently three MVP tests):

1. **Probing exam questions** — 7 questions a senior teacher would ask; for each, the closest matching catalog unit + tree walk + verdict.
2. **Exam-derived skills** — 6+6 opgaves from two CvTE VWO tijdvakken; for each, the closest matching catalog unit + tree walk + verdict.
3. **Tree-integrity audit** — 5 randomly-sampled units; per-unit verdict on exam_codes, needs edges, and kern↔procedure alignment.

Each report ends with a **Recommended fixes** rollup: catalog edits the user might apply (mints, exam_code corrections, edge drops). The runner never auto-applies these — the user reviews the report and decides.

## How to read SUMMARY.md

| Run date | Tests run | New gaps | Gaps closed | Catalog units | Notes |

- **New gaps** = candidate units / fixes flagged by this run that were NOT flagged in the previous run.
- **Gaps closed** = items flagged in the previous run that no longer surface (because the user minted them or fixed them).
- A healthy trend: catalog-units-count rises, new-gaps drops over time, gaps-closed > new-gaps as the catalog matures.

## Cadence

The runner is invoked manually:
- After ≥5 catalog edits since the last run, OR
- At minimum once per month so cumulative drift gets caught.

## Provenance

Prompts that drive each test live in `references/qc-prompts/`. Edit them to change what the tests check. The runner skill is `skills/qc-references.md` (mirror in `.claude/commands/`).
