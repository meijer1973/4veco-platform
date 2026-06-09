# Teacher-Facing Evidence Pack Template

Status: INSPECT-5R template for review, not a generated evidence pack
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`

## Purpose

This template defines what a future teacher-facing evidence pack must look like
before INSPECT-6 plans a report-only generator and before INSPECT-7 prototypes
one bounded pack.

It is designed for a Dutch vwo economics teacher or school leader to read in
5-10 minutes. It must show what 4veco evidence exists, what is weak or missing,
what the school still owns, and which claims are forbidden.

This file is not generated output and does not authorise an evidence-pack
prototype.

## First Screen Shape

Every future pack starts with:

```text
Scope
Safe-use note
Evidence summary
Weak/missing evidence
School-owned evidence still needed
Recommended next action
```

Safe-use note:

```text
This pack organises 4veco product-side evidence for a bounded scope. It is not
an Inspectie oordeel, approval, compliance certificate, PTA validation,
summative assessment judgement, OP0 completion claim, or proof of classroom
implementation. The school owns the full curriculum, implementation, support,
assessment, governance, and inspection conversation.
```

## Dutch Terms For Teachers

| Dutch term | Plain meaning in this pack | 4veco evidence can show | School evidence still needed | Forbidden inference |
|---|---|---|---|---|
| OP1 Aanbod | What learning offer and progression are visible. | Chapter/paragraph plans, target exercises, generated artifacts, source-output traces. | Full curriculum plan, scheduling, implementation, local policy choices. | A migrated target exercise is final-reviewed curriculum evidence. |
| OP0 Basisvaardigheden | Dutch language, mathematics/arithmetic, and citizenship as school/department basic skills. | Subject-material economics evidence for calculation, graph/table/source interpretation, and answer reasoning. | Deliberate school-wide choices and classroom practice for Dutch language, mathematics/arithmetic, and citizenship. | 4veco provides complete OP0 or school-wide basic-skills proof. |
| OP3 Pedagogisch-didactisch handelen | Didactic quality and student route through explanation, examples, practice, and feedback. | Product design, worked examples, practice routes, dual-coding evidence, review records. | Actual teacher practice, adaptation, classroom interaction, and lesson execution. | Product design proves classroom implementation. |
| OP2 Zicht op ontwikkeling en begeleiding | How learning development and support are monitored and acted on. | Prerequisite checks, advisory checks, remediation/enrichment routes, route panels. | Student monitoring, support decisions, accommodations, care plans, interventions. | A product check proves school support evidence. |
| OP6 Afsluiting | Closure and assessment alignment. | Target exercises, answer models, local reviewed target-equivalent proof where present. | PTA, grading, promotion/transition decisions, formal assessment policy, summative judgement. | Target-exercise presence proves closure or PTA validity. |
| SKA | School-level quality assurance and improvement cycle. | Product QA records, sprint logs, validation logs, correction loops, lead reviews. | School governance, self-evaluation, improvement planning, board accountability, inspection dialogue. | Product QA records prove school SKA compliance. |

## Required Boundary Table

Every category in a future pack must include this shape:

| Category | 4veco evidence | School evidence still needed | Weak or missing evidence | Forbidden inference |
|---|---|---|---|---|
| `curriculum_offer` | Concrete product/review paths. | Curriculum plan and implementation. | Target finality or coverage gaps. | Do not infer final-reviewed curriculum from migrated target records. |
| `basic_skills` | Subject-material calculation, reasoning, graph/table/source evidence. | School-wide Dutch language, mathematics/arithmetic, citizenship curriculum and practice. | No complete OP0 proof. | Do not say 4veco provides OP0 evidence. |
| `didactic_quality` | Paragraph plans, reviews, worked examples, practice routes. | Teacher enactment and classroom adaptation. | PASS WITH FLAGS remains flagged. | Do not claim classroom implementation. |
| `student_development_and_support` | Checks, route panels, support routes. | Monitoring, interventions, accommodations. | Uneven check coverage. | Do not treat checks as school support records. |
| `assessment_and_closure` | Target exercises, answer models, reviewed local target-equivalent proof. | PTA, grading, summative policy. | Target-equivalent proof may be local or missing. | Do not claim PTA or summative validity. |
| `accessibility_and_inclusion` | Alt text, layout, theme/mobile, semantic review where present. | Individual accommodations and device access. | No full accessibility audit unless reviewed. | Do not claim full accessibility compliance. |
| `quality_assurance` | Quality-ref, sprint logs, validators, lead reviews. | School governance and self-evaluation. | Generated reports are diagnostic. | Do not claim school SKA compliance. |
| `improvement_cycle` | Correction logs, rechecks, carried flags, next actions. | School improvement cycle. | Product cycle only. | Do not present product improvement as school self-evaluation. |

## Calibration Example: Book 1 Chapter 1.1

This example uses existing audit findings to calibrate the future pack shape.
It is not a generated INSPECT-7 evidence pack.

Scope:

```text
Book 1 - Grondslagen, vraag en aanbod
Chapter 1.1 - Economisch denken en rekenen
Paragraphs 1.1.1, 1.1.2, and 1.1.3
```

Evidence summary:

| Category | Example state | Teacher-readable summary |
|---|---|---|
| `curriculum_offer` | `present_but_weak` | Paragraph sequence and target exercises exist, but target exercises are migrated records needing v5 review. |
| `basic_skills` | `present` when bounded | Calculation, graph/table reading, and economics answer reasoning are visible as subject-material evidence only. |
| `didactic_quality` | `present` | Paragraph plans, Part A reviews, companion reviews, worked examples, and routes show strong product design evidence. |
| `student_development_and_support` | `present_but_weak` | Practice and check routes exist unevenly; school monitoring/support decisions are not product evidence. |
| `assessment_and_closure` | `present_but_weak` | Target exercises and answer models exist; reviewed local target-equivalent proof is limited. |
| `accessibility_and_inclusion` | `present_but_weak` | Review records show useful accessibility evidence, but not a complete accessibility audit. |
| `quality_assurance` | `present` | Product QA records, validation, lead reviews, and correction loops are strong product evidence. |
| `improvement_cycle` | `present` | The product improvement cycle is visible, but it does not replace school self-evaluation. |

Example evidence citations:

```text
archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
references/authored/course-target-exercises.json
reports/review-gates/GATE-PV-G4-lesson-regression/proof-intake.json
reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md
reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/
```

Weak or missing evidence:

- complete OP0/basic-skills evidence;
- school implementation evidence;
- school student-monitoring, support, accommodations, and intervention records;
- PTA, grading, summative, or transition-decision evidence;
- school SKA/self-evaluation evidence;
- final-reviewed v5 target-exercise status for all three pilot paragraphs;
- target-equivalent proof beyond reviewed local cases;
- full accessibility compliance proof.

Safe wording example:

```text
For this bounded scope, 4veco exposes product-side evidence for curriculum
offer, subject-material basic-skills support, didactic design, local checks,
assessment alignment, accessibility review records, and product QA. Weak and
missing evidence remains visible. The pack does not claim inspection approval,
legal compliance, OP0 completion, PTA validity, summative validity, classroom
implementation, or school SKA compliance.
```

## Review Prompts

Teacher reviewer:

```text
Can a Dutch vwo economics teacher or school leader understand in 5-10 minutes
what evidence exists, what is weak, what the school must still supply, and what
action is recommended?
```

Legal/privacy reviewer:

```text
Does the pack avoid personal data by default and avoid legal, compliance,
approval, certification, inspection-ready, PTA, summative, and
school-obligation claims?
```

Dutch quality-inspection reviewer:

```text
Are OP1, OP0, OP3, OP2, OP6, and SKA boundaries used accurately, especially
the difference between product-side evidence and school-owned evidence?
```

## Required Next Action

Use this template in the INSPECT-5R review packet. Do not generate an evidence
pack until INSPECT-6 passes tri-agent `MORE_THAN_SATISFIED` review and the
repository owner explicitly authorises INSPECT-7.
