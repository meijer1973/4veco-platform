# Sprint REVIEW-THROUGHPUT-1: PR Throughput Policy

Generated: 2026-06-14

## Goal

Reduce avoidable PR review overhead while preserving the current safety
boundaries for protected references, generated lesson output, product
authority, diagnostics, mastery, PV, and student/product use.

## Context

Recent platform and lesson work has used many narrow PRs, which is safe but
creates avoidable owner overhead when a PR is mechanical, non-authoritative, or
already lead-reviewed with strong CI/checker evidence. The repository also has
strong guardrails around protected references, generated output, review gates,
and product-use authority. This sprint adds a policy and checker that preserve
those guardrails while making future packet companions machine-readable enough to
route low-risk PRs through a lighter lane.

This is a governance and checker sprint. It does not change generated lesson
output, reference authority, product specifications, diagnostics, mastery, PV,
or student/product use.

## Quality Standard

Quality floor: the policy must define practical PR classes and a review
autonomy ladder that future reviewers can apply without weakening the existing
safety model or the requested specification. The checker must reject autonomous
classification whenever the requested forbidden conditions are present or
required proof is missing. The retrospective must be evidence-based from
GitHub PR metadata, not memory.
Rendered output and student-facing lesson surfaces are out of scope for this
sprint; proof is documentation, checker behavior, tests, and the explicit
preservation of generated-output and student-facing review requirements.
Follow-up work must be named if a future CI integration or PR-template rollout
is still needed.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Define micro maintenance, normal sprint, generated-output, high-authority, and cross-repo bundle PRs. | `docs/review/pr-throughput-policy.md`. | Plan/result review and checker tests confirm field names and boundary language. | planned |
| Define review-autonomy levels L0 through L4. | `docs/review/pr-throughput-policy.md`. | Policy text maps each level to proof and human-decision rules. | planned |
| Add machine-readable packet fields. | `docs/review/review-packet-throughput.schema.json` and policy examples. | Checker requires `bundle_id`, `authority_class`, `review_autonomy.level`, `human_decision_required`, `paired_prs`, `auto_merge_allowed_after_ci`, and `escalation_triggers`. | planned |
| Reject unsafe autonomous classification. | `build-scripts/sprints/check-review-throughput-packet.js`. | Positive and negative fixtures plus Jest test coverage. | planned |
| Retrospect platform PRs #42-#56 and lesson PRs #4-#13. | `reports/sprints/REVIEW-THROUGHPUT-1-retrospective.md`. | Report cites GitHub PR URLs, state, paths, and classification rationale. | planned |
| Preserve all forbidden authority boundaries. | Allowed/forbidden path discipline and checker/policy wording. | Diff review verifies no protected references, generated lesson output, product authority, diagnostics, mastery, PV, or student/product use changed. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a packet schema companion as well as prose policy. | include_now | Needed for future packet generation. |
| Add negative fixtures for every requested autonomous-rejection condition. | include_now | Direct proof that safety boundaries are preserved. |
| Add package-script CI integration. | defer_named_follow_up | This sprint adds a callable checker; CI rollout can happen after review. |
| Rewrite old PRs, generated output, or reference data. | reject_scope_creep | The task asks for a retrospective and future policy, not history edits or authority mutation. |

## Allowed paths

- `AGENTS.md`
- `docs/review/pr-throughput-policy.md`
- `docs/review/review-packet-throughput.schema.json`
- `build-scripts/sprints/check-review-throughput-packet.js`
- `build-scripts/sprints/check-review-throughput-packet.test.js`
- `reports/fixtures/review-throughput-1/*`
- `reports/sprints/REVIEW-THROUGHPUT-1-*`
- `references/data/sprints/REVIEW-THROUGHPUT-1.plan.json`
- `references/data/sprints/REVIEW-THROUGHPUT-1.result.json`
- `references/reference-team-roadmap.md` sprint ledger row for `REVIEW-THROUGHPUT-1`
- `package.json`

## Forbidden paths

- No `../4veco-lessen/` writes.
- No generated lesson output.
- No `references/machine/` edits.
- No `references/external/` edits.
- No protected reference mutation, including target-exercise or blueprint authority.
- No product-specification authority changes.
- No diagnostics, mastery, PV, student-use, product-use, adaptive-routing,
  summative-use, or student-facing AI authority changes.

## Inputs

- GitHub PR metadata for `meijer1973/4veco-platform` PRs `#42` through `#56`.
- GitHub PR metadata for `meijer1973/4veco-lessen` PRs `#4` through `#13`.
- Existing review and sprint checker patterns in `build-scripts/sprints/`.
- Existing human-review, CI-proof, generated-output, and protected-reference
  rules in `AGENTS.md`.

## Outputs

- PR throughput policy.
- Packet throughput schema.
- Autonomous-classification checker.
- Checker fixtures and tests.
- Retrospective report for the requested PR windows.
- Sprint plan, baseline, result, diff summary, command log, lead-review records,
  roadmap ledger row, and metadata.

## Operationalized sprint procedure

1. Record the sprint plan, baseline, and plan metadata before implementation.
2. Pull PR metadata and changed-file lists from GitHub for the requested
   platform and lesson PR ranges. Stop if GitHub metadata is unavailable,
   because the retrospective must not be inferred from memory.
3. Add the policy and schema in `docs/review/`, keeping the language
   governance-only and explicit about forbidden authority boundaries.
4. Add the checker and fixtures. The checker must reject autonomous
   classification for protected-reference touches, machine/external-reference
   touches, generated-output product-authority claims, diagnostics/mastery/PV/
   student-use authority claims, missing CI/checker proof, and missing
   lead-review result.
5. Add the retrospective report using the GitHub metadata gathered in step 2.
   Classify correct isolation, batching opportunities, lead-review autonomous
   candidates, and full-human-review requirements.
6. Run focused tests and lint/diff checks. Stop if any checker fixture does not
   fail for the intended reason or if the diff touches a forbidden surface.
7. Record result metadata and the final data-integrity boundary statement.

Stop conditions:

- Stop if the change needs lesson repo writes.
- Stop if the checker would allow autonomous classification for protected,
  generated-output product-authority, diagnostics, mastery, PV, or student-use
  authority.
- Stop if CI/checker proof or lead-review proof can be omitted for an
  autonomous packet.
- Stop if the retrospective cannot cite GitHub metadata for a requested PR.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-1
node build-scripts/sprints/check-review-throughput-packet.js reports/fixtures/review-throughput-1/positive-autonomous.json
node node_modules/jest/bin/jest.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand
node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-1
node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-1-result.md
node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-1 --complete
git diff --check
```

## Proof Required to Close

Proof required to close: the policy and schema exist, the checker accepts the
positive autonomous fixture, the negative fixtures reject for the intended
boundary reasons, the retrospective covers all requested PRs, focused Jest tests
pass, the sprint result checker passes, and diff review confirms no protected
references, generated lesson output, product authority, diagnostics, mastery,
PV, or student/product use changed.

## Rollback plan

Revert only the `REVIEW-THROUGHPUT-1` policy, schema, checker, fixtures,
tests, sprint records, metadata, and package-script changes. Do not revert
unrelated branch work or any user-owned changes.

## Human review required

No human product review gate is required for this sprint because it is
governance-only and does not grant product authority. The policy itself
requires human gates for high-authority future PRs.
