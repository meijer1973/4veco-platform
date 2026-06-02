# Sprint REASON-ANSWERFORM-2: Mode Disposition

Generated: 2026-06-02

Status: implementation evidence captured; sprint closure blocked until real
planning/lead-review artifacts are available.

## Purpose

This file records which reasoning modes are wrapped by shared task-shell
families, which modes remain local or held, and where answer-form scaffolds are
only practice cues.

## Disposition Table

| Mode | Student label | Shared family route | Disposition | Answer-form status |
|---:|---|---|---|---|
| 0 | Stappen ordenen | `step_ordering` | Wrapped now. | Uses local answer-form cue for the selected problem. |
| 1 | Deelvragen opbouwen | `step_ordering` bridge for claim/reason/evidence planning | Wrapped now as a bridge. | Uses local answer-form cue for the selected problem. |
| 2 | Vind de fout | none yet | Local error-repair only; no shared-shell adoption claim. | Uses local answer-form cue; mapping to `two_tier_choice` or error-repair family deferred. |
| 3 | Stroomdiagram bouwen | `step_ordering` bridge | Wrapped now, with visual flow-diagram builder still follow-up. | Uses local answer-form cue for the selected problem. |
| 4 | Structuren matchen | none yet | Held for classification-with-explanation redesign. | No complete answer-form route claim. |
| 5 | Redeneerantwoord opbouwen | `structured_reasoning` | Wrapped self-check practice. | Uses answer-form cue plus structured self-check; not scored target proof. |
| future | Source-based explanation | `source_value_selection` + `source_chain_builder` + `structured_short_response` | Future composed pattern. | A81 must combine with an underlying answer form. |

## Evidence

- `reports/json/reason-answerform2-scaffold-map.json` records mode disposition
  for 1.1.1 and 1.1.2.
- `reports/sprints/REASON-ANSWERFORM-2-playable-proof.md` records rendered
  evidence for modes 0, 2, 3, and 5.
- `reports/sprints/REASON-ANSWERFORM-2-screenshot-manifest.md` records desktop,
  mobile, and dark-mode screenshots.
- `build-scripts/sprints/check-reason-answerform2-route-output.js` verifies that
  mode 2 remains local and mode 4 remains held rather than being silently
  claimed as unified.

## Carried Flags

- Mode 2 should become a reviewed error-repair or two-tier task family before it
  is treated as a unified shared-shell mode.
- Mode 3 remains an ordered-chain bridge. It is not yet a true visual
  flow-diagram construction task.
- Mode 4 needs a classification-with-explanation redesign before adoption.
- Mobile proof shows the route panel remains present, but after long checked
  tasks it can sit below the first viewport. This remains a usability flag.
