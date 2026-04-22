# references/qc-prompts/

Subagent test specifications for the catalog quality-control pipeline.

Each `*.md` file in this folder is a **versioned prompt** that one subagent runs as part of the `/qc-references` workflow. The prompts are deliberately treated as data (not as operational skills) because:

- They define **what we test**, not how an agent operates day-to-day.
- Conceptually they sit next to the data they validate — `references/external/syllabus-eindtermen.json`, `references/machine/micro-teaching-units.md`, `references/external/exams/*.pdf`.
- A change to a prompt is a **policy change** to the QC standard. It deserves the same review surface as adding a canonical term or re-extracting the syllabus.

## Tests in scope (MVP)

| File | Role | Catches |
|---|---|---|
| `probe-questions.md` | VWO-economie teacher generates 7 probing exam-style questions across domains, names the main skill + prereqs from instinct (no catalog access) | Catalog gaps that real exam topics demand but no unit covers |
| `exam-derived-skills.md` | Same teacher reads 2 real CvTE VWO exam booklets, identifies the main skill per opgave | Whether the catalog can be reached from real exam questions; surface integrative-skill gaps |
| `tree-integrity-audit.md` | Economist auditor inspects 5 sampled units' full text and judges (a) exam_code correctness, (b) needs-edge justification, (c) kern↔procedure alignment | Wrong exam_codes, over-wired prereqs, kern drift — the I12 class of bugs (top-down per-unit) |
| `foundation-audit.md` | VWO-economie docent inspects 5 sampled L0 units and judges whether the empty-`needs` positioning matches what VWO 4 students actually bring from onderbouw | Units mis-marked as L0 that assume advanced prereqs — the H15 class of bugs (bottom-up by layer) |

## How runs are produced

The runner skill `skills/qc-references.md` (slash command `/qc-references`):

1. Reads each prompt verbatim.
2. Parameterises it (today's exam-PDF rotation; today's 5 sampled unit IDs).
3. Launches all 3 subagents in parallel.
4. Walks the resulting trees and synthesises one timestamped report at `reports/qc/qc-run-YYYY-MM-DD.md`.
5. Appends one row to `reports/qc/SUMMARY.md` for trend analysis.

## When to refresh a prompt

Edit a `*.md` file here when:
- A new test type is added (then also add an entry to the runner skill).
- A blind-spot in an existing test is discovered (e.g. teacher consistently misses the L-domain → expand the rubric).
- The CvTE exam-program version changes and reference codes need updating.

Prompts are version-controlled. Do **not** edit them mid-run — the runner snapshots them at invocation time.

## Cadence

The runner is invoked manually:
- After every batch of mints / unit-updates that materially changes the catalog (rule-of-thumb: ≥5 catalog edits since last run).
- At minimum monthly so cumulative drift gets caught.

Not yet wired to any CI hook (none exists in this repo). Re-evaluate when CI lands.

## Outputs

`reports/qc/qc-run-YYYY-MM-DD.md` — full per-test report plus a "Recommended fixes" rollup.
`reports/qc/SUMMARY.md` — single-row-per-run aggregate; the trend table.

The user reads these manually. Findings are recommendations; the runner never auto-mints. Edits to the catalog still flow through the existing `unit-add` / `unit-update` / `unit-deprecate` CLIs.
