# Planning Review: TASK-FAMILY-FORMULA-1

Generated: 2026-06-01

Reviewer: planning/review subagent `019e842c-958f-7980-b789-eb2cf1f3e08f`

Verdict: conditional PASS for implementation after plan, baseline, plan JSON,
and this planning-review record are logged.

## Evidence inspected

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-result.md`
- `build-scripts/sprints/check-task-family-cloze-tile1.js`
- `build-scripts/sprints/check-task-family-sentence1.js`
- current shared task-shell engine, UI, wrapper, CSS, and focused tests

## Review findings

`formula_builder` may proceed as a runtime-only shared task-shell
implementation if it stays within the plan boundaries.

Required quality floor:

- deterministic formula construction from token/block bank;
- exact response shape `{ tokens: [...] }`;
- mandatory `acceptedSequences`;
- strict token-id sequence matching;
- category metadata for formula roles;
- accessible rendered construction zone and token bank;
- wrapper response collection for exit-ticket, skilltree, and graph surfaces;
- focused tests, custom checker, fixture proof, and lead review before
  closure;
- no generated lesson output, source exercise adoption, target-equivalent
  reliance, diagnostics, mastery, sequencing, PV, Scale Gate 1, or product use.

## Formula-specific decision

Formula tokens should require category metadata. The category is validation and
proof metadata, not the matcher. Matching must remain exact reviewed token-id
sequence matching through `acceptedSequences`.

Allowed category set for this sprint:

- `numerator`
- `denominator`
- `operator`
- `grouping`
- `value`
- `variable`
- `multiplier`
- `notation`

Multiple accepted sequences are allowed only when formula equivalence is
explicitly reviewed in the fixture/task data. Symbolic or algebraic equivalence
is out of scope.

## Stop conditions

Stop if:

- raw arrays match as student responses;
- category-only matching replaces exact token-id sequence matching;
- symbolic/algebraic equivalence is attempted without a reviewed evaluator;
- wrapper integration requires bespoke feedback or state;
- formula layout is unusable on mobile or dark-mode surfaces;
- generated lesson output or product-route adoption enters scope.

## Required tests

The implementation must run at minimum:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-FORMULA-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-formula1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
```

Then final result/bundle/index checks and diff checks before commit and push.
