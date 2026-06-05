# Sprint CHECK-SHORT-EXIT-2: Baseline

Generated: 2026-06-05

## Plan reference

- Plan: `reports/sprints/CHECK-SHORT-EXIT-2-plan.md`

## Repository State

- Branch: `codex/check-short-exit-2`
- Base commit: `ed12764ad39eb1290c899a9bee08edf6a77c126d`
- `main` was current with `origin/main` before this branch was created.
- Worktree was clean before CHECK-SHORT-EXIT-2 artifacts were added.

## Roadmap Baseline

Current roadmap version:
`v3.56-shared-task-ingest-gate-closed`.

`GATE-SHARED-TASK-INGEST-REPAIR-1` is closed PASS WITH FLAGS for review-only
shared task context/source-ingestion readiness. The gate authorizes controlled
downstream adoption-preparation only and points next to `CHECK-SHORT-EXIT-2`.

Roadmap row for `CHECK-SHORT-EXIT-2`:

- status: not completed;
- unlocked for planning after the shared-task ingest gate closure;
- must ensure `1.1.1` through `1.1.3` each have an advisory short check and
  target-equivalent exit ticket, or an explicit blocker;
- hints must be hidden in short checks and absent from exit tickets except
  interface help;
- `1.1.3` graph/table proof must use source context and reconstructed visuals;
- no product-route adoption or target-equivalent proof claim is allowed until
  this sprint's own rendered-output review authorizes that claim.

## Product-Spec Baseline

Relevant product requirements:

- every paragraph eventually needs both an advisory short check and a separate
  target-equivalent exit ticket;
- short checks provide local route advice and may use hidden/clickable support;
- exit tickets must check the same target-operation chain at the same level
  and must not expose content hints before attempt;
- source-dependent tasks use context-first source blocks and task
  `contextRefs`;
- student-facing copy may not imply diagnostics, mastery, grading, automatic
  sequencing, summative use, product-wide adoption, PV, or Scale Gate 1.

## Current Check-Surface Facts

From `CHECK-SHORT-EXIT-1`:

| Paragraph | Advisory short check | Target-equivalent exit ticket | Missing work |
|---|---|---|---|
| `1.1.1` | Exists as advisory `Korte check`; targetReadinessEvidence false | Missing | Add A43/B01/B02 target-level proof or blocker |
| `1.1.2` | Missing | Exists and reviewed locally | Add separate advisory short check |
| `1.1.3` | Missing | Missing | Add both surfaces using source/context graph-table proof |

## Current Source Data

- `source-data/book-1/exit-ticket/1.1.1.json`
  - title: `Korte check`
  - surface: legacy/no explicit `surface`
  - metadataAlignment targetReadinessEvidence: `false`
  - task shape: 4 choice tasks
- `source-data/book-1/exit-ticket/1.1.2.json`
  - surface: `target_equivalent_exit_ticket`
  - targetEquivalent gateApproved: `true`
  - completionLanguageEligible: `true`
  - task shape: 3 `calculation_work_capture` tasks and 1
    `structured_short_response` task
- `source-data/book-1/exit-ticket/1.1.3.json` is absent.

## Current Generator/Runtime Facts

- `build-scripts/platform/build-exit-ticket-shells.js` currently treats the
  JSON filename stem as `parNr`, writes `shared/exit-ticket/<parNr>.js`, and
  writes one `<parNr> ... - exit-ticket.html` page per paragraph.
- `build-scripts/platform/build-landing-page.js` currently scans one
  `files.check.exitTicket` page and renders one Check card.
- `engines/exit-ticket-ui.js` renders shared task-shell tasks individually but
  does not render `contextBlocks` in the exit-ticket wrapper.
- `engines/task-shell-ui.js` already exposes `renderContextBlocks`,
  `renderTask`, `renderStaticHtml`, and `renderFeedback`.
- `engines/task-shell-engine.js` already validates context blocks and
  `contextRefs` for full task sets.

## Source Authority Baseline

`1.1.3` graph/table task preparation may use the Repair 4 accepted review-only
evidence as adoption-preparation input, but the new generated Book 1 surface
must receive its own rendered-output proof and review before claiming new
target-equivalent authority.

## Initial Blockers To Resolve

1. Multi-surface source/generator convention is required before both check
   types can coexist.
2. Exit-ticket context rendering is required before `1.1.3` source-dependent
   proof is student-readable.
3. New `1.1.1` and `1.1.3` target-equivalent candidates cannot show approved
   completion language before human review.
4. Generated output requires deploy-pipeline writes to `../4veco-lessen`.

## Boundary Baseline

Forbidden at sprint start:

- protected reference mutation;
- direct target-exercise registry writes;
- candidate-storage writes;
- hand edits to generated lesson output;
- product-route adoption;
- target-equivalent completion claims for new surfaces before review;
- diagnostics, mastery/sequencing, summative use, PV, Scale Gate 1, and
  product-wide use.

## Data integrity notes

Protected reference data status: unchanged at baseline. This sprint must not
edit `references/machine/`, `references/external/`, or
`references/authored/course-target-exercises.json`.

Generated lesson output status: unchanged at baseline. Later generated output
changes are allowed only through the deploy pipeline and must be recorded as
generated-output evidence.

Source exit-ticket data status: current source files are limited to
`1.1.1.json` and `1.1.2.json`. The sprint may migrate or add files under
`source-data/book-1/exit-ticket/` only after the multi-surface convention is
implemented.
