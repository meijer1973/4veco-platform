# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Baseline

## Plan reference

Plan: `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`

## Current state

The platform source tree has six current split Golden check surfaces for Book 1
chapter 1.1: advisory short checks and exit tickets for `1.1.1`, `1.1.2`, and
`1.1.3`. The exercise-surface manifest marks those six as
`first_three_product_proof`.

`1.1.4` is present only as same-copy hygiene in the currentness manifest. No
platform check/exit source files exist for `1.1.4` or chapter `1.2`.

`SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1` records rendered first-three
product-path proof and routes the next gate action to human Scale Gate 1 review,
while keeping Scale Gate 1 and student/product use unauthorized.

## Data integrity notes

No protected reference data has been changed for the baseline. The sprint must
not edit `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, source check data, generated
lesson output, engines, or candidate storage.

## Baseline command state

The platform and lesson worktrees were clean before the implementation branch
was created. The lesson repo remains a read-only evidence dependency for this
sprint.
