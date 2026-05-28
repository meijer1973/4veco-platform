# GATE-MTU-H2H A20/A94/A95 CLI-Mutation Plan Review Packet

Generated: 2026-05-28

Status: review packet ready, no mutation authorized.

## Review Scope

Review the MTU-H2H A20/A94/A95 CLI-mutation planning packet only. Decide
whether a later bounded execution packet may be prepared.

Remote evidence prerequisite: this review packet, the H2H planning packet, and
all cited evidence must be committed and pushed to the normal remote branch
before human review starts.

## Evidence Base

- `reports/mtu-hardening/solo-q1-q3-a20-cli-mutation-plan.json`
- `reports/mtu-hardening/solo-q1-q3-a20-cli-mutation-plan.md`
- `reports/review-gates/GATE-MTU-H2G-a20-split-replacement/gate-closure.json`
- `reports/mtu-hardening/solo-q1-q3-a20-split-replacement-packet.json`
- `references/machine/micro-teaching-units.json` as read-only context
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add.js`
- `references/reference-team-roadmap.md`

## Planned Review Focus

| Surface | Finding | Review issue |
|---|---|---|
| `A20` | corrected derived-MO plus derived-MK spec includes `A2.11` | approve or revise A20 update direction |
| `A94` | price-taker `MO = P` plus derived MK | approve or revise A94 spec and mapping use |
| `A95` | given MK-function route and possible `GEN.A20` destination | approve or revise A95/generator route |
| target mappings | exact before/after arrays for `3.2.2`, `3.3.3`, and `4.1.2` | approve or revise authored-reference update plan |

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews the H2H CLI-mutation planning packet only and does not
   itself authorize protected reference mutation, unit minting, unit update
   execution, target-exercise mutation, generator changes, lesson output, or
   student/product use.
2. The H2H packet and cited evidence have been pushed to the normal remote
   branch before this review starts.
3. Target-exercise mapping changes are authored-reference mutations and
   require exact before/after diffs, rollback, and validation before execution.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### MTUH2H-Q1: A20 corrected spec

Is the corrected A20 update spec acceptable: name `Winstmaximum oplossen met
afgeleide MO en MK`, needs `A12/A13/A02`, exam codes
`A2.10/A2.11/A2.12`, and generator `GEN_A20` subject to generator handling?

Options:
- Yes, approve the corrected A20 spec for later execution-packet planning.
- Revise A20 name or fields; name the change.
- Prefer formal split/deprecate instead of updating A20 in place.
- Open answer / other, with rationale.

### MTUH2H-Q2: A94 price-taker route

Is A94 acceptable as `MO = P en afgeleide MK oplossen`, with explicit
price-taker `MO = marktprijs P`, needs `A13/A02`, and no A12 derivative-MO
prerequisite?

Options:
- Yes, approve A94 for later execution-packet planning.
- Revise A94 name, needs, or procedure; name the change.
- Hold A94 until broader price-taker sequencing review.
- Open answer / other, with rationale.

### MTUH2H-Q3: A95 given MK-function route

Is A95 acceptable as `MO = gegeven MK-functie oplossen`, distinct from A91's
given constant/value MK route?

Options:
- Yes, approve A95 for later execution-packet planning.
- Revise A95 name, needs, or procedure; name the change.
- Hold A95 until generator/unit alignment review.
- Open answer / other, with rationale.

### MTUH2H-Q4: target-exercise mapping diffs

Are the proposed authored mapping diffs acceptable: `3.2.2` replaces A20 with
A94 and removes A20 as prior, `3.3.3` keeps A20, and `4.1.2` replaces A20
with A91?

Options:
- Yes, approve these mapping diffs for later execution-packet planning.
- Revise one mapping; name the record and field.
- Hold mapping work until broader target-exercise review.
- Open answer / other, with rationale.

### MTUH2H-Q5: GEN.A20 route

Is the preferred generator route acceptable: move current GEN.A20 behavior to
A95/equivalent and create, rewrite, or block GEN.A20 for the narrowed
derived-route A20?

Options:
- Yes, approve the preferred generator route for later planning.
- Rewrite GEN.A20 in place and do not move behavior to A95.
- Hold all execution planning until generator implementation is designed.
- Open answer / other, with rationale.

### MTUH2H-Q6: command and rollback standard

Are the later command, rollback, and validation requirements sufficient,
including A20 dry-run, unit-add dry-run limitation disclosure, exact mapping
before/after logs, generator-readiness proof, and no-unintended-diff proof?

Options:
- Yes, accept the command/rollback/validation standard.
- Add more proof requirements before execution; name them.
- Hold until unit-add dry-run or authored-reference CLI exists.
- Open answer / other, with rationale.

### MTUH2H-Q7: projection refresh

Are the projection refresh guardrails sufficient: owned-content graph, RAG
chunks, procedure/PV reports, and generator readiness refresh only after
authorized unit and mapping mutations?

Options:
- Yes, accept the projection-refresh guardrails.
- Add more generated surfaces before execution.
- Hold until projection/PV architecture is reviewed.
- Open answer / other, with rationale.

### MTUH2H-Q8: next sprint authority

If GATE-MTU-H2H closes, what should be authorized next?

Options:
- Authorize only a later bounded execution packet; no execution yet.
- Authorize direct execution only if exact commands, mapping diffs, generator
  route, rollback, and validation are included in the closure.
- Hold all downstream work and revise the H2H packet.
- Open answer / other, with rationale.

### MTUH2H-Q9: MTU-H3 sequencing

May MTU-H3 incidence/pass-through proceed after H2H planning if the A20
execution packet remains separately tracked?

Options:
- Yes, MTU-H3 may proceed if A20 execution remains explicitly tracked.
- No, complete A20 execution before MTU-H3.
- Hold sequencing until H2H closure is written.
- Open answer / other, with rationale.

### MTUH2H-Q10: mutation and product authority now

Does this review packet itself authorize protected reference mutation, unit
minting, unit updates, target-exercise mutation, generator change, lesson
output, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student/product use
now?

Options:
- No. This packet authorizes no mutation or product use; a closure may only
  authorize a named later sprint.
- Yes, but only for explicitly named low-risk planning artifacts.
- Hold; authority cannot be decided until generator handling is revised.
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
- Stop if any answer authorizes A20 mutation from this gate.
- Stop if any answer authorizes A94/A95 minting from this gate.
- Stop if any answer authorizes target-exercise mapping writes from this gate.
- Stop if any answer removes `A2.11` from the narrowed A20 route.
- Stop if A94 loses the price-taker `MO = P` step.
- Stop if `GEN.A20` mismatch or missing `GEN_A94`/`GEN_A95` status is hidden.
- Stop if generated projections are refreshed before authorized source
  mutations.
- Stop if PV projection or PV machine promotion is authorized now.
- Stop if candidate writes, lesson-output mutation, diagnostics, adaptive
  routing, mastery, sequencing, student-facing AI, summative use, or
  student/product use are authorized now.

## Recommended Next Action

Commit and push this packet and cited evidence, then run GATE-MTU-H2H before
any A20 CLI mutation, A94/A95 unit minting, target-exercise mapping update,
generator change, generated projection refresh, or student-facing exposure.
