# Sprint TASK-FAMILY-CONSTRUCT-1: Constrained Construction Task-Family Contract

Generated: 2026-06-01

## Goal

Define the shared construction-layer contract for `cloze_tile_select`,
`sentence_builder`, `formula_builder`, `source_value_selection`,
`source_chain_builder`, and `label_placement`.

This is a planning/contract sprint only. It must convert the constrained
construction report into implementation-ready task-family contracts that make
students build the required reasoning, formula, source, graph, or answer chain
from parts.

## Context

The design lesson from the construction-task report is not to copy a language
app style. It is to replace passive recognition with constrained construction
where that construction matches the target-exercise operation chain.

Current shared task-shell support does not include word-bank sentence
builders, formula builders, selectable-tile cloze, multi-value source
selection/source-chain building, or label-placement. Some related patterns
exist locally in reasoning and graph work, but they are not first-class shared
families.

This sprint defines the contract. Implementation belongs to later
`TASK-FAMILY-CLOZE-TILE-1`, `TASK-FAMILY-SENTENCE-1`,
`TASK-FAMILY-FORMULA-1`, `TASK-FAMILY-SOURCE-1`, and
`TASK-FAMILY-LABEL-1`, followed by `GATE-TASK-FAMILY-1` rendered-output review
before these families are relied on for reasoning migration, check
implementation, first-three-paragraph proof, or Scale Gate 1.

## Quality Standard

Quality floor: the contract must satisfy the product-end-state and
companion-core specifications within this no-implementation scope. It must
define the student-facing construction action, token/tile-bank rules,
distractor policy, ordering or placement semantics, validation/evaluation
owner, feedback owner, focus/keyboard expectations, rendered output proof
needed later, and product-boundary flags for every construction family.

Passing a checker or producing a list is not enough. The output must prevent
future implementations from treating construction tasks as decorative quiz
formats. It must state how each family can support operation-chain proof and
what follow-up sprint owns implementation. Rendered student-facing output is
not produced in this sprint and must be proved later.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Define construction families as operation-chain tasks, not game-like variety. | Contract rows for all six families with operation-chain use cases and proof limits. | Checker and lead review verify construction purpose is explicit. | planned |
| Define token/tile-bank, distractor, order/placement, and validation rules. | Markdown and structured JSON contract fields. | Checker validates required fields for every family. | planned |
| Define feedback, focus, keyboard, mobile, dark-mode, and visual proof expectations. | Per-family UX/accessibility/rendered proof requirements. | Lead review confirms later implementation proof is concrete. | planned |
| Preserve no-implementation and no-generated-output boundaries. | Git-status and changed-file guard in checker/result. | Lead review and sprint bundle validation. | planned |
| Feed later construction implementation sprints. | Explicit handoff to `TASK-FAMILY-CLOZE-TILE-1`, `TASK-FAMILY-SENTENCE-1`, `TASK-FAMILY-FORMULA-1`, `TASK-FAMILY-SOURCE-1`, `TASK-FAMILY-LABEL-1`, and `GATE-TASK-FAMILY-1`. | Result and roadmap closure name next action. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Emit both markdown and JSON contracts. | include_now | Required so future implementation cannot reinterpret prose-only decisions. |
| Prioritize cloze tile, sentence builder, and formula builder as first implementation lanes. | include_now | These are highest-value bridges between recognition and open construction. |
| Implement construction UI immediately. | reject_scope_creep | Implementation belongs to later task-family implementation sprints. |
| Add a rendered label-placement proof surface now. | defer_named_follow_up | This sprint defines proof requirements; rendered implementation evidence belongs to `TASK-FAMILY-LABEL-1`. |

## Allowed paths

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-plan.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-baseline.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-result.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-diff-summary.md`
- lead-review assignment, round-1, corrections, and round-2 logs
- `reports/json/task-family-construction-contract.json`
- `references/data/sprints/TASK-FAMILY-CONSTRUCT-1.plan.json`
- `references/data/sprints/TASK-FAMILY-CONSTRUCT-1.result.json`
- `build-scripts/sprints/check-task-family-construct1-contract.js`
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
- `engines/reasoning-engine.js` and `engines/reasoning-ui.js` as read-only
  evidence for local construction-like reasoning patterns
- `engines/graphical-engine.js` and `engines/graphical-ui.js` as read-only
  evidence for graph/table interaction patterns

## Outputs

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- `build-scripts/sprints/check-task-family-construct1-contract.js`
- sprint plan, baseline, planning review, lead-review records, result, diff
  summary, and result metadata
- platform and lesson roadmap status updates for `TASK-FAMILY-CONSTRUCT-1`

## Operationalized sprint procedure

1. Record baseline evidence from specs, roadmap rows, current task-shell API,
   standard-exercise audit, task-shell UX contract, and read-only runtime
   support.
2. Run planning review against this plan before treating the sprint as ready.
3. Draft the construction contract with one complete section per family:
   `cloze_tile_select`, `sentence_builder`, `formula_builder`,
   `source_value_selection`, `source_chain_builder`, and `label_placement`.
4. For each family, define student action, response shape, expected shape,
   token/tile-bank rules, distractor policy, order/placement semantics,
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

- If a construction task only trains a sub-step, mark target-equivalent proof
  eligibility as blocked unless composed with the rest of the target chain.
- If a construction family can support target-equivalent proof for a reviewed
  operation, state the required operation-chain match and evidence.
- If accessibility behavior cannot be fully designed without rendered UI evidence,
  record the later implementation proof requirement instead of pretending it is
  solved here.

Stop conditions:

- Stop if the contract attempts to implement engines or source data.
- Stop if any construction family is framed as decorative engagement rather
  than operation-chain construction.
- Stop if target-equivalent completion, diagnostics, adaptive routing, mastery,
  sequencing, summative use, PV, Scale Gate 1, or product use is authorized.
- Stop if the checker cannot prove forbidden surfaces are unchanged.

Review and validator details:

- Planning review must pass before contract execution.
- `build-scripts/sprints/check-task-family-construct1-contract.js` must
  validate markdown, JSON, roadmap closure state, and forbidden path state.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-CONSTRUCT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CONSTRUCT-1
node build-scripts/sprints/check-task-family-construct1-contract.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-CONSTRUCT-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CONSTRUCT-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the contract covers all six construction families;
every family has response/expected shapes, token/tile-bank rules, distractor
policy, order/placement semantics, validation owner, feedback owner,
focus/keyboard expectations, route/checkpoint use cases, and target-proof
limits; the JSON contract and checker pass; lead-review round 2 returns PASS
or PASS WITH FLAGS; roadmap handoff is current; and no forbidden
implementation, source-data, generated-output, protected-reference, or product
authority changes are present.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-CONSTRUCT-1` sprint artifacts,
checker, JSON contract, metadata, roadmap/index updates, and generated
map/index/dashboard refreshes from this sprint. After commit, revert the sprint
commit. Do not revert previous sprint records, source data, generated Book 1
output, protected references, or unrelated user work.

## Human review required

No human review gate is required for this contract sprint. `GATE-TASK-FAMILY-1`
must review rendered output before construction families are relied on by
reasoning migration, check implementation, first-three-paragraph proof, or
Scale Gate 1.
