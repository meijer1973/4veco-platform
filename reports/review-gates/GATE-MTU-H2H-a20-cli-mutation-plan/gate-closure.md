# GATE-MTU-H2H Gate Closure

Closed: 2026-05-28

Decision: PASS WITH CONDITIONS for CLI-mutation planning only. This gate
authorizes only a later bounded execution packet; no execution is authorized.

Reviewed remote commit: `d806903cb0072c38c265974642c1bc38fd1c0c69`

The H2H review packet, H2H planning packet, H2G closure, and cited evidence
were pushed before review. The stale planning-packet status string
`must_commit_and_push_this_packet_before_human_review` is resolved by this
closure record: the packet was reviewed from the remote branch at the commit
above.

## Accepted

- `A20` may be planned for update to `Winstmaximum oplossen met afgeleide MO
  en MK`, with needs `A12`/`A13`/`A02` and exam codes
  `A2.10`/`A2.11`/`A2.12`.
- `A94` may be planned as `MO = P en afgeleide MK oplossen`, including the
  explicit price-taker rule `MO = marktprijs P` and volkomen concurrentie /
  price-taking wording.
- `A95` may be planned as `MO = gegeven MK-functie oplossen`, distinct from
  `A91` given constant/value MK.
- Target-exercise mapping direction is accepted for later packet preparation:
  `3.2.2` replaces `A20` with `A94`, `3.3.3` keeps `A20`, and `4.1.2`
  replaces `A20` with `A91`.
- Preferred generator direction is accepted: move current `GEN.A20` behavior
  to A95/equivalent, then rewrite or block `GEN.A20` for narrowed A20.
- MTU-H3 incidence/pass-through may proceed if A20 execution remains
  explicitly tracked separately.

## Conditions

1. The later execution packet must include exact CLI commands, exact unit
   specs, exact mapping before/after diffs, rollback, generator route,
   validation stack, and no-unintended-diff proof.
2. `A20` mutation, `A94`/`A95` minting, target-exercise mapping writes,
   generator changes, and projection refresh must not occur unless authorized
   together or explicitly blocked with non-exposure proof.
3. No target-exercise promotion, PV projection, PV machine promotion, lesson
   output, diagnostics, adaptive routing, mastery/sequencing,
   student-facing AI, summative use, or student/product use is authorized.

## Authorized Next

Prepare `MTU-H2I A20/A94/A95 CLI Execution Packet` as a non-mutating execution
packet. It should contain the exact command set, exact authored mapping patch,
generator route, rollback, validation evidence, and no-exposure proof for a
later human gate.

## Not Authorized

- protected reference mutation now
- external-source mutation
- machine-reference mutation now
- `A20` mutation
- `A94` or `A95` unit minting
- target-exercise mapping writes
- generator changes
- generated projection refresh
- PV projection or PV machine promotion
- candidate writes
- lesson-output mutation
- target-exercise promotion
- diagnostics, adaptive routing, mastery, sequencing
- student-facing AI
- summative use
- student/product use

## Operational Next Action

Start `MTU-H2I A20/A94/A95 CLI Execution Packet` and keep it non-mutating
until its own human review gate closes.
