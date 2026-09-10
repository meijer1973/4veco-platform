# Reference Report Sanity

Generated: 2026-04-23  
Scope: Sprint 0.4 Green Gate report sanity pass

## Result

The core reference reports have been regenerated against the current catalog. The old `143-145` unit-count reports are no longer current.

All structural report commands completed successfully:

```powershell
node build-scripts\reports\dag-integrity.js
node build-scripts\reports\needs-coverage.js
node build-scripts\reports\terms-coverage.js
node build-scripts\reports\procedure-coverage.js
node build-scripts\reports\aspects-coverage.js
node build-scripts\reports\terminology-drift.js
node build-scripts\reports\dead-units.js
node build-scripts\reports\unresolved-refs.js
node build-scripts\references\build-begrippen-index.js
```

## Current Counts

| Metric | Value |
|---|---:|
| Total units | 192 |
| Live units | 190 |
| Deprecated units | 2 |
| Live terms | 225 |
| Deprecated terms | 0 |
| Terms with teaching-unit links | 94 |
| Terms with pitfalls | 60 |
| Terms with formulas | 34 |

Live unit domain spread:

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

## Report Status

| Report | Status | Green Gate meaning |
|---|---|---|
| `reports/dag-integrity.md` | PASS | Blocking structural check is green. |
| `reports/terminology-drift.md` | PASS | Blocking terminology check is green. |
| `reports/unresolved-refs.md` | WARN | No unresolved IDs; 6 deprecated-ID citations remain as migration hints. |
| `reports/needs-coverage.md` | INFORMATIONAL | 61 live units have no `needs`; this is backlog, not a gate blocker. |
| `reports/terms-coverage.md` | INFORMATIONAL | 44 live units have no term links; this is backlog, not a gate blocker. |
| `reports/procedure-coverage.md` | INFORMATIONAL | 101/101 apply+ units have procedures; no blocker. |
| `reports/aspects-coverage.md` | INFORMATIONAL | 69 units lack exam citation for aspect inference; this is backlog, not a gate blocker. |
| `reports/dead-units.md` | INFORMATIONAL | 137 live units are uncited by scanned source files; do not bulk-deprecate. Use exercise-first triage. |
| `reports/begrippen-coverage.md` | INFORMATIONAL | Term definitions/examples are complete; pitfalls and reverse links remain backlog. |

## Non-Blocking Findings

- `reports/unresolved-refs.md` warns about deprecated unit IDs in planning docs:
  - `knowledge/current-state-detailed-analysis.md`
  - `references/reference-team-roadmap.md`
  - `knowledge/three-month-roadmap.md`
- `D23` still appears in `references/external/exam-questions.json`, but the current unresolved-reference scan does not include external JSON. Treat this as reference cleanup, not a Phase 0 platform blocker.
- `reports/dead-units.md` is a weak signal while the book-production layer is still young. Many units are intentionally ahead of current built material.

## Green Gate Decision

Sprint 0.4 removes "stale reports" as a Green Gate blocker. The remaining Green Gate blockers are now:

- Book 1 content/QC gaps surfaced by `npm run check:book`.
- Final Sprint 0.5 sign-off.
