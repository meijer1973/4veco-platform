# Lead Review Assignment

Sprint: `SHARED-TASK-INGEST-PLAYABLE-REPAIR-1`
Date: 2026-06-04
Lead review required: yes

## Assignment

Reviewer role: repair lead and verification reviewer.

Review mandate: inspect the repaired review-only playable labs against `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md`, the baseline, returned direct comments, proof JSON, rendered labs, screenshot evidence, command-log evidence, and the updated gate checker.

Write scope for this review is limited to these five review files:

- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-verification-review.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-assignment.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-round1.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-corrections.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-lead-review-round2.md`

## Review Focus

The lead review must judge whether the repair evidence is ready for renewed human review. The core questions are:

- Are real task-family controls visible, not generic fallback controls?
- Does semantic validation reject wrong input and accept correct input?
- Do proof states include initial, wrong/retry, corrected, desktop completed, mobile completed, and mobile dark completed?
- Are formula/procedure/correction-model supports collapsed by default and separated from default source material?
- Do prompts state concrete action, source/object, answer form, and count expectation?
- Are product authority, official exam authority, protected reference mutation, source-data mutation, generated lesson output, target-equivalent proof, diagnostics, mastery, sequencing, PV, Scale Gate 1, and student/product-use claims still absent?

## Evidence To Inspect

Evidence inspected must include:

- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-baseline.md`
- `build-scripts/sprints/task-ingest-playable-lab.js`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/direct-review-comments.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/comment-resolution-log.md`
- `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-command-log.jsonl`

## Stop Conditions

The lead review must return REVISE if any of these remain true:

- any rendered task-family bank uses generic labels where concrete task objects exist;
- any rendered prompt contradicts the transform task definition or source;
- wrong/retry/corrected/completed proof is missing;
- support boxes are open by default;
- the gate packet checker cannot pass because required metadata or evidence is missing;
- product or authority boundaries are overclaimed.

