# VISUAL-QA-HARDEN-2 Visual Product QA Hardening Plan

Generated: 2026-06-05

## Status

Planned for execution after `CHECK-ROUTE-COPY-1`.

## Roadmap Context

`GATE-CHECK-SHORT-EXIT-2` remains open after `REVISE` with gate direction
`hold_for_surface_repair`. The reset sequence requires:

```text
CHECKSURFACE-RESET-1
-> GRAPH-CHECK-UX-1
-> GRAPH-EXIT-UX-1
-> CHECK-ROUTE-COPY-1
-> VISUAL-QA-HARDEN-2
-> CHECK-SURFACE-PREGATE-1
-> GATE-CHECK-SHORT-EXIT-2-RETRY
```

`GRAPH-CHECK-UX-1`, `GRAPH-EXIT-UX-1`, and `CHECK-ROUTE-COPY-1` repaired the
student-facing surfaces. This sprint hardens the evidence standard so the
retry gate cannot rely on screenshots, page existence, or label hygiene alone.

## Authorized Scope

This sprint may:

- create a consolidated visual/product QA rubric for the first-three check
  surfaces;
- aggregate proof from the completed graph short-check, graph exit-ticket, and
  route-copy repair sprints;
- add a deterministic checker that hard-fails the earlier product defects;
- write sprint evidence, lead-review artifacts, verification review, and
  roadmap status updates;
- refresh repository maps after validation.

This sprint may not:

- regenerate lesson output unless a checker reveals an implementation drift
  that must be repaired;
- start or close `GATE-CHECK-SHORT-EXIT-2-RETRY`;
- broaden `1.1.2` completion-language authority;
- authorize `1.1.1` or `1.1.3` completion language;
- authorize product-route adoption, diagnostics, mastery/sequencing, PV,
  Scale Gate 1, or student/product use.

## Quality Floor

The QA layer must fail if the repaired proof falls back to the weaknesses named
in the human review:

1. `1.1.3` advisory short check has no graph/table interaction.
2. `1.1.3` short check has no source/table context or task shell.
3. `1.1.3` exit ticket has source-heavy graph tasks but no split
   source/task workspace.
4. Screenshots exist but do not carry DOM/product facts about workspace,
   source visibility, feedback, and next action.
5. Visual QA is reduced to label hygiene or file existence.
6. The next lead review can pass without a student-experience judgement.

## Specification Requirements Fulfilled

- Product end-state: short check remains advisory route advice, separate from
  target-equivalent exit ticket.
- Product end-state: graph/table paragraph checks must use graph/table actions
  and readable source context where the target operation requires them.
- Shared operational UI: task-shell interaction, feedback, graph workspace,
  source context, and next action must be visible.
- Human-review proof: interactive surfaces need screenshots plus
  machine-readable state proof and a checker.

## Evidence Needed

- `reports/sprints/VISUAL-QA-HARDEN-2-product-qa-rubric.md`
- `reports/json/visual-qa-harden2-proof.json`
- `reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md`
- `build-scripts/sprints/emit-visual-qa-harden2-proof.js`
- `build-scripts/sprints/check-visual-qa-harden2.js`
- command log and JSONL command log
- lead-review assignment, round 1, correction log, and round 2
- verification review and result
- roadmap update recording completion and next action

## Procedure

1. Record baseline from `CHECKSURFACE-RESET-1`,
   `GRAPH-CHECK-UX-1`, `GRAPH-EXIT-UX-1`, and `CHECK-ROUTE-COPY-1`.
2. Write the visual/product QA rubric that names required checks and hard-fail
   conditions.
3. Build an evidence emitter that reads existing source data, rendered proof,
   screenshot manifests, and sprint reports, then writes consolidated proof and
   a human-readable QA report.
4. Build a checker that:
   - asserts `1.1.3-korte-check` uses context blocks, task-shell tasks,
     graph construction, graph reading, table-value selection, visible grid,
     targeted retry feedback, route advice, mobile proof, dark proof, and no
     ordinary choice-only controls;
   - asserts `1.1.3-exit-ticket` uses split source/task layout, constrained
     scrollable source pane, sticky question strip, graph workspace, visible
     grid, same-workspace line, targeted feedback, held completion language,
     mobile proof, and dark proof;
   - asserts landing pages distinguish advisory and exit routes;
   - asserts screenshot manifests/proofs contain inspection objects, not only
     file paths;
   - asserts a student-experience judgement exists before pre-gate reliance.
5. Run the emitter and checker.
6. Run scoped prior checkers so this sprint does not weaken prior repairs.
7. Record lead-review round 1, correction log, and round 2.
8. Run final validation and refresh maps.
9. Commit and push the platform branch.

## Acceptance Tests

Required passing commands:

```text
node build-scripts/sprints/emit-visual-qa-harden2-proof.js
node build-scripts/sprints/check-visual-qa-harden2.js
node build-scripts/sprints/check-graph-check-ux1.js
node build-scripts/sprints/check-graph-exit-ux1.js
node build-scripts/sprints/check-check-route-copy1.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
```

Final closure validation should also run `npm.cmd run check:platform` unless a
blocking unrelated fixture issue is explicitly recorded.

## Stop Conditions

Stop instead of completing this sprint if:

- `1.1.3` short-check proof no longer shows graph/table task-shell
  interaction;
- `1.1.3` exit-ticket proof no longer shows source/task split workspace;
- screenshot manifests lack DOM/product inspection objects;
- generated output must be changed beyond QA hardening and no plan update has
  been made;
- any artifact asks for human gate closure, product adoption, new completion
  language, diagnostics, mastery/sequencing, PV, Scale Gate 1, or student use.

## Review Gate

The review gate that judges this sprint is the later
`CHECK-SURFACE-PREGATE-1`. This sprint prepares its visual/product QA
evidence; it does not replace the pre-gate lead review or the human retry
gate.

## Higher-Quality Improvements In Scope

- Make the consolidated proof explicitly reference the reset findings
  `CSR1-F1` through `CSR1-F5`.
- Add a compact student-experience judgement that future lead review must
  inspect.

## Omitted Follow-Up Work

- `CHECK-SURFACE-PREGATE-1` must still perform the final pre-gate evidence and
  lead-review readiness check.
- `GATE-CHECK-SHORT-EXIT-2-RETRY` must still collect human direct review
  comments before any closure decision.
