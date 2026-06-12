# CHECKSURFACE-EVIDENCE-REFRESH-1 Plan

Date: 2026-06-11

Status: active repair sprint after direct human review.

## Sprint Name

Check-Surface Evidence Refresh

## Trigger

`GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review` returned
`hold_for_surface_repair`. The current student-facing surfaces appear largely
repaired, but the gate cannot close because proof JSON, screenshots, audit
evidence, and review-lab authority text do not consistently describe merged
`main`.

## Quality Floor

The review evidence must describe the actual current source data and generated
student-facing output. No proof file, screenshot manifest, review lab, audit
matrix, or packet checker may preserve stale `1.1.2` authority or stale
`1.1.3` IJskraam/formula-context evidence.

## Specification Fulfilment Matrix

| Requirement | Evidence required | Stop condition |
|---|---|---|
| Record returned human comments | `direct-review-comments.md/json` with `hold_for_surface_repair` and typed findings | Missing finding classification, blocks, does-not-block, or proof-to-close |
| Preserve REV-STD-1 boundaries | Packet/checker/lab keep product-route adoption, completion language, diagnostics, mastery/sequencing, PV, Scale Gate 1, and student/product use unauthorized | Any artifact widens authority |
| Refresh `1.1.3` exit proof | `graph-exit-ux1-proof.json`, screenshots, and manifest match current `broodjeskraam` source/table/formula-builder output | Proof mentions `IJskraam`, three context blocks, static formula context, or interval-halving-only interaction |
| Refresh six-surface proof | `check-short-exit2-proof.json` matches current `1.1.2` held Golden Workbench transfer and current `1.1.3` source/task contract | Proof says current `1.1.2` is gate-approved or completion-language eligible |
| Refresh audit evidence | audit matrix/proof describe the current `1.1.3` source/table/formula-builder route | Audit names `ice_cream_source_table_formula` |
| Refresh review lab | lab distinguishes historical exact local `1.1.2` authority from current held transfer | Lab says current `1.1.2` authority is preserved |
| Make checker stage-aware | packet checker permits recorded comments after human review while still blocking closure artifacts before explicit closure | Checker forbids valid comments or allows closure too early |
| Resolution log | `comment-resolution-log.md/json` maps every CHECKSURFACE-Q finding to fixed/carry/still blocked | Any core finding lacks resolution state |

## Scope

- Record the returned direct review comments.
- Update existing proof generators/checkers to read current source data.
- Regenerate platform evidence artifacts and screenshots from current generated
  lesson output.
- Update review-lab wording and audit evidence so they agree with current
  source/output.
- Update packet metadata to record returned human comments and held gate
  direction.
- Add or strengthen freshness checks where practical.

## Non-Goals

- No product-route adoption.
- No new completion language.
- No diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use.
- No redesign of student surfaces unless refreshed proof exposes a current
  surface defect.
- No hand-editing generated lesson output.

## Implementation Steps

1. Record `direct-review-comments.md/json`.
2. Patch `GRAPH-EXIT-UX-1` capture/check scripts for current `1.1.3` data:
   `broodjeskraam`, two context blocks, `pq-grafiek-construeren`,
   `interpolatie-225`, and `claim-50-procent-controleren`.
3. Patch `CHECK-SHORT-EXIT-2` proof capture for current `1.1.2` held transfer
   and current `1.1.3` percentage-claim control.
4. Refresh audit matrix/proof and review lab boundary text.
5. Make the gate packet checker aware of returned-comment stage.
6. Regenerate screenshots/proof artifacts with Chromium.
7. Write `comment-resolution-log.md/json`.
8. Run validation:
   - `node build-scripts/sprints/capture-graph-exit-ux1-screenshots.js`
   - `node build-scripts/sprints/check-graph-exit-ux1.js`
   - `node build-scripts/sprints/capture-check-short-exit2-screenshots.js`
   - `node build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js`
   - `node build-scripts/sprints/check-rev-std1-flag-disposition.js`
   - `node build-scripts/sprints/check-scope-language.js --active`
   - `npm.cmd run check:platform`
   - `git diff --check`

## Next Review Gate

After this repair, return the refreshed packet to direct human review. Do not
write closure artifacts until the reviewer confirms a closure decision.
