# GATE-MTU-H2I Gate Closure

Closed: 2026-05-28

Decision: PASS WITH CONDITIONS for authorizing a later bounded execution sprint
for `A20`/`A94`/`A95`, target mappings, generator route, and generated
projection refresh after source mutations.

Reviewed remote commit:
`1fb0b95fc6b031f37ff780fb3db063dd9deb7d25`

The H2I review packet, H2I execution packet, H2H closure, and cited evidence
were pushed before review. The stale execution-packet status string
`must_commit_and_push_this_packet_before_human_review` is resolved by this
closure record: the packet was reviewed from the remote branch at the commit
above.

## Accepted

- `A20` may be updated to `Winstmaximum oplossen met afgeleide MO en MK`,
  retaining `A2.11` and narrowing the unit to derived MO plus derived MK.
- `A94` may be added for the price-taker route:
  `MO = marktprijs P` plus derived MK, without an `A12` prerequisite.
- `A95` may be added for the given MK-function route, distinct from `A91`
  given constant/value MK.
- Target-exercise mapping patches are accepted for execution:
  `3.2.2` replaces `A20` with `A94`, `3.3.3` remains unchanged with `A20`,
  and `4.1.2` replaces `A20` with `A91`.
- Generator route is accepted: move current `GEN.A20` behavior to `GEN.A95`,
  then block or rewrite `GEN.A20` for narrowed `A20`; keep `A94`
  generator-blocked unless `GEN.A94` is separately implemented.
- Generated projections may refresh only after authorized unit, mapping, and
  generator source mutations.

## Conditions

1. Run final preflight: clean worktree or explicit expected files,
   `A94`/`A95` absent, `A20`/`A91`/`A12`/`A13`/`A02` present, and `GEN.A20`
   present.
2. Print each extracted unit spec before CLI execution.
3. Run `A20` `unit-update --dry-run` and prove `A2.11` remains.
4. Print exact before/after target-exercise arrays before authored mapping
   updates.
5. Print exact generator patch/diff before generator mutation.
6. Prove no `record_status`, `source_ref`, `placeholder`, paragraph metadata,
   or promotion fields changed.
7. Refresh generator-readiness reports and prove no stale or missing
   interactive exposure.
8. Refresh generated projections only after authorized source mutations.
9. Run the full validation stack and `git diff --check`.

## Authorized Next

`MTU-H2J A20/A94/A95 Bounded CLI Execution` may execute the reviewed bounded
scope after final preflight:

- `A20` unit-update;
- `A94` unit-add;
- `A95` unit-add;
- exact target-exercise mapping patches for `3.2.2` and `4.1.2`, with
  `3.3.3` verified unchanged;
- generator route for `GEN.A20` and `GEN.A95`, with `A94` generator-blocked
  unless implemented;
- generated projection refresh caused by those source mutations.

## Not Authorized

- hand edits to `references/machine/` or `references/external/`
- candidate writes
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student/product use

## Operational Next Action

Start `MTU-H2J A20/A94/A95 Bounded CLI Execution` with a checkable sprint
plan, then execute only the coupled bounded scope if final preflight matches
the reviewed H2I packet.
