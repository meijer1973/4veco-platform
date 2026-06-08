# INSPECT-3 Schema Design Packet

Status: complete, pending human review
Date: 2026-06-08
Branch: `codex/quality-standards-20260608`

## Decision Implemented

Head of Strategy accepted INSPECT-2A as PASS and authorised:

```text
INSPECT-3 Report-Only Schema Design
```

## Primary Outputs

```text
references/schemas/inspection-evidence.schema.json
docs/inspection-standards/report-only-schema-design.md
references/data/inspection-standards/schema-notes.md
```

## Required Wording

The schema and docs carry:

```text
This schema is report-only and diagnostic. It does not create a quality gate, compliance claim, or generated-output mutation path.
```

## Schema Structure

The schema requires:

- `schema_usage: report_only`;
- diagnostic policy constants that keep build failures, paragraph blocking,
  quality gates, generated-output mutation, and compliance claims false;
- evidence state separate from evidence finality;
- title/source reconciliation;
- source pointers with source types;
- mandatory product/school boundary fields per category record;
- target-equivalent proof status for `assessment_and_closure`;
- `subject_material_basic_skills_evidence` and OP0 boundary fields for
  `basic_skills`;
- report claim boundaries and a required next action.

## Pilot Example

`references/data/inspection-standards/schema-notes.md` contains a pilot
evidence-object example for Book 1 Chapter 1.1, including the `1.1.2` title
reconciliation and an `assessment_and_closure` category record.

## Forbidden Work Check

Not added:

```text
validator script
build-failing validator
generated evidence pack
teacher inspection pack
dashboard gate
quality-ref integration
Scale Gate integration
country overlay
generated lesson-output change
legal compliance claim
inspectorate approval claim
complete OP0/basic-skills claim
```

## Required Human Review Question

Does Head of Strategy accept the report-only schema design as sufficient to
authorise a later non-blocking validator-design sprint?

## Required Next Action

Send this packet and validation log for human review. Do not create validators,
generated evidence packs, teacher inspection packs, dashboard gates,
quality-ref integration, Scale Gate integration, overlays, lesson-output
changes, or compliance claims until explicitly authorised.
