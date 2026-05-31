# Sprint REASON-UX-2: Structured Reasoning Task-Shell Fixture

Generated: 2026-05-31

## Purpose

This fixture records the non-published task-shell proof for the new reasoning
practice mode. It is not an exit ticket, not target-equivalent proof, and not a
student/product-use authorization.

## Runtime Shape

`ReasoningEngine` now exposes a sixth mode:

- mode index: `5`
- label: `Redeneerantwoord opbouwen`
- task family: `structured_reasoning`
- source data: existing reasoning CSV problem text, step chain, and flow slots
- validation path: `TaskShellEngine.evaluateTask`
- feedback path: `TaskShellUI.renderFeedback` plus a local example-route guide

The task shell prompt uses generic student-facing criteria:

- Noem de beginsituatie of oorzaak.
- Leg de economische tussenstap uit.
- Sluit af met de conclusie in de context.

The detailed source chain appears only after the student writes a response and
asks for self-check feedback.

## Boundary Flags

The task-shell evaluation returns the shared boundary flags with:

- `targetEquivalentProof: false`
- `diagnostics: false`
- `adaptiveRouting: false`
- `masteryDecisions: false`
- `automaticSequencing: false`
- `studentFacingAI: false`
- `summativeUse: false`
- `pvProjection: false`
- `pvMachinePromotion: false`
- `studentProductUse: false`

## Validation

Passed:

- `npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js`
- `node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- in-app browser check: six mode buttons, `structured_reasoning` task family,
  `REASON-UX-2` marker, `self_check` feedback state, example route present, and
  no visible internal-code leak.

## Result

The fixture proves shared task-shell semantics for reasoning practice only. It
does not publish or imply a paragraph-completion checkpoint.
