# Sprint EX-2: Exam-to-MTU Mapping Review Gate

## Goal

Prepare and run the human-review gate that classifies the EX-1 pilot exam requirements against the existing MTU and operation surface.

EX-2 must decide how each pilot requirement should be routed before any later governed mutation work:

- existing MTU;
- existing MTU but procedure too weak;
- missing MTU;
- merge/split candidate;
- operation-registry need;
- PV/graph need;
- answer-skill need;
- source-annex gap;
- answer-model extraction gap;
- defer.

EX-2 is a review gate. It does not mutate protected references, external sources, authored target exercises, owned blueprints, or lesson output.

## Context

EX-1 created three bounded non-mutating pilot overlay families under `references/data/exam-ingestion/`:

1. `vw-1022-a-25-1-o:opgave-1:question-3` as calculation-heavy;
2. `vw-1022-a-25-1-o:opgave-4:question-19` as graph/source-heavy;
3. `vw-1022-a-25-1-o:opgave-3:question-15` as reasoning/answer-model-heavy.

The q19 graph/source-heavy item carries blocking `q19-source-annex-gap` and `q19-graph-object-gap` records and is not `reviewed_ready_for_mapping`.

The EX-2 gate must show the full review question list before the interview, ask one question at a time, record each answer, run pattern analysis, ask targeted follow-ups where needed, draft a closure proposal only after evidence is complete, and require explicit human confirmation before writing a closure record.

## Allowed paths

- `reports/sprints/EX-2-plan.md`
- `references/data/sprints/EX-2.plan.json`
- `reports/sprints/EX-2-baseline.md`
- `reports/sprints/EX-2-planning-review.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/review-packet.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/review-packet.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/bundle-urls.md`
- future `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/human-interview.md`
- future `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/human-interview.json`
- future `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.md`
- future `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
- `build-scripts/references/check-exam-to-mtu-mapping-gate.js`
- `references/data/sprints/EX-2.result.json`
- `reports/sprints/EX-2-result.md`
- `reports/sprints/EX-2-diff-summary.md`
- `reports/sprints/EX-2-lead-review-assignment.md`
- `reports/sprints/EX-2-lead-review-round1.md`
- `reports/sprints/EX-2-lead-review-corrections.md`
- `reports/sprints/EX-2-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, source-document registry, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after gate closure

## Forbidden paths

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
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

## Inputs

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `references/data/sprints/EX-1.result.json`
- `reports/sprints/EX-1-result.md`
- `build-scripts/references/check-exam-ingestion-pilots.js`
- `references/machine/micro-teaching-units.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/gate-closure.json`
- `references/reference-team-roadmap.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- `GATE-EX2-exam-to-mtu-mapping` review packet with the full question list and one-question-at-a-time interview protocol.
- Mapping candidate JSON/Markdown that summarizes the EX-1 pilot requirements, proposed classifications, review options, and blocked mutation boundaries.
- `check-exam-to-mtu-mapping-gate.js`, a read-only checker for EX-2 packet completeness and no-mutation boundaries.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if `EX-2` is not the active roadmap row, EX-1 is not completed, or the current repo state is dirty before EX-2 edits.
2. Read the EX-1 pilot overlays and validate them with `check-exam-ingestion-pilots.js`. Stop if any pilot item is missing, q19 does not carry blocking source/graph gaps, or any pilot record authorizes mutation or product use.
3. Prepare `mapping-candidates.*` from the EX-1 pilot records. The candidate packet must preserve uncertainty, show review options, and keep `mutation_authorized` false.
4. Prepare the `GATE-EX2-exam-to-mtu-mapping` review packet. It must show the full planned review question list before interview start, then require one question at a time with explicit open-answer options.
5. Include gate procedure controls: calibration questions, answer recording, pattern analysis, targeted follow-ups, closure proposal drafting, and explicit human confirmation before any gate closure record is written.
6. Add and run `check-exam-to-mtu-mapping-gate.js`. Stop if the packet authorizes protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, lesson-output mutation, or student/product use.
7. Generate gate bundle URLs and refresh normal indexes so off-site reviewers can fetch the packet from GitHub.
8. Do not close EX-2 from this preparation pass. The human interview and gate closure are separate steps and require explicit recorded answers.
9. After the future human review is completed, write the interview record, run pattern analysis, ask targeted follow-ups if needed, draft a closure proposal, require explicit human confirmation, then write `gate-closure.*` only if authorized.
10. Assign any completed EX-2 closure bundle to the lead reviewer agent, apply required corrections, send one recheck, and stop if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-2
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-to-mtu-mapping-gate.js
node build-scripts/references/validate-core-schemas.js
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

## Rollback plan

Revert the EX-2 preparation commit. Rollback removes only the review packet, mapping candidates, checker, sprint planning logs, bundle URLs, generated report/index churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

Yes. EX-2 is a human-review gate.

Human review is required before any pilot mapping classification is treated as accepted evidence, before EX-3 consumes the classifications as dashboard inputs, and before any later protected reference mutation, unit minting, target-exercise promotion, placeholder finalization, CP-6 closure, Year-1 closure, or student-facing/product-use claim.

The review must show the full planned question list before starting, ask one question at a time, record each answer, run pattern analysis, ask targeted follow-ups for ambiguity or conflicting authority, draft a closure proposal only after evidence is complete, and require explicit human confirmation before writing a closure record.
