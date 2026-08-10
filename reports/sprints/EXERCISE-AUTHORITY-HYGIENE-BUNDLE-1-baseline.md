# Sprint EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1: Baseline

Generated: 2026-07-01

## Plan reference

Plan: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`

## Repository state

Baseline head: `adf85b13706fe93889935c4b3c5204b3a24752d2`

Branch: `codex/exercise-authority-hygiene-bundle-1-20260701`

Expected pre-implementation changes at baseline:

- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`
- `references/data/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1.plan.json`
- `references/reference-team-roadmap.md`

## Exemplar authority baseline

Two `1.1.3-exit-ticket` exemplar packages exist:

- `references/exemplars/1.1.3-exit-ticket/`
- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`

Current UI policy and registry references point to
`references/exemplars/1.1.3-exit-ticket/` as the active operational exemplar.
The product-excellence copy is retained historical review material.

The two packages differ in five files:

- `candidate-data.json`
- `implementation-handoff.md`
- `policy-extract.md`
- `reviews/lead-synthesis.md`
- `reviews/teacher-learning-quality-review.md`

The following files are byte-identical across the two package roots:

- `prototype.html`
- `package-readme.md`
- `quality-brief.md`
- `README.md`
- `reviews/accessibility-review.md`
- `reviews/student-experience-review.md`
- `reviews/testing-regression-review.md`
- `reviews/visual-interaction-review.md`

## Golden fixture baseline

The duplicated Golden fixture files are byte-identical between
`reports/fixtures/golden-ticket-layout/` and `build-scripts/sprints/fixtures/`:

| Path | Bytes | SHA-256 |
|---|---:|---|
| `reports/fixtures/golden-ticket-layout/golden-ticket-reference.html` | 2338 | `D7DA108BF0018FE706D3A55CA3A4FC1839FFC638AF8774CA2F481C62E0C1837F` |
| `build-scripts/sprints/fixtures/golden-ticket-reference.html` | 2338 | `D7DA108BF0018FE706D3A55CA3A4FC1839FFC638AF8774CA2F481C62E0C1837F` |
| `reports/fixtures/golden-ticket-layout/hybrid-frankenstein-exit-ticket.html` | 1407 | `990DEE56F7BED10FE98C549ACF970A30C16077170A8B791D14B6CB88D461B1B9` |
| `build-scripts/sprints/fixtures/hybrid-frankenstein-exit-ticket.html` | 1407 | `990DEE56F7BED10FE98C549ACF970A30C16077170A8B791D14B6CB88D461B1B9` |
| `reports/fixtures/golden-ticket-layout/legacy-exit-ticket.html` | 919 | `A98BCC1FAAB7C676B02E1E2755A4061B1E0422091C4604889E79A5BE71D3ED9B` |
| `build-scripts/sprints/fixtures/legacy-exit-ticket.html` | 919 | `A98BCC1FAAB7C676B02E1E2755A4061B1E0422091C4604889E79A5BE71D3ED9B` |

`build-scripts/sprints/fixtures/golden-ticket-layout-boundary-negative.html`
has no matching report snapshot counterpart and is an active negative checker
fixture candidate.

## ZIP baseline

`knowledge/exit-ticket-game-1.1.1.zip` is tracked in Git at baseline.

ZIP SHA-256:
`E791BCC5FC3302140265F9F80BFD276E883DAFE9F96ACEDCAEDFEAE840523DF9`

ZIP size: `54420` bytes.

The existing note `knowledge/exit-ticket-game-1.1.1-note.md` already says this
archive is tracked knowledge/reference material only and authorizes no product
or student use.

## Data integrity notes

No source-data, engine/runtime, generated lesson output, protected reference
data, target-exercise registry, candidate storage, product-route, completion
language, diagnostics, mastery/sequencing, PV, Scale Gate 1, broad product use,
or student/product-use changes were present at baseline.

Protected reference data under `references/machine/` and `references/external/`
is unchanged. The lesson repository at `../4veco-lessen` is clean/read-only at
baseline.
