# Sprint GATE-REASON-REVISION-1: Reasoning Revision Evidence Human Review

## Goal

Prepare a direct-comment human review gate for the reasoning revision evidence:
context repair, mode 3 wording repair, stale-evidence cleanup, and replacement
audit. The gate decides whether the revision evidence is sufficient to proceed
to bounded downstream planning/adoption-preparation, not product use.

## Context

`GATE-REASON-STD-1` was useful but not sufficient. Human feedback required
revision because task context was unclear and current tasks cannot replace the
reasoning game. This gate reviews the repaired evidence.

## Quality Standard

Quality floor: the gate packet must be human-testable. It must include a
playable lab, deterministic proof JSON, screenshot states, rendered output
proof, comment-resolution log, replacement audit, lead review, and
no-authority boundaries. It must state specification requirements, evidence
required, review gate, student-facing quality question, included quality
improvements, and omitted requirements as named follow-up work.

Architecture-only, screenshots-only, or contract-only proof is insufficient.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Human can test improved tasks. | Playable revision lab with visible controls. | Proof JSON and manual-review instruction. | planned |
| Water task context is clear. | Wrong-answer context visible before task. | Checker and screenshots prove presence. | planned |
| Mode 3 wording is honest. | Chain-ordering label; visual-flow boundary. | Checker fails old label. | planned |
| Replacement not authorized. | Replacement audit and authority flags. | Human gate prompt asks adoption boundary. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Use the `GATE-TASK-FAMILY-1` playable proof pattern. | include_now | The user explicitly requested this evidence quality. |
| Add direct human comment prompts. | include_now | Current gate protocol uses direct packet comments. |
| Close product-route adoption in this gate. | reject_scope_creep | Adoption needs later route-specific implementation and proof. |
| Defer mode 2/mode 4/A81/A99 implementation. | defer_named_follow_up | Planning is named; implementation requires separate authority. |

## Allowed paths

- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/`
- `reports/sprints/GATE-REASON-REVISION-1-*`
- `references/data/sprints/GATE-REASON-REVISION-1.*.json`
- map/index/report artifacts

## Forbidden paths

- `references/machine/`
- `references/external/`
- generated Book 1 lesson output
- source reasoning CSVs
- engine implementation
- product-route adoption, target-equivalent proof, diagnostics, mastery,
  sequencing, Scale Gate 1, or student/product use

## Inputs

- `reports/sprints/REASON-REVISION-0-human-comment-resolution.md`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/playable-proof.json`
- `reports/sprints/REASON-REPLACE-AUDIT-1-replacement-audit.md`
- `reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md`

## Outputs

- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/review-packet.md`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/review-packet.json`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/live-output-evidence.md`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/live-output-evidence.json`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/screenshot-manifest.md`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/bundle-urls.md`

## Operationalized sprint procedure

1. Assemble all revised evidence into a review packet with direct-comment
   prompts, calibration checks, stop conditions, and product-authority boundary.
2. Require reviewers to inspect the playable lab and manually try at least one
   case; provide localhost fallback.
3. Run pattern analysis requirements in the packet: calibration checks remain
   visible, returned direct comments are recorded as answers, comments are
   resolved after direct review, targeted follow-ups are asked only for
   ambiguity or conflicting authority, a closure proposal is drafted only after
   comment resolution, explicit human confirmation is required before closure,
   and closure records remote commit/hash.
4. Stop if the packet treats the repaired lab as product-route adoption,
   target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or
   student/product use.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-REASON-REVISION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-REASON-REVISION-1
node build-scripts/review-gates/check-gate-reason-revision1-review-packet.js
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-REASON-REVISION-1-reasoning-revision-evidence-review
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
```

## Proof Required to Close

To close this packet-prep sprint, the gate packet must cite the playable
lab/data/proof, context repair, mode 3 wording repair, stale status cleanup,
replacement audit, lead review artifacts, and remote-publication prerequisite.
Closure proof must
include review/validator/test evidence from the sprint-plan checker,
sprint-bundle checker, playable-lab emitter, playable proof capture,
review-packet checker, report JSON validator, URL-index checks, and the
pre-gate lead-review record.

## Rollback plan

Remove the gate packet and URL bundle artifacts. Keep prior sprint outputs
unless they are specifically invalidated.

## Human review required

Yes. Human reviewers comment directly on the packet. After comments are
received, create a comment-resolution log before closure. A one-question
interview is not the default.
