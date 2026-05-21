# Sprint EX-0: Lead Review Round 1

Generated: 2026-05-21

Reviewer verdict: REVISE

## Findings

1. EX-0 was marked closed in the roadmap before the required lead-review cycle existed.
2. The roadmap overclaimed closure and made EX-1 active while result metadata still recorded pending lead review.
3. `EX-0-result.md` listed lead-review round/correction artifacts before those files existed.
4. Validation evidence was incomplete and generated source manifest/document inventory checks were stale.

## Passing Evidence

The EX-0 contract itself passed review:

- `build-scripts/references/check-exam-ingestion-contract.js` passed.
- `check-sprint-plan.js` passed.
- `check-sprint-bundle.js EX-0` passed.
- `check-sprint-result.js` passed.
- `check-source-document-registry.js` passed.
- `check-roadmap-version-index.js` passed.
- `emit-url-index.js --check` passed.

No evidence was found that EX-0 created pilot overlay data, minted units, mutated protected reference data, closed CP-6 or Year 1, or authorized product/student use.

## Required Corrections

- Record this round-1 review.
- Populate `EX-0-lead-review-corrections.md`.
- Refresh source-document registry, source manifest, and document inventory.
- Update `EX-0.result.json` and `EX-0-validation-log.md` with actual pass/fail outcomes.
- Send the corrected bundle for round-2 lead review before closing EX-0 or activating EX-1.
