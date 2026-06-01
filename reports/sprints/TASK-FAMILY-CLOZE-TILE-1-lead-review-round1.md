# Lead Review Summary
Sprint: `TASK-FAMILY-CLOZE-TILE-1`
Round: lead review round 1

## Scope

Reviewed the `cloze_tile_select` shared task-shell implementation before sprint
closure.

Evidence inspected:

- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-plan.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-baseline.md`
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
- `build-scripts/sprints/check-task-family-cloze-tile1.js`
- `reports/json/task-family-cloze-tile1-proof.json`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-screenshot-manifest.md`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Contract/schema | Lead reviewer | Runtime shape matches accepted contract exactly | REVISE |
| Engine validation and matching | Lead reviewer | Validation catches ids/reuse/distractors and exact matching | REVISE |
| UI and accessibility | Lead reviewer | Inline blanks, tile bank, clear controls, labels, button keyboard semantics, feedback region | PASS |
| Wrapper integration | Lead reviewer | Exit-ticket, skilltree, and graph wrappers collect `{ blanks }` through shared helper | PASS |
| Test/checker evidence | Lead reviewer | Focused Jest and sprint checker pass and cover contract risks | REVISE |
| Product boundaries | Lead reviewer | Forbidden surfaces clean or explicitly excluded | REVISE |

## Consolidated Verdict

Verdict: REVISE

The implementation is close, but two blockers remain before closure.

## Blocking Findings

Blocking findings exist: two blockers were found in round 1.

1. Response shape is not strict enough. The accepted response shape is exactly
   `{ blanks: { blankId: tileId } }`, but `clozeTileMatches` accepted a raw
   blank map as a fallback. Required correction: reject responses without an
   object `response.blanks`, and add regression test/checker coverage proving
   `{ indexpunten: "vier" }` does not match.

2. Forbidden surface hygiene needs explicit handling. The unrelated untracked
   `knowledge/exit-ticket-game-1.1.1.zip` is present in the worktree while the
   plan says not to touch it. Required correction: remove it from the sprint
   working tree or document that it is unrelated pre-existing user work and
   exclude it from closure/staging.

## Specialist Findings

Contract/schema is mostly sound: `cloze_tile_select` is declared deterministic
and validates segments, blanks, tiles, duplicate IDs, unknown references,
distractor policy, and default no-reuse behavior. Exact response-shape
strictness blocks PASS until corrected.

Accessibility/UI direction is acceptable for a runtime-only sprint. The fixture
and source show inline blanks, tile-bank buttons, clear controls, labels,
`aria-pressed`, disabled used tiles, and one feedback region. Native button
keyboard behavior supports Enter/Space. Product-route screenshots remain
correctly deferred.

Wrapper integration is structurally correct: exit-ticket, skilltree, and graph
wrappers delegate to `TaskShellUI.collectClozeTileResponse`, which returns the
accepted `{ blanks }` response shape.

## Test Evidence

The reviewer ran:

```bash
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze-tile1.js
```

Both passed before the review, but tests did not yet catch raw-map response
acceptance.

## Learning Quality Evidence

The fixture supports bounded completion for index-points-versus-percent and
uses misconception distractors such as `4%` and `100`. It preserves the
boundary that this is runtime support only, not broad explanation proof or
target-equivalent authority.

## Student Experience Evidence

The rendered fixture shows inline sentence blanks, a tile bank, clear/remove
controls, and labelled feedback. It is likely understandable as a low-friction
construction step. Product-route screenshots are correctly deferred.

## Ownership and Handoff

Owner: main implementation/integration agent.

Required corrections are limited to response-shape strictness, regression
coverage, and forbidden-surface exclusion evidence for the unrelated zip.

## Required Next Action

Revise before closure. Make response matching require `response.blanks`, add
regression test/checker coverage, and document or remove the unrelated
`knowledge/exit-ticket-game-1.1.1.zip` worktree issue. Then rerun focused Jest
and the custom checker before round-2 lead review.
