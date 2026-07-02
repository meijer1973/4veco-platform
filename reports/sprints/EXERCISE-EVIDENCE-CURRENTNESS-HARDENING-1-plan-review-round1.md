# EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1 Plan Review Round 1

Reviewer: sub-agent lead reviewer

Verdict: REVISE

## Findings

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| Plan did not pass repository plan contract. | missing_core_requirement | Implementation start. | Substantive objective. | Add required headings, exact heading casing, required matrix header, and Quality Standard language. |
| Plan JSON lacked baseline path and baseline artifact. | missing_core_requirement | Planned bundle validation. | Plan intent. | Add baseline metadata/artifact and include planned bundle validation. |
| Sprint evidence paths were under-authorized. | missing_core_requirement | Implementation start. | Narrow currentness scope. | Explicitly authorize plan/result metadata, baseline, command logs, lead-review artifacts, result, and diff summary. |
| Stale-checker guarding lacked explicit fail-closed proof. | proof_gap | Closure. | Core design direction. | Require deterministic nonzero proof that superseded checkers cannot pass as active validators. |

## Required Corrections

- Added `## Inputs`, `## Outputs`, `## Operationalized sprint procedure`,
  and `## Proof Required to Close`.
- Renamed headings to `## Acceptance tests`, `## Rollback plan`, and
  `## Human review required`.
- Updated matrix header to
  `Specification requirement | Implementation evidence required | Review/proof required | Status`.
- Expanded `## Quality Standard` to mention specification, rendered output,
  student-facing behavior, and follow-up handling.
- Added `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-baseline.md`.
- Added `baseline` to
  `references/data/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1.plan.json`.
- Added planned bundle validation to acceptance tests.
- Expanded allowed paths and outputs for sprint evidence artifacts.
- Added explicit stale-checker fail-closed proof to procedure and closure proof.
- Added an active roadmap row for the sprint so planned/active bundle
  validation can find the sprint ledger entry.

## Correction Proof

Passed after corrections:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1
node build-scripts/reports/validate-report-json.js
```
