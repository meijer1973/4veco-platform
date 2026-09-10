# Archive cleanup, 10 September 2026

## Implementation plan

Combine the earlier exact-file cleanup with the supplied archive package on
`codex/reorganize-4-20260909` in the paired `C:/wt/reorganize 4/` worktrees.
The package revises the presentation handoff to a move and retains the already
archived clarity audit. Reconcile those two earlier deletions before migration.

1. Verify the 524 operation blobs and destinations; record existing cleanup.
2. Add explicit historical path resolution and current/history navigation.
3. Move the selected records with unchanged source bytes and migrate consumers.
4. Preserve full roadmap snapshots, shorten historical execution detail, and
   keep current decisions, unresolved obligations and source links visible.
5. Regenerate affected inventories and validate exact moves, negative evidence
   checks, search defaults, active lesson invariance and affected consumers.
6. Obtain one independent maintenance review, fix findings, and publish paired
   PRs with local validation and remote CI results. The requested outcome is PRs;
   merge and lesson deployment are outside this task.

Quality floor: every operation is accounted for; original evidence and source
versions remain recoverable, and missing current or corrupt historical files
still fail checks. Historical placement does not change authority or verdicts.
Unexpected immutable bindings retain their complete dependent group with an
explicit exception. Do not weaken checks or modify sealed Y1 evidence.

Useful improvements in scope are current-first retrieval, one generated archive
inventory, narrow historical readers and visible carried obligations. Unlisted
archives, product behavior and unresolved product approvals remain outside scope.

## Validation and outcome

The supplied 524 operations are accounted for: 507 platform moves and 7
platform deletions; 4 lesson moves and 6 lesson deletions. Ten deletions had
already been applied in this task. The newer package supersedes two earlier
removals: the clarity audit is retained and the presentation handoff is archived.
No operation was broadened and no source-preservation exception was needed.

Every move is checked against its recorded original Git blob. The relocated
presentation README has one documented navigation edit and both blob IDs.
Both full roadmap snapshots retain their original bytes. All 324 platform and
198 lesson ledger table rows, their parsed states and carried conditions remain.
The schema-audit report has only its source-file locator updated; findings,
counts, timestamps and verdicts remain unchanged.

Validation performed:

- Full current Jest suite: 114 suites and 1,883 tests pass; 6 suites and
  8 tests retain the existing skip configuration.

- `node build-scripts/maintenance/check-archive-cleanup.js --require-paired`:
  all 511 moves, 13 deletions and 2 snapshots pass; known duplicate copies match.
- All 67 selected baseline/migrated checks have identical output and exit status:
  11 infrastructure bundles, the 152-entry roadmap index and line-ending check
  pass. The 54 legacy bundles retain their pre-existing modern-contract failures
  (including required Quality Standard/scope language and the S9a plan pattern).
  The checked Markdown and JSONL logs were moved together without replay.
- Focused resolver, archive navigation, index freshness and roadmap preservation:
  4 suites, 24 tests pass, including missing/corrupt evidence, no active-file
  fallback, alternate caller directory and Unicode archive names.
- Both task-family historical ZIP consumers pass. The exercise-authority hygiene
  check has an unchanged baseline failure: `golden-ticket-reference.html` does
  not match its manifest hash. Executing the baseline checker reproduces the
  same failure; both fixture bytes and manifest are unchanged.
- Complete archive inventories cover 979 platform and 473 lesson historical
  records. Default search/current indexes exclude archives; explicit archive
  search remains available. Document inventory validates 6,480 files.
- Representation regeneration was exercised with writes captured in memory:
  all three canonical reports are emitted and the three deleted mirrors are not.
- No active lesson files, engines, machine/external references or source data
  changed. Links in 133 active lesson HTML files do not target deleted paths.
  The presentation golden check and 1.1.1 student-web complete check pass
  (the latter retains its existing small-PPTX warning).
- Both repositories pass diff hygiene. Fresh fetches still match the recorded
  baseline main commits; worktree ownership and governance freshness pass.

One independent maintenance review verified the scope, source preservation,
roadmap obligations and consumer changes. Its findings on current navigation,
root-aware readers, consumer metadata and duplicate snapshot links were fixed.
No product status or historical verdict was changed. PRs and their CI runs are
the remote evidence record; this document does not grant merge authority.
