# EX-0 Lead Review Round 2

Date: 2026-05-21

Reviewer: lead reviewer agent

Verdict: REVISE

## Summary

The EX-0 contract surface is sound. The dedicated contract checker passes, the GATE-EX0 packet keeps EX-1 unauthorized, and the sprint does not overclaim pilot data, protected-source mutation, unit minting, CP-6 closure, Year-1 closure, or product/student use.

The closure package is not yet ready. Round 2 found stale manifest and inventory evidence after the round-1 correction artifacts and result metadata were written. Under the sprint procedure, a second non-pass review stops closure instead of silently continuing to another correction/recheck loop.

## Findings

1. Inventories and manifests are not fresh while the validation log claims they are.
   - Current `check-source-manifest` rerun fails on `references/data/sprints/EX-0.result.json` size mismatch.
   - Current `check-document-inventory` rerun fails because `reports/sprints/EX-0-lead-review-corrections.md` and `reports/sprints/EX-0-lead-review-round1.md` are missing from the inventory.

2. Result metadata is still pending.
   - `references/data/sprints/EX-0.result.json` still records `status: pending_lead_review`.
   - `final_verdict` remains `PENDING`.
   - Final complete-bundle checks remain pending.

3. Roadmap direction is acceptable only after this review is logged and validators pass.
   - The roadmap guards EX-1 behind GATE-EX0 authorization.
   - EX-0 closure is still not justified while manifest and inventory checks fail.

## Required Corrections Before Closure

1. Refresh source-document registry, source manifest, and document inventory after this round-2 file exists.
2. Rerun and log:
   - `node build-scripts/references/check-source-manifest.js`
   - `node build-scripts/references/check-document-inventory.js`
   - `node build-scripts/references/check-source-document-registry.js`
   - `node build-scripts/references/check-roadmap-version-index.js`
3. Update `reports/sprints/EX-0-validation-log.md`, `reports/sprints/EX-0-result.md`, and `references/data/sprints/EX-0.result.json` from pending to final only after those checks pass.
4. Run:
   - `node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-0-result.md`
   - `node build-scripts/sprints/check-sprint-bundle.js EX-0 --complete`

## Stop Decision

Stop before EX-0 closure. A third correction/recheck loop needs explicit procedural authorization because the planned second review did not return `PASS` or `PASS WITH FLAGS`.
