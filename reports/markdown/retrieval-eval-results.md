# Retrieval Evaluation Results

Generated on: 2026-05-01T10:59:03.335Z

## Summary

- Eval cases: 10
- Passed: 10
- Failed: 0
- Authority violations: 0

## Cases

| Query ID | Status | Results | Source types | Warnings | Missing |
|---|---:|---:|---|---|---|
| rag-eval-001 | pass | 12 | machine_unit, owned_content_edge, alignment_edge, machine_term | diagnostic_only, not_primary_evidence | - |
| rag-eval-002 | pass | 12 | exam_question, machine_unit, machine_term, owned_content_edge | diagnostic_only, not_primary_evidence | - |
| rag-eval-003 | pass | 12 | quality_report, owned_content_edge | diagnostic_only, generated_report_warning, not_primary_evidence | - |
| rag-eval-004 | pass | 12 | quality_report | diagnostic_only, generated_report_warning, not_primary_evidence | - |
| rag-eval-005 | pass | 12 | quality_report, target_exercise, owned_content_edge | diagnostic_only, generated_report_warning, not_primary_evidence | - |
| rag-eval-006 | pass | 12 | evidence_anchor, alignment_edge, quality_report, authored_reference, machine_term | diagnostic_only, generated_report_warning, not_primary_evidence | - |
| rag-eval-007 | pass | 12 | quality_report | diagnostic_only, generated_report_warning, not_primary_evidence | - |
| rag-eval-008 | pass | 12 | alignment_edge | diagnostic_only, generated_report_warning, not_primary_evidence, pending_review | - |
| rag-eval-009 | pass | 12 | alignment_edge | pending_review | - |
| rag-eval-010 | pass | 12 | quality_report | diagnostic_only, generated_report_warning, not_primary_evidence | - |

## Case Details

### rag-eval-001

Query: Welke units ondersteunen prijselasticiteit?

Status: pass

Notes: Checks that the retrieval layer finds the canonical price-elasticity unit and term rather than only generated reports.

Top results:

- machine-unit:A15 (machine_unit, machine_registry)
  - source: references/machine/micro-teaching-units.json
  - warnings: -
- machine-unit:A55 (machine_unit, machine_registry)
  - source: references/machine/micro-teaching-units.json
  - warnings: -
- machine-unit:D06 (machine_unit, machine_registry)
  - source: references/machine/micro-teaching-units.json
  - warnings: -
- machine-unit:D24 (machine_unit, machine_registry)
  - source: references/machine/micro-teaching-units.json
  - warnings: -
- machine-unit:D25 (machine_unit, machine_registry)
  - source: references/machine/micro-teaching-units.json
  - warnings: -

### rag-eval-002

Query: Welke examenvragen testen producentensurplus?

Status: pass

Notes: Checks whether exam evidence and the surplus unit/term surface for producer-surplus search.

Top results:

- exam-question:ha-1022-a-25-1-o-582 (exam_question, external_primary)
  - source: references/external/exam-questions.json
  - warnings: -
- exam-question:ha-1022-a-25-1-o-583 (exam_question, external_primary)
  - source: references/external/exam-questions.json
  - warnings: -
- exam-question:ha-1022-a-25-2-o-610 (exam_question, external_primary)
  - source: references/external/exam-questions.json
  - warnings: -
- exam-question:ha-1022-a-25-2-o-611 (exam_question, external_primary)
  - source: references/external/exam-questions.json
  - warnings: -
- exam-question:vw-1022-a-24-2-o-734 (exam_question, external_primary)
  - source: references/external/exam-questions.json
  - warnings: -

### rag-eval-003

Query: Welke live units missen term links?

Status: pass

Notes: This is a health-report question; generated reports may guide review but must remain non-authoritative.

Top results:

- quality-report:terms-coverage.json (quality_report, generated_report)
  - source: reports/json/terms-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:reference-quality-issues.json (quality_report, generated_report)
  - source: reports/json/reference-quality-issues.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:dead-units.json (quality_report, generated_report)
  - source: reports/json/dead-units.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- owned-content-edge:ocg-projected-unit-uses-term-unit-a06-term-evenwichtshoeveelheid-1.4.1-1.4.1-references-machine-micro-teaching-units.jso-288895008510 (owned_content_edge, diagnostic)
  - source: references/data/owned-content-graph.json
  - warnings: diagnostic_only, not_primary_evidence
- owned-content-edge:ocg-projected-unit-uses-term-unit-a06-term-evenwichtshoeveelheid-1.4.2-1.4.2-references-machine-micro-teaching-units.jso-b15d1e939339 (owned_content_edge, diagnostic)
  - source: references/data/owned-content-graph.json
  - warnings: diagnostic_only, not_primary_evidence

### rag-eval-004

Query: Welke units hebben lege needs maar zijn false_zero?

Status: pass

Notes: Checks that false_zero empty-needs status is visible as a generated diagnostic, not curriculum authority.

Top results:

- quality-report:empty-needs-audit-summary.json (quality_report, generated_report)
  - source: reports/json/empty-needs-audit-summary.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:needs-coverage.json (quality_report, generated_report)
  - source: reports/json/needs-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:dead-units.json (quality_report, generated_report)
  - source: reports/json/dead-units.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:reference-quality-issues.json (quality_report, generated_report)
  - source: reports/json/reference-quality-issues.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:aspects-coverage.json (quality_report, generated_report)
  - source: reports/json/aspects-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence

### rag-eval-005

Query: Welke target exercises hebben nog missing-unit flags?

Status: pass

Notes: Checks target-exercise missing-unit triage surfacing through diagnostic reports.

Top results:

- quality-report:blueprint-flag-triage.json (quality_report, generated_report)
  - source: reports/json/blueprint-flag-triage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- target-exercise:course-target-exercises (target_exercise, authored_judgement)
  - source: references/authored/course-target-exercises.json
  - warnings: -
- owned-content-edge:ocg-target-exercise-has-missing-unit-flag-target-exercise-1.1.3-quality-issue-1.1.3-missing-unit-1-1.1.3-1.1.3-flag-1-re-6f03d9080aa0 (owned_content_edge, authored_judgement)
  - source: references/data/owned-content-graph.json
  - warnings: not_primary_evidence
- owned-content-edge:ocg-target-exercise-has-missing-unit-flag-target-exercise-1.1.3-quality-issue-1.1.3-missing-unit-2-1.1.3-1.1.3-flag-2-re-903275bc5ef9 (owned_content_edge, authored_judgement)
  - source: references/data/owned-content-graph.json
  - warnings: not_primary_evidence
- owned-content-edge:ocg-target-exercise-has-missing-unit-flag-target-exercise-1.2.2-quality-issue-1.2.2-missing-unit-1-1.2.2-1.2.2-flag-1-re-e7362bd3d0bd (owned_content_edge, authored_judgement)
  - source: references/data/owned-content-graph.json
  - warnings: not_primary_evidence

### rag-eval-006

Query: Welke begrippen met formules missen pitfalls?

Status: pass

Notes: Checks term registry retrieval for formula/pitfall inspection; exact missing-pitfall diagnosis is not a curriculum claim.

Top results:

- evidence-anchor:ev-term-price-elasticity-machine (evidence_anchor, machine_registry)
  - source: references/data/evidence-anchors.json
  - warnings: -
- alignment-edge:edge-term-defined-in-registry-prijselasticiteit-van-de-vraag-begrippen (alignment_edge, machine_registry)
  - source: references/data/alignment-graph.json
  - warnings: -
- quality-report:begrippen-coverage.json (quality_report, generated_report)
  - source: reports/json/begrippen-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- authored-reference:references-authored-skill-categories.md (authored_reference, authored_judgement)
  - source: references/authored/skill-categories.md
  - warnings: -
- machine-term:aandelen (machine_term, machine_registry)
  - source: references/machine/begrippen.json
  - warnings: -

### rag-eval-007

Query: Welke deprecated units worden nog geciteerd?

Status: pass

Notes: Checks deprecated/citation health surfacing as diagnostics.

Top results:

- quality-report:dead-units.json (quality_report, generated_report)
  - source: reports/json/dead-units.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:dag-integrity.json (quality_report, generated_report)
  - source: reports/json/dag-integrity.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:unresolved-refs.json (quality_report, generated_report)
  - source: reports/json/unresolved-refs.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:aspects-coverage.json (quality_report, generated_report)
  - source: reports/json/aspects-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:begrippen-coverage.json (quality_report, generated_report)
  - source: reports/json/begrippen-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence

### rag-eval-008

Query: Welke edges zijn diagnostic_only?

Status: pass

Notes: Checks that diagnostic-only graph edges remain explicitly non-authoritative.

Top results:

- alignment-edge:edge-derived-from-cl-exam-gap-r4.2-ev-r4.2-exam-gap-queue (alignment_edge, generated_report)
  - source: references/data/alignment-graph.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- alignment-edge:edge-quality-issue-affects-exam-question-references-external-exam-questions.json-required-skill-and-exam-code-gap-queue (alignment_edge, generated_report)
  - source: references/data/alignment-graph.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- alignment-edge:edge-derived-from-cl-d04-design-ev-d04-design-target (alignment_edge, authored_judgement)
  - source: references/data/alignment-graph.json
  - warnings: pending_review
- alignment-edge:edge-derived-from-cl-edge-a15-a38-ev-a15-a38-machine (alignment_edge, machine_registry)
  - source: references/data/alignment-graph.json
  - warnings: pending_review
- alignment-edge:edge-derived-from-cl-edge-a15-a38-ev-a15-a38-target (alignment_edge, authored_judgement)
  - source: references/data/alignment-graph.json
  - warnings: pending_review

### rag-eval-009

Query: Welke graph edges zijn pending_review?

Status: pass

Notes: Checks that pending-review graph status is not hidden.

Top results:

- alignment-edge:edge-derived-from-cl-d04-design-ev-d04-design-target (alignment_edge, authored_judgement)
  - source: references/data/alignment-graph.json
  - warnings: pending_review
- alignment-edge:edge-derived-from-cl-edge-a15-a38-ev-a15-a38-machine (alignment_edge, machine_registry)
  - source: references/data/alignment-graph.json
  - warnings: pending_review
- alignment-edge:edge-derived-from-cl-edge-a15-a38-ev-a15-a38-target (alignment_edge, authored_judgement)
  - source: references/data/alignment-graph.json
  - warnings: pending_review
- alignment-edge:edge-derived-from-cl-edge-a16-a15-ev-a16-a17-a15-human (alignment_edge, authored_judgement)
  - source: references/data/alignment-graph.json
  - warnings: pending_review
- alignment-edge:edge-derived-from-cl-edge-a16-a15-ev-a16-a17-a15-target (alignment_edge, authored_judgement)
  - source: references/data/alignment-graph.json
  - warnings: pending_review

### rag-eval-010

Query: Welke informatie komt alleen uit generated reports?

Status: pass

Notes: Checks generated-report handling and non-primary evidence warnings.

Top results:

- quality-report:source-document-registry.json (quality_report, generated_report)
  - source: reports/json/source-document-registry.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:alignment-graph-integrity.json (quality_report, generated_report)
  - source: reports/json/alignment-graph-integrity.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:evidence-anchor-status.json (quality_report, generated_report)
  - source: reports/json/evidence-anchor-status.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:owned-content-coverage.json (quality_report, generated_report)
  - source: reports/json/owned-content-coverage.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence
- quality-report:owned-source-registry.json (quality_report, generated_report)
  - source: reports/json/owned-source-registry.json
  - warnings: diagnostic_only, generated_report_warning, not_primary_evidence

## Authority Notes

Generated-report and diagnostic-only results are allowed in retrieval as warnings and review signals only. They are not primary evidence or curriculum authority.
