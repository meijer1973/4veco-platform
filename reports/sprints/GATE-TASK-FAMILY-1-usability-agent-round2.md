# GATE-TASK-FAMILY-1 Usability-Agent Round 2

Generated: 2026-06-02

Status: READY for direct-comment human review with carried polish flag.

## Scope

Post-repair usability recheck of the playable lab after round-1 corrections.
The agent was instructed not to edit files and to focus on the earlier
blockers.

## Method

The agent tested the live lab in the in-app browser at the local review URL,
manually exercised the repaired sentence-builder and source-value tasks, used
the lab's correct-path control to verify aggregate completion, inspected
`playable-proof.json`, and spot-checked the mobile/dark completed screenshot.

## Resolved Findings

- Sentence builder now accepts the natural order:
  `De prijs stijgt -> bij een hogere prijs -> de gevraagde hoeveelheid daalt`.
- Hidden expected-state lookup is no longer needed for the repaired
  sentence-builder task.
- Source-value selection now explicitly states that the reviewer must click
  the old/new source values and choose each role in the dropdown.
- Correct feedback exposes `Ga naar volgende taak`.
- The proof records next-action focus moving to the next task.
- The lab reached `12 / 12 taken afgerond` live.
- `playable-proof.json` reports desktop completed and mobile/dark completed
  cases with `matchedStates: 12`.

## Remaining Flag

Compact repair controls `‹`, `›`, and `x` remain visually terse. They have
useful ARIA labels and did not block completion or proof. Carry this as a
route-adoption/accessibility polish flag, not as a blocker for this review
packet.

## Verdict

Ready for sending to direct-comment human review.

## Required Next Action

Update the review packet, live-output evidence, screenshot manifest, and
checker so direct-comment review cannot start without the playable lab,
playable proof, usability-agent artifacts, and remote-published evidence.
