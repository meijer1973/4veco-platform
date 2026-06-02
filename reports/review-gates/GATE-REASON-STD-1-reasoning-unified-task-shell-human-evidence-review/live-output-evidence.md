# GATE-REASON-STD-1 Live Output Evidence

Generated: 2026-06-02

Status: evidence packet prepared for direct-comment human review after
`REASON-STD-1`, `REASON-ADOPT-1`, `REASON-PLAY-1`,
`REASON-ANSWERFORM-2`, and supplemental playable-proof lead review PASS WITH
FLAGS; no human review comments started; no product authority.

## Scope

This evidence covers the current generated Book 1 reasoning route as a local
practice surface and includes a playable review lab that humans can test:

- shared task-shell adoption for modes 0, 1, 3, and 5;
- playable route proof and screenshot proof for reasoning practice;
- usability-agent analysis of whether the route is understandable without
  excessive trial-and-error;
- answer-form scaffold cues for `Leg uit dat`, `Leg uit of`, future `Leg uit
  met voorbeeld`, and source-use modifier patterns;
- held/local status for mode 2 and mode 4.

The evidence is review-only. It does not authorize target-equivalent reasoning
proof, generated output mutation, source-data mutation, diagnostics, adaptive
routing, mastery, sequencing, Scale Gate 1, or student/product use.

## Playable Review Lab

Playable lab:
`reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/gate-playable-reasoning-lab.html`

Playable data:
`reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/gate-playable-reasoning-data.json`

Playable proof:
`reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/playable-proof.json`

The lab is generated from current reasoning-engine task-shell objects:

- `1.1.1` mode 0 from platform source CSV;
- `1.1.2` mode 1 from platform source CSV;
- `1.1.3` mode 3 from generated lesson reasoning data;
- `1.1.2` mode 5 from platform source CSV.

The playable proof verifies:

- four playable cases and four visible `Controleer case` buttons render;
- empty submission produces retry feedback;
- correct submission exposes a next-action/focus handoff;
- desktop correct path reaches `4 / 4`;
- mobile/dark correct path reaches `4 / 4`;
- no hidden expected-state lookup is required after repair.

Supplemental lead review:
`reports/sprints/GATE-REASON-STD-1-lead-review-playable-proof-recheck.md`

That recheck records `PASS WITH FLAGS`, confirms the proof is now human-testable
in the `GATE-TASK-FAMILY-1` style, and carries one review instruction: the
auto-play/correct-path helper is useful proof, but human reviewers should still
manually test at least one case.

If direct `file://` opening blocks scripts, serve the repository root with a
local static server and open the lab via `http://127.0.0.1:<port>/...`.

## Evidence Chain

| Sprint | Current evidence | Review use |
|---|---|---|
| `REASON-STD-1` | standard-family map and generated engine proof | shows modes 0, 1, 3, and 5 can be represented through shared task-shell families |
| `REASON-ADOPT-1` | generated route proof and screenshots | shows the shared task-shell families render in Book 1 reasoning pages |
| `REASON-PLAY-1` | screenshot proof plus two usability-agent reports | shows the route is playable enough for local practice with carried UX flags |
| `REASON-ANSWERFORM-2` | scaffold map, playable proof, screenshots | shows local answer-form cues without internal-code or product-claim leakage |

## Shared Task-Shell Evidence

Current route status by reasoning mode:

| Mode | Student-facing lane | Current shared-shell status | Gate issue |
|---|---|---|---|
| 0 | Stappen ordenen | adopted as `step_ordering` | decide whether this is acceptable local practice evidence |
| 1 | Deelvragen opbouwen | adopted as `step_ordering` bridge for claim-reason-evidence | decide whether the bridge is acceptable while richer constructed response remains future work |
| 2 | Vind de fout | local error repair only | preserve held/deferred status for reviewed two-tier/error-repair adoption |
| 3 | Stroomdiagram bouwen | adopted as ordered-chain bridge over `step_ordering` | preserve flag that this is not true visual flow-diagram construction |
| 4 | Structuren matchen | held/refactor-scoped | preserve held status until classification-with-explanation design |
| 5 | Redeneerantwoord opbouwen | `structured_reasoning` self-check only | preserve self-check boundary and no evaluated reasoning proof |

## Screenshot Proof

Screenshots copied into the gate folder for human review:

| Screenshot | Purpose |
|---|---|
| `screenshots/reason-adopt-mode0-initial.png` | `1.1.1` mode 0 initial shared-shell step-ordering route |
| `screenshots/reason-adopt-mode1-matched.png` | `1.1.2` mode 1 matched claim-reason-evidence bridge with next action |
| `screenshots/reason-adopt-mobile-mode3.png` | `1.1.3` mobile mode 3 ordered-chain bridge proof |
| `screenshots/reason-play-mode0-retry-feedback.png` | wrong-order retry state with local task-shell and global reasoning feedback |
| `screenshots/reason-play-mode1-next-action.png` | correct mode 1 answer with next-action proof |
| `screenshots/reason-play-dark-mode5.png` | dark-mode structured reasoning self-check and route proof |
| `screenshots/reason-play-mobile-route-placement.png` | mobile route-panel placement after a long checked mode 3 task |
| `screenshots/reason-answerform-a98-cue.png` | `Leg uit of` scaffold cue in mode 5 |
| `screenshots/reason-answerform-a97-index-cue.png` | `Leg uit dat` scaffold cue for index-points reasoning |
| `screenshots/reason-answerform-mobile-mode3.png` | mobile checked chain with answer-form scaffold and route context |
| `screenshots/gate-reason-std1-playable-initial.png` | playable lab initial state with four testable cases |
| `screenshots/gate-reason-std1-playable-retry-feedback.png` | empty submission retry feedback in the playable lab |
| `screenshots/gate-reason-std1-playable-next-action-focus.png` | next-action/focus handoff after a correct case |
| `screenshots/gate-reason-std1-playable-completed.png` | desktop playable lab completion at `4 / 4` |
| `screenshots/gate-reason-std1-playable-mobile-dark-completed.png` | mobile/dark playable lab completion at `4 / 4` |

## Playability And Usability Evidence

`REASON-PLAY-1` records two separate usability-agent reports and a consolidated
analysis. Those agents found the route broadly understandable, with hesitation
concentrated in:

- compact move/remove controls in ordered selections;
- dual feedback after checking, because local task-shell feedback and global
  reasoning feedback are both visible;
- mobile route-panel placement after long checked mode 3 tasks;
- mode 3 wording, because it is an ordered-chain bridge rather than a full
  visual flow diagram;
- dark theme consistency around the broader route/progress surroundings.

The deterministic screenshot capture separately performed rendered interactions
through a local static server and headless browser. It records matched and retry
states, next-action visibility, mobile state, and dark-mode state.

## Answer-Form Scaffold Evidence

`REASON-ANSWERFORM-2` adds local practice cues for answer construction:

- `A97` / `Leg uit dat`;
- `A98` / `Leg uit of`;
- `A99` / `Leg uit met voorbeeld` as catalog/scaffold, with live evidence still
  missing in `1.1.1` and `1.1.2`;
- `A81` / source-use modifier, requiring an underlying answer form;
- `A96` / calculation coordination metadata.

The rendered proof records no internal answer-form code leakage and no
product-claim leakage. A81 remains a future source-use modifier and is not
treated as a standalone complete answer form.

## Validator And Proof Inputs

The gate packet cites:

- `reports/json/reason-std1-proof.json`
- `reports/json/reason-std1-standard-family-map.json`
- `reports/json/reason-adopt1-proof.json`
- `reports/json/reason-play1-screenshot-proof.json`
- `reports/json/reason-play1-usability.json`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/gate-playable-reasoning-lab.html`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/gate-playable-reasoning-data.json`
- `reports/review-gates/GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review/playable-proof.json`
- `build-scripts/review-gates/emit-gate-reason-std1-playable-lab.js`
- `build-scripts/review-gates/capture-gate-reason-std1-playable-proof.js`
- `reports/sprints/GATE-REASON-STD-1-lead-review-playable-proof-recheck.md`
- `build-scripts/sprints/check-reason-std1.js`
- `build-scripts/sprints/check-reason-adopt1-route-output.js`
- `build-scripts/sprints/check-reason-play1-usability.js`
- `build-scripts/sprints/check-reason-answerform2-route-output.js`
- `build-scripts/review-gates/check-gate-reason-std1-review-packet.js`

## Boundary Evidence

All product-boundary flags remain false:

- no generated lesson output from this gate sprint;
- no source-data mutation;
- no engine implementation in this gate sprint;
- no product-route adoption authority;
- no target-equivalent reasoning proof;
- no diagnostics;
- no adaptive routing;
- no mastery;
- no sequencing;
- no student-facing AI;
- no summative use;
- no PV projection or machine promotion;
- no Scale Gate 1;
- no student/product use.

## Human Review Note

The human reviewer should comment directly on the review packet after
inspecting this evidence, the screenshots, the proof JSON files, usability-agent
analysis, and the pre-gate lead review. The reviewer should decide whether the
reasoning route evidence is acceptable as local practice integration evidence
and what bounded follow-up planning may proceed.
