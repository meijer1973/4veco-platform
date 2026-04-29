# CP-2 Human Interview

Gate: `GATE-CP2-owned-source-scope`
Sprint: `R9.1`
Recorded: 2026-04-29
Decision: `pass_with_conditions`
Reviewer role: Head of Content Strategy

## Summary

The human reviewer approved CP-2 with conditions. R9.1 may close as `pass_with_conditions`, and R9.2 may proceed if it uses projection edges by default and reserves evidence edges for explicitly evidence-qualified records.

The reviewer did not accept generated projections as evidence and did not identify a major missing source class in the R9.1 registry.

## Answers

### CP2-Q1

Question: Does the owned-source registry include all relevant companion artefact types for current Book 1 work?

Answer: B. Mostly, with additions needed.

Notes: The registry covers the major surfaces and reports 35 source surfaces and 33 companion/source artifact types. Some companion outputs are still grouped under broad generated categories rather than explicit pedagogical subtypes.

### CP2-Q2

Question: Are authority labels clear enough to distinguish owned design, owned lesson exposition, generated projection, answer model, planning artifact, and implementation output?

Answer: B. Mostly, wording needs improvement.

Notes: The main boundaries are present. Broad labels such as `generated_html_surface`, `owned_markdown_surface`, and generated quality/report surfaces need sharper wording in follow-up work.

### CP2-Q3

Question: Is it correct that generated HTML/PDF/PNG/shared-engine outputs are not primary evidence?

Answer: B. Yes, with stronger warnings.

Notes: Generated outputs must remain projection/trace material, not primary evidence. R9.2 should make the warning more visible in edge labels.

### CP2-Q4

Question: Is the target-exercise index correctly treated as owned exercise evidence while remaining separate from external authority?

Answer: B. Yes, with conditions.

Notes: The target-exercise index can support gap discovery and target-exercise alignment, but it must remain labelled as owned exercise evidence, not CvTE or external authority.

### CP2-Q5

Question: Should R9.2 proceed using projection edges only, with evidence edges reserved for explicitly evidence-qualified records?

Answer: B. Yes, with stricter labels.

Notes: R9.2 must enforce edge-level typing: projection edge, owned exercise evidence edge, external authority edge, and implementation trace edge. No generated projection may be silently promoted to evidence.

### CP2-Q6

Question: What CP-2 gate status is appropriate?

Answer: B. `pass_with_conditions`.

Notes: R9.1 may close after recording the human decision and applying the closure conditions.

## Pattern Analysis

The answers are internally consistent:

- The registry is adequate for R9.1 closure.
- R9.2 is authorized, but only with projection-edge defaults.
- Generated artifacts remain non-evidence.
- Target exercises may be owned exercise evidence, but not external authority.
- Companion subtype labeling needs refinement in follow-up work.

No hold condition was triggered because the reviewer did not find a major source-class gap and did not accept generated projections as evidence.

## Targeted Follow-Ups

- Add finer companion subtype labels in R9.2/R9.3 where present: `instapquiz`, `wiskundevaardigheden`, `stappenplan`, `redeneer-spel`, `nieuws-detective`, `basis/midden/verrijking` questions and answers, `nieuws met visual`, `youtube-videos`, and shared engine/data outputs.
- Strengthen edge and retrieval labels so projection, owned exercise evidence, external authority, and implementation trace cannot be confused.
- Make generated-artifact warnings visible in R9.2 content graph output.

## Explicit Human Confirmation

The human reviewer explicitly authorized closing CP-2 and R9.1 as `pass_with_conditions` and moving to R9.2, with the evidence-boundary conditions recorded in the gate closure.
