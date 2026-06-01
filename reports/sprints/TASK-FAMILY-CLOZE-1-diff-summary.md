# Sprint TASK-FAMILY-CLOZE-1: Diff Summary

Generated: 2026-06-01

## Scope

Runtime-only implementation of `cloze_text` in the shared task shell, with
focused tests, proof artifacts, lead-review records, and roadmap closure.

## Runtime changes

- `engines/task-shell-engine.js`
  - declares `cloze_text`;
  - validates inline text/blank segments and typed blank metadata;
  - validates exact expected blank coverage;
  - supports accepted values, bounded `requiredTextGroups`, and `rejectText`;
  - rejects raw blank maps and extra response keys;
  - adds cloze-text focus selectors.
- `engines/task-shell-ui.js`
  - renders inline typed cloze blanks;
  - exports `collectClozeTextResponse`;
  - keeps one feedback region.
- `engines/task-shell.css`
  - styles typed cloze lines, visually hidden labels, and responsive blank
    inputs.
- `engines/exit-ticket-ui.js`, `engines/skilltree-ui.js`,
  `engines/graphical-ui.js`
  - collect `cloze_text` responses through the shared helper.

## Test and proof changes

- Focused Jest tests now cover `cloze_text` validation, matching, rendering,
  wrapper collection, and source-level safeguards.
- `build-scripts/sprints/check-task-family-cloze1.js` proves the sprint
  contract and boundary flags.
- `reports/json/task-family-cloze1-proof.json` records runtime support and no
  product-authority flags.
- `reports/sprints/TASK-FAMILY-CLOZE-1-rendered-fixture.html` gives static
  report-fixture proof.

## Sprint governance changes

- Added plan, baseline, planning-review, lead-review assignment, round 1,
  correction log, round 2, result, diff summary, and plan/result metadata.
- Lead review closed PASS WITH FLAGS with no blockers.

## Roadmap/index changes

- Platform roadmap moves from `v3.47-formula-builder-runtime` to
  `v3.48-cloze-text-runtime`.
- Previous platform roadmap is archived at
  `docs/roadmaps/outdated/reference-team-roadmap-v3.47-formula-builder-runtime.md`.
- Lesson roadmap mirrors the closure.
- Roadmap version index, repository maps, URL index, and dashboard artifacts
  are refreshed during closure.

## Protected surfaces

No protected reference data changed. The sprint did not edit
`references/machine/` or `references/external/`.

No source exit-ticket data, generated Book 1 lesson output, target-exercise
registry fields, candidate storage, PV projection, PV machine promotion, Scale
Gate 1, or product-authority artifacts changed.

## Residual risk

The remaining risk is adoption risk, not runtime-contract risk. Static fixture
proof does not replace generated-route desktop/mobile/dark screenshot review.
`cloze_text` must not be used for target-equivalent or Scale Gate reliance
until later rendered-output review.
