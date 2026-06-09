# INSPECT-4 Sprint Plan

Status: closed
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising review: `archive/sprints/INSPECT-4/INSPECT-4-human-authorization.md`

## Purpose

INSPECT-4 designs and implements a manual report-only diagnostic validator for
inspection-evidence objects.

The validator is for reviewer use only. It must not become a build gate,
dashboard gate, Scale Gate input, quality-ref integration, generated-output
mutation route, country overlay mechanism, teacher inspection-pack generator,
or compliance-claim mechanism.

## Quality Floor

The validator must preserve the INSPECT-3 minor guardrails:

- known forbidden-phrase checks are not complete semantic claim-safety
  detection;
- pilot mode must not require all eight categories;
- weak evidence can be valid evidence and should produce warnings, not schema
  failure.

## Allowed Outputs

```text
build-scripts/inspection/validate-inspection-evidence.js
docs/inspection-standards/report-only-validator-design.md
references/data/inspection-standards/validator-notes.md
references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json
archive/sprints/INSPECT-4/
generated indexes/reports when path references require refresh
```

## Forbidden Work

Do not add:

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

## Operational Procedure

1. Record INSPECT-3 Head of Strategy review as PASS WITH MINOR GUARDRAILS.
2. Create INSPECT-4 sprint plan and planning review.
3. Implement a manual diagnostic validator with `--input <file> --report-only`.
4. Add validator design docs, validator notes, and a small sample report-only
   evidence object.
5. Update profile metadata, evidence model, README, roadmap, ledger, and URL
   index generator.
6. Refresh generated URL/agent/dashboard indexes.
7. Validate the script syntax and sample object.
8. Prove pilot mode permits partial category coverage.
9. Prove full-report mode requires all eight categories.
10. Prove weak evidence returns warnings without non-zero exit.
11. Run branch, forbidden-scope, lesson read-only, and full platform checks.
12. Run lead-review round 1, correction/no-correction log, and round 2.
13. Close, commit, push, and report the next operational step.

## Acceptance Criteria

- INSPECT-3 is recorded as `pass_with_minor_guardrails`.
- Validator command exists and runs manually.
- Validator output uses only `PASS_REPORT_ONLY`,
  `PASS_WITH_WARNINGS_REPORT_ONLY`, and `SCHEMA_INVALID_REPORT_ONLY`.
- Sample weak-evidence object returns `PASS_WITH_WARNINGS_REPORT_ONLY` with
  exit code 0.
- Full-report mode rejects the sample because it does not contain all eight
  categories.
- The validator does not claim complete semantic unsafe-claim detection.
- No package script, CI/build integration, dashboard gate, quality-ref
  integration, Scale Gate integration, evidence pack, teacher pack, overlay,
  generated lesson-output change, or compliance claim is added.
- Full platform validation passes.

## Stop Conditions

Stop and report if:

- validator design requires adding npm dependencies or package-script
  integration;
- weak evidence would have to become a schema failure;
- claim safety would have to be represented as complete semantic detection;
- validation fails and cannot be repaired inside report-only scope;
- branch/worktree safety fails.

## Required Next Action

Create the manual diagnostic validator design packet and send it for human
review. Do not integrate the validator into production checks.
