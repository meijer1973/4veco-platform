# Sprint GAME-ARCH-1: Practice Engine Build-vs-Rebuild Decision

Date: 2026-05-31

Status: planned from active roadmap row after REASON-UX-2.

## Goal

Decide whether the current practice-engine system should be kept, refactored,
or rebuilt around one shared student route layer and one shared task-type
shell.

This sprint must inspect the current live Book 1 routes for `1.1.1`, `1.1.2`,
and `1.1.3`, compare them against the product specification, and produce an
explicit keep/refactor/rebuild decision for:

- shared skill-map / route layer;
- shared task-type shell;
- graph/table practice route;
- math/calculation practice route;
- reasoning practice route;
- short check / local checkpoint route;
- target-equivalent exit-ticket route;
- any remaining independent UI, state, or feedback logic that cannot consume
  the shared route and task shell cleanly.

The sprint must also record the product boundary the human reviewer clarified:
the short check remains a useful local advisory check, while the exit ticket is
a separate, thorough target-equivalent proof task. The short check may give
local advice such as proceed to the exit ticket, practise a named game, or
continue for now while revisiting a weak skill later. It may not become a
grade, diagnostic classification, automatic sequence decision, mastery claim,
or substitute for the target-equivalent exit ticket.

This sprint must not implement engine refactors, publish new generated lesson
output, write target-exercise fields, create exit-ticket source data, mutate
protected references, create or write answer-skill candidate storage,
authorize target-equivalent completion language, diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, Scale Gate 1, or student/product use.

## Context

The engine operationalization track has completed the required evidence sprints
before this decision:

- GAME-UX-3A added the shared task-shell runtime foundation.
- ENGINE-OP-1 audited live output and found visible route/task gaps.
- SKILLMAP-OP-1 made shared route panels visible in generated Book 1 output.
- GRAPH-UX-2 integrated the shared task shell into the live `1.1.3`
  graph/table route.
- MATH-UX-2 integrated the shared task shell into the live `1.1.2`
  calculation/index route.
- REASON-UX-2 integrated the shared task shell into the live reasoning route
  with a structured reasoning self-check and richer repair feedback.
- MTU-H4C added bounded answer-form MTUs while keeping generator-blocked and
  non-interactive exposure guardrails.

The project now has enough live evidence to make an architecture decision. It
does not yet have evidence for Scale Gate 1, target-equivalent exit-ticket
publication, diagnostics, mastery, sequencing, summative use, PV, or broad
student/product use.

## Quality Standard

The quality floor is a decision record that is grounded in rendered
student-facing evidence and the stable specification, not an architecture memo
that only reviews source files. The sprint must fulfil the product
specification by proving what the student can currently see and do, where the
shared route and task shell are coherent, and where the current engines still
fall short.

Proof must include a student-path trace, target-exercise operation-chain
coverage table, component decision matrix, canonical UI model, short-check
versus target-equivalent exit-ticket boundary record, roadmap/specification
alignment, and lead-review evidence. Rendered output is required as inspected
evidence even though this sprint should not mutate generated lesson output.

The review gate that will judge broader engine coherence is `GATE-ENGINE-1`.
This sprint may only recommend keep/refactor/rebuild and update the roadmap
with the next architecture plan when needed. Named follow-up work remains
`GAME-ARCH-2` if major refactor or rebuild is chosen, `GATE-ENGINE-1`,
`L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, and Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Architecture progress must be student-visible | Inspect current generated routes for `1.1.1`, `1.1.2`, and `1.1.3` without hand-editing generated output | Student-path trace records landing page, route panel, practice engine, task shell, feedback, and next action for each paragraph | planned |
| Shared route and task shell must be the default UI model where interactions overlap | Compare graph, math, reasoning, short-check, and target-equivalent checkpoint surfaces against the shared route/task-shell model | Canonical UI model names required shared patterns and exceptions needing review | planned |
| Engines must be judged against target-exercise operation chains | Map current graph, math, reasoning, and checkpoint evidence to operation-chain coverage for `1.1.1`, `1.1.2`, and `1.1.3` | Coverage table names calculation, notation, graph/table, source use, reasoning, short response, feedback, and missing target-equivalent proof | planned |
| Each component must receive an explicit architecture decision | Decide keep, harden, refactor, rebuild, or hold for each component | Component decision matrix records recommendation, rationale, evidence, risks, and next owner | planned |
| Short check and target-equivalent exit ticket remain separate product surfaces | Clarify that the short check is an advisory local checkpoint and the exit ticket is a separate proof task | Boundary record and spec/roadmap updates preserve permitted advice language and prohibited claims | planned |
| Roadmaps must route major refactor/rebuild work explicitly | Add `GAME-ARCH-2` if the decision requires integrated architecture planning and tighten `GATE-ENGINE-1` live-output criteria | Platform and lesson roadmaps name the next operational step and keep Scale Gate 1 blocked | planned |
| Product boundaries remain intact | Avoid generated output mutation, source-data writes, target-exercise writes, protected reference mutation, candidate storage, and prohibited product claims | Scope-language check, protected-surface diff check, sprint bundle validation, and lead review confirm boundaries | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a short-check versus target-equivalent exit-ticket boundary record | `include_now` | The human clarified that both surfaces should exist and must not be collapsed. |
| Add `GAME-ARCH-2` as a follow-up architecture plan row if major refactor or rebuild is recommended | `include_now` | GAME-ARCH-1 is a decision sprint; the implementation architecture must be planned separately. |
| Tighten `GATE-ENGINE-1` so it must inspect live rendered output and decide keep/refactor/rebuild per engine | `include_now` | Scale readiness cannot rely on contracts or source-only proof. |
| Add a deterministic GAME-ARCH-1 evidence checker | `include_now` | The decision artifacts should be validated for required sections and boundary language. |
| Implement graph, math, reasoning, or checkpoint refactors during this sprint | `defer_named_follow_up` | The purpose of GAME-ARCH-1 is the build-vs-rebuild decision. GAME-ARCH-2 or later sprints own implementation. |
| Publish target-equivalent exit-ticket pages for `1.1.2` or `1.1.3` | `defer_named_follow_up` | L1.7B-Q2 and GATE-L1.7B-Q2 own target-equivalent checkpoint implementation and completion language. |
| Use the short check as diagnostic, mastery, automatic progression, or paragraph-completion proof | `reject_scope_creep` | The short check is advisory only and cannot replace the separate target-equivalent exit ticket. |
| Mutate MTUs, target-exercise mappings, answer-skill candidates, or generated lesson output | `reject_scope_creep` | These changes require separate governed sprints or review gates. |

## Allowed paths

- `reports/sprints/GAME-ARCH-1-*`
- `references/data/sprints/GAME-ARCH-1.plan.json`
- `references/data/sprints/GAME-ARCH-1.result.json`
- `build-scripts/sprints/check-game-arch1-evidence.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/GAME-ARCH-1/`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories required for remote reviewer navigation

Read-only inputs may include engine source files, generated Book 1 output,
recent screenshot evidence, recent route-output checkers, roadmap records,
product specifications, target-exercise records, and sprint result reports.

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- engine implementation rewrites or refactors
- new generated lesson output, unless a reviewer explicitly reclassifies this
  sprint after a stop-and-replan decision
- target-equivalent checkpoint publication or paragraph-completion copy
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/GAME-UX-3A-result.md`
- `reports/sprints/ENGINE-OP-1-operational-audit.md`
- `reports/sprints/ENGINE-OP-1-student-path-trace.md`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-result.md`
- `reports/sprints/MATH-UX-2-result.md`
- `reports/sprints/REASON-UX-2-result.md`
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/*-lead-review-round2.md` for the recent engine sprints
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- generated Book 1 output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` as read-only
  inspection evidence

## Outputs

- `reports/sprints/GAME-ARCH-1-plan.md`
- `reports/sprints/GAME-ARCH-1-baseline.md`
- `reports/sprints/GAME-ARCH-1-planning-review.md`
- `reports/sprints/GAME-ARCH-1-student-path-trace.md`
- `reports/sprints/GAME-ARCH-1-operation-chain-coverage.md`
- `reports/sprints/GAME-ARCH-1-component-decision-matrix.md`
- `reports/sprints/GAME-ARCH-1-canonical-ui-model.md`
- `reports/sprints/GAME-ARCH-1-short-check-exit-ticket-boundary.md`
- `reports/sprints/GAME-ARCH-1-architecture-decision.md`
- `reports/sprints/GAME-ARCH-1-lead-review-assignment.md`
- `reports/sprints/GAME-ARCH-1-lead-review-round1.md`
- `reports/sprints/GAME-ARCH-1-lead-review-corrections.md`
- `reports/sprints/GAME-ARCH-1-lead-review-round2.md`
- `reports/sprints/GAME-ARCH-1-result.md`
- `reports/sprints/GAME-ARCH-1-diff-summary.md`
- `references/data/sprints/GAME-ARCH-1.plan.json`
- `references/data/sprints/GAME-ARCH-1.result.json`
- `build-scripts/sprints/check-game-arch1-evidence.js`
- updated product/companion specification wording that explicitly preserves
  advisory short checks as separate from target-equivalent exit tickets
- updated platform and lesson roadmaps that add `GAME-ARCH-2` when required,
  tighten `GATE-ENGINE-1`, and preserve Scale Gate 1 blocks
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/GAME-ARCH-1/`

## Operationalized sprint procedure

1. Record baseline evidence: roadmap authority, stable product specification,
   recent graph/math/reasoning task-shell outcomes, current short-check status,
   target-equivalent exit-ticket boundary, generated-output mutation boundary,
   and protected reference status. Stop if the current state requires engine
   implementation, target-exercise field writes, exit-ticket source writes, or
   protected reference mutation to make the decision.
2. Ask the planning/review subagent to inspect the sprint plan, baseline,
   required outputs, stop conditions, generated-output statement, and
   acceptance tests before execution. Fix the plan before continuing if the
   reviewer finds a core gap.
3. Inspect existing live generated output and recent screenshot-backed
   reports for `1.1.1`, `1.1.2`, and `1.1.3`. Record a student-path trace from
   landing page to route panel, practice/check surface, task shell, feedback,
   and next action. Do not hand-edit generated lesson output.
4. Build a target-exercise operation-chain coverage table from existing
   reviewed sprint evidence and read-only target-exercise context. The table
   must name what is covered by practice routes, what is only a
   non-published fixture, what remains missing for target-equivalent proof,
   and whether feedback uses the shared task shell.
5. Audit the component architecture for duplicated UI/state/feedback logic,
   route-layer consumption, task-shell consumption, internal-code exposure,
   feedback quality, target-chain fit, and accessibility/focus risks. Decide
   keep, harden, refactor, rebuild, or hold for each component.
6. Write the short-check versus target-equivalent exit-ticket boundary record.
   Stop if any proposed copy implies grade, mastery, automatic sequencing,
   diagnostic classification, summative use, student-facing AI, PV, Scale Gate
   1, or target-equivalent proof without the later gate.
7. Update product/companion specifications only to clarify the human-approved
   separation between advisory short checks and target-equivalent exit tickets.
   Do not weaken the target-equivalent exit-ticket standard.
8. Update platform and lesson roadmaps: add `GAME-ARCH-2` if major refactor or
   rebuild is recommended; tighten `GATE-ENGINE-1` so it must inspect live
   rendered output and decide keep/refactor/rebuild per component; keep
   L1.7B-Q2, GATE-L1.7B-Q2, REV-STD-1, and Scale Gate 1 blocked.
9. Add a deterministic evidence checker that fails if required GAME-ARCH-1
   decision artifacts are missing, if the short-check boundary is absent, or
   if roadmap/spec wording authorizes prohibited product claims.
10. Run the structural lead-review cycle: assignment, round-1 review,
    correction log, and round-2 recheck. Stop if lead review returns REVISE,
    FAIL, or PAUSE on the component decision, short-check boundary, roadmap
    next action, or product-claim boundary.
11. Update result records, diff summary, lesson archive, and generated
    indexes. Run validators and stop if sprint-bundle, evidence checker,
    scope-language, protected-surface, roadmap, lead-review, or diff checks
    fail.
12. Fetch, reconcile, commit, and push both repositories if both contain
    changes. If either repository is behind or diverged, stop and report the
    required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-ARCH-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-1
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-game-arch1-evidence.js
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/GAME-ARCH-1-result.md
node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-1 --complete
rg -n "GAME-ARCH-1|GAME-ARCH-2|GATE-ENGINE-1|short check|target-equivalent exit ticket|keep|refactor|rebuild" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md ../4veco-lessen/specifications/product-end-state.md ../4veco-lessen/specifications/companion-core-specifications.md
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure requires proof that the decision is based on
rendered or previously captured student-facing evidence, not source-only
inspection. Required closure evidence:

- student-path trace for `1.1.1`, `1.1.2`, and `1.1.3`;
- operation-chain coverage table covering graph/table, calculation/notation,
  reasoning, short response, feedback, checkpoint-only surfaces, and missing
  target-equivalent proof;
- component decision matrix with keep/refactor/rebuild/hold decisions and
  named owners/follow-ups;
- canonical UI model naming the shared route and shared task shell as the
  default for overlapping interactions;
- short-check versus target-equivalent exit-ticket boundary record;
- roadmap/spec updates that preserve the target-equivalent exit-ticket
  standard and add the next architecture plan if needed;
- deterministic evidence checker output;
- lead-review assignment, round-1 review, correction log, and round-2 recheck;
- result metadata and diff summary;
- validation commands above passing or explicitly recorded as
  `skipped_with_reason` only where the command is not applicable to a
  no-output decision sprint.

## Rollback plan

If GAME-ARCH-1 must be reverted, revert the GAME-ARCH-1 sprint records,
evidence checker, roadmap/specification wording changes, result metadata,
lesson archive records, and generated maps/indexes produced for this sprint.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage as part of rollback.

## Human review required

No human-review gate is required to close this decision sprint. Lead review is
required before closure.

`GATE-ENGINE-1` remains the later human-review gate before engine scale, live
output reliance, target-equivalent checkpoint scale reliance, or Scale Gate 1.
