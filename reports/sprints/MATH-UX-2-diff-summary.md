# Sprint MATH-UX-2: Diff Summary

Generated: 2026-05-31

## Summary

The diff integrates the GAME-UX-3A shared task shell into the live generated
Book 1 `1.1.2` math/calculation route.

The scoped skilltree math game now renders `A38` and `A39` calculation steps
through task-shell controls for numeric input, calculation/work capture,
final-answer entry, and percentage/index notation.

## Platform Source Changes

- `build-scripts/platform/build-skilltree-shells.js` now loads
  `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js` in generated
  skilltree shells.
- `engines/skilltree-engine.js` evaluates task-shell steps through
  `TaskShellEngine.evaluateTask`.
- `engines/skilltree-ui.js` renders task-shell steps through
  `TaskShellUI.renderTask`, collects responses, announces feedback, and
  advances only after a matched/self-check result.
- `engines/skilltree.css` scopes embedded task-shell styling so the task shell
  is unframed inside the existing exercise surface.
- `engines/skilltree/generators.js` maps `A38` and `A39` generator steps to
  shared task-shell families.
- Focused tests under `engines/tests/` cover task-shell validation, skilltree
  engine behavior, generated task families, and skilltree UI safeguards.

## Generated Lesson Output

Generated Book 1 output changed only through:

```bash
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Generated primary changes:

- `1.1.2 Percentages en indexcijfers - wiskundevaardigheden.html` loads shared
  task-shell assets.
- `shared/skilltree/base-elements.js` includes deployed `A38`/`A39` task-shell
  generator steps.
- `shared/skilltree-engine.js`, `shared/skilltree-ui.js`, and
  `shared/skilltree.css` contain the runtime integration.

Generated shell-template side effects:

- `1.1.1 ... - wiskundevaardigheden.html`
- `1.1.3 ... - wiskundevaardigheden.html`

Those shell changes are expected because the shared skilltree shell template
loads task-shell assets for all skilltree pages. They do not publish new Check
routes or target-equivalent product claims.

## Sprint Evidence

Added MATH-UX-2 plan/baseline/planning review, route proof, checkpoint
calculation fixture proof, screenshot manifest, specialist reviews, validator
scripts, screenshot PNGs, lead-review cycle records, result record, diff
summary, and result metadata.

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

No `source-data/book-*/exit-ticket/1.1.2.json` file was created or written.

## Product Authority

MATH-UX-2 authorizes no target-equivalent completion language, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Next Action

Proceed to `REASON-UX-2`. Lead-review round 2 closed `MATH-UX-2` as
PASS WITH FLAGS with no remaining blocker after roadmap cleanup and final
metadata validation.
