# Sprint STANDARD-EXERCISES-1: Unified Standard Exercise Coverage Audit

Generated: 2026-06-01

## Goal

Audit the current exercise and task families used by reasoning, math,
graph/table, exit-ticket/checkpoint, guided-practice, and procedure/stappenplan
surfaces. Decide which student actions are already covered by the shared
task-shell standard, which require standard expansion, and which engine-local
patterns should be deprecated, wrapped, or routed to later rebuild/refactor
work.

## Context

`CHECK-SHORT-EXIT-1` closed the first-three-paragraph check-surface inventory.
The next Product Proof Track step is this audit/contract sprint. The stable
product specs and `GAME-ARCH-2` architecture artifacts require shared task-type
UI for overlapping actions and explicitly call out numeric input,
calculation/work capture, final-answer entry, unit/notation fields, short
constructed response, table-value selection, graph reading, point placement or
graph-construction substitute, structured reasoning, step/chain interactions,
and flow-diagram build where useful.

The known risk is that reasoning remains the outlier: it has useful route and
task-shell integration, but it still carries older modes, feedback grammars,
and self-check patterns. This sprint must not implement the migration. It must
make the exercise-family standard explicit enough that `TASK-SHELL-UX-2`,
`REASON-STD-1`, and `ENGINE-UNIFY-1` can proceed without guessing.

## Quality Standard

Quality floor: the audit must satisfy the product-end-state and companion-core
specifications within this no-implementation scope. It must inspect real
engine/data/build surfaces, classify current exercise families by
student-facing action and feedback model, and make a concrete decision for each
family:
covered by the shared standard, requires standard expansion, defer to later
implementation, deprecate/legacy, or rebuild/refactor candidate. Passing tests
or producing a list is not enough; the output must be usable as a product
contract for later implementation sprints, especially for reasoning-game
standardization and dual-coding decisions.

Proof standard: markdown audit, structured JSON coverage matrix, deterministic
checker, planning review, and lead-review confirmation. Rendered output is
inspected only as prior evidence in this sprint; fresh rendered output proof is
explicitly deferred to later implementation/UX sprints and `SCALE-PROOF-3P`.
Any omitted product requirement must be listed as a named follow-up or blocker.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Audit all current exercise/task families used by reasoning, math, graph, exit ticket, guided practice, and procedure support. | Coverage rows for every inspected surface and family. | Checker verifies required surfaces and family decisions. | planned |
| Map each current exercise type to student action, feedback type, shared-shell coverage, and future disposition. | Markdown and JSON family matrix. | Lead review checks decisions are actionable and not vague. | planned |
| Special-focus reasoning task standardization. | Explicit reasoning section covering structured reasoning, step ordering, cause-effect chain, claim-reason-evidence, flow diagram, classification with explanation, short constructed response, and source-based explanation. | Lead review verifies covered/expand/rebuild decisions for reasoning tasks. | planned |
| Preserve no-implementation boundary. | Git-status guard for engines, source data, protected references, target registry, and generated Book 1 output. | Checker and lead review. | planned |
| Feed later Product Proof Track sprints. | Follow-up mapping to `TASK-SHELL-UX-2`, `REASON-STD-1`, `DUAL-CODING-STD-1`, `ENGINE-UNIFY-1`, and `CHECK-SHORT-EXIT-2`. | Result and roadmap update name next action. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a deterministic JSON coverage matrix and checker. | include_now | Needed so later implementation cannot reinterpret a prose-only audit. |
| Include generated live-output screenshots. | defer_named_follow_up | This sprint audits source/contract coverage; `TASK-SHELL-UX-2`, `SCALE-PROOF-3P`, and gates own rendered proof. |
| Implement missing reasoning task families immediately. | reject_scope_creep | Implementation belongs to `REASON-STD-1` or another authorized implementation sprint. |
| Update stable specs with the audit result. | defer_named_follow_up | `DUAL-CODING-STD-1` and later standard-hardening work own specification changes unless this audit finds a blocking contradiction. |

## Allowed paths

- `reports/sprints/STANDARD-EXERCISES-1-plan.md`
- `reports/sprints/STANDARD-EXERCISES-1-baseline.md`
- `reports/sprints/STANDARD-EXERCISES-1-planning-review.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/STANDARD-EXERCISES-1-result.md`
- `reports/sprints/STANDARD-EXERCISES-1-diff-summary.md`
- lead-review assignment, round-1, corrections, and round-2 logs
- `reports/json/standard-exercise-family-coverage.json`
- `references/data/sprints/STANDARD-EXERCISES-1.plan.json`
- `references/data/sprints/STANDARD-EXERCISES-1.result.json`
- `build-scripts/sprints/check-standard-exercises1-coverage.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
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
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-file-disposition.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-result.md`
- `engines/task-shell-engine.js` as read-only evidence
- `engines/task-shell-ui.js` as read-only evidence
- `engines/reasoning-engine.js` and `engines/reasoning-ui.js` as read-only
  evidence
- `engines/skilltree-engine.js`, `engines/skilltree-ui.js`, and
  `engines/skilltree/base-elements.js` as read-only evidence
- `engines/graphical-engine.js` and `engines/graphical-ui.js` as read-only
  evidence
- `engines/exit-ticket-engine.js` and `engines/exit-ticket-ui.js` as read-only
  evidence
- `engines/procedure-engine.js` and `engines/procedure-ui.js` as read-only
  evidence
- `build-scripts/content/book-1/` graph/math/procedure data builders as
  read-only evidence
- `source-data/book-1/reasoning/` as read-only evidence
- `source-data/book-1/exit-ticket/` as read-only evidence

## Outputs

- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/json/standard-exercise-family-coverage.json`
- `build-scripts/sprints/check-standard-exercises1-coverage.js`
- sprint plan, baseline, planning review, lead-review records, result, diff
  summary, and result metadata
- platform and lesson roadmap status updates for `STANDARD-EXERCISES-1`

## Operationalized sprint procedure

1. Record the baseline from product specs, GAME-ARCH-2 artifacts, current
   engine surfaces, current source-data surfaces, and recent sprint results.
2. Run planning review against this plan before writing the audit.
3. Inventory current exercise/task families by surface: reasoning, math,
   graph/table, exit ticket, guided practice, and procedure/stappenplan.
4. For each family, record student action, response shape, feedback model,
   current owner, shared-shell coverage, dual-coding relevance, disposition,
   and follow-up owner.
5. Special-case reasoning: classify structured reasoning, step ordering,
   cause-effect chain, claim-reason-evidence, flow-diagram build,
   classification with explanation, short constructed response, and
   source-based explanation as covered, expansion-needed, or rebuild/refactor
   input.
6. Emit a structured JSON coverage matrix with the same decisions.
7. Add a checker that validates required surfaces, required reasoning decisions,
   required follow-up links, and forbidden surface cleanliness.
8. Run validation and lead-review round 1.
9. Apply corrections if needed, then run lead-review round 2.
10. Commit and push platform evidence. No lesson repo commit is expected unless
    a roadmap-only lesson-side correction becomes necessary.

Decision points:

- If a student action is already representable by a supported task-shell
  family, mark it covered and require later wrappers to use the shared family.
- If a student action is important but not representable, mark it
  `requires_standard_expansion` and name the proposed family.
- If an old mode is useful but structurally outside the unified product path,
  mark it `legacy_or_deprecate` rather than silently keeping it as a product
  standard.
- If reasoning still needs implementation proof, mark it as follow-up for
  `REASON-STD-1`; do not implement it here.

Stop conditions:

- Stop if the audit would require editing engines, source data, generated
  lesson output, target-exercise records, or protected references.
- Stop if reasoning task-family gaps are hidden behind a generic
  `structured_reasoning` label without naming the missing student action.
- Stop if any current practice/check surface is promoted to target-equivalent
  proof by audit wording.
- Stop if the checker cannot prove forbidden implementation/source/generated
  surfaces are unchanged.

Review and validator details:

- Planning review must pass before the audit is treated as sprint output.
- `build-scripts/sprints/check-standard-exercises1-coverage.js` must validate
  the markdown audit, JSON coverage matrix, roadmap closure state, and
  forbidden path state.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/STANDARD-EXERCISES-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js STANDARD-EXERCISES-1
node build-scripts/sprints/check-standard-exercises1-coverage.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/STANDARD-EXERCISES-1-result.md
node build-scripts/sprints/check-sprint-bundle.js STANDARD-EXERCISES-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the audit covers reasoning, math, graph/table, exit
ticket, guided-practice, and procedure/stappenplan surfaces; every required
reasoning task candidate has a covered/expand/rebuild decision; every family
has a student action, feedback owner, shared-shell coverage decision, and
follow-up owner; the checker passes; lead-review round 2 returns PASS or PASS
WITH FLAGS; and no forbidden product/source/generated-output changes are
present.

## Rollback plan

Before commit, remove only the STANDARD-EXERCISES-1 report, checker, metadata,
roadmap/index, and dashboard changes. After commit, revert the sprint commit.
Do not revert previous sprint records, source data, generated Book 1 output,
protected references, or unrelated user work.

## Human review required

No human review gate is required for this audit sprint. Future implementation
and three-paragraph product proof remain gated by later Product Proof Track
sprints.
