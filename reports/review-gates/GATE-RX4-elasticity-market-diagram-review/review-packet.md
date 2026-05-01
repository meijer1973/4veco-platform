# GATE-RX4 Elasticity And Market Diagram Representation: Review Packet

Sprint: `RX.4`
Status: `prepared_for_human_review`

This packet prepares candidate specs and a conditional CLI mutation plan for `A82`, `A83`, and `A84`.

No CLI mutation is authorized by this packet.

## Context

RX.1 identified `A82` through `A84` as elasticity representation candidates. HCS allowed `A82` and `A84` to move earlier after the core percentage/table lane, while keeping `A83` conditional on P-Q graph interpretation and source-value readiness.

RX.2b has now added the graph-reading foundation units, including `A63`. RX.3a and RX.3b have added producer representation prerequisites. PV.2 has also provided graph-stage constraints, but real PV templates and student-facing PV projection remain blocked.

## Recommended Queue

- Lower-risk first lane: `A82`, `A84`
- Conditional graph lane: `A83`
- Held duplicate/overlap areas: new market/welfare/surplus units that duplicate or overlap `A19`, `A32`, `A40`, `D39`, `D40`, `A51`, `A56`, or `A59`

## Candidate Scope

- `A82` Elasticiteit berekenen uit tabelwaarden
- `A83` Elasticiteit berekenen uit vraaggrafiek
- `A84` Omzetverandering beoordelen met elasticiteit uit bron

## PV And Graph Constraints

Any approved graph-source procedure must explicitly encode:

- title and economic context;
- horizontal and vertical axes;
- units and scale;
- direct labels or legend;
- exact versus estimated reading where relevant;
- reading two price/quantity pairs before calculating;
- non-color fallback requirement for later PV visual-state templates.

No student-facing PV projection is authorized by this packet.

## Review Questions

### RX4-Q1

Is RX.4 correctly scoped to `A82`, `A83`, `A84`, plus a market/welfare duplicate audit?

Recommended answer: A. Yes, keep RX.4 limited to elasticity representation candidates and duplicate-audit holds.

### RX4-Q2

Should `A82` proceed as the lower-risk table elasticity candidate with needs `A15`, `A61`, and `A66`?

Recommended answer: A. Yes, authorize mutation review for `A82` with source-value pairing emphasized.

### RX4-Q3

Should `A84` proceed as the lower-risk source/revenue interpretation candidate with needs `A15` and `A67`?

Recommended answer: B. Mostly; preserve `A15`/`A67` unless HCS wants an explicit conceptual prerequisite for elasticity-and-omzet before mutation.

### RX4-Q4

Is `A83` ready as `Elasticiteit berekenen uit vraaggrafiek`, or should it be renamed/generalized or held?

Recommended answer: B. Conditional: decide explicitly whether to approve the demand-graph name, generalize to P-Q graph elasticity, or hold until graph-source evidence is stronger.

### RX4-Q5

Do `A82`, `A83`, and `A84` procedures preserve elasticity sign and absolute-value interpretation?

Recommended answer: A. Yes, require sign and absolute-value interpretation in every approved spec.

### RX4-Q6

Should market/welfare duplicate areas remain held because existing units already cover surplus, welfare, and intervention graph operations?

Recommended answer: A. Yes, keep new market/welfare units held unless a later focused review moves one into scope.

### RX4-Q7

Should all approved `A82-A84` units remain generator-blocked and non-interactive until generator/projection support exists?

Recommended answer: A. Yes, hard block student-facing use.

### RX4-Q8

If the gate passes, authorize later CLI-only mutation for `A82` and `A84`, with `A83` conditional on the naming/evidence decision?

Recommended answer: A. Yes for `A82`/`A84` after live checks; `A83` only if the graph-source decision is explicit.

### RX4-Q9

What gate status should `GATE-RX4-elasticity-market-diagram-review` receive?

Recommended answer: `pass_with_conditions`.

## Required Conditions If Gate Passes

- Run live numbering check immediately before any later mutation.
- Use only `unit-add.js`; no hand edits to `references/machine/`.
- Record the `A83` naming/evidence decision in the gate closure and mutation log.
- Keep market/welfare duplicate areas held unless explicitly re-approved.
- Mark any newly approved A-domain units generator-blocked and non-interactive.
- Do not hand-edit `references/external/`, authored source files, or RAG chunks.
- Do not authorize diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.
