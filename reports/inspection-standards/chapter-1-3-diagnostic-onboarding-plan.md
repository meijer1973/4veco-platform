# INSPECT-11E/F Chapter 1.3 Diagnostic Onboarding Plan

Status: implementation-plan-ready-for-lead-review
Date: 2026-06-19
Sprint: `INSPECT-11E/F`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Original sprint/gate spec:
  `archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md`
- Accepted readiness packet:
  `reports/inspection-standards/chapter-1-3-readiness-closure.md`
  and `.json`

## Non-Negotiables

- Internal diagnostic report only.
- Manual invocation only.
- Explicit per-scope source and output allowlists.
- No directory globbing or implicit source discovery.
- No generated lesson-output mutation.
- No evidence pack, teacher/school-facing output, public/external output,
  package/CI invocation, dashboard gate, quality-ref/Scale Gate integration,
  product-route adoption, diagnostics/mastery/PV, student/product-use,
  personal data, or compliance/approval claim.
- Do not return for human review after this plan alone.

## Scope Descriptor Plan

The generator will define explicit descriptors:

| Scope | Source allowlist | Output allowlist | Builder |
|---|---|---|---|
| `chapter-1-2` | Existing Chapter 1.2 diagnostic source list. | Existing Chapter 1.2 report pair. | Existing report builder, refactored into descriptor form. |
| `chapter-1-3` | INSPECT-11D closure, source-traceability, sprint/review records, product specs, quality end-state, and exact read-only Chapter 1.3 lesson Markdown proof files. | `chapter-1-3-diagnostic-report.md/json`. | New report builder mapping INSPECT-11D route-local proof to diagnostic report fields. |
| `all` | Union by descriptor, never by glob. | Both report pairs. | Runs each descriptor independently. |

Default invocation remains compatible with Chapter 1.2; `--scope chapter-1-3`
or `--scope all` is required for the new report.

## Diagnostic Status Vocabulary

| Status | Meaning | Forbidden inference |
|---|---|---|
| `route_local_diagnostic_evidence` | Product evidence exists for scoped internal diagnostic reporting only. | Pack-strength, teacher/school, summative, PTA, product-use, or Scale Gate authority. |
| `route_local_only_with_downstream_blockers` | Chapter evidence can be listed internally, but downstream product/check-surface authority remains blocked. | Product-route adoption or student-use readiness. |
| `scope_boundary_flag` | Evidence is acceptable for the scoped report, while a named adjacent issue remains outside the report. | Treating the adjacent issue as closed. |
| `missing_required_evidence` | Required evidence is absent or not reviewed for the stronger claim. | PASS WITH FLAGS or non-blocking carry. |
| `not_authorized_for_this_surface` | The requested audience, integration, or authority is outside this sprint. | Implementation by implication. |
| `school_owned_evidence_needed` | The evidence belongs to school/provider implementation, not product artifacts. | School-obligation, school-SKA, PTA, or inspection closure. |

## Mapping From INSPECT-11D Proof Records

Each `route_local_proof_records` entry from
`chapter-1-3-readiness-closure.json` maps to one
`4veco_product_evidence` row:

| Source field | Report field |
|---|---|
| `target` | `target` |
| `exercise_id` | `exercise_id` |
| `opgaven_lines` | `opgaven_lines` |
| `answer_lines` | `answer_lines` |
| `operation_chain` | evidence summary |
| `answer_form` | evidence summary |
| `boundary` | `route_boundary` |

Target reconciliation rows map to `target_reconciliation`, and carried issues
map to `blockers` or `carried_scope_flags` depending on classification.

## Blocker Display Requirements

The Chapter 1.3 report must show:

- route-local-only evidence status;
- school-owned evidence still needed;
- forbidden inferences;
- accessibility/support limitations;
- check-surface authority separation;
- owner next action;
- proof required to close;
- source-traceability rule.

## Refusal And Stop Conditions

The generator must stop with explicit codes for:

- source allowlist mismatch;
- output allowlist mismatch;
- unknown scope;
- missing or invalid source;
- hidden blocker;
- evidence-pack, teacher/school-facing, pack-strength, or public/external
  requests;
- personal-data requests;
- package/CI, dashboard, quality-ref, Scale Gate, product-route,
  diagnostics/mastery/PV, student-use, or product-use requests;
- generated lesson-output mutation or implicit lesson-output scanning;
- protected-reference or source-registry mutation;
- uncited claims.

## Chapter 1.2 Regression Contract

Chapter 1.2 semantic content must remain stable. The implementation may repair
volatile currentness metadata that made `--check` stale after lesson-main
movement, but it must prove stable semantic fields are unchanged and preserve
the visible Chapter 1.2 blockers.

## Source-Traceability Policy

For Chapter 1.3 reviewed-final target status, the authored JSON registry is
controlling and stale blueprint prose is context only. The report may cite
`docs/inspection-standards/chapter-1-3-source-traceability.md`; it must not
mutate protected references or source registries.

## Review Gates

1. Lead subagent reviews this plan and architecture.
2. Main agent implements Phase 2 if the lead review finds no scope expansion or
   missing core requirement.
3. Teacher/economics, legal/privacy, and Dutch quality-inspection reviewers
   review the generated report and boundaries.
4. Main agent resolves corrections.
5. Final lead reviewer checks the complete implementation, tests, generated
   reports, and PR packet before human review.

## Human-Review Boundary

This plan is not a human-review stop. It authorises implementation inside the
accepted INSPECT-11D state-A boundary and the user-specified INSPECT-11E/F
handoff. Human review happens only after the full implementation track is
complete.
