# INSPECT-7 Sprint Plan

Status: planned, pending planning review
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising record: `archive/sprints/INSPECT-7/INSPECT-7-authorisation.md`

## Purpose

INSPECT-7 creates one bounded report-only evidence-pack prototype for Dutch
quality-standards evidence. The prototype tests whether the INSPECT-6 source
contract and teacher-facing shape can organise real product/review evidence for
Book 1 Chapter 1.1 without overclaiming.

INSPECT-7 is not a production generator sprint. It must not create a reusable
inspection-pack product surface, package script, CI gate, dashboard gate,
quality-ref integration, Scale Gate integration, lesson-output mutation,
personal-data processing path, or compliance/approval claim.

## Bounded Scope

```text
Book 1 - Grondslagen, vraag en aanbod
Chapter 1.1 - Economisch denken en rekenen
Paragraphs:
- 1.1.1 Schaarste en economisch denken
- 1.1.2 Percentages en indexcijfers
- 1.1.3 Grafieken en tabellen
```

The live lesson title for `1.1.2` is `Percentages en indexcijfers`. If any
prior review text says `Ruilen en rekenen`, the prototype must flag that as a
title-source mismatch and must not audit the wrong paragraph.

## Allowed Outputs

```text
archive/sprints/INSPECT-7/INSPECT-7-authorisation.md
archive/sprints/INSPECT-7/INSPECT-7-sprint-plan.md
archive/sprints/INSPECT-7/INSPECT-7-planning-review.md
archive/sprints/INSPECT-7/INSPECT-7-correction-log.md
archive/sprints/INSPECT-7/INSPECT-7-validation-log.md
archive/sprints/INSPECT-7/INSPECT-7-lead-review-assignment.md
archive/sprints/INSPECT-7/INSPECT-7-lead-review-round1.md
archive/sprints/INSPECT-7/INSPECT-7-lead-review-round2.md
archive/sprints/INSPECT-7/INSPECT-7-external-review-results.md
archive/sprints/INSPECT-7/INSPECT-7-closure-log.md
archive/sprints/INSPECT-7/build-inspect-7-prototype.js
references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
references/data/inspection-standards/nl-vo-evidence-profile.v0.json metadata update
generated indexes/reports when roadmap or report URLs require refresh
```

The archive-local prototype assembler is allowed only if it is bounded to the
one INSPECT-7 source object and the two INSPECT-7 output files. It must reject
or avoid generic CLI input and must not be added to `package.json`.

## Forbidden Paths And Work

```text
package.json
build-scripts/inspection/build-inspection-pack.js
reports/inspection-standards/*.md outside the named INSPECT-7 report
reports/inspection-standards/*.json outside the named INSPECT-7 report
quality-ref integration
dashboard integration
Scale Gate integration
CI/build integration
country overlay
generated lesson-output mutation
../4veco-lessen edits
personal-data processing
```

Forbidden claims:

```text
legal compliance claim
AVG/GDPR compliance claim
inspectorate approval claim
inspection-ready claim
certification claim
complete OP0/basic-skills claim
school-obligation-satisfied claim
PTA validity claim
summative assessment validity claim
classroom implementation claim
school SKA compliance claim
```

## Procedure

1. Confirm the branch, clean worktree, and INSPECT-6 closure commit.
2. Create this sprint plan and send it to planning review before
   implementation.
3. Inspect only read-only evidence paths for the bounded scope:
   - `archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md`;
   - `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`;
   - `references/data/inspection-standards/source-register.json`;
   - `references/authored/course-target-exercises.json`;
   - `reports/review-gates/GATE-PV-G4-lesson-regression/proof-intake.json`;
   - `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md`;
   - `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md`;
   - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/`.
4. Create the source object using the INSPECT-6 source contract:
   `docs/inspection-standards/evidence-pack-source-contract.md`.
5. Include all eight category records:
   - `curriculum_offer`;
   - `basic_skills`;
   - `didactic_quality`;
   - `student_development_and_support`;
   - `assessment_and_closure`;
   - `accessibility_and_inclusion`;
   - `quality_assurance`;
   - `improvement_cycle`.
6. Make weak/missing evidence visible in category records and in the teacher
   first screen.
7. Add only approved claim IDs:
   - `QS_PRODUCT_EVIDENCE_SUPPORT`;
   - `QS_TEACHER_ORGANISATION_SUPPORT`;
   - `QS_OP0_SUBJECT_MATERIAL_ONLY`;
   - `QS_AUTHORITY_BOUNDARY`;
   - `QS_WEAK_EVIDENCE_VISIBLE`.
8. If an archive-local assembler is used, keep it deterministic and bounded to
   the single source object and the two named output files.
9. Validate:
   - JSON parse source and output;
   - required top-level source fields exist;
   - all eight categories exist;
   - every claim has evidence citations;
   - every category has product/school boundary fields;
   - OP0 boundary fields exist for `basic_skills`;
   - privacy boundary says `personal_data_present: false`;
   - known forbidden phrases and paraphrase families are absent from positive
     claims;
   - Markdown starts with the teacher-facing first screen.
10. Refresh generated maps/reports if roadmap, sprint, or report URL surfaces
    change.
11. Record validation and clean worktree safety.
12. Commit and push the prototype packet.
13. Run lead-review round 1. If blockers are found, correct, validate, push,
    and run round 2.
14. Send the pushed packet to teacher, legal/privacy, and Dutch
    quality-inspection reviewers.
15. If any reviewer returns `REVISE` or `PASS`, implement corrections, record
    them in the correction log, validate, lead-review, push, and re-review.
16. Close INSPECT-7 only after all three reviewers return
    `MORE_THAN_SATISFIED`.

## Acceptance Criteria

- INSPECT-7 has a reviewed sprint plan before implementation.
- The source object follows the INSPECT-6 contract and parses as JSON.
- The Markdown and JSON packs are generated from the source object or otherwise
  demonstrably match it.
- The pack opens with a 5-10 minute teacher/school-leader first screen.
- All eight category records are present.
- Every category separates `4veco evidence`, `school evidence still needed`,
  weak/missing evidence, and forbidden inference.
- OP0 remains subject-material economics evidence only.
- Product evidence remains separate from school-owned implementation,
  support/care, PTA/summative policy, governance, and inspection judgement.
- No personal data appears in source or outputs.
- No forbidden claims appear in positive wording.
- No package script, CI gate, dashboard, quality-ref integration, Scale Gate
  integration, country overlay, lesson-output mutation, or lesson-repo edit is
  introduced.
- Lead reviewer returns no blockers.
- Teacher, legal/privacy, and Dutch quality-inspection reviewers each return
  `MORE_THAN_SATISFIED`.

## Stop Conditions

Stop and record the blocker if:

- planning review returns `REVISE`;
- a source object cannot cite concrete product/review evidence;
- personal data is needed or appears;
- teacher-readable output requires overclaiming;
- OP0 or SKA boundaries blur into school-owned proof;
- the prototype needs a package script, CI gate, dashboard, quality-ref
  integration, Scale Gate integration, or lesson-output mutation;
- external review returns `REVISE` or `PASS`.

## Required Next Action

Have a planning/review agent check this INSPECT-7 plan before implementation.
After planning review passes, create the bounded source object, prototype
assembler if needed, and report-only Markdown/JSON packs; then validate,
lead-review, push, and send the packet to the three external reviewers.
