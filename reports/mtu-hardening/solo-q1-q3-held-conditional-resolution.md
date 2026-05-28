# MTU-H2D Solo q1-q3 Held And Conditional Lane Resolution

Generated: 2026-05-28

Status: resolution packet ready, no mutation authorized.

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution,
candidate-storage creation, candidate writes, lesson-output mutation,
target-exercise promotion, CP-6 closure, Year-1 closure, or student/product
use is authorized.

## Purpose

MTU-H2C executed only the reduced clean Solo q1-q3 lanes: `F19`, `F20`,
`A85`, `A86`, `A87`, and `A91`. MTU-H2D resolves the lanes that remained held
or conditional after GATE-MTU-H2B:

- `A12`
- `A20`
- `A88`
- `A89`
- `A90`
- `A92`
- `A93`

This packet does not execute any CLI command. It prepares the next human-review
gate.

## Lane Disposition Summary

| Unit | Disposition | Reason | Later route |
|---|---|---|---|
| `A12` | revise for later execution gate | Earlier update removed `A2.11`; revised spec retains `A2.11` and can add `A2.10`/`A2.12` if accepted | GATE-MTU-H2D review, then later CLI execution packet |
| `A20` | hold | Active target exercise `4.1.2` uses current `A20` in a given-MK context | Separate split/deprecate/replacement and affected-mapping packet |
| `A88` | revise for later execution gate | Original `A61` dependency over-triggered table selection | Zero-needs scale-factor reliability unit |
| `A89` | revise for later execution gate | Original `A04` dependency over-triggered substitution | Zero-needs GO-as-price recognition unit |
| `A90` | revise for later execution gate | Original lane mixed table, graph, and line-rule routes | Narrow to linear GO-rule MO route; defer table/graph variants |
| `A92` | revise for later execution gate after `A89` | Valid only once `A89` route is accepted | Later execution only after `A89` |
| `A93` | revise for later execution gate after `A92` | Original `A66` dependency imported indirect `A61` risk | Depend on `A38` and `A92`; keep broader incidence in MTU-H3 |

## Revised Routes

### A12

`A12` should be revised only if the update spec retains the live `A2.11`
exam-code link. Recommended exam-code field:

```json
["A2.11", "A2.10", "A2.12"]
```

This keeps the derivative-MO route intact while allowing a later gate to
clarify its monopoly use. The later execution packet must run
`unit-update --dry-run` and prove `A2.11` remains.

### A20

`A20` remains held. The active target exercise `4.1.2` gives `MK = EUR10` and
uses current `A20` in a given-MK context. Direct narrowing to a derived-MK
route would make that mapping stale.

A later packet must classify target-exercise uses, dependent units such as
`A35`, `A36`, and `D30`, and `GEN_A20` generator behavior before any split,
deprecation, replacement, or mapping update.

### A88

Revise `A88` to a zero-needs scale-factor reliability unit. Scale labels such
as `x 1.000` can appear in formulas, tables, graphs, and final answer units;
requiring `A61` would over-trigger table-value selection.

### A89

Revise `A89` to a zero-needs recognition unit. It should teach that GO/P(Q) is
the monopoly price relation. It should not require substitution; `A92` carries
that operation.

### A90

Revise `A90` to the narrower linear-rule route:

```text
P = a - bQ  ->  MO = a - 2bQ
```

Table-based and graph-based non-calculus MO variants remain visible but
deferred. This prevents one unit from becoming too broad again.

### A92

`A92` remains plausible, but only after `A89` is accepted or executed. It
should keep the distinction between the price function and MO visible.

### A93

Revise `A93` to depend on `A38` and `A92`, not `A66`. Keep the pitfall that
percentage price rise is not the same as pass-through or the share of a cost
shock borne by consumers. Broader incidence/pass-through remains MTU-H3.

## Generator Condition

`GEN_A12` and `GEN_A20` have existing skill-tree generator implementations in
`engines/skilltree/generators.js` as `GEN.A12` and `GEN.A20`. If `A12` or
`A20` changes semantics, those generators need impact review.

`GEN_A88`, `GEN_A89`, `GEN_A90`, `GEN_A92`, and `GEN_A93` are proposed
generator fields, but no matching skill-tree generator implementation is
present in this baseline. A later gate must either require generator
implementation before student-facing exposure, explicitly record that these
lanes are generator-blocked/not-yet-interactive, or prove they are not exposed
to the skill-tree route.

## Stop Conditions

Stop if any later answer or packet:

- authorizes hand edits to `references/machine/` or `references/external/`;
- executes or narrows `A20` without a split/replacement and affected-mapping
  plan;
- removes `A2.11` from `A12` without explicit human authorization;
- hides q1/q2 answer-form needs instead of routing them to MTU-H4;
- mutates D07/incidence from this lane instead of routing it to MTU-H3;
- authorizes candidate writes, lesson output, diagnostics, adaptive routing,
  mastery, sequencing, student-facing AI, summative use, PV projection, PV
  machine promotion, or student/product use.

## Recommended Next Action

Run GATE-MTU-H2D as a human review. If accepted, prepare a later bounded CLI
execution packet for revised `A12`, `A88`, `A89`, `A90`, `A92`, and `A93`.
Keep `A20` in a separate split/deprecate/replacement packet.
