# BLUEPRINT-3Y-RECONCILE-1 Result

Status: implemented as non-mutating blueprint reconciliation

## Delivered

- `references/owned/course-blueprint-v6-three-year.md`
- `references/owned/course-blueprint-v6-three-year.meta.json`
- `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-reconciliation-report.md`
- `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-book-level-matrix.md`
- `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-quality-log.md`
- `reports/sprints/BLUEPRINT-3Y-RECONCILE-1-plan.md`
- `reports/sprints/BLUEPRINT-3Y-RECONCILE-1-result.md`

## Summary

The active v5 four-book baseline is embedded as Year 1 / Books 1-4 inside a new draft v6 three-year umbrella. The older 13-book three-year concept is reconciled into an 11-book / 4 + 4 + 3 structure. The draft adds a book-level exam-operation spine and explicitly keeps protected reference mutation, target-exercise mutation, and lesson output out of scope.

The result also records a current-state correction: older A45+ planning labels are no longer free proposal ids. Current reports and the live registry treat several of them as existing registry facts, so the next Year 1 foundation lane is review/mapping/closure, not automatic re-minting.

## Repair Pass

The review repair pass makes v6 an umbrella draft rather than a direct v5 supersession, replaces the generic source order with an authority-by-claim-type matrix, adds Books 5-11 load envelopes, gives Book 8 and Book 11 internal spines, and expands the exam-operation spine into operation ids with anchor status, task family, answer form, first paragraph candidate, and retrieval checkpoints.

The repaired draft keeps Books 5-10 on a no-printed-test-prep default pending reviewed book design, and it blocks Book 10 technical constructs such as trilemma reasoning or interest parity from paragraph production until exam or target-exercise anchors exist.

## Operational Cleanup

The PR cleanup refreshed the branch from current `main` and repaired the generated inventory hash path. `source_manifest.json` and `document_inventory.json` now record LF-normalized text fingerprints instead of raw platform checkout bytes, while preserving binary bytes. This removes the Windows CRLF artifact for unchanged text files such as `references/authored/course-target-exercises.json`; its generated size/hash now match both the normalized worktree bytes and the Git blob bytes.

## Verification

Completed checks:

- Parsed JSON sidecars and generated JSON reports.
- Regenerated `reports/github-agent-index-*`, `reports/url-index.md`, the internal dashboard, source manifest, document inventory, and source-document registry.
- Updated curated GitHub-facing maps for the draft v6 owned source.
- Ran `node build-scripts/references/check-source-document-registry.js`.
- Ran `node build-scripts/references/check-source-manifest.js`.
- Ran `node build-scripts/references/check-document-inventory.js`.
- Ran `node build-scripts/references/check-roadmap-version-index.js`.
- Ran `node build-scripts/sprints/emit-url-index.js --check`.
- Ran `npm.cmd run check:scope-language`.
- Ran `node build-scripts/reports/validate-report-json.js`.
- Ran `node build-scripts/references/check-mtu-evidence-layer.js`.
- Ran `node build-scripts/ci/check-evidence-line-endings.js`.
- Ran `npm.cmd ci` to install the locked test dependencies in this clean worktree.
- Ran `npm.cmd run check:platform`; Jest reported 52 passed suites, 6 skipped suites, and 779 passed tests.
- Ran `git diff --check`.
- Ran exact conflict-marker scan with `rg -n "^(<<<<<<< .+|=======|>>>>>>> .+)$" .`.
- Ran `npm.cmd run check:agent-worktree-safety -- --check --task BLUEPRINT-3Y-RECONCILE-1 --agent codex --require-prefix codex/,agent/`.

## Next Action

Open/review the draft PR for `codex/blueprint-20260610`. Do not start CLI mutation, Year 2/3 target-exercise production, or student-facing lesson output until human review accepts the umbrella role, 11-book structure, load envelopes, and exam-operation spine.
