# Sprint EX-1: Planning Review

Generated: 2026-05-21

Reviewer: planning/review pass

Verdict: PASS WITH FLAGS

## Review

The EX-1 plan expands the roadmap row into a checkable sprint procedure. It names the authorizing `GATE-EX0` closure, the exact pilot records, the expected generated overlay files, the pilot validator, the no-mutation boundaries, the acceptance tests, and the structural lead-review cycle.

## Required generated output check

The plan clearly states which generated or refreshed outputs may be touched:

- three `references/data/exam-ingestion/` pilot overlay files;
- one EX-1 pilot validator;
- one EX-1 planning report;
- sprint plan/result/review logs and metadata;
- normal generated maps, reports, inventories, URL index, roadmap index, and GitHub-agent indexes.

The plan also names forbidden generated output: no lesson output in `../4veco-lessen`, no student-facing generated output, and no mutation of protected reference sources.

## Flags to carry into implementation

- The graph/source-heavy pilot must remain blocked for full reconstruction unless source graph/table/uitwerkbijlage values are explicitly reconstructable.
- `check-exam-ingestion-contract.js` must remain a contract validator; its EX-1 adjustment should require closed gate authorization and the new pilot validator rather than weakening the EX-0 contract.
- All MTU classifications are pilot mapping evidence only. EX-2 human review is still required before any governed mutation.

## Next action

Proceed with EX-1 implementation under the plan, then submit the completed bundle to the lead reviewer cycle before closure.
