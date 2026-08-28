# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Result

Generated: 2026-08-27

Status: main-based evidence prerequisite payload reviewed; terminal exact-head
validation, CI, readiness, and human merge authorization pending.

## Plan reference

Historical plan: `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`

Current prerequisite plan:
`reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-prerequisite-plan.md`

## Summary

This prerequisite closes the blocking mismatch between Platform `main` at
`9c9d3cc7...` and Lesson `main` at `f09fd6e...` without importing PR #208
product commits or claiming their ancestry. Historical commits `e2deb65...`,
`8f612ac...`, `4b49d82...`, and `aa06ada...` remain source provenance only.
The corrected current reviewed payload is `b5a4bb38...`; it includes the
source manifest before the evidence-only terminal tail so the exact-head guard
can prove every rendered renewal artifact remained immutable.

The independently recomputed dependency set contains exactly one changed
captured input: §1.1.2 `opgaven.html`. It is closed by the previously reviewed
capture `112-normal-practice-desktop-light-opgaven`. Historical and replacement
1280×900 light-mode PNGs are byte-identical at SHA-256
`5a2692481110d68e2d23992373c3b06f0a198518265dba754a4f022125ea515f`;
the decoded delta is 0 of 1,152,000 pixels and the diff image is entirely zero.

The visual claim is limited to the first 1280×900 viewport. It does not attest
the below-fold exercises. No lesson, textbook, product, engine, source-data,
protected-reference, rollout, completion, diagnostics, mastery, sequencing,
summative, PV, or student-use authority change is included.

## Acceptance test results

- Planning review: PASS after all five plan findings were corrected.
- Independent visual review: PASS for the first viewport only.
- Structural lead round 1: REVISE; all four fail-closed findings corrected.
- Structural correction review: PASS WITH FLAGS at `34a39837...`; no blocking
  implementation finding remains.
- Focused checker suite: 80/80 passed, including all seven shared closure paths,
  exact PR #215-shaped pull-request/main-push histories, and fail-closed mixed
  Y1 work in both modes.
- Full corrected local platform suite: 104 suites and 1,511 tests passed; 6 suites and 8
  tests skipped.
- P-bound delta construction: one changed dependency, one verified renewal,
  zero unresolved inputs, 64 platform-equal inputs, 78 lesson-equal inputs, 55
  existence-only lesson paths, and 50 historical artifacts blob-equal.
- Exact-head full local validation, remote CI, and readiness: pending terminal
  evidence head.
- Local exercise-authority hygiene exposes the known CRLF fixture-hash
  portability mismatch. The manifest and fixtures are unchanged from `main`;
  exact-head remote CI normalizes line endings and remains the closure proof.

## Changed files

The substantive payload contains only the selector, checker, tests, exact wave
policy, imported screenshot/comparison/manifest/review bytes, adapted renewal
record, prerequisite plan/reviews, source manifest, and visual review. The
terminal tail is restricted to the exact proof, packet, result, review, log,
URL/index/dashboard, and readiness paths named in the prerequisite plan.

The corrected path policy has 31 Y1-specific trigger paths and retains all 38
allowed paths. The URL index, four agent indexes, and two internal-dashboard
files are allowed closure artifacts but no longer activate the Y1 renewal
scope by themselves.

## Data integrity notes

No protected reference data changed. No `references/machine/`,
`references/external/`, `source-data/`, engine, lesson, textbook, product route,
or historical Scale Proof artifact is modified. The source manifest verifies
all ten imported/adapted artifacts by source commit, Git blob, SHA-256,
destination blob, and byte-reuse disposition.

## Authority Boundary

All 16 wave/proof/packet/result authority keys remain false, including
`protected_reference_data_changed`. The separate 14-key rendered-renewal
authority object also remains exact and all false. This prerequisite does not
authorize merging PR #216, PR #215, or PR #208.

## Open follow-ups

1. Freeze terminal evidence head `H`, run every local and remote post-Y1 check,
   and publish exact-head readiness.
2. Return PR #216 open and unmerged for explicit human merge authorization.

## Rollback instructions

Before merge, close PR #216 and delete only its branch/worktree. After an
authorized merge, revert the prerequisite PR commit range. No lesson rebuild,
textbook rollback, or historical Scale Proof restoration is required.
