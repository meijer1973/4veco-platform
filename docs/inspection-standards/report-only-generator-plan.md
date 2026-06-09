# Report-Only Generator Plan

Status: INSPECT-6 planning-only draft
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Sprint: `archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md`

## Purpose

This document plans a future report-only generator for Dutch quality-standards
evidence packs.

It does not implement a generator and does not generate an evidence pack.
INSPECT-6 is a planning-only gate. A future INSPECT-7 may prototype one
bounded pack only after this plan passes teacher, legal/privacy, and Dutch
quality-inspection `MORE_THAN_SATISFIED` review and the repository owner
explicitly authorises that prototype.

## Non-Goals

INSPECT-6 does not add:

```text
build-scripts/inspection/build-inspection-pack.js
generated evidence pack
teacher inspection pack generator
package.json script integration
CI or check:platform integration
dashboard gate
Scale Gate integration
quality-ref integration
country overlay
generated lesson-output mutation
student-level personal-data processing
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
```

## Future Generator Role

The future generator should read a structured evidence-source object and
produce report-only Markdown and JSON summaries for a bounded scope.

The generator may help teachers, school leaders, reviewers, and agents organise
evidence. It must not make inspection, legal, compliance, school-obligation,
PTA, summative, classroom-implementation, or school-SKA judgements.

## Candidate INSPECT-7 Scope

Candidate scope for the first prototype:

```text
Book 1 - Grondslagen, vraag en aanbod
Chapter 1.1 - Economisch denken en rekenen
Paragraphs:
- 1.1.1 Schaarste en economisch denken
- 1.1.2 Percentages en indexcijfers
- 1.1.3 Grafieken en tabellen
```

INSPECT-7 must confirm this exact scope before generation starts. If the scope
changes, the source contract and review packet must explain why.

## Planned Source Flow

```text
official sources
  -> source register IDs and freshness metadata
Dutch evidence profile
  -> category definitions, safe/forbidden claims, boundaries
product/review evidence
  -> concrete path citations and evidence-state records
source contract
  -> structured report-only input object
future generator
  -> report-only Markdown and JSON pack
manual validator/reviewer checks
  -> diagnostics, warnings, external review packet
```

The future generator must not infer a claim from folder presence alone. It must
use evidence records that include path citations, evidence state, evidence
finality, product/school boundary, and forbidden inference.

## Planned Output Shape

A future pack must begin with the teacher-facing first screen:

```text
Scope
Safe-use note
Evidence summary
Weak/missing evidence
School-owned evidence still needed
Recommended next action
```

A Dutch vwo economics teacher or school leader must be able to understand that
first screen in 5-10 minutes.

Every category section must include:

```text
Dutch inspection anchor
4veco evidence
School evidence still needed
Weak or missing evidence
Forbidden inference
Evidence citations
Claim IDs used
Reviewer flags
```

## Category Plan

| Category | Planned output requirement |
|---|---|
| `curriculum_offer` | Show target exercises, chapter/paragraph sequence, source-output traces, target finality, exam-code gaps, and school curriculum boundary. |
| `basic_skills` | Show subject-material economics calculation, graph/table/source interpretation, and answer-reasoning evidence only; keep complete OP0 and school-wide proof forbidden. |
| `didactic_quality` | Show paragraph plans, worked examples, practice routes, Part A reviews, companion reviews, and `PASS WITH FLAGS` status where present. |
| `student_development_and_support` | Separate advisory checks, practice routes, and support surfaces from school monitoring, interventions, accommodations, and care plans. |
| `assessment_and_closure` | Separate target exercises, answer models, and local reviewed target-equivalent proof from PTA, grading, summative validity, and closure proof. |
| `accessibility_and_inclusion` | Show reviewed alt/layout/theme/mobile/semantic evidence where present; do not claim full accessibility compliance. |
| `quality_assurance` | Show product QA records, validators, sprint logs, lead reviews, and correction loops; do not claim school SKA compliance. |
| `improvement_cycle` | Show product correction loops and next actions; do not replace school self-evaluation. |

## Evidence Citation Rules

Every generated claim must cite at least one concrete product or review
evidence path.

Allowed strong citations include:

- official source IDs in `references/data/inspection-standards/source-register.json`;
- Dutch profile category IDs in
  `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`;
- reviewed target-exercise records where review status supports the claim;
- generated lesson artifact paths in `../4veco-lessen/`;
- quality-ref YAML and review records;
- review-gate packets and proof logs;
- validation and closure logs.

Planning documents may be cited only to explain context, not as sole evidence
for a product claim.

## Safe Claim IDs

Future generated prose may use only approved claim IDs unless a later review
adds more:

| Claim ID | Required boundary |
|---|---|
| `QS_PRODUCT_EVIDENCE_SUPPORT` | Product-side support only, not school evidence or inspection judgement. |
| `QS_TEACHER_ORGANISATION_SUPPORT` | Helps organise evidence and gaps, not a school obligation replacement. |
| `QS_OP0_SUBJECT_MATERIAL_ONLY` | Subject-material basic-skills evidence only, not complete OP0. |
| `QS_AUTHORITY_BOUNDARY` | Competent authority and school/provider own final judgement. |
| `QS_WEAK_EVIDENCE_VISIBLE` | Weak and missing evidence remains visible. |

Every generated claim record must include:

```text
claim_id
exact_wording
category_id
evidence_citations
evidence_strength
product_school_boundary
forbidden_inference_check
review_round
```

## Semantic Overclaiming Review

Exact forbidden-phrase checks are not enough for generated prose.

Before INSPECT-7 can generate a prototype, the review packet must require a
semantic overclaiming check for paraphrases of:

```text
inspection approval
inspection-ready
certification
Dutch inspection compliance
legal compliance
AVG/GDPR compliance
complete OP0 or school-wide basic-skills proof
school-obligation satisfaction
PTA validity
summative validity
classroom implementation
school SKA compliance
```

## Stale Evidence Handling

The future source object must record:

```text
source_id
retrieved_date
freshness_status
last_reviewed_commit
evidence_path
evidence_path_status
stale_evidence_note
owner_next_action
```

The generator must surface stale or missing evidence in the teacher-facing
summary, not bury it in JSON.

## Privacy Boundary

The future generator must reject source records containing student-level
personal data by default.

Forbidden data includes names, identifiers, grades, answers, submissions,
attendance, support records, accommodations, care records, classroom photos,
audio, video, or other identifying material.

If personal data is encountered, the generated pack must not be produced. The
future workflow must record a redaction/privacy flag and stop until a later
privacy/DPIA/data-processing gate explicitly authorises a safe path.

## Validation Strategy

Future validation should be report-only and manual unless a later human gate
authorises stronger use:

1. parse source contract JSON;
2. verify required fields;
3. verify category coverage for the requested mode;
4. verify every claim has evidence citations;
5. verify every category has product/school boundary fields;
6. verify OP0 boundary fields;
7. verify no personal-data fields are present;
8. run known forbidden-phrase checks;
9. run semantic overclaiming review through external reviewers;
10. report weak or missing evidence as visible warnings, not hidden failures.

## INSPECT-7 Readiness

INSPECT-7 may be authorised only if INSPECT-6 closes with all three external
reviewers `MORE_THAN_SATISFIED`.

INSPECT-7 must start with:

- one bounded prototype source file;
- one generated Markdown pack;
- one generated JSON pack;
- no package script;
- no CI gate;
- no dashboard integration;
- no quality-ref integration;
- no lesson-output mutation;
- no personal data;
- no compliance or approval claims.

## Required Next Action

Use this plan with `docs/inspection-standards/evidence-pack-source-contract.md`
and `docs/inspection-standards/evidence-pack-validation-and-dispatch.md` in the
INSPECT-6 review packet. Do not implement the generator until INSPECT-7 is
explicitly authorised.
