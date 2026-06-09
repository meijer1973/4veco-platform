# QS-DUTCH-ROADMAP-1A Sprint Plan

Status: in progress
Date: 2026-06-09
Branch: `codex/dutch-quality-scope-roadmap-20260609`
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Human review: `archive/sprints/QS-DUTCH-ROADMAP-1A/QS-DUTCH-ROADMAP-1A-human-review.md`

## Purpose

QS-DUTCH-ROADMAP-1A is a final hygiene and PR-prep pass for the accepted
Dutch-only roadmap proposal.

This sprint is merge/documentation hygiene only. It does not implement
`INSPECT-8`, generate evidence packs, implement generators, integrate reports
or gates, mutate generated lesson output, process personal data, or make
compliance/approval claims.

## Allowed Changes

- Merge current `origin/main` into the Dutch roadmap branch.
- Resolve only actual merge conflicts.
- Preserve the Dutch-only roadmap over older international roadmap text.
- Correct stale roadmap and closure-log status wording.
- Update sprint ledger and sprint records.
- Regenerate agent indexes and internal dashboard after tracked files are in
  the index.
- Run required validation.
- Push the refreshed branch.
- Open a draft PR with governance/docs-only posture.

## Required Validation

- `npm.cmd run check:platform`
- `npm.cmd run agent:index`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/references/check-roadmap-version-index.js`
- `git diff --check`
- JSON parse of changed inspection data files
- `4veco-lessen` read-only status check

## Acceptance Criteria

- Branch is refreshed to `0 behind` current `origin/main`.
- Roadmap header says QS-DUTCH-ROADMAP-1 is closed / ready for human review.
- Closure log no longer says remote push is pending.
- PR branch is pushed.
- PR is opened with the agreed governance/docs-only posture.
- Dutch-only boundary remains strict.

## Required Next Action

Complete the hygiene fixes, validate, run lead review, commit/push, and open
the PR.
