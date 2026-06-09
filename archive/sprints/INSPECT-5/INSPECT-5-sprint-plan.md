# INSPECT-5 Sprint Plan

Status: closed
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising review: `archive/sprints/INSPECT-5/INSPECT-5-human-authorization.md`

## Purpose

INSPECT-5 refines the manual report-only validator so future agents cannot
mistake `SCHEMA_INVALID_REPORT_ONLY` for a production gate or broad compliance
judgement.

The sprint chooses the schema-backed path for the current report-only schema:
the validator reads `references/schemas/inspection-evidence.schema.json` and
checks the schema features used by that file while staying manual,
no-dependency, and non-integrated.

## Quality Floor

The refinement must preserve every INSPECT-4 guardrail:

- `--report-only` remains mandatory;
- `PASS_REPORT_ONLY` and `PASS_WITH_WARNINGS_REPORT_ONLY` exit 0;
- weak evidence stays warning-only;
- pilot mode accepts partial category records;
- full-report mode requires all eight categories;
- claim-safety checks remain limited known-phrase checks;
- no production, CI, dashboard, quality-ref, Scale Gate, evidence-pack,
  teacher-pack, overlay, generated-output, or compliance integration is added.

## Allowed Outputs

```text
build-scripts/inspection/validate-inspection-evidence.js
docs/inspection-standards/report-only-validator-design.md
references/data/inspection-standards/validator-notes.md
references/data/inspection-standards/fixtures/negative/*.sample.json
references/data/inspection-standards/README.md
references/data/inspection-standards/nl-vo-evidence-profile.v0.json metadata
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/roadmap-version-index.json
archive/sprints/INSPECT-5/
generated maps/reports when path references require refresh
```

## Forbidden Work

Do not add:

```text
report-only generator planning
package.json script integration
CI or check:platform integration
dashboard gate
Scale Gate integration
quality-ref integration
generated evidence pack
teacher inspection pack
country overlay
generated lesson-output mutation
legal compliance claim
inspectorate approval claim
complete OP0/basic-skills claim
```

## Operational Procedure

1. Record the Head of Strategy INSPECT-4 decision as
   `pass_with_required_refinement`.
2. Create INSPECT-5 sprint plan and planning review.
3. Refine validator invalid-status wording.
4. Add schema-backed object-contract validation for schema features used by
   `inspection-evidence.schema.json`.
5. Add negative fixtures for required failure cases.
6. Update validator docs, notes, roadmap, ledger, data-overlay metadata, and
   URL index generator.
7. Refresh generated maps and reports.
8. Validate syntax, JSON, positive pilot behavior, full-report behavior,
   negative fixture behavior, branch/worktree safety, lesson read-only status,
   forbidden scope, URL/index freshness, roadmap index freshness, and full
   platform checks.
9. Run lead-review round 1, correction log, and round 2.
10. Close, commit, push, and report the next operational step.

## Acceptance Criteria

- Validator remains manual and requires `--report-only`.
- `PASS_REPORT_ONLY` and `PASS_WITH_WARNINGS_REPORT_ONLY` still exit 0.
- Weak evidence remains warning-only.
- Pilot mode accepts partial category records.
- Full-report mode requires all eight categories.
- Claim-safety language remains explicitly limited.
- Schema/contract invalid terminology is clarified.
- Negative tests cover missing required field, invalid diagnostic policy
  constant, extra property, missing OP0 boundary, missing
  `target_equivalent_proof_status`, full-report missing category, invalid
  category id, and a known forbidden positive-claim phrase.
- No production integration is added.
- Full platform validation passes.

## Stop Conditions

Stop and report if:

- the refinement requires package dependency, package script, CI/build
  integration, dashboard gate, quality-ref integration, or Scale Gate work;
- weak evidence would have to become a failure;
- claim-safety would have to be represented as complete semantic detection;
- negative fixture validation cannot pass inside manual report-only scope;
- branch/worktree safety fails;
- lesson output would have to change.

## Required Next Action

Complete INSPECT-5, send the refinement packet for human review, and do not
start report-only generator planning until Head of Strategy explicitly
authorises that next sprint.
