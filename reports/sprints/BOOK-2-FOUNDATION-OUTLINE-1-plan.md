# Sprint BOOK-2-FOUNDATION-OUTLINE-1: Book 2 Foundation And Outline

Generated: 2026-09-01

## Goal

Create the missing Book 2 outline layer between the owned course blueprints
and paragraph-level planning. The outline must turn the current Book 2
authority into an auditable chapter and paragraph sequence without changing
the blueprint, target registry, protected reference data, or lesson repository.

This sprint implements Gate 0B-0 only. It does not approve the provisional
§2.1.1 goals or target from Issue #223, generate a lesson, or merge any PR.

## Context

PR #224 established that Gate 0A passes but paragraph-level Gate 0B cannot
start from a blank slate. Issue #225 therefore inserts this order:

1. course blueprint;
2. book outline;
3. chapter plan;
4. paragraph goals and target;
5. content and exercises;
6. generated output.

The current sources agree on a 12-paragraph Book 2 route covering costs,
revenue, marginal reasoning, elasticity, and surplus/welfare. They do not yet
provide one canonical Book 2 artifact that states entry prerequisites, exit
expectations, paragraph roles, cross-paragraph dependencies, retrieval and
interleaving, operation balance, misconceptions, or readiness holds.

## Quality Standard

The quality floor is an authority-pinned, teacher-usable Book 2 outline whose
machine companion can be checked against current blueprint, target-registry,
boundary, and Part A exercise-contract hashes. It must preserve all 12
paragraph IDs, order, kinds, target statuses, and target record hashes; keep
preview/familiarity separate from mastered prerequisites; expose unresolved
target-quality and lesson-structure holds; and make every future paragraph plan
show its Book foundation decision.

The accepted review instructions and Issue #225 are the controlling task
specification for this derived authority layer. Rendered output is explicitly
out of scope; proof consists of source traceability, workflow enforcement,
machine validation, and review artifacts rather than lesson rendering. No
student-facing surface or student-facing authority is created by this sprint;
paragraph goal/target design and target-record repairs remain named follow-up
work.

The outline is a derived planning authority. It may interpret and sequence
existing authority, but it may not silently repair target content or claim that
preview exposure proves mastery. Human owner approval remains required before
the outline can become approved input to Gate 0B-1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Audit v6, v5, the target registry, pedagogical boundaries, Part A exercise contract, Book 2 root, chapter plans, and relevant owner records. | A source-and-conflict audit with exact hashes and one of the three required audit outcomes. | Teacher, economist, sequencing, and structural review confirm the disposition. | planned |
| Create a canonical Book 2 foundation layer. | `book-2-outline.md` plus `book-2-outline.meta.json`. | Reviews confirm authority fidelity, teaching coherence, and machine/prose agreement. | planned |
| Cover the full Book 2 route. | Purpose, entry prerequisites, exits, chapter spine, 12-row role matrix, dependencies, retrieval/interleaving, operation balance, conventions, misconceptions, readiness, and holds. | Mutation tests check all 12 IDs/order/kinds/statuses/hashes and required planning fields. | planned |
| Insert the foundation gate into paragraph and chapter workflows. | Updates to both build entrypoints, the paragraph skill, lane guide, teacher reviewer, and paragraph-plan template. | Workflow-pointer checks and structural review. | planned |
| Reject stale or semantically unsafe outlines. | Reusable currentness checker and mutation tests. | Tests prove stale source hashes, target hashes, missing rows/fields, erased holds, and preview-to-mastery promotion fail. | planned |
| Keep the task platform-only. | Lesson repository remains byte-for-byte untouched and clean. | Scope checker, Git diff, and recorded lesson baseline hashes. | planned |
| Stop before integration. | Draft PR and exact-head CI evidence, with explicit owner decision still pending. | Human-review packet names approval choices and remaining holds. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Wire the currentness checker into platform CI. | include_now | The outline would otherwise be easy to stale without a blocking signal. |
| Add an approved-outline mode for paragraph planning. | include_now | Structural currentness and owner approval are different gates; future paragraph work must require both. |
| Repair stale cross-references in the §2.1.2 and §2.3.3 target records. | defer_named_follow_up | The defects must be visible holds, but Issue #225 does not authorize target-registry mutation. |
| Rewrite lesson chapter plans or create the missing lesson Chapter 2.3 directory. | reject_scope_creep | This sprint is platform-only and the lesson repository is read-only evidence. |
| Approve the provisional §2.1.1 goals and target. | reject_scope_creep | Gate 0B-1 reopens only after this outline is merged and pinned. |

## Allowed paths

- `references/authored/book-outlines/book-2-outline.md`
- `references/authored/book-outlines/book-2-outline.meta.json`
- `build-scripts/workflows/check-book-outline-currentness.js`
- `build-scripts/workflows/check-book-outline-currentness.test.js`
- `build-scripts/templates/template-paragraph-plan.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `skills/econ-textbook-paragraph.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `agents/teacher-learning-quality-review-agent.md`
- `package.json`
- `.github/workflows/platform-ci.yml`
- `AGENT_GITHUB_ENTRY.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated internal dashboard artifacts required after the roadmap-state change
- sprint plan, baseline, audit, review, result, diff, command-log, and
  human-review artifacts for `BOOK-2-FOUNDATION-OUTLINE-1`
- machine sprint metadata for `BOOK-2-FOUNDATION-OUTLINE-1`
- generated agent index and URL-index artifacts required by repository checks

## Forbidden paths

- No edit in the lesson repository.
- No lesson Markdown, HTML, PDF, answer, asset, or chapter-plan write.
- No change to `references/owned/course-blueprint-v5.md` or
  `references/owned/course-blueprint-v6-three-year.md`.
- No change to `references/authored/course-target-exercises.json`.
- No change under `references/machine/` or `references/external/`.
- No paragraph-specific content, exercise, target, or generated output.
- No claim of mastery from a preview/familiarity boundary.
- No approval of Gate 0B-1, Issue #223 goals, or the §2.1.1 target.
- No merge, auto-merge, or integration authorization.

## Inputs

- Issue #225 and the accepted review instructions.
- `references/owned/course-blueprint-v6-three-year.md`
- `references/owned/course-blueprint-v5.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-pedagogical-boundaries.md`
- `skills/econ-exercise-builder.md`
- `../4veco-lessen/specifications/product-end-state.md`
- the Book 2 root and current Chapter 2.1/2.2 plans in the lesson repository,
  read-only
- current paragraph/chapter workflow entrypoints, teacher-review contract, and
  paragraph-plan template

## Outputs

- Canonical outline:
  - `references/authored/book-outlines/book-2-outline.md`
  - `references/authored/book-outlines/book-2-outline.meta.json`
- Audit and decisions:
  - `reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-blueprint-validity-audit.md`
  - `reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-baseline.md`
- Workflow and guardrail changes listed under Allowed paths.
- Deterministic checker and mutation tests.
- Role-based reviews for teacher learning quality, economics, curriculum
  sequencing, and structural lead review.
- Human-review packet that stops at owner approval.
- Sprint plan/result metadata and reproducible command evidence.

## Operationalized sprint procedure

1. Record branch, worktree, lock, baseline commits, source hashes, and read-only
   lesson evidence.
2. Register the active task in the textbook roadmap/ledger and version index.
3. Validate v6 against v5 paragraph structure, then v5 against the target
   registry's 12 IDs, order, kinds, statuses, and record hashes.
4. Reconcile Book 1 mastered targets with pedagogical preview/familiarity
   boundaries and the Part A exercise contract.
5. Audit the Book 2 root and Chapter 2.1/2.2 plans for progression evidence and
   missing structure.
6. Publish exactly one audit outcome: `VALID`,
   `VALID_WITH_DERIVED_OUTLINE_REQUIRED`, or
   `BLOCKED_BLUEPRINT_REPAIR_REQUIRED`.
7. If the audit permits derivation, write the canonical prose outline and
   machine companion, preserving source authority and all holds.
8. Update paragraph/chapter workflows and the plan template with a mandatory
   Book foundation check containing outline reference/version/hash, paragraph
   role, prerequisites, chapter dependency, prior teaching/retrieval/interleave,
   operation emphasis, misconception boundary, readiness verdict, and holds.
9. Add the currentness checker, approved-outline mode, mutation tests, package
   commands, CI step, and navigation pointer.
10. Run teacher, economics, curriculum-sequencing, and structural review;
   correct blocking findings and repeat structural review.
11. Run all scoped and repository validators, prove the lesson repository is
    unchanged, commit, push, open a draft PR, and obtain exact-head CI.
12. Stop with human owner approval pending. Do not merge.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BOOK-2-FOUNDATION-OUTLINE-1
node build-scripts/sprints/check-sprint-bundle.js BOOK-2-FOUNDATION-OUTLINE-1 --complete
npm.cmd run check:book-outline-currentness
npm.cmd run test:book-outline-currentness
npm.cmd run check:blueprint-pedagogical-boundaries
npm.cmd run check:part-a-exercise-authoring-contract
npx.cmd jest build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js build-scripts/workflows/check-blueprint-pedagogical-boundaries.test.js build-scripts/workflows/check-paragraph-workflow-wording.test.js --runInBand
node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main
npm.cmd run check:paragraph-workflow-wording
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
npm.cmd run check:agent-index-freshness
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
npm.cmd run finalization:freshness
node build-scripts/ci/check-evidence-line-endings.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-result.md
node build-scripts/sprints/check-sprint-command-log.js BOOK-2-FOUNDATION-OUTLINE-1
node build-scripts/sprints/check-lead-review-substance.js BOOK-2-FOUNDATION-OUTLINE-1
npm.cmd run check:review-throughput -- reports/review-gates/GATE-BOOK-2-FOUNDATION-OUTLINE-1/review-packet.json
git diff --check
git -C ../4veco-lessen status --short
git -C ../4veco-lessen diff --check
```

These commands use the current repository entrypoints and are recorded with
exit codes in the command log.

## Proof Required to Close

Proof required to close: the audit disposition is evidence-backed; the prose
and machine outline agree; all 12 Book 2 paragraph rows and source hashes pass
the currentness checker; mutation tests fail for every required stale or unsafe
case; workflow files and the paragraph-plan template require the foundation
check; teacher, economics, sequencing, and structural reviews have no blocking
finding; the lesson repository remains unchanged; the branch is pushed; and
exact-head CI passes. Sprint closure and merge still require a separate human
owner approval recorded on the PR.

## Rollback plan

Before commit, revert only the files listed under Allowed paths. After commit,
revert the sprint commit(s) on the dedicated branch. The lesson repository has
no rollback step because it must remain unchanged.

## Human review required

Yes. The owner must explicitly choose approve, revise, or reject for the Book 2
outline after reviewing the audit, role-based reviews, guardrail evidence,
holds, and exact-head CI. Until approval is recorded, metadata stays
`review_ready_with_holds`, approved-outline mode must fail, Gate 0B-1 remains
blocked, and this PR must not merge.
