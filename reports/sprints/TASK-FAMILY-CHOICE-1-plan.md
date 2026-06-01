# Sprint TASK-FAMILY-CHOICE-1: Structured Choice Task-Family Contract

Generated: 2026-06-01

## Goal

Define the shared task-shell contract for structured choice families:
`cloze_text`, `multi_select`, `matching_pairs`, `step_ordering`,
`two_tier_choice`, and `assertion_reason`.

This is a planning/contract sprint only. It must turn the multiple-choice
family report and current task-shell evidence into an implementation-ready
contract with response shapes, validation/evaluation ownership, feedback
ownership, focus/keyboard expectations, product-boundary flags, route/checkpoint
use cases, and explicit target-proof limits.

## Context

The Product Proof Track now separates generic `choice` from richer structured
choice actions. Current runtime support covers `choice`,
`table_value_selection`, and `structured_short_response`, but not first-class
`cloze_text`, `multi_select`, `matching_pairs`, `step_ordering`,
`two_tier_choice`, or `assertion_reason`.

The product specs require these families as reviewed student actions, not quiz
variety. Generic choice-only tasks may not replace calculation, graph/table,
constructed reasoning, or target-equivalent proof unless the target action
itself is genuinely choice-like.

This sprint prepares the contract. Implementation belongs to later
`TASK-FAMILY-*` implementation sprints and must be reviewed by
`GATE-TASK-FAMILY-1` before the families are relied on for reasoning migration,
check implementation, first-three-paragraph proof, or Scale Gate 1.

## Quality Standard

Quality floor: the contract must satisfy the product-end-state and
companion-core specifications within this no-implementation scope. It must
state the student-facing action for each family, the response shape, validation
and feedback owner, accessibility expectations, rendered output proof needed
later, and the product-boundary rules that prevent choice-like tasks from
weakening richer target operations.

Passing a checker or producing a table is not enough. The output must be
usable by the next implementer without guessing and must name any follow-up
work. Rendered output is not produced in this sprint; rendered student-facing
proof is deferred to implementation sprints and `GATE-TASK-FAMILY-1`.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Define structured choice families as reviewed student actions, not quiz variety. | Contract rows for all six families with student action and target-proof limits. | Checker and lead review verify no family is framed as a universal substitute. | planned |
| Define schema/response shapes and validation ownership. | Markdown contract and structured JSON contract. | Checker validates required fields for every family. | planned |
| Define feedback, focus, keyboard, mobile, and rendered proof expectations. | Per-family UX/accessibility requirements. | Lead review confirms later proof is concrete enough. | planned |
| Preserve no-implementation and no-generated-output boundaries. | Git-status and changed-file guard in checker/result. | Lead review and sprint bundle validation. | planned |
| Feed later Product Proof Track sprints. | Explicit handoff to implementation lanes and `GATE-TASK-FAMILY-1`. | Result and roadmap closure name next action. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Emit both markdown and JSON contracts. | include_now | Required so future implementation cannot reinterpret prose-only decisions. |
| Include target-equivalent proof eligibility rules per family. | include_now | Prevents shallow choice tasks from replacing calculation, graph/table, or constructed-response proof. |
| Implement `cloze_text` or `multi_select` immediately. | reject_scope_creep | Implementation belongs to later implementation sprints after contract closure. |
| Capture fresh screenshots. | defer_named_follow_up | No rendered output changes occur in this sprint; screenshots belong to implementation and review gates. |

## Allowed paths

- `reports/sprints/TASK-FAMILY-CHOICE-1-plan.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-result.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-diff-summary.md`
- lead-review assignment, round-1, corrections, and round-2 logs
- `reports/json/task-family-choice-contract.json`
- `references/data/sprints/TASK-FAMILY-CHOICE-1.plan.json`
- `references/data/sprints/TASK-FAMILY-CHOICE-1.result.json`
- `build-scripts/sprints/check-task-family-choice1-contract.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- roadmap version index and archived roadmap snapshot if roadmap status changes
- generated repository-map, URL-index, and dashboard artifacts

## Forbidden paths

- No generated lesson output.
- No engine implementation or CSS/JS behavior changes.
- No source exit-ticket data writes.
- No reasoning CSV writes.
- No skilltree, graph, procedure, guided-practice, or generated data writes.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise registry field writes.
- No candidate storage creation or candidate writes.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  product-wide use.
- Do not import, stage, move, or edit `knowledge/exit-ticket-game-1.1.1.zip`.

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/json/standard-exercise-family-coverage.json`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `engines/task-shell-engine.js` as read-only runtime evidence
- `engines/task-shell-ui.js` as read-only runtime evidence
- `engines/exit-ticket-engine.js` and `engines/exit-ticket-ui.js` as read-only
  evidence for checkpoint/legacy choice boundaries

## Outputs

- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `build-scripts/sprints/check-task-family-choice1-contract.js`
- sprint plan, baseline, planning review, lead-review records, result, diff
  summary, and result metadata
- platform and lesson roadmap status updates for `TASK-FAMILY-CHOICE-1`

## Operationalized sprint procedure

1. Record baseline evidence from specs, roadmap rows, current task-shell API,
   standard-exercise audit, and runtime support.
2. Run planning review against this plan before treating the sprint as ready.
3. Draft the structured choice contract with one complete section per family:
   `cloze_text`, `multi_select`, `matching_pairs`, `step_ordering`,
   `two_tier_choice`, and `assertion_reason`.
4. For each family, define student action, response shape, expected shape,
   validation/evaluation owner, feedback owner, focus/keyboard behavior,
   route/checkpoint use cases, product-boundary flags, and target-proof limits.
5. Emit the same decisions as structured JSON.
6. Add a checker that validates family coverage, required contract fields,
   product-boundary language, roadmap status, and forbidden surface cleanliness.
7. Run validation and lead-review round 1.
8. Apply corrections if needed, then run lead-review round 2.
9. Update roadmaps and version indexes only after the contract passes.
10. Commit and push platform and lesson-roadmap evidence. No generated lesson
    output is expected.

Decision points:

- If a family can only support practice/advisory use, mark target-equivalent
  proof eligibility as blocked unless paired with richer task families.
- If a family can support target-equivalent proof only for choice-like target
  operations, state that limit explicitly.
- If the contract would require implementation detail that cannot be decided
  without rendered implementation evidence, record it as a named implementation-sprint
  decision rather than inventing behavior here.

Stop conditions:

- Stop if the contract attempts to implement engines or source data.
- Stop if any family is described as a replacement for required calculation,
  graph/table, or constructed-response operations.
- Stop if target-equivalent completion, diagnostics, adaptive routing, mastery,
  sequencing, summative use, PV, Scale Gate 1, or product use is authorized.
- Stop if the checker cannot prove forbidden surfaces are unchanged.

Review and validator details:

- Planning review must pass before contract execution.
- `build-scripts/sprints/check-task-family-choice1-contract.js` must validate
  markdown, JSON, roadmap closure state, and forbidden path state.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-CHOICE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CHOICE-1
node build-scripts/sprints/check-task-family-choice1-contract.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-CHOICE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CHOICE-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the contract covers all six structured choice
families; every family has response/expected shapes, validation owner, feedback
owner, focus/keyboard expectations, route/checkpoint use cases, and
target-proof limits; the JSON contract and checker pass; lead-review round 2
returns PASS or PASS WITH FLAGS; roadmap handoff is current; and no forbidden
implementation, source-data, generated-output, protected-reference, or product
authority changes are present.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-CHOICE-1` sprint artifacts,
checker, JSON contract, metadata, roadmap/index updates, and generated
map/index/dashboard refreshes from this sprint. After commit, revert the sprint
commit. Do not revert previous sprint records, source data, generated Book 1
output, protected references, or unrelated user work.

## Human review required

No human review gate is required for this contract sprint. `GATE-TASK-FAMILY-1`
must review rendered output before structured choice families are relied on by
reasoning migration, check implementation, first-three-paragraph proof, or
Scale Gate 1.
