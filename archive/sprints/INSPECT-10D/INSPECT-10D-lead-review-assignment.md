# INSPECT-10D Lead Review Assignment

Status: assigned
Date: 2026-06-17
Sprint: `INSPECT-10D`

## Review Scope

Review INSPECT-10D as an internal diagnostic tool acceptance and operating
procedure sprint only. The review must not evaluate or unlock evidence-pack,
teacher/school-facing, public/external, Scale Gate, product-route,
diagnostics/mastery/PV, student-use, or product-use authority.

## Product End-State And Original Spec

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec: `archive/sprints/INSPECT-10D/INSPECT-10D-sprint-plan.md`
- Prior gate input: PR #83 human review verdict and merged INSPECT-10C packet

## Non-Negotiable Requirements

- Use REV-STD-1.
- Cite product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried
  issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Keep generator code and generated report files unchanged.
- Keep the procedure internal-only and manual-only.
- Preserve all downstream blockers.

## Evidence To Inspect

- `archive/sprints/INSPECT-10D/INSPECT-10D-sprint-plan.md`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-validation-log.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-specialist-gate-results.md`
- `archive/sprints/INSPECT-10C/INSPECT-10C-closure-log.md`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `build-scripts/inspection/check-dutch-diagnostic-report-stability.js`

## Required Verdict Shape

The lead review must return PASS, REVISE, FAIL, or PAUSE. PASS WITH FLAGS is
allowed only if every carried flag is outside the INSPECT-10D core objective
and names what it blocks, what it does not block, and proof required to close.
