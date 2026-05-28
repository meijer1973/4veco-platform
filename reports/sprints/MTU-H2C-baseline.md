# Sprint MTU-H2C: Baseline

Date: 2026-05-28

## Plan reference

- `reports/sprints/MTU-H2C-plan.md`

## Starting state

- Authorizing gate: `reports/review-gates/GATE-MTU-H2B-cli-execution/gate-closure.json`.
- Source execution packet: `reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.json`.
- Source mutation plan: `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`.
- Live registry context: `references/machine/micro-teaching-units.json`.

## Data integrity notes

Protected reference data may change only through the approved reference CLI and
only for the reduced scope allowed by GATE-MTU-H2B. Hand edits to
`references/machine/` remain forbidden. `references/external/` is completely
out of scope.

`A12` and `A20` are held. Candidate storage, lesson output, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, and student/product use remain blocked.

The unrelated untracked file `knowledge/exit-ticket-game-1.1.1.zip` is present
and must remain untouched.

## Baseline findings

- `A12` live registry currently carries `exam_codes: [A2.11]`.
- The H2A `A12` update spec would remove `A2.11`; therefore `A12` cannot be
  executed from that spec.
- `A20` remains blocked by active given-MK usage in target exercise `4.1.2`.
- The reviewed `A92` spec depends on `A89`, so `A92` cannot execute unless
  `A89` is accepted/included, `A92` is revised, or `A92` is held.

## Stop conditions

Stop before execution if final preflight shows ID collisions, changed reviewed
plan files, missing live targets, any hidden `A12` or `A20` command, unresolved
`A92`/`A89` dependency, candidate-storage creation, lesson-output diff, or any
product-use authorization.
