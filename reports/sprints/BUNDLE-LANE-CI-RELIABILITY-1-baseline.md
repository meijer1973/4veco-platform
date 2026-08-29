# Sprint BUNDLE-LANE-CI-RELIABILITY-1: Baseline

Date: 2026-08-29
Sprint: `BUNDLE-LANE-CI-RELIABILITY-1`

## Plan reference

`reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-plan.md`

## Exact repository state

- Platform `main`: `11c7a0286776064a694efa4e3cc9e91b4e62fa5c`
- Lesson `main`: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Completed bundle: `BOOK1-TEXTBOOK-RENEWAL-20260825`
- Completed controller PR: `meijer1973/4veco-platform#208`

## Observed defect

The PR #208 merge tree matched its authorized head and automatic post-merge
Platform CI passed for the exact final Platform/Lesson pair. The trusted bundle
lane nevertheless did not reach its designed successful terminal result:

1. it always dispatched another `platform-ci.yml` run after merge;
2. the dispatch omitted mandatory `y1_base_sha` and `y1_head_sha` inputs;
3. the resulting GitHub CLI failure occurred after the irreversible merge and
   was not returned as a structured merged-but-unverified state.

The same dispatch interface was used for intermediate Platform bundle CI and
Platform PR refresh fallback.

## Preserved state

- PR #208 is complete, safe, closed, and not part of this repair payload.
- No Lesson, product, engine, source-data, rendered, or Y1 evidence change is
  needed.
- Existing authorization, compatibility, lineage, readiness, review, and exact
  Platform/Lesson artifact validation remain the governing controls.
- Normal single-PR integration already uses the automatic push run and is not
  part of this repair.

## Data integrity notes

Protected reference data under `references/machine/` and
`references/external/` is unchanged and forbidden. The baseline was recorded
from exact Git commit identities and live remote refs; it contains no inferred
product, rendered, or authority claim.

## Required outcome

One separately reviewed governance PR must prefer exact automatic push CI,
dispatch only an exact-input absence fallback, share that logic across bundle
states, preserve the delta-required dry-run stop, and report post-merge
verification failures explicitly. It must remain unmerged pending owner review.
