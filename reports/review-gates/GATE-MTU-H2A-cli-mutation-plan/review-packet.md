# GATE-MTU-H2A Solo q1-q3 CLI-Mutation Plan Review Packet

Generated: 2026-05-27

Status: review packet ready, no mutation authorized.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No unit update execution authorized. No unit split execution
authorized. No candidate-storage creation authorized. No candidate writes
authorized. No lesson-output mutation authorized. No CP-6 or Year-1 closure
authorized. No student/product use authorized.

## Review Scope

The reviewer should decide whether the MTU-H2A exact ID and CLI-spec plan is
adequate for a later bounded CLI execution gate. The reviewer should not
authorize direct mutation from this packet unless a later closure explicitly
names exact CLI commands, rollback, audit log, validation evidence, and
execution authority.

Evidence base:

- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.md`
- `reports/mtu-hardening/solo-q1-q3-canonical-cases.json`
- `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/gate-closure.json`
- `references/machine/micro-teaching-units.json` as read-only context
- `build-scripts/references/unit-add.js`
- `build-scripts/references/unit-update.js`
- `references/reference-team-roadmap.md`

## Planned Unit Spec Summary

These rows are planning specs only. They are not live unit IDs or mutation
authority. Full proposed specs live in
`reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`.

| ID | Name | Kern | Needs | Exam codes | Mastery / prior / aspects | Terms | Procedure / pitfalls | Generator | Command | Rollback / affected units / known risks |
|---|---|---|---|---|---|---|---|---|---|---|
| `F19` | Maatschappelijke kosten verbaal herkennen | Recognize external/social costs not borne by the direct user or producer. | none | `F2.4` | understand / new_this_year / verbaal | none | zero-needs reviewed; pitfall is over-triggering formal MPC/MSC machinery | n/a | `unit-add` | rollback by revert/deprecate lane; `F16` support-only; risk: q1 must not require full welfare-loss apparatus |
| `F20` | Maatschappelijke kosten uitleggen met voorbeeld | Give a context-specific example and explain why the cost is external/social. | `F19` | `F2.4` | apply / new_this_year / verbaal | none | example, bearer, non-payment by user/producer, external-cost conclusion; avoid example-only answers | n/a | `unit-add` | rollback by revert/deprecate lane; `F16` formal support-only; risk: answer-form need must still route to MTU-H4 |
| `A85` | Totale opbrengst puntberekening: TO = P x Q | Calculate total revenue from one price and one quantity without constructing a full TO function. | `A04` | `A2.1` | apply / new_this_year / rekenen, verbaal | none | identify matching P and Q, use `TO = P x Q`, check scale; avoid full `A07` over-trigger | `GEN_A85` | `unit-add` | rollback by revert/deprecate lane; `A21` support-only; risk: q2 must not require full TO-function construction |
| `A86` | TVK berekenen uit constante variabele kosten | Calculate total variable cost from constant variable cost per unit and quantity. | `A04` | `A2.1`, `A2.11` | apply / new_this_year / rekenen, verbaal | `variabele-kosten` | identify unit variable cost and Q, use `TVK = v x Q`, check unit; avoid treating unit cost as total cost | `GEN_A86` | `unit-add` | rollback by revert/deprecate lane; `D02` conceptual support-only; risk: break-even route is not primary |
| `A87` | Onbekende vaste kosten berekenen uit winstvergelijking | Solve `W = TO - (TVK + TCK)` for unknown fixed costs. | `A02`, `A85`, `A86` | `A2.1`, `A2.11` | apply / new_this_year / rekenen, verbaal | `winst` | write equation, substitute, isolate `TCK`, state amount and scale; avoid treating `A21` as sufficient | `GEN_A87` | `unit-add` | rollback by revert/deprecate lane; `A21` formula support-only; risk: algebra inversion hidden inside profit concept |
| `A88` | Schaalfactoren in examencijfers toepassen | Handle labels such as `x 1.000` in formulas, graphs, and final answers. | `A61` | `A2.1`, `A2.4` | apply / new_this_year / rekenen, verbaal, grafisch | none | find scale label, choose displayed or real units, apply consistently; avoid thousand/unit mismatch | `GEN_A88` | `unit-add` | rollback by revert/deprecate lane; no affected existing unit; risk: unit/scale reliability remains implicit |
| `A89` | GO herkennen als prijsfunctie van de monopolist | Recognize GO/demand as the monopoly price relation `P(Q)`. | `A04` | `A2.10` | understand / new_this_year / rekenen, verbaal | none | use GO for price after Q; avoid using MO as price | `GEN_A89` | `unit-add` | rollback by revert/deprecate lane; `A20`/`A35` support-only; risk: q3 price step hidden inside profit-max route |
| `A90` | MO bepalen zonder afgeleiden | Determine/use MO through table, graph, or linear rule before calculus. | `A01`, `A89` | `A2.10`, `A2.12` | apply / new_this_year / rekenen, grafisch, verbaal | none | table/graph/rule route; avoid making derivative route mandatory | `GEN_A90` | `unit-add` | rollback by revert/deprecate lane; `A12` derivative route only after update; risk: calculus-only sequencing |
| `A12` | MO bepalen met afgeleide | Update live `A12` to clarify derivative MO from TO. | `A11`, `A07` | `A2.10`, `A2.12` | apply / new_this_year / grafisch, rekenen | none | construct TO, differentiate to MO, keep MO distinct from price; avoid using this route when non-calculus route suffices | `GEN_A12` | `unit-update` | rollback via previous `A12` JSON; affected live unit `A12`; risk: hiding `A90` as alternative route |
| `A91` | MO = gegeven MK oplossen | Solve `MO = MK` when MK is a given constant/value. | `A02` | `A2.10`, `A2.12` | apply / new_this_year / rekenen, verbaal | `marginale-kosten` | use available MO, given MK, solve Q*, do not derive MK; avoid OR-prerequisite over-requirement | `GEN_A91` | `unit-add` | rollback by revert/deprecate lane; `A20` too broad; risk: depending on both `A90` and `A12` would force two routes |
| `A20` | MO = afgeleide MK oplossen | Update or split live `A20` as derived-MK route only after usage audit. | `A12`, `A13`, `A02` | `A2.10`, `A2.12` | apply / new_this_year / rekenen, verbaal | `marginale-kosten` | derive MO and MK, set equal, solve Q*; avoid using when MK is given | `GEN_A20` | `unit-update` or later `unit-split` | rollback via previous `A20` JSON; affected live unit `A20`; risk: active broad/given-MK uses require split/deprecate route |
| `A92` | Nieuwe prijs bepalen na winstmaximaliserende Q | Substitute Q* into GO/P(Q) to determine the new price. | `A04`, `A89` | `A2.10`, `A2.12` | apply / new_this_year / rekenen, verbaal | none | take Q*, use price function not MO, compute price; avoid old-price or MO-as-price mistakes | `GEN_A92` | `unit-add` | rollback by revert/deprecate lane; `A35` broader support-only; risk: full monopoly profit route over-trigger |
| `A93` | Procentuele prijsverandering na kostenverandering | Calculate percentage price change with old price as denominator and distinguish it from pass-through. | `A38`, `A66`, `A92` | `A2.4`, `A2.10`, `A2.12` | apply / new_this_year / rekenen, verbaal | none | old/new price, price change, divide by old price; explicit pitfall: percentage price rise is not the same as percentage of cost shock passed on | `GEN_A93` | `unit-add` | rollback by revert/deprecate lane; `A38` generic support and `D07` deferred to MTU-H3; risk: blurring price-change and incidence |

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews the MTU-H2A exact ID and CLI-spec plan only and does not
   authorize protected reference mutation, machine-reference mutation, unit
   minting, unit update execution, lesson output, or student/product use.
2. Proposed IDs `F19`, `F20`, and `A85` through `A93` are planning proposals,
   not live unit IDs, until a later explicitly authorized CLI execution sprint
   runs.

If either answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### MTUH2A-Q1: q1 exact unit route

For q1, should the later mutation lane use two proposed F-domain units,
`F19 Maatschappelijke kosten verbaal herkennen` and `F20 Maatschappelijke
kosten uitleggen met voorbeeld`, with `F16` support-only and no full MPC/MSC
prerequisite?

Options:
- Yes, approve the two-unit q1 route for later execution-gate planning.
- Combine q1 into one F-domain unit before any execution gate.
- Hold q1 until a broader externalities review.
- Open answer / other, with rationale.

### MTUH2A-Q2: q2 exact calculation-operation route

For q2, are proposed units `A85` pointwise TO, `A86` TVK from constant
variable cost, `A87` unknown fixed costs from profit, and `A88` scale-factor
handling the right exact planning route?

Options:
- Yes, approve `A85` through `A88` as separate later execution-gate specs.
- Combine one or more q2 calculation units; name which.
- Hold q2 until a broader producer-calculation review.
- Open answer / other, with rationale.

### MTUH2A-Q3: q3 MO route split/update

For q3, is the proposed route adequate: add `A89` GO-as-price relation, add
`A90` MO without derivatives, update `A12` to derivative MO route, add `A91`
MO equals given MK, and update `A20` to derived-MK route?

Options:
- Yes, approve this supplement/update route for later execution-gate planning.
- Prefer a formal `unit-split` of `A20` instead of updating `A20`; name the
  desired successor units.
- Hold q3 MO work until a broader monopoly/calculus sequencing review.
- Open answer / other, with rationale.

### MTUH2A-Q4: q3 price and percentage-change route

For q3, should proposed `A92 Nieuwe prijs bepalen na winstmaximaliserende Q`
and `A93 Procentuele prijsverandering na kostenverandering` move to a later
execution gate while broader incidence/pass-through remains routed to MTU-H3?

Options:
- Yes, approve `A92` and `A93` for later execution-gate planning and keep D07
  incidence work in MTU-H3.
- Approve only `A92`; route `A93` wholly to MTU-H3.
- Hold both until MTU-H3 incidence review.
- Open answer / other, with rationale.

### MTUH2A-Q5: CLI dry-run limitation

The current CLI surface supports dry-run for `unit-update` and dependency
edits, but not for `unit-add` or `unit-split`. Is the plan acceptable for a
later execution gate with this limitation visible?

Options:
- Yes, the later gate may authorize direct `unit-add` execution after exact
  specs, rollback, audit log, and validators are reviewed.
- Require a dry-run wrapper for `unit-add` and `unit-split` before any
  execution gate.
- Hold execution planning until the reference CLI architecture is updated.
- Open answer / other, with rationale.

### MTUH2A-Q6: Existing-unit guardrails

Are the guardrails correct: q1 may use `F16` only as support; q2 must not
require full `A07` TO-function construction or treat `A21` as sufficient; q3
must not require MK derivation when MK is given or a calculus-only MO route;
and D07 incidence stays in MTU-H3?

Options:
- Yes, keep these guardrails binding for any later execution gate.
- Revise one or more guardrails; name which.
- Hold guardrail decisions until live unit specs are re-audited.
- Open answer / other, with rationale.

### MTUH2A-Q7: Rollback, audit, and validation evidence

Are the proposed rollback, audit-log, and validation requirements sufficient
for a later CLI execution gate?

Options:
- Yes, require exact command log, before/after diff, rollback instructions,
  audit evidence, unit-index validation, report generation, reference-health
  checks, and Jest proof.
- Add more proof requirements before any execution gate.
- Hold until a generic unit-mutation audit-log policy is reviewed.
- Open answer / other, with rationale.

### MTUH2A-Q8: Next sprint authority

If GATE-MTU-H2A closes, what should be authorized next?

Options:
- Authorize only a later bounded CLI execution gate packet; no execution yet.
- Authorize direct CLI execution only if this gate closure also names exact
  commands, rollback, audit log, and validation evidence.
- Hold all downstream work and revise the planning packet.
- Open answer / other, with rationale.

### MTUH2A-Q9: Mutation and product authority now

Does GATE-MTU-H2A authorize protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, unit update execution,
unit split execution, candidate writes, lesson-output mutation, CP-6/Year-1
closure, diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, or student/product use
now?

Options:
- No. GATE-MTU-H2A may only record reviewed execution planning and authorize a
  later bounded gate packet unless exact execution authority is separately
  confirmed.
- Yes, but only for explicitly named CLI commands after exact rollback and
  validation evidence are accepted.
- Hold; authority cannot be decided until CLI dry-run limitations are resolved.
- Open answer / other, with rationale.

## Future Interview Protocol

- Show the full question list before starting.
- Ask calibration questions before binding answers.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a closure proposal only after evidence is complete.
- Require explicit human confirmation before writing a closure record or
  authorizing downstream sprint scope.

## Current Stop Conditions

- Stop if any answer authorizes hand edits to `references/machine/` or
  `references/external/`.
- Stop if any answer authorizes protected reference mutation, external-source
  mutation, machine-reference mutation, unit minting, unit update execution,
  unit split execution, candidate writes, lesson-output mutation, CP-6 closure,
  or Year-1 closure now without exact command, rollback, audit, and validation
  authority.
- Stop if q1 is treated as requiring full MPC/MSC or welfare-loss machinery.
- Stop if q2 is treated as requiring full TO-function construction.
- Stop if q3 is treated as requiring MK derivation when MK is given, or as
  requiring a calculus-only MO route.
- Stop if q1 or q2 answer-form needs are hidden downstream instead of routed
  to MTU-H4.
- Stop if D07 broader incidence/pass-through work is mutated from this gate
  instead of routed to MTU-H3 or a later named lane.
- Stop if any answer authorizes diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, or student/product use.

## Recommended Next Action

Run the formal GATE-MTU-H2A human review before any later CLI execution packet,
unit minting, unit update execution, candidate storage, lesson handoff, or
student/product use.
