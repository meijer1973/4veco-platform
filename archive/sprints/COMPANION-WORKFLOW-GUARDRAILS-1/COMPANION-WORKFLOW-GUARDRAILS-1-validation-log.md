# COMPANION-WORKFLOW-GUARDRAILS-1 Validation Log

## Local Validation

| Command | Result | Notes |
|---|---|---|
| `npm.cmd test -- scripts/tests/validate-paragraph.test.js` | PASS | 1 suite passed, 13 tests passed. Confirms current validator profile behavior, including 14-file `student-web` and 27-file `legacy-full`. |
| `npm.cmd run check:scope-language` | PASS | `OK scope-language check: active surfaces`. |
| `git diff --check` | PASS | No whitespace errors reported. |
| `rg -n "File count: 27|required 27 Part B|validates the 27|required Part B root files listed|all 27 Part B|Phase 4c|Assume all paragraphs need all 14" BUILD-PARAGRAPH.md AGENTS.md skills agents build-scripts\README.md` | PASS | No active stale matches; recorded as `NO_ACTIVE_STALE_MATCHES`. |
| `rg -n "24 root|24-file|24 file|24 required" docs\L1.5V\F-plan-part-a-b-separation.md` | PASS WITH EXPECTED HISTORICAL MATCHES | Matches remain at historical lines only. |
| `rg -n "Historical note|BUILD-PARAGRAPH\.md|scripts/validate-paragraph\.js|student-web.*14" docs\L1.5V\F-plan-part-a-b-separation.md` | PASS | Confirms the L1.5V proposal has a top-of-file historical note and active-contract pointer to `BUILD-PARAGRAPH.md` plus `scripts/validate-paragraph.js`. |

The same local validation set was repeated after staging the intended sprint
files and refreshing repository indexes; all commands remained PASS.

## Repository Map Refresh

| Command | Result | Notes |
|---|---|---|
| `npm.cmd run agent:index` | PASS | Refreshed GitHub-facing platform and lesson indexes. The platform index now includes the eight new sprint/review files; the lesson index changed only by generated timestamp. |
| `node build-scripts/sprints/emit-url-index.js` | PASS | Rewrote `reports/url-index.md`; no tracked content delta was produced. |

## PR Preflight

| Command | Result | Notes |
|---|---|---|
| `gh --version` | PASS | GitHub CLI 2.87.0 is available. |
| `gh auth status` | PASS | Authenticated to `github.com` as `meijer1973` with repo/workflow scopes. |
| `git fetch --prune origin` | PASS | Remote refs refreshed before PR preparation. |
| `git status --short --branch` | PASS | Branch is `codex/skilltree-improvement-20260618` and in sync with origin before commit. Dirty files are the reviewed sprint scope. |
| `git branch --show-current` | PASS | Current branch is `codex/skilltree-improvement-20260618`. |
| `npm.cmd run check:agent-worktree-safety -- --check --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/` | PRE-COMMIT FAIL, RESOLUTION REQUIRED | The branch prefix and branch state passed, but the existing dirty worktree had no worktree lock. Because `--claim` requires a clean tree, the PR workflow resolves this by committing the reviewed scope first, then running the clean `--claim --require-clean` form before push. |

## PR Review Round 1 Resolution Validation

Rawls's first PR review found that the packet was local-only, the PR conflicted
with current `main`, and CI was not yet sufficient for human review.

Resolution evidence:

| Command | Result | Notes |
|---|---|---|
| `git merge origin/main` | RESOLVED | Conflicts were resolved in active companion docs/skills and generated index files. Current `main` PDF lane-boundary wording was preserved alongside this sprint's 14-file student-web validation baseline. |
| `npm.cmd run agent:index` | PASS | Regenerated the platform index after merge resolution. |
| `node build-scripts/sprints/emit-url-index.js` | PASS | Rewrote the URL index after merge resolution. |
| Restore `reports/github-agent-index-lessen.*` to `origin/main` | PASS | This sprint does not change lesson inventory; the local lesson checkout is behind lesson `main`, so regenerated lesson-index churn was neutralized. |
| `npm.cmd test -- scripts/tests/validate-paragraph.test.js` | PASS | 1 suite passed, 13 tests passed after conflict resolution. |
| `npm.cmd run check:scope-language` | PASS | `OK scope-language check: active surfaces` after conflict resolution. |
| `git diff --check origin/main` | PASS | PR-relevant diff has no whitespace errors. A plain diff against pre-merge `HEAD` is noisy because incoming current-main files contain existing whitespace issues outside this sprint. |
| Active stale-text search | PASS | `NO_ACTIVE_STALE_MATCHES` after conflict resolution. |
| Historical note search | PASS | Historical L1.5V proposal still points to `BUILD-PARAGRAPH.md` plus `scripts/validate-paragraph.js` and names default `student-web` as 14 files. |
| `npm.cmd run check:agent-worktree-safety -- --check --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/` | PASS | Lock owner is `codex-main`, task is `COMPANION-WORKFLOW-GUARDRAILS-1`, branch prefix is valid, and the post-merge worktree was clean. |

## Dependency Note

`npm.cmd test` initially failed because `jest` was not installed in the local
worktree. `npm.cmd ci` was run from the checked-in lockfile, after which the
focused validator suite passed. `npm ci` reported existing dependency audit
items (1 low, 1 moderate); no dependency versions were changed in this sprint.

## Local Scope

This sprint changed platform documentation, skills, agents, and sprint-review
records only. It did not mutate generated lesson output in `../4veco-lessen`.

## August Route-Consistency Repair Validation

Bundle id: `COMPANION-ROUTE-CONSISTENCY-20260813-1`.

| Command | Result | Notes |
|---|---|---|
| `npm.cmd test -- build-scripts/workflows/check-paragraph-lane-scope.test.js build-scripts/review-gates/check-active-governance-wording.test.js scripts/tests/validate-paragraph.test.js --runInBand` | PASS | 3 suites, 53 tests after work-review repair. Covers the two wider-route filenames, the unchanged 14-file validator count, cross-repository route declarations, and exclusion of backtick/tilde fenced examples. |
| Direct `checkLaneScope({ lane: 'companion', ... })` for flat `korte-check.html` and `exit-ticket.html` filenames | PASS | Both paths classified as `partB_companion`; no unknown paths or lane failures. |
| `npm.cmd run check:platform` | PASS | 97 suites and 1,287 tests passed; 6 suites and 8 tests skipped by the existing suite configuration. |
| `npm.cmd run check:scope-language` | PASS | Active scope language passed. |
| `npm.cmd run check:active-governance-wording` | PASS | All five allowlisted platform/lesson route-bearing files expose one canonical distinct route. |
| `npm.cmd run check:governance-freshness -- --allow-policy-edit` | PASS | Current `origin/main` is an ancestor and the intentional governance delta is permitted for review. |
| `npm.cmd run finalization:freshness` | PASS | Remote-main ancestry and policy-file hashes recorded. |
| `npm.cmd run check:agent-index-freshness` | PASS | Platform index binds to the pre-index head; lesson inventory remains intentionally bound to lesson `origin/main`. |
| Platform and lesson `git diff --check` | PASS | No whitespace errors. |
| Platform and lesson worktree safety checks | PASS | Both claims belong to `codex-main` / `COMPANION-WORKFLOW-GUARDRAILS-1`; lesson is clean on its dedicated branch. |

The first full-suite attempt stopped because the local dependency tree lacked
`jszip` and `jsdom`. `npm.cmd ci` restored dependencies from the checked-in
lockfile without changing dependency metadata; the rerun passed. The install
reported 5 existing audit findings (1 low, 4 high), outside this repair scope.

Paired lesson publication:

- PR: `meijer1973/4veco-lessen#44`
- payload head: `318b5184a896f0eaa6249ff6fa9f7298e29bb2c1`
- state during implementation review: draft

## Post-#209 Resynchronization Validation

Bundle resynchronization began only after PR #209 merged and post-merge
platform CI passed.

| Check | Result | Notes |
|---|---|---|
| Platform base | PASS | `origin/main` is `20955635f15b4ce0f23adf13179dd5d3d8006a90`. |
| Lesson base/candidate | PASS | Lesson `main` remains `ba08b9c2e033a877c0d1b57952055ce697912a22`; PR #44 remains the one-line candidate `318b5184a896f0eaa6249ff6fa9f7298e29bb2c1`. |
| Pre-merge `git merge-tree` | PASS | Only the four generated GitHub agent-index files conflicted. |
| Platform main merge | PASS | Merge commit `f19dbc90aa3320fe3af4543347e14fa0007161f5`; generated conflicts temporarily resolved from trusted `main`; no substantive manual conflict resolution. |
| Effective changed-path audit | PASS | The post-merge PR diff contains the intended companion workflow, route checker, bundle readiness, tests, and sprint records; no PR #209 implementation path appears as a PR-authored delta. |
| Focused Jest set | PASS | 5 suites and 82 tests passed: validator profiles, paragraph lane scope, active governance wording, bundle readiness, and trusted bundle-index refresh. |

Full local validation, exact substantive-SHA work review, final-tail freshness,
remote CI classification, compatibility, exact-head PR review, and coordinated
readiness remain pending at this checkpoint. They must not be inferred from
earlier bundle runs.

### Full Pre-Review Validation

| Command | Result | Notes |
|---|---|---|
| First `npm.cmd run check:platform` | ENVIRONMENT FAIL | 98 suites and 1,198 tests passed before `pr-readiness-router.test.js` could load `ajv/dist/2020`; the worktree dependencies predated the merged lockfile. |
| `npm.cmd ci` | PASS | Restored 385 packages from the committed lockfile without changing tracked dependency metadata. Existing audit output: 1 low, 1 moderate, 4 high. |
| Repeated `npm.cmd run check:platform` | PASS | 99 suites and 1,337 tests passed; 6 suites and 8 tests skipped by suite configuration. |
| Focused route/lane/validator/readiness/refresh set | PASS | 5 suites and 82 tests passed. |
| `npm.cmd run check:integration-lane` | PASS | 10 suites and 148 tests passed. |
| `npm.cmd run check:pr-readiness` | PASS | 5 suites and 176 tests passed. |
| `npm.cmd run check:scope-language` | PASS | Active scope language passed. |
| `npm.cmd run check:active-governance-wording` | PASS | Local platform candidate plus lesson candidate expose the canonical route. |
| `npm.cmd run check:governance-freshness -- --allow-policy-edit` | PASS | Platform `main` `20955635...` is an ancestor; the intentional `AGENTS.md` delta is reported. |
| `npm.cmd run finalization:freshness` | PASS | Remote/main ancestry and policy hashes bind to merge checkpoint `f19dbc90...`. |
| Platform and lesson shared-lane checks | PASS | Platform reports 14 shared paths plus review evidence; lesson reports only `AGENTS.md`. |
| `npm.cmd run check:branch-protection` | PASS | Required `validate-platform`, strict checks, admin enforcement, and conversation resolution match policy. |
| Platform and lesson `git diff --check` | PASS | No whitespace errors. |
| `node build-scripts/sprints/emit-url-index.js` | PASS | Regeneration produced no tracked URL-index delta. |
| Pre-commit worktree safety check | ADMINISTRATIVE FAIL | The stale lock belongs to prior task `COMPANION-INTEGRATION-INDEX-REPAIR-1`. After this evidence is committed, reclaim the clean worktree for `COMPANION-WORKFLOW-GUARDRAILS-1` under the existing `codex-main` owner before review. |
| Clean worktree release/claim/check | PASS | Released the exact stale `COMPANION-INTEGRATION-INDEX-REPAIR-1` claim owned by `codex-main`, claimed `COMPANION-WORKFLOW-GUARDRAILS-1` at clean checkpoint `6966a8be...`, and rechecked matching owner/task, branch prefix, and cleanliness. |

Agent-index freshness is intentionally deferred until after exact-SHA work
review and the committed review record. Trusted-main generation must then
produce the terminal four-file tail.

### Implementation Review Round 1 Correction

Rawls found one fail-closed lifecycle normalization gap. The readiness executor
now preserves unknown `state`/draft values and requires explicit phase-correct
values at every live verification point.

| Command | Result | Notes |
|---|---|---|
| `npm.cmd test -- --runInBand build-scripts/review-gates/apply-bundle-readiness-decision.test.js` | PASS | 1 suite and 20 tests passed, including 12 missing/null lifecycle regressions across preflight, per-member verification, and final re-fetch. |
| `git diff --check` | PASS | No whitespace errors after the correction. |
| Repeated focused route/lane/validator/readiness/refresh set | PASS | 5 suites and 94 tests passed. |
| Repeated `npm.cmd run check:integration-lane` | PASS | 10 suites and 160 tests passed. |
| Repeated `npm.cmd run check:pr-readiness` | PASS | 5 suites and 176 tests passed. |
| Repeated `npm.cmd run check:platform` | PASS | 99 suites and 1,349 tests passed; 6 suites and 8 tests skipped by suite configuration. |

Rawls returned `OK` on exact substantive commit
`d2ad31cd55e8611dcfa48ef0cce7ae5a8ef86f19`. The committed review record is
the last evidence change before trusted-main index generation.
