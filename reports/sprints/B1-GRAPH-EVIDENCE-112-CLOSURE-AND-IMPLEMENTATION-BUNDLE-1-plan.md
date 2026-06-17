# B1-GRAPH-EVIDENCE-112-CLOSURE-AND-IMPLEMENTATION-BUNDLE-1 Plan

Date: 2026-06-17

Status: implementation bundle in progress.

## Objective

Close the narrow 1.1.2 Golden transfer readiness question from updated main
after PR #86. If internal REV-STD-1 lead review approves, implement only the
approved `1.1.2-exit-ticket` readiness flags, regenerate lesson output from
platform source, refresh proof, and keep all completion and downstream product
authority held.

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Companion core spec: `../4veco-lessen/specifications/companion-core-specifications.md`
- Original prep result: `reports/sprints/GATE-PRODUCT-3P-PREP-2-result.md`
- Original evidence map: `reports/sprints/GATE-PRODUCT-3P-PREP-2-evidence-map.md`
- Original blocker log: `reports/sprints/GATE-PRODUCT-3P-PREP-2-blocker-log.md`
- Original proof: `reports/json/gate-product-3p-prep-2-proof.json`
- Target operation chain: `reports/sprints/L1.7B-Q2-operation-chain.md`
- Answer model: `reports/sprints/L1.7B-Q2-answer-model.md`

## Non-Negotiable Requirements

1. Review the current `1.1.2-exit-ticket` against A38, A39, and D31.
2. Confirm the ticket requires real calculation work, final answer/notation,
   and the D31 index-points explanation.
3. Keep `1.1.2-korte-check` advisory and non-readiness.
4. If approved, set only:
   `gateApproved:true`, `targetReadinessEvidence:true`,
   `completionLanguageEligible:false`.
5. Regenerate lesson output only through the platform generation workflow.
6. Do not authorize completion language, product-route adoption, diagnostics,
   mastery/sequencing, PV, Scale Gate 1, broad product use, or student/product
   use.

## Execution Plan

1. Read the prep evidence, current 1.1.2 source data, generated lesson output,
   product end-state, companion spec, target registry, operation chain, and
   answer model.
2. Run internal lead-review subagents for teacher/didactic, layout/rendered
   output, authority-boundary, and repository/CI perspectives.
3. Synthesize the internal review under REV-STD-1.
4. If the synthesis is `APPROVE_FLAG_IMPLEMENTATION`, update the source flags
   and the policy/rendered checkers that encoded the old held state.
5. Regenerate the canonical Book 1 lesson output in
   `C:\Projects\4veco\4veco-lessen`.
6. Refresh focused and visual proof artifacts.
7. Add the review packet, quality log, result, review-gate JSON, and bundle
   proof.
8. Run validation, update agent indexes, commit platform and lesson branches,
   and open paired PRs.

## Acceptance Criteria

- `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json` records approved
  gate/readiness flags and still holds completion language.
- Generated lesson data for `1.1.2-exit-ticket` matches source.
- `1.1.2-korte-check` remains advisory with readiness false.
- Proof JSON records `gate_approved:true`, `target_readiness_evidence:true`,
  and completion/downstream authority false.
- Required REV-STD-1 artifacts include non-negotiables, core checklist,
  classified findings, and carried issues with `blocks`, `does_not_block`, and
  `proof_required_to_close`.
- Platform and lesson PRs are prepared with merge order: platform first,
  lesson second.
