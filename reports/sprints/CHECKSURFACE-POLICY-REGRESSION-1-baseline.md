# CHECKSURFACE-POLICY-REGRESSION-1 Baseline

Generated: 2026-06-06

## Starting Point

The platform branch is `codex/check-short-exit-2`. Before this inserted
sprint, the branch had already prepared `GATE-CHECK-SHORT-EXIT-2-RETRY` as a
direct human-review packet. A later lead-agent response, based on renewed human
feedback, superseded that packet.

The old roadmap state still pointed to:

```text
GATE-CHECK-SHORT-EXIT-2-RETRY direct human review comments
```

That is now stale. The required order is:

```text
CHECKSURFACE-POLICY-REGRESSION-1
-> CHECKSURFACE-EXCELLENCE-REDESIGN-1
-> CHECKSURFACE-EXCELLENCE-AUDIT-3P
-> CHECKSURFACE-GATE-RETRY-EXCELLENT-1
-> renewed direct human review comments
```

## Human Feedback Being Preserved

- Prior accepted decisions about shared graph tasks were lost between review
  cycles.
- `1.1.3` exit-ticket evidence still explained the procedure before the
  student attempted the graph task.
- Answer-giveaway controls and labels remained possible.
- The interval-halving selector could contain only correct intervals.
- The short check and exit ticket were too similar.
- The next packet must show excellence, not mere file/test existence.

## Baseline Evidence

Prior repair artifacts are useful context, but they are not sufficient closure
evidence for the renewed gate:

- `GRAPH-CHECK-UX-1`
- `GRAPH-EXIT-UX-1`
- `CHECK-ROUTE-COPY-1`
- `VISUAL-QA-HARDEN-2`
- `CHECK-SURFACE-PREGATE-1`
- old `GATE-CHECK-SHORT-EXIT-2-RETRY` packet artifacts

## Initial Stop-Risk

If the roadmap still points directly to human review comments, the sprint is
not ready for closure. If the checker cannot fail the exact reviewer complaints,
the policy is still only prose.
