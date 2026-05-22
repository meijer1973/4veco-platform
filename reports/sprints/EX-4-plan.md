# Sprint EX-4: Governed Mutation Planning Prep

## Goal

Prepare a governed mutation-planning packet and human authorization review
packet for the EX-1/EX-2/EX-3 exam-ingestion findings.

EX-4 must plan and route, not execute:

- q3 annual cost-threshold operation planning;
- q3 threshold-conclusion answer-skill planning;
- q19 source-annex and graph-object extraction blocker routing;
- q19 graph/PV and chained-market reasoning route planning;
- q15 two-step correction-model answer-skill planning;
- the registry/CLI prerequisites needed before any later MTU, operation,
  answer-skill, or PV/graph mutation.

EX-4 does not authorize protected reference mutation, external-source mutation,
unit minting, operation-registry mutation, answer-skill mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student-facing output.

## Context

EX-3 closed as a reporting-only sprint and produced
`reports/json/exam-ingestion-coverage.json`.

The active roadmap row says EX-4 may draft the governed mutation-planning packet
and human-authorization questions, but must not execute mutation until explicit
human authorization and CLI-backed validators exist.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. EX-4 must not stage, edit, move, or
delete that file.

## Allowed paths

- `reports/sprints/EX-4-plan.md`
- `references/data/sprints/EX-4.plan.json`
- `reports/sprints/EX-4-baseline.md`
- `reports/sprints/EX-4-planning-review.md`
- `reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.json`
- `reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.md`
- `reports/review-gates/GATE-EX4-mutation-planning/cli-readiness-plan.json`
- `reports/review-gates/GATE-EX4-mutation-planning/cli-readiness-plan.md`
- `reports/review-gates/GATE-EX4-mutation-planning/review-packet.json`
- `reports/review-gates/GATE-EX4-mutation-planning/review-packet.md`
- `reports/review-gates/GATE-EX4-mutation-planning/bundle-urls.md`
- `build-scripts/references/check-ex4-mutation-planning.js`
- `reports/sprints/EX-4-result.md`
- `reports/sprints/EX-4-diff-summary.md`
- `reports/sprints/EX-4-lead-review-assignment.md`
- `reports/sprints/EX-4-lead-review-round1.md`
- `reports/sprints/EX-4-lead-review-corrections.md`
- `reports/sprints/EX-4-lead-review-round2.md`
- `references/data/sprints/EX-4.result.json`
- generated reports, maps, inventories, GitHub-agent indexes, source-document
  registry, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after
  completion
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.67-ex3-exam-coverage-dashboard.md`

## Forbidden paths

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
- operation-registry mutation
- answer-skill mutation
- target-exercise promotion
- placeholder replacement or finalization
- CP-6 closure or Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output
- `knowledge/exit-ticket-game-1.1.1.zip`

## Inputs

- `reports/json/exam-ingestion-coverage.json`
- `reports/markdown/exam-ingestion-coverage.md`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- GATE-EX2 closure artifacts under
  `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/`
- `references/data/skill-operation-registry.json`
- `references/data/procedure-visual/`
- `references/data/sprints/EX-3.result.json`
- `references/reference-team-roadmap.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, planning review,
  result, diff summary, lead-review assignment, round-1 lead-review log,
  correction log, round-2 lead-review log, plus metadata under
  `references/data/sprints/`.
- A GATE-EX4 review bundle under
  `reports/review-gates/GATE-EX4-mutation-planning/` containing mutation
  candidates, disabled CLI/readiness plan, and human review packet.
- `build-scripts/references/check-ex4-mutation-planning.js`, a read-only
  checker that verifies EX-4 preserves all no-mutation boundaries and keeps
  q19 source/graph blockers visible.

Generated output statement: EX-4 generates internal reference planning,
review-gate, report, dashboard, map, inventory, and URL-index files only. It
generates no student-facing lesson output.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if EX-4
   is not the active roadmap row or if the unrelated `knowledge/` zip would need
   to be staged.
2. Read EX-3 coverage evidence and GATE-EX2 closure. Stop if q3 `A61`, q3/q15
   answer-skill needs, q19 `A42`/`D10`, weak `A45`, and q19 blocking gaps are
   not present.
3. Draft mutation-candidate planning artifacts. Classify each candidate as
   human-review-required and mutation-not-authorized.
4. Draft the disabled CLI/readiness plan. Stop if it contains executable
   mutation instructions without gate-closure and CLI-validator preconditions.
5. Draft GATE-EX4 human review packet with the full planned question list and
   future interview protocol.
6. Add and run `check-ex4-mutation-planning.js`. Stop if it permits mutation,
   hides q19 gaps, treats q19 as ready for lesson handoff, drops q3/q15
   answer-skill needs, or lacks human authorization questions.
7. Emit GATE-EX4 bundle URLs and refresh normal generated reports and indexes
   so off-site reviewers can see the packet through GitHub-facing maps.
8. Run the complete acceptance-test set.
9. Assign the completed EX-4 bundle to lead review, record round 1, record a
   correction pass, run one recheck, and stop if the final recheck is not
   `PASS` or `PASS WITH FLAGS`.
10. After final metadata and roadmap updates, rerun complete-bundle validation,
    fetch/prune remote, commit, tag, and push.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-4-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-4
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-to-mtu-mapping-gate.js
node build-scripts/references/check-exam-ingestion-coverage.js
node build-scripts/references/check-ex4-mutation-planning.js
node build-scripts/references/check-skill-operation-registry.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX4-mutation-planning
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test
```

## Rollback plan

Revert the EX-4 implementation commit. Rollback removes only the EX-4 planning
packet, review packet, checker, sprint logs, generated report/index churn, and
roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, `../4veco-lessen`, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.

## Human review required

EX-4 prepares a human review gate but does not itself complete that gate.
GATE-EX4 must be reviewed interactively later before any mutation execution can
be authorized.

Lead review is still required before sprint completion. The lead reviewer must
verify that EX-4 is planning-only, the GATE-EX4 packet preserves q19 blockers
and q3/q15 answer-skill needs, and all protected mutation and
student/product-use boundaries remain blocked.
