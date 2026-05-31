# Sprint GAME-ARCH-2: State Ownership

Generated: 2026-05-31

## Purpose

Prevent state drift between graph, math, reasoning, procedure, short-check,
and future checkpoint surfaces.

This file is a planning contract only. It authorizes no storage migration or
engine implementation.

## State Ownership Table

| State | Owner layer | Persistence | Current notes | Rule |
|---|---|---|---|---|
| Route recommendation | shared route layer | derived, not proof | Current route panels derive focus from route config and local progress | May recommend practice; may not diagnose or sequence |
| Route visibility | shared route layer / surface wrapper | not persisted as proof | Rendered by `SkillMapRouteUI` | May be logged in future only as local UX event |
| Skill practice stars | skilltree engine | localStorage `skilltree_global_stars` | Used by route panels and skilltree | Local practice only; no target-equivalent or mastery claim |
| Reasoning practice progress | reasoning UI/engine | localStorage `reasoning_global_progress` and session progress | Existing local progress includes score-like counts | Must remain local practice; future copy should avoid proof language |
| Procedure support score | procedure engine | localStorage per procedure key | Existing support-game result state | Support only; not paragraph proof |
| Graph practice attempt state | graph engine | session only | `GraphicalEngine` stores current results array | Local session progress only |
| Skilltree exercise attempt | skilltree engine/UI | session plus stars after completion | Task-shell results can update stars | Result language must stay practice-focused |
| Task-shell response state | task shell + wrapper | session only | Wrappers collect DOM values and call `TaskShellEngine.evaluateTask` | Shell owns normalized result shape |
| Feedback state | task shell + domain helper | session only | Graph/math/reasoning each adapt feedback | Must use neutral local state: matched, retry, self_check |
| Advisory short-check result | exit-ticket engine/UI | current checkpoint state only | `targetReadinessEvidence: false` for local check | May give advice; may not create proof status |
| Target-equivalent checkpoint result | future checkpoint composition | gated future state | Not implemented for `1.1.2` or `1.1.3` | Only after `L1.7B-Q2` and `GATE-L1.7B-Q2` |
| Completion language eligibility | future gate-approved checkpoint layer | gated, not inferred | No current eligibility | Never inferred from route, stars, or short-check result |

## State Rules

1. Route recommendations are derived from local practice context and route
   configuration. They do not become durable student classification.
2. Shared task-shell result states are local feedback states only:
   `matched`, `retry`, or `self_check`.
3. Skill stars, reasoning counts, and procedure scores may inform local route
   display, but they cannot claim target-equivalent proof or permanent
   mastery.
4. Advisory short-check state may produce advice copy only.
5. Target-equivalent status is a separate future state that must be created by
   a reviewed checkpoint composition and approved gate.
6. No engine may independently persist diagnostics, automatic sequencing,
   summative status, PV status, AI decisions, or broad product-use state.

## Required Future Refactor Direction

Future implementation should introduce a small state adapter so route
consumers do not read each engine's storage directly. The adapter should
return local summaries only:

```json
{
  "paragraph": "1.1.2",
  "surface": "calculation",
  "localPractice": {
    "attempted": true,
    "recommendedFocus": "Procentuele verandering berekenen",
    "nextAction": "Oefen prijsindex"
  },
  "proof": {
    "targetEquivalent": false,
    "source": null
  }
}
```

The `proof.targetEquivalent` field must remain false until the later
target-equivalent exit-ticket gate authorizes a specific route.
