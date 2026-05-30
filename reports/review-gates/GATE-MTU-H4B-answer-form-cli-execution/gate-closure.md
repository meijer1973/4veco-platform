# GATE-MTU-H4B Gate Closure

Closed: 2026-05-30

Reviewed remote commit: `f59c83a7067678aa3ff2c4bab4455ab9d90d72af`

Status: **PASS WITH CONDITIONS for authorizing a later bounded H4B execution sprint.**

## Decision

GATE-MTU-H4B closes as PASS WITH CONDITIONS. A later bounded execution sprint
may run the reviewed `unit-add` commands for:

- `A96` Bereken-vraag beantwoorden
- `A97` Leg-uit-dat antwoord opbouwen
- `A98` Leg-uit-of antwoord opbouwen
- `A99` Leg uit met voorbeeld beantwoorden
- `A80` Noem of geef-aan antwoord geven
- `A81` Bron gebruiken in een antwoord

This gate does not itself execute commands and does not authorize student or
product use.

## Accepted

- `A96` as `ANS_BEREKEN`.
- `A97`, `A98`, and `A99` as separate explanation lanes for `uitleg_dat`,
  `uitleg_of`, and `leg uit met voorbeeld`.
- `A80` as the combined noem/geef-aan lane, with split-if-needed condition.
- `A81` only as a source-use modifier plus underlying answer form, not as a
  standalone complete answer form.
- Bounded use of `A80`, `A81`, and `A96`-`A99`; `A100` remains invalid and
  `A71` remains held.

## Held

- `ANS_GRAFISCH_ARCEER_TEKEN`.
- `ANS_MOTIVEER_CLASSIFICATIE`.
- `ANS_ANALYSEER_BEOORDEEL`.
- q3/q15 EX answer-skill overlays remain visible, with no candidate storage or
  writes.

## Conditions

1. Record the reviewed remote commit/hash.
2. Run final ID/baseline preflight: `A80`, `A81`, and `A96`-`A99` absent,
   `A71` held, `A100` invalid, candidate storage absent, and no
   target-exercise `question_type` or `answer_form` fields.
3. Print and log each extracted spec before command execution.
4. Verify each spec matches the reviewed command hash before execution.
5. Accept the `unit-add` no-dry-run limitation only with simulated catalog
   validation and exact command review.
6. Rebuild and check generator readiness after execution.
7. Block or implement `GEN_A80`, `GEN_A81`, and `GEN_A96`-`GEN_A99` before any
   student-facing exposure.
8. Keep `A81` as a source-use modifier, not a standalone complete answer form.
9. Keep graph, Type 4, and analysis/evaluation lanes held.
10. Keep q3/q15 EX overlays visible; no candidate storage or writes.
11. Do not write target-exercise `question_type` or `answer_form` fields.
12. Do not refresh generated projections as a source mutation side effect.
13. Allow only validation/report outputs required by the execution sprint.
14. Do not authorize lesson output, diagnostics, adaptive routing,
    mastery/sequencing, student-facing AI, summative use, PV projection,
    PV machine promotion, Scale Gate 1, or student/product use.

## Authorized Next

`MTU-H4C Answer-Form Bounded CLI Execution` may execute only the reviewed H4B
`unit-add` commands for `A80`, `A81`, and `A96`-`A99` under the stated preflight,
logging, generator, validation, and no-exposure conditions.

## Authority Boundary

This closure authorizes no direct execution from the review packet, no
protected reference mutation by the gate itself, no target-exercise mutation,
no candidate storage, no candidate writes, no projection refresh as a source
mutation side effect, no lesson output, and no student/product use.

## Main Risk

The main risk is premature exposure. These units will be live MTUs after the
later execution sprint, but may still be generator-blocked. The execution sprint
must prove they cannot leak into student-facing skill-tree, PV, lesson,
diagnostic, or adaptive routes until generator readiness and product gates are
separately satisfied.
