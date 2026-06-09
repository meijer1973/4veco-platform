# Evidence Pack Source Contract

Status: INSPECT-6 planning-only contract
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`

## Purpose

This contract defines the structured source object a future report-only
generator should consume.

It is a planning document only. It does not create a generator and does not
create an evidence pack.

## Contract Principles

1. Every claim must cite concrete product or review evidence.
2. Planning documents cannot be the sole proof for product claims.
3. Weak evidence is valid only when visible.
4. Every category must preserve product/school boundaries.
5. OP0 evidence is subject-material economics evidence only.
6. Personal data is forbidden by default.
7. Source freshness and stale evidence must be explicit.
8. Reports are diagnostic and report-only.

## Required Top-Level Fields

```text
schema_version
contract_usage
pack_scope
official_source_anchors
profile
category_records
claim_records
privacy_boundary
validation_policy
review_policy
next_action
```

`contract_usage` must be:

```text
report_only_generator_planning
```

## Pack Scope

Required fields:

```text
scope_id
scope_label
book
chapter
paragraphs
repository_context
source_commit
lesson_repository_status
```

Candidate INSPECT-7 scope:

```text
book: Boek 1 - Grondslagen, vraag en aanbod
chapter: 1.1 Hoofdstuk Economisch denken en rekenen
paragraphs:
- 1.1.1 Schaarste en economisch denken
- 1.1.2 Percentages en indexcijfers
- 1.1.3 Grafieken en tabellen
```

## Official Source Anchors

The source object must cite official-source boundary anchors:

| Anchor | Required use |
|---|---|
| `nl-inspectie-onderzoekskader-vo-2025` | Dutch VO inspection standard structure and OP/SKA framing. |
| `nl-inspectie-op0-basisvaardigheden-2025` | OP0 boundary; subject-material evidence only. |
| `nl-inspectie-bijgestelde-onderzoekskaders-2025` | 2025 framework freshness/change-control note. |
| `nl-ap-avg-verantwoordingsplicht` | Privacy/accountability boundary for no-personal-data default. |
| `nl-ap-dpia` | Later DPIA/data-processing gate if personal data is ever proposed. |

The AP anchors are planning references for privacy guardrails and must not be
misread as proof of legal compliance.

## Allowed Source Types

| Source type | Example | Strength |
|---|---|---|
| `official_source` | Inspectie/CvTE/Examenblad source register IDs | strongest source authority for the relevant domain |
| `reviewed_target_exercise` | v5-reviewed target exercise record | strong curriculum/assessment evidence |
| `migrated_target_exercise` | migrated target exercise needing v5 review | weak/non-final evidence |
| `generated_lesson_artifact` | paragraph/opgaven/antwoorden/HTML/PDF paths | product artifact evidence |
| `quality_ref` | paragraph quality-ref YAML | product QA evidence |
| `review_record` | Part A, companion, lead-review, review-gate packets | review evidence |
| `validation_log` | validator/test command evidence | product QA evidence |
| `diagnostic_report` | report-only summaries citing source/review evidence | diagnostic evidence |
| `planning_record` | roadmap/sprint plan | context only, not product proof |

Forbidden source types:

```text
student_personal_data
student_answers
grades
attendance
support_or_care_records
accommodation_records
classroom photos/audio/video
uncited prose summary
planning-only proof for product claim
```

## Category Record Fields

Every category record must include:

```text
category_id
dutch_inspection_anchor
teacher_label
evidence_state
evidence_strength
evidence_finality
4veco_evidence
school_evidence_still_needed
weak_or_missing_evidence
forbidden_inference
evidence_citations
claim_ids
review_flags
owner_next_action
```

For `basic_skills`, require:

```text
subject_material_basic_skills_evidence
op0_boundary_note
not_complete_op0
not_school_wide_basic_skills
not_citizenship_curriculum_proof
```

For `assessment_and_closure`, require:

```text
target_exercise_finality
target_equivalent_proof_status
answer_model_status
not_pta_validity
not_summative_validity
```

For `quality_assurance` and `improvement_cycle`, require:

```text
product_qa_evidence
not_school_ska_compliance
not_school_self_evaluation
```

## Evidence Finality Values

Allowed values:

```text
artifact_present
reviewed_artifact_quality
pass_with_flags
target_exercise_migrated
target_exercise_reviewed
target_equivalent_reviewed
diagnostic_report_only
school_owned_implementation
not_applicable
missing
```

`pass_with_flags` must remain visible and may not be flattened into an
unconditional pass.

## Target-Equivalent Proof Values

Allowed values:

```text
target_exercise_present
target_exercise_migrated_needs_review
target_exercise_v5_reviewed
answer_model_present
target_equivalent_not_started
target_equivalent_advisory_only
target_equivalent_candidate
target_equivalent_reviewed_local
target_equivalent_reviewed_generalised
```

The contract must not infer target-equivalent proof from target-exercise or
answer-model presence alone.

## Claim Record Fields

Every claim record must include:

```text
claim_id
exact_wording
category_id
evidence_citations
evidence_strength
product_school_boundary
forbidden_inference_check
semantic_overclaiming_check
review_round
```

Allowed claim IDs:

```text
QS_PRODUCT_EVIDENCE_SUPPORT
QS_TEACHER_ORGANISATION_SUPPORT
QS_OP0_SUBJECT_MATERIAL_ONLY
QS_AUTHORITY_BOUNDARY
QS_WEAK_EVIDENCE_VISIBLE
```

## Privacy Boundary

Required fields:

```text
personal_data_present: false
personal_data_scan_note
redaction_required: false
privacy_gate_required_if_personal_data: true
```

If `personal_data_present` would be true, the future generator must stop and
produce no pack.

## Teacher-Utility Fields

The source object must carry enough information for a 5-10 minute first screen:

```text
scope_summary
safe_use_note
category_summary
top_weak_or_missing_evidence
school_evidence_still_needed_summary
recommended_next_action
```

## Required Next Action

Use this source contract in the INSPECT-6 review packet. Do not convert it into
generator code until INSPECT-7 is explicitly authorised.
