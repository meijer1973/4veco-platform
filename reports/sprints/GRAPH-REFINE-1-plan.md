# Sprint GRAPH-REFINE-1: Graph Route Operation-Chain Hardening Plan

Date: 2026-05-31

Status: planned from `GATE-ENGINE-1` PASS WITH FLAGS.

## Goal

Prepare the graph/table route hardening plan for Book 1 `1.1.3 Grafieken en
tabellen`.

This sprint must turn the GATE-ENGINE-1 graph flag into an executable
implementation-preparation package. It must compare the `1.1.3` target
exercise operation chain against the current graph/table route, name the gaps,
and define the next implementation sprint or gate handoff required before the
graph route can be used as evidence for target-equivalent exit-ticket work.

The sprint is planning/preparation only. It must not implement graph-route
changes, regenerate lesson output, create exit-ticket source data, write
target-exercise fields, mutate protected references, create or write
answer-skill candidate storage, authorize target-equivalent completion
language, diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Context

`GATE-ENGINE-1` closed PASS WITH FLAGS and accepted the graph/table route as
the strongest reference pattern. The same gate carried a condition: graph
practice still needs target-operation validation before target-equivalent
exit-ticket reliance.

The canonical product specification requires the student route to prepare the
same target-exercise operation chain at the same cognitive level before any
local target-equivalent proof language is allowed. For `1.1.3`, the target
exercise says students must draw a graph with price on the vertical axis and
quantity on the horizontal axis, read or interpolate quantity at a price, and
use table evidence to explain a 50 percent sales drop.

Current GRAPH-UX-2 evidence proves useful rendered graph/table practice:
table-value selection, graph reading, axis convention, interpolation, point
placement, graph-construction substitute, calculation/work capture, and a
less-labelled variant. It does not prove full target-chain coverage.

Early baseline reading for this sprint found a high-priority hardening issue:
some current graph-route task copy and data treat price as the x-value and
quantity/aantal as the y-value, while the `1.1.3` target exercise and
blueprint difficulty note require the economist axis convention of price on
the vertical axis and quantity on the horizontal axis. This sprint must not
silently smooth over that mismatch.

## Quality Standard

The quality floor is a concrete, evidence-backed implementation-preparation
plan that a next sprint can execute without rediscovering the graph operation
chain. The plan must satisfy the product specification within its bounded
scope by naming the exact target operations, current route evidence,
coverage gaps, required data/UI changes, validation proof, rendered output
proof, and follow-up gate boundary.

The plan must be specific enough to judge student-facing quality later:
rendered output must be checked after implementation for correct economic axis
convention, graph/table operation coverage, source-use explanation, neutral
feedback, mobile/dark readability, and no forbidden product claims.

The review gate that will judge target-equivalent graph use remains
`GATE-L1.7B-Q2` after `L1.7B-Q2`; this sprint prepares graph-route hardening
only. Omitted requirements must be routed to named follow-up work.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Graph/table practice must prepare the paragraph target operation chain | Map the `1.1.3` target subquestions to graph/table operations and current task-shell families | `GRAPH-REFINE-1-operation-chain-plan.md` and `GRAPH-REFINE-1-task-coverage-matrix.md` identify covered, partial, and missing operations | planned |
| Economic graph convention must match the target exercise | Name every current task/data location that treats price/quantity axes incorrectly or ambiguously | Hardening plan requires correction before any target-equivalent use | planned |
| Graph route remains the reference pattern without becoming proof | Keep current GRAPH-UX-2 route evidence as practice proof only; preserve `targetEquivalent: false` | Handoff record blocks target-equivalent claims until later implementation and gate review | planned |
| Source/table evidence must combine with an underlying answer form | Plan how the 50 percent drop task combines table evidence, calculation/work capture, and short explanation | Coverage matrix distinguishes source-use modifier, calculation, and short explanation requirements | planned |
| Shared route/task shell remains the implementation spine | Future graph hardening must consume the shared route layer and task-shell API instead of private task UI | Implementation-prep document names files, owners, validators, and no-private-UI stop conditions | planned |
| Product boundaries remain intact | No implementation, generated output, source data writes, target-exercise writes, protected mutation, candidate storage, or product claims | Sprint bundle, scope-language check, protected-surface diff, lead review, and result metadata prove boundary | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a target-operation coverage matrix for `1.1.3` | `include_now` | This is the core GATE-ENGINE-1 flag: graph route quality must be judged against the target chain. |
| Name the axis-convention mismatch explicitly | `include_now` | It is a learning-quality blocker before target-equivalent graph use. |
| Define validator upgrades for axis convention and target-chain coverage | `include_now` | The next implementation sprint needs machine checks that catch the mismatch. |
| Define screenshot/live-output proof requirements for the future repair | `include_now` | Graph practice is visual; future closure must inspect rendered output, not just data. |
| Implement the axis/task repairs now | `defer_named_follow_up` | GATE-ENGINE-1 authorized planning/preparation only, not implementation. |
| Create or publish a `1.1.3` target-equivalent exit ticket | `defer_named_follow_up` | `L1.7B-Q2` and `GATE-L1.7B-Q2` own target-equivalent implementation and proof language. |
| Write target-exercise `question_type` or `answer_form` fields | `reject_scope_creep` | Those fields need a separate authored-reference mutation packet. |
| Mint graph/draw/shade answer-form MTUs | `reject_scope_creep` | MTU-H4/H4A/H4B/H4C kept graph answer-form lanes held pending stronger evidence. |

## Allowed paths

- `reports/sprints/GRAPH-REFINE-1-*`
- `references/data/sprints/GRAPH-REFINE-1.plan.json`
- `references/data/sprints/GRAPH-REFINE-1.result.json`
- `build-scripts/sprints/check-graph-refine1-evidence.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-inspection.md` only to repair the recorded reviewed-commit field if needed
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and internal dashboard files required for remote reviewer navigation

Read-only inputs may include engine source files, graph data builders,
generated Book 1 output, target-exercise records, product specifications,
GATE-ENGINE-1 records, GAME-ARCH-2 records, GRAPH-UX-2 proof, and route-output
validators.

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files
- implementation edits to `engines/graphical-engine.js`,
  `engines/graphical-ui.js`, `engines/graphical.css`,
  `build-scripts/content/book-1/b1-113-graphical-data.js`, or graph shell
  generators
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- graph/draw/shade answer-form MTU minting
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
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-screenshot-manifest.md`
- `build-scripts/sprints/check-graph-ux2-route-output.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js` as read-only evidence
- `engines/graphical-engine.js` as read-only evidence
- `engines/graphical-ui.js` as read-only evidence
- `references/authored/course-target-exercises.json` as read-only context
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- `reports/sprints/GRAPH-REFINE-1-plan.md`
- `reports/sprints/GRAPH-REFINE-1-baseline.md`
- `reports/sprints/GRAPH-REFINE-1-planning-review.md`
- `reports/sprints/GRAPH-REFINE-1-operation-chain-plan.md`
- `reports/sprints/GRAPH-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/GRAPH-REFINE-1-implementation-prep.md`
- `reports/sprints/GRAPH-REFINE-1-gate-handoff.md`
- `reports/sprints/GRAPH-REFINE-1-lead-review-assignment.md`
- `reports/sprints/GRAPH-REFINE-1-lead-review-round1.md`
- `reports/sprints/GRAPH-REFINE-1-lead-review-corrections.md`
- `reports/sprints/GRAPH-REFINE-1-lead-review-round2.md`
- `reports/sprints/GRAPH-REFINE-1-result.md`
- `reports/sprints/GRAPH-REFINE-1-diff-summary.md`
- `references/data/sprints/GRAPH-REFINE-1.plan.json`
- `references/data/sprints/GRAPH-REFINE-1.result.json`
- `build-scripts/sprints/check-graph-refine1-evidence.js`
- updated platform and lesson roadmaps marking `GRAPH-REFINE-1` closure and
  preserving `MATH-REFINE-1`, `REASON-REFINE-1`, `CHECK-Q2-PLAN`,
  `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, and Scale Gate 1 blocks

## Operationalized sprint procedure

1. Record baseline evidence from product specs, GATE-ENGINE-1, GAME-ARCH-2,
   GRAPH-UX-2, current graph data, current graph UI, and the `1.1.3`
   target-exercise record. Stop if the plan would require implementation,
   generated-output mutation, protected references, target-exercise field
   writes, or source exit-ticket writes.
2. Ask the planning/review subagent to inspect the plan, baseline, generated
   output statement, outputs, acceptance tests, and stop conditions before
   producing closure artifacts. Fix the plan if the reviewer finds a core gap.
3. Write the operation-chain hardening plan. It must map target subquestions
   `a`, `b`, and `c` to graph/table operations and name current evidence.
4. Write the task-coverage matrix. It must mark each operation as covered,
   partial, missing, or blocked, and it must identify the current
   axis-convention mismatch.
5. Write the implementation-prep record. It must name future file owners,
   data corrections, validator upgrades, screenshot/live-output proof, and
   stop conditions for the future implementation sprint.
6. Write the gate handoff. It must preserve target-equivalent exit-ticket
   separation and state exactly what `GATE-L1.7B-Q2` must review before graph
   output can support paragraph-completion language.
7. Add a deterministic evidence checker that fails if core artifacts are
   missing the target-operation chain, axis-convention blocker, future proof
   requirements, product-boundary blocks, or accepted follow-up route.
8. Run the structural lead-review cycle with assignment, round-1 review,
   correction log, and round-2 recheck. Stop if lead review returns REVISE,
   FAIL, or PAUSE on target-chain evidence, axis-convention handling,
   implementation-prep concreteness, or authority boundaries.
9. Update result records, diff summary, roadmaps, and generated indexes. Stop
   if sprint-bundle, evidence, scope-language, protected-surface, roadmap,
   lead-review, or diff checks fail.
10. Fetch, reconcile, commit, and push both repositories if both contain
    changes. If either repository is behind or diverged, stop and report the
    required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GRAPH-REFINE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GRAPH-REFINE-1
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-graph-refine1-evidence.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/GRAPH-REFINE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js GRAPH-REFINE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
rg -n "GRAPH-REFINE-1|axis convention|vertical axis|horizontal axis|target-equivalent|MATH-REFINE-1" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
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
validators, graph route-output validation, protected-surface diff check, and
diff hygiene checks.

Closure must explicitly state the next action: proceed to the named graph
implementation-preparation or implementation sprint if authorized, proceed to
`MATH-REFINE-1`, or pause if the axis-convention mismatch requires human
review before more engine work.

## Rollback plan

If GRAPH-REFINE-1 must be reverted, revert the GRAPH-REFINE-1 sprint records,
evidence checker, result metadata, roadmap/version-index changes, and
generated maps/indexes produced by this planning sprint.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, graph data builders, engine
source files, or answer-skill candidate storage as part of rollback.

## Human review required

No interactive human-review gate is required to close this
planning/preparation sprint. Lead review is required before closure.

Any later graph implementation or target-equivalent exit-ticket reliance must
receive its own plan, proof requirements, review criteria, validation, and
authority boundary. Target-equivalent completion language remains held for
`L1.7B-Q2` and `GATE-L1.7B-Q2`.
