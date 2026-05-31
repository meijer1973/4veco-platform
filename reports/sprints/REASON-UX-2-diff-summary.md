# Sprint REASON-UX-2: Diff Summary

Generated: 2026-05-31

## Summary

The diff integrates the GAME-UX-3A shared task shell into the live generated
Book 1 reasoning routes.

The reasoning game now includes a sixth structured-reasoning self-check mode
and richer repair feedback while preserving the existing five modes.

## Platform Source Changes

- `build-scripts/platform/build-reasoning-engine.js` now loads
  `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js` in generated
  reasoning shells.
- `engines/reasoning-engine.js` adds the `Redeneerantwoord opbouwen` mode,
  creates `structured_reasoning` task-shell tasks, evaluates them through
  `TaskShellEngine`, and tracks self-check practice separately from score.
- `engines/reasoning-ui.js` renders the task shell in mode 5, keeps
  self-check out of persistent `goed` progress, and improves feedback for
  existing modes with chains, flow guides, selected-answer comparison, and
  match explanations.
- `engines/reasoning.css` scopes task-shell and feedback styling for the
  reasoning surface, including dark-mode readability.
- Focused tests under `engines/tests/` cover six-mode availability,
  task-shell self-check semantics, scored-progress separation, UI source
  safeguards, generated reasoning data, and task-shell behavior.

## Generated Lesson Output

Generated Book 1 output changed only through:

```bash
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Generated primary changes:

- `1.1.1 ... - redeneer-spel.html`, `1.1.2 ... - redeneer-spel.html`, and
  `1.1.3 ... - redeneer-spel.html` load shared task-shell assets.
- `shared/reasoning-engine.js`, `shared/reasoning-ui.js`, and
  `shared/reasoning.css` contain the runtime integration.

Generated full-deploy side effects from other automated shell builders and
landing pages are expected and were produced by the same platform deploy
command. They do not publish new target-equivalent checkpoints or product
claims.

## Sprint Evidence

Added REASON-UX-2 plan/baseline/planning review, structured-reasoning fixture,
student-route proof, screenshot manifest, specialist reviews, validator
scripts, screenshot PNGs, lead-review cycle records including the failed
recheck, result record, diff summary, and result metadata.

## Protected Surfaces

No protected reference data changed:

- no hand edits to `references/machine/`;
- no hand edits to `references/external/`;
- no writes to `references/authored/course-target-exercises.json`;
- no writes to `references/data/exam-ingestion/answer-skill-candidates.json`;
- no answer-skill candidate storage created;
- no candidate writes;
- no target-exercise `question_type` or `answer_form` fields;
- no unit minting, updates, splits, or deprecations.

No `source-data/book-*/exit-ticket/1.1.2.json` or
`source-data/book-*/exit-ticket/1.1.3.json` file was created or written.

## Product Authority

REASON-UX-2 authorizes no target-equivalent completion language, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Next Action

Proceed to `GAME-ARCH-1`. The graph, math, and reasoning practice routes now
all have live task-shell integration evidence, with nonblocking carried flags
for mobile feedback density and source-label polish.
