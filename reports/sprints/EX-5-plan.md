# Sprint EX-5: Operation And Answer-Skill Registry Contract

## Goal

Define the governed storage, schema, validator, rollback, and audit contract
needed before any later operation-registry, answer-skill, q19 source-annex, or
graph-object extraction work can execute.

EX-5 is a tooling/design sprint only. It may prepare contracts and a later
human-review packet. It must not write candidate operation records, answer-skill
records, extracted q19 source/graph records, protected machine references,
external source records, lesson output, or student-facing product surfaces.

## Context

GATE-EX4 closed as `pass_with_conditions` and authorized EX-5 as the next
bounded tooling/design sprint. GATE-EX4 accepted the following routing facts:

- `q3-calc-1` is an annual cost-threshold operation design candidate with
  `A61` as support and stale `A15` rejected.
- `q3-answer-1` is an answer-skill candidate for threshold conclusion wording
  with unit and direction.
- `q19-source-annex-gap` and `q19-graph-object-gap` block q19 graph/PV,
  reasoning, lesson handoff, PV projection, and student-facing use.
- `q19-graph-op-1` carries `A42` and `D10` as candidates, with `A45` weak
  support only.
- `q19-reason-1` remains a provisional operation candidate blocked by q19
  source/graph gaps.
- `q15-answer-1` is an answer-skill candidate; `D27`, `F03`, and `F09` cover
  content only.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. EX-5 must not stage, edit, move, or
delete that file.

## Allowed paths

- `reports/sprints/EX-5-plan.md`
- `references/data/sprints/EX-5.plan.json`
- `reports/sprints/EX-5-baseline.md`
- `reports/sprints/EX-5-planning-review.md`
- `references/schemas/operation-answer-skill-contract.schema.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.json`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.md`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/bundle-urls.md`
- `reports/sprints/EX-5-result.md`
- `reports/sprints/EX-5-diff-summary.md`
- `reports/sprints/EX-5-lead-review-assignment.md`
- `reports/sprints/EX-5-lead-review-round1.md`
- `reports/sprints/EX-5-lead-review-corrections.md`
- `reports/sprints/EX-5-lead-review-round2.md`
- `references/data/sprints/EX-5.result.json`
- generated reports, maps, inventories, GitHub-agent indexes, source-document
  registry, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after
  completion
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- an archived roadmap snapshot under `docs/roadmaps/outdated/`

## Forbidden paths

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/data/skill-operation-registry.json`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
- operation-registry mutation or candidate-record writes
- answer-skill mutation or candidate-record writes
- q19 source-annex or graph-object extraction execution
- PV/graph mutation
- target-exercise promotion
- placeholder replacement or finalization
- CP-6 closure or Year-1 closure
- lesson-output mutation
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing output
- `knowledge/exit-ticket-game-1.1.1.zip`

## Inputs

- `reports/review-gates/GATE-EX4-mutation-planning/gate-closure.json`
- `reports/review-gates/GATE-EX4-mutation-planning/gate-closure.md`
- `reports/review-gates/GATE-EX4-mutation-planning/cli-readiness-plan.json`
- `reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.json`
- `reports/json/exam-ingestion-coverage.json`
- `references/data/skill-operation-registry.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/schemas/exam-ingestion.schema.json`
- `references/reference-team-roadmap.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, planning review,
  result, diff summary, lead-review assignment, round-1 lead-review log,
  correction log, round-2 lead-review log, plus metadata under
  `references/data/sprints/`.
- `references/schemas/operation-answer-skill-contract.schema.json`, a schema
  for the EX-5 design contract.
- `references/data/exam-ingestion/operation-answer-skill-contract.json` and
  `.md`, defining future storage surfaces, required fields, validator and CLI
  preconditions, q19 extraction contract requirements, rollback expectations,
  audit-log expectations, and blocked-use boundaries.
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`, a
  read-only checker that proves EX-5 remains design-only and preserves GATE-EX4
  routing facts.
- A `GATE-EX5-operation-answer-skill-contract` review packet for later human
  review before any later implementation or extraction sprint.

Generated output statement: EX-5 generates internal reference planning,
contract, review-gate, report, dashboard, map, inventory, and URL-index files
only. It generates no student-facing lesson output.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if EX-5
   is not the active roadmap row or if the unrelated `knowledge/` zip would need
   to be staged.
2. Read GATE-EX4 closure and readiness evidence. Stop if the accepted q3, q19,
   and q15 routing facts are missing.
3. Draft the operation/answer-skill contract schema and contract records. Stop
   if the contract creates real candidate records or authorizes any mutation.
4. Define q19 source-annex and graph-object extraction contract requirements.
   Stop if the contract treats q19 as extracted or ready for lesson handoff.
5. Define validator, CLI, rollback, and audit-log prerequisites. Stop if the
   contract contains executable mutation commands.
6. Draft GATE-EX5 human review packet with the full planned question list and
   future interview protocol. The packet must include calibration questions,
   one-question-at-a-time answer recording, pattern analysis after initial
   answers, targeted follow-ups for ambiguity, a closure proposal step, and
   explicit human confirmation before any gate closure.
7. Add and run `check-ex5-operation-answer-skill-contract.js`. Stop if it
   permits mutation, hides q19 gaps, drops q3/q15 answer-skill visibility, or
   lacks GATE-EX5 review questions.
8. Emit GATE-EX5 bundle URLs and refresh normal generated reports and indexes
   so off-site reviewers can see the packet through GitHub-facing maps.
9. Run the complete acceptance-test set.
10. Assign the completed EX-5 bundle to lead review, record round 1, record a
    correction pass, run one recheck, and stop if the final recheck is not
    `PASS` or `PASS WITH FLAGS`.
11. After final metadata and roadmap updates, rerun complete-bundle validation,
    fetch/prune remote, commit, tag, and push.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-5-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-5
node build-scripts/references/check-ex4-mutation-planning.js
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-ingestion-coverage.js
node build-scripts/references/check-ex5-operation-answer-skill-contract.js
node build-scripts/references/check-skill-operation-registry.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX5-operation-answer-skill-contract
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

Revert the EX-5 implementation commit. Rollback removes only the EX-5 contract,
schema, checker, review packet, sprint logs, generated report/index churn, and
roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`,
`references/data/skill-operation-registry.json`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, `../4veco-lessen`, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.

## Human review required

EX-5 prepares a human review gate but does not itself complete that gate.
GATE-EX5 must be reviewed interactively later before any later implementation,
CLI execution, q19 extraction execution, registry candidate writes, or lesson
handoff can be authorized.

Lead review is still required before sprint completion. The lead reviewer must
verify that EX-5 is design-only, the contract preserves q19 blockers and q3/q15
answer-skill needs, and all protected mutation and student/product-use
boundaries remain blocked.
