# REASON-ADOPT-1 Playable Proof

Generated: 2026-06-02

Status: route-specific playable proof captured; no product authority.

## Proof Scope

This proof covers generated Book 1 reasoning pages for `1.1.1`, `1.1.2`, and
`1.1.3` after platform deploy. It verifies that modes 0, 1, and 3 now render
and play through the shared `step_ordering` task shell, while mode 5 remains
the existing `structured_reasoning` self-check.

This proof does not authorize target-equivalent reasoning claims, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or product-wide use.

## Validator Evidence

- `node build-scripts/sprints/check-reason-adopt1-route-output.js`: PASS
- focused reasoning/task-shell Jest run: PASS (`123` tests)
- screenshot capture: PASS (`5` screenshots)

The generated-route checker validates:

- deployed reasoning pages load `task-shell.css`, `task-shell-engine.js`, and
  `task-shell-ui.js`;
- deployed `reasoning-ui.js` contains the `REASON-ADOPT-1` shared-shell marker;
- modes 0, 1, and 3 expose `step_ordering` task-shell tasks;
- task-shell correct order maps back to legacy reasoning scoring;
- wrong order yields local `retry` task-shell feedback and wrong legacy scoring;
- mode 5 remains `structured_reasoning` and self-check only;
- modes 2 and 4 remain held/private and do not expose `taskShellTask`;
- no source reasoning CSV, source exit-ticket data, candidate storage, target
  fields, target-equivalent copy, diagnostic copy, mastery copy, sequencing
  copy, Scale Gate copy, or product-use authority is introduced.

## Screenshot Evidence

Screenshots are listed in
`reports/sprints/REASON-ADOPT-1-screenshot-manifest.md`.

| Case | What it proves |
|---|---|
| `desktop-light-111-mode0-initial` | Mode 0 opens as shared `step_ordering` with route context and no feedback before attempt. |
| `desktop-light-111-mode0-retry` | Wrong mode 0 order gives local `retry` task-shell feedback and a next action. |
| `desktop-light-112-mode1-matched` | Mode 1 `claim_reason_evidence` bridge plays as shared `step_ordering` and matches after correct order. |
| `mobile-light-113-mode3-matched` | Mode 3 ordered-chain bridge plays on mobile and gives matched feedback. |
| `desktop-dark-111-mode5-self-check` | Mode 5 task shell and self-check remain readable in dark mode; route-panel contrast remains a carried review flag. |

## Generated Output Diff Review

Initial deploy copied unrelated shared engines as a side effect. Those unrelated
generated diffs were restored for:

- `shared/exit-ticket-ui.js`
- `shared/graphical-ui.js`
- `shared/skilltree-ui.js`

The remaining lesson-side diff is scoped to the corrected generated-output map:

- `shared/reasoning-engine.js`
- `shared/reasoning-ui.js`
- `shared/task-shell-engine.js`
- `shared/task-shell-ui.js`
- `shared/task-shell.css`

The task-shell deploy copies are required dependencies for the shared
`step_ordering` controls and feedback used by the adopted reasoning modes.

## Carried Flags

1. Mode 3 is still an ordered-chain bridge, not full visual flow-diagram
   construction.
2. Modes 2 and 4 remain held/refactor-scoped.
3. Checked answers show both local task-shell feedback and the global reasoning
   summary/next action. This is controlled and playable, but should remain a UX
   review flag for later simplification.
4. On narrow mobile completion screenshots, the route panel appears below the
   long task after the checked state. It remains visible, but later UX work
   should consider whether route context needs to stay higher or collapsible.
5. Dark-mode screenshot proof confirms the mode-5 task-shell/self-check surface;
   it does not clear every route-panel contrast risk.
6. Capture automation checks task family, feedback state, and next action, but
   manual screenshot review is still needed for feedback-region count, route
   placement, and contrast judgments.
7. This sprint proves route adoption, not target-equivalent reasoning readiness.

## Next Use

This proof feeds later `REASON-PLAY-1`, `REASON-ANSWERFORM-2`, and
`GATE-REASON-STD-1`. The later human gate should use direct comments on the
evidence packet and should inspect the screenshots/playable proof rather than
an interactive interview transcript.
