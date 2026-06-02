# GATE-TASK-FAMILY-1 Usability-Agent Corrections

Generated: 2026-06-02

Status: corrections applied after round-1 REVISE.

## Corrections

| Finding | Correction |
|---|---|
| Sentence-builder accepted order conflicted with natural reading | Updated the playable lab so the canonical expected order is `prijs-stijgt`, `hogere-prijs`, `vraag-daalt`, while still accepting the previous order as an alternate sequence. |
| Sentence-builder instruction was too vague | Updated the visible purpose to say the fragments should be clicked as oorzaak, context, gevolg. |
| Source-value task required click plus role but did not stage that clearly | Updated the visible purpose to say explicitly: click the old and new source values and choose each role in the dropdown. |
| Correct feedback did not show next action | Added a visible `Ga naar volgende taak` button that appears only after a matched task. |
| Focus handoff was not proved | Extended `capture-gate-task-family1-playable-proof.js` with `desktop-next-action-focus`, proving feedback focus after checking and focus movement into the next task after clicking `Ga naar volgende taak`. |
| Static gallery was being treated as enough | Revised the review packet to require playable lab, playable proof, screenshots, and usability-agent evidence. |
| Human review protocol still referenced interviews | Revised the packet and repository protocol toward direct packet comments by default. |

## Rebuilt Artifacts

- `build-scripts/review-gates/emit-gate-task-family1-playable-lab.js`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-lab.html`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-data.json`
- `build-scripts/review-gates/capture-gate-task-family1-playable-proof.js`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/playable-proof.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/screenshots/gate-task-family1-playable-next-action-focus.png`
- refreshed playable proof screenshots

## Validation

Command run:

```bash
node build-scripts/review-gates/emit-gate-task-family1-playable-lab.js
node build-scripts/review-gates/capture-gate-task-family1-playable-proof.js
```

Result:

- playable lab renders twelve task cards and twelve check buttons;
- retry feedback is captured;
- next-action/focus handoff is captured;
- desktop correct path reaches `12 / 12`;
- mobile/dark correct path reaches `12 / 12`.

## Required Next Action

Run a post-repair usability-agent recheck. If the recheck returns READY or PASS
WITH FLAGS, update the packet as direct-comment review-ready with the compact
repair controls carried as an adoption/accessibility polish flag.
