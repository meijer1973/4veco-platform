# Sprint EX-6: Validator And CLI Implementation Planning

## Goal

Define the validator, schema, dry-run CLI, rollback, audit-log, and review-gate
plan needed before any operation-candidate, answer-skill-candidate, or q19
source-annex extraction overlay writes can be considered.

EX-6 is a planning/tooling-contract sprint only. It may create schemas,
implementation-plan artifacts, a read-only planning checker, non-persistent
test-fixture specifications, and a later human-review packet. It must not create
the future candidate-storage files, execute q19 extraction, mutate protected
references, mutate lesson output, or authorize student/product use.

## Context

GATE-EX5 closed as `pass_with_conditions` for design-contract review only and
authorized EX-6 as the next bounded planning lane. GATE-EX5 accepted:

- overlay-first future storage under `references/data/exam-ingestion/`;
- operation-candidate fields as sufficient for later planning;
- answer-skill fields as sufficient for later planning;
- q19 extraction fields as sufficient preconditions before execution;
- validator/CLI preconditions as sufficient for later planning;
- q3 `A61` support with `A15` rejected;
- q19 `A42`/`D10` support with `A45` weak;
- q19 `q19-source-annex-gap` and `q19-graph-object-gap` as blocking;
- q3/q15 answer-skill needs as visible downstream requirements.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. EX-6 must not stage, edit, move, or
delete that file.

## Allowed paths

- `reports/sprints/EX-6-plan.md`
- `references/data/sprints/EX-6.plan.json`
- `reports/sprints/EX-6-baseline.md`
- `reports/sprints/EX-6-planning-review.md`
- `references/schemas/operation-candidates.schema.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `references/schemas/source-annex-extraction-overlays.schema.json`
- `references/data/exam-ingestion/validator-cli-implementation-plan.json`
- `references/data/exam-ingestion/validator-cli-implementation-plan.md`
- `build-scripts/references/check-ex6-validator-cli-planning.js`
- `reports/review-gates/GATE-EX6-validator-cli-planning/review-packet.json`
- `reports/review-gates/GATE-EX6-validator-cli-planning/review-packet.md`
- `reports/review-gates/GATE-EX6-validator-cli-planning/bundle-urls.md`
- `reports/sprints/EX-6-result.md`
- `reports/sprints/EX-6-diff-summary.md`
- `reports/sprints/EX-6-lead-review-assignment.md`
- `reports/sprints/EX-6-lead-review-round1.md`
- `reports/sprints/EX-6-lead-review-corrections.md`
- `reports/sprints/EX-6-lead-review-round2.md`
- `references/data/sprints/EX-6.result.json`
- generated reports, maps, inventories, GitHub-agent indexes, source-document
  registry, dashboard, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after
  completion
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- an archived roadmap snapshot under `docs/roadmaps/outdated/`

## Forbidden paths

- `references/data/exam-ingestion/operation-candidates.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`
- `build-scripts/references/operation-candidate-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/source-annex-extraction-add.js`
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

- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.json`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.md`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/schemas/operation-answer-skill-contract.schema.json`
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `reports/json/exam-ingestion-coverage.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/reference-team-roadmap.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, planning review,
  result, diff summary, lead-review assignment, round-1 lead-review log,
  correction log, round-2 lead-review log, plus metadata under
  `references/data/sprints/`.
- Three future-storage schemas:
  - `references/schemas/operation-candidates.schema.json`
  - `references/schemas/answer-skill-candidates.schema.json`
  - `references/schemas/source-annex-extraction-overlays.schema.json`
- `references/data/exam-ingestion/validator-cli-implementation-plan.json` and
  `.md`, defining the future validator/CLI architecture, dry-run fixture
  policy, rollback/audit contract, stop conditions, and exact blocked outputs.
- `build-scripts/references/check-ex6-validator-cli-planning.js`, a read-only
  checker proving EX-6 remains design/planning-only, the future storage files do
  not exist, q19 remains blocked, and q3/q15 answer-skill needs remain visible.
- A `GATE-EX6-validator-cli-planning` review packet for later human review
  before any validator/CLI implementation or candidate write lane starts.

Generated output statement: EX-6 generates internal reference planning,
schema, contract, review-gate, report, dashboard, map, inventory, and URL-index
files only. It generates no candidate records and no student-facing lesson
output.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if EX-6
   is not the active roadmap row or if the unrelated `knowledge/` zip would need
   to be staged.
2. Read GATE-EX5 closure and the EX-5 contract. Stop if GATE-EX5 does not
   authorize EX-6 or if candidate storage is authorized.
3. Draft schemas for future operation-candidate, answer-skill-candidate, and
   source-annex extraction overlay files. Stop if any schema permits product-use
   flags, hidden q19 blockers, `A15` as q3 threshold support, or `A45` as primary
   q19 graph-shift support.
4. Draft the validator/CLI implementation plan. Stop if the plan creates
   persistent candidate data files, executable mutation CLIs, or q19 extraction
   records.
5. Define dry-run fixture policy, mutation-log format, rollback format, and
   audit evidence requirements. Stop if dry-run fixtures can be mistaken for
   governed candidate storage.
6. Draft GATE-EX6 human review packet with the full planned question list and
   future interview protocol. The packet must include calibration questions,
   one-question-at-a-time answer recording, pattern analysis after initial
   answers, targeted follow-ups for ambiguity, a closure proposal step, and
   explicit human confirmation before any downstream implementation or writes.
7. Add and run `check-ex6-validator-cli-planning.js`. Stop if it permits
   candidate writes, q19 extraction execution, protected mutation, lesson-output
   mutation, or student/product use.
8. Emit GATE-EX6 bundle URLs and refresh normal generated reports and indexes
   so off-site reviewers can see the packet through GitHub-facing maps.
9. Run the complete acceptance-test set.
10. Assign the completed EX-6 bundle to lead review, record round 1, record a
    correction pass, run one recheck, and stop if the final recheck is not
    `PASS` or `PASS WITH FLAGS`.
11. After final metadata and roadmap updates, rerun complete-bundle validation,
    fetch/prune remote, commit, tag, and push.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-6-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-6
node build-scripts/references/check-ex5-operation-answer-skill-contract.js
node build-scripts/references/check-ex6-validator-cli-planning.js
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-ingestion-coverage.js
node build-scripts/references/check-skill-operation-registry.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX6-validator-cli-planning
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

Revert the EX-6 implementation commit. Rollback removes only the EX-6 schemas,
implementation-plan artifacts, checker, review packet, sprint logs, generated
report/index churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`,
`references/data/skill-operation-registry.json`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, `../4veco-lessen`, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.

## Human review required

EX-6 prepares a human review gate but does not itself complete that gate.
GATE-EX6 must be reviewed interactively later before any validator/CLI
implementation, candidate-storage creation, candidate write, q19 extraction
execution, lesson handoff, PV projection, or student-facing use can be
authorized.

Lead review is still required before sprint completion. The lead reviewer must
verify that EX-6 is planning-only, the schemas and implementation plan preserve
q19 blockers and q3/q15 answer-skill needs, and all protected mutation and
student/product-use boundaries remain blocked.
