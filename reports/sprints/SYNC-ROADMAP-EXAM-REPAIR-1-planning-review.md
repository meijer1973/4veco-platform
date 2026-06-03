# Sprint SYNC-ROADMAP-EXAM-REPAIR-1: Planning Review

Generated: 2026-06-03

Reviewer: planning/review subagent `019e8ee8-28f8-7c82-8c1c-a02b4c257a3c`

## Verdict

PASS WITH REQUIRED SYNC TARGETS.

The sprint may proceed as roadmap synchronization only. It must not start
`EXAM-SOURCE-AUTH-1` until the false-complete lesson roadmap statuses are
corrected.

## Quality floor confirmed

- Both roadmaps must tell the same operational story before
  `EXAM-SOURCE-AUTH-1` starts.
- `SPRINT-PROTOCOL-HARDEN-2` must be closed and visible in both roadmaps.
- No context/source/ingest sprint may be marked complete without sprint
  artifacts.
- The old broad exam/textbook source reconstruction lane must be replaced by
  the repair sequence from the handoff.
- `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, and Scale Gate 1 must remain blocked
  on the repaired ingestion gate, not the old gate.
- No generated lesson output, protected reference mutation, source-data
  mutation, product-route adoption, or Scale Gate authority may be implied.

## Required row changes

Target sequence in both roadmaps:

```text
SPRINT-PROTOCOL-HARDEN-2                 yes
SYNC-ROADMAP-EXAM-REPAIR-1               yes after this sprint closes
EXAM-SOURCE-AUTH-1                       no
TASK-CONTEXT-SPEC-1                      no
TASK-CONTEXT-RUNTIME-1                   no
CONTEXT-VISUAL-STD-1                     no
SOURCE-RECONSTRUCT-2-ACTUAL-EXAM         no
TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM      no
TASK-INGEST-TRANSFORM-3-TEXTBOOK         no
GATE-SHARED-TASK-INGEST-REPAIR-1         no
```

`SYNC-TASK-CONTEXT-INGEST-1` must be handled explicitly as superseded or
absorbed by `SYNC-ROADMAP-EXAM-REPAIR-1`, not silently completed.

The active blocker references must move from `GATE-SHARED-TASK-INGEST-1` to
`GATE-SHARED-TASK-INGEST-REPAIR-1`.

## Checker requirements

The checker must fail unless:

- both roadmaps contain the same repair sequence and statuses;
- lesson roadmap contains `SPRINT-PROTOCOL-HARDEN-2`;
- `EXAM-SOURCE-AUTH-1` appears before context/runtime/reconstruction work;
- old active rows `SOURCE-RECONSTRUCT-1`, `TASK-INGEST-TRANSFORM-1`, and
  `GATE-SHARED-TASK-INGEST-1` are gone or explicitly superseded;
- no context/source implementation row is marked complete without artifacts;
- blockers point to `GATE-SHARED-TASK-INGEST-REPAIR-1`;
- `EXAM-SOURCE-AUTH-1` requires external primary exam authority and rejects
  `official-style`, `exam-style`, `local review data`, and reconstructed local
  sources as exam proof.

## Scope warnings

This sprint must remain roadmap synchronization only. It must not mutate exam
sources, machine references, source data, or generated lesson output.
