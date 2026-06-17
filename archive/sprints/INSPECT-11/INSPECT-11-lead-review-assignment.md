# INSPECT-11 Lead Review Assignment

Status: assigned
Date: 2026-06-17
Sprint: `INSPECT-11`

## Product End-State And Original Spec

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original roadmap spec: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Controlling gate input: `archive/sprints/INSPECT-11/INSPECT-11-authorisation-note.md`
- Sprint plan: `archive/sprints/INSPECT-11/INSPECT-11-sprint-plan.md`

## Review Scope

Review INSPECT-11 as an internal diagnostic scope readiness audit only.

The lead review must decide whether the audit:

- correctly reconciles PR #90 with the older roadmap INSPECT-11 evidence-pack
  row;
- compares Chapter 1.1, Chapter 1.2, Chapter 1.3, and Chapter 1.4/1.5 using
  existing evidence only;
- keeps every blocker visible with `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- recommends only a next planning/remediation step;
- avoids generating or authorising any new diagnostic report, evidence pack,
  teacher/school-facing output, public/external output, dashboard gate,
  quality-ref integration, Scale Gate integration, product-route adoption,
  diagnostics/mastery/PV, student-use, product-use, generated lesson-output
  mutation, protected-reference mutation, personal-data processing, or
  compliance/approval claim.

## Non-Negotiable Requirements

- Use REV-STD-1.
- PASS WITH FLAGS may not carry a missing core requirement.
- Missing candidate blocker fields are a core failure.
- Any recommendation that implies report generation is a core failure.
- Any hidden or softened Chapter 1.2 blocker is a core failure.
- Any teacher/school-facing, public/external, product-use, Scale Gate,
  product-route, diagnostics/mastery/PV, or student-use authority is a core
  failure.

## Evidence To Inspect

- `archive/sprints/INSPECT-11/INSPECT-11-authorisation-note.md`
- `archive/sprints/INSPECT-11/INSPECT-11-sprint-plan.md`
- `archive/sprints/INSPECT-11/INSPECT-11-planning-review.md`
- `reports/inspection-standards/internal-diagnostic-scope-readiness.md`
- `reports/inspection-standards/internal-diagnostic-scope-readiness.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`

## Required Verdict Shape

Return `PASS`, `REVISE`, `FAIL`, or `PAUSE`.

If any issue is carried, classify it with:

```text
blocks
does_not_block
proof_required_to_close
```

PASS WITH FLAGS may not carry a missing core requirement.
