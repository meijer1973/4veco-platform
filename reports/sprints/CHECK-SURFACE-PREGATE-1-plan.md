# CHECK-SURFACE-PREGATE-1 Product Pregate Plan

Generated: 2026-06-05

## Status

Planned for execution after `VISUAL-QA-HARDEN-2`.

## Roadmap Context

`GATE-CHECK-SHORT-EXIT-2` returned `REVISE` with gate direction
`hold_for_surface_repair` and the additional instruction to replan before the
next human gate. The repair sequence is:

```text
CHECKSURFACE-RESET-1
-> GRAPH-CHECK-UX-1
-> GRAPH-EXIT-UX-1
-> CHECK-ROUTE-COPY-1
-> VISUAL-QA-HARDEN-2
-> CHECK-SURFACE-PREGATE-1
-> GATE-CHECK-SHORT-EXIT-2-RETRY
```

The prior repair sprints fixed the graph/table short check, the graph exit
ticket source/task workspace, landing route copy, and QA hard-fail checks. This
sprint must now make the green product packet that proves the retry human gate
is worth asking for.

## Authorized Scope

This sprint may:

- create a human-readable five-minute walkthrough for the repaired first-three
  check surfaces;
- create a student-experience review that judges orientation, action,
  feedback, and next action for a typical 4 vwo student;
- aggregate prior repair proof into `check-surface-pregate1-proof.json`;
- create a readiness report and deterministic checker;
- run the pre-gate lead-review cycle, verification review, validators, map
  refresh, commit, and remote publication.

This sprint may not:

- start or close `GATE-CHECK-SHORT-EXIT-2-RETRY`;
- write a human review packet for the retry gate unless that is explicitly
  requested after this sprint completes;
- broaden the reviewed `1.1.2` completion-language authority;
- authorize completion language for `1.1.1` or `1.1.3`;
- authorize product-route adoption, diagnostics, mastery/sequencing, PV,
  Scale Gate 1, or student/product use.

## Quality Floor

The pregate packet must be green only if it proves more than file existence:

1. A student can see that `Korte check` gives advice and `Exit ticket` is the
   end-check route.
2. The `1.1.3` advisory short check requires graph/table action, not ordinary
   choice-only answering.
3. The `1.1.3` exit ticket uses a readable source-left/task-right workspace
   where source scrolling does not hide the active question.
4. Graph/table feedback is targeted and gives a useful route or correction.
5. The student knows the next useful action after a wrong answer and after a
   correct path.
6. The packet keeps all product-authority boundaries explicit.

## Specification Requirements Fulfilled

- Product end-state: every paragraph needs a visible route from current
  readiness to target-exercise readiness.
- Product end-state: route advice and end-check proof must be distinguishable.
- Dual coding: graph/table surfaces must use visual graph/table work where the
  target operation requires it.
- Unified student experience: short check feedback should route the student to
  the same graph/table method used in the exit ticket.
- Human-review proof: interactive surfaces require playable/rendered evidence,
  screenshots, state proof, and checker-readable stop conditions.

## Evidence Needed

- `reports/sprints/CHECK-SURFACE-PREGATE-1-product-walkthrough.md`
- `reports/sprints/CHECK-SURFACE-PREGATE-1-student-experience-review.md`
- `reports/json/check-surface-pregate1-proof.json`
- `reports/sprints/CHECK-SURFACE-PREGATE-1-readiness-report.md`
- `build-scripts/sprints/emit-check-surface-pregate1-proof.js`
- `build-scripts/sprints/check-check-surface-pregate1.js`
- sprint plan, baseline, planning review, command log, and JSONL command log
- lead-review assignment, round 1, correction log, and round 2
- verification review and result
- roadmap update recording completion and next action

## Procedure

1. Record baseline from the reset sprint, graph short-check repair, graph
   exit-ticket repair, route-copy repair, and visual QA hardening.
2. Inspect key screenshots for the landing route, `1.1.3` short check, and
   `1.1.3` exit ticket on desktop and mobile/dark.
3. Write the five-minute product walkthrough in the order a reviewer should
   inspect the surfaces.
4. Write the student-experience review against the product end-state questions:
   orientation, graph/table action, source/task readability, feedback, and next
   action.
5. Build the proof emitter and checker.
6. Run the emitter, pregate checker, prior repair checkers, report JSON
   validation, scope-language check, platform/book validators, and map refresh.
7. Run the lead-review cycle and verification review.
8. Update the roadmap so the next action is `GATE-CHECK-SHORT-EXIT-2-RETRY`
   packet preparation, not Scale Gate work.
9. Commit and push the platform branch.

## Acceptance Tests

Required passing commands:

```text
node build-scripts/sprints/emit-check-surface-pregate1-proof.js
node build-scripts/sprints/check-check-surface-pregate1.js
node build-scripts/sprints/check-visual-qa-harden2.js
node build-scripts/sprints/check-graph-check-ux1.js
node build-scripts/sprints/check-graph-exit-ux1.js
node build-scripts/sprints/check-check-route-copy1.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

Map refresh must also run:

```text
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
```

## Stop Conditions

Stop instead of completing this sprint if:

- the `1.1.3` short check no longer has graph/table task-shell interaction;
- the `1.1.3` exit ticket no longer has split source/task workspace proof;
- screenshots or proof cannot show targeted feedback and next action;
- the student-experience review cannot say `PASS WITH FLAGS`;
- any artifact asks for retry-gate closure, product-route adoption, new
  completion language, diagnostics, mastery/sequencing, PV, Scale Gate 1, or
  student/product use;
- repository maps cannot be refreshed or the branch cannot be pushed for
  off-site review.

## Review Gate

This sprint is judged by internal lead review and deterministic validation. It
prepares the evidence base for `GATE-CHECK-SHORT-EXIT-2-RETRY`; it does not
replace direct human review comments for that gate.

## Higher-Quality Improvements In Scope

- Include a reviewer-oriented walkthrough that names the exact screenshots and
  state proof to inspect.
- Carry the previous reset findings `CSR1-F1` through `CSR1-F5` into the proof
  so the retry packet can show why the earlier blockers are guarded.

## Omitted Follow-Up Work

- `GATE-CHECK-SHORT-EXIT-2-RETRY` must still be prepared, pushed, reviewed by
  a human, resolved, and explicitly closed before any downstream authority is
  claimed.
- Scale Gate work, product-route adoption, and target-equivalent completion
  expansion remain separate later gates.
