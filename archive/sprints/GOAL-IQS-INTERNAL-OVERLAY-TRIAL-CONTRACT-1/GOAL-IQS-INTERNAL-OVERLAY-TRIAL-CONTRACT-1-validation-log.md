# GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1 Validation Log

Status: local validation passed after schema correction
Date: 2026-06-25

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1-sprint-plan.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

## Non-Negotiable Requirements

- Internal-only, manual, no-output contract packet.
- Complete England and Flanders contracts for Book 1 Chapters 1.2 and 1.3 using all deep-crosswalk rows.
- Explicit input and output allowlists only.
- Strict nested schema with checker-enforced source, row, no-output, blocker, review, and decision boundaries.
- No localized textbook paragraphs, exercises, answer models, student-facing files, teacher/school-facing output, public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, legal/compliance/approval/accreditation/inspection-readiness claims, or support/accommodation sufficiency claims.
- REV-STD-1 review records must classify findings and include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.

## Validation Commands

| Command | Result | Notes |
| --- | --- | --- |
| `node -c build-scripts/inspection/build-internal-overlay-trial-contract.js` | PASS | Syntax check. |
| `node -c build-scripts/inspection/check-internal-overlay-trial-contract.js` | PASS | Syntax check. |
| `node build-scripts/inspection/build-internal-overlay-trial-contract.js --check` | PASS | Generated output is current. |
| `node build-scripts/inspection/check-internal-overlay-trial-contract.js` | PASS | `contracts=2 rows=20 negative_fixtures=14 decision=PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION`. |
| `npx.cmd jest build-scripts/inspection/check-internal-overlay-trial-contract.test.js --runInBand` | PASS | 1 suite, 3 tests, including explicit strict-schema assertions. |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS | 152 entries. |
| `npm.cmd run check:active-governance-wording` | PASS | Active governance wording check passed. |
| `npm.cmd run check:scope-language` | PASS | Active surfaces passed. |
| `npm.cmd run check:platform` | PASS | 69 suites passed, 16 skipped, 964 tests passed. Existing fixture warnings were non-failing. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Contract generator, checker, generated reports, fixtures, roadmap/index updates, and focused tests pass local validation. | `core_requirement_met` | Nothing for local validation. | Specialist/final lead review and PR readiness. | Exact-head CI, branch-protection checker output with `ok: true`, PR Readiness Reviewer result, and human review. |
| Full platform test suite required `npm ci` in this fresh worktree before `npm.cmd run check:platform` could use local `jest` and `jsdom`. | `carry_forward` | No source change; no branch blocker after dependencies were installed and platform tests passed. | PR publication and CI, because CI installs dependencies independently. | Preserve full CI proof on the exact remote head. |
