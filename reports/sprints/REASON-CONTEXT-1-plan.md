# Sprint REASON-CONTEXT-1: Reasoning Context And Label Revision Proof

## Goal

Produce review-only playable proof that the reasoning tasks no longer require
students or reviewers to infer missing context, and that mode 3 no longer
overclaims visual flow-diagram construction.

## Context

Human review found the water scarcity case unclear because it asked the student
to correct a wrong answer that was not visibly given. Review also found that
`Stroomdiagram bouwen` is risky language while the current implementation is
only ordered chain construction.

## Quality Standard

Quality floor: every playable review case must show the stimulus, source,
misconception, wrong answer, or prompt being answered before the task controls.
The proof must be rendered and playable, not only a data fixture. It must state
the specification boundary, evidence needed to prove fulfilment, human gate,
included quality improvements, and follow-up work.

The proof must remain review-only and student-facing quality must be judged by
`GATE-REASON-REVISION-1`. Rendered output is required for proof, but no lesson
route or product adoption is authorized by this sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reasoning tasks need visible context. | Playable lab shows context boxes before tasks. | Proof JSON asserts context visibility. | planned |
| Water scarcity wrong-answer context must be explicit. | Lab text includes the student wrong answer. | Checker fails if absent. | planned |
| Mode 3 must not imply full visual flow construction. | Lab title/task label use chain-ordering language. | Checker fails on old overclaim label. | planned |
| Proof must remain review-only. | Lab and data deny replacement/product authority. | Gate checker verifies false authority flags. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add context cards to the playable lab. | include_now | Directly resolves the human review blocker. |
| Rename live product route mode 3 immediately. | defer_named_follow_up | This sprint is review-only adoption preparation. |
| Claim the repaired lab can replace the reasoning game. | reject_scope_creep | Replacement needs `REASON-REPLACE-AUDIT-1` and a human gate. |

## Allowed paths

- `build-scripts/review-gates/emit-gate-reason-revision1-playable-lab.js`
- `build-scripts/review-gates/capture-gate-reason-revision1-playable-proof.js`
- `build-scripts/review-gates/check-gate-reason-revision1-review-packet.js`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/`
- `reports/sprints/REASON-CONTEXT-1-*`
- `references/data/sprints/REASON-CONTEXT-1.*.json`

## Forbidden paths

- `references/machine/`
- `references/external/`
- generated Book 1 lesson output
- `source-data/book-1/reasoning/*.csv`
- engine implementation
- product-route adoption, target-equivalent proof, diagnostics, mastery,
  sequencing, Scale Gate 1, or student/product use

## Inputs

- `build-scripts/review-gates/emit-gate-reason-std1-playable-lab.js`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/gate-playable-reasoning-data.json`
- `reports/sprints/REASON-REVISION-0-human-comment-resolution.md`

## Outputs

- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/gate-playable-reasoning-revision-lab.html`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/gate-playable-reasoning-revision-data.json`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/playable-proof.json`
- `reports/review-gates/GATE-REASON-REVISION-1-reasoning-revision-evidence-review/screenshots/`
- `reports/json/reason-context1-proof.json`
- `reports/sprints/REASON-CONTEXT-1-result.md`

## Operationalized sprint procedure

1. Start from actual `ReasoningEngine` task-shell tasks and overlay only
   review-context and label metadata.
2. Generate the revision lab, data, proof JSON, and screenshots.
3. Verify that the water case shows the wrong answer, mode 3 uses chain
   language, and the lab explicitly denies reasoning-game replacement.
4. Stop if the proof fails, if context is invisible, or if the output mutates
   generated lesson routes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-CONTEXT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-CONTEXT-1
node build-scripts/review-gates/emit-gate-reason-revision1-playable-lab.js
node build-scripts/review-gates/capture-gate-reason-revision1-playable-proof.js
node build-scripts/review-gates/check-gate-reason-revision1-review-packet.js
node build-scripts/reports/validate-report-json.js
git diff --check
```

## Proof Required to Close

Close only if proof JSON records `context_repair_proved`,
`mode3_label_repair_proved`, and `replacement_authority_denied`, screenshots
show the repaired lab, and `GATE-REASON-REVISION-1` can cite the evidence.
Closure proof must include validator/test evidence from the sprint-plan
checker, sprint-bundle checker, playable-lab emitter, playable proof capture,
review-packet checker, and report JSON validator.

## Rollback plan

Delete the revision-lab scripts and gate evidence folder. Do not touch the old
`GATE-REASON-STD-1` evidence or generated lesson output.

## Human review required

No separate human review is required for this sprint. The repaired evidence is
reviewed in `GATE-REASON-REVISION-1`.
