# Sprint CONTEXT-VISUAL-STD-1: Baseline

## Plan reference

- Plan: `reports/sprints/CONTEXT-VISUAL-STD-1-plan.md`
- Plan data: `references/data/sprints/CONTEXT-VISUAL-STD-1.plan.json`
- Roadmap row: `CONTEXT-VISUAL-STD-1`

## Baseline state

- `TASK-CONTEXT-SPEC-1` is complete and produced the source-context contract at `reports/json/task-context-spec1-contract.json`.
- `TASK-CONTEXT-RUNTIME-1` is complete and produced runtime proof at `reports/json/task-context-runtime1-proof.json` plus a review-only playable lab.
- `CONTEXT-VISUAL-STD-1` is open in both `references/reference-team-roadmap.md` and `../4veco-lessen/lessen-team-roadmap.md`.
- The current task shell has context-region CSS and rendering helpers, but no unified visual standard that future source reconstruction can use as a closure baseline.
- `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` remains blocked until this visual standard closes.

## Data integrity notes

- Protected reference data under `references/machine/` and `references/external/` is out of scope and must remain unchanged.
- Source-data writes are out of scope.
- Generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod` is out of scope.
- This sprint may add review/proof artifacts under `reports/`, a checker under `build-scripts/sprints/`, sprint metadata under `references/data/sprints/`, and roadmap/map/index/dashboard updates required for closure.

## Initial stop conditions

- Stop before implementation if planning review rejects the plan or finds that block-type, proof, mobile/dark, source-output parity, or protected-reference boundaries are incomplete.
- Stop if defining the standard requires actual exam/textbook ingestion, source reconstruction, generated Book 1 output, protected reference mutation, source-data writes, PV, diagnostics, adaptive routing, mastery, target-equivalent proof, or Scale Gate authority.
- Stop if the checker cannot deterministically validate coverage of roadmap terms, allowed block types, proof profiles, and boundary declarations.
