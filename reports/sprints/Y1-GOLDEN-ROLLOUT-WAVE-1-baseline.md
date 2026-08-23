# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Baseline

Recorded: 2026-08-23

## Plan reference

`reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`

## Repository State

- Platform worktree:
  `C:/Projects/4veco-worktrees/Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823/4veco-platform`
- Platform branch: `codex/y1-golden-rollout-wave-renewal-20260823`
- Platform base: `b7ec603880bcd8cc98c93526121ca71d3f31edcd`
- Lesson proof worktree:
  `C:/Projects/4veco-worktrees/Y1-GOLDEN-ROLLOUT-WAVE-RENEWAL-1-20260823/4veco-lessen`
- Lesson base: `96c0970f45739a8758cf7e932c6bce77806cd68d`
- Worktree owner: `codex-main-20260823`
- Worktree safety claim: passed.
- Governance freshness: passed against platform `origin/main` at
  `b7ec603880bcd8cc98c93526121ca71d3f31edcd`.

## Superseded PR State

- Platform PR #205 head:
  `571d435a172240524ed96394a41682ef003bfcad`.
- Old PR base commit:
  `51a08a64684160c8c6d06e5c46df2424d5d98659`.
- Old PR CI lesson snapshot:
  `ba08b9c2e033a877c0d1b57952055ce697912a22`.
- Current platform main:
  `b7ec603880bcd8cc98c93526121ca71d3f31edcd`.
- Disposition: do not authorize or integrate. The old PR will be marked
  superseded only after a replacement draft PR exists.

## Rendered Capture Provenance

- Original Scale Proof platform payload:
  `5e3fa0d972992cf11568c4f86bf4f5f09c0f11c7`.
- Original paired lesson payload:
  `071a465a03e287bc5768d88aabbec3e63b15ee09`.
- These are the exact payloads accepted by the PR #148 owner bundle decision.
- The Scale Proof was captured and committed on that platform payload before
  the owner decision.
- The old PR #205 later validated platform head `571d435a...` against lesson
  snapshot `ba08b9c2...`.
- Renewal bases are the separate current commits `b7ec6038...` and
  `96c0970f...`; they are not substituted for capture provenance.

Screenshot reuse must prove the relevant input chain from the original capture
payloads through the old CI snapshots to the renewal heads. A broad repository
comparison is not sufficient, and a list copied only from the old proof is not
accepted as complete dependency discovery.

## Current Surface State

`references/data/exercise-surface-manifest.json` currently identifies exactly:

- `1.1.1-korte-check`
- `1.1.1-exit-ticket`
- `1.1.2-korte-check`
- `1.1.2-exit-ticket`
- `1.1.3-korte-check`
- `1.1.3-exit-ticket`

All short checks are advisory-only. All exit tickets carry target-readiness
evidence while `completionLanguageEligible` remains false. `1.1.4` is
same-copy hygiene only and is not part of the first-three wave claim.

## Authority State

Platform PR #148 owner authorization comment `4807419611` accepted the A96
hardening and refreshed first-three proof, closed Scale Gate 1 narrowly as
`PASS_CONTROLLED_ROLLOUT`, and authorized controlled Golden Workbench rollout
waves with per-wave source/generated/rendered evidence and internal lead
review.

The same decision explicitly withheld completion language, diagnostics,
mastery/sequencing, PV, summative use, broad product use, student/product use,
and automatic repository-wide migration.

## Blocking Defects In The Old Implementation

1. Stale/conflicted branch and stale exact-head evidence.
2. `git status --porcelain` did not inspect committed PR changes.
3. Contradictory Golden roadmap chronology.
4. Missing repository maps, indexes, and dashboard closure.
5. No dedicated negative regression suite.
6. Null PR binding and L3/L4 classification mismatch.

These defects are core renewal requirements, not carried flags.

## Delta-Proof Decision

The first comparison overclassified every local `href` as a rendered input.
Review correction separated browser/render dependencies from navigation
destinations. The `1.1.1` and `1.1.3` presentation HTML/PPTX files changed, but
they are not rendered by any accepted capture case; the landing proof claims
only that those route destinations exist. They remain present at every commit
boundary.

After correction, all 64 platform proof/runtime inputs and all 78 rendered
lesson inputs are blob-equal across original capture, old PR CI, and current
heads. All 55 navigation destinations remain present. Historical screenshot
reuse is therefore valid for the bounded claim, and recapture is not required.

## Data integrity notes

Protected reference data under `references/machine/` and
`references/external/` is unchanged. Exercise source data, runtime engines,
target-readiness flags, and generated lesson output are also unchanged.
