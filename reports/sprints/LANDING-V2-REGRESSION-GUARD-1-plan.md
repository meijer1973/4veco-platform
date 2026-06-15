# LANDING-V2-REGRESSION-GUARD-1 Plan

Date: 2026-06-15
Owner: codex
Status: complete
Branch: `codex/landing-v2-regression-guard-1-20260615`

## Product End State And Source Spec

Product end-state: every paragraph exposes one visible student route from
current readiness to local target-equivalent proof. Visible route items need a
student-facing label, purpose/status/focus, and either a real action or an
explicit fallback.

Source spec: Paragraph Landing V2 is fixture-owned through
`references/ui/paragraph-landing-v2/approved-light.html`,
`references/ui/paragraph-landing-v2/approved-dark.html`, and the lesson-side
`specifications/paragraph-landing-layout-v2.md`. PR #45/#11 are superseded
Frankenstein attempts and must not be used as rollback or implementation
examples.

## Quality Floor

Do not redesign or roll back the landing page. This sprint only hardens the
current approved V2 baseline against regression by adding a named checker,
CI wiring, stale-comment cleanup, rollback policy, and explicit poisoned
baseline warnings.

## Non-Negotiable Requirements

- Add `build-scripts/platform/check-paragraph-landing-v2.js`.
- Add `npm run check:landing-v2`.
- Run `check:landing-v2` in platform CI.
- The checker must verify platform generator invariants.
- The checker must render and verify a synthetic paragraph output.
- The checker must scan Book 1 generated paragraph indexes in
  `../4veco-lessen`.
- Update stale generator comments away from the old route/shell mental model.
- Add a rollback policy that forbids restoring #45/#11 or old-shell markers.
- Add explicit #45/#11 superseded-baseline warnings in platform fixture docs
  and the lesson-side V2 spec.

## Evidence Needed

- `npm.cmd run check:landing-v2`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `MODULE_ROOT=<Book 1 target>; node scripts/check-links.js`
- `git diff --check`
- Refreshed GitHub-facing indexes after new docs/checker files are staged.

## Review Gate

This is a guardrail sprint. It can proceed as ordinary scoped work after CI
passes, but it does not open Scale Gate 1, product-route adoption,
diagnostics/mastery/PV, or student/product-use work.

## Checklist

- [x] Add standalone checker.
- [x] Wire package script and CI step.
- [x] Update generator comments.
- [x] Add rollback policy.
- [x] Update platform fixture README.
- [x] Update lesson-side V2 spec.
- [x] Run validation commands.
- [x] Commit, push, and open PRs.
