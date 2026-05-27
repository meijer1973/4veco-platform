# GATE-MTU-H2A Gate Closure

Date: 2026-05-27

Decision: PASS WITH CONDITIONS for CLI-execution-gate planning only.

GATE-MTU-H2A reviewed the exact proposed IDs and CLI-spec plan for the Solo
q1-q3 MTU hardening lane. It does not authorize CLI execution, protected
reference mutation, external-source mutation, machine-reference mutation, unit
minting, unit update execution, unit split execution, candidate writes,
lesson-output mutation, CP-6/Year-1 closure, or student/product use.

## Accepted For Later Execution-Gate Packet

- `F19` Maatschappelijke kosten verbaal herkennen.
- `F20` Maatschappelijke kosten uitleggen met voorbeeld.
- `A85` pointwise TO calculation.
- `A86` TVK from constant variable cost / constant MK.
- `A87` unknown fixed costs from profit.
- `A88` scale-factor handling.
- `A89` GO-as-price relation.
- `A90` MO without derivatives.
- `A12` update to derivative-MO route.
- `A91` MO = given MK.
- `A20` update or split into derived-MK route, subject to A20 usage impact
  audit.
- `A92` new price after profit-maximising Q.
- `A93` percentage price change after cost change, with explicit pitfall
  separating price change from incidence/pass-through.

## Conditions Before Any Execution

1. Prove ID availability for `F19`, `F20`, and `A85` through `A93`.
2. Provide schema-valid specs for every new or updated unit.
3. Include generator fields or validator proof for all new A-units.
4. Validate all term links.
5. Audit existing `A20` usage before updating or splitting `A20`.
6. Avoid OR-prerequisite over-requirement for `A90`/`A12`/`A91`.
7. Provide exact command log, before/after diff, rollback instructions, audit
   evidence, unit-index validation, report generation, reference-health
   checks, Jest proof, and no unintended external/candidate/lesson-output
   diff proof.

## Deferred Or Routed Elsewhere

- q1 `Leg-uit-vraag met voorbeeld beantwoorden` remains visible for MTU-H4.
- q2 `Bereken-vraag beantwoorden` remains visible for MTU-H4.
- Broader tax/subsidy/cost-shock incidence and pass-through remain MTU-H3.

## Not Authorized

- protected reference mutation;
- external-source mutation;
- machine-reference mutation;
- unit minting;
- unit update execution;
- unit split execution;
- candidate writes;
- lesson-output mutation;
- CP-6 closure;
- Year-1 closure;
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use.

## Operational Next Action

Start `MTU-H2B` as a bounded CLI execution gate packet. It must prepare exact
commands, expected diffs, rollback, audit, validation, ID-collision, generator,
term-link, `A20` impact, and no-unintended-diff proof. It must still not run
the CLI execution until a later human gate explicitly authorizes execution.
