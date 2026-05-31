# Sprint GAME-ARCH-2: Feedback Ownership

Generated: 2026-05-31

## Purpose

Define who owns feedback so graph, math, reasoning, procedure, advisory check,
and checkpoint routes do not drift into separate feedback systems.

## Feedback Ownership Table

| Feedback type | Owner | Allowed content | Not allowed |
|---|---|---|---|
| Generic match/retry/self-check card | shared task shell | What was checked, what happened, what to try next | Grade, diagnosis, proof, mastery, automatic route decision |
| Task-family validation message | shared task shell | Missing input, retry, self-check criteria | Domain-specific overreach or completion language |
| Graph/table explanation | graph module | Source/table value, axis convention, interpolation, graph-specific repair cue | Generic route/proof language |
| Calculation explanation | math module | Formula, substitution, work capture, final answer, notation/unit repair cue | Paragraph proof or broad mastery |
| Reasoning explanation | reasoning module | Missing causal link, wrong direction, unsupported claim, example chain | Evaluated exam-proof claim unless future answer-model layer approves |
| Advisory short-check advice | advisory check module + route layer | Practise a named skill/game, proceed to exit ticket, continue while revisiting weak skill later | Diagnostic label, sequencing decision, target-equivalent proof |
| Target-equivalent completion feedback | future checkpoint composition + gate | Local paragraph-completion language after approval | Any use before `GATE-L1.7B-Q2` |
| Landing next-action copy | landing route integration | Surface link and local recommendation | Claim that route completion proves target exercise |

## Canonical Feedback Grammar

All local feedback should follow this order:

1. Name what was checked.
2. State what the student did locally.
3. Give one repair or confirmation cue.
4. Offer the next practice/check action.

Example shape:

```text
Je hebt de tabelwaarde gecontroleerd.
Kijk nog naar het jaartal en de eenheid.
Oefen daarna de grafiekstap of probeer de volgende taak.
```

The copy remains local and neutral.

## Current Drift Risks

| Surface | Drift risk | Architecture response |
|---|---|---|
| Graph route | Wrapper renders its own feedback region and graph-specific feedback helpers | Keep graph-specific cues, align generic region/focus/card shape with task shell |
| Math route | Skilltree owns exercise results, stars, and next-action copy | Keep exercise flow, route result language through local-only grammar |
| Reasoning route | Multiple feedback formats across modes | Keep reasoning-chain displays, normalize next-action and self-check feedback |
| Procedure support | Score/progress can look stronger than support practice | Keep support wording and avoid proof language |
| Exit ticket | Checkpoint feedback can be confused with target-equivalent proof | Split advisory short-check and target-equivalent checkpoint modes |

## Future Answer-Model Layer

Answer-model or operation-chain feedback may later provide stronger evidence
for constructed responses. That layer must not be hidden inside broad MTUs or
ordinary task-shell feedback. It needs a separate reviewed contract for:

- answer-form criteria;
- correction-model references where relevant;
- accepted alternatives;
- point-rule or rubric boundaries;
- local paragraph-completion language eligibility.

Until that contract exists, structured reasoning and short constructed
responses remain self-check or local practice feedback.
