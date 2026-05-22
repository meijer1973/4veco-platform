# Sprint EX-4: Result

Date: 2026-05-22

Status: completed.

## Plan reference

`reports/sprints/EX-4-plan.md`

## Summary

EX-4 completed the governed mutation-planning prep for EX-1/EX-2/EX-3
exam-ingestion findings. It prepared the `GATE-EX4-mutation-planning` bundle:

- `mutation-candidates.json`
- `mutation-candidates.md`
- `cli-readiness-plan.json`
- `cli-readiness-plan.md`
- `review-packet.json`
- `review-packet.md`
- `bundle-urls.md`

The sprint also added `build-scripts/references/check-ex4-mutation-planning.js`
as a read-only checker for the packet.

## Decisions Preserved

- `q3-calc-1` remains an `operation_registry_need`; `A61` is support and
  `A15` is stale/incorrect for this task.
- `q3-answer-1` remains an `answer_skill_need`.
- `q19-source-annex-gap` and `q19-graph-object-gap` remain blocking.
- `q19-graph-op-1` carries `A42` and `D10` as stronger candidates, with
  `A45` weak/prerequisite only.
- `q19-reason-1` remains a provisional `operation_registry_need` with
  `D10`/`D13` partial support and q19 blockers active.
- `q15-answer-1` remains an `answer_skill_need`; `D27`/`F03`/`F09` cover
  content only.

## Authority Boundary

EX-4 authorizes no protected reference mutation, external-source mutation,
machine-reference mutation, unit minting, operation-registry mutation,
answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6
closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
student-facing output.

## Roadmap Outcome

`references/reference-team-roadmap.md` is now
`v2.68-ex4-mutation-planning-packet`. `EX-4` moved to Closed Sprints and
`GATE-EX4 Mutation Planning Human Review` is the active item at the top of the
Sprint Ledger.

Archived snapshot:

- `docs/roadmaps/outdated/reference-team-roadmap-v2.67-ex3-exam-coverage-dashboard.md`

## Validation

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-4-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js EX-4`
- `node build-scripts/references/check-exam-ingestion-contract.js`
- `node build-scripts/references/check-exam-ingestion-pilots.js`
- `node build-scripts/references/check-exam-to-mtu-mapping-gate.js`
- `node build-scripts/references/check-exam-ingestion-coverage.js`
- `node build-scripts/references/check-ex4-mutation-planning.js`
- `node build-scripts/references/check-skill-operation-registry.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/reports/generate-all.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/reports/generate-reference-health.js`
- `node build-scripts/reports/check-reference-health.js`
- `npm.cmd run dashboard:internal`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX4-mutation-planning`
- `node build-scripts/sprints/emit-url-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/references/build-source-document-registry.js`
- `node build-scripts/references/build-reference-inventory.js`
- `node build-scripts/references/check-source-document-registry.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/check-roadmap-version-index.js`

Note: `check-source-manifest` was rerun after the inventory refresh because the
first parallel validation raced the manifest build and saw the newly-created
EX-4 plan before the refreshed manifest was fully written.

## Changed files

Primary changed surfaces:

- `reports/review-gates/GATE-EX4-mutation-planning/`
- `build-scripts/references/check-ex4-mutation-planning.js`
- `reports/sprints/EX-4-*`
- `references/data/sprints/EX-4.plan.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- generated reports, dashboards, source-document registry, source manifest,
  document inventory, GitHub agent indexes, and URL index

## Data integrity notes

No protected reference data was changed. EX-4 did not hand-edit
`references/machine/` or `references/external/`, did not mutate authored target
exercises or owned blueprint sources, and did not touch lesson output. The
unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remained unstaged and
untouched.

## Open follow-ups

Run the formal `GATE-EX4 Mutation Planning Human Review`. Do not execute
mutation, CLI writes, q19 source-annex extraction execution, or lesson handoff
from EX-4 prep alone.

## Rollback instructions

Revert the EX-4 implementation commit. Rollback removes the EX-4 planning
packet, checker, sprint logs, generated index/report refreshes, and roadmap
bookkeeping. Do not hand-edit `references/machine/`, `references/external/`,
authored target exercises, owned blueprint sources, lesson output, or the
unrelated `knowledge/exit-ticket-game-1.1.1.zip`.

## Next Action

Run the formal `GATE-EX4 Mutation Planning Human Review`. Do not execute
mutation, CLI writes, q19 source-annex extraction execution, or lesson handoff
from EX-4 prep alone.
