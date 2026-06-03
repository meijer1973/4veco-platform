# Sprint REASON-REPLACE-AUDIT-1: Reasoning Game Replacement Audit

## Goal

Decide which current reasoning-game lanes can be kept, wrapped, refactored, or
rebuilt before any adoption/replacement claim is allowed.

## Context

Human review says the current shared-shell tasks are not enough to replace the
reasoning game. The current gate can support local-practice evidence only. This
sprint converts that into an operational replacement audit.

## Quality Standard

Quality floor: the audit must name each reasoning mode, student action,
required context, current task family, replacement readiness, and missing
rendered output proof. It must state the specification requirements, evidence
required to prove them, the human gate that will judge student-facing quality,
included higher-quality improvements, and omitted requirements as follow-up
work.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Do not replace a game with context-poor tasks. | Per-mode context requirement. | Human gate checks repaired lab. | planned |
| Do not treat step ordering as constructed-response proof. | Mode 5 and target-proof boundaries carried. | Audit flags answer-quality gap. | planned |
| Do not call visual flow built when only chain ordering exists. | Mode 3 disposition remains bridge-only. | Audit names visual-flow builder as follow-up. | planned |
| Decide keep/wrap/refactor/rebuild per lane. | File/mode disposition table. | Gate packet cites audit. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Produce a mode-by-mode replacement audit. | include_now | Directly answers the human revise reason. |
| Implement mode 2, mode 4, A81, and A99 immediately. | defer_named_follow_up | They need separate design/proof before adoption. |
| Declare replacement readiness from the repaired lab alone. | reject_scope_creep | The lab is proof of repair, not product replacement. |

## Allowed paths

- `reports/sprints/REASON-REPLACE-AUDIT-1-*`
- `reports/json/reason-replace-audit1.json`
- `references/data/sprints/REASON-REPLACE-AUDIT-1.*.json`
- final gate evidence packet references

## Forbidden paths

- `references/machine/`
- `references/external/`
- generated lesson output
- source reasoning CSV files
- engine implementation
- target-exercise writes, candidate storage, diagnostics, mastery, sequencing,
  Scale Gate 1, or product-use authority

## Inputs

- `reports/json/reason-std1-standard-family-map.json`
- `reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md`
- `reports/sprints/REASON-REVISION-0-human-comment-resolution.md`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/playable-proof.json`

## Outputs

- `reports/sprints/REASON-REPLACE-AUDIT-1-replacement-audit.md`
- `reports/json/reason-replace-audit1.json`
- `reports/sprints/REASON-REPLACE-AUDIT-1-result.md`

## Operationalized sprint procedure

1. List each current reasoning mode and future source/example route.
2. Classify each as keep, wrap, refactor, rebuild, or hold for adoption.
3. Name missing context, visual, feedback, or answer-quality proof per lane.
4. Stop if any lane is marked ready to replace the game without rendered,
   playable, human-reviewed route evidence.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-REPLACE-AUDIT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-REPLACE-AUDIT-1
node build-scripts/review-gates/check-gate-reason-revision1-review-packet.js
node build-scripts/reports/validate-report-json.js
```

## Proof Required to Close

Close only if the audit states that no full reasoning-game replacement is
authorized now, while naming the bounded follow-up sprints needed for mode 2,
mode 4, A81 source-use, A99 examples, UX hierarchy, and visual flow builder.
Closure proof must include review/validator/test evidence from the
sprint-plan checker, sprint-bundle checker, review-packet checker, report JSON
validator, and the rendered-output revision gate that cites this audit.

## Rollback plan

Delete the audit artifacts. Do not alter reasoning engine or lesson output.

## Human review required

No separate human review is required for this audit sprint. The audit is
reviewed in `GATE-REASON-REVISION-1`.
