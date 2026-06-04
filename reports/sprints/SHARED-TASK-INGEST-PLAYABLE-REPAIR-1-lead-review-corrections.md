# Lead Review Corrections

Sprint: `SHARED-TASK-INGEST-PLAYABLE-REPAIR-1`
Date: 2026-06-04
Status: corrections applied and rechecked

## Correction Scope

This reviewer was instructed to write only the five assigned review files. The implementation, checker, proof JSON, rendered lab, packet metadata, roadmap, map, dashboard, source-data, protected-reference, and generated lesson output changes were made outside this review pass and were inspected in place.

## Round 1 Findings And Required Corrections

| Finding | Required correction | Recheck evidence | Status |
|---|---|---|---|
| LR1-1 actual-exam source-chain bank renders generic labels | Render concrete `interaction.nodes[].label` values for `source_chain_builder` banks. The helper fallback should prefer concrete item labels before `nodeRole`, or the actual-exam special-case map should cover the current node IDs. Regenerate the actual-exam lab and screenshots after the fix. | `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html` now contains concrete labels including `Lees Tabel 1 met premie en eigen risico`, `Bereken kosten wettelijke variant`, and `Formuleer grensbedrag met richting`; the old generic `source`/`value`/`answer` button pattern is absent. | resolved |
| LR1-2 textbook rendered prompt says price of 4 euro while transform expects EUR 1.50 | Fix the rendered prompt override for `tb113-table-value` so rendered copy matches the transform/source/expected answer. Regenerate the textbook lab and screenshots after the fix. | `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html` now says `prijs van EUR 1.50`; `prijs van 4 euro` is absent. | resolved |
| LR1-3 gate packet checker fails | Align `live-output-evidence.json` status with the updated checker, add the `playable_repair_review` metadata block after these review files exist, and rerun the gate packet checker. | `live-output-evidence.json` now records `playable_repair_evidence_ready_after_hold_for_playable_repair`, `review-packet.json` contains the `playable_repair_review` block pointing to these five review files, and `node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` passes after the review-file verdict update. | resolved |
| Checker gap: visible source-chain labels and rendered prompt/source parity not caught | Add checker assertions for concrete source-chain button text and transform-prompt/rendered-prompt parity where `displayPrompt` overrides task prompts. | Direct inspection confirms the repaired rendered evidence. The current checker grep did not show explicit assertions for these exact two regressions, so this remains a carry flag for validator strengthening. | carry flag |

## Command Evidence To Preserve

The command log `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-command-log.jsonl` remains part of the evidence bundle because it records successful plan, bundle, capture, and transform checker commands, including:

- `node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `node build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` after source-chain label repair
- `node build-scripts/sprints/check-task-ingest-transform3-textbook.js` after the EUR 1.50 prompt repair

I also reran the two transform checkers locally during review and both passed.

## Correction Decision

The round 1 blockers are resolved in the current evidence. The remaining issue is a non-blocking carry flag: the automated checkers should be strengthened to assert the exact visible-label and prompt/source-parity regressions that were found manually.
