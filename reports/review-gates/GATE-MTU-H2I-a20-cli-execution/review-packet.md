# GATE-MTU-H2I A20/A94/A95 CLI Execution Review Packet

Generated: 2026-05-28

Status: review packet ready, no mutation authorized.

## Review Scope

Review the MTU-H2I A20/A94/A95 execution packet only. Decide whether a later bounded execution sprint may be authorized.

Remote evidence prerequisite: This review packet, the H2I execution packet, and all cited evidence must be committed and pushed to the normal remote branch before human review starts.

## Evidence Base

- `reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.json`
- `reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.md`
- `reports/review-gates/GATE-MTU-H2H-a20-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/solo-q1-q3-a20-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json as read-only context`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add.js`
- `references/reference-team-roadmap.md`

## Planned Review Focus

| Surface | Finding | Review issue |
|---|---|---|
| `A20` | unit-update command narrows A20 while retaining A2.11 | approve or revise execution command |
| `A94/A95` | unit-add specs are exact and unit-add dry-run limitation is visible | approve or revise minting lanes |
| `target mappings` | exact authored mapping patches for 3.2.2 and 4.1.2, with 3.3.3 verified unchanged | approve or revise mapping write plan |
| `GEN.A20/GEN.A95` | current GEN.A20 behavior moves to GEN.A95 and GEN.A20 is blocked until narrowed generator exists | approve, revise, or require generator implementation first |

## Calibration Questions

Before taking binding answers, confirm:

1. Confirm this gate reviews the H2I execution packet only and does not itself authorize protected reference mutation, unit minting, unit update execution, target-exercise mutation, generator changes, projection refresh, lesson output, or student/product use.
2. Confirm the H2I packet and cited evidence have been pushed to the normal remote branch before this review starts.
3. Confirm A20, A94/A95, target mappings, and generator behavior must be executed together or explicitly blocked together with no-exposure proof.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one question at a time.

### MTUH2I-Q1: remote evidence and preflight

Is the remote-before-review rule and final pre-execution preflight sufficient for any later execution sprint?

Options:
- Yes, accept the remote/preflight requirements.
- Add stronger remote hash, reviewed-spec comparison, or clean-worktree proof before execution.
- Hold until the packet is regenerated from a newer base commit.
- Open answer / other, with rationale.

### MTUH2I-Q2: A20 update command

Should a later execution sprint run the A20 unit-update command after dry-run, retaining A2.11 and narrowing A20 to derived MO plus derived MK?

Options:
- Yes, approve the A20 update command for later execution.
- Revise A20 fields or command before execution.
- Hold A20 until generator implementation is designed differently.
- Open answer / other, with rationale.

### MTUH2I-Q3: A94 and A95 unit-add commands

Are the A94 and A95 unit-add specs acceptable, with A94 carrying the price-taker MO = P route and A95 carrying given MK-function solving?

Options:
- Yes, approve both unit-add commands for later execution with unit-add dry-run limitation visible.
- Approve only one; name which and why.
- Revise one or both specs before execution.
- Open answer / other, with rationale.

### MTUH2I-Q4: target-exercise mapping patch

Are the exact authored mapping patches acceptable: 3.2.2 replaces A20 with A94, 3.3.3 stays unchanged with A20, and 4.1.2 replaces A20 with A91?

Options:
- Yes, approve the mapping patch for later execution.
- Revise one record or field; name it.
- Hold mapping writes until broader target-exercise review.
- Open answer / other, with rationale.

### MTUH2I-Q5: GEN.A20 and GEN.A95 route

Is the generator route acceptable: move current GEN.A20 behavior to GEN.A95, block GEN.A20 until a narrowed derive-both generator exists, and keep A94 generator-blocked unless GEN.A94 is separately implemented?

Options:
- Yes, approve this generator route for later execution.
- Require a new narrowed GEN.A20 implementation before A20 mutation.
- Keep GEN.A20 unchanged and hold A20 mutation.
- Open answer / other, with rationale.

### MTUH2I-Q6: generator readiness and non-exposure

Are the generator-readiness and no-exposure requirements sufficient after the later execution?

Options:
- Yes, require refreshed generator readiness and no missing/stale interactive exposure.
- Add more proof requirements before execution; name them.
- Hold until generator/PV architecture is reviewed.
- Open answer / other, with rationale.

### MTUH2I-Q7: command order and rollback

Are the command order, extracted-spec logging, authored mapping before/after logs, generator patch summary, rollback route, and validation stack sufficient?

Options:
- Yes, accept the command/order/rollback/validation standard.
- Add more proof requirements before execution; name them.
- Hold until unit-add dry-run or authored-reference CLI exists.
- Open answer / other, with rationale.

### MTUH2I-Q8: projection refresh

Should generated projections refresh only after authorized unit, mapping, and generator source mutations?

Options:
- Yes, keep projection refresh after authorized source mutation only.
- Add more generated surfaces before execution.
- Hold until projection/PV architecture is reviewed.
- Open answer / other, with rationale.

### MTUH2I-Q9: next sprint authority

If GATE-MTU-H2I closes, what should be authorized next?

Options:
- Authorize a bounded execution sprint for A20/A94/A95, target mappings, and generator route only.
- Authorize only generator implementation planning before execution.
- Hold all downstream work and revise the H2I packet.
- Open answer / other, with rationale.

### MTUH2I-Q10: mutation and product authority now

Does this review packet itself authorize protected reference mutation, unit minting, unit updates, target-exercise mutation, generator changes, projection refresh, lesson output, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use now?

Options:
- No. This packet authorizes no mutation or product use; a closure may only authorize a named later sprint.
- Yes, but only for explicitly named low-risk CLI lanes after exact proof is accepted.
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
- Require explicit human confirmation before writing a closure record or authorizing downstream sprint scope.

## Current Stop Conditions

- Stop if the packet/evidence has not been pushed before review.
- Stop if any answer authorizes hand edits to references/machine or references/external.
- Stop if any answer authorizes direct execution from this review packet itself.
- Stop if A20 removes A2.11.
- Stop if A94 loses the price-taker MO = P / volkomen concurrentie step.
- Stop if A95 collapses into A91 or no longer covers given MK-function solving.
- Stop if target-exercise mapping writes are treated as generated projections or target-exercise promotion.
- Stop if GEN.A20 stale exposure is hidden after A20 narrowing.
- Stop if A94 missing-generator status is hidden.
- Stop if generated projections are refreshed before authorized source mutations.
- Stop if PV projection or PV machine promotion is authorized now.
- Stop if candidate writes, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, or student/product use are authorized now.

## Recommended Next Action

Commit and push this packet and cited evidence, then run GATE-MTU-H2I before any A20 mutation, A94/A95 unit minting, target-exercise mapping update, generator change, generated projection refresh, or student-facing exposure.
