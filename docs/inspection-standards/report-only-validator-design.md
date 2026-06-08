# Report-Only Inspection Evidence Validator Design

Status: report-only diagnostic validator design
Sprint: INSPECT-4 Report-Only Validator Design
Validator: `build-scripts/inspection/validate-inspection-evidence.js`
Schema: `references/schemas/inspection-evidence.schema.json`
Sample: `references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json`

## Purpose

INSPECT-4 adds a manual diagnostic validator for report-only inspection evidence
objects. It is not a build gate, dashboard gate, Scale Gate input,
quality-ref integration, country overlay mechanism, teacher inspection-pack
generator, generated-output mutation route, or compliance-claim mechanism.

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

## Exit Code Policy

The manual command exits `0` for:

```text
PASS_REPORT_ONLY
PASS_WITH_WARNINGS_REPORT_ONLY
```

It exits non-zero only for malformed input or schema-invalid input:

```text
SCHEMA_INVALID_REPORT_ONLY
```

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

Send the INSPECT-4 validator design packet for human review. Do not integrate
the validator into CI, dashboards, quality-ref, Scale Gate, generated output,
or evidence-pack generation until a later human review explicitly authorises
that scope.
