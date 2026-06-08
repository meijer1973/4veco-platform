# Dutch VO Inspection Evidence Model

Status: draft v0, pending INSPECT-1A correction review
Sprint: INSPECT-0 Source Register + Dutch Profile Design; INSPECT-1A Corrections-Only Source And Claim Hygiene
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

## Evidence State Vocabulary

Future report-only tooling should distinguish:

- `not_applicable`
- `missing`
- `implicit`
- `present`
- `present_but_weak`

This sprint does not create that tooling.

## Safe And Forbidden Claims

Safe:

```text
4veco is designed to expose product evidence relevant to Dutch VO inspection preparation.
4veco can help teachers and schools organise product-side evidence for curriculum coherence, subject-relevant basic-skills support, didactic design, assessment alignment, student support, accessibility, and product quality assurance.
4veco's Dutch evidence profile maps product evidence to inspection-relevant categories without claiming inspection approval, legal compliance, or complete school-level evidence.
```

Forbidden:

```text
4veco is compliant with Dutch inspection standards.
4veco is approved by the Dutch Inspectorate of Education.
4veco materials by themselves satisfy a school's inspection obligations.
4veco provides complete OP0/basic-skills evidence for a school or department.
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

Send the INSPECT-1A correction packet for human correction review. Do not start
INSPECT-2, a bounded pilot audit, report-only schema design, validators,
country overlays, generated lesson changes, quality-ref integration, dashboard
gates, or compliance claims from this draft alone.
