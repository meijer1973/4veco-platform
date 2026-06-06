# GATE-CHECK-SHORT-EXIT-2-RETRY Baseline

Generated: 2026-06-06

## Starting State

Platform branch:

```text
codex/check-short-exit-2
```

Baseline platform commit:

```text
691f5ea52e3b85be201ef28ab8497fcef0f07427
```

Generated lesson output branch and commit:

```text
main
53a9117ca39205573db2e7bacd373734960ef6b9
```

## Baseline Evidence

- `GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review` returned
  `REVISE`, gate direction `hold_for_surface_repair`, and additional direction
  `replan_before_next_human_gate`.
- `CHECKSURFACE-RESET-1` recorded the product-quality reset and findings
  `CSR1-F1` through `CSR1-F5`.
- `GRAPH-CHECK-UX-1` repaired the `1.1.3` short check graph/table action.
- `GRAPH-EXIT-UX-1` repaired the `1.1.3` source/task graph workspace.
- `CHECK-ROUTE-COPY-1` repaired landing route copy.
- `VISUAL-QA-HARDEN-2` added hard-fail QA.
- `CHECK-SURFACE-PREGATE-1` produced a `PASS WITH FLAGS` student-experience
  pregate and proof status `complete`.

## Product Baseline

The repaired packet is ready to ask a human reviewer whether the first-three
Check surfaces now satisfy reviewable product quality:

- route advice and end-check routes are visibly distinct;
- graph/table work exists in the short-check and exit-ticket evidence;
- source/task layout is readable;
- feedback and next action are present;
- mobile/dark proof exists.

## Authority Baseline

No current evidence authorizes:

- new completion language for `1.1.1` or `1.1.3`;
- product-route adoption;
- diagnostics;
- mastery/sequencing;
- PV;
- Scale Gate 1;
- student/product use.

## Operational Next Step

Create the retry direct review packet and publish it before human comments
start.
