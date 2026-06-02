# Sprint REASON-ADOPT-1: Baseline

Generated: 2026-06-02

## Plan reference

Plan: `reports/sprints/REASON-ADOPT-1-plan.md`

## Current State

`REASON-STD-1` closed PASS WITH FLAGS. The reasoning engine now emits shared
task-shell task objects for modes 0, 1, 3, and 5, but the generated Book 1
reasoning route has not yet adopted the shared shell for modes 0, 1, or 3.

Current generated-route state:

| Mode | Current route UI | REASON-ADOPT-1 target |
|---|---|---|
| 0 `Stappen ordenen` | private reasoning step cards and private selected-order display | shared `step_ordering` task shell |
| 1 `Deelvragen opbouwen` | private reasoning subquestion rows and private selected-order display | shared `step_ordering` task shell with `claim_reason_evidence` semantics |
| 2 `Vind de fout` | private click-to-answer error-detection mode | held/deferred, no shared-shell adoption in this sprint |
| 3 `Stroomdiagram bouwen` | private flow-bank and chain UI | shared ordered-chain `step_ordering` bridge |
| 4 `Structuren matchen` | private matching UI | held/refactor-before-adoption, no shared-shell adoption in this sprint |
| 5 `Redeneerantwoord opbouwen` | shared `structured_reasoning` task shell | keep and verify |

## Prior Evidence

- `reports/sprints/REASON-STD-1-result.md`
- `reports/sprints/REASON-STD-1-standard-family-map.md`
- `reports/json/reason-std1-proof.json`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-screenshot-manifest.md`
- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `build-scripts/sprints/capture-reason-ux2-screenshots.js`

## Data integrity notes

Protected reference data remains unchanged: `references/machine/` and
`references/external/` are read-only for this sprint.

No source reasoning CSV has been changed at baseline. No source exit-ticket
data has been changed. No target-exercise fields, candidate storage, protected
reference records, diagnostics, mastery/sequencing, Scale Gate 1, or product
authority are authorized by this sprint.

Generated Book 1 output may change only through `node scripts/deploy.js
"../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` after implementation.
After deploy, the sprint must run `git -C "../4veco-lessen" diff --name-only`
and stop if any path outside the plan's Generated Output Map changes.

Expected generated-output map:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`, only if a
  shared-shell reasoning layout/accessibility fix is implemented
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`, only as a
  deploy copy of the already-reviewed source state
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-engine.js`, as the
  shared-shell dependency required for `step_ordering` evaluation
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`, as the
  shared-shell dependency required for `step_ordering` playability
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`, as the
  shared-shell dependency required for rendered task controls
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.1.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.2.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.3.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/meta-categories.js`
- the three generated `*redeneer-spel.html` files for `1.1.1`, `1.1.2`, and
  `1.1.3`

## Baseline Risk

The main risk is playability drift. Rendering `TaskShellUI.renderTask` is not
enough: the student must be able to click tokens, remove/reorder steps, submit,
receive controlled feedback, and proceed without guessing. The sprint must
test actual interaction states, not only static HTML.
