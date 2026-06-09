# Report-Only Inspection Evidence Schema Design

Status: report-only diagnostic design
Sprint: INSPECT-3 Report-Only Schema Design
Schema: `references/schemas/inspection-evidence.schema.json`
Profile basis: `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`

## Purpose

INSPECT-3 creates the first inspection-evidence schema as a diagnostic report
contract. It is deliberately non-blocking.

Required wording:

```text
This schema is report-only and diagnostic. It does not create a quality gate, compliance claim, or generated-output mutation path.
```

The schema can shape future evidence reports, but it must not fail builds,
block paragraph production, integrate into Scale Gate, mutate generated lesson
output, or claim legal compliance.

## Scope

The schema is designed against the accepted pilot scope:

```text
Book 1 Chapter 1.1
1.1.1 Schaarste en economisch denken
1.1.2 Percentages en indexcijfers
1.1.3 Grafieken en tabellen
```

The live blueprint title must be cited in future reports. If human review text,
target registry, chapter plan, or lesson folder titles disagree, the report
must include a title/source reconciliation note.

## Core Dimensions

Evidence state and evidence finality are separate dimensions.

Evidence state:

```text
not_applicable
missing
implicit
present
present_but_weak
```

Evidence finality:

```text
artifact_present
reviewed_artifact_quality
pass_with_flags
target_exercise_migrated
target_exercise_reviewed
target_equivalent_reviewed
diagnostic_report_only
school_owned_implementation
```

Target-equivalent proof status:

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

Source pointer types:

```text
primary_source_artifact
review_record
quality_ref
diagnostic_report
generated_dashboard_projection
external_authority_source
```

## Mandatory Product/School Boundary

Every category record must carry:

```text
4veco_evidence
school_owned_evidence
forbidden_inference
```

This is the main guard against converting product evidence into school-level
inspection claims.

## Category Outcomes

The schema preserves the INSPECT-2A category outcomes:

```text
curriculum_offer: accepted_as_present_but_weak
basic_skills: accepted_as_present_when_bounded
didactic_quality: accepted_as_present
student_development_and_support: accepted_as_present_but_weak
assessment_and_closure: accepted_as_present_but_weak
accessibility_and_inclusion: accepted_as_present_but_weak
quality_assurance: accepted_as_present
improvement_cycle: accepted_as_present
```

The weak categories are not upgraded by schema design.

## OP0 Boundary

Basic-skills records must use:

```text
subject_material_basic_skills_evidence
```

They must also carry the negative boundary:

```text
not complete OP0 evidence
not school-wide basic-skills evidence
not citizenship curriculum proof
```

## Report Behaviour

A future report should not simply state:

```text
didactic_quality: present
```

It should cite concrete source or review paths and state the finality level of
the evidence. Generated reports may guide reviewers, but they remain diagnostic
unless they cite source or review artifacts.

## Not Authorised

INSPECT-3 does not authorise:

```text
validators that fail builds
generated evidence packs
teacher inspection packs
dashboard gates
quality-ref integration
Scale Gate integration
country overlays
generated lesson-output changes
legal compliance claims
inspectorate approval claims
complete OP0/basic-skills claims
```

## Recommended Next Step

Send the INSPECT-3 schema design packet for human review. Do not implement a
validator, generated evidence pack, dashboard gate, quality-ref integration, or
Scale Gate integration until a later human review explicitly authorises it.
