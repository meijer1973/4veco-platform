# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Result

Generated: 2026-07-03

Status: completed pending human review.

## Plan reference

Plan: `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`

Baseline: `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md`

## Summary

Completed a bounded first-three Golden workflow availability wave. The sprint
adds a machine-readable wave manifest and CI-visible checker that codify the
current rollout as exactly six first-three Golden check surfaces: advisory short
checks and exit tickets for `1.1.1`, `1.1.2`, and `1.1.3`.

The checker verifies source/generated currentness, Golden Workbench layout,
resolved skill-map route hrefs, the refreshed Scale Proof 3P rendered
product-path packet, neutral `1.1.4` same-copy hygiene, and false downstream
authority flags. It also fails if source data, engine behavior, protected
reference data, or generated Book 1 lesson output changes inside this sprint.

No generated lesson output changed. No source check data changed. The sprint
does not close Scale Gate 1 or authorize product-route adoption, diagnostics,
mastery/sequencing, PV, summative use, broad product use, student/product use,
or target-equivalent completion language.

## Acceptance test results

The sprint command log records successful acceptance commands in
`reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl`.

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md` | passed |
| `npm.cmd run check:y1-golden-rollout-wave-1` | passed |
| `npm.cmd run check:exercise-workflow-currentness` | passed |
| `npm.cmd run check:exercise-authority-hygiene` | passed |
| `npm.cmd run check:scale-proof-3p-product-path` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `npm.cmd run check:scope-language` | passed |
| `npm.cmd run check:platform` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md` | passed |
| `node build-scripts/sprints/check-lead-review-substance.js Y1-GOLDEN-ROLLOUT-WAVE-1` | passed |
| `node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

The full platform Jest suite passed with the repository's existing chapter QA
stderr warnings for fixture content; the process exit code was `0`.

Remote CI repair note: the first PR run showed that this clean-checkout guard
must run before presentation-v2 validation mutates the sibling lesson checkout.
The CI step was moved up beside exercise currentness and authority hygiene,
before presentation build/QA steps. The checker logic was not relaxed.

## Changed files

Implementation and wiring:

- `references/data/exercises/y1-golden-rollout-wave-1.json`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `package.json`
- `.github/workflows/platform-ci.yml`

Roadmap and sprint evidence:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan-review-round1.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.md`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json`

Review packet and proof:

- `reports/json/y1-golden-rollout-wave-1-proof.json`
- `reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`

Lead review:

- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-assignment.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-round1.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-corrections.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-round2.md`

## Data integrity notes

No protected reference data changed. The focused checker and diff hygiene cover
`references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and candidate-storage
surfaces.

No `source-data/book-1/exit-ticket/*.json` files changed. No engine runtime
files changed. No generated Book 1 lesson output changed; lesson diff hygiene
passed in `../4veco-lessen`.

## Open follow-ups

- Run a separate human/owner Scale Gate 1 decision if the project wants to close
  Scale Gate 1 from the existing first-three product-path packet.
- Use a separate reviewed source-authoring sprint before creating `1.1.4` or
  chapter `1.2` check/exit source surfaces.
- Keep product-route adoption, diagnostics, mastery/sequencing, PV, summative
  use, broad product use, student/product use, and target-equivalent completion
  language held until explicitly authorized.

## Rollback instructions

Before merge, abandon this branch or revert the branch commit. After merge,
revert the PR. No source-data restoration, generated-output regeneration,
engine rollback, or target-registry restoration should be required because the
sprint only changes validation, roadmap, and proof/reporting artifacts.
