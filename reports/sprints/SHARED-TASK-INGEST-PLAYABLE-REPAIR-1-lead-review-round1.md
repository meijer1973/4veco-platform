# Lead Review Summary

Sprint: `SHARED-TASK-INGEST-PLAYABLE-REPAIR-1`
Date: 2026-06-04
Round: 1
Verdict: REVISE

## Scope

Evidence inspected: `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md`, `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-baseline.md`, `build-scripts/sprints/task-ingest-playable-lab.js`, `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`, `build-scripts/sprints/check-task-ingest-transform3-textbook.js`, `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`, `reports/json/task-ingest-transform2-actual-exam-proof.json`, `reports/json/task-ingest-transform3-textbook-proof.json`, `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`, `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`, both screenshot manifests, selected screenshots, direct review comments, comment-resolution log, and `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-command-log.jsonl`.

Review question: whether the repaired playable-lab evidence is ready for renewed human review under the sprint plan quality floor.

## Positive Evidence

- The command log `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-command-log.jsonl` records successful `exit_code: 0` for `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md`, `node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1 --active`, both capture scripts, and both transform checkers.
- I reran `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` and `node build-scripts/sprints/check-task-ingest-transform3-textbook.js`; both passed.
- Proof JSON records all six required cases for both labs: `desktop-initial`, `desktop-wrong-retry`, `desktop-corrected`, `desktop-completed`, `mobile-completed`, and `mobile-dark-completed`.
- Proof JSON records semantic validation enabled, support collapsed by default, no generic option labels by its detector, no plain sequence textareas, wrong/retry proof, corrected proof, and completed proof.
- Visual inspection confirms value banks, role banks, formula/step builders, table options, graph/numeric fields, point fields, calculation fields, and structured fields are largely present.
- Boundary checks are clean for `references/machine`, `references/external`, `source-data`, and Book 1 generated output.
- Actual-exam authority remains external-primary, while textbook authority remains owned-source only and rejects official exam authority.

## Blocking Findings

### LR1-1: Actual-exam source-chain bank renders generic labels

Severity: core_spec_failure

`reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html` renders the actual-exam source-chain buttons as generic role words, for example `source`, `value`, `operation`, `answer`, and `conclusion`. The transform model contains concrete labels such as `Lees Tabel 1 met premie en eigen risico`, `12 x 108,25 + 385 = 1.684`, and `Tot dat jaarbedrag is verhoogd eigen risico voordeliger`, but those labels are not what the student sees in the bank.

This violates the plan requirement for real task-family controls and concrete prompts/action/object/source/answer-form evidence. A source-chain builder with generic role tokens is too close to the returned-human-review blocker the sprint was meant to repair.

### LR1-2: Textbook rendered prompt contradicts the transform task

Severity: core_spec_failure

The rendered textbook lab asks: `Kies uit de tabel hoeveel wordt gevraagd bij een prijs van 4 euro.` The underlying transform task `tb113-table-value` asks for `EUR 1.50`, and the expected answer is `400 ijsjes`. The table itself ranges from EUR 1.00 to EUR 3.00, so the rendered `4 euro` prompt is not a harmless wording issue.

This violates the plan requirement that every card state the exact action, input source, answer form, and count expectation. It also weakens source-output parity and makes the completed proof misleading for a human reviewer.

### LR1-3: Gate packet checker does not pass

Severity: core_spec_failure

`node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` currently fails with:

```text
check-gate-shared-task-ingest-repair1-review-packet: live-output evidence wrong status
```

Static packet inspection also found that `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/review-packet.json` does not yet contain the `playable_repair_review` block expected by the updated checker. Because this sprint prepares evidence for renewed human review, packet/checker readiness is part of the repair floor, not an optional polish item.

## Flags

- The successful command log only covers plan, bundle, capture, and transform check commands. Wider acceptance items such as the gate packet checker, lead-review substance, map/index refresh, dashboard refresh, and platform test run were not successful evidence at round 1.
- The helper/checkers prove many structural affordances, but they did not catch the two visible fidelity defects above. The checker should be strengthened after the rendered defects are fixed.

## Decision

REVISE. The repaired labs are much stronger than the returned baseline, but the actual-exam source-chain bank and textbook table-value prompt are student-facing proof defects. The gate packet checker also fails. The evidence is not ready for renewed human review.

