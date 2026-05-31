# Sprint GAME-ARCH-1: Short Check And Exit-Ticket Boundary

Generated: 2026-05-31

## Decision

Keep the short check and the target-equivalent exit ticket as separate product
surfaces.

The current short check is valuable. It should not be removed merely because
the product also needs a stronger exit ticket. Instead, it should become the
lightweight advisory check in the learning route.

## Short Check

Purpose:

- in-between local check;
- route advice;
- early warning that a student should practise a named skill or game;
- optional proceed-for-now advice after a reviewed advisory-copy rule exists.

Allowed role:

- `How am I doing locally?`
- `What should I practise next?`
- `Should I go to the exit ticket now or practise more first?`

Potential advice patterns, subject to later copy review before product use:

- `Oefen nog met [spel of vaardigheid].`
- `Ga door naar de exit-ticket-check.`
- `Je kunt voorlopig verder, maar herhaal [vaardigheid] later nog.`
- `Je kunt voorlopig door naar de volgende paragraaf, maar oefen [vaardigheid] later nog.`

Required boundaries:

- advice is non-binding and local;
- no grade or cijfer;
- no permanent mastery;
- no diagnostic classification;
- no automatic sequencing or unlocking;
- no summative pass/fail;
- no student-facing AI decision;
- no target-equivalent proof;
- no paragraph-completion proof language.

## Target-Equivalent Exit Ticket

Purpose:

- thorough target-level proof task;
- same cognitive level as the paragraph target exercise;
- complete reviewed target-exercise operation-chain coverage;
- matching answer forms;
- local paragraph-completion claim only after review.

Allowed role after the appropriate gate:

- `Have I shown that I can handle the paragraph target exercise?`
- `Can I now proceed to the paragraph target exercise?`

Allowed completion language remains governed by GATE-L1.7B-Q2, for example:

- `Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.`
- `Je kunt nu door naar de eindopgave.`
- `Je hebt deze paragraaf-check succesvol afgerond.`

## Why Separation Matters

If the short check is removed, the route loses a useful low-pressure advisory
moment. If the short check is promoted into proof, the route overclaims and
undercuts the target-equivalent exit-ticket standard.

The correct product model is:

```text
short check = local advice and route guidance
exit ticket = target-equivalent proof task
```

## Roadmap Consequence

GAME-ARCH-2 should include an advisory-check copy and state model. L1.7B-Q2
should remain responsible for the separate target-equivalent exit-ticket
implementation. GATE-L1.7B-Q2 should remain responsible for approving any
paragraph-completion language.

## Product Boundary

This boundary record authorizes no new short-check copy in generated output,
no target-equivalent exit-ticket publication, no diagnostics, no adaptive
routing, no mastery, no sequencing, no summative use, no PV, no Scale Gate 1,
and no student/product use.
