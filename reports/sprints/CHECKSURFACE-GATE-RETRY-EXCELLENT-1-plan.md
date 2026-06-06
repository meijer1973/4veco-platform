# CHECKSURFACE-GATE-RETRY-EXCELLENT-1 Gate Packet Plan

Generated: 2026-06-06

## Status

Planned after policy, redesign, and audit evidence pass.

## Goal

Prepare a renewed direct human-review packet for the first-three paragraph
check surfaces, superseding the old `GATE-CHECK-SHORT-EXIT-2-RETRY` packet.

## Authorized Scope

This sprint may:

- create a new review-gate packet directory;
- cite refreshed source/output/proof/screenshot evidence;
- include direct comment prompts, calibration checks, stop conditions, and
  bundle URLs;
- run lead review before requesting human comments;
- commit and push the packet and cited evidence before review.

This sprint may not:

- record human comments that have not been returned;
- draft closure before comments and resolution evidence exist;
- enable new completion language;
- authorize product-route adoption, diagnostics, mastery/sequencing, PV,
  Scale Gate 1, or student/product use.

## Quality Floor

The packet is ready only if the reviewer can inspect the product in the same
shape needed to judge it:

1. playable or reproducible generated surfaces are linked;
2. screenshots cover initial, retry/feedback, next-action, and completed states
   where relevant;
3. mobile and dark evidence exists for student-facing surfaces;
4. proof JSON verifies state, not just file paths;
5. direct comment prompts ask about product quality, not only acceptance;
6. policy/regression proof is cited;
7. old retry packet is named as superseded.

## Specification Requirements Fulfilled

- Human-review gates require direct packet comments by default.
- Human-review proof for interactive surfaces requires playable/reproducible
  artifacts, state evidence, screenshots, and checkers.
- Review packets must preserve authority boundaries and stop conditions.

## Evidence Needed

- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.json`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/live-output-evidence.md`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/live-output-evidence.json`
- review lab or playable links
- bundle URL index
- deterministic packet checker
- lead-review cycle, verification review, result, maps, dashboard, commit, and
  push evidence

## Procedure

1. Verify policy, redesign, and audit sprints have passing evidence.
2. Build the renewed packet and review lab from refreshed proof.
3. Include old feedback, what changed, and what is still not authorized.
4. Add direct comment prompts and stop conditions.
5. Emit and check bundle URLs.
6. Run packet checker, prior repair checkers, map/index refresh, and final
   validation.
7. Fetch/prune, commit, push, and report local/remote commit hashes.

## Acceptance Tests

```text
node build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js
node build-scripts/sprints/check-bundle-urls.js GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review --branch codex/check-short-exit-2
node build-scripts/sprints/check-checksurface-policy-regression1.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
```

## Stop Conditions

Stop if:

- evidence has not been pushed before review;
- direct comment prompts are missing;
- the packet claims a gate closure or product authority;
- policy/regression proof is absent;
- lead review has not run before the human-review packet.

## Review Gate

The renewed human gate will be judged by direct packet comments. This sprint
only prepares the packet.

## Higher-Quality Improvements In Scope

- Make the packet easy for an off-site reviewer to inspect from GitHub.
- Name the previous packet as superseded so nobody reviews stale evidence.

## Omitted Follow-Up Work

- Returned human comments, comment-resolution log, closure proposal, and gate
  closure remain future work after review comments exist.
