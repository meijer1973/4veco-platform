# Sprint REVIEW-THROUGHPUT-2: Throughput Field Rollout

Generated: 2026-06-14

## Goal

Wire the accepted review-throughput packet fields into real review-packet
generator patterns and make the CI rollout decision explicit without changing
protected authority boundaries.

## Context

`REVIEW-THROUGHPUT-1` added the PR throughput policy, L0-L4 review-autonomy
ladder, schema, checker, and fixtures. Its named follow-ups were to add the
new fields to future review-packet generators/templates and decide whether
`check:review-throughput` should enter CI once packet paths are standardized.

This sprint handles the first rollout step for active generator patterns. It is
not a product, lesson-output, protected-reference, diagnostics, mastery, PV, or
student/product-use sprint.

## Quality Standard

Quality floor: the generated review-packet field envelope must be reusable,
validated by focused tests, and applied to active full-human-gate packet
builders without weakening their L4 safety posture. The specification is the
field contract and checker accepted in `REVIEW-THROUGHPUT-1`. Rendered output
and student-facing lesson surfaces are out of scope; proof is generator wiring,
checker validation, sprint evidence, and no forbidden authority mutation.
Follow-up work must remain named for broader historical-packet migration or CI
promotion.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Provide a reusable generator/template helper for packet throughput fields. | `build-scripts/review-gates/review-throughput-fields.js`. | Jest helper tests and checker validation. | planned |
| Apply the envelope to active generated review-packet JSON without making it autonomous. | MTU-H2E and MTU-H4B review-packet builders emit L4/high-authority fields. | Direct throughput checks validate both packets; the active H4B checker also calls the throughput checker. | planned |
| Keep high-authority and protected execution packets behind full human gates. | `review_autonomy.level: L4`, `human_decision_required: true`, `auto_merge_allowed_after_ci: false`. | Checker and diff review confirm no autonomous classification is introduced. | planned |
| Decide CI integration. | `reports/sprints/REVIEW-THROUGHPUT-2-ci-decision.md`. | Decision explains why broad CI waits for migration/allowlist. | planned |
| Preserve forbidden authority boundaries. | Allowed/forbidden path discipline. | Diff review confirms no protected references, generated lesson output, product authority, diagnostics, mastery, PV, or student/product use changed. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a shared helper for L3/L4 generator packets. | include_now | Prevents copied field-shape drift. |
| Validate adopted generated packets with existing throughput checker. | include_now | Proves adoption is machine-readable now. |
| Add repository-wide CI over every historical `review-packet.json`. | defer_named_follow_up | Archived packets predate the field contract and need migration or an allowlist. |
| Rewrite old review-packet artifacts or lesson output. | reject_scope_creep | The sprint adopts future generator patterns only. |

## Allowed paths

- `build-scripts/review-gates/review-throughput-fields.js`
- `build-scripts/review-gates/review-throughput-fields.test.js`
- `build-scripts/references/build-mtu-h2e-conditional-lane-execution-packet.js`
- `build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js`
- `build-scripts/references/build-mtu-h4b-answer-form-cli-execution-packet.js`
- `build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js`
- `reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.json`
- `reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/review-packet.json`
- `docs/review/pr-throughput-policy.md`
- `reports/sprints/REVIEW-THROUGHPUT-2-*`
- `references/data/sprints/REVIEW-THROUGHPUT-2.plan.json`
- `references/data/sprints/REVIEW-THROUGHPUT-2.result.json`
- `references/reference-team-roadmap.md` sprint ledger row for `REVIEW-THROUGHPUT-2`

## Forbidden paths

- No `../4veco-lessen/` writes.
- No generated lesson output.
- No `references/machine/` edits.
- No `references/external/` edits.
- No protected reference mutation, including target-exercise or blueprint authority.
- No product-specification authority changes.
- No diagnostics, mastery, PV, student-use, product-use, adaptive-routing,
  summative-use, Scale Gate 1, or student-facing AI authority changes.

## Inputs

- `docs/review/pr-throughput-policy.md`
- `docs/review/review-packet-throughput.schema.json`
- `build-scripts/sprints/check-review-throughput-packet.js`
- Active MTU human-gate review-packet generators and checkers.
- `REVIEW-THROUGHPUT-1` result follow-ups.

## Outputs

- Shared throughput-field helper for generated review-packet artifacts.
- Focused helper tests.
- L4 throughput envelope in selected active human-gate packet builders and
  generated packet JSON.
- Checker call in the selected active packet checker.
- CI decision note, sprint plan, baseline, result, diff summary, command log,
  lead-review records, and metadata.

## Operationalized sprint procedure

1. Record plan, baseline, and plan metadata before implementation.
2. Add the reusable helper for L3/L4 generated packet envelopes.
3. Wire active full-human-gate packet builders to emit L4/high-authority
   fields and keep auto-merge disabled.
4. Regenerate only the selected review-packet JSON artifacts needed to keep
   generators and committed outputs aligned.
5. Add checker validation to the selected packet checkers.
6. Document the CI decision: no broad CI gate until historical packets are
   migrated or an allowlist exists; focused packet checkers may enforce adopted
   packets now.
7. Run validators. Stop if any adopted packet becomes autonomous, if any
   protected or lesson-output surface changes, or if a checker accepts missing
   throughput fields for an adopted packet.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-2
node node_modules/jest/bin/jest.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand
node build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js
node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.json
node build-scripts/sprints/check-review-throughput-packet.js reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/review-packet.json
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-2
node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-2
node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-2-result.md
node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-2 --complete
git diff --check
```

## Proof Required to Close

Proof required to close: the helper exists, adopted packet builders emit the
machine-readable fields, selected generated packets validate through the
throughput checker, focused Jest and the active H4B packet checker pass, CI
rollout is documented, and diff review confirms no protected references,
generated lesson output, product authority, diagnostics, mastery, PV, or
student/product use changed.

## Rollback plan

Revert only the helper, tests, focused generator/checker wiring, selected
review-packet JSON refreshes, policy note, sprint records, metadata, and
roadmap row. Do not revert unrelated work or any protected, lesson-output, or
user-owned changes.

## Human review required

No human product review gate is required for this rollout sprint because it
does not authorize product or student-facing use. Lead review is required
before closure because the sprint changes review governance tooling.
