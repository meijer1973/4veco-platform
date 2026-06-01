# Lead Review Summary
Sprint: `TASK-FAMILY-FORMULA-1`
Round: lead review round 1

## Scope

Reviewed the runtime-only `formula_builder` task-shell implementation. The
reviewer did not edit files.

Evidence inspected: `reports/sprints/TASK-FAMILY-FORMULA-1-lead-review-assignment.md`,
`reports/sprints/TASK-FAMILY-FORMULA-1-plan.md`,
`engines/task-shell-engine.js`, `engines/task-shell-ui.js`,
`engines/task-shell.css`, `engines/exit-ticket-ui.js`,
`engines/skilltree-ui.js`, `engines/graphical-ui.js`,
`engines/tests/task-shell-engine.test.js`,
`build-scripts/sprints/check-task-family-formula1.js`,
`reports/json/task-family-formula1-proof.json`, and
`reports/sprints/TASK-FAMILY-FORMULA-1-rendered-fixture.html`.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Plan and scope review | lead reviewer | Runtime-only scope; no generated output, source-data adoption, target-equivalent claims, diagnostics, mastery, PV, Scale Gate, or product authority. | PASS |
| Engine contract review | lead reviewer | Token bank, token kinds, formula categories, distractors, no-reuse default, accepted sequences, and exact response shape. | REVISE |
| UI/UX review | lead reviewer | Formula-block bank, ordered formula zone, add/remove/reorder controls, clear control, one feedback region. | PASS WITH FLAG |
| Wrapper review | lead reviewer | Exit-ticket, skilltree, and graph wrappers collect `{ tokens: [...] }` and delegate interaction to shared helpers. | PASS |
| Test review | lead reviewer/tool | Focused Jest and checker cover strict shape, wrong order, missing/extra token, category, duplicate-use, and wrappers. | REVISE |
| Boundary review | lead reviewer | No generated Book 1 output, source data, protected references, target registry, candidate storage, or product-authority surfaces changed. | PASS |

## Consolidated Verdict

Verdict: REVISE.

The implementation is close, but round 1 cannot pass because exact
response-shape validation is incomplete.

## Blocking Findings

One blocking finding was present in round 1:

1. `formulaBuilderMatches` accepts `{ tokens: [...], extra: "ignored" }` as
   matched. The sprint contract says the student response shape is exactly
   `{ tokens: ["tokenId"] }`, and the user instruction makes missing
   exact-shape validation a blocker. Required correction: reject response
   objects with keys other than `tokens`, and add focused Jest plus
   `check-task-family-formula1.js` regression coverage.

## Specialist Findings

Engine contract: Category validation is present for `numerator`,
`denominator`, `operator`, `grouping`, `value`, `variable`, `multiplier`, and
`notation`; distractor policy, `distractorFor`, accepted sequence inclusion,
unknown-token rejection, raw-array rejection, and duplicate-use default are
covered. Exact object shape is the remaining blocker.

UI/UX: The fixture shows formula bank, sequence zone, clear control, native
buttons, and one feedback region. Remove/reorder controls are generated
dynamically by shared helpers, not shown in the initial static fixture; carry
as a non-blocking runtime flag before product adoption.

Wrapper integration: Exit-ticket, skilltree, and graph wrappers delegate
formula clicks and response collection to `TaskShellUI` and collect
`{ tokens: [...] }`.

Product-boundary surfaces: `git status` and diff inspection show only allowed
platform runtime/test/sprint artifacts; `../4veco-lessen` has no diff.

## Test Evidence

The reviewer reran:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-FORMULA-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-formula1.js
```

Results: plan checker passed, bundle checker passed as planned/active, focused
Jest passed 5 suites / 46 tests, formula checker passed. The checker did not
yet catch the extra-key exact-shape gap.

## Learning Quality Evidence

`formula_builder` is correctly framed as construction/procedure proof only:
it proves choosing and ordering formula parts, not executing the calculation
and not target-equivalent paragraph proof. Proof JSON and plan boundaries keep
target-equivalent reliance, diagnostics, mastery, sequencing, PV, Scale Gate
1, and product-wide use false.

## Student Experience Evidence

The rendered fixture affordance is understandable for the initial state:
prompt, purpose, formula-block bank, ordered formula zone, clear action, and
`role="status"` / `aria-live="polite"` feedback. Focus plan covers token
buttons and sequence zone; native buttons provide keyboard semantics.
Mobile/dark evidence is source/proof-flag level only, not generated-route
screenshot proof.

## Ownership and Handoff

Owner: main implementation/integration agent.

Carried flags: exact response-shape fix belongs to engine/tests/checker owner;
after-click remove/reorder rendered proof belongs to future adoption or
`GATE-TASK-FAMILY-1`; generated-route screenshots remain required before
product, target-equivalent, or Scale Gate use.

## Required Next Action

Revise before closure: enforce exact `{ tokens: [...] }` response-object
shape, add regression tests/checker coverage for extra response keys, rerun
the four required commands, then record corrections and request lead-review
round 2.
