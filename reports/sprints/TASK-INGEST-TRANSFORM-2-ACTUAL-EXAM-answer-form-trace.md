# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Answer Form Trace

Generated: 2026-06-05

Status: revised for `SHARED-TASK-INGEST-PLAYABLE-REPAIR-4` and reviewer
calculation-shortcut correction.

## Required Answer Form

The official correction-model answer needs visible calculation work and a
threshold conclusion. The revised review lab uses three required cards at most:

1. conceptual comparison setup;
2. calculation with visible work;
3. conclusion with direction.

## Accepted Evidence Shape

| Lane | Task | Required form |
|---|---|---|
| source use | `q3-source-values` | choice that annual premium plus deductible exposure must be compared |
| calculation work | `q3-calculation` | accepts either full annual-cost work (`108,25 x 12`, `+ 385`, `86,25 x 12`, `1684 - 1035 = 649`) or the premium-difference shortcut (`22x12 = 264`, `264 + 385 = 649`); accepts yearly unit variants such as `euro`, `euros`, `EUR per jaar`, `euros per year`, and `per jaar` |
| constructed conclusion | `q3-threshold-direction` | task-2 value carried forward as `EUR 649 per jaar`; constrained direction `lager dan`; answer sentence follows from those controls |

Targeted feedback:

- number correct, unit wrong: `Het bedrag klopt. Controleer alleen de eenheid.`
- final answer correct, work missing: `Het eindantwoord klopt. Laat nog zien hoe je eraan komt.`
- number wrong: `Controleer eerst de jaarpremies en het verschil.`

Progressive review-lab support appears after repeated failed attempts: first a
hint, then partial setup, then `Toon uitwerking`.

The checker explicitly accepts reviewer-style work
`22x12 = 264, 264 + 385 = 649` with a yearly unit. It still rejects an empty
work field with final answer `649`.

## Rejected Reductions

- final answer field alone;
- lowest-premium-only reasoning;
- formula-builder card as required evidence;
- step-ordering card as required evidence;
- source-chain card with answer-bearing nodes as required evidence.
- repeated value dropdown plus role dropdown rows as the visible source task;
- select-all-numbers table-cell task as required evidence;
- free-text direction entry that does not consume the calculated value.

The source-use task is a modifier, not standalone proof. This artifact remains
not target-equivalent and not product-authorized.
