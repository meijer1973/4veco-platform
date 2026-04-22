# Catalog QC — run history

One row per `/qc-references` invocation. New rows append to the bottom; never overwrite earlier rows. Older runs remain as `qc-run-YYYY-MM-DD.md` files in this folder.

| Run date | Tests run | New gaps | Gaps closed | Catalog units | Notes |
|---|---|---:|---:|---:|---|
| 2026-04-21 | probe-questions, exam-derived-skills | 10 | — | 178 | First run. Surfaced productiefunctie, lopende rekening, verzekeringspremie, spelboom, Marshall-Lerner, loonelasticiteit arbeidsvraag, monopoly-vs-VC benchmark, integratieve staatsschuld, Keynes-vs-monetarist, valuta-interventie cost. Three closed in same-day mints (H27, H28, G12). |

## How to interpret

- **New gaps** = candidate units / fixes this run flagged that were not flagged in the previous run.
- **Gaps closed** = items flagged in the previous run that no longer surface this run.
- Healthy trend over time: catalog-units rises, new-gaps drops, gaps-closed ≥ new-gaps.

## Schema notes

- `Tests run` is the comma-separated list of QC test IDs that produced output for this run (matches filenames in `references/qc-prompts/`).
- `New gaps` is a count of distinct candidate findings, not a count of report sections (one finding can span multiple sections).
- `Notes` is free-text — used to flag anomalies, mention catalog edits applied immediately, or reference the commit that closed gaps.
