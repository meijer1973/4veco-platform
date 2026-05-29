# GATE-MTU-H4A Answer-Form CLI-Mutation Plan Review Packet

Generated: 2026-05-29

Status: review packet ready, no mutation authorized.

## Review Scope

Review the MTU-H4A answer-form CLI-mutation planning packet only. Decide
whether a later bounded execution packet may be prepared for accepted
answer-form lanes.

Remote evidence prerequisite: this review packet, the H4A planning packet, and
all cited evidence must be committed and pushed to the normal remote branch
before human review starts. The gate closure must record the reviewed remote
commit/hash.

## Evidence Base

- `reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json`
- `reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.md`
- `reports/review-gates/GATE-MTU-H4-answer-form-question-type-routing/gate-closure.json`
- `reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.json`
- `reports/sprints/MTU-H4A-plan.md`
- `reports/sprints/MTU-H4A-baseline.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/course-target-exercises.json` as read-only context
- `references/machine/micro-teaching-units.json` as read-only context
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `build-scripts/references/unit-add.js`
- `build-scripts/references/check-mtu-h4a-answer-form-cli-mutation-plan.js`

## Planned Review Focus

| Surface | Finding | Review issue |
|---|---|---|
| ID allocation | `A100` is invalid; open non-held slots are `A80`, `A81`, `A96`-`A99` | approve IDs or require ID-policy sprint |
| `A96` | proposed `bereken` answer-form unit | approve or revise later execution planning |
| `A97`-`A99` | separate explanation answer-form units | approve, merge, revise, or hold |
| `A80` | combined noem/geef-aan unit | approve with split-if-needed condition or split now |
| `A81` | bron as source-use modifier | preserve modifier boundary |
| held lanes | graph, Type 4, analysis/evaluation have no commands | confirm held state |
| EX overlays | q3/q15 remain no-write overlay needs | preserve candidate boundary |
| authority | planning only | decide later execution-packet authority, not execution |

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews the H4A planning packet only and does not itself
   authorize protected reference mutation, unit minting, candidate storage,
   candidate writes, target-exercise mutation, projection refresh, lesson
   output, or student/product use.
2. The H4A packet, review packet, and cited evidence have been pushed to the
   normal remote branch before this review starts.
3. Candidate storage remains absent, A-domain ID pressure is a review issue,
   and no proposed answer-form ID is live until a later exact execution gate
   authorizes it.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### MTUH4A-Q1: ID allocation and planning scope

Are the proposed A-domain IDs `A80`, `A81`, and `A96`-`A99` acceptable for
later execution-packet planning, with `A100` rejected as invalid and `A71`
left unused?

Options:
- Yes, approve this ID allocation for later execution-packet planning.
- Require an ID-policy sprint before any answer-form execution packet.
- Revise one or more IDs; name the replacement route.
- Open answer / other, with rationale.

### MTUH4A-Q2: A96 bereken

Is `A96` acceptable as the later planned unit for `ANS_BEREKEN`, with formula,
substitution, intermediate steps, unit/notation, and conclusion?

Options:
- Yes, approve `A96` for later execution-packet planning.
- Revise the `A96` name, procedure, zero-needs status, or exam codes.
- Hold bereken answer-form planning until more correction-model examples are
  read.
- Open answer / other, with rationale.

### MTUH4A-Q3: leg uit lanes

Are `A97`, `A98`, and `A99` acceptable as separate later planned units for
`uitleg_dat`, `uitleg_of`, and `leg uit met voorbeeld`?

Options:
- Yes, approve all three separate lanes for later execution-packet planning.
- Merge or revise one of the lanes; name the change.
- Hold explanation answer-form units until broader answer-model evidence is
  read.
- Open answer / other, with rationale.

### MTUH4A-Q4: noem/geef aan

Is `A80` acceptable as the combined noem/geef-aan answer-form unit, with a
future split required if evidence shows `geef aan` behaves differently?

Options:
- Yes, approve `A80` with the split-if-needed condition.
- Split `noem` and `geef aan` now before execution-packet planning.
- Hold concise-identification answer forms until more examples are audited.
- Open answer / other, with rationale.

### MTUH4A-Q5: bron modifier

Is `A81` acceptable as `ANS_BRON_GEBRUIKEN` only as a source-use modifier plus
underlying answer form, not as a standalone complete answer form?

Options:
- Yes, approve `A81` as modifier plus underlying answer form.
- Revise `A81` so source-use stays entirely in task UI rather than an MTU.
- Hold `bron` until source-annex extraction is reviewed more broadly.
- Open answer / other, with rationale.

### MTUH4A-Q6: held lanes

Is the held-lane treatment sufficient for graph/draw/shade, Type 4
motiveer/classificatie, and analysis/evaluation, with no unit-add commands
now?

Options:
- Yes, keep all three held as written.
- Move one held lane into later execution-packet planning; name it and the
  evidence.
- Require stronger evidence before any H4A downstream work.
- Open answer / other, with rationale.

### MTUH4A-Q7: EX overlays

Should q3 threshold conclusion/unit-direction and q15 two-step
correction-model explanation remain EX answer-skill overlays with no candidate
storage or writes?

Options:
- Yes, keep both overlays visible and authorize no writes.
- Move one overlay into reusable answer-form MTU planning; name it and why.
- Hold until answer-skill candidate storage is authorized.
- Open answer / other, with rationale.

### MTUH4A-Q8: mapping and projection boundary

Are the mapping and projection boundaries sufficient: current `question_type`
mappings remain planning input only, no target-exercise fields are written,
and projections refresh only after later source mutations?

Options:
- Yes, accept the mapping/projection boundary.
- Add more mapping proof before execution-packet planning.
- Hold until an authored-reference field-mutation CLI exists.
- Open answer / other, with rationale.

### MTUH4A-Q9: command and validation standard

Are the later command templates, `unit-add` no-dry-run disclosure,
extracted-spec logging, simulated catalog validation, generator/exposure block,
rollback, and validation stack sufficient?

Options:
- Yes, accept the command, rollback, and validation standard.
- Add more proof requirements before execution-packet planning.
- Hold until `unit-add` has a dry-run mode or generator readiness is resolved.
- Open answer / other, with rationale.

### MTUH4A-Q10: next sprint and authority

If GATE-MTU-H4A closes, what is authorized next, and does this packet authorize
any mutation or product use now?

Options:
- Authorize only a later bounded execution packet for accepted H4A lanes; no
  execution or product use now.
- Authorize direct execution only if exact commands and final preflight are
  included in the closure.
- Hold all downstream answer-form work and revise the H4A packet.
- Open answer / other, with rationale.

## Future Interview Protocol

- Show the full question list before starting.
- Ask calibration questions before binding answers.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a closure proposal only after evidence is complete.
- Require explicit human confirmation before writing a closure record or
  authorizing downstream execution scope.

## Current Stop Conditions

- Stop if the packet/evidence has not been pushed before review.
- Stop if any answer authorizes hand edits to `references/machine` or
  `references/external`.
- Stop if any answer authorizes unit minting, target-exercise writes, or
  projection refresh from this gate.
- Stop if any answer creates or writes
  `references/data/exam-ingestion/answer-skill-candidates.json`.
- Stop if `A100` or any invalid A-domain ID is treated as usable.
- Stop if `A71` is consumed without explicit reviewer decision.
- Stop if `bron` is treated as a standalone complete answer form.
- Stop if graph, Type 4, or analysis/evaluation are minted without stronger
  evidence.
- Stop if generated projections are refreshed before authorized source
  mutations.
- Stop if lesson output, diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion, Scale
  Gate 1, or student/product use is authorized now.

## Recommended Next Action

Commit and push this packet and cited evidence, then run GATE-MTU-H4A before
any answer-form MTU minting, target-exercise field update, candidate storage
creation, candidate write, generated projection refresh, lesson output, or
student-facing exposure.
