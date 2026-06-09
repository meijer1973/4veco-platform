# Inspection Evidence Schema Notes

Status: report-only diagnostic schema notes
Sprint: INSPECT-3 Report-Only Schema Design
Schema: `references/schemas/inspection-evidence.schema.json`

## Design Principle

This schema is report-only and diagnostic. It does not create a quality gate,
compliance claim, or generated-output mutation path.

The schema is meant to shape future reports. It is not a build gate, dashboard
gate, Scale Gate input, quality-ref integration, teacher inspection pack, or
generated lesson-output mutation route.

## Why INSPECT-3 Exists

INSPECT-2 showed that the Dutch v0 profile categories can locate real evidence
in Book 1 Chapter 1.1. INSPECT-2A then added the finality and boundary language
needed before schema design.

INSPECT-3 turns that accepted language into a report-object schema while
preserving:

- evidence state separate from evidence finality;
- target-equivalent proof separate from target-exercise presence;
- diagnostic reports separate from source/review artifacts;
- product evidence separate from school-owned implementation evidence;
- subject-material OP0 evidence separate from complete OP0 evidence.

## Minimal Pilot Object Shape

Future pilot report objects should follow this shape:

```json
{
  "schema_version": 1,
  "schema_usage": "report_only",
  "diagnostic_policy": {
    "report_only": true,
    "diagnostic_only": true,
    "fail_builds": false,
    "block_paragraph_production": false,
    "quality_gate": false,
    "mutate_generated_output": false,
    "compliance_claim": false,
    "required_wording": "This schema is report-only and diagnostic. It does not create a quality gate, compliance claim, or generated-output mutation path."
  },
  "profile_id": "nl-vo-evidence-profile",
  "profile_version": "v0",
  "record_status": "pilot",
  "jurisdiction": "Netherlands",
  "sector": "voortgezet onderwijs",
  "subject_focus": "vwo economie",
  "generated_for_scope": {
    "book": "Book 1",
    "chapter": "1.1 Hoofdstuk Economisch denken en rekenen",
    "paragraph_ids": ["1.1.1", "1.1.2", "1.1.3"],
    "live_blueprint_titles": [
      {
        "paragraph_id": "1.1.2",
        "title": "Percentages en indexcijfers",
        "source_path": "../4veco-lessen/course_blueprint_v5.md"
      }
    ]
  },
  "title_source_reconciliation": {
    "live_blueprint_source": "../4veco-lessen/course_blueprint_v5.md",
    "mismatch_detected": true,
    "checked_sources": [
      {
        "source_type": "human_review_text",
        "source_path_or_note": "INSPECT-2 human review text",
        "observed_title": "1.1.2 Ruilen en rekenen"
      },
      {
        "source_type": "live_blueprint",
        "source_path_or_note": "../4veco-lessen/course_blueprint_v5.md",
        "observed_title": "1.1.2 Percentages en indexcijfers"
      }
    ],
    "reconciliation_note": "Audit follows the live blueprint title and records the mismatch as traceability evidence."
  },
  "category_records": [
    {
      "category_id": "assessment_and_closure",
      "category_outcome": "accepted_as_present_but_weak",
      "evidence_state": "present_but_weak",
      "evidence_finality": [
        "artifact_present",
        "target_exercise_migrated",
        "diagnostic_report_only"
      ],
      "source_pointers": [
        {
          "source_type": "primary_source_artifact",
          "path_or_url": "references/authored/course-target-exercises.json",
          "cited_claim": "Target exercises exist, but migrated status prevents final-reviewed closure proof."
        }
      ],
      "product_school_boundary": {
        "4veco_evidence": "Target exercises, answer models, local target-equivalent proof records, and correction guidance where available.",
        "school_owned_evidence": "Formal assessment policy, grading, PTA, promotion/transition decisions, and summative closure.",
        "forbidden_inference": "Do not infer closure evidence from target-exercise or answer-model presence alone."
      },
      "target_equivalent_proof_status": "target_exercise_migrated_needs_review",
      "report_claim": "Assessment and closure evidence is present but weak for this pilot scope.",
      "known_flags": [
        "Only 1.1.2 has reviewed local target-equivalent proof.",
        "1.1.1 and 1.1.3 are not closure-proof ready."
      ]
    }
  ],
  "report_claim_boundaries": {
    "safe_claim": "4veco exposes product evidence relevant to Dutch VO inspection preparation.",
    "forbidden_claims": [
      "legal compliance",
      "inspectorate approval",
      "complete OP0/basic-skills proof"
    ],
    "school_boundary_note": "School-owned implementation evidence remains outside this product evidence object.",
    "op0_boundary_note": "Basic-skills evidence is subject-material evidence, not complete OP0 school evidence."
  },
  "known_limitations": [
    "This example is a pilot evidence object, not an inspection pack."
  ],
  "next_action": "Human review of INSPECT-3 before any validator or report generator is authorised."
}
```

## Schema Design Choices

- The schema records `schema_usage: report_only`.
- The `diagnostic_policy` object uses Boolean constants to block accidental
  gate semantics.
- `evidence_state` and `evidence_finality` are separate.
- `assessment_and_closure` records require `target_equivalent_proof_status`.
- `basic_skills` records require `subject_material_basic_skills_evidence` and
  an OP0 boundary object.
- Source pointers require a source type and path/URL so future reports cite
  evidence rather than only summarising it.
- Product/school boundary fields are mandatory per category record.

## Residual Risk

This schema has no validator script and no build integration. A later sprint
must decide whether to create a report-only validator. That later validator
must remain diagnostic unless a separate human gate authorises stronger use.

## Recommended Next Step

Send the INSPECT-3 packet for human review. Do not create validators, generated
evidence packs, dashboard gates, quality-ref integration, Scale Gate
integration, lesson-output changes, or compliance claims.
