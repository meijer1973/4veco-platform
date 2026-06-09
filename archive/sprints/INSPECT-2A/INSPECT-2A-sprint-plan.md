# INSPECT-2A Sprint Plan

Status: closed
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising review: `archive/sprints/INSPECT-2A/INSPECT-2A-human-authorization.md`

## Purpose

INSPECT-2A adjusts the Dutch v0 evidence profile before schema design. The goal
is to prevent future schemas or reports from flattening weak evidence into
stronger claims.

This is corrections-only profile-language work. It is not schema design,
validator work, evidence-pack generation, quality-ref integration, dashboard
integration, Scale Gate integration, country-overlay work, or generated lesson
output work.

## Quality Floor

The sprint is acceptable only if it:

- keeps the Dutch profile `status` as `draft`;
- uses only a cautious review status;
- adds evidence-finality language;
- adds target-equivalent proof distinctions;
- adds `subject_material_basic_skills_evidence` wording;
- adds title/source reconciliation language;
- keeps diagnostic reports diagnostic unless they cite source/review artifacts;
- records product evidence, school-owned evidence, and forbidden inference per
  category;
- avoids compliance, inspectorate approval, inspection-ready, complete OP0,
  school-wide basic-skills, and citizenship-curriculum proof claims.

## Allowed Files

```text
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
docs/inspection-standards/nl-vo-evidence-model.md
references/data/inspection-standards/README.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
archive/sprints/INSPECT-2A/
reports/url-index.md and generated indexes if required
```

## Forbidden Work

Do not modify generated lesson artifacts in `4veco-lessen`.

Do not modify:

```text
references/machine/
references/external/
quality-ref.yaml
schemas
validators
dashboard gates
Scale Gate integrations
country overlays
generated lesson output
```

Do not introduce legal compliance, inspectorate approval, inspection-ready,
complete OP0, school-wide basic-skills, or citizenship-curriculum proof claims.

## Operational Procedure

1. Record Head of Strategy decision as INSPECT-2 PASS WITH REQUIRED PROFILE
   ADJUSTMENT.
2. Create INSPECT-2A plan and planning review.
3. Update the Dutch evidence profile and evidence model with required
   finality/boundary language.
4. Update the data README, roadmap, and sprint ledger.
5. Create a correction packet summarising exact changes.
6. Refresh indexes when URL surfaces change.
7. Run focused profile checks, repository-map checks, URL index checks,
   worktree safety checks, and full platform validation.
8. Run lead-review round 1, log corrections or no-correction decision, and run
   lead-review round 2.
9. Close, commit, push, and report the operational next step.

## Acceptance Criteria

- Dutch profile remains `status: draft`.
- `review_status` is cautious and not `accepted`, `final`, `compliant`,
  `inspection_ready`, or `approved`.
- No schema or validator is added.
- No generated lesson material is changed.
- Evidence-finality language is added.
- Target-equivalent proof distinction is added.
- Subject-material OP0 language is added.
- Title/source reconciliation language is added.
- Diagnostic-report boundary is added.
- Product/school boundary is preserved per category.
- Full platform validation passes.
- Lead review confirms no forbidden implementation occurred.

## Stop Conditions

Stop and report if:

- a required distinction cannot be added without schema design;
- a profile adjustment would require generated lesson-output mutation;
- a compliance or school-owned evidence claim is necessary to satisfy the
  request;
- validation fails and cannot be repaired inside the approved scope;
- branch/worktree safety fails.

## Required Next Action

Run the INSPECT-2A correction pass and return a correction packet plus
validation log for human review. Do not start schema design.
