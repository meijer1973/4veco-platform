# Report-Only Inspection Evidence Validator Design

Status: report-only diagnostic validator design, refined
Sprint: INSPECT-4 Report-Only Validator Design; INSPECT-5 Strictly Non-Blocking Validator Refinement
Validator: `build-scripts/inspection/validate-inspection-evidence.js`
Schema: `references/schemas/inspection-evidence.schema.json`
Sample: `references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json`

## Purpose

INSPECT-4 adds a manual diagnostic validator for report-only inspection evidence
objects. It is not a build gate, dashboard gate, Scale Gate input,
quality-ref integration, country overlay mechanism, teacher inspection-pack
generator, generated-output mutation route, or compliance-claim mechanism.

INSPECT-5 refines the validator after Head of Strategy review of INSPECT-4.
The validator now performs schema-backed checks for the report-only
inspection-evidence contract used by
`references/schemas/inspection-evidence.schema.json`, including required
fields, constants, enums, primitive types, arrays, local refs, conditionals,
forbidden exact values, and additional-property rules. It remains a
no-dependency manual command and is not wired into production validation.

Required posture:

```text
node build-scripts/inspection/validate-inspection-evidence.js --input <file> --report-only
```

Output status vocabulary:

```text
PASS_REPORT_ONLY
PASS_WITH_WARNINGS_REPORT_ONLY
SCHEMA_INVALID_REPORT_ONLY
```

Meaning of the invalid status:

```text
SCHEMA_INVALID_REPORT_ONLY means invalid against the schema-backed report-only inspection-evidence contract checked by this manual validator; it is not a build, dashboard, Scale Gate, quality-ref, or compliance judgement.
```

The validator does not use:

```text
FAIL_GATE
BLOCKED
COMPLIANT
INSPECTION_READY
```

## Diagnostic Behaviour

The validator may:

- parse an inspection-evidence JSON object;
- check required report-only diagnostic policy constants;
- check the schema-backed object contract for fields, constants, enums, types,
  arrays, local refs, conditionals, forbidden exact values, and additional
  properties used by the report-only schema;
- check title/source reconciliation is present;
- check source pointers have source types and paths/URLs;
- check product/school boundary fields are present;
- check `assessment_and_closure` has `target_equivalent_proof_status`;
- check `basic_skills` has `subject_material_basic_skills_evidence` and OP0
  boundary fields;
- emit warnings/findings for weak evidence;
- emit a report-only result.

It must not:

- fail builds because evidence is weak;
- block paragraph production;
- mutate generated lesson output;
- update quality-ref files;
- integrate with dashboard gates;
- integrate with Scale Gate;
- create country overlays;
- generate teacher inspection packs;
- claim legal compliance or inspectorate approval.

## Minor Guardrails Carried From INSPECT-3 Review

1. Forbidden-claim checks are not complete semantic claim-safety detection. The
   validator checks known exact phrases and required safe wording only. Final
   claim safety remains review-governed.
2. Pilot mode does not require all eight category records. If full-report mode
   is used, all eight categories are required.
3. Schema validity and evidence strength are separate. Weak evidence can be
   valid evidence. `present_but_weak`, `target_exercise_migrated`, and
   `diagnostic_report_only` produce warnings, not schema failure.
4. `SCHEMA_INVALID_REPORT_ONLY` names a manual report-only schema-contract
   failure. It is not a production gate status and not a compliance finding.

## Exit Code Policy

The manual command exits `0` for:

```text
PASS_REPORT_ONLY
PASS_WITH_WARNINGS_REPORT_ONLY
```

It exits non-zero only for malformed input or schema-invalid manual input:

```text
SCHEMA_INVALID_REPORT_ONLY
```

In this context, schema-invalid means invalid against the report-only
inspection-evidence schema contract checked by this validator. It does not
mean a build failure, dashboard failure, Scale Gate finding, quality-ref
finding, legal-compliance judgement, or inspectorate judgement.

This is acceptable for manual validation, but the command is not wired into CI,
`check:platform`, dashboard gates, paragraph production, Scale Gate, or
quality-ref workflows.

## Modes

Pilot mode:

```text
--mode pilot
```

Pilot mode accepts one or more category records. This supports small bounded
objects such as the Book 1 Chapter 1.1 sample.

Full-report mode:

```text
--mode full-report
```

Full-report mode requires all eight Dutch v0 category records. This remains
diagnostic and report-only; missing categories are schema-invalid for the
manual object, not a production failure.

## Recommended Next Step

Send the INSPECT-5 validator refinement packet for human review. Do not start
report-only generator planning, evidence-pack work, dashboard integration,
quality-ref integration, Scale Gate integration, country overlays, generated
lesson-output changes, CI/build integration, or compliance claims until a later
human review explicitly authorises that scope.
