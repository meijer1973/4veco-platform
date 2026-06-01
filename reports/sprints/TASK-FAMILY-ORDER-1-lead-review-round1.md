# Lead Review Summary

Sprint: `TASK-FAMILY-ORDER-1`

Round: lead review round 1

Generated: 2026-06-01

## Scope

Evidence inspected:

- `reports/sprints/TASK-FAMILY-ORDER-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-plan.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `build-scripts/sprints/check-task-family-order1.js`
- `reports/json/task-family-order1-proof.json`
- `reports/sprints/TASK-FAMILY-ORDER-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-ORDER-1-screenshot-manifest.md`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Runtime semantics | Lead reviewer agent `019e84a6-4864-7e71-99ec-d6751993512e` | Exact response shape, order-sensitive matching, no neutral/no-distractor loopholes | REVISE |
| Wrapper integration | Lead reviewer agent | Shared `TaskShellUI` delegation for exit-ticket, skilltree, graph | passed |
| Proof artifacts | Lead reviewer agent | Fixture, proof JSON, generated-output boundary | passed with flags |
| Focused tests | Jest/custom checker | Existing tests/checker pass but miss adversarial shape case | REVISE |

## Consolidated Verdict

Verdict: REVISE

## Blocking Findings

One blocking finding:

1. Exact `{ order: [...] }` response shape was not strict enough.
   `stepOrderingMatches` checked that `response` was an object but did not
   reject arrays. A JavaScript array with an `order` property could match:

```js
const arr = [];
arr.order = ["verschil", "deel-door-oud", "keer-100"];
```

Required correction:

- require a non-array object in `stepOrderingMatches`;
- add a focused Jest regression test for array-with-`order`;
- add the same adversarial assertion to
  `build-scripts/sprints/check-task-family-order1.js`;
- rerun focused Jest and the custom checker before round 2.

## Specialist Findings

No additional specialist blockers. The reviewer confirmed:

- neutral steps are rejected;
- no-distractor tasks are rejected;
- expected order must cover all answer steps;
- matching is order-sensitive;
- feedback is `practice_only`;
- wrappers delegate through shared `TaskShellUI`;
- product-authority and generated-output boundaries are preserved.

## Test Evidence

The reviewer validated:

- focused Jest: 5 suites passed, 55 tests passed before the correction;
- `node build-scripts/sprints/check-task-family-order1.js` passed before the
  correction but missed the array-with-`order` loophole;
- sprint plan and bundle validators passed.

## Learning Quality Evidence

The family remains limited to procedure-control proof. It does not authorize
final calculation, graph/table, source-chain, or constructed-response
execution proof.

## Student Experience Evidence

Rendered fixture proof exists for standard, narrow, dark, and after-click
states, but generated-route screenshots remain deferred to adoption.

## Ownership and Handoff

Main agent owns the correction. Lead reviewer must recheck after the matcher,
Jest test, and custom checker are updated.

## Required Next Action

Fix the exact response-shape loophole, add adversarial test/checker evidence,
record the correction log, and request lead review round 2.
