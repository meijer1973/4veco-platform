# Sprint REASON-STD-1: Reasoning Game Unified Exercise Migration

Generated: 2026-06-02

## Goal

Bring the reasoning game task types into the shared standard exercise model.
This sprint must make the main reasoning actions inspectable as shared
task-shell families, prove those standard tasks validate and evaluate, and
decide whether the reasoning game can continue as a thin wrapper or needs a
deeper rebuild.

This sprint may implement platform-runtime standard-family mappings and report
proof. It does not authorize generated lesson output, source lesson data
mutation, target-equivalent completion language, diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, Scale Gate 1, or product use.

## Context

`STANDARD-EXERCISES-1` found that graph, math, and the reviewed `1.1.2`
exit-ticket candidate are mostly covered by shared task-shell families, while
reasoning remains the outlier. `REASON-UX-2` added a useful sixth mode,
`Redeneerantwoord opbouwen`, using `structured_reasoning`, but modes 0-4 still
use private reasoning UI and answer shapes.

The accepted task-family work now provides shared runtime families that can
represent several reasoning actions:

- `step_ordering`;
- `sentence_builder`;
- `matching_pairs`;
- `two_tier_choice`;
- `assertion_reason`;
- `source_chain_builder`;
- `structured_reasoning`.

`GATE-TASK-FAMILY-1` accepted those families as planning input only. This sprint
therefore may use them in platform reasoning proof, but product-route adoption
still requires later route-specific rendered proof and a direct-comment human
evidence gate.

## Quality Standard

The quality floor is specification fulfilment within this bounded scope:
reasoning actions must be mapped to concrete shared task families, the mappings
must validate against `engines/task-shell-engine.js`, and rendered-output or
fixture proof must show a student-facing standard task shape rather than a
paper-only architecture claim.

The sprint must preserve the product specification: reasoning practice may give
local feedback and repair support, but it may not claim target-equivalent proof,
diagnostics, mastery, sequencing, summative status, or product authority.
Omitted requirements must be named as follow-up sprint work or blockers.

The review gate that will judge student-facing reasoning quality after the
reasoning sprints is a later direct-comment human evidence package,
`GATE-REASON-STD-1`.
That gate must inspect live/playable rendered output and usability-agent
evidence, similar to the task-family evidence-presentation style.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reasoning tasks must use the shared task-type standard where actions overlap. | `reasoning-engine.js` exposes validated task-shell task objects for ordering, subquestion, flow/chain, and structured answer modes. | Focused Jest and `check-reason-std1.js` verify task families and response shapes. | planned |
| Step-by-step reasoning must not stay a private-only action. | Mode 0 maps to `step_ordering`; mode 1 maps to a `claim_reason_evidence` standard decision using `step_ordering`. | Standard-family map and engine tests verify expected `{ order }` responses. | planned |
| Flow or causal-chain work must be represented as construction, not generic text. | Mode 3 maps to `cause_effect_chain` / `flow_diagram_build` through a validated ordered-chain task, with a later visual-flow adoption flag. | Fixture proof renders the shared ordered-chain task and records the visual-flow follow-up. | planned |
| Constructed reasoning remains distinct from proof. | Mode 5 keeps `structured_reasoning` self-check and adds a sentence-construction follow-up decision without scoring as `goed`. | Tests preserve `selfCheckOnly`, `targetEquivalentProof: false`, and no forbidden claims. | planned |
| Classification/matching and source-based explanation are handled honestly. | Mode 4 and future source tasks receive keep/refactor/rebuild decisions; unsupported mapping gaps are not hidden. | Mapping artifact names `classification_with_explanation` and `source_based_explanation` dispositions. | planned |
| Product-route adoption requires rendered proof. | This sprint creates report-fixture proof only and names `REASON-PLAY-1` for generated/playable route adoption. | Result and roadmap keep route-specific proof as a blocker for adoption. | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add standard-family task objects to the reasoning engine. | include_now | This directly satisfies the migration requirement without rewriting the whole game. |
| Add deterministic tests for standard task validation and evaluation. | include_now | The task-family mapping must be executable, not just a document. |
| Add a report fixture that renders representative reasoning standard tasks. | include_now | Human reviewers need to see the task shapes before later playable adoption. |
| Rename/rebuild all reasoning UI modes immediately. | defer_named_follow_up | Playable generated-route adoption belongs in `REASON-PLAY-1` after standard mappings are proven. |
| Create or edit Book 1 reasoning CSV content. | defer_named_follow_up | Source-data edits should happen only in a later adoption sprint with rendered output proof. |
| Treat deterministic task-family matching as target-equivalent reasoning proof. | reject_scope_creep | The product spec separates practice support from target-equivalent exit tickets. |
| Add diagnostics or misconception profiles from two-tier/assertion tasks. | reject_scope_creep | Feedback remains local practice/repair support only. |

## Allowed paths

- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js` only if needed for source-level safeguards
- `engines/tests/reasoning-engine.test.js`
- `engines/tests/reasoning-ui.test.js`
- `reports/sprints/REASON-STD-1-*`
- `reports/json/reason-std1-*.json`
- `references/data/sprints/REASON-STD-1.plan.json`
- `references/data/sprints/REASON-STD-1.result.json`
- `build-scripts/sprints/check-reason-std1.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and dashboard files required for
  reviewer navigation

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files
- `source-data/book-1/reasoning/*.csv`
- `source-data/book-*/exit-ticket/*.json`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/TASK-SHELL-UX-2-result.md`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-closure.md`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `source-data/book-1/reasoning/*.csv` as read-only context

## Outputs

- `reports/sprints/REASON-STD-1-plan.md`
- `reports/sprints/REASON-STD-1-baseline.md`
- `reports/sprints/REASON-STD-1-planning-review.md`
- `reports/sprints/REASON-STD-1-standard-family-map.md`
- `reports/sprints/REASON-STD-1-build-vs-rebuild-note.md`
- `reports/sprints/REASON-STD-1-rendered-fixture.html`
- `reports/sprints/REASON-STD-1-screenshot-manifest.md`
- `reports/sprints/REASON-STD-1-lead-review-assignment.md`
- `reports/sprints/REASON-STD-1-lead-review-round1.md`
- `reports/sprints/REASON-STD-1-lead-review-corrections.md`
- `reports/sprints/REASON-STD-1-lead-review-round2.md`
- `reports/sprints/REASON-STD-1-result.md`
- `reports/sprints/REASON-STD-1-diff-summary.md`
- `reports/json/reason-std1-standard-family-map.json`
- `reports/json/reason-std1-proof.json`
- `references/data/sprints/REASON-STD-1.plan.json`
- `references/data/sprints/REASON-STD-1.result.json`
- `build-scripts/sprints/generate-reason-std1-proof.js`
- `build-scripts/sprints/check-reason-std1.js`

## Operationalized sprint procedure

1. Record baseline evidence from the product specs, roadmaps, prior reasoning
   proof, task-family closure, and current reasoning/task-shell source. Stop if
   the plan requires generated-output mutation, reasoning CSV writes,
   protected references, exit-ticket source data, or product claims.
2. Run planning review before implementation. Fix the plan if review finds
   missing generated-output boundaries, weak proof, or a hidden target-proof
   claim.
3. Implement standard-family task builders in `engines/reasoning-engine.js`
   for the reasoning modes that can be represented by current shared families.
   Preserve existing public arrays where current tests and UI use them.
4. Add tests proving standard tasks validate and evaluate through
   `TaskShellEngine`, while current self-check mode stays non-scored.
5. Produce mapping/proof JSON and a rendered report fixture showing the
   standard task shapes. Stop if the fixture is static-only without enough
   evidence for later playable adoption.
6. Write build-vs-rebuild disposition: keep/wrap/refactor/rebuild for current
   reasoning modes and name later reasoning sprints.
7. Run a structural lead-review cycle and record corrections. Stop if lead
   review finds a core-spec failure or if carried flags are broader than the
   claim they block.
8. Update roadmaps and generated GitHub-facing indexes after validation.
9. Fetch, reconcile, commit, and push platform and lesson-roadmap changes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-STD-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-STD-1
npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
node build-scripts/sprints/generate-reason-std1-proof.js
node build-scripts/sprints/check-reason-std1.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/REASON-STD-1-result.md
node build-scripts/sprints/check-sprint-bundle.js REASON-STD-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close this sprint must include validator, test, and review
evidence for:

- standard task objects for reasoning mode 0, mode 1, mode 3, and mode 5;
- an explicit disposition for mode 2 error detection, mode 4 matching, and
  future source-based explanation;
- tests showing the mapped tasks pass shared task-shell validation and
  evaluation;
- a rendered fixture generated from current reasoning-engine `taskShellTask`
  objects and a screenshot manifest for human-readable proof;
- no generated lesson output, source-data mutation, target-equivalent claim,
  diagnostics, mastery, sequencing, Scale Gate 1, or product authority;
- a clear next-step sequence ending in `GATE-REASON-STD-1`.

## Rollback plan

Before commit, remove only the `REASON-STD-1` engine/test changes, sprint
artifacts, checker, JSON proof, roadmap updates, and generated index/dashboard
refreshes from this sprint. After commit, revert the sprint commit. Do not
revert earlier reasoning, task-family, roadmap, protected-reference, source
data, or generated-output work.

## Human review required

This sprint itself does not start the human review gate. It prepares reasoning
standardization and must name a later direct-comment human evidence gate,
`GATE-REASON-STD-1`, after the reasoning adoption/playability sprints produce
live rendered output, screenshots, and usability-agent evidence. The final gate
evidence package must be pushed before review and must accept direct reviewer
comments on the evidence package instead of running the old
one-question-at-a-time interview.
