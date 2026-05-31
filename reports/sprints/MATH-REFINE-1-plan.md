# Sprint MATH-REFINE-1: Math Target-Operation-Chain Hardening Plan

Date: 2026-05-31

Status: planned from `GATE-ENGINE-1` PASS WITH FLAGS.

## Goal

Prepare the math/calculation route hardening plan for Book 1 `1.1.2
Percentages en indexcijfers`.

This sprint must turn the GATE-ENGINE-1 math flag into an executable
implementation-preparation package. It must compare the `1.1.2` target
exercise operation chain against the current math/calculation route, name the
coverage gaps, and define the next implementation sprint or gate handoff
required before the math route can be used as evidence for target-equivalent
exit-ticket work.

The sprint is planning/preparation only. It must not implement math-route
changes, regenerate lesson output, create exit-ticket source data, write
target-exercise fields, mutate protected references, create or write
answer-skill candidate storage, authorize target-equivalent completion
language, diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Context

`GATE-ENGINE-1` closed PASS WITH FLAGS and accepted that the math/calculation
route should proceed by refactoring around the `1.1.2` target-operation chain,
rather than rebuilding from scratch. The same gate carried a flag that math
must be refactored around `1.1.2` target-operation coverage before stronger
checkpoint or target-equivalent use.

The canonical product specification requires the student route to prepare the
same target-exercise operation chain at the same cognitive level before any
local target-equivalent proof language is allowed. For `1.1.2`, the target
exercise requires students to calculate a percentage change, calculate a price
index, calculate the percentage change between index values, and explain why
an index-point change is not the same as a percentage change.

Current MATH-UX-2 evidence proves useful rendered math practice through the
shared route layer and shared task shell. The generated route covers `A38`
and `A39` with numeric input, calculation/work capture, final-answer entry,
percentage/index notation, unit/notation behavior, retry feedback, and
desktop/mobile light/dark screenshot proof. It does not yet prove full
target-chain coverage.

Early baseline reading for this sprint found the central hardening issue:
the read-only target-exercise record requires `A38`, `A39`, and `D31`, while
the current generated `1.1.2` math route scopes active skills and route target
skills to `A38` and `A39` only. `D31` is the index-point versus percentage
change trap used by target subquestion `d`. This sprint must not silently
smooth over that gap.

## Quality Standard

The quality floor is a concrete, evidence-backed implementation-preparation
plan that a next sprint can execute without rediscovering the math operation
chain. The plan must satisfy the product specification within its bounded
scope by naming the exact target operations, current route evidence,
coverage gaps, required data/UI changes, validation proof, rendered output
proof, and follow-up gate boundary.

The plan must be specific enough to judge student-facing quality later:
rendered output must be checked after implementation for correct formula
choice, visible substitution, calculation/work capture, final answer,
percentage/index notation, unit/notation handling, short explanation of the
index-point trap, neutral feedback, mobile/dark readability, and no forbidden
product claims.

The review gate that will judge target-equivalent math use remains
`GATE-L1.7B-Q2` after `L1.7B-Q2`; this sprint prepares math-route hardening
only. Omitted requirements must be routed to named follow-up work.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Math/calculation practice must prepare the paragraph target operation chain | Map the `1.1.2` target subquestions to calculation and explanation operations and current task-shell families | `MATH-REFINE-1-operation-chain-plan.md` and `MATH-REFINE-1-task-coverage-matrix.md` identify covered, partial, missing, and blocked operations | planned |
| Percentage-change calculation must be visible and controllable | Future tasks must require old value, new value, difference, division by old value, multiplication by 100, final percentage, and sign/context check | Coverage matrix distinguishes current A38 practice from target-specific proof for EUR 800 to EUR 920 | planned |
| Price-index calculation must be visible and controllable | Future tasks must require base-year price, target-year price, index formula, final index notation, and interpretation against base year 100 | Coverage matrix distinguishes current A39 practice from target-specific proof for EUR 150 to EUR 162 | planned |
| Index-value inflation must use percentage-change logic | Future tasks must require applying A38 to index values instead of subtracting points only | Operation-chain plan maps target subquestions `c` and `d` to A39 plus A38 on index values | planned |
| D31 index-point trap must be explicit | Future route must include short explanation or constructed-response handling for why 108 to 112 is 4 index points, not 4 percent | Coverage matrix names current D31 route-scope gap and blocks target-equivalent use until repaired | planned |
| Shared route/task shell remains the implementation spine | Future math hardening must consume the shared route layer and task-shell API instead of private task UI | Implementation-prep document names files, owners, validators, and no-private-UI stop conditions | planned |
| Product boundaries remain intact | No implementation, generated output, source data writes, target-exercise writes, protected mutation, candidate storage, or product claims | Sprint bundle, scope-language check, protected-surface diff, lead review, and result metadata prove boundary | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a target-operation coverage matrix for `1.1.2` | `include_now` | This is the core GATE-ENGINE-1 flag: math route quality must be judged against the target chain. |
| Name the D31 route-scope gap explicitly | `include_now` | It is a learning-quality blocker before target-equivalent math use. |
| Define validator upgrades for A38/A39/D31 target-chain coverage | `include_now` | The next implementation sprint needs machine checks that catch missing index-point-trap coverage. |
| Define screenshot/live-output proof requirements for the future repair | `include_now` | Calculation work and feedback are user-facing; future closure must inspect rendered output, not just data. |
| Implement the A38/A39/D31 route repairs now | `defer_named_follow_up` | GATE-ENGINE-1 authorized planning/preparation only, not implementation. |
| Create or publish a `1.1.2` target-equivalent exit ticket | `defer_named_follow_up` | `L1.7B-Q2` and `GATE-L1.7B-Q2` own target-equivalent implementation and proof language. |
| Write target-exercise `question_type` or `answer_form` fields | `reject_scope_creep` | Those fields need a separate authored-reference mutation packet. |
| Treat A38/A39 practice as D31 proof | `reject_scope_creep` | Current practice can mention the pitfall, but the target chain requires explicit D31 explanation coverage. |

## Allowed paths

- `reports/sprints/MATH-REFINE-1-*`
- `references/data/sprints/MATH-REFINE-1.plan.json`
- `references/data/sprints/MATH-REFINE-1.result.json`
- `build-scripts/sprints/check-math-refine1-evidence.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and internal dashboard files
  required for remote reviewer navigation

Read-only inputs may include engine source files, skill-tree data builders,
generated Book 1 output, target-exercise records, product specifications,
GATE-ENGINE-1 records, GAME-ARCH-2 records, MATH-UX-2 proof, and route-output
validators.

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files
- implementation edits to `engines/skilltree-engine.js`,
  `engines/skilltree-ui.js`, `engines/skilltree.css`,
  `engines/skilltree/generators.js`, or skilltree shell generators
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- answer-form MTU or answer-skill candidate writes
- target-equivalent checkpoint publication or paragraph-completion copy
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-inspection.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/GAME-ARCH-2-route-api.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-file-disposition.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-screenshot-manifest.md`
- `reports/sprints/MATH-UX-2-checkpoint-calculation-task-fixture.md`
- `build-scripts/sprints/check-math-ux2-route-output.js`
- `engines/skilltree/generators.js` as read-only evidence
- `engines/skilltree-engine.js` as read-only evidence
- `engines/skilltree-ui.js` as read-only evidence
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree/1.1.2.js` as read-only generated-output evidence
- `references/authored/course-target-exercises.json` as read-only context
- `references/machine/micro-teaching-units.json` as read-only context
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- `reports/sprints/MATH-REFINE-1-plan.md`
- `reports/sprints/MATH-REFINE-1-baseline.md`
- `reports/sprints/MATH-REFINE-1-planning-review.md`
- `reports/sprints/MATH-REFINE-1-operation-chain-plan.md`
- `reports/sprints/MATH-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/MATH-REFINE-1-implementation-prep.md`
- `reports/sprints/MATH-REFINE-1-gate-handoff.md`
- `reports/sprints/MATH-REFINE-1-lead-review-assignment.md`
- `reports/sprints/MATH-REFINE-1-lead-review-round1.md`
- `reports/sprints/MATH-REFINE-1-lead-review-corrections.md`
- `reports/sprints/MATH-REFINE-1-lead-review-round2.md`
- `reports/sprints/MATH-REFINE-1-result.md`
- `reports/sprints/MATH-REFINE-1-diff-summary.md`
- `references/data/sprints/MATH-REFINE-1.plan.json`
- `references/data/sprints/MATH-REFINE-1.result.json`
- `build-scripts/sprints/check-math-refine1-evidence.js`
- updated platform and lesson roadmaps marking `MATH-REFINE-1` closure and
  preserving `REASON-REFINE-1`, `CHECK-Q2-PLAN`, `L1.7B-Q2`,
  `GATE-L1.7B-Q2`, `REV-STD-1`, and Scale Gate 1 blocks

## Operationalized sprint procedure

1. Record baseline evidence from product specs, GATE-ENGINE-1, GAME-ARCH-2,
   MATH-UX-2, current math route data, current skilltree generator evidence,
   the `1.1.2` target-exercise record, and the `A38`/`A39`/`D31` unit records.
   Stop if the plan would require implementation, generated-output mutation,
   protected references, target-exercise field writes, or source exit-ticket
   writes.
2. Ask the planning/review subagent to inspect the plan, baseline, generated
   output statement, outputs, acceptance tests, and stop conditions before
   producing closure artifacts. Fix the plan if the reviewer finds a core gap.
3. Write the operation-chain hardening plan. It must map target subquestions
   `a`, `b`, `c`, and `d` to calculation and explanation operations and name
   current evidence.
4. Write the task-coverage matrix. It must mark each operation as covered,
   partial, missing, or blocked, and it must identify the current D31
   route-scope gap.
5. Write the implementation-prep record. It must name future file owners,
   data corrections, validator upgrades, screenshot/live-output proof, and
   stop conditions for the future implementation sprint.
6. Write the gate handoff. It must preserve target-equivalent exit-ticket
   separation and state exactly what `GATE-L1.7B-Q2` must review before math
   output can support paragraph-completion language.
7. Add a deterministic evidence checker that fails if core artifacts are
   missing the target-operation chain, D31/index-point blocker, future proof
   requirements, product-boundary blocks, or accepted follow-up route.
8. Run the structural lead-review cycle with assignment, round-1 review,
   correction log, and round-2 recheck. Stop if lead review returns REVISE,
   FAIL, or PAUSE on target-chain evidence, D31 handling,
   implementation-prep concreteness, or authority boundaries.
9. Update result records, diff summary, roadmaps, and generated indexes. Stop
   if sprint-bundle, evidence, scope-language, protected-surface, roadmap,
   lead-review, or diff checks fail.
10. Fetch, reconcile, commit, and push both repositories if both contain
    changes. If either repository is behind or diverged, stop and report the
    required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MATH-REFINE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MATH-REFINE-1
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-refine1-evidence.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/MATH-REFINE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js MATH-REFINE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
rg -n "MATH-REFINE-1|D31|index-point|indexpunt|percentage change|target-equivalent|REASON-REFINE-1" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, proof must include: the sprint plan and baseline,
planning-review record, operation-chain plan, coverage matrix,
implementation-prep record, gate handoff, deterministic evidence checker,
lead-review assignment, round-1 review, correction log, round-2 recheck,
result metadata, diff summary, roadmap updates, refreshed maps/indexes,
scope-language validation, report JSON validation, sprint result and bundle
validators, math route-output validation, protected-surface diff check, and
git diff hygiene.

The closure proof must explicitly state that `A38`/`A39` current practice is
not enough for target-equivalent `1.1.2` proof until D31/index-point-trap
coverage and short explanation are implemented and reviewed.

## Rollback plan

Because MATH-REFINE-1 is planning/preparation only, rollback consists of
removing this sprint's planning/report/checker files and reverting roadmap
and index updates. No generated lesson output, protected reference data,
target-exercise fields, source exit-ticket data, or student-facing product
state should require rollback.

If any validation shows an implementation or protected-surface diff, stop,
identify the unintended file change, and revert only the MATH-REFINE-1 change
that caused it.

## Human review required

No human review gate is required to close MATH-REFINE-1. A structural
lead-review cycle is required before closure.

Future implementation, target-equivalent exit-ticket use, or
paragraph-completion language still requires separate authorization through
the later sprint/gate path named by this plan, especially `L1.7B-Q2` and
`GATE-L1.7B-Q2`.
