# Sprint EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1: Exercise Evidence Currentness Hardening

Generated: 2026-07-01

## Goal

Turn the one-off exercise workflow checker cleanup into durable repository
policy. Prevent agents, CI, and report tooling from treating legacy unsuffixed
exit-ticket paths, superseded checkers, or historical sprint metadata as
current exercise evidence.

This sprint is validation and evidence-governance hardening only. It must not
edit exercise source data, regenerate lesson output, change engines, broaden
product authority, or authorize any student/product use.

## Context

PR #183 stabilized the immediate split-source cleanup after the exit-ticket
source model moved from legacy unsuffixed files such as `1.1.2.json` and
`shared/exit-ticket/1.1.2.js` to current split files such as
`1.1.2-exit-ticket.json`, `1.1.2-korte-check.json`, and matching generated
lesson data.

The remaining risk is durable currentness discipline:

- the cleanup checker is not wired into npm or platform CI;
- the cleanup checker still hardcodes the first-three source/output lists;
- stale checkers such as `check-check-short-exit2.js` and
  `check-check-route-copy1.js` still encode obsolete assumptions;
- historical sprint metadata can still mention old paths without a
  machine-readable current/historical/superseded status;
- active roadmap wording can make historical paths look current;
- broad regex scans can confuse valid unsuffixed non-exit-ticket generated
  assets with legacy unsuffixed exit-ticket assets.

## Quality Standard

Quality floor: after this sprint, the current exercise-evidence specification
must be discoverable from a manifest or registry, active validators must use
that currentness model, and historical/superseded validators must fail closed
when invoked as active commands.

Proof standard: deterministic checks must prove that current split source and
generated paths exist, legacy unsuffixed exit-ticket source/generated paths are
absent from current evidence, historical metadata carrying legacy paths is
explicitly marked historical or superseded, valid unsuffixed non-exit-ticket
lesson assets remain allowed, rendered output remains read-only and unchanged,
student-facing behavior remains unchanged, and forbidden source/generated/product
surfaces are untouched. Deferred fixture, exemplar-authority, and knowledge
artifact work must be recorded as follow-up rather than hidden in this bundle.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Cleanup checker is part of normal validation. | Add an npm script and platform CI step for exercise workflow currentness. | `npm run check:exercise-workflow-currentness` passes locally and is referenced by CI. | planned |
| Current exercise surfaces are manifest-driven. | Add a compact exercise-surface manifest with role, scope, source path, generated path, currentness, legacy allowance, and authority boundary. | Checker reads the manifest instead of hardcoded current first-three lists. | planned |
| Stale checkers cannot masquerade as active validators. | Add an active/historical checker registry and guard superseded checkers. | Cleanup/currentness checker fails if active scripts or CI reference historical checkers. | planned |
| Historical sprint metadata is distinguishable from current evidence. | Add current/historical/superseded status to sprint metadata records that still cite legacy unsuffixed exit-ticket paths. | Checker scans sprint metadata with legacy path mentions and requires status fields. | planned |
| Active roadmap wording does not make old paths look current. | Add narrow annotations to historical roadmap rows, without rewriting history. | Lead review confirms historical narrative is preserved and current operational paths are clear. | planned |
| Generated lesson path scans distinguish valid non-exit assets. | Add path-category classifier for `shared/exit-ticket`, `shared/procedure`, `shared/reasoning`, `shared/skilltree`, and `shared/newsdetective`. | Checker proves unsuffixed exit-ticket paths are legacy while valid unsuffixed non-exit paths remain allowed. | planned |
| No behavioral or authority expansion. | No source-data, generated lesson output, engine, protected reference, target registry, product route, or student/product-use changes. | Git status/diff guards and lead review verify forbidden surfaces remain untouched. | planned |

## Included Work

1. Add `check:exercise-workflow-currentness` to `package.json`.
2. Wire that command into `.github/workflows/platform-ci.yml`.
3. Add `references/data/exercise-surface-manifest.json`.
4. Add shared currentness/path-classification helpers under `build-scripts/lib/`.
5. Refactor `check-exercise-workflow-checker-cleanup.js` to consume the manifest
   and checker registry.
6. Guard stale checkers so they clearly report `historical/superseded` when
   invoked as active validators.
7. Add status fields to sprint metadata JSON records that still mention legacy
   unsuffixed exit-ticket paths.
8. Patch active roadmap wording narrowly where old paths appear operational.
9. Add sprint plan/result/quality/lead-review artifacts and validation logs.

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add the currentness checker to npm and CI. | include_now | Required to prevent stale-path regressions from returning unnoticed. |
| Replace hardcoded first-three path lists with a manifest. | include_now | Keep the manifest small and classify first-three product-proof separately from same-copy hygiene. |
| Guard stale checkers as historical/superseded. | include_now | Prefer fail-closed historical guards over silently green obsolete assumptions. |
| Add historical/current fields to every old sprint markdown file. | reject_scope_creep | Update machine-readable sprint metadata and active roadmap wording only; do not rewrite archival prose. |
| Deduplicate Golden fixture copies. | defer_named_follow_up | Useful, but unrelated to currentness and potentially noisy. |
| Canonicalize duplicate 1.1.3 exemplar authority. | defer_named_follow_up | Important but belongs in a focused exemplar-authority sprint. |
| Canonicalize `knowledge/exit-ticket-game-1.1.1.zip` disposition. | defer_named_follow_up | Useful P2 cleanup, not required for currentness hardening. |

## Explicitly Deferred

- Golden-ticket fixture deduplication.
- `1.1.3-exit-ticket` exemplar authority canonicalization.
- `knowledge/exit-ticket-game-1.1.1.zip` disposition cleanup.

Those are useful follow-up goals, but they are not dependencies for this
currentness hardening sprint.

## Allowed paths

- `.github/workflows/platform-ci.yml`
- `package.json`
- `build-scripts/lib/exercise-currentness.js`
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- guarded stale checker scripts under `build-scripts/sprints/`
- guarded stale review-gate checker scripts under `build-scripts/review-gates/`
- `references/data/exercise-surface-manifest.json`
- selected `references/data/sprints/*.json` records that contain legacy
  exercise paths and need status metadata
- `references/data/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1.plan.json`
- `references/data/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1.result.json`
- `references/reference-team-roadmap.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-baseline.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan-review-round1.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan-review-round2.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-assignment.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-round1.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-corrections.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-lead-review-round2.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-result.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-diff-summary.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-quality-log.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.jsonl`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.md`

## Forbidden paths

- No `source-data/book-1/exit-ticket/*.json` edits.
- No generated lesson output edits in `../4veco-lessen/`.
- No engine implementation or CSS/JS behavior changes.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise registry writes.
- No candidate storage creation or candidate writes.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, product
  route adoption, broad product use, or student/product use.

## Inputs

- Current source files under `source-data/book-1/exit-ticket/`.
- Generated Book 1 lesson shared-data index and current files under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/`.
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`.
- Stale/superseded checkers:
  `build-scripts/sprints/check-check-short-exit2.js`,
  `build-scripts/sprints/check-check-route-copy1.js`,
  `build-scripts/review-gates/check-gate-check-short-exit2-review-packet.js`,
  and `build-scripts/review-gates/check-gate-check-short-exit2-retry-review-packet.js`.
- Sprint metadata JSON under `references/data/sprints/`.
- `references/reference-team-roadmap.md`.
- PR #183 cleanup result artifacts.

## Outputs

- A compact exercise surface manifest and currentness helper.
- An npm/CI currentness check.
- Guarded historical/superseded stale checkers.
- Updated sprint metadata status fields for legacy-path records.
- Narrow roadmap annotations for historical pre-split path references.
- Baseline, command log, diff summary, quality log, result, result metadata,
  and lead-review artifacts for this sprint.
- Sprint plan, review, result, quality, and validation artifacts for this
  hardening bundle.

## Operationalized sprint procedure

1. Write this plan and run sub-agent lead review on it.
2. Apply plan-review corrections until the plan receives `PASS` or explicit
   `OK`.
3. Record the baseline artifact and run planned bundle validation.
4. Implement the manifest, helper, stale-checker guards, metadata status
   fields, CI/npm wiring, and roadmap annotations.
5. Prove superseded checkers fail closed when invoked as active commands, and
   prove npm/CI/currentness registry entries cannot reference them as active.
6. Run the currentness checker and focused validation locally.
7. Write result, quality log, diff summary, command log, and lead-review
   records.
8. Run implementation lead review. Apply blocking or material findings and
   repeat until the implementation receives `PASS` or explicit `OK`.
9. Run final sprint/report/platform/roadmap/diff validation.
10. Publish a draft PR and run the PR Readiness Reviewer against the exact
   remote head.
11. Present the PR for human review with exact-head evidence.

Decision points:

- If a stale checker can be updated to prove current semantics without source,
  generated output, or engine changes, update it. Otherwise guard it as
  historical/superseded.
- If historical metadata carries old paths, annotate the metadata rather than
  rewriting historical prose.
- If a proposed fix requires forbidden surfaces, stop and replan.

Stop conditions:

- Stop if any source-data, engine, generated lesson output, protected
  reference, target registry, product-authority, or student/product-use change
  becomes necessary.
- Stop if active currentness evidence can still pass while citing legacy
  unsuffixed exit-ticket files as current.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1
npm.cmd run check:exercise-workflow-currentness
node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/sprints/check-sprint-result.js reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-result.md
node build-scripts/sprints/check-lead-review-substance.js EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1 --complete
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the currentness checker is wired into npm and CI; the
checker consumes the exercise surface manifest and path classifier; historical
metadata records that cite legacy unsuffixed exit-ticket paths are explicitly
marked historical or superseded; superseded checkers fail closed when invoked
as active validators with deterministic nonzero proof; npm, CI, and the
currentness registry cannot reference superseded checkers as active; active
roadmap wording distinguishes historical pre-split paths from current split
paths; baseline and result metadata validate; no forbidden
source/generated/engine/protected or authority surfaces changed; lead review
returns `PASS` or explicit `OK`; and the PR Readiness Reviewer inspects the
exact remote PR head.

## Internal Review Plan

Use sub-agent lead review before implementation and after implementation. The
review must cover:

- repository/CI currentness wiring;
- evidence-currentness manifest and metadata semantics;
- path classifier behavior for exit-ticket versus non-exit generated assets;
- roadmap/governance wording;
- authority-boundary preservation.

Proceed only after the lead reviewer returns `PASS` or explicit `OK`.

## Human review required

Human review is required before merge. This sprint changes validation and
review-evidence behavior that future exercise/check-surface workflows rely on.
The PR Readiness Reviewer must run against the exact remote PR head after the
draft PR exists.

## Rollback plan

Before merge, abandon this branch. After merge, revert the PR. Because the
sprint is limited to validation, metadata, roadmap annotations, and sprint
documentation, rollback should not require lesson regeneration, source-data
restoration, or engine rollback.
