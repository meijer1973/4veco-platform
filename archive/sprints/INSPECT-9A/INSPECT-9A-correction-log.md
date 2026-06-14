# INSPECT-9A Correction Log

Status: lead-review corrections recorded
Date: 2026-06-11
Sprint: `INSPECT-9A`

## Corrections

| Item | Trigger | Correction | Validation |
|---|---|---|---|
| Restricted scope-language wording in INSPECT-9B roadmap text | `npm.cmd run check:scope-language` failed on two new `prototype` occurrences in `docs/roadmaps/quality-standards/inspection-standards-roadmap.md` | Replaced new INSPECT-9A/9B uses of `prototype` with `report-only implementation` wording in roadmap, ledger, end-state, sprint plan, and remediation report. Historical path tokens were left unchanged. | `npm.cmd run check:scope-language` passed after correction. |
| Generated blueprint-triage report refresh outside packet scope | Lead review round 1 returned `REVISE`: `check-target-exercise-flags.js` refreshed broad generated blueprint-triage reports beyond the four approved Chapter 1.2 target records. | Restored `reports/blueprint-flag-triage.md` and `reports/json/blueprint-flag-triage.json` from `HEAD` and deferred the generated triage refresh to a separately authorised sprint if needed. | `git diff --name-only` no longer reports either blueprint-triage file as a content change; final staged diff must exclude both files. |

## Deferred Items

| Item | Reason Deferred | Next Action |
|---|---|---|
| Chapter 1.2 target-equivalent proof | Outside INSPECT-9A source-registry remediation scope. | Route to INSPECT-9B or later proof-review sprint. |
| Chapter 1.2 accessibility/support evidence | Outside INSPECT-9A target/exam-linkage remediation scope. | Route to INSPECT-9B before INSPECT-10 unless explicitly scoped as a blocker. |
| 1.2.2 and 1.2.4 generated-output review flags | Lesson output is read-only in INSPECT-9A. | Carry to future generated-output review/remediation sprint if needed. |
| Generated blueprint-triage report refresh | The checker reports target flags successfully but also rewrites a broad generated triage surface outside this sprint's report-only source-registry remediation packet. | Re-run or accept the generated report refresh only in a sprint that explicitly authorises broad generated report maintenance. |
| Chapter 1.1 stronger re-use | INSPECT-9A made no Chapter 1.1 registry mutation. | Separate control-scope remediation sprint required before stronger re-use. |
