# Inspection Evidence Validator Notes

Status: report-only diagnostic validator notes
Sprint: INSPECT-4 Report-Only Validator Design; INSPECT-5 Strictly Non-Blocking Validator Refinement
Validator: `build-scripts/inspection/validate-inspection-evidence.js`

## Command

```text
node build-scripts/inspection/validate-inspection-evidence.js --input <file> --report-only
```

Optional mode:

```text
--mode pilot
--mode full-report
```

Optional JSON output:

```text
--json
```

## Sample Command

```text
node build-scripts/inspection/validate-inspection-evidence.js --input references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json --report-only
```

Expected status for the sample:

```text
PASS_WITH_WARNINGS_REPORT_ONLY
```

The warnings are expected because weak evidence remains valid evidence. The
sample contains `present_but_weak`, `target_exercise_migrated`, and
`diagnostic_report_only` to prove the validator does not fail honest weak
evidence.

## Negative Fixtures

INSPECT-5 adds repeatable negative fixtures under:

```text
references/data/inspection-standards/fixtures/negative/
```

They cover:

```text
missing-required-field.sample.json
invalid-diagnostic-policy.sample.json
extra-property.sample.json
invalid-category-id.sample.json
missing-op0-boundary.sample.json
missing-target-equivalent-proof.sample.json
full-report-missing-category.sample.json
known-forbidden-phrase.sample.json
```

Each negative fixture is for manual validator checks only. They are not wired
into `package.json`, CI, `check:platform`, dashboards, Scale Gate, quality-ref,
generated output, or evidence-pack generation.

## Guardrails

- The validator is not a claim-safety classifier. It checks only known exact
  forbidden phrases in positive report claims.
- The validator does not require all eight categories in pilot mode.
- Weak evidence can be valid evidence.
- The validator is not wired into `check:platform`, CI, dashboards, Scale Gate,
  quality-ref, generated lesson output, evidence-pack generation, or teacher
  inspection packs.

## Result Vocabulary

```text
PASS_REPORT_ONLY
PASS_WITH_WARNINGS_REPORT_ONLY
SCHEMA_INVALID_REPORT_ONLY
```

`SCHEMA_INVALID_REPORT_ONLY` means invalid against the schema-backed
report-only inspection-evidence contract checked by this manual validator. It
is not a build, dashboard, Scale Gate, quality-ref, compliance, or inspectorate
approval judgement.

Avoid:

```text
FAIL_GATE
BLOCKED
COMPLIANT
INSPECTION_READY
```

## Implementation Note

The script intentionally uses only Node.js built-ins. It reads
`references/schemas/inspection-evidence.schema.json` and checks the schema
features used by that file: local refs, required fields, constants, enums,
primitive types, arrays, conditionals, forbidden exact values, and
additional-property rules. It does not add an npm dependency and does not
create a production validator integration.

## Recommended Next Step

Send the INSPECT-5 refinement packet for human review. Do not create validator
integration, report generator planning, evidence packs, dashboard gates,
quality-ref integration, Scale Gate integration, country overlays,
lesson-output changes, or compliance claims without later explicit
authorisation.
