# Sprint REVIEW-THROUGHPUT-3: PR Readiness Router

Generated: 2026-06-22

## Goal

Implement an independent PR Readiness Reviewer role, pure routing classifier,
machine-readable decision schema, read-only GitHub evidence collector, explicit
state-transition executor, tests, fixtures, and operating-policy updates so a
completed draft PR can move to the right review lane without an extra owner
permission checkpoint.

## Context

`REVIEW-THROUGHPUT-1` established the PR throughput policy, L0-L4 autonomy
ladder, checker, schema, and retrospective. `REVIEW-THROUGHPUT-2` added shared
throughput-field helpers for review-packet generators and documented why broad
historical-packet CI enforcement remains deferred. The remaining gap is the
live PR lifecycle router: after a draft PR is published and remotely
inspectable, an independent reviewer must inspect the exact remote head,
classify authority and human-review payload, and allow only safe lifecycle
transitions.

This sprint changes review-governance and autonomy machinery. The
implementation PR itself therefore requires human review as a consequential
exception, even though it must automatically leave draft once readiness proof
supports that route.

## Quality Standard

Quality floor: the router must be specification-driven, pure and testable at
the core, read-only by default for live evidence collection, fail-closed for
state transitions, and clearly separated from lead-review quality judgement.
The specification is the handoff request plus `docs/review/pr-throughput-policy.md`.
Rendered output and student-facing lesson surfaces are out of scope, and proof
comes from focused router tests, fixture coverage for all required routes,
schema validation, branch-protection inspection, GitHub dry-run evidence, lead
review, and sprint validators. Follow-up work must be named for any
infrastructure constraint such as branch-protection identity limitations.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Add an independent PR Readiness Reviewer role distinct from Lead Reviewer. | `agents/pr-readiness-reviewer-agent.md`, `agents/README.md`, and `agents/lead-reviewer-agent.md`. | Lead review confirms role boundaries and required output fields. | planned |
| Define routing policy and decision schema. | `docs/review/pr-readiness-routing-policy.md` and `docs/review/pr-readiness-decision.schema.json`. | Schema fixture validation and policy review. | planned |
| Implement a pure router with all required route states and two-axis decision model. | `build-scripts/review-gates/pr-readiness-router.js`. | Jest fixtures cover L0/L1/L2, L3/L4, batching, stale proof, unresolved reviews, cross-repo bundles, branch-protection constraints, and self-modification exceptions. | planned |
| Add read-only live evidence collection. | `build-scripts/review-gates/review-pr-readiness.js`. | Dry runs against fixtures and current/historical PR metadata; no mutation commands in read-only path. | planned |
| Add explicit safe executor. | `build-scripts/review-gates/apply-pr-readiness-decision.js`. | Fixture tests prove stale-head refusal, idempotent comments, and allowed `gh pr ready` transition only. | planned |
| Extend throughput helper constructors for L0/L1/L2. | `build-scripts/review-gates/review-throughput-fields.js` and tests. | Existing packet checker accepts generated autonomous packet fixtures without weakening safety. | planned |
| Wire package scripts and maps/indexes. | `package.json`, agent maps, GitHub indexes, URL index, and dashboard refresh where needed. | `agent:index`, URL-index check, report JSON, roadmap index, and scope-language pass. | planned |
| Produce complete sprint evidence and route the implementation PR to human review. | Sprint plan, baseline, command log, result, diff summary, lead review records, PR-readiness decision/comment. | `platform-ci / validate-platform` passes for the final remote head, live PR readiness routes `READY_FOR_HUMAN_REVIEW`, and executor marks the draft ready without weakening protections. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Keep the classifier pure and expose small helper functions for tests. | include_now | Prevents live GitHub state and local worktree state from contaminating routing logic. |
| Render both JSON and Markdown decisions with an idempotent comment marker. | include_now | Makes live decisions inspectable without committing self-invalidating per-PR records. |
| Add a deterministic fixture mode for the live collector and executor. | include_now | Allows safe CI/local proof for GitHub-facing logic without mutating unrelated PRs. |
| Build a GitHub App identity or branch-protection bypass for lead-only lanes. | defer_named_follow_up | This sprint must detect the constraint, not change branch protection. |
| Migrate every historical packet artifact or archived PR to the new router. | reject_scope_creep | The sprint adds reusable tooling and representative dry-run evidence only. |

## Allowed paths

- `agents/pr-readiness-reviewer-agent.md`
- `agents/README.md`
- `agents/lead-reviewer-agent.md`
- `docs/review/pr-readiness-routing-policy.md`
- `docs/review/pr-readiness-decision.schema.json`
- `docs/review/pr-throughput-policy.md`
- `build-scripts/review-gates/pr-readiness-router.js`
- `build-scripts/review-gates/pr-readiness-router.test.js`
- `build-scripts/review-gates/review-pr-readiness.js`
- `build-scripts/review-gates/apply-pr-readiness-decision.js`
- `build-scripts/review-gates/review-throughput-fields.js`
- `build-scripts/review-gates/review-throughput-fields.test.js`
- `reports/fixtures/pr-readiness-router/`
- `reports/sprints/REVIEW-THROUGHPUT-3-*`
- `references/data/sprints/REVIEW-THROUGHPUT-3.plan.json`
- `references/data/sprints/REVIEW-THROUGHPUT-3.result.json`
- `references/reference-team-roadmap.md`
- `package.json`
- repository maps and GitHub-facing indexes generated by the standard index commands.

## Forbidden paths

- No `../4veco-lessen/` writes except a concise pointer in `../4veco-lessen/AGENTS.md` only if the platform policy cannot be discovered otherwise.
- No generated lesson output changes.
- No `references/machine/` edits.
- No `references/external/` edits.
- No protected reference mutation, including target-exercise or blueprint authority.
- No product-specification authority changes outside review-routing policy.
- No diagnostics, mastery, PV, Scale Gate 1, student-use, product-use, adaptive-routing, summative-use, or student-facing AI authority changes.
- No `pull_request_target` workflow, broad write-permission workflow, branch-protection weakening, forced merge, or L3/L4 auto-merge.

## Inputs

- Handoff request for `REVIEW-THROUGHPUT-3 / PR-READINESS-ROUTER-1`.
- `RESEARCH_AGENT_MAP.md`
- `AGENTS.md`
- `CLAUDE.md`
- `agents/README.md`
- `agents/lead-reviewer-agent.md`
- `docs/review/pr-throughput-policy.md`
- `docs/review/review-packet-throughput.schema.json`
- `build-scripts/sprints/check-review-throughput-packet.js`
- `build-scripts/review-gates/review-throughput-fields.js`
- `build-scripts/ci/check-branch-protection.js`
- `reports/sprints/REVIEW-THROUGHPUT-1-result.md`
- `reports/sprints/REVIEW-THROUGHPUT-1-retrospective.md`
- `reports/sprints/REVIEW-THROUGHPUT-2-result.md`
- `reports/sprints/REVIEW-THROUGHPUT-2-ci-decision.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`

## Outputs

- PR Readiness Reviewer agent specification.
- PR readiness routing policy and JSON schema.
- Pure router, read-only live reviewer, and explicit state-transition executor.
- Router fixtures and comprehensive Jest tests.
- L0/L1/L2 throughput helper constructors with tests.
- Package scripts: `review:pr-readiness`, `apply:pr-readiness`, and `check:pr-readiness`.
- Live dry-run report for representative PR metadata.
- Sprint plan, baseline, command log, diff summary, result, lead-review assignment, round-1 review, corrections, and round-2 review.
- Refreshed repository maps and GitHub-facing indexes.

## Operationalized sprint procedure

1. Record this plan, baseline, plan metadata, and roadmap ledger row before implementation.
2. Validate the plan and active bundle. Stop if the repo cannot accept a human-review-required governance sprint or if required baseline files are unavailable.
3. Implement the pure classifier and fixtures first, then prove all required route states with focused tests.
4. Add the read-only collector and executor wrappers, keeping GitHub mutation out of the default command. Stop if any apply path can transition a changed head, bypass branch protection, auto-merge L3/L4, or duplicate comments for the same head.
5. Update agent docs, policy docs, helper constructors, package scripts, maps, and indexes.
6. Run acceptance validators and record every command through `build-scripts/sprints/run-sprint-command.js`.
7. Run structural lead review round 1, apply corrections, and run round 2 before human review.
8. Publish the implementation PR as a draft while work is incomplete. After CI and lead review pass, run the new PR Readiness Reviewer against the exact remote head and apply only its allowed transition.
9. Because this sprint changes review-governance and autonomy machinery, route the implementation PR as `READY_FOR_HUMAN_REVIEW`, mark it ready, and return with the requested human-review handoff. Do not ask the owner for permission merely to run `gh pr ready`.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REVIEW-THROUGHPUT-3-plan.md
node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3
node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand
npm.cmd run check:pr-readiness
npm.cmd run check:branch-protection
node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-l1-ready.json --format json
node build-scripts/review-gates/review-pr-readiness.js --fixture reports/fixtures/pr-readiness-router/live-governance-human.json --format markdown
node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run
npm.cmd run check:scope-language
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:platform
node build-scripts/sprints/check-lead-review-substance.js REVIEW-THROUGHPUT-3
node build-scripts/sprints/check-sprint-command-log.js REVIEW-THROUGHPUT-3
node build-scripts/sprints/check-sprint-result.js reports/sprints/REVIEW-THROUGHPUT-3-result.md
node build-scripts/sprints/check-sprint-bundle.js REVIEW-THROUGHPUT-3 --complete
git diff --check
```

## Proof Required to Close

Proof required to close: the agent spec, policy, schema, pure router, live
collector, executor, fixtures, tests, L0/L1/L2 helper constructors, package
scripts, maps, sprint evidence, branch-protection report, dry-run evidence,
and lead-review records exist; focused tests and platform validation pass; the
implementation PR is published remotely, CI applies to the final remote head,
and the new router marks it ready for human review without changing branch
protection or auto-merging.

## Rollback plan

Revert only the PR-readiness reviewer, policy, schema, router scripts, fixtures,
tests, helper additions, package scripts, sprint records, generated maps/indexes,
and roadmap row from this sprint. Do not revert unrelated branch work, protected
references, generated lesson output, or user-owned changes.

## Human review required

Yes. This sprint modifies review-governance and PR autonomy machinery, so it
must route as a consequential human-review exception. Lead review must happen
before the human review package, and L3/L4 work must never be auto-merged.
