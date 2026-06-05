# CHECKSURFACE-RESET-1 Product Quality Reset Plan

Generated: 2026-06-05

## Objective

Record the returned `GATE-CHECK-SHORT-EXIT-2` human review as `REVISE`,
preserve the open-gate boundary, and convert the review into a product-quality
failure analysis plus a checker that prevents accidental closure.

## Quality Floor

This sprint is not allowed to repair product UI directly or ask for a new
human gate. It must make the product-quality defect explicit and auditable:

- `1.1.3` short check lacks graph/table interaction;
- `1.1.3-short` proof records `context_block_count = 0` and
  `task_shell_count = 0`;
- `1.1.3` exit-ticket data has graph task structure but the generated surface
  does not yet render as a polished source/task graph workspace;
- visual QA and lead review were insufficient because they accepted existence
  proof without catching the student-experience defect;
- the next work is a sprint series, not a narrow patch.

## Specification Requirements

Fulfilled by this sprint:

1. Direct review comments are recorded against `CHECKSURFACE-Q1` through
   `CHECKSURFACE-Q12`.
2. The comment-resolution log records `REVISE`, `hold_for_surface_repair`, and
   `replan_before_next_human_gate`.
3. `closure-proposal.*` and `gate-closure.*` remain absent.
4. The audit identifies the product end-state gap: generated pages exist, but
   the right task interaction is not yet present.
5. The reset sequence is recorded before any new human gate.

Omitted by design:

- rebuilding `1.1.3-korte-check.json`;
- adding split source/task exit-ticket rendering;
- changing landing copy;
- hardening the graph visual QA validator beyond this reset checker.

Those are assigned to the follow-up sprint sequence.

## Evidence Required

- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/direct-review-comments.md`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/direct-review-comments.json`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/comment-resolution-log.md`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/comment-resolution-log.json`
- `reports/sprints/CHECKSURFACE-RESET-1-product-quality-audit.md`
- `reports/json/checksurface-reset1-quality-findings.json`
- `build-scripts/sprints/check-checksurface-reset1.js`

## Review Gate

No human gate is requested by this sprint. The next allowed human gate is
`GATE-CHECK-SHORT-EXIT-2-RETRY`, and only after `CHECK-SURFACE-PREGATE-1`
produces a green product packet.

## Procedure

1. Record direct review comments and decision.
2. Record comment-resolution log without closure.
3. Write product-quality audit and findings JSON.
4. Add acceptance checker.
5. Update the existing gate packet and roadmap to show the gate is revised and
   held.
6. Refresh GitHub-facing indexes after path/report changes.
7. Run validators, commit, and push.

## Stop Conditions

Stop if:

- the gate is marked closed;
- `gate-closure.md/json` or `closure-proposal.md/json` is created;
- the review result is softened into `pass_with_flags`;
- product authority is broadened;
- the reset sequence is not recorded;
- the checker cannot prove the required blocker state from proof/source data.
