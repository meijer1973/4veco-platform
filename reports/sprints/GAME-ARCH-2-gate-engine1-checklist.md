# Sprint GAME-ARCH-2: GATE-ENGINE-1 Checklist

Generated: 2026-05-31

## Purpose

Prepare the later human-review gate so it reviews live rendered output and
concrete architecture evidence, not only contracts.

`GATE-ENGINE-1` remains a later gate. This checklist does not close it.

## Required Evidence Before Gate Interview

| Evidence | Required content |
|---|---|
| Live rendered output | Open current Book 1 `1.1.1`, `1.1.2`, and `1.1.3` landing/practice/check routes in browser |
| Student-path trace | Landing page -> route panel -> practice/check surface -> task shell -> feedback -> next action |
| Architecture map | `reports/sprints/GAME-ARCH-2-architecture-map.md` |
| Route API | `reports/sprints/GAME-ARCH-2-route-api.md` |
| Task-shell API | `reports/sprints/GAME-ARCH-2-task-shell-api.md` |
| File disposition | `reports/sprints/GAME-ARCH-2-file-disposition.md` |
| State ownership | `reports/sprints/GAME-ARCH-2-state-ownership.md` |
| Feedback ownership | `reports/sprints/GAME-ARCH-2-feedback-ownership.md` |
| Target-operation coverage | `reports/sprints/GAME-ARCH-2-target-operation-coverage.md` |
| Route-output validators | graph, math, and reasoning route-output checks |
| Product-boundary proof | No target-equivalent, diagnostic, mastery, sequencing, summative, PV, Scale Gate 1, or product-use claims |

## Gate Questions To Prepare

| Review area | Gate question |
|---|---|
| Shared route | Does each practice/check surface show a coherent route with paragraph target, recommended focus, local progress, and no internal codes? |
| Shared task shell | Are overlapping task families rendered through the shared shell instead of duplicated engine UI? |
| Graph/table route | Does the graph route remain the reference pattern, and does it cover table, graph reading, axis, interpolation, point placement, and calculation interactions? |
| Math/calculation route | Does math practice align with the `1.1.2` operation chain rather than only generic calculation practice? |
| Reasoning route | Does reasoning practice support answer-form and constructed-response needs enough for the next refactor? |
| Advisory short check | Is the short check useful as local route advice without proof or diagnostic claims? |
| Target-equivalent exit ticket | Is it still separate, held, and not replaced by the short check? |
| State ownership | Are local progress, route recommendation, feedback, and checkpoint/proof states separated? |
| Feedback ownership | Is feedback useful, neutral, and consistent across surfaces? |
| Keep/refactor/rebuild | Which files/modules are kept, wrapped, deprecated, rebuilt, or held? |

## Stop Conditions For GATE-ENGINE-1

Stop the gate if any live output or artifact:

- exposes internal MTU/generator/operation IDs to students;
- treats short-check output as target-equivalent proof;
- weakens the exit ticket into an advisory check;
- claims grade, diagnosis, mastery, automatic sequencing, summative status,
  AI decision, PV status, Scale Gate 1, or product-use authority;
- relies on contracts while live route/task output is missing or broken;
- cannot name keep/refactor/rebuild/hold for each engine component;
- hides graph, math, reasoning, or checkpoint-specific exceptions outside the
  shared route/task architecture.

## Possible Gate Outcomes

| Outcome | Meaning |
|---|---|
| Continue refactor | Shared route/task shell are coherent enough; next sprints may refactor named modules |
| Rebuild one module | A specific engine path cannot be wrapped cleanly and needs a later rebuild sprint |
| Hold and revise architecture | GAME-ARCH-2 is too vague or mismatched to live output |
| Allow controlled production | Only possible if live output and boundaries satisfy the gate; still no target-equivalent claims unless later gates approve |
| Pause for roadmap correction | Product, gate, or roadmap authority conflicts with evidence |

## Gate Boundary

Even if GATE-ENGINE-1 passes, it does not by itself authorize target-equivalent
completion language, diagnostics, adaptive routing, mastery, sequencing,
summative use, student-facing AI, PV projection, PV machine promotion, or Scale
Gate 1. Those remain separately gated.
