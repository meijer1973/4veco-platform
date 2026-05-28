# GATE-MTU-H2G A20 Split And Affected-Mapping Review Packet

Generated: 2026-05-28

Status: review packet ready, no mutation authorized.

## Review Scope

Review the MTU-H2G A20 split/replacement and affected-mapping packet only.
Decide whether a later bounded CLI-mutation planning or execution packet may
be prepared for `A20`, `A94`, `A95`, and affected mappings.

Remote evidence prerequisite: this review packet, the A20 packet, and all
cited evidence must be committed and pushed to the normal remote branch before
human review starts.

## Evidence Base

- `reports/mtu-hardening/solo-q1-q3-a20-split-replacement-packet.json`
- `reports/mtu-hardening/solo-q1-q3-a20-split-replacement-packet.md`
- `reports/sprints/MTU-H2F-result.md`
- `references/data/sprints/MTU-H2F.result.json`
- `references/machine/micro-teaching-units.json` as read-only context
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add.js`
- `build-scripts/references/unit-split.js`
- `references/reference-team-roadmap.md`

## Planned Review Focus

| Surface | Finding | Review issue |
|---|---|---|
| `3.2.2` | given MO / price-taker plus derived MK | `A20` over-triggers `A12`; possible `A94` route |
| `3.3.3` | derived MO and derived MK | `A20` can remain only if narrowed/renamed |
| `4.1.2` | given constant MK | `A91` should replace stale `A20` for the equality-solving step |
| `GEN.A20` | given MO and MK functions | generator mismatches a narrowed derived `A20` |

## Calibration Questions

Before taking binding answers, confirm:

1. This gate reviews the A20 split/replacement packet only and does not itself
   authorize protected reference mutation, unit minting, unit update execution,
   target-exercise mutation, lesson output, or student/product use.
2. The H2G packet and cited evidence have been pushed to the normal remote
   branch before this review starts.
3. Any later A20 mutation must handle affected target-exercise mappings and
   `GEN.A20` behavior before student-facing exposure.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

### MTUH2G-Q1: Usage audit

Is the A20 usage audit sufficient: `3.2.2` is given-MO plus derived-MK,
`3.3.3` is derived-MO plus derived-MK, `4.1.2` is given constant MK, and
`GEN.A20` is given MO/MK functions?

Options:
- Yes, accept the usage classifications.
- Revise one or more classifications; name which.
- Hold until a broader monopoly/profit-maximisation audit is complete.
- Open answer / other, with rationale.

### MTUH2G-Q2: A20 disposition

Should A20 be narrowed or renamed to the full derived-MO and derived-MK route,
with needs `A12`/`A13`/`A02`, rather than remaining generic `MO = MK`
coverage?

Options:
- Yes, approve this A20 update direction for later planning.
- Prefer formal split/deprecate instead of updating A20 in place.
- Keep A20 unchanged and solve mappings with new units only.
- Open answer / other, with rationale.

### MTUH2G-Q3: A94 price-taker route

Should the later route include `A94` or an equivalent unit for given-MO /
price-taker plus derived-MK cases such as `3.2.2`?

Options:
- Yes, approve `A94`/equivalent as a later planning lane.
- Fold this route into `A20` instead.
- Hold until price-taker `MO = P` sequencing is reviewed more broadly.
- Open answer / other, with rationale.

### MTUH2G-Q4: A95 given MK-function route

Should the later route include `A95` or an equivalent unit for given
MK-function cases, distinct from `A91` given constant/value MK?

Options:
- Yes, approve `A95`/equivalent as a later planning lane.
- Do not add `A95`; rewrite `GEN.A20` to match the narrowed `A20` route
  instead.
- Hold `A95` until a broader generator/unit alignment review.
- Open answer / other, with rationale.

### MTUH2G-Q5: 4.1.2 mapping

Should target exercise `4.1.2` be routed away from `A20` toward `A91` for the
given constant MK equality-solving step, without treating that as complete
validation of all price-discrimination operations?

Options:
- Yes, approve the `A20`-to-`A91` mapping direction for later planning.
- Keep `A20` on `4.1.2` until the full price-discrimination route is reviewed.
- Hold `4.1.2` mapping until a broader monopoly/price-discrimination sprint.
- Open answer / other, with rationale.

### MTUH2G-Q6: GEN.A20

How should `GEN.A20` be handled if `A20` is narrowed to the
derived-MO/derived-MK route?

Options:
- Update `GEN.A20` in the same later execution packet or block exposure until
  it matches.
- Move current `GEN.A20` behavior to `A95`/equivalent and create a new `A20`
  generator.
- Hold `A20` mutation until generator implementation is reviewed.
- Open answer / other, with rationale.

### MTUH2G-Q7: Affected projections

Are the affected projection guardrails sufficient: refresh owned-content graph,
RAG chunks, PV/procedure reports, and generator-readiness only after a later
authorized mutation?

Options:
- Yes, accept the projection-refresh guardrails.
- Add more affected surfaces before any later execution packet.
- Hold until projection/PV architecture is reviewed.
- Open answer / other, with rationale.

### MTUH2G-Q8: Next sprint authority

If GATE-MTU-H2G closes, what should be authorized next?

Options:
- Authorize only a later bounded CLI-mutation planning packet for
  `A20`/`A94`/`A95` and affected mappings; no execution yet.
- Authorize a direct execution packet only if exact commands, rollback,
  generator handling, and mapping updates are named.
- Hold all downstream A20 work and revise the packet.
- Open answer / other, with rationale.

### MTUH2G-Q9: MTU-H3 sequencing

May MTU-H3 incidence/pass-through proceed after H2G planning if A20 execution
remains separately held?

Options:
- Yes, MTU-H3 may proceed if A20 remains explicitly scheduled or held
  separately.
- No, complete A20 mutation before MTU-H3.
- Hold sequencing until the A20 gate closure is written.
- Open answer / other, with rationale.

### MTUH2G-Q10: Mutation and product authority now

Does this review packet itself authorize protected reference mutation, unit
minting, unit updates, unit splits, unit deprecation, target-exercise mutation,
lesson output, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
student/product use now?

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
- Stop if any answer authorizes direct `A20` mutation from this gate.
- Stop if any answer keeps `A20` generic while also accepting `A91` as the
  given-MK route.
- Stop if any answer mutates `A20` without handling `3.2.2`, `4.1.2`, and
  `GEN.A20`.
- Stop if any answer authorizes `A94`/`A95` minting without exact specs,
  rollback, generator status, and validation.
- Stop if any answer authorizes target-exercise promotion from this gate.
- Stop if any answer hides `GEN.A20` mismatch or missing `GEN_A94`/`GEN_A95`
  generator status.
- Stop if any answer authorizes PV projection or PV machine promotion.
- Stop if candidate writes, lesson-output mutation, diagnostics, adaptive
  routing, mastery, sequencing, student-facing AI, summative use, PV
  projection, PV machine promotion, or student/product use are authorized now.

## Recommended Next Action

Commit and push this packet and cited evidence, then run the formal
GATE-MTU-H2G human review before any `A20` CLI mutation, unit minting, mapping
update, generator change, or student-facing exposure.
