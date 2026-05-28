# Sprint MTU-H2B: Planning Review

Date: 2026-05-28

Reviewer: Codex self-check, no separate subagent spawned.

## Review Summary

The MTU-H2B plan is operational and correctly scoped as packet preparation.
It expands the roadmap row into specific evidence: ID availability, exact
command forms, generator proof, term validation, A20 usage impact audit,
expected diff scope, rollback, and a later human review packet.

## Required Corrections Before Execution

The A20 audit is not a formality. Active target exercise `4.1.2` uses `A20`
for a given-MK case. That means direct `A20` semantic narrowing from generic
`MO = MK oplossen` to derived-MK-only is not execution-ready. The H2B packet
must therefore hold the A20 update/split lane and ask GATE-MTU-H2B to route it
separately.

## Review Decision

Proceed with MTU-H2B packet preparation, with the A20 direct-update lane held.

## Proof Required

- H2B checker validates the held A20 lane.
- GATE-MTU-H2B review packet asks a binding A20 routing question.
- Roadmap next action after MTU-H2B becomes GATE-MTU-H2B human review, not CLI
  execution.
