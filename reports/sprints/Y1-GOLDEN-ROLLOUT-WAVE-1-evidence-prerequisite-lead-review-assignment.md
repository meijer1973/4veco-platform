# Y1-GOLDEN-ROLLOUT-WAVE-1 Evidence Prerequisite Lead Review Assignment

Assigned: 2026-08-27

Reviewer: `/root/residual_bridge_lead_review`

Repository: `meijer1973/4veco-platform`

Draft PR: #216

Round-1 reviewed commit:
`8dcbb36726a3861c31928b5f500f5f75a2ebd9ac`

## Classification

Roadmap/review-gate evidence and a JavaScript report checker. This is an L4
product-authority/evidence prerequisite; it changes no student-facing bytes
beyond importing a previously reviewed screenshot as evidence.

## Review scope

- Original Y1 plan and the authorized prerequisite plan.
- Main-based source-provenance/current-lineage separation.
- Exact per-artifact Git object and SHA-256 manifest.
- One changed `opgaven.html` dependency and zero unresolved drift.
- Exact screenshot equality, decoded zero-pixel result, selector/capture
  settings, first-viewport limitation, and independent visual review.
- Exact 14-key all-false renewal authority object.
- Changed-path and evidence-tail fail-closed behavior.
- Focused positive/negative test coverage and the planned P/H commit topology.

## Current test evidence

- `node --check` passes for checker and tests.
- Canonical sprint-plan checker passes.
- 57 focused Jest tests pass; one full-mode test is deliberately deferred until
  the proof/packet are regenerated against the corrected substantive payload
  `P`. The full 58-test result is required before round-2 closure.
- Diff hygiene and JSON parsing pass.

## Required verdict

Return `REVISE`, `FAIL`, or `PASS WITH FLAGS` using the repository lead-review
format. A round-1 PASS does not authorize closure: substantive corrections must
be frozen as `P`, all proof must be rebound, round 2 must inspect exact `P`, and
exact-head CI/readiness must pass before human review.
