# REASON-PLAY-1 Usability-Agent Assignment

Generated: 2026-06-02

Status: assignment ready for separate usability-agent testing; no product
authority.

## Purpose

Test whether the generated Book 1 reasoning route is understandable and
playable after `REASON-ADOPT-1`. Agents must behave like student-facing
usability reviewers: inspect the rendered page, try the task, record observable
actions and hesitations, and decide whether the route can be completed without
hidden instructions or excessive trial-and-error.

Do not report private chain-of-thought. Report only observable decision points:
what was visible, what was clicked, where the tester hesitated, what feedback
was shown, whether retry/next action was clear, and whether the tester could
explain what to do next.

## Exact Generated Pages

Book root:

`C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod`

Generated reasoning pages:

| Paragraph | Page |
|---|---|
| `1.1.1` Schaarste en economisch denken | `C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken\1.1.1 Schaarste en economisch denken – redeneer-spel.html` |
| `1.1.2` Percentages en indexcijfers | `C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.2 Percentages en indexcijfers\1.1.2 Percentages en indexcijfers – redeneer-spel.html` |
| `1.1.3` Grafieken en tabellen | `C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.3 Grafieken en tabellen\1.1.3 Grafieken en tabellen – redeneer-spel.html` |

Note: on disk the generated filenames use an en dash before
`redeneer-spel.html`; tooling may normalize display differently. Use the exact
existing file path if a shell listing shows the en dash variant.

## Required Mode Coverage

Each agent must inspect or attempt all four adopted/preserved surfaces:

| Required case | Paragraph | Mode | Expected family/status |
|---|---|---:|---|
| Mode 0 ordering | `1.1.1` | `0` | shared `step_ordering` |
| Mode 1 claim/reason/evidence bridge | `1.1.2` | `1` | shared `step_ordering` bridge |
| Mode 3 flow bridge | `1.1.3` | `3` | shared `step_ordering` ordered-chain bridge |
| Mode 5 reasoning answer self-check | `1.1.1` | `5` | preserved `structured_reasoning` self-check |

Modes `2` and `4` are not adopted. Agents may notice them, but must not treat
them as unified shared-shell routes.

## Required Observations Per Case

For each required case, record:

- initial goal clarity: what the student is being asked to do;
- route context clarity: whether paragraph/focus/route context is visible;
- clickable-control clarity: what controls look actionable;
- click path: selected tokens/options, submit/check button, retry or next
  button;
- hesitation points: any control or label that required guessing;
- feedback clarity: whether the feedback explains correct/wrong state;
- dual-feedback judgment: whether local task-shell feedback plus global
  reasoning feedback feels coherent or competing;
- retry and next-action clarity;
- completion judgment: completed without trial-and-error / completed with minor
  hesitation / completed only by trial-and-error / blocked.

## Required UX Risk Checks

Each agent must explicitly decide:

1. Is dual feedback acceptable, confusing, or blocking?
2. Is the mobile/narrow route panel still findable after a checked long task?
3. Is dark-mode route-panel contrast readable enough?
4. Are the compact move/remove controls understandable enough for adoption
   evidence, or should they remain an accessibility/adoption flag?
5. Does mode 3 honestly feel like an ordered-chain/flow bridge rather than a
   full flow-diagram construction task?

## Forbidden Claims

Do not claim:

- target-equivalent reasoning readiness;
- completion-language authority;
- diagnostics;
- adaptive routing;
- mastery;
- sequencing;
- student-facing AI;
- summative use;
- PV projection or promotion;
- Scale Gate 1;
- product-wide or student-use authority.

## Requested Output

Return:

- PASS, PASS WITH FLAGS, REVISE, PAUSE, or FAIL;
- one short finding table per required case;
- a summary of whether the game was understandable immediately or required
  trial-and-error;
- required repairs, if any;
- carried flags for later `REASON-ANSWERFORM-2`, `REASON-FLOW-1`, or
  `GATE-REASON-STD-1`.
