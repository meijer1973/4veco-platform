# Sprint MTU-ANS-GEN-DESIGN-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/MTU-ANS-GEN-DESIGN-1-plan.md`

## Current state

The merged `MTU-GENBLOCK-HARDEN-1` guardrail proves that missing-generator
A-domain units are blocked from interactive and route exposure.

Current readiness counts from `reports/json/skilltree-generator-readiness.json`:

- Active A-domain units: 98.
- Interactive generator-backed A-domain units: 47.
- Generator-blocked A-domain units: 51.
- Explicit generator-block records: 51.
- Blocked interactive leaks: 0.
- Blocked route leaks: 0.

The six answer-form/source-use units from `MTU-H4C` are live catalog units but
not interactive or route-visible:

| Unit | Name | Current status |
|---|---|---|
| `A80` | Noem of geef-aan antwoord geven | generator-blocked |
| `A81` | Bron gebruiken in een antwoord | generator-blocked, modifier-only |
| `A96` | Bereken-vraag beantwoorden | generator-blocked |
| `A97` | Leg-uit-dat antwoord opbouwen | generator-blocked |
| `A98` | Leg-uit-of antwoord opbouwen | generator-blocked |
| `A99` | Leg uit met voorbeeld beantwoorden | generator-blocked |

## Baseline risk

The old skill-tree generator pattern is built around small interactive
calculation, graph, and procedure drills. The answer-form units are different:
they are reusable answer-construction wrappers that must combine with
underlying content, calculation, graph/table, reasoning, or source-use tasks.

If a later sprint writes ordinary randomizers without a reviewed proof route,
students could receive shallow answer-form practice that looks interactive but
does not preserve the operation chain needed for target exercises.

## Data integrity notes

This baseline records design state only. No protected reference data, authored
target exercises, source-data, generator runtime, deploy logic, or generated
lesson output has been changed for this sprint.

## Required baseline proof

- `MTU-GENBLOCK-HARDEN-1` is merged and its guardrail remains active.
- `check-skilltree-generator-readiness.js` must keep passing during this
  design sprint.
- Any later route for `A80`, `A81`, or `A96`-`A99` must be reviewed before
  implementation or exposure.
