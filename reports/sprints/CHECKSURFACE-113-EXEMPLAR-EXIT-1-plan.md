# Sprint CHECKSURFACE-113-EXEMPLAR-EXIT-1: Excellent 1.1.3 Exit Ticket Implementation

Generated: 2026-06-07

## Goal

Implement the packaged `1.1.3 Grafieken en tabellen` excellent exit-ticket
handoff as a bounded platform and generated-output sprint.

The student-facing exit ticket must show independent work: source table first,
student axis choice, table-point graph construction, interval-before-read
graph reading, formula construction, visible percentage calculation work,
tolerant answer parsing, feedback, and next practice routes. It must not give
the formula, procedure, completed graph, correct-only controls, completion
authority, diagnostics, mastery/sequencing, summative claims, PV claims, Scale
Gate claims, or product-wide authority.

After implementation the correct gate direction is `hold_for_exemplar_review`.
This sprint prepares the product-quality implementation and evidence; it does
not close the exemplar or send materials for human comments.

## Context

The package at `knowledge/113-excellent-exit-ticket-v3-package.zip` and its
handoff require the current `1.1.3` target-equivalent exit-ticket candidate to
move beyond the older retry pattern. The current source still contains a
static formula context block and a choice-assisted halving task. The handoff
requires:

- no pre-attempt formula context card;
- graph work that asks for axis selection and point placement or a strong
  construction substitute;
- two distinct table points for the straight-line graph;
- magnetic or forgiving point placement;
- graph-reading order of interval selection before numeric read-off;
- formula building before percentage calculation;
- percentage answers that accept ordinary student notation such as `-50%`,
  `-50 procent`, and `50% daling`;
- durable exemplar/policy guidance and validators so later work cannot slide
  back to answer-giving controls.

The canonical baselines are `../4veco-lessen/specifications/product-vision.md`,
`../4veco-lessen/specifications/product-end-state.md`,
`../4veco-lessen/specifications/companion-core-specifications.md`, `AGENTS.md`,
`BUILD-PARAGRAPH.md`, and `build-scripts/README.md`.

## Quality Standard

Quality floor: the rendered output must satisfy the package handoff
specification and acceptance criteria inside the authorized 1.1.3 exit-ticket
and shared task-shell scope. Passing unit tests or swapping JSON is not enough.
A reviewer must be able to open the generated exit-ticket route and see the
difference between minimal compliance and a strong student-facing product.

Required quality floor:

- source pane contains only the short source text and table before the attempt;
- no formula card, procedure card, answer example, completed graph, or static
  solution appears before the attempt;
- axis choice contains plausible distractors and controls a blank-enough graph
  workspace;
- graph construction accepts two distinct table points for the straight-line
  source and uses forgiving table-point snapping or tolerance;
- read-off task presents interval selection before numeric read-off;
- formula is constructed through `formula_builder` with distractors before the
  calculation-control task;
- claim-control task requires interval/values/work/final percentage/conclusion
  rather than a correct-only selector;
- numeric parsing accepts ordinary percentage notation;
- feedback appears only after checking and routes to named practice;
- `1.1.3` completion language remains held until later explicit review;
- generated Book 1 output is produced by `node scripts/deploy.js`, not
  hand-edited;
- omitted review requirements are named follow-up work.

Proof standard: sprint plan, baseline, planning review, implementation, focused
tests, custom checker/proof JSON, generated Book 1 output, exemplar library,
review placeholders that state required future reviews, lead-review records,
result/diff metadata, and refreshed repository maps/indexes. Human review is
explicitly deferred to a later exemplar review bundle.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exit ticket must be independent and avoid pre-attempt formula/procedure leakage. | Replace `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`; remove formula context; guard placeholders and pre-attempt text. | Custom checker, Jest, generated JS/HTML scan, screenshot/proof notes. | planned |
| Graph task must require graph/table action with plausible distractors. | Shared task-shell graph construction supports delayed labels, axis distractors, two-point straight-line policy, accepted table points, and forgiving snapping/tolerance. | Task-shell tests, exit-ticket tests, custom checker, rendered output. | planned |
| Graph reading must follow thinking order. | Shared `graph_reading` renderer and evaluator support interval selection before numeric read-off. | Unit/UI tests and custom checker that fails numeric-before-interval data. | planned |
| Assessed formula knowledge must use clickable formula construction. | `1.1.3` source uses `formula_builder`; validator rejects static formula context when a formula builder is required. | Source checker, UI test, generated output scan. | planned |
| Percentage calculation must accept common student notation. | Shared numeric parser accepts optional percent sign and decrease phrases for number answers. | Engine tests for `-50%`, `-50 procent`, and `50% daling`. | planned |
| Feedback and next practice routes remain local and non-authoritative. | Every task has match/retry feedback and practice route; completion copy remains local; targetEquivalent approval remains false. | Exit-ticket engine tests, custom checker, generated output scan. | planned |
| Exemplar lessons become durable repository guidance. | Add `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/` and import/adapt package guidance. | Exemplar checker verifies files, review placeholders, and policy extract. | planned |
| Future reviewers receive honest status. | Record required teacher, student, visual/interaction, testing/regression, and lead synthesis reviews as pending placeholders, not approvals. | Lead review and result notes keep `hold_for_exemplar_review`. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Implement table-point snapping in the shared graph construction family now. | include_now | The handoff treats tolerance as product quality, not polish. |
| Add interval-first graph-reading support to the shared task shell now. | include_now | Required by the v3 thinking-order correction. |
| Use the package as a durable product-excellence exemplar library entry. | include_now | Required repository action and useful future-agent proof. |
| Add a strict custom checker for the exact v3 failure modes. | include_now | Required to preserve the lesson learned beyond this branch. |
| Build a fully general graph engine with drag handles and arbitrary curves. | defer_named_follow_up | Useful, but the required scope is two-point straight-line table construction. |
| Send materials for human comments immediately after implementation. | defer_named_follow_up | The handoff requires separate specialist reviews before human gate preparation. |
| Mark `1.1.3` target-equivalent proof complete. | reject_scope_creep | Completion language is explicitly held until later explicit gate approval. |

## Allowed paths

- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-*`
- `references/data/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1.plan.json`
- `references/data/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1.result.json`
- `reports/json/checksurface-113-exemplar-exit1-proof.json`
- `build-scripts/sprints/check-checksurface-113-exemplar-exit1.js`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- focused tests under `engines/tests/`
- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`
- generated Book 1 output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` produced by deploy only
- platform and lesson roadmap status updates when needed
- generated repository-map, URL-index, and dashboard artifacts

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No target-exercise registry writes in `references/authored/course-target-exercises.json`.
- No hand edits to generated lesson output.
- No legacy Module 3 target deploy or student-localStorage-sensitive work.
- No protected reference mutation, machine reference mutation, external-source
  mutation, unit minting, unit update, unit split, or unit deprecation.
- No changes that make `1.1.1` or `1.1.3` approved target-equivalent proof.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, CP-6/Year-1 promotion,
  Scale Gate 1, broad product use, or student/product use.

## Inputs

- `knowledge/113-excellent-exit-ticket-v3-package.zip`
- `C:/Users/meije/.codex/attachments/51d8e2fe-a26d-4e17-aa46-b7f5c13957af/pasted-text.txt`
- `../CLAUDE.md`
- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `build-scripts/README.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `source-data/book-1/exit-ticket/1.1.3-korte-check.json`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- `build-scripts/sprints/check-checksurface-policy-regression1.js`
- focused tests under `engines/tests/`

## Outputs

- Updated `1.1.3` exit-ticket source data matching the v3 handoff shape.
- Shared task-shell support for interval-first graph reading, tolerant
  percentage parsing, and two-point table graph construction.
- Updated policy/regression checker for v3 answer-leak and task-order failures.
- Product-excellence exemplar library entry with package files and pending
  review placeholders.
- Deployed/generated Book 1 `1.1.3` exit-ticket JS and HTML through deploy.
- `reports/json/checksurface-113-exemplar-exit1-proof.json`.
- Sprint plan, baseline, planning review, command log, verification review,
  lead-review records, result metadata, and diff summary.

## Operationalized sprint procedure

1. Record baseline from current platform/lesson commits, working-tree status,
   existing `1.1.3` source, current task-shell support, current check-surface
   validators, roadmaps, and package handoff.
2. Run planning review before implementation. Stop if the plan does not state
   generated outputs, quality floor, review evidence, or held authority.
3. Replace the current `1.1.3` exit-ticket source with a schema-compatible v3
   source: source/table only, graph construction, graph reading, formula
   builder, calculation work, feedback routes, held completion language.
4. Extend shared task-shell engine/UI for:
   - graph-reading interval selection before numeric input;
   - number parsing with percent signs and decrease phrases;
   - graph construction using two distinct accepted table points and forgiving
     magnetic table-point snapping.
5. Add or update tests for all new shared behavior and the `1.1.3` source.
6. Add the exemplar library entry and review placeholders. Mark all specialist
   reviews pending; do not create fake review approvals.
7. Add or update the deterministic checker to verify the v3 source, package
   adoption, generated output, parser behavior, graph tolerance, no formula
   context, no answer-giving placeholders, and held authority.
8. Switch/create a matching clean lesson branch, then deploy Book 1 output with
   `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`.
9. Run focused Jest and custom checker commands. If time allows, run broader
   platform/book validators and map/index refresh.
10. Record verification, lead-review assignment, round-1 review, corrections,
    round-2 recheck, result, diff summary, and JSON metadata.
11. Fetch/prune before final commit. Commit and push platform and lesson
    branches only after validation and dirty-state review.

Decision points:

- If full pointer/drag graph construction cannot be made safe, keep the strong
  graph-construction substitute and record a named graph-engine follow-up
  instead of weakening to dropdown-only.
- If a generated-output deploy tries to write onto an unrelated dirty lesson
  branch, stop and report the collision risk.
- If old checkers still require static formula context or interval-halving
  selectors, update those checkers to the v3 policy instead of weakening the
  source data.
- If specialist reviews are not actually performed, do not claim exemplar
  completion; keep `hold_for_exemplar_review`.

Stop conditions:

- Stop if generated output would need hand edits.
- Stop if a field placeholder gives away a correct value.
- Stop if graph-reading numeric input appears before interval selection.
- Stop if the formula appears as a static source/context card before attempt.
- Stop if graph/table work is reduced to choice-only recognition.
- Stop if correct-only controls are possible for assessed selectors/builders.
- Stop if `1.1.3` completion language becomes eligible.
- Stop if any wording authorizes diagnostics, mastery/sequencing, summative
  use, PV, Scale Gate 1, or product-wide/student use.

Review and validator details:

- Planning review must pass before implementation.
- Custom checker must pass before lead review.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.
- Human review is not required in this sprint. The required next action after
  implementation is `hold_for_exemplar_review` with separate teacher-learning,
  student-experience, visual/interaction, testing/regression, and lead synthesis
  reviews before any later human-facing gate bundle.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js CHECKSURFACE-113-EXEMPLAR-EXIT-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/exit-ticket-metadata-alignment.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js
node build-scripts/sprints/check-checksurface-policy-regression1.js
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-result.md
node build-scripts/sprints/check-sprint-bundle.js CHECKSURFACE-113-EXEMPLAR-EXIT-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the `1.1.3` exit-ticket source and generated output
meet the v3 handoff quality floor; no static formula or procedure context is
shown before attempt; graph construction, interval-first reading, formula
building, calculation work, tolerant percent parsing, feedback, and next routes
are implemented through shared task families; the exemplar library exists with
pending specialist review placeholders; custom checker and focused tests pass;
generated output was deployed, not hand-edited; lead-review round 2 returns
PASS or PASS WITH FLAGS; and the sprint result explicitly keeps the next action
at `hold_for_exemplar_review`.

## Rollback plan

Before commit, revert only the `CHECKSURFACE-113-EXEMPLAR-EXIT-1` source-data,
engine/UI/test, checker, exemplar, sprint artifact, roadmap/index/dashboard,
and generated Book 1 output changes. After commit, revert the sprint commits in
platform and lesson repos if needed.

Do not revert unrelated user work, prior sprint records, protected references,
generated lesson output from earlier sprints, or unrelated untracked package
inputs.

## Human review required

No human review gate is required or allowed to close inside this sprint. The
handoff requires later separate teacher-learning-quality, student-experience,
visual/interaction QA, testing/regression review, and lead synthesis before a
human-facing gate bundle can be prepared. This sprint must end at
`hold_for_exemplar_review`.
