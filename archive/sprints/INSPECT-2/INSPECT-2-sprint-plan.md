# INSPECT-2 Sprint Plan

Status: closed
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising review: `archive/sprints/INSPECT-1A/INSPECT-1A-human-correction-review.md`

## Purpose

INSPECT-2 runs the bounded pilot evidence audit approved by the Head of
Strategy after INSPECT-1A.

The purpose is to test whether the Dutch v0 evidence categories can locate
usable evidence in real 4veco material before schema design hardens the model.

## Quality Floor

The audit is acceptable only if it:

- uses a small stabilised read-only scope;
- cites real source, lesson, review, quality-ref, and report artifacts;
- classifies each Dutch v0 category as strong, implicit, missing, or weak for
  the pilot scope;
- records where product evidence ends and school evidence begins;
- identifies profile adjustments needed before schema design;
- avoids schemas, validators, generated evidence packs, country overlays,
  dashboard gates, quality-ref integration, Scale Gate integration, generated
  lesson-output changes, legal compliance claims, inspectorate approval claims,
  and complete OP0/basic-skills claims.

## Pilot Scope

Read-only evidence audit of Book 1 Chapter 1.1:

- `1.1.1 Schaarste en economisch denken`
- `1.1.2 Percentages en indexcijfers`
- `1.1.3 Grafieken en tabellen`

Note: the human review text named `1.1.2 Ruilen en rekenen`, but the live
course blueprint, target-exercise registry, and lesson folder name use
`1.1.2 Percentages en indexcijfers`. This sprint audits the live source of
truth and records the title mismatch as a scope note.

## Evidence Inputs

Platform:

- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `references/data/inspection-standards/source-register.json`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- relevant sprint/report records under `reports/sprints/`

Lesson repo, read-only:

- `../4veco-lessen/course_blueprint_v5.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/`
- `_chapter-plan.md`
- paragraph markdown and answer/opgaven markdown where present;
- `_paragraph-plan.md`;
- `*-quality-ref.yaml`;
- `*-review.md`;
- `*-companion-visual-review.md`;
- generated HTML/PDF presence as file evidence only.

## Operational Procedure

1. Record INSPECT-1A human correction review as PASS.
2. Update source register and Dutch profile only to
   `draft_accepted_for_bounded_pilot_audit`.
3. Create INSPECT-2 plan and planning review before the audit report.
4. Inspect the live Chapter 1.1 evidence read-only.
5. Produce `INSPECT-2-bounded-pilot-evidence-audit.md`.
6. For each evidence category, record evidence strength, supporting files,
   weak/missing points, and school-boundary notes.
7. Decide whether the v0 profile needs adjustment before schema design.
8. Run validation and repository-map refresh.
9. Run lead-review round 1 and round 2.
10. Close, commit, push, and end with the next operational step.

## Acceptance Criteria

- INSPECT-1A PASS review is recorded.
- Source register and Dutch profile remain `status: draft`.
- `review_status` is `draft_accepted_for_bounded_pilot_audit`.
- INSPECT-2 audit report exists and covers all eight v0 categories.
- The audit distinguishes product evidence from school evidence.
- The audit names profile adjustments before schema design.
- Lesson repo is read-only; no generated output changes occur.
- Validation, lead review, and closure logs exist.
- Task branch is pushed; `main` is not touched.

## Stop Conditions

Stop and report if:

- the live lesson scope cannot be located;
- auditing would require lesson-output mutation;
- evidence cannot be assessed without schema/tooling work;
- validation fails and cannot be repaired within audit-only scope;
- the worktree or branch safety checks fail.

## Required Next Action

Run the bounded audit report. Do not create schemas, validators, generated
evidence packs, or lesson-output changes.
