# Bundle Lane CI Reliability — Result

Status: substantive implementation complete; structural review and exact-head
remote evidence pending

## Result

The coordinated-bundle lane now treats an exact automatic Platform `main` push
run as its normal intermediate/final proof. It dispatches a manual fallback
only when no qualifying automatic run appears, and every fallback carries full
validated `y1_base_sha` and `y1_head_sha` inputs.

## Implemented controls

1. Workflow-run selection is event-aware and respects a state-transition run-ID
   floor.
2. Queued or running automatic push CI is awaited; it can never activate the
   fallback path merely by reaching the observation timeout.
3. Completed red automatic CI or wrong Platform/Lesson evidence fails closed
   and cannot be masked by a fallback run.
4. A manual fallback captures a fresh pre-dispatch floor and accepts only a
   newer `workflow_dispatch` run.
5. Dispatch construction requires full SHAs and emits the real GitHub CLI
   argument vector with both mandatory Y1 fields.
6. Platform-changing states validate `old main -> merge head`; Lesson-only
   states validate `base == head == current Platform main`.
7. Intermediate and final bundle CI share the same acquisition helper.
8. Any returned failure after a recorded completed member merge uses
   `merged_but_postmerge_verification_failed`, while retaining the original
   verification subphase, diagnostics, and completed merge records.
9. Platform PR refresh fallback dispatch uses the same exact-input argument
   builder.
10. The policy records the automatic/fallback contract and the intentional
    fail-closed delta-required dry-run exception.

## Regression coverage

- Exact automatic push reuse and zero duplicate dispatch.
- Queued automatic completion and queued automatic timeout, both with zero
  fallback dispatches.
- Absence-only fallback with the concrete `gh workflow run` arguments.
- Missing/malformed inputs, head mismatch, reversed/non-ancestor range, and
  unchanged-Platform identity range.
- Red automatic CI, wrong Platform evidence, wrong Lesson evidence, fallback
  timeout, and fallback dispatch failure.
- Intermediate and final post-merge reporting with retained merge records.
- Platform-first transition coordinates and lesson-first final coordinates.
- Existing authorization, compatibility, lineage, partial-resume, readiness,
  review-thread, refresh, and dry-run protections.

## Local validation

| Check | Result |
| --- | --- |
| Canonical sprint-plan checker | PASS |
| Focused bundle-integrator suite | PASS: 1 suite, 104 tests |
| Integration-lane suite | PASS: 10 suites, 225 tests |
| JavaScript syntax and `git diff --check` | PASS |
| Full Platform suite against Lesson `f09fd6e8...` | PASS: 105 suites and 1,564 tests; 6 suites and 8 tests skipped |
| Paragraph lane scope and report/index freshness | pending |
| Independent lead-review cycle | pending |
| Exact-head hosted CI and readiness | pending |

## Authority boundary

This repair changes trusted merge governance only. It does not change or reopen
PR #208, does not change Lesson, product, engine, source data, Y1 evidence, or a
protected reference, and grants no bundle or merge authority. The repair PR
must remain open and unmerged until renewed owner review.
