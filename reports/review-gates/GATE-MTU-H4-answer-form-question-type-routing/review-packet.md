# GATE-MTU-H4 Answer-Form And Question-Type Routing Review Packet

Generated: 2026-05-28

Status: review packet ready, no mutation authorized.

## Review Scope

Review the MTU-H4 answer-form/question-type routing packet only. Decide whether
a later bounded CLI-mutation planning packet may be prepared for reusable
answer-form MTU lanes, EX answer-skill overlay lanes, and future question-type
mapping updates.

Remote evidence prerequisite: this review packet, the H4 routing packet, and
all cited evidence must be committed and pushed to the normal remote branch
before human review starts. The gate closure must record the reviewed remote
commit/hash.

## Evidence Base

- `reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.json`
- `reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.md`
- `reports/sprints/MTU-H4-plan.md`
- `reports/sprints/MTU-H4-baseline.md`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/gate-closure.json`
- `reports/json/exam-question-extraction-gaps.json`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/course-target-exercises.json` as read-only context
- `references/machine/micro-teaching-units.json` as read-only context
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`

## Planned Review Focus

| Surface | Finding | Review issue |
|---|---|---|
| target exercises | no `question_type` or `answer_form` fields | decide future mapping boundary |
| extraction evidence | current `question_type` values exist | map values to answer-form lanes |
| H2 operation map | q1/q2 answer-form needs deferred to H4 | decide reusable MTU lanes |
| EX answer-skill contract | candidate storage absent and dry-run-only | preserve overlay boundary |
| roadmap | H4 is routing/review work only | decide next sprint authority |

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews the H4 answer-form/question-type routing packet only and
   does not itself authorize protected reference mutation, unit minting,
   candidate storage, candidate writes, target-exercise mutation, projection
   refresh, lesson output, or student/product use.
2. The H4 packet, review packet, and cited evidence have been pushed to the
   normal remote branch before this review starts.
3. Answer-skill candidate storage remains absent and no candidate writes may
   occur unless a later gate explicitly authorizes an exact lane.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### MTUH4-Q1: evidence baseline

Is the H4 baseline sufficient: current target exercises have no
`question_type`/`answer_form` fields, extraction evidence has `question_type`
values, H2 deferred answer forms remain visible, and EX answer-skill storage
is dry-run-only?

Options:
- Yes, accept the evidence baseline.
- Add more source evidence before routing decisions.
- Hold until target exercises already carry question-type fields.
- Open answer / other, with rationale.

### MTUH4-Q2: architecture boundary

Should H4 use a hybrid architecture: reusable answer-form MTU lanes for broad
student procedures and EX answer-skill overlays for correction-model-specific
answer construction?

Options:
- Yes, approve the hybrid boundary.
- Put all answer forms in MTUs only.
- Put all answer construction in EX answer-skill overlays only.
- Open answer / other, with rationale.

### MTUH4-Q3: bereken lane

Is `ANS_BEREKEN` acceptable as the reusable calculation-answer lane for
formula, substitution, intermediate steps, units, and conclusion?

Options:
- Yes, approve `ANS_BEREKEN` for later planning.
- Revise the lane procedure before planning.
- Hold calculation-answer form until more correction-model examples are read.
- Open answer / other, with rationale.

### MTUH4-Q4: leg uit lanes

Should `uitleg_dat`, `uitleg_of`, and `leg uit met voorbeeld` be separate
planning lanes rather than one broad `leg uit` lane?

Options:
- Yes, keep the three lanes separate.
- Merge `uitleg_dat` and `uitleg_of` but keep example-answer separate.
- Use one broad `leg uit` answer-form lane.
- Open answer / other, with rationale.

### MTUH4-Q5: noem, geef aan, bron, and source use

Are `ANS_NOEM_GEEF_AAN` and `ANS_BRON_GEBRUIKEN` acceptable as separate lanes
for concise identification and explicit source-use answers?

Options:
- Yes, approve both lanes for later planning.
- Split `noem` and `geef aan` into separate lanes.
- Hold source-use until source-annex extraction is reviewed more broadly.
- Open answer / other, with rationale.

### MTUH4-Q6: graph and analysis lanes

Should graph/draw/shade answer forms be planned now while
`analyseer`/`beoordeel` remains held until stronger evidence, or should both be
held?

Options:
- Plan graph/draw/shade now and hold analysis/evaluation.
- Plan both graph and analysis/evaluation lanes now.
- Hold both until more exam-question evidence is audited.
- Open answer / other, with rationale.

### MTUH4-Q7: EX answer-skill overlays

Should q3 threshold conclusion/unit-direction and q15 two-step
correction-model explanation remain in the EX answer-skill overlay route with
no candidate writes now?

Options:
- Yes, keep both in EX overlay and authorize no writes.
- Move one or both into reusable answer-form MTU planning.
- Hold until answer-skill candidate storage is authorized.
- Open answer / other, with rationale.

### MTUH4-Q8: question-type mappings

Are the proposed mappings from current `question_type` values to answer-form
lanes acceptable as later planning input, with target-exercise writes deferred?

Options:
- Yes, accept the mapping candidates for later planning.
- Revise one mapping; name the `question_type`.
- Hold mapping work until target exercises already carry question-type fields.
- Open answer / other, with rationale.

### MTUH4-Q9: next sprint authority

If GATE-MTU-H4 closes, what should be authorized next?

Options:
- Authorize only a later bounded CLI-mutation planning packet for accepted
  lanes; no execution or writes yet.
- Authorize another routing packet before any CLI planning.
- Hold all downstream answer-form work and revise the H4 packet.
- Open answer / other, with rationale.

### MTUH4-Q10: mutation and product authority now

Does this review packet itself authorize protected reference mutation, unit
minting, candidate storage, candidate writes, target-exercise mutation,
projection refresh, lesson output, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, or student/product use now?

Options:
- No. This packet authorizes no mutation or product use; a closure may only
  authorize a named later sprint.
- Yes, but only for explicitly named low-risk planning artifacts.
- Hold; authority cannot be decided until answer-skill storage is revised.
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
  authorizing downstream sprint scope.

## Current Stop Conditions

- Stop if the packet/evidence has not been pushed before review.
- Stop if any answer authorizes hand edits to `references/machine` or
  `references/external`.
- Stop if any answer authorizes unit minting, unit updates, unit splits, or
  unit deprecation from this gate.
- Stop if any answer creates or writes
  `references/data/exam-ingestion/answer-skill-candidates.json`.
- Stop if answer-skill candidate writes are authorized from this gate.
- Stop if target-exercise `question_type` or answer-form field writes are
  authorized from this gate.
- Stop if generated projections are refreshed before authorized source
  mutations.
- Stop if EX correction-model answer skills are hidden inside broad MTUs
  without an explicit reviewer decision.
- Stop if broad reusable answer-form needs are hidden inside item-specific EX
  candidates without an explicit reviewer decision.
- Stop if PV projection, PV machine promotion, lesson output, diagnostics,
  adaptive routing, mastery, sequencing, student-facing AI, summative use, or
  student/product use is authorized now.

## Recommended Next Action

Commit and push this packet and cited evidence, then run GATE-MTU-H4 before any
answer-form MTU minting, answer-skill candidate storage creation, candidate
write, target-exercise question-type mapping update, generated projection
refresh, lesson handoff, or student-facing exposure.
