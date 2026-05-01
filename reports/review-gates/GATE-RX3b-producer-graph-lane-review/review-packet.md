# GATE-RX3b Producer Graph-Lane Review: Review Packet

Sprint: `RX.3b`
Status: `prepared_for_human_review`

This packet prepares candidate specs and a CLI mutation plan for `A77` and `A78`.

No CLI mutation is authorized by this packet.

## Context

`GATE-RX3-producer-representation` closed as `pass_with_conditions`. HCS allowed `A77` and `A78` to proceed later after `A75`, with PV graph-stage constraints. `RX.3a` has now added `A75`, `A76`, and `A79` through `unit-add.js`, so the TO-TK graph lane can be reviewed.

`A80`, `A81`, and graphical `MO=MK` remain held. They are not part of this gate.

## Candidate Scope

- `A77` Break-even aflezen uit TO-TK-grafiek
- `A78` Winst of verlies aflezen uit TO-TK-grafiek

Required draft execution order: `A77` -> `A78`.

## PV Constraints

Both candidate procedures must explicitly encode:

- title and economic context;
- horizontal and vertical axes;
- units and scale;
- TO and TK labels or legend;
- exact versus estimated reading where relevant;
- graph-reading before calculation or interpretation;
- non-color fallback requirement for later PV visual-state templates.

No student-facing PV projection is authorized by this packet.

## Review Questions

### RX3B-Q1

Is RX.3b correctly limited to `A77` and `A78`?

Recommended answer: A. Yes, keep the scope limited to the TO-TK graph lane.

### RX3B-Q2

Is the `A77` draft spec acceptable with needs `A63` and `A29`?

Recommended answer: A. Yes, preserve `A63`/`A29` unless HCS wants a separate lighter break-even concept unit first.

### RX3B-Q3

Is the `A78` draft spec acceptable with needs `A63` and `A75`?

Recommended answer: B. Mostly; decide explicitly whether `A78` should add `A77` after `A77` is minted.

### RX3B-Q4

Should `A77` and `A78` procedures satisfy the PV graph-stage constraints without creating real PV templates yet?

Recommended answer: A. Yes, record PV requirements now but keep real PV templates for PV.3/PV.5.

### RX3B-Q5

Should `A80`, `A81`, and `HOLD_GRAPHICAL_MO_MK_OPTIMUM` remain held?

Recommended answer: A. Yes, keep them held until PV producer-graph templates or separate design review.

### RX3B-Q6

Should `A77` and `A78` remain generator-blocked and non-interactive if later mutated?

Recommended answer: A. Yes, hard block student-facing use.

### RX3B-Q7

If the gate passes, authorize later CLI-only unit mutation for `A77` and `A78`?

Recommended answer: A. Yes, after live numbering/dependency checks, if HCS accepts the specs and dependency decision.

### RX3B-Q8

What gate status should `GATE-RX3b-producer-graph-lane-review` receive?

Recommended answer: `pass_with_conditions`.

## Required Conditions If Gate Passes

- Run live numbering check immediately before any later mutation.
- Use only `unit-add.js`, in the order `A77`, `A78`.
- Record the `A78` dependency decision in the gate closure and mutation log.
- Do not mutate `A80`, `A81`, `HOLD_GRAPHICAL_MO_MK_OPTIMUM`, or held duplicate/overlap records.
- Mark `A77` and `A78` generator-blocked and non-interactive until generators exist and validate.
- Do not hand-edit `references/machine/`, `references/external/`, authored source files, or RAG chunks.
- Do not authorize diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.
