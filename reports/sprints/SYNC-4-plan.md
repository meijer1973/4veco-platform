# Sprint SYNC-4: Engine Operationalization Roadmap Sync

## Goal

Convert the user-provided engine-operationalization report into binding product
specification and roadmap language without implementing product code, mutating
protected references, or generating lesson output.

SYNC-4 must make two things explicit:

- the shared task-type user interface is part of the product end-state, not an
  exit-ticket-only detail;
- the current engine path requires student-visible operational proof before
  controlled engine scaling or Scale Gate 1.

## Context

The current specifications already define one coherent student route from
current readiness to target-exercise readiness. The companion specification
also records the shared skill-map route layer and the game-row architecture:
`Redeneren`, `Rekenen`, `Grafieken`, plus shared skill-map/route display.

The active roadmaps, however, still frame `GAME-UX-3` mainly as exit-ticket
task-type expansion. The report argues that this is too narrow: the task-type
UI should become a shared shell for checkpoint, graph/table, and
math/calculation operations, while the skill-map route must become visibly
useful to the student. The roadmaps must require rendered-output evidence,
student-path traces, screenshot QA, and a human operational integration review
before broader engine use.

## Quality Standard

The quality floor is roadmap/specification clarity, not implementation volume.
The updated specification must say what student-facing proof will be required
from future engine work, and it must not present contract, routing, or runtime
architecture as enough product progress. Rendered output is not produced by
this sprint, but the roadmap must require rendered-output proof before later
engine closure. Any end-state requirement not implemented now must be named as
a follow-up sprint or review gate.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Product end state includes a visible route from current readiness to target-exercise readiness. | Add shared route layer plus shared task shell language to `product-end-state.md`. | Diff review proves the route remains `Start -> Leer -> Oefen -> Check -> Verdiep` and adds no premature mastery/diagnostic claims. | planned |
| Companion/game surfaces use a unified student experience. | Add shared task-type shell requirements to `companion-core-specifications.md` and connect them to exit tickets, math, graph/table, and reasoning where appropriate. | Scope-language and spec diff review confirm it is a reusable UI foundation, not an exit-ticket-only row. | planned |
| Roadmaps require operational proof, not architecture-only proof. | Add `ENGINE-OP-1`, `SKILLMAP-OP-1`, graph/math/reasoning integration rows, build-vs-rebuild decision, and `GATE-ENGINE-1` to lesson and platform roadmap state. | Roadmap diff and active-row scan confirm the proof track appears before Scale Gate 1 and before controlled engine scaling. | planned |
| MTU hardening remains the semantic route backbone. | Preserve `GATE-MTU-H4` as the platform active next action and connect `GAME-UX-3A` after answer-form routing without authorizing mutation or product use. | Roadmap scan confirms no protected reference mutation, candidate writes, target-exercise writes, or lesson output are authorized. | planned |
| Remote reviewers can inspect the changed planning state. | Refresh repository maps and GitHub-facing indexes after roadmap/spec changes, then commit and push both repositories. | Validation output plus commit hashes and push status are recorded in the result. | planned |

## Quality Improvement Candidates

- `include_now`: rename/expand `GAME-UX-3` into `GAME-UX-3A Shared Task-Type UX Foundation` so downstream rows are anchored in one shared task shell.
- `include_now`: add explicit operational proof rows for student-path traces,
  screenshots, route visibility, task feedback, keyboard/focus checks, and
  live-output human review.
- `include_now`: add a build-vs-rebuild decision sprint after the operational
  audit so the roadmap can stop incremental refactors if evidence shows that a
  shared engine rebuild is cleaner.
- `defer_named_follow_up`: actual task-shell implementation, graph/math/reasoning
  upgrades, screenshot collection, and student-facing output remain future
  sprints.
- `reject_scope_creep`: no engine code, generated lesson output, protected
  reference mutation, candidate storage, target-exercise writes, or Scale Gate
  closure in this sync.

## Allowed paths

- `reports/sprints/SYNC-4-plan.md`
- `reports/sprints/SYNC-4-baseline.md`
- `reports/sprints/SYNC-4-planning-review.md`
- `reports/sprints/SYNC-4-result.md`
- `reports/sprints/SYNC-4-diff-summary.md`
- `reports/sprints/SYNC-4-lead-review-assignment.md`
- `reports/sprints/SYNC-4-lead-review-round1.md`
- `reports/sprints/SYNC-4-lead-review-corrections.md`
- `reports/sprints/SYNC-4-lead-review-round2.md`
- `references/data/sprints/SYNC-4.plan.json`
- `references/data/sprints/SYNC-4.result.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/SYNC-4/SYNC-4-engine-operationalization-roadmap-update.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.10-mtu-h4-answer-form-routing-packet.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENT_GITHUB_ENTRY.md`
- `reports/url-index.md`
- `reports/github-agent-index-*.md`

Generated output statement: SYNC-4 creates specification, roadmap, planning,
and repository-map records only. It generates no student-facing lesson output.

## Forbidden paths

- `knowledge/exit-ticket-game-1.1.1.zip`
- hand edits to generated lesson output under `../4veco-lessen/Boek*/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/data/exam-ingestion/answer-skill-candidates.json`
- direct mutation of `references/data/skill-operation-registry.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting, unit updates, unit splits, or unit deprecation
- operation-registry mutation or answer-skill mutation
- source-annex, graph-object, or q19 extraction execution
- target-exercise promotion or target-exercise field writes
- lesson-output mutation
- generated projection refresh after no source mutation
- CP-6 closure or Year-1 closure
- diagnostics, adaptive routing, mastery, automatic sequencing, student-facing
  AI, summative use, PV projection, PV machine promotion, or student/product
  use

## Inputs

- The user-provided engine-operationalization report in the current request.
- `../CLAUDE.md`
- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/SYNC-3/SYNC-3-shared-skill-map-roadmap-update.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `build-scripts/README.md`

## Outputs

- Product end-state specification updated with shared route/task-shell
  operational UI requirements.
- Companion core specification updated with shared task-type shell behavior and
  task family requirements.
- Lesson roadmap updated with the Engine Operationalization Track before Scale
  Gate 1.
- Platform/reference roadmap updated to version
  `v3.11-engine-operationalization-track`.
- Archived platform roadmap snapshot for
  `v3.10-mtu-h4-answer-form-routing-packet`.
- Roadmap version-index JSON/Markdown update.
- SYNC-4 sprint plan, baseline, planning review, result, diff, and lead-review
  records.
- Lesson-side SYNC-4 roadmap-update record.
- Refreshed repository maps and GitHub-facing indexes.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning review before editing
   specifications or roadmaps. Stop if the plan cannot preserve the product
   end-state or if implementation work would be needed to make the roadmap
   true.
2. Patch the product and companion specifications. Stop if the wording weakens
   the `Start -> Leer -> Oefen -> Check -> Verdiep` route, makes mastery or
   diagnostic claims, or treats future task-shell work as already implemented.
3. Patch the lesson roadmap by inserting an Engine Operationalization Track
   before Scale Gate 1. Preserve `GAME-UX-3A` as the active platform handoff
   after `GATE-MTU-H4`, and keep `L1.7B-Q2` blocked until the shared task shell
   exists.
4. Patch the platform roadmap and version index. Preserve `GATE-MTU-H4` as the
   active operational next action while adding the operational engine proof
   sequence as the student-route dependency after answer-form/question-type
   routing.
5. Refresh repository maps and GitHub-facing indexes because specifications,
   roadmaps, and sprint records changed. Stop if generated maps show stale or
   missing roadmap/spec paths.
6. Run validators and scans. Stop if scope-language, sprint bundle, roadmap
   version index, or diff checks fail.
7. Record result, diff summary, lead-review assignment, round-1 review,
   correction log, and round-2 review. Stop if final review is not PASS or PASS
   WITH FLAGS.
8. Fetch/prune remotes, resolve any behind/diverged state, commit, and push the
   platform and lesson repositories separately.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SYNC-4-plan.md
node build-scripts/sprints/check-sprint-bundle.js SYNC-4
node build-scripts/sprints/check-sprint-bundle.js SYNC-4 --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

Lesson-side scans:

```bash
rg -n "GAME-UX-3A|ENGINE-OP-1|SKILLMAP-OP-1|GRAPH-UX-2|MATH-UX-2|REASON-UX-2|GAME-ARCH-1|GATE-ENGINE-1|Scale Gate 1" ..\4veco-lessen\lessen-team-roadmap.md
rg -n "shared task|task-type|task shell|skill-map|target-exercise readiness" ..\4veco-lessen\specifications\product-end-state.md ..\4veco-lessen\specifications\companion-core-specifications.md
git -C ..\4veco-lessen diff --check
```

## Proof Required to Close

To close, proof must include validator, review, and test evidence:

- passing sprint-plan and sprint-bundle validators;
- passing roadmap version-index validation;
- passing scope-language validation;
- passing diff whitespace checks in both repositories;
- scan evidence that the new operational rows and shared task-shell
  specification text exist;
- lead-review records showing PASS or PASS WITH FLAGS;
- explicit statement that no rendered output, protected reference data, target
  exercises, generated projections, or lesson artifacts changed;
- local commit hashes and push status for both repositories.

## Rollback plan

Revert the SYNC-4 commits in both repositories. Rollback removes only
specification additions, roadmap operational-track rows, the platform roadmap
v3.11 index update, the v3.10 archived snapshot, SYNC-4 sprint records, and
regenerated repository maps/indexes.

Do not manually patch `references/machine/`, `references/external/`,
generated lesson output, authored target exercises, owned blueprint sources, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.

## Human review required

No human-review gate is completed by SYNC-4. The user explicitly requested the
roadmap/specification update, but future product authority still belongs to
`GATE-MTU-H4`, `GATE-ENGINE-1`, `GATE-L1.7B-Q2`, and Scale Gate 1 as named in
the updated roadmaps.
