# INSPECT-4 Validator Design Packet

Status: complete, pending human review
Date: 2026-06-08
Branch: `codex/quality-standards-20260608`

## Decision Implemented

Head of Strategy accepted INSPECT-3 as:

```text
pass_with_minor_guardrails
```

and authorised:

```text
INSPECT-4 Report-Only Validator Design
```

## Primary Outputs

```text
build-scripts/inspection/validate-inspection-evidence.js
docs/inspection-standards/report-only-validator-design.md
references/data/inspection-standards/validator-notes.md
references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json
```

## Command

```text
node build-scripts/inspection/validate-inspection-evidence.js --input <file> --report-only
```

## Output Statuses

```text
PASS_REPORT_ONLY
PASS_WITH_WARNINGS_REPORT_ONLY
SCHEMA_INVALID_REPORT_ONLY
```

The command exits 0 for `PASS_REPORT_ONLY` and
`PASS_WITH_WARNINGS_REPORT_ONLY`. It exits non-zero only for malformed or
schema-invalid manual input.

## Guardrails Implemented

| Guardrail | Implementation |
|---|---|
| Known forbidden-phrase checks are not complete semantic detection. | Output includes a claim-safety note and docs state final claim safety remains review-governed. |
| Only full-report mode may require all eight categories. | `--mode pilot` accepts one or more categories; `--mode full-report` requires all eight Dutch v0 categories. |
| Weak evidence can be valid evidence. | `present_but_weak`, `target_exercise_migrated`, `diagnostic_report_only`, and weak target-proof states emit warnings and keep exit code 0. |

## Forbidden Work Check

Not added:

```text
package.json script integration
required CI gate
build-failing validator integration
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

Does Head of Strategy accept the manual report-only validator design, and if
so, what next sprint is authorised: human review only, report-only generator
planning, or a strictly non-blocking validator refinement?

## Required Next Action

Send this packet and validation log for human review. Do not integrate the
validator into production checks or build evidence packs until explicitly
authorised.
