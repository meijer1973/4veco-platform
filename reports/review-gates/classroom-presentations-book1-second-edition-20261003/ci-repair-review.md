# Book 1 historical CI diagnosis and repair review

**Repair review: PASS. No blocking findings. Remote CI rerun remains required.**

Reviewed the two-file working diff over platform `d6683ee2b4ee450b45ccd36f318c0a8f645946ef` (PR #304), with lesson candidate `4cf51ddbd033c26fe99a3c7f44bba6174a5024c4` (PR #100). Reviewer: `review_ci_recovery`; 2026-10-03T15:25:14.526Z.

## Diagnosis

All five historic workflows fail at exact-pair binding, before their historical content checks, with `Unreviewed platform changed-path inventory`. The logs show the new adapter entering its immutable predecessor checkout at `926ada14` first. Their respective pinned lessons remain `773d72a6` (Books 3/4 signed), `c20ad77a` (followups), `86c228bd` (Book 2 signed), `fdad5d8f` (exercise route), and `b9990d3c` (notation).

The defect is in `historicalPredecessor()` at the new classroom adapter: it creates a top-level `node_modules` symlink on Linux. The preserved `.gitignore` contains the directory-only rule `node_modules/`, so the symlink enters the immutable predecessor changed-path inventory. Its `checkRows()` correctly rejects the extra entry before historical-pair dispatch. The new global classroom route exposes this bridge defect; weakening the original inventory or changing pins would hide it.

All five historic workflows passed at `e4e17a1e8608f8e8c0f5ae2e27eb7f8de2166ed8`, the accepted head merged by PR #303 into `926ada14`. Prior run IDs: Books 3/4 signed `37112577714`, followups `37112577717`, Book 2 signed `37112577709`, exercise route `37112577686`, notation `37112577699`. Their current failed runs are respectively `37132726929`, `37132726900`, `37132726894`, `37132726851`, `37132726839`. This is a new bridge regression; the evidence does not support treating those historical pair contracts as already stale. Saved full failed logs and `prior-runs.json` accompany this review.

Book 1 paired workflow `37132726937` passed on the reviewed candidate. That result validates the selected Book 1 pair; it does not substitute for the remaining required platform and compatibility checks.

## Reviewed repair

The actual diff replaces the top-level symlink with a real ignored `node_modules` directory and links directory entries inside it. A scope such as `@scope` is linked as one directory, preserving scoped module lookup. This satisfies the nested immutable verifier, which explicitly resolves dependencies via its predecessor checkout path. The patch changes no historical source, pin, receipt, `.gitignore`, scope allowlist, or dispatcher contract.

Cleanup verifies each child is a symlink before unlinking it, then removes the empty task-created container. It does not recurse into the shared dependency source. A setup failure cleans its partial links and rethrows. No substantive review finding remains in this patch.

## Independent validation and binding

- Both JavaScript syntax checks passed.
- Classroom-scope Jest suite: **16/16 tests passed**.
- The added regression uses actual Git ignore behavior and actual plain/scoped module resolution, still detects an unrelated untracked file, and verifies cleanup preserves source package bytes.
- A separate scratch fixture independently confirmed the real-directory layout, an empty untracked inventory, and successful plain/scoped resolution (`dependency-layout-proof.json`). The environment could not create a Windows directory symlink (`EPERM`); the new layout was independently exercised with child junctions, while the exact Linux path still requires remote CI.

- `build-scripts/books/book1-classroom-scope.js`: working-byte SHA-256 `aa9f820227c9e3d2644bf10ffd82ff8d2492f41118a78dea42cab18a7baa4f1b`.
- `build-scripts/books/book1-classroom-scope.test.js`: working-byte SHA-256 `8c4098c66d0738c6db85d714c87457c727d2ed5e42919e63b5b3cfa34af74dfe`.

Commit these reviewed bytes and rerun all five historical paired workflows, required platform CI, and exact-pair compatibility on the resulting commit. This local PASS is code-review evidence and does not assert the new remote checks have completed successfully. No root repository or GitHub state was changed by the reviewer.
