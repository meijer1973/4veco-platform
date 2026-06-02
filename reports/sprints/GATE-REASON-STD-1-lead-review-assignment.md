# GATE-REASON-STD-1 Lead Review Assignment

Generated: 2026-06-02

Sprint: `GATE-REASON-STD-1`

## Assignment

Run pre-gate lead review for the direct-comment human review packet:

`reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/review-packet.md`

The lead reviewer must inspect the packet, live-output evidence, screenshots,
proof JSON, usability-agent artifacts, carried flags, and checker logic before
the packet is sent for human comments.

## Required Evidence To Inspect

- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/review-packet.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/review-packet.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/live-output-evidence.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/live-output-evidence.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/screenshot-manifest.md`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/screenshots/`
- `reports/json/reason-adopt1-proof.json`
- `reports/json/reason-play1-screenshot-proof.json`
- `reports/json/reason-play1-usability.json`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- `reports/sprints/REASON-PLAY-1-usability-analysis.md`
- `reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md`
- `build-scripts/review-gates/check-gate-reason-std1-review-packet.js`

## Review Questions

1. Is the evidence package complete enough for direct human comments?
2. Are screenshots and proof artifacts concrete enough for a reviewer to assess
   actual rendered reasoning behavior?
3. Does the packet preserve the direct-comment protocol and avoid the old
   interview-default flow?
4. Are held/local lanes clear: mode 2 local only, mode 4 held, mode 3 ordered
   bridge only, mode 5 self-check only?
5. Are answer-form scaffold boundaries clear: A97/A98 local cues, A99 live gap,
   A81 modifier-only?
6. Are product-authority flags strict enough?
7. What corrections are required before human comments?

## Required Output

Produce:

- `reports/sprints/GATE-REASON-STD-1-lead-review-round1.md`
- if needed, `reports/sprints/GATE-REASON-STD-1-lead-review-corrections.md`
- `reports/sprints/GATE-REASON-STD-1-lead-review-round2.md`

Use the repository lead-review format with evidence inspected, review plan,
consolidated verdict, blocking findings, specialist findings, test evidence,
learning quality evidence, student experience evidence, ownership/handoff, and
required next action.
