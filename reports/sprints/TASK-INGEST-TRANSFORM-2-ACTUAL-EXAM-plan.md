# Sprint TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM: Actual Exam Source Exercise Transformation

## Goal

Transform the reconstructed actual-exam source for
`vw-1022-a-25-1-o:opgave-1:question-3` into governed shared task-family
compositions with operation-chain traces, answer-form traces, task-family maps,
sourceAuthority references, reviewer notes, review-only rendered proof,
screenshots, proof JSON, and a deterministic checker.

## Context

`SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` closed the authorized Zoohee source
reconstruction. The current sprint may now transform that reconstructed source
into a shared task-family bundle for review. The bundle must preserve the
official item's cognitive level: the student must select and role-label table
values, build the source-to-operation route, construct the annual-premium
formula/procedure, show calculation work, and state the threshold with
direction. A source-selection-only or choice-only reduction is not acceptable.

This sprint creates governed transformation evidence under `reports/` and a
checker under `build-scripts/sprints/`. It does not write generated Book 1
lesson output, mutate protected references, mutate source-data, mint units,
adopt a product route, claim target-equivalent proof, or authorize diagnostics,
adaptive routing, mastery/sequencing, PV, Scale Gate, or student/product use.

## Quality Standard

The quality floor is specification fulfilment for actual-exam task
transformation. The transformed bundle must:

- preserve the source authority and source reconstruction references;
- include task-family compositions that validate against the shared task-shell
  engine where runtime families already exist;
- cover the answer-model operations `annualize_monthly_premium`,
  `compare_deductible_exposure`, `derive_equal_cost_threshold`, and
  `state_threshold_with_direction`;
- include answer-form traces for source use as a modifier plus underlying
  calculation/constructed-answer requirements;
- prove that the transformation did not reduce the exam item to shallow
  source selection, recognition, or a final-answer-only calculation;
- provide review-only rendered output proof that a reviewer can inspect before
  the later human gate.

Passing validators or producing files is not enough if the task-family map
omits calculation work, source-to-answer chaining, answer-form direction, or
boundary evidence.

Because the transformed task cards model a future student-facing experience,
their labels, prompts, feedback boundaries, and rendered output must already be
inspectable as student-facing-quality proof, even though this sprint does not
publish or authorize a student-facing route.

Named follow-up work remains mandatory for textbook transformation and human
review; this sprint may not silently absorb those follow-up requirements into
an unreviewed product claim.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Use only the authorized actual-exam source. | Transformation JSON matches `reports/json/source-reconstruct2-actual-exam.json` and `reports/json/exam-source-authority1-contract.json`. | Checker rejects source-authority mismatch, wrong source material, or missing prior closure. | Planned |
| Produce task-family compositions. | `reports/json/task-ingest-transform2-actual-exam.json` includes shared task objects for `source_value_selection`, `source_chain_builder`, `formula_builder`, `step_ordering`, and `calculation_work_capture`. | Checker validates task objects with `TaskShellEngine.validateTask` and evaluates correct/adversarial responses. | Planned |
| Preserve operation-chain level. | `operationChainTrace` maps source values and answer-model refs to yearly premium, deductible exposure, threshold derivation, and direction. | Checker verifies required operations, inputs, outputs, point-rule refs, and no final-answer-only shortcut. | Planned |
| Preserve answer-form requirements. | `answerFormTrace` records source-use as modifier plus underlying calculation and constructed direction answer requirements. | Checker rejects source-only or choice-only proof and confirms calculation work plus direction criteria. | Planned |
| Produce task-family map and reviewer notes. | Markdown reports list operation -> task family -> task ID -> cognitive-preservation rationale and reviewer stop conditions. | Lead review inspects map, notes, proof JSON, and checker output. | Planned |
| Provide rendered review proof. | Review-only lab, desktop light screenshot, mobile light 390px screenshot, mobile dark 390px screenshot, screenshot manifest, and proof JSON. | Checker verifies lab files, mobile/dark proof, no answer leak before task section, no internal IDs visible, and no product-route claim. | Planned |
| Preserve product boundaries. | Result JSON and transformation bundle allow task transformation only and deny generated lesson output, protected reference mutation, source-data mutation, product-route adoption, target-equivalent proof, diagnostics, mastery, PV, Scale Gate, and student/product use. | Checker and git status confirm protected refs, source-data, and Book 1 generated output remain clean. | Planned |

## Quality Improvement Candidates

- include_now: Validate every transformed shared-shell task object with the
  existing task-shell engine and adversarial responses.
- include_now: Add a review-only rendered lab so the later human gate does not
  inherit a paper-only task transformation.
- include_now: Include explicit anti-reduction checks for source-selection-only,
  choice-only, and final-answer-only shortcuts.
- include_now: Carry source-use as a modifier with an underlying calculation
  answer form rather than treating source use as the whole answer.
- defer_named_follow_up: `TASK-INGEST-TRANSFORM-3-TEXTBOOK` must repeat this
  pattern for textbook source contexts after the actual-exam path is proven.
- defer_named_follow_up: `GATE-SHARED-TASK-INGEST-REPAIR-1` must conduct human
  review with actual-exam and textbook labs, comments, resolution log, and
  remote evidence.
- reject_scope_creep: Do not generate Book 1 lesson output, publish route
  adoption, claim target-equivalent proof, mutate protected references, mutate
  source-data, mint units, or authorize diagnostics, mastery, PV, Scale Gate,
  or student/product use.

## Allowed paths

- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-baseline.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-planning-review.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-reviewer-notes.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-result.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-diff-summary.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-command-log.*`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-lead-review-*.md`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.plan.json`
- `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.result.json`
- Roadmap, map, URL-index, and dashboard files updated only as required for closure.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No source-data writes.
- No generated Book 1 lesson output writes under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`.
- No target-exercise registry writes, candidate storage creation, unit minting,
  PV machine promotion, projection output writes, diagnostics, adaptive routing,
  mastery, sequencing, student-facing AI, summative use, Scale Gate authority,
  or student/product use.
- No legacy Module 3 target changes.

## Inputs

- `reports/json/exam-source-authority1-contract.json`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/task-context-spec1-contract.json`
- `reports/json/context-visual-std1-contract.json`
- `reports/json/task-family-construction-contract.json`
- `reports/json/task-family-choice-contract.json`
- `reports/json/task-family-source1-proof.json`
- `reports/json/task-family-formula1-proof.json`
- `reports/json/task-family-order1-proof.json`
- `reports/json/task-shell-ux2-proof.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

Generated transformation artifacts for this sprint:

- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-reviewer-notes.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark.png`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`

Sprint closure artifacts:

- Plan, baseline, planning review, command logs, result, diff summary, result
  JSON, and lead-review artifacts.
- Roadmap closure rows and refreshed GitHub-facing maps/indexes at final
  publication.

No generated lesson files, protected reference files, source-data files,
machine reference files, unit files, or product-route files should be produced.

## Operationalized sprint procedure

1. Establish baseline and planning review: validate this plan and active bundle,
   send the plan to a planning/review subagent, and stop if outputs, generated
   output boundaries, operation-chain coverage, rendered proof, or anti-
   reduction checks are missing.
2. Build the transformation contract: create JSON with sourceAuthority,
   sourceMaterialRefs, answerModelRefs, task-family compositions, operation
   chain, answer-form trace, anti-reduction checks, proof pointers, and product
   boundaries.
3. Build readable review artifacts: operation-chain trace, answer-form trace,
   task-family map, and reviewer notes.
4. Build review-only rendered proof: create a lab that shows source context
   before transformed task-family cards and capture desktop light, mobile light
   390px, and mobile dark 390px screenshots.
5. Build checker coverage: validate prerequisites, source authority,
   reconstruction linkage, shared-shell task schemas, correct/adversarial
   responses, operation outputs, answer-form trace, anti-reduction checks,
   rendered proof, and clean protected/generated-output boundaries.
6. Run validators and lead-review cycle: run acceptance tests, assign lead
   review, record round 1, apply corrections, run round 2, and stop if review
   finds shallow transformation, source mismatch, missing rendered proof, or
   scope drift.
7. Close publication state: update roadmap rows and result artifacts, refresh
   maps/indexes/dashboard as required, run final validators, fetch/prune remote
   state, commit and push unless a blocker is recorded with exact dirty status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM
node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js
node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof must include the transformation JSON, operation-chain trace,
answer-form trace, task-family map, reviewer notes, rendered lab, screenshot
manifest, desktop/mobile/dark screenshots, proof JSON, checker, command-log
evidence for every passed acceptance test in result JSON, planning review,
lead-review assignment/round 1/corrections/round 2 artifacts, result and diff
summary files, clean protected-reference/source-data/generated-output boundary
notes, and refreshed roadmap/map/index/dashboard evidence. The sprint can close
only when the complete bundle validator accepts the closure state.

## Rollback plan

If transformation or review fails, remove only the
`TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` sprint artifacts, checker, capture script,
and result JSON; restore the roadmap row to open if it was changed; and record
the blocker. Do not mutate protected references, source-data, generated lesson
output, or external PDFs as a rollback shortcut.

## Human review required

No human review gate is required for this transformation-evidence sprint. A
lead-review cycle is required before sprint closure. Human review remains
required for `GATE-SHARED-TASK-INGEST-REPAIR-1`, which must inspect direct
review-packet comments and remote evidence after this and the textbook
transformation work are ready.
