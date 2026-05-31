# Sprint CHECK-Q2-PLAN: Target-Equivalent Exit-Ticket Implementation Plan

Date: 2026-05-31

Status: planned from `GATE-ENGINE-1` PASS WITH FLAGS.

## Goal

Prepare the implementation plan for the later `L1.7B-Q2` target-equivalent
exit-ticket sprint while preserving the advisory short check as a separate
local advice surface.

This sprint must turn the GATE-ENGINE-1 checkpoint flag into an executable
implementation-preparation package. It must define the target-equivalent
exit-ticket product contract, compare the current `1.1.1`, `1.1.2`, and
`1.1.3` route evidence against the complete target-exercise operation chains,
name blockers, and define the exact proof requirements for a future Q2
implementation and `GATE-L1.7B-Q2` review.

The sprint is planning/preparation only. It must not implement exit tickets,
create or edit source exit-ticket data, regenerate lesson output, mutate
protected references, write target-exercise fields, create candidate storage,
authorize paragraph-completion language, authorize diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, Scale Gate 1, or student/product use.

## Context

`GATE-ENGINE-1` closed PASS WITH FLAGS and authorized only named downstream
planning or implementation-preparation sprints. Its checkpoint decision was:
keep the advisory short check if it remains visibly distinct, keep
target-equivalent exit tickets separate and held for `L1.7B-Q2` and
`GATE-L1.7B-Q2`, and authorize no implementation or product authority now.

The product specification now says the exit ticket is a target-equivalent
proof task, not merely a short quiz or readiness-to-try check. It must check
the same target-exercise operation chain at the same cognitive level with
matching answer forms. Advisory short checks may still exist, but only as
local non-binding route advice.

Current evidence also shows that no Book 1 paragraph has target-equivalent
exit-ticket proof yet:

- `1.1.1` has a source-controlled `Korte check`, but its metadata keeps
  `targetReadinessEvidence: false` and it does not cover the full `A43`
  mixed-allocation calculation chain.
- `1.1.2` has useful A38/A39 math practice, but target-equivalent reliance is
  blocked until explicit D31 index-point versus percentage-change explanation
  is routed and checked.
- `1.1.3` has the strongest graph/table practice direction, but
  target-equivalent reliance is blocked by a price-horizontal/price-vertical
  axis mismatch and source-use/short-explanation gaps.

This sprint must make those blockers explicit rather than smoothing them over.

## Quality Standard

The quality floor is a concrete, evidence-backed implementation plan for a
future target-equivalent exit ticket. The plan must satisfy the specification
within its bounded scope by separating advisory-check advice from
target-equivalent proof, listing the required operation and answer-form chain
for each first Book 1 paragraph, naming current blockers, defining the data,
UI, state, feedback, validation, rendered output, review, and human-gate proof
required for `L1.7B-Q2`, and preserving all product-authority blocks.

The plan must be specific enough for later student-facing quality review:
future rendered output must prove that the student sees a coherent route,
performs the right task types, receives neutral feedback, and cannot mistake a
short check for paragraph-completion proof.

The review gate that will judge target-equivalent completion language remains
`GATE-L1.7B-Q2` after `L1.7B-Q2`. This sprint prepares that path only. Any
omitted requirement must be routed to a named follow-up or blocker before
implementation.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Advisory short checks remain separate from target-equivalent exit tickets | Short-check contract names local advice-only purpose, allowed copy, forbidden proof status, and state separation | `CHECK-Q2-PLAN-short-check-boundary.md` records the split and copy hierarchy | planned |
| Exit ticket must cover the complete target-exercise operation chain at the same cognitive level | Coverage plan lists required operations for `1.1.1`, `1.1.2`, and `1.1.3`, plus current covered/partial/blocked status | `CHECK-Q2-PLAN-operation-chain-coverage.md` names blockers and no-ready-paragraph status | planned |
| Exit ticket must use matching answer forms and task types | Future Q2 plan maps calculation, graph/table, source use, and short-response operations to shared task-shell families and answer-form lanes | `CHECK-Q2-PLAN-target-equivalent-design-plan.md` defines the composition contract | planned |
| State and feedback cannot drift into diagnostics or sequencing | Future implementation plan separates advisory result, local practice state, target-equivalent result, completion-language eligibility, and feedback ownership | `CHECK-Q2-PLAN-implementation-prep.md` names state/feedback rules and validators | planned |
| Current blockers must not be hidden | The plan must carry graph-axis, D31, A43, A98/held-evaluation, A81 source-use, and generator-blocked answer-form flags | Coverage, handoff, checker, lead review, and result metadata must preserve blockers | planned |
| Future human gate must inspect live rendered output | `GATE-L1.7B-Q2` handoff defines minimum live-output, screenshot, answer-model, operation-chain, and copy inspections | `CHECK-Q2-PLAN-gate-handoff.md` defines review questions and stop conditions | planned |
| Product authority remains blocked | No implementation, generated output, source-data writes, target-exercise writes, candidate writes, or product claims | Sprint bundle, scope-language check, protected-surface diff, evidence checker, and lead review prove boundary | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Define advisory short-check versus target-equivalent exit-ticket contract | `include_now` | The user explicitly wants to keep the short check while building a separate thorough exit ticket. |
| Produce paragraph-level operation-chain coverage for `1.1.1`, `1.1.2`, and `1.1.3` | `include_now` | Q2 cannot be planned honestly without knowing which paragraph can support proof. |
| Mark current no-ready-paragraph status if blockers remain | `include_now` | The safest plan may need to say L1.7B-Q2 is not ready for direct implementation until repair evidence exists. |
| Define L1.7B-Q2 implementation-prep requirements | `include_now` | The next team needs data, UI, validation, screenshot, and review requirements without rediscovering them. |
| Define GATE-L1.7B-Q2 human-review handoff | `include_now` | Completion copy must stay behind a specific review gate. |
| Implement a new target-equivalent exit ticket now | `defer_named_follow_up` | GATE-ENGINE-1 authorized planning/preparation only. |
| Edit `source-data/book-1/exit-ticket/*.json` now | `defer_named_follow_up` | Source exit-ticket implementation belongs to a later authorized sprint. |
| Start `GRAPH-REFINE-2`, `MATH-REFINE-2`, or `REASON-REFINE-2` now | `defer_named_follow_up` | Those repair sprints need explicit authorization and separate plans. |
| Treat the current `1.1.1` short check as proof | `reject_scope_creep` | Its metadata and prior gates say `targetReadinessEvidence: false`. |
| Allow paragraph-completion language from this sprint | `reject_scope_creep` | Only `GATE-L1.7B-Q2` can approve target-equivalent completion copy. |

## Allowed paths

- `reports/sprints/CHECK-Q2-PLAN-*`
- `references/data/sprints/CHECK-Q2-PLAN.plan.json`
- `references/data/sprints/CHECK-Q2-PLAN.result.json`
- `build-scripts/sprints/check-check-q2-plan-evidence.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and internal dashboard files needed
  for remote reviewer navigation

Read-only inputs may include product specs, GATE-ENGINE-1 records,
GAME-ARCH-2 records, graph/math/reason refine records, target-exercise
records, current exit-ticket source data, generated Book 1 output, route
validators, and generator-readiness reports.

## Forbidden paths

- implementation edits to checkpoint, task-shell, route, graph, math,
  reasoning, skilltree, landing, or deploy engine files
- hand edits to generated Book 1 HTML, CSS, JS, or data files
- `source-data/book-*/exit-ticket/*.json`
- `source-data/book-1/reasoning/*.csv`
- graph or skilltree source task data
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, operation-chain, or mapping
  writes
- answer-form MTU generator exposure or answer-skill candidate writes
- target-equivalent checkpoint publication, paragraph-completion copy, or
  completion-language eligibility
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/live-output-inspection.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-state-ownership.md`
- `reports/sprints/GAME-ARCH-2-feedback-ownership.md`
- `reports/sprints/GRAPH-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/GRAPH-REFINE-1-gate-handoff.md`
- `reports/sprints/MATH-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/MATH-REFINE-1-gate-handoff.md`
- `reports/sprints/REASON-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/REASON-REFINE-1-gate-handoff.md`
- `source-data/book-1/exit-ticket/1.1.1.json` as read-only evidence
- `references/authored/course-target-exercises.json` as read-only context
- `reports/json/skilltree-generator-readiness.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- `reports/sprints/CHECK-Q2-PLAN-plan.md`
- `reports/sprints/CHECK-Q2-PLAN-baseline.md`
- `reports/sprints/CHECK-Q2-PLAN-planning-review.md`
- `reports/sprints/CHECK-Q2-PLAN-short-check-boundary.md`
- `reports/sprints/CHECK-Q2-PLAN-operation-chain-coverage.md`
- `reports/sprints/CHECK-Q2-PLAN-target-equivalent-design-plan.md`
- `reports/sprints/CHECK-Q2-PLAN-implementation-prep.md`
- `reports/sprints/CHECK-Q2-PLAN-gate-handoff.md`
- `reports/sprints/CHECK-Q2-PLAN-lead-review-assignment.md`
- `reports/sprints/CHECK-Q2-PLAN-lead-review-round1.md`
- `reports/sprints/CHECK-Q2-PLAN-lead-review-corrections.md`
- `reports/sprints/CHECK-Q2-PLAN-lead-review-round2.md`
- `reports/sprints/CHECK-Q2-PLAN-result.md`
- `reports/sprints/CHECK-Q2-PLAN-diff-summary.md`
- `references/data/sprints/CHECK-Q2-PLAN.plan.json`
- `references/data/sprints/CHECK-Q2-PLAN.result.json`
- `build-scripts/sprints/check-check-q2-plan-evidence.js`
- updated platform and lesson roadmaps marking `CHECK-Q2-PLAN` closure and
  preserving the `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, and Scale Gate 1
  blocks

## Operationalized sprint procedure

1. Record baseline evidence from product specs, GATE-ENGINE-1, GAME-ARCH-2,
   graph/math/reason refine handoffs, current target exercises, and current
   `1.1.1` short-check metadata. Stop if the plan would require
   implementation, generated-output mutation, source exit-ticket writes,
   protected references, target-exercise field writes, or product authority.
2. Ask the planning/review subagent to inspect the plan, baseline, generated
   output statement, outputs, acceptance tests, and stop conditions before
   producing closure artifacts. Fix the plan if the reviewer finds a core gap.
3. Write the short-check boundary artifact. It must preserve the user's
   requested advisory short check, allowed non-binding advice, forbidden proof
   language, and separate state from target-equivalent exit tickets.
4. Write the operation-chain coverage artifact. It must compare `1.1.1`,
   `1.1.2`, and `1.1.3` target exercises with current evidence and name
   covered, partial, missing, and blocked operations.
5. Write the target-equivalent design plan. It must define the future Q2
   composition model, task-shell families, answer-form requirements, state
   split, feedback split, answer model, and paragraph-selection preflight.
6. Write implementation-prep and gate-handoff records. They must name future
   file owners, validators, screenshot/live-output proof, lead review, human
   review, and stop conditions for `L1.7B-Q2` and `GATE-L1.7B-Q2`.
7. Add a deterministic evidence checker that fails if artifacts omit the
   advisory/proof split, no-ready-paragraph blockers, product-boundary blocks,
   target-operation coverage, graph target specifics, gate handoff, or
   lead-review requirements. It must also fail if protected references,
   source exit-ticket data, reasoning source data, or generated Book 1 output
   changed.
8. Run the structural lead-review cycle with assignment, round-1 review,
   correction log, and round-2 recheck. Stop if lead review returns REVISE,
   FAIL, or PAUSE on checkpoint semantics, operation-chain coverage,
   implementation-prep concreteness, or authority boundaries.
9. Update result records, diff summary, roadmaps, and generated indexes. Stop
   if sprint-bundle, evidence, scope-language, protected-surface, roadmap,
   lead-review, or diff checks fail.
10. Fetch, reconcile, commit, and push both repositories if both contain
    changes. If either repository is behind or diverged, stop and report the
    required reconciliation.

## Acceptance tests

```powershell
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECK-Q2-PLAN-plan.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-Q2-PLAN
node build-scripts/sprints/check-check-q2-plan-evidence.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/CHECK-Q2-PLAN-result.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-Q2-PLAN --complete
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
rg -n "CHECK-Q2-PLAN|Korte check|target-equivalent|L1.7B-Q2|GATE-L1.7B-Q2|targetReadinessEvidence|D31|A43|A81|Scale Gate 1" reports/sprints references/reference-team-roadmap.md ..\4veco-lessen\lessen-team-roadmap.md
if ((git status --porcelain -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket source-data/book-1/reasoning) -ne $null) { throw "protected/source status detected" }
if ((git -C ..\4veco-lessen status --porcelain -- "Boek 1 - Grondslagen, vraag en aanbod") -ne $null) { throw "generated Book 1 output status detected" }
git diff --check
git -C ../4veco-lessen diff --check
```

If repository-map or dashboard scripts update reviewer-facing indexes, run
those scripts before final validation and commit.

## Proof Required to Close

To close this sprint, closure proof must show review, validator, and test
evidence that:

- the plan, baseline, planning review, short-check boundary, coverage,
  design-plan, implementation-prep, gate-handoff, lead-review artifacts,
  result, result metadata, and evidence checker exist;
- planning review inspected the plan before execution artifacts were written;
- lead review completed assignment, round 1, correction log, and round 2;
- the deterministic evidence checker, sprint-bundle validator, scope-language
  validator, report-json validator, roadmap-index validator, platform check,
  book check, protected-surface diff, and git diff checks pass;
- `git fetch --prune origin`, `npm.cmd run agent:index`,
  `node build-scripts/sprints/emit-url-index.js`, and
  `npm.cmd run dashboard:internal` have run before final validation and push;
- no source exit-ticket data, generated lesson output, protected references,
  target-exercise data, candidate storage, reasoning CSVs, or implementation
  files changed;
- all product-authority blocks remain false;
- the operational next action is explicit.

## Rollback plan

Rollback is limited to removing or reverting the `CHECK-Q2-PLAN` sprint
artifacts, evidence checker, plan/result metadata, roadmap/status updates, and
generated repository index/dashboard updates produced by this sprint.

Do not revert unrelated user changes, prior sprint records, protected
references, source exit-ticket data, generated lesson output, target-exercise
records, reasoning source data, or candidate-storage state.

## Human review required

No human review is required for CHECK-Q2-PLAN because this is a planning and
implementation-preparation sprint. A structural lead-review cycle is required
before closure. Human review remains required later for `GATE-L1.7B-Q2` before
any target-equivalent paragraph-completion language can be approved.
