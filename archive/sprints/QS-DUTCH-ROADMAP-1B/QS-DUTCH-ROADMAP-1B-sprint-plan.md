# QS-DUTCH-ROADMAP-1B Sprint Plan

Status: in progress
Date: 2026-06-10
Branch: `codex/dutch-quality-scope-roadmap-20260609`
PR: `https://github.com/meijer1973/4veco-platform/pull/28`

## Purpose

QS-DUTCH-ROADMAP-1B repairs PR #28 CI by removing restricted active-scope
language from the Dutch-only roadmap packet and refreshing the branch against
current `origin/main`.

This sprint is CI hygiene only. It does not implement `INSPECT-8`, generate
evidence packs, implement generators, integrate reports or gates, mutate
generated lesson output, process personal data, or make compliance/approval
claims.

## Allowed Changes

- Merge current `origin/main`.
- Resolve only actual merge conflicts.
- Replace restricted active-scope terms in roadmap packet wording:
  - `MVP` -> `First Implementation`;
  - `Pilot Packs` -> `Bounded Multi-Scope Evidence Packs`;
  - `Pilot pack` -> `Bounded pack`;
  - `prototype` / `pilot` in active prose -> `bounded sample`, `sample`, or
    `bounded pack`.
- Update validation and closure records.
- Regenerate indexes/dashboard after tracked files change.
- Push the PR branch.

## Required Validation

- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `npm.cmd run agent:index`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/references/check-roadmap-version-index.js`
- `git diff --check`
- `git -C ../4veco-lessen status --short --branch`
- `git -C ../4veco-lessen diff --name-only`

## Acceptance Criteria

- `npm.cmd run check:scope-language` passes locally.
- PR branch is refreshed to `0 behind` current `origin/main`.
- PR #28 receives fresh `platform-ci / validate-platform` success.
- Dutch-only roadmap substance and boundaries remain unchanged.

## Required Next Action

Complete the repair, validate, run lead review, commit, push, and recheck PR
#28 CI.
