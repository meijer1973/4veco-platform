# Dutch VO Inspection Evidence Model

Status: draft v0, adjusted for schema-design preparation after INSPECT-2A; INSPECT-4 report-only validator design authorised; not final, compliant, or inspection-ready
Sprint: INSPECT-0 Source Register + Dutch Profile Design; INSPECT-1A Corrections-Only Source And Claim Hygiene; INSPECT-2 Bounded Pilot Evidence Audit; INSPECT-2A Profile Adjustment Before Schema Design; INSPECT-3 Report-Only Schema Design; INSPECT-4 Report-Only Validator Design
Profile: `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
Source register: `references/data/inspection-standards/source-register.json`

## Purpose

This document explains how 4veco can expose Dutch VO inspection-relevant
evidence without claiming legal compliance or inspection approval.

The model is evidence-supporting. It helps a school, teacher, or reviewer
organise product-side evidence for curriculum coherence, subject-relevant
basic-skills support, didactic design, assessment alignment, student support,
accessibility, and product quality assurance.

It does not say that 4veco is compliant with inspection standards. It also does
not replace school-owned evidence about implementation, classroom practice,
support decisions, school quality policy, or formal assessment.

## Authority Basis

The Dutch inspection source basis for this draft is:

- `nl-inspectie-onderzoekskader-vo-2025`
- `nl-inspectie-op0-basisvaardigheden-2025`
- `nl-inspectie-bijgestelde-onderzoekskaders-2025`

These are inspection sources. They are not economics curriculum sources and must
not be used to create MTUs, target exercises, procedures, or learning goals.

The Dutch curriculum and assessment source basis for this draft is:

- `nl-examenblad-economie-vwo-2026-subject-page`
- `nl-examenblad-economie-vwo-havo-examenprogramma`
- `nl-cvte-economie-vwo-syllabus-2026`
- `nl-examenblad-economie-vwo-2026-cse-1-opgaven`
- `nl-examenblad-economie-vwo-2026-cse-1-correctievoorschrift`

These are curriculum/assessment sources. They are not inspection sources and
must not be used to claim inspection approval, legal compliance, or complete
school-level evidence.

## Product Boundary

4veco can expose product evidence. The school must still supply school evidence.

| Evidence type | 4veco can expose | School owns |
|---|---|---|
| Curriculum coherence | Target-exercise sequence, MTU dependencies, module/chapter/paragraph progression | Whole-school curriculum planning and implementation |
| Basic skills | Economics language reasoning, calculation, graph/table/source reading, relevant citizenship contexts | Deliberate curriculum choices across Dutch language, mathematics/arithmetic, and citizenship |
| Didactic quality | Explanation, worked examples, practice route, dual-coded visuals, checks | Actual classroom teaching, adaptation, lesson execution |
| Student support | Prerequisite checks, advisory short checks, remediation and enrichment routes | Student monitoring, care/support decisions, intervention records |
| Assessment alignment | Target exercises, exit tickets, answer models, correction-model decomposition where available | Formal assessment policy, grading, PTA and school closure decisions |
| Accessibility | Alt text, readable layout, keyboard/focus proof, contrast/mobile proof where available | Individual accommodations and access arrangements |
| Quality assurance | Review logs, validators, generated reports, proof artifacts, correction logs | School self-evaluation and inspection conversation |

## INSPECT-2A Profile Adjustment

Head of Strategy accepted INSPECT-2 as
`pass_with_required_profile_adjustment`. The pilot proved that the Dutch v0
categories can locate real Book 1 Chapter 1.1 evidence, but it also showed that
the profile needed sharper evidence-finality language before any schema design.

INSPECT-2A therefore adjusts the profile language only. It does not create
schemas, validators, generated evidence packs, dashboard gates, quality-ref
integration, Scale Gate integration, country overlays, generated lesson-output
changes, legal compliance claims, inspectorate approval claims, or complete
OP0/basic-skills claims.

Required distinctions added by INSPECT-2A:

- `artifact_present`
- `reviewed_artifact_quality`
- `pass_with_flags`
- `target_exercise_migrated`
- `target_exercise_reviewed`
- `target_equivalent_reviewed`
- `diagnostic_report_only`
- `school_owned_implementation`

Every future pilot or report must also include a title/source reconciliation
note. The live blueprint title is the source of truth. If human review text,
the target registry, chapter plan, or lesson folder disagree, the mismatch is a
traceability issue and must be recorded explicitly.

## INSPECT-3 Report-Only Schema Design

Head of Strategy accepted INSPECT-2A as `pass` and authorised
`INSPECT-3 Report-Only Schema Design`.

INSPECT-3 may create:

- `references/schemas/inspection-evidence.schema.json`
- `docs/inspection-standards/report-only-schema-design.md`
- `references/data/inspection-standards/schema-notes.md`
- `archive/sprints/INSPECT-3/`

Required wording:

```text
This schema is report-only and diagnostic. It does not create a quality gate, compliance claim, or generated-output mutation path.
```

INSPECT-3 may design schema fields and pilot evidence-object examples. It must
not create build-failing validators, generated evidence packs, teacher
inspection packs, dashboard gates, quality-ref integration, Scale Gate
integration, country overlays, generated lesson-output changes, legal
compliance claims, inspectorate approval claims, or complete OP0/basic-skills
claims.

## INSPECT-4 Report-Only Validator Design

Head of Strategy accepted INSPECT-3 as `pass_with_minor_guardrails` and
authorised `INSPECT-4 Report-Only Validator Design`.

INSPECT-4 may create:

- `build-scripts/inspection/validate-inspection-evidence.js`
- `docs/inspection-standards/report-only-validator-design.md`
- `references/data/inspection-standards/validator-notes.md`
- `archive/sprints/INSPECT-4/`
- a sample report-only evidence object, if needed

The validator remains manual, diagnostic, and non-blocking. It may parse an
inspection-evidence JSON object, check report-only policy constants, check
required category boundary fields, check target-equivalent and OP0 fields, and
emit warnings for weak evidence.

Minor guardrails carried into INSPECT-4:

- forbidden-claim checks are known-phrase checks, not complete semantic
  claim-safety detection;
- pilot mode does not require all eight categories; only explicit full-report
  mode may do that;
- weak evidence can be valid evidence and must not become a schema failure.

INSPECT-4 must not create build-failing validator integration, required CI
gates, generated evidence packs, teacher inspection packs, dashboard gates,
quality-ref integration, Scale Gate integration, country overlays, generated
lesson-output changes, legal compliance claims, inspectorate approval claims,
or complete OP0/basic-skills claims.

## Evidence Categories

### Curriculum Offer

Evidence target:

- official exam/curriculum coverage;
- paragraph target exercises;
- chapter and module progression;
- MTU and operation dependencies;
- source-output trace for generated materials.

Current source paths:

- `references/external/syllabus-eindtermen.json`
- `references/external/exam-questions.json`
- `references/authored/course-target-exercises.json`
- `references/data/alignment-graph.json`
- `../4veco-lessen/course_blueprint_v5.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

Initial state: `implicit`.

INSPECT-2A adjustment:

- distinguish curriculum artifact presence from target-exercise presence;
- distinguish migrated target exercises from v5-reviewed target exercises;
- distinguish exam-code linked evidence from unlinked evidence;
- distinguish generated lesson artifact presence from reviewed lesson artifact
  quality;
- do not infer final-reviewed curriculum evidence from a migrated target
  exercise.

### Basic Skills

Evidence target:

- language and economic reasoning;
- calculation and arithmetic fluency;
- graph/table/source interpretation;
- citizenship and economic participation contexts where relevant.

Current source paths:

- `references/machine/micro-teaching-units.json`
- `references/authored/skill-categories.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- generated and reviewed paragraph evidence in `../4veco-lessen/`.

Initial state: `implicit`.

Important caution: OP0 evidence must not be reduced to "economics has
calculations". The profile needs to show whether deliberate choices are visible
in the material and, later, whether those choices are visible in classroom
practice. 4veco can support that evidence; the school owns the final
implementation evidence.

INSPECT-2A adjustment: use the label
`subject_material_basic_skills_evidence`. Safe wording is:

```text
4veco exposes subject-material evidence relevant to OP0 basic-skills preparation.
```

Do not use:

```text
4veco provides OP0 evidence.
```

This evidence is not complete OP0 evidence, not school-wide basic-skills
evidence, and not citizenship curriculum proof.

### Didactic Quality

Evidence target:

- explanation;
- worked examples;
- guided practice;
- independent practice;
- dual-coded visuals;
- consistent procedures;
- student-visible route from Start to Check.

Current source paths:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- generated paragraph evidence in `../4veco-lessen/`.

Initial state: `implicit`.

INSPECT-2A adjustment: preserve review-outcome semantics. A `PASS WITH FLAGS`
is useful evidence, but it is not an unconditional final pass. Future report or
schema design must not flatten `PASS`, `PASS WITH FLAGS`, `REVISE`, and `FAIL`
into a simple true/false field.

### Student Development And Support

Evidence target:

- prerequisite checks;
- advisory short checks;
- remediation routes;
- differentiated practice;
- extension/enrichment.

Initial state: `implicit`.

Boundary: 4veco may provide local, non-binding next-step advice. It must not
claim diagnostics, mastery, summative status, automatic sequencing, or student
classification unless a later explicit gate authorises that claim.

INSPECT-2A adjustment: separate advisory support evidence, practice/remediation
route evidence, target-equivalent closure evidence, and school-owned
monitoring/support evidence. Do not count every check as closure proof.

### Assessment And Closure

Evidence target:

- target exercises;
- target-equivalent exit tickets;
- answer models;
- rubrics or correction guidance;
- official correction-model decomposition where available.

Initial state: `implicit`.

Boundary: target-equivalent proof remains local and non-summative. Official
school assessment, grading, and examination policy are outside this product
evidence model.

INSPECT-2A adjustment: add target-equivalent proof status before schema design.

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

Target exercise presence is not the same as target-equivalent closure proof.
Answer-model presence is not the same as reviewed exit-ticket proof. Local
reviewed proof is not the same as generalised semantic scoring proof.

### Accessibility And Inclusion

Evidence target:

- readable layout;
- alt text;
- keyboard/focus behaviour;
- contrast;
- mobile usability;
- inclusive student-facing language.

Initial state: `implicit`.

Boundary: product accessibility evidence supports access, but individual
accommodations remain school-owned.

INSPECT-2A adjustment: split accessibility evidence into sub-evidence labels.

```text
alt_text
contrast_theme
mobile_layout
keyboard_focus
semantic_structure
inclusive_student_language
internal_code_exposure_absent
```

Screenshot QA may support route-local evidence, but it is not full
accessibility proof.

### Quality Assurance

Evidence target:

- review records;
- quality-ref YAML;
- validators;
- generated reports;
- proof artifacts;
- closure logs;
- pass-with-flags semantics.

Initial state: `present_but_weak`.

Boundary: generated reports are diagnostic projections, not primary evidence.

INSPECT-2A adjustment: generated reports remain diagnostic unless they cite
source or review artifacts. Future records should distinguish:

```text
primary_source_artifact
review_record
diagnostic_report
generated_dashboard_projection
```

### Improvement Cycle

Evidence target:

- issue logs;
- correction logs;
- review rechecks;
- known flags;
- recommended next actions;
- human-review packets before policy gates.

Initial state: `present_but_weak`.

Boundary: a 4veco issue/review cycle can support but cannot replace the
school's own quality cycle.

INSPECT-2A adjustment: product improvement evidence may support school
preparation, but it does not replace school self-evaluation, school quality
assurance, or inspection dialogue.

## Evidence State Vocabulary

Future report-only tooling should distinguish:

- `not_applicable`
- `missing`
- `implicit`
- `present`
- `present_but_weak`

INSPECT-2A adds evidence-finality vocabulary that future report-only schema
work must preserve:

- `artifact_present`
- `reviewed_artifact_quality`
- `pass_with_flags`
- `target_exercise_migrated`
- `target_exercise_reviewed`
- `target_equivalent_reviewed`
- `diagnostic_report_only`
- `school_owned_implementation`

This sprint does not create that tooling.

## Required Product/School Boundary Per Category

Every category must state:

```text
4veco evidence:
school-owned evidence:
forbidden inference:
```

The profile now carries this boundary per category. Future reporting must keep
these fields visible rather than burying them in prose.

## Safe And Forbidden Claims

Safe:

```text
4veco is designed to expose product evidence relevant to Dutch VO inspection preparation.
4veco can help teachers and schools organise product-side evidence for curriculum coherence, subject-relevant basic-skills support, didactic design, assessment alignment, student support, accessibility, and product quality assurance.
4veco's Dutch evidence profile maps product evidence to inspection-relevant categories without claiming inspection approval, legal compliance, or complete school-level evidence.
4veco exposes subject_material_basic_skills_evidence relevant to OP0 basic-skills preparation without claiming complete OP0, school-wide basic-skills, or citizenship-curriculum proof.
```

Forbidden:

```text
4veco is compliant with Dutch inspection standards.
4veco is approved by the Dutch Inspectorate of Education.
4veco materials by themselves satisfy a school's inspection obligations.
4veco provides complete OP0/basic-skills evidence for a school or department.
4veco provides OP0 evidence.
4veco provides school-wide basic-skills evidence.
4veco proves citizenship curriculum implementation.
A migrated target exercise is final-reviewed curriculum evidence.
Target-exercise presence proves target-equivalent closure.
Screenshot QA proves full accessibility compliance.
```

## Open Questions For Human Review

1. Should OP0 evidence be reported at paragraph level, chapter level, module
   level, or all three?
2. Should citizenship/economic participation contexts be explicit in every
   paragraph or only where genuinely relevant?
3. Should future schema work keep inspection evidence separate from
   `quality-ref.yaml` until a pilot audit proves stability?
4. Which evidence should be teacher-facing in the first generated inspection
   pack, and which should remain internal reviewer evidence?

## Recommended Next Step

Review the INSPECT-4 report-only validator design packet. Do not integrate the
validator into CI, builds, dashboards, quality-ref, Scale Gate, generated lesson
output, evidence-pack generation, teacher inspection packs, country overlays,
or compliance claims from this draft alone.
