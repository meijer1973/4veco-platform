# September 14 closure addendum

This finishes the existing September 13 assessment after the targeted archive correction; it is not a new assessment. The original `completion.md`, `independent-review.md`, timed logs, figures, PDFs and review evidence were preserved. The original retained cold-agent assignment was copied verbatim to `../task-prompt.md` and identified as retained text, not reconstructed wording.

The lesson worktree was clean at the expected reviewed commit `7a908e92f5495bd4398a8c4f634a8a95be44d048`. Ownership was verified as `assessment-layout` on `codex/assessment-layout-20260913`. Its same-owner lock was older than eight hours, so it was renewed without overriding another owner. Platform remains unchanged at `85b0f347f3070e005eae3f35f0b11ce6eac71b4d`.

Following the parent's current-contract/consumer inspection and explicit direction, the refreshed exercise ZIP was exported outside the tracked tree, then the tracked historical ZIP was restored to `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`. Only that binary restoration was committed in local closure commit **`0eaaa18a64a3bd3bcd3203d703c6664a7428440d`**. No content, renderer, validator, classification rule or shared instruction changed in this closure. No push or remote publication was performed.

The final payload from baseline `0acaaa97443e5c4fee34f7da8a12ccd5db62d762` to final commit is exactly these five files under `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/`:

1. `2.1.1 Kostenstructuren – opgaven.md`
2. `2.1.1 Kostenstructuren – opgaven.html`
3. `2.1.1 Kostenstructuren – opgaven.pdf`
4. `build_pdf.py`
5. `2.1.1-textbook-review-manifest.json`

All five match their reviewed commit bytes exactly. `git diff --check` passes. The actual textbook-lane command now exits 0 with **PASS (textbook), Part A textbook: 5**; it has no unknown ZIP path and no classification exception. This resolves the disclosed ZIP scope blocker for this payload. It supplies no broader paragraph, teaching authority, release, CI or publication acceptance.

Delivery/evidence archive: `C:/wt/reorganize 2/authoring-assessment-20260913/layout/closure-20260914/2.1.1 Kostenstructuren – opgaven.zip`, SHA256 `6c35648f6be3b237b907c112b96f1b14b45defd70309255a9eea5480be23ae7d`. It is byte-identical to the refreshed ZIP at the reviewed commit, retains 15 members, passes ZIP CRC checking, and its three exercise files plus builder match the current reviewed files. The tracked ZIP is byte-identical to the baseline blob.

Reused browser evidence: `C:/wt/reorganize 2/authoring-assessment-20260913/layout/final-html-summary.png`, SHA256 `cc950d932a45ece4c9e9db5bcb05358bca4675b265258121ad067dc1d62315c2`. Reuse is supported by unchanged final HTML bytes: SHA256 `8330a14d25718c347216dc9e5253d6734345495c61fb0af661fdc4ad4954ac31`. The reviewed PDF is also unchanged, SHA256 `70e21a04e78dd7bc4b1e950724565a5177e184312aaed5ee7659cd82f97a688d`. The existing normalized inventory digest remains `cbd8fe89d61d127c7eea31f075ba8d941945c0cc0a125874843548486389c7c0`.

## Exact commands and verification

From the platform worktree:

```powershell
git status --short --branch
git rev-parse HEAD
npm.cmd run check:agent-worktree-safety -- --check --task assessment-layout-20260913 --agent assessment-layout --require-prefix codex/,agent/ --require-clean --worktree 'C:/wt/reorganize 2/authoring-assessment-20260913/layout/4veco-lessen'
npm.cmd run check:agent-worktree-safety -- --claim --task assessment-layout-20260913 --agent assessment-layout --require-prefix codex/,agent/ --require-clean --worktree 'C:/wt/reorganize 2/authoring-assessment-20260913/layout/4veco-lessen'
```

From the lesson worktree, the initial `git status --short --branch` and `git rev-parse HEAD` confirmed the clean reviewed commit; `git fetch --prune origin` completed successfully. The preparation script exported the ZIP using `Path.write_bytes()` only after confirming it matched the reviewed Git blob and known SHA256. Its exact restoration command was:

```powershell
git restore --source=0acaaa97443e5c4fee34f7da8a12ccd5db62d762 --worktree -- 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.zip'
```

Closure execution and local commit:

```powershell
$env:PYTHONUTF8='1'
python 'C:/wt/reorganize 2/authoring-assessment-20260913/layout/closure-20260914/verify-closure.py' prepare
git add -- 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.zip'
git commit -m 'Keep historical ZIP outside the layout repair payload'
python 'C:/wt/reorganize 2/authoring-assessment-20260913/layout/closure-20260914/verify-closure.py' verify
```

The final verification script directly ran these Git checks from lessons, and the unmodified production lane command from platform:

```powershell
git diff --name-only 0acaaa97443e5c4fee34f7da8a12ccd5db62d762 HEAD
git diff --check 0acaaa97443e5c4fee34f7da8a12ccd5db62d762 HEAD
git status --short --branch
node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base origin/main --head HEAD
```

`commands.jsonl` preserves every verification subprocess's exact argv, working directory, result, duration and output or binary hash. `prepare-preservation.json`, `verify-preservation.json`, `textbook-lane-scope.log`, `final-diff-check.log`, `final-status.log` and `commit.log` retain the results. Initial tool-call batches took 0.941 s for platform ownership/status, 1.117 s for lesson status/fetch, and 0.745 s for same-owner lock renewal. Preparation took 0.841 s; commit/final verification took 0.991 s. No new skill/document reading, rendering, browser session or broad test suite was needed for this archive-only closure. The original bounded review remains the applicable substantive review; no new PASS was manufactured from unchanged files.
