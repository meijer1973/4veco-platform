# CP-2 Gate Closure

Gate: `GATE-CP2-owned-source-scope`
Sprint: `R9.1`
Status: `pass_with_conditions`
Closed: 2026-04-29

## Summary

CP-2 is closed as `pass_with_conditions`.

The owned-source registry is strong enough for R9.1 closure and R9.2 content graph projection. It is not a clean pass because companion subtype labels and generated-artifact warnings need tightening before broader use.

R9.2 may proceed, but it must use projection edges by default and reserve evidence edges for explicitly evidence-qualified records.

## Accepted Outcomes

- R9.1 registered owned-source surfaces without treating owned exposition as external authority.
- The registry includes 35 source surfaces and 33 companion/source artifact types.
- The target-exercise blueprint references were repaired to `references/owned/course-blueprint-v4.md`.
- The target-exercise index may be treated as owned exercise evidence, not external authority.
- Generated HTML/PDF/PNG/DOCX/PPTX/shared-engine outputs remain projection or trace material only.
- R9.2 is authorized to proceed with stricter edge labels and projection-edge defaults.

## Blocked Outcomes

- Generated artifacts must not be used as primary evidence.
- Owned lesson exposition must not override external authority or reviewed machine registry truth.
- Target-exercise evidence must not be relabelled as CvTE or external authority.
- R9.2 must not silently promote generated projection edges to evidence edges.
- Student diagnostics remain blocked.
- Adaptive routing remains blocked.
- Student-facing AI remains blocked.
- Automatic lesson sequencing remains blocked.
- Automatic mastery decisions remain blocked.
- Summative assessment decisions remain blocked.

## Conditions

- R9.2 may proceed, but default edges from owned sources must be `projection` edges.
- Evidence edges may only be created for explicitly evidence-qualified records such as the target-exercise index and owned exercise markdown, and those edges must remain separate from external authority.
- R9.2 must strengthen edge labels so `projection`, `owned_exercise_evidence`, `external_authority`, and `implementation_trace` cannot be confused.
- HTML, PDF, PNG, DOCX, PPTX, shared-engine JS/CSS, generated navigation, generated quality YAML, and review notes may be used for retrieval context or implementation tracing only.
- Companion subtype labels should be refined in R9.2/R9.3 where present: `instapquiz`, `wiskundevaardigheden`, `stappenplan`, `redeneer-spel`, `nieuws-detective`, `basis/midden/verrijking`, `nieuws met visual`, `youtube-videos`, and shared engine/data outputs.
- External authority and machine registry boundaries must remain intact.

## Next Sprint

R9.2 may start when the team is ready, limited to content graph projection with the CP-2 evidence-boundary conditions above.
