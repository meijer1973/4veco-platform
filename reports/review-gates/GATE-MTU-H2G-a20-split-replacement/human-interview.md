# GATE-MTU-H2G Human Interview Record

Date: 2026-05-28

Reviewed remote commit:
`f925da5ed7521c3052c60668599c5a97d99aaf7a`

Verdict: PASS WITH CONDITIONS for A20 split/replacement planning only.

No mutation, unit minting, target-exercise write, generator change, PV
projection, lesson output, candidate write, or student/product use is
authorized by this review.

## Calibration Answers

1. Yes. This gate reviews the A20 split/replacement packet only and does not
   itself authorize mutation, unit minting, target-exercise mutation, lesson
   output, or product use.
2. Yes, with closure override. The packet and cited evidence were fetchable
   remotely. The reviewed packet JSON still contained
   `must_commit_and_push_this_packet_before_human_review`; the closure records
   the reviewed commit hash above as the satisfied remote proof.
3. Yes. Any later A20 mutation must handle affected target-exercise mappings
   and `GEN.A20` behavior before student-facing exposure.

## Answers

| Question | Decision | Rationale |
|---|---|---|
| MTUH2G-Q1 | Accept with wording refinement | Classifications are accepted. For `3.2.2`, say explicitly that the price-taker rule is `MO = P`. |
| MTUH2G-Q2 | Approve A20 narrowing for later planning only | A20 may carry the derived-MO plus derived-MK route with `A12`/`A13`/`A02`, but only after mappings and generator behavior are handled. Add `A2.11`. |
| MTUH2G-Q3 | Approve A94/equivalent | `3.2.2` should not require derivative-MO; A94 must name the price-taker rule. |
| MTUH2G-Q4 | Approve A95/equivalent | A91 covers given constant/value MK. A95 covers given MK-function cases and can receive the current `GEN.A20` behavior. |
| MTUH2G-Q5 | Approve `4.1.2` A20-to-A91 direction | This fixes the given constant-MK operation only; it does not validate all price-discrimination operations. |
| MTUH2G-Q6 | Prefer moving current `GEN.A20` behavior to A95 | Current `GEN.A20` gives MO and MK functions directly, so it mismatches a narrowed derive-both A20. |
| MTUH2G-Q7 | Accept with owned-source/generated-projection separation | Authored mapping changes must be intentional; generated reports may refresh only after authorized mutation. |
| MTUH2G-Q8 | Authorize later bounded CLI-mutation planning packet only | Next packet must name specs, mapping changes, generator handling, rollback, validation, and no-exposure proof. |
| MTUH2G-Q9 | MTU-H3 may proceed if A20 stays tracked | Incidence/pass-through work need not wait if A20 remains explicitly scheduled or held. |
| MTUH2G-Q10 | No authority now | No mutation, target-exercise writes, unit minting, generator changes, PV projection, or student/product use. |

## Required Conditions

- Add `A2.11` to the proposed A20 exam codes.
- Rename A20 with clearer wording; avoid the ambiguous phrase `afgeleide MO`.
- Add an explicit price-taker `MO = P` step to A94.
- Decide whether `GEN.A20` is rewritten for narrowed A20, moved to A95, or
  blocked.
- Treat `3.2.2`, `3.3.3`, and `4.1.2` mapping changes as authored-reference
  updates with exact before/after diffs.
- Refresh generated projections only after authorized unit or mapping
  mutations.
- Authorize no mutation or product use from this gate.

## Pattern Analysis

The review accepts the decomposition:

```text
A20 = derived MO + derived MK
A91 = given constant/value MK
A94 = price-taker / given MO + derived MK
A95 = given MK-function
```

The remaining risk is execution hygiene, not conceptual fit: the next packet
must bind unit specs, mapping diffs, generator behavior, rollback, validation,
and no-exposure proof before any mutation can run.
