# Sprint EX-2: Result

## Plan reference

Plan: `reports/sprints/EX-2-plan.md`

## Summary

EX-2 recorded the human GATE-EX2 review decision and closed
`GATE-EX2-exam-to-mtu-mapping` as `pass_with_conditions`.

The gate is classification and routing evidence only. It does not authorize
protected reference mutation, external-source mutation, unit minting,
operation-registry mutation, answer-skill mutation, target-exercise promotion,
lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, or student-facing output.

The accepted classifications are:

- `q3-calc-1`: `operation_registry_need`; add `A61` as source-reading support
  and mark `A15` stale/incorrect for this task.
- `q3-answer-1`: `answer_skill_need`.
- `q19-source-annex-gap`: blocking `source_annex_gap`.
- `q19-graph-object-gap`: blocking `graph_object_gap`.
- `q19-graph-op-1`: provisional `existing_mtu_but_procedure_too_weak` plus
  `pv_graph_need`; add `A42` and keep `D10` support; downgrade `A45` to weak
  support.
- `q19-reason-1`: provisional `operation_registry_need` with `D10` and `D13`
  as partial supports.
- `q15-content`: existing MTUs `D27`, `F03`, and `F09` for content coverage
  only.
- `q15-answer-1`: `answer_skill_need`.

EX-3 is the allowed next sprint and is limited to dashboard/reporting work that
keeps the q19 source/graph gaps and q3/q15 answer-skill gaps visible.

## Acceptance test results

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-2
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-2-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-2 --complete
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-to-mtu-mapping-gate.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX2-exam-to-mtu-mapping
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test
```

Observed key results:

- EX-2 gate checker passed with closure artifacts present.
- Generic gate closure validator passed for `pass_with_conditions`.
- Complete sprint bundle passed.
- Core schemas passed: `17 files`.
- Report JSON contract passed: `13 reports`.
- Source manifest passed: `283 files`.
- Document inventory passed: `1163 files`.
- Source-document registry passed: `280 records`.
- Roadmap version index passed: `67 entries`.
- Jest passed: `30` suites passed, `6` skipped; `515` tests passed, `8` skipped.

Lead-review state:

- Round 1: `PASS WITH FLAGS`.
- Corrections: no content corrections required; procedural flags addressed.
- Round 2: `PASS WITH FLAGS`.
- Final verdict: `PASS WITH FLAGS`.

## Changed files

Added:

- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/human-interview.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/human-interview.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
- `reports/sprints/EX-2-result.md`
- `reports/sprints/EX-2-diff-summary.md`
- `reports/sprints/EX-2-lead-review-assignment.md`
- `references/data/sprints/EX-2.result.json`

Updated:

- `build-scripts/references/check-exam-to-mtu-mapping-gate.js`

Generated reports, dashboards, inventories, URL indexes, roadmap bookkeeping,
and GitHub-agent indexes will be refreshed through the normal final validation
pass.

## Data integrity notes

No protected reference data changed. EX-2 did not edit `references/external/`,
`references/machine/`, authored target exercises, owned blueprint files, or
lesson output.

No target exercises were promoted, no placeholders were finalized, no units
were minted, and no machine registry mutation occurred.

No pilot mapping classification authorizes diagnostics, adaptive routing,
mastery decisions, automatic sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, or student-facing output.

## Open follow-ups

- Commit, tag, and push the completed EX-2 closure.
- Start EX-3 as a bounded dashboard/reporting sprint after EX-2 is pushed.
- CP-6 and Year 1 remain open.

## Rollback instructions

Revert the EX-2 closure commit. Rollback removes only the EX-2 human interview,
gate closure, result logs, generated report/index churn, roadmap bookkeeping,
and EX-2 checker update.

Do not manually patch `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during
rollback.
