# Lead Review Summary

Sprint: `TASK-FAMILY-MULTI-1`
Round: lead review round 1

## Scope

Reviewed `TASK-FAMILY-MULTI-1` as a runtime-only `multi_select`
implementation. Evidence inspected:
`reports/sprints/TASK-FAMILY-MULTI-1-lead-review-assignment.md`,
`reports/sprints/TASK-FAMILY-MULTI-1-plan.md`,
`reports/sprints/TASK-FAMILY-MULTI-1-baseline.md`,
`reports/sprints/TASK-FAMILY-MULTI-1-planning-review.md`,
`references/data/sprints/TASK-FAMILY-MULTI-1.plan.json`,
`reports/json/task-family-multi1-proof.json`,
`reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html`,
`reports/sprints/TASK-FAMILY-MULTI-1-screenshot-manifest.md`,
`build-scripts/sprints/check-task-family-multi1.js`,
`engines/task-shell-engine.js`, `engines/task-shell-ui.js`,
`engines/task-shell.css`, `engines/exit-ticket-ui.js`,
`engines/skilltree-ui.js`, `engines/graphical-ui.js`, and focused
task-shell/wrapper tests.

No files were edited by the lead reviewer.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Sprint readiness | lead reviewer/tool | Plan, baseline, planning review, plan validator, and bundle validator. | PASS |
| Engine contract | lead reviewer/tool | `multi_select` family declaration, validation, and matching paths. | REVISE |
| Exact response shape | lead reviewer/tool | `{ values: ... }` only; raw-array, extra-key, duplicate, unknown, and type rejection. | REVISE |
| UI/rendering | lead reviewer/tool | `.ts-multi-option`, `data-multi-option-id`, fixture HTML, and CSS. | PASS WITH FLAGS |
| Wrapper collection | lead reviewer/tool | Exit-ticket, skilltree, and graph wrappers collect through shared helper. | PASS |
| Product authority | lead reviewer/tool | Proof JSON boundary flags, diff scope, and lesson-repo diff check. | PASS |

## Consolidated Verdict

Verdict: REVISE.

Core blocker: `multi_select` did not fully enforce the exact response shape.
Selected ids were normalized through string conversion, and option lookup could
allow JavaScript key coercion. The reviewer reproduced that
`{ values: [1, "2"] }` could match when option ids were `"1"` and `"2"`.

That violates the contract that responses must be exactly
`{ values: ["optionId"] }` with string option ids.

## Blocking Findings

Blocking: yes.

1. Make multi-select response ids strict strings, with no numeric or object
   coercion.
2. Compare raw option ids with own-key checks, not normalized/stringified ids.
3. Add engine and custom-checker tests proving numeric or object response
   values do not match numeric-string option ids.
4. Re-run the required sprint checks.

## Specialist Findings

- `multi_select` is distinct from `.ts-choice.selected`;
- UI uses `.ts-multi-option` and `data-multi-option-id`;
- wrappers delegate through `TaskShellUI`;
- partial feedback is `practice_only` and neutral;
- the fixture has one feedback region;
- changed paths stay inside authorized platform/runtime/report scope.

## Test Evidence

The lead reviewer reported these commands passed before the blocker was found:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MULTI-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MULTI-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-multi1.js
git diff --check
git -C ../4veco-lessen diff --check
```

Focused Jest passed 5 suites and 52 tests. `git diff --check` passed with only
CRLF warnings. `git -C ../4veco-lessen diff --check` passed cleanly.

## Learning Quality Evidence

The fixture demonstrates a bounded economics use case: selecting the complete
set of statements that fit scarcity. That fits the intended set-selection
action and does not claim target-equivalent proof.

## Student Experience Evidence

The rendered fixture contains checkbox-like option controls, stable
`data-multi-option-id` selectors, independent selected state, one feedback
region, and neutral partial-feedback groups. Remaining flag: this is static
report-fixture proof, not generated-route desktop/mobile/dark screenshot or
after-click proof.

## Ownership and Handoff

Owner: main implementation/integration agent.

Code corrections are required before closure. Closure may not proceed until
round 2 confirms the response-shape blocker is resolved.

## Required Next Action

Fix strict string response-id enforcement, add regression tests, rerun required
checks, record the correction log, and request round-2 lead-review recheck.
