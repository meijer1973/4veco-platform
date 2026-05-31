# Sprint REASON-REFINE-1: Reasoning Answer-Form Integration Plan

Date: 2026-05-31

Status: planned from `GATE-ENGINE-1` PASS WITH FLAGS.

## Goal

Prepare the reasoning-route hardening plan for Book 1 `1.1.1`, `1.1.2`,
and `1.1.3`.

This sprint must turn the GATE-ENGINE-1 reasoning flag into an executable
implementation-preparation package. It must compare the current reasoning
route and structured self-check against the answer-form MTUs and the reviewed
target-exercise operation chains, name the coverage gaps, and define the next
implementation sprint or gate handoff required before reasoning practice can
support target-equivalent exit-ticket work.

The sprint is planning/preparation only. It must not implement reasoning-route
changes, regenerate lesson output, edit reasoning CSV/source data, create
exit-ticket source data, write target-exercise fields, mutate protected
references, create or write answer-skill candidate storage, authorize
target-equivalent completion language, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or student/product use.

## Context

`GATE-ENGINE-1` closed PASS WITH FLAGS and accepted that the reasoning route
should proceed by refactoring around answer-form and constructed-response
standards, rather than rebuilding from scratch. The same gate carried a flag
that reasoning must be refactored around answer-form and constructed-response
standards before stronger checkpoint or target-equivalent use.

Current REASON-UX-2 evidence proves useful rendered reasoning practice through
the shared route layer and shared task shell. The generated routes for
`1.1.1`, `1.1.2`, and `1.1.3` expose six modes, including
`Redeneerantwoord opbouwen`, which renders a `structured_reasoning` task shell
with generic self-check criteria and neutral feedback. That is local practice
evidence only. It does not yet prove answer-form-specific construction,
correction-model-style answer requirements, or target-equivalent exit-ticket
readiness.

MTU-H4C added the reusable answer-form units `A80`, `A81`, and `A96`-`A99`.
Those units are live in the MTU catalog but generator-blocked/non-interactive:
they may inform planning, but they are not student-facing skill-tree routes.
`A81` remains a source-use modifier plus an underlying answer form, not a
standalone complete answer form. The graph/draw/shade, Type 4
motiveer/classificatie, and analyseer/beoordeel lanes remain held unless a
later exact gate changes that.

Early baseline reading for this sprint found the central hardening issue: the
current structured reasoning route has one generic cause/intermediate/
conclusion self-check, while the target routes need different answer-form
contracts such as `leg-uit-dat`, `leg-uit-of`, source-use plus explanation or
calculation, and possibly held classification/evaluation patterns. This sprint
must not silently treat generic self-check as answer-form proof.

## Quality Standard

The quality floor is a concrete, evidence-backed implementation-preparation
plan that a next sprint can execute without rediscovering the reasoning
answer-form chain. The plan must satisfy the product specification within its
bounded scope by naming the exact target operations, current route evidence,
answer-form mapping candidates, held lanes, coverage gaps, required data/UI
changes, validation proof, rendered output proof, and follow-up gate boundary.

The plan must be specific enough to judge student-facing quality later:
rendered output must be checked after implementation for answer-form-specific
prompt framing, constructed-response affordance, source-use handling, causal
chain scaffolding, example/repair feedback, mobile/dark readability, and no
forbidden product claims.

The review gate that will judge target-equivalent reasoning use remains
`GATE-L1.7B-Q2` after `L1.7B-Q2`; this sprint prepares reasoning-route
hardening only. Omitted requirements must be routed to named follow-up work.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reasoning practice must prepare target answer construction, not only generic causal thinking | Map the current `structured_reasoning` mode and Book 1 target reasoning operations to answer-form lanes and held lanes | `REASON-REFINE-1-answer-form-integration-plan.md` and `REASON-REFINE-1-task-coverage-matrix.md` identify covered, partial, missing, and blocked operations | planned |
| `leg-uit-dat`, `leg-uit-of`, and `leg uit met voorbeeld` must stay distinct | Future tasks must choose the scaffold based on answer form instead of using one generic reasoning criterion set | Coverage matrix names when `A97`, `A98`, or `A99` is a candidate and when current data is too generic | planned |
| Source use must be a modifier, not a standalone answer | Future route must combine `A81` with an underlying explanation, calculation, classification, or graph answer form | Integration plan and checker reject standalone `bron` treatment | planned |
| Calculation-plus-explanation reasoning must coordinate with math/graph routes | Future reasoning tasks must not duplicate math/graph implementation but must support short explanation and correction-model wording where needed | Implementation-prep document names shared task-shell and module-boundary handoff for `1.1.2` and `1.1.3` | planned |
| Held lanes stay visible and held | `analyseer`/`beoordeel`, Type 4 motiveer/classificatie, and graph/draw/shade are not implemented or smuggled into generic reasoning | Coverage matrix marks these as held/blocked unless later exact evidence authorizes them | planned |
| EX overlay boundary remains intact | q3/q15 correction-model-specific answer-skill needs remain visible as no-write overlay needs; no candidate storage is created | Gate handoff preserves no candidate writes and no `answer-skill-candidates.json` creation | planned |
| Shared route/task shell remains the implementation spine | Future reasoning hardening must consume the shared route layer and task-shell API instead of private task UI | Implementation-prep document names files, owners, validators, and no-private-UI stop conditions | planned |
| Product boundaries remain intact | No implementation, generated output, source data writes, target-exercise writes, protected mutation, candidate storage, or product claims | Sprint bundle, scope-language check, protected-surface diff, lead review, and result metadata prove boundary | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add an answer-form integration plan for reasoning routes | `include_now` | This is the core GATE-ENGINE-1 flag: reasoning route quality must be judged against answer-form standards. |
| Add a target-operation coverage matrix for `1.1.1`, `1.1.2`, and `1.1.3` | `include_now` | The route must show which target reasoning operations are covered, partial, missing, or held. |
| Name the generic-self-check gap explicitly | `include_now` | A generic cause/intermediate/conclusion scaffold is useful practice but not enough for `leg-uit-dat`, `leg-uit-of`, source use, or correction-model-style construction. |
| Define validator upgrades for answer-form scaffolds and forbidden claims | `include_now` | The next implementation sprint needs machine checks that catch missing answer-form routing or source-use misuse. |
| Define screenshot/live-output proof requirements for future repair | `include_now` | Constructed response and feedback are user-facing; future closure must inspect rendered output, not just data. |
| Implement answer-form reasoning scaffolds now | `defer_named_follow_up` | GATE-ENGINE-1 authorized planning/preparation only, not implementation. |
| Edit `source-data/book-1/reasoning/*.csv` now | `defer_named_follow_up` | This sprint may inspect current data but may not mutate reasoning source data. |
| Create or publish a target-equivalent exit ticket | `defer_named_follow_up` | `L1.7B-Q2` and `GATE-L1.7B-Q2` own target-equivalent implementation and proof language. |
| Write target-exercise `question_type` or `answer_form` fields | `reject_scope_creep` | Those fields need a separate authored-reference mutation packet. |
| Treat `A81` source use as a standalone full answer | `reject_scope_creep` | H4/H4A/H4B/H4C require `bron` to combine with an underlying answer form. |
| Treat `analyseer`/`beoordeel` or Type 4 motiveer/classificatie as live lanes | `reject_scope_creep` | Those lanes remain held until stronger evidence and explicit authority. |

## Allowed paths

- `reports/sprints/REASON-REFINE-1-*`
- `references/data/sprints/REASON-REFINE-1.plan.json`
- `references/data/sprints/REASON-REFINE-1.result.json`
- `build-scripts/sprints/check-reason-refine1-evidence.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and internal dashboard files
  required for remote reviewer navigation

Read-only inputs may include engine source files, reasoning source data,
generated Book 1 output, target-exercise records, product specifications,
GATE-ENGINE-1 records, GAME-ARCH-2 records, REASON-UX-2 proof,
answer-form MTU records, generator-readiness reports, and route-output
validators.

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files
- implementation edits to `engines/reasoning-engine.js`,
  `engines/reasoning-ui.js`, `engines/reasoning.css`, or reasoning shell
  generators
- `source-data/book-1/reasoning/*.csv`
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
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-screenshot-manifest.md`
- `reports/sprints/REASON-UX-2-reasoning-task-shell-fixture.md`
- `reports/sprints/REASON-UX-2-student-experience-review.md`
- `reports/sprints/REASON-UX-2-lead-review-round2.md`
- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `engines/reasoning-engine.js` as read-only evidence
- `engines/reasoning-ui.js` as read-only evidence
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.1.js` as read-only generated-output evidence
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.2.js` as read-only generated-output evidence
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.3.js` as read-only generated-output evidence
- `references/authored/course-target-exercises.json` as read-only context
- `references/machine/micro-teaching-units.json` as read-only context
- `reports/json/skilltree-generator-readiness.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- `reports/sprints/REASON-REFINE-1-plan.md`
- `reports/sprints/REASON-REFINE-1-baseline.md`
- `reports/sprints/REASON-REFINE-1-planning-review.md`
- `reports/sprints/REASON-REFINE-1-answer-form-integration-plan.md`
- `reports/sprints/REASON-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/REASON-REFINE-1-implementation-prep.md`
- `reports/sprints/REASON-REFINE-1-gate-handoff.md`
- `reports/sprints/REASON-REFINE-1-lead-review-assignment.md`
- `reports/sprints/REASON-REFINE-1-lead-review-round1.md`
- `reports/sprints/REASON-REFINE-1-lead-review-corrections.md`
- `reports/sprints/REASON-REFINE-1-lead-review-round2.md`
- `reports/sprints/REASON-REFINE-1-result.md`
- `reports/sprints/REASON-REFINE-1-diff-summary.md`
- `references/data/sprints/REASON-REFINE-1.plan.json`
- `references/data/sprints/REASON-REFINE-1.result.json`
- `build-scripts/sprints/check-reason-refine1-evidence.js`
- updated platform and lesson roadmaps marking `REASON-REFINE-1` closure and
  preserving `CHECK-Q2-PLAN`, `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`,
  and Scale Gate 1 blocks

## Operationalized sprint procedure

1. Record baseline evidence from product specs, GATE-ENGINE-1, GAME-ARCH-2,
   REASON-UX-2, current reasoning route data, current task-shell evidence,
   the `1.1.1`/`1.1.2`/`1.1.3` target-exercise records, answer-form MTUs, and
   generator-readiness reports. Stop if the plan would require
   implementation, generated-output mutation, reasoning CSV edits, protected
   references, target-exercise field writes, or source exit-ticket writes.
2. Ask the planning/review subagent to inspect the plan, baseline, generated
   output statement, outputs, acceptance tests, and stop conditions before
   producing closure artifacts. Fix the plan if the reviewer finds a core gap.
3. Write the answer-form integration plan. It must map current generic
   `structured_reasoning` behavior to future answer-form-specific scaffolds
   and preserve held-lane and source-modifier boundaries.
4. Write the task-coverage matrix. It must mark each relevant target reasoning
   operation as covered, partial, missing, or blocked, and identify where
   current generic self-check is insufficient.
5. Write the implementation-prep record. It must name future file owners,
   data corrections, validator upgrades, screenshot/live-output proof, and
   stop conditions for the future implementation sprint.
6. Write the gate handoff. It must preserve target-equivalent exit-ticket
   separation and state exactly what `GATE-L1.7B-Q2` must review before
   reasoning output can support paragraph-completion language.
7. Add a deterministic evidence checker that fails if core artifacts are
   missing answer-form lanes, source-use modifier boundaries, held-lane
   blockers, future proof requirements, product-boundary blocks, or accepted
   follow-up route.
8. Run the structural lead-review cycle with assignment, round-1 review,
   correction log, and round-2 recheck. Stop if lead review returns REVISE,
   FAIL, or PAUSE on answer-form evidence, held-lane handling,
   implementation-prep concreteness, or authority boundaries.
9. Update result records, diff summary, roadmaps, and generated indexes. Stop
   if sprint-bundle, evidence, scope-language, protected-surface, roadmap,
   lead-review, or diff checks fail.
10. Fetch, reconcile, commit, and push both repositories if both contain
    changes. If either repository is behind or diverged, stop and report the
    required reconciliation.

## Acceptance tests

```powershell
node build-scripts/sprints/check-reason-ux2-route-output.js
node build-scripts/sprints/check-reason-refine1-evidence.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-REFINE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-REFINE-1
npm.cmd run check:scope-language
npm.cmd run check:reports-json
npm.cmd run check:roadmap-index
npm.cmd run check:sprint-result
npm.cmd run check:sprint-bundle
npm.cmd run check:lead-review
npm.cmd run check:protected-surface
npm.cmd run check:url-index
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
rg -n "REASON-REFINE-1|A97|A98|A99|A81|structured_reasoning|answer-form|target-equivalent|CHECK-Q2-PLAN" reports/sprints references/reference-team-roadmap.md ..\4veco-lessen\lessen-team-roadmap.md
git diff --check
```

If a repository-map or dashboard script updates reviewer-facing indexes, run
those scripts before final validation and commit.

## Proof Required to Close

Closure proof must include:

- plan and baseline artifacts that pass the deterministic sprint-plan checker;
- planning-review artifact from a separate reviewer agent;
- answer-form integration plan, coverage matrix, implementation-prep, and
  gate handoff;
- deterministic evidence checker output;
- structural lead-review assignment, round-1 review, correction log, and
  round-2 recheck;
- scope-language, protected-surface, sprint-bundle, roadmap/index, platform,
  book, and diff validation;
- repository-map refresh and remote-publication proof after roadmaps/reports
  change.

Do not close the sprint if any validator, review, protected-surface check, or
publication step fails.

## Rollback plan

If the sprint artifacts are found unsafe before commit, remove only the
REASON-REFINE-1 planning artifacts, checker, and roadmap/index edits made by
this sprint. Do not revert unrelated user work, prior sprint records, protected
references, or generated lesson output.

If a checker or lead review finds that the artifacts accidentally authorize
implementation, generated output, target-equivalent claims, candidate storage,
or product use, stop and revise the artifacts before any roadmap closure.

## Human review required

This sprint is not a human-review gate. It must receive a structural
lead-review cycle before closure. Any later reasoning implementation sprint,
target-equivalent checkpoint reliance, or product-facing exposure requires its
own exact plan and review authority.

## Stop Conditions

Stop this sprint if any step:

- implements reasoning route changes;
- edits reasoning source CSVs;
- regenerates lesson output;
- creates a target-equivalent exit ticket;
- treats generic structured self-check as answer-form proof;
- treats `A81` source use as a standalone complete answer;
- hides held `analyseer`/`beoordeel`, Type 4 motiveer/classificatie, graph,
  or EX overlay lanes inside generic reasoning;
- creates or writes answer-skill candidate storage;
- writes target-exercise `question_type` or `answer_form` fields;
- authorizes diagnostics, adaptive routing, mastery, sequencing, summative
  use, PV, Scale Gate 1, or product use.

## Expected Next Action

If this sprint closes, proceed only to the next named planning/preparation
step authorized by GATE-ENGINE-1, most likely `CHECK-Q2-PLAN`, unless the
roadmap explicitly inserts a separate reasoning implementation-planning gate.
