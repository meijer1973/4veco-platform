# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Result

Generated: 2026-08-23

Status: implementation complete with subagent `OK_TO_CLOSE`; replacement PR
bound and pending exact-head readiness and human review.

## Plan reference

`reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`

## Summary

This renewal replaces the stale and ineffective guard in platform PR #205
from current `main`. It validates the exact six first-three Golden surfaces,
uses committed event-specific Git ranges, rejects protected-path and authority
drift, corrects the active roadmaps, and refreshes repository navigation.

The corrected historical screenshot reuse test separates rendered inputs from
navigation destinations. All platform and rendered lesson inputs remain
blob-equal; changed presentation destinations are outside the screenshot claim
and remain present at every commit boundary. No recapture is required. No
exercise source, engine behavior, generated lesson output, route, or
target-readiness flag changes.

## Current Evidence

- Plan review: `OK_TO_IMPLEMENT` after correction round.
- Focused checker suite: 26 tests passing after lead-review corrections.
- Roadmap version index: passing after current-state correction.
- Historical reuse decision: accepted after independent input/navigation
  classification; zero rendered-input drift.
- Commit-bound delta proof: generated against renewed substantive payload
  `12a95a9a6ee2fecc2e4c82f6ba2daa03481691bc` and lesson snapshot
  `96c0970f45739a8758cf7e932c6bce77806cd68d`.
- Lead review round 1: `REVISE_IMPLEMENTATION`; all five core failures were
  corrected and the portability flag remains explicitly carried to remote CI.
- Intermediate recheck: `REVISE_IMPLEMENTATION`; corrected so unrelated ranges
  still run state and rendered-input validation while only renewal scope
  triggers the renewal allowlist and deterministic evidence-tail restriction.
- Final implementation lead review: `OK_TO_CLOSE`, normalized to
  `PASS WITH FLAGS` for repository metadata. No core requirement remains open.
- CI repair lead review: `OK_TO_COMMIT`, normalized to `PASS WITH FLAGS`; the
  real-Git full-mode test now invokes the checker directly, and historical Git
  object reads use a reviewed Windows-safe batch protocol with 26 focused
  regressions.
- Exact-head PR repair review: `OK_TO_COMMIT`, normalized to `PASS WITH FLAGS`;
  an unfetched GitHub synthetic merge SHA is accepted while payload/synthetic
  equality remains rejected.
- Trigger-policy repair review: `OK_TO_COMMIT`, normalized to
  `PASS WITH FLAGS`; shared infrastructure remains allowed without activating
  renewal scope, and Y1-specific mixed scope remains rejected.
- Replacement PR: platform PR #214, bound to reviewed payload
  `12a95a9a6ee2fecc2e4c82f6ba2daa03481691bc`.
- PR #205 supersession: closed with an explicit replacement link; old head
  `571d435a172240524ed96394a41682ef003bfcad` remains unauthorized.
- Exact-head CI, branch-protection, lead, and PR Readiness Reviewer evidence:
  pending the final remote evidence head.

## Acceptance test results

- Platform Jest: 104 suites and 1457 tests passed; 6 suites and 8 tests skipped.
- Focused Y1 checker: 26 tests passed.
- Full Y1 checker, currentness, Scale Proof, review-throughput, report JSON,
  roadmap index, URL index, agent-index freshness, scope language, and platform
  and lesson diff hygiene passed.
- Local exercise-authority hygiene reports a pre-existing LF/CRLF fixture hash
  mismatch. The manifest and fixture paths are unchanged from the base; remote
  exact-head `validate-platform` is required before human authorization.

Exact command, exit-code, timestamp, and output-hash evidence is in
`reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-command-log.jsonl`.

## Changed files

The substantive payload changes only the renewal checker and tests, CI/package
wiring, the wave record, current roadmaps/version records, navigation maps, and
the URL-index emitter. The deterministic evidence tail contains this result,
review records, proof JSON, packet, command log, generated indexes, URL index,
and internal dashboard.

## Data integrity notes

No protected reference data, exercise source data, engine behavior, target
readiness flag, generated lesson output, or lesson repository file changed.
The lesson repository is read-only proof at
`96c0970f45739a8758cf7e932c6bce77806cd68d`.

## Authority Boundary

The historical owner decision is `PASS_CONTROLLED_ROLLOUT` for separately
governed waves. This sprint does not authorize actual rollout/adoption,
automatic migration, completion language, diagnostics, mastery/sequencing,
adaptive routing, PV, summative use, broad product use, or student/product use.

## Open follow-ups

1. Run exact-head CI, live branch protection, lead review, and the PR Readiness
   Reviewer for platform PR #214.
2. Present the L4 exact-head packet for human review; do not merge without
   explicit owner authorization tied to that head SHA.

## Rollback instructions

Before merge, close the replacement PR. After merge, revert only this renewal
PR. No lesson regeneration or exercise-source restoration is required.
