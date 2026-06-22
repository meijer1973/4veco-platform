# Sprint REVIEW-THROUGHPUT-3: Request-Changes Corrections

Generated: 2026-06-22

## Review verdict addressed

PR `#137` was returned to draft after human review requested changes on head
`c7ebb8176f34570a9cb2d6ef2ed24b9c936bb773`.

## Corrections applied

- Remote GitHub evidence is immutable: supplemental evidence is allowlisted and cannot replace PR identity, head, state, base, changed paths, mergeability, status checks, requested changes, or unresolved review-thread facts.
- L0/L1/L2 autonomous helpers no longer manufacture proof. They require explicit CI, checker, and lead-review proof, and default `auto_merge_allowed_after_ci` to false.
- L0/L1/L2 router paths reject `ci_waiver: true` and `checkers_required: false`.
- The executor re-fetches and revalidates repo, PR number, base, open state, and head SHA immediately before `gh pr ready`.
- Evidence-only tails are verified from actual post-lead-review changed paths; self-declared `evidence_only` labels are ignored.
- CI proof now requires the protected `validate-platform` context for the current head.
- Governance self-protection uses one canonical manifest covering PR readiness tooling, throughput helpers, throughput checker/schema, lead-reviewer agent, `AGENTS.md`, readiness policy, throughput policy, and workflow surfaces.
- Decision validation rejects inconsistent route/level/payload/transition combinations, and rendered readiness comments include proof summary details.

## New negative tests

- Supplemental evidence cannot replace remote-derived fields.
- L0/L1/L2 with CI waiver routes `KEEP_DRAFT_REVISE`.
- L0/L1/L2 without checker proof routes `KEEP_DRAFT_REVISE`.
- Autonomous helper constructors reject missing explicit proof.
- Head change immediately before mutation prevents `gh pr ready`.
- Falsely labelled evidence-only substantive changes are rejected.
- Missing `validate-platform` is rejected even when another check is green.
- Inconsistent decision route/level/transition combinations are rejected.
- Every canonical autonomy-governance path forces consequential human review.

## Validation evidence

The post-correction command log records passing focused, wrapper, branch
protection, scope-language, report JSON, and platform checks. The platform suite
passes with existing lesson fixture warnings and reports `50` passed suites,
`15` skipped suites, `797` passed tests, and `878` total tests.
