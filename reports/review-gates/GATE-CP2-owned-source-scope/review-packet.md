# CP-2 Owned Source Scope Review Packet

Gate ID: `GATE-CP2-owned-source-scope`
Sprint: `R9.1`

## Context

R9.1 built the first owned-source registry and repaired target-exercise blueprint references. CP-2 reviews whether the source surface list and authority labels are accurate enough for R9.2 content graph projection.

## Registry Summary

- Registry: `references/data/owned-source-registry.json`
- Report: `reports/owned-source-registry.md`
- Source surfaces: 35
- Companion/source artifact types: 33
- Projection/evidence separation required: true

## Calibration Questions

### CP2-Q1

Does the owned-source registry include all relevant companion artefact types for current Book 1 work?

- A. Yes
- B. Mostly, with additions needed
- C. No, important source classes are missing
- D. Cannot decide from the packet

### CP2-Q2

Are the authority labels clear enough to distinguish owned design, owned lesson exposition, generated projection, answer model, planning artifact, and implementation output?

- A. Yes
- B. Mostly, wording needs improvement
- C. No
- D. Cannot decide

### CP2-Q3

Is it correct that generated HTML/PDF/PNG/shared-engine outputs are not primary evidence?

- A. Yes
- B. Yes with stronger warnings
- C. No
- D. Cannot decide

### CP2-Q4

Is the target-exercise index correctly treated as owned exercise evidence while remaining separate from external authority?

- A. Yes
- B. Yes with conditions
- C. No
- D. Cannot decide

### CP2-Q5

Should R9.2 proceed using projection edges only, with evidence edges reserved for explicitly evidence-qualified records?

- A. Yes
- B. Yes with stricter labels
- C. Hold R9.2 until registry repair
- D. Cannot decide

### CP2-Q6

What CP-2 gate status is appropriate?

- A. pass
- B. pass_with_conditions
- C. hold

## Answer Recording

Record each answer in `human-interview.json` and summarize rationale in `human-interview.md` before gate closure.

## Pattern Analysis

- Any answer indicating missing source classes requires registry repair before R9.1 closure.
- Any answer allowing generated projections as primary evidence requires gate hold.
- R9.2 can proceed only if projection/evidence separation is approved.

## Targeted Follow-Ups

Add targeted follow-ups only if the reviewer flags missing source surfaces, weak labels, or evidence/projection confusion.

## Closure Proposal

Expected closure proposal: `pass_with_conditions`, unless generated projections are accepted as evidence or major source classes are missing. In that case use `hold`.

## Explicit Human Confirmation

R9.1 must not close until a human reviewer explicitly confirms the CP-2 gate decision.
