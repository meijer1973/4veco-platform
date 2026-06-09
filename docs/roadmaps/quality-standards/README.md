# Quality Standards Roadmaps

Status: active roadmap folder
Repository: `4veco-platform`
Updated on: 2026-06-09

## Purpose

This folder is the home for the quality-standards and inspection-legibility
roadmap track.

The track answers a narrow question:

> What evidence should 4veco expose so schools, teachers, reviewers, and future
> agents can see how the product supports curriculum quality, didactic quality,
> assessment alignment, accessibility, support, and internal quality assurance?

It does not claim that 4veco is approved by an inspectorate or that generated
materials alone satisfy a school's obligations.

## Files

- `inspection-standards-roadmap.md` - Dutch-only quality-control roadmap for
  inspection-relevant product evidence, evidence gaps, teacher/school-facing
  packets, and clean closure.
- `sprint-ledger.md` - active ledger for quality-standards sprint status,
  outputs, commits, and next authorisation points.
- `quality-standards-end-state.md` - first attempt at the intended mature
  state after the quality-standards layer is implemented.
- `../../inspection-standards/external-review-privacy-and-claim-guardrails.md`
  - mandatory review, privacy, and claim-safety guardrails before generator
  planning or evidence-pack prototyping.
- `../../inspection-standards/teacher-facing-evidence-pack-template.md` -
  teacher-facing output template for future bounded evidence packs.

## Related Source Data

- `references/data/inspection-standards/README.md`
- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `docs/inspection-standards/nl-vo-evidence-model.md`

Non-Dutch standards sources in `source-register.json`, if present, are
historical source inventory only. They are not active work in this roadmap and
must not be expanded into mappings, claims, reports, or implementation until a
separate non-Dutch worktree and roadmap are explicitly authorised.

## Boundaries

- 4veco remains exercise-first and exam-grounded.
- Inspection and quality standards may define evidence categories and reporting
  needs, but they do not mint economics content, target exercises, MTUs, or
  generated lesson output.
- Generated evidence packs may support school preparation, but final judgement
  remains with the school/provider and the competent authority.
- Compliance, approval, diagnostic, mastery, summative, and automatic
  sequencing claims require separate explicit human gates.
- Quality-standards work that prepares generator planning, evidence packs, or
  teacher/school-facing claims requires teacher, legal/privacy, and Dutch
  quality-inspection reviewers to each return `MORE_THAN_SATISFIED`.
- Evidence packs contain no student-level personal data by default.
- Non-Dutch quality-standards work is outside this roadmap.
