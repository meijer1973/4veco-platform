# Lead Review Summary

Sprint: `TASK-FAMILY-SENTENCE-1`

Round: lead review round 1

## Scope

Reviewed the current `sentence_builder` runtime-only shared task-shell
implementation against
`reports/sprints/TASK-FAMILY-SENTENCE-1-lead-review-assignment.md`.

Evidence inspected:

- `reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`
- `build-scripts/sprints/check-task-family-sentence1.js`
- `reports/json/task-family-sentence1-proof.json`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-screenshot-manifest.md`

The lead reviewer did not edit files.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Plan and scope review | lead reviewer | Runtime-only scope; generated output, source-data adoption, target-equivalent claims, and product authority blocked. | PASS |
| Engine contract review | lead reviewer | Token bank, accepted sequences, distractors, no-reuse default, and exact response shape validated. | PASS |
| UI/UX review | lead reviewer | Fragment bank, ordered sequence zone, add/remove/reorder controls, and one feedback region present. | PASS WITH FLAG |
| Wrapper review | lead reviewer | Exit-ticket, skilltree, and graph wrappers collect `{ tokens: [...] }` and delegate interaction to shared helpers. | PASS |
| Test review | lead reviewer/tool | Focused Jest and custom checker pass with strict-shape, wrong-order, missing/extra token, duplicate-use, and wrapper checks. | PASS |
| Boundary review | lead reviewer | No generated Book 1 output, source data, protected references, target registry, candidate storage, or product-authority surfaces changed. | PASS WITH FLAG |

## Consolidated Verdict

Verdict: PASS WITH FLAGS

No blocking findings. The implementation is acceptable for a runtime-only
shared task-family sprint. It must not be treated as product-route adoption or
target-equivalent proof.

## Blocking Findings

None.

## Specialist Findings

Strict response shape is handled correctly. `sentenceBuilderMatches` requires
an object with `response.tokens`; raw token arrays return `matched: false`.
Focused tests and the custom checker include raw-array rejection.

Engine validation covers the important schema controls: token bank presence,
duplicate token id rejection, token kind validation, distractor requirement,
`distractorFor` reference validation, canonical `expected.tokens`,
`acceptedSequences`, canonical sequence inclusion, unknown expected token
rejection, and no-reuse default.

Wrapper state remains shared-shell owned. Exit-ticket, skilltree, and graph
wrappers delegate sentence interaction and collection through
`TaskShellUI.handleSentenceBuilderClick` and
`TaskShellUI.collectSentenceBuilderResponse`; no bespoke wrapper feedback or
state model was introduced.

UI affordance is acceptable for this runtime-only sprint: fragment bank,
ordered sequence zone, clear control, dynamic add/remove/reorder helpers,
native buttons, stable selectors, and focus selectors exist. Carried flag: the
static rendered fixture shows the initial state only, so remove/reorder
controls are proven by source and checker rather than by an after-click
rendered fixture.

## Test Evidence

Reran the four required commands:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SENTENCE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-sentence1.js
```

Results:

- sprint plan check passed;
- sprint bundle check passed;
- focused Jest passed: 5 suites, 43 tests;
- custom checker passed.

Boundary checks:

- no changes under `references/machine/`;
- no changes under `references/external/`;
- no changes under `references/authored/course-target-exercises.json`;
- no changes under `source-data/book-1`;
- no changes under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`;
- `knowledge/exit-ticket-game-1.1.1.zip` remains untracked and unrelated.

## Learning Quality Evidence

The fixture task asks for an ordered cause-effect reasoning chain, not passive
recognition. Distractor policy is enforced. The proof correctly limits the
family to deterministic sequence construction and explicitly blocks broad
semantic evaluation or target-equivalent reliance.

## Student Experience Evidence

The report fixture shows an understandable initial `sentence_builder` surface:
task purpose, ordered answer zone, fragment bank, clear control, and one
labelled feedback region. The dynamic source adds remove and left/right reorder
controls using native buttons. Product-route screenshots, mobile/narrow proof,
and dark-mode generated-route proof remain deferred until adoption or
`GATE-TASK-FAMILY-1`.

## Ownership and Handoff

Owner remains the main implementation/integration agent.

Carried flags:

- Keep `knowledge/exit-ticket-game-1.1.1.zip` unstaged and out of sprint
  closure.
- Product-route screenshots remain required before `sentence_builder` is used
  in generated practice, short-check, exit-ticket, reasoning-migration,
  product-proof, or Scale Gate surfaces.
- Round-2 notes should explicitly acknowledge that after-click remove/reorder
  controls are source/checker-proven, not captured in the static initial
  fixture.

## Required Next Action

Proceed to a correction log that records the carried flags, then run
lead-review round 2 recheck. No code correction is required from round 1 unless
an optional dynamic interaction fixture/test is added for after-click
remove/reorder controls.
