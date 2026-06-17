# INSPECT-10C Lead Review Assignment

Status: assigned
Date: 2026-06-16
Sprint: `INSPECT-10C`

## Product End-State And Original Spec

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec: `archive/sprints/INSPECT-10C/INSPECT-10C-sprint-plan.md`
- Prior gate input: PR #79 human review verdict and merged INSPECT-10B packet

## Review Charge

Perform REV-STD-1 lead review for the INSPECT-10C diagnostic generator
review/stability-hardening sprint.

## Non-Negotiable Requirements

- Do not reinterpret INSPECT-10C as evidence-pack, teacher/school-facing,
  public/external, package/CI, dashboard, quality-ref, Scale Gate,
  product-route, diagnostics/mastery/PV, student/product-use, personal-data,
  protected-reference, or generated lesson-output authority.
- Verify the stability checker is manual only.
- Verify generated Markdown/JSON alignment, source-hash stability, blocker
  visibility, refusal coverage, and boundary flags.
- PASS WITH FLAGS may not carry a missing core requirement.

## Review Checklist

| Review area | Evidence to inspect | Required outcome |
|---|---|---|
| Product end-state and sprint spec | Roadmap/end-state plus INSPECT-10C sprint plan | Cited and bounded |
| Manual checker scope | `check-dutch-diagnostic-report-stability.js` | No package/CI hook or downstream integration |
| Report output vocabulary | Generated Markdown/JSON | Internal-only, no stale pre-merge owner action |
| Markdown/JSON alignment | Output files, targets, blockers, refusal policy | Aligned |
| Source hashes | Generated `source_files_used` | Recomputed and stable |
| Refusal coverage | Stability checker cases | Expected stop codes |
| Carried blockers | Generated blockers and validation log | Visible and classified |

## Required Output

Lead review must classify findings and include `blocks`, `does_not_block`, and
`proof_required_to_close` for carried issues.
