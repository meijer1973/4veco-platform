# Sprint MTU-H2B: Baseline

Date: 2026-05-28

## Plan reference

- `reports/sprints/MTU-H2B-plan.md`

## Starting state

- Current active roadmap row: `MTU-H2B`.
- Authorizing gate: `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/gate-closure.json`.
- Source planning packet: `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`.
- Live registry context: `references/machine/micro-teaching-units.json`.
- Current source commit at packet start: `5f34a79cb532de62d1f05e732cf532b2566396be`.

## Data integrity notes

No protected reference data may change in MTU-H2B. Files under
`references/machine/` and `references/external/` are read-only context for this
sprint. No `unit-add`, `unit-update`, `unit-split`, `unit-add-dep`, or other
mutation command may be run.

The unrelated untracked file `knowledge/exit-ticket-game-1.1.1.zip` is present
and must remain untouched.

## Baseline findings

- Proposed new IDs `F19`, `F20`, and `A85-A93` are absent from the live MTU
  registry at sprint start.
- Live `A12` and `A20` exist as update targets.
- Proposed term slugs `variabele-kosten`, `winst`, and `marginale-kosten`
  resolve through the current terminology loader.
- Proposed A-domain units `A85-A93` carry generator fields in the H2A plan.
- Live target exercise `4.1.2` currently uses `A20` in a given-MK context
  (`MK = EUR10` constant). Therefore direct semantic narrowing of `A20` is not
  execution-ready without a split/replacement decision.

## Stop conditions

Stop if any H2B artifact authorizes direct protected reference mutation,
unit minting, unit update execution, unit split execution, candidate writes,
lesson-output mutation, or product use. Stop if the A20 audit is hidden or if
direct A20 narrowing is presented as safe despite active given-MK usage.
