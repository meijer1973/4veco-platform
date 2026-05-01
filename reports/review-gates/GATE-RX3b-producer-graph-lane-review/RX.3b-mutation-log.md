# RX.3b Mutation Log

Status: `completed`  
Execution mode: CLI-only via `build-scripts/references/unit-add.js`

## Pre-Execution Check

- Live A-domain max before mutation: `A79`
- Authorized IDs available: yes
- Dependency check: `passed`

## Commands

- `A77`: passed
- `A78`: passed

## Applied Units

- `A77`
- `A78`

## A78 Dependency Decision

`A78` was added with needs `A63`, `A75`, and `A77`, preserving the RX.3b HCS decision that profit/loss reading in a TO-TK graph should build on the break-even graph anchor.

## Generator Block

`A77` and `A78` remain generator-blocked/non-interactive until `GEN_A77` and `GEN_A78` exist and validate.

## Blocked Scope

No mutation or student-facing use was authorized for `A80`, `A81`, graphical `MO=MK`, held records, real PV templates, diagnostics, adaptive routing, student-facing AI, sequencing, mastery, summative use, or PV projection.
