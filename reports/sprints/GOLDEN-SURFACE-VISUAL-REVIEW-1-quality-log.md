# GOLDEN-SURFACE-VISUAL-REVIEW-1 Quality Log

Date: 2026-06-15
Branch: `codex/golden-surface-visual-review-1-20260615`

## Repository State

Platform starting point:

```text
9ba8cea6 Merge pull request #62 from meijer1973/codex/mtu-h5-q19-source-graph-extraction-gate-1-20260615
```

Canonical lesson evidence root:

```text
C:\Projects\4veco\4veco-lessen
8b007cd Merge pull request #12 from meijer1973/codex/paragraph-landing-v2-prototype-port-20260611
```

The sibling lesson worktree under `C:\wt\EXERCISES-20260609\4veco-lessen` was
not used as final evidence because it is on `codex/exercises-20260609` and
contains stale legacy `1.1.2` output.

## Commands Run

```powershell
gh pr view 57 --json number,state,closed,closedAt,mergedAt,mergedBy,mergeCommit,isDraft,mergeable,mergeStateStatus,headRefName,headRefOid,url
git fetch origin --prune
git switch -c codex/golden-surface-visual-review-1-20260615 origin/main
git branch -D codex/golden-workbench-rollout-roadmap-20260612
git push origin --delete codex/golden-workbench-rollout-roadmap-20260612
git status -sb
git log -1 --oneline
git stash push -u -m golden-surface-visual-review-1-artifacts
git fetch origin --prune
git rebase origin/main
git stash pop
git -C C:\Projects\4veco\4veco-lessen fetch origin --prune
git -C C:\Projects\4veco\4veco-lessen status -sb
git -C C:\Projects\4veco\4veco-lessen rev-list --left-right --count origin/main...HEAD
$env:GOLDEN_SURFACE_BOOK_ROOT='C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod'
node build-scripts/sprints/capture-golden-surface-visual-review1.js
Remove-Item Env:\GOLDEN_SURFACE_BOOK_ROOT
node --check build-scripts/sprints/capture-golden-surface-visual-review1.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/ci/check-evidence-line-endings.js
node build-scripts/reports/validate-report-json.js
git diff --check
```

## Generated Evidence

```text
reports/json/golden-surface-visual-review-1-proof.json
reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshot-manifest.md
reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshots/
```

Generated proof summary:

```text
overall_verdict: REVISE
screenshots: 9
112-exit-ticket: PASS
112-korte-check: PASS
113-exit-ticket: REVISE
```

## Visual Inspection Notes

`1.1.2` exit ticket:

- Desktop light view uses the Golden shell and source/task split.
- Mobile light and dark views preserve the Golden shell and route panel, but
  text is clipped at the right viewport edge.
- Authority remains held.

`1.1.2-korte-check`:

- Desktop light view is advisory and uses the Golden shell.
- Mobile light and dark views preserve the advisory route structure, but text
  clipping appears at the right viewport edge.
- Advisory-only status remains held.

`1.1.3` exit ticket:

- Desktop light view uses the Golden shell, source/task split, graph workspace,
  and route panel.
- Mobile light and dark views preserve structure, but hero text clips at the
  right viewport edge.
- Fake slope/connect-line controls are absent.
- Formula-token ambiguity remains: `oldQden` and `oldQnum` both render as
  visible `oude Q` tokens.

## Boundary Confirmation

No generated lesson output was edited. No target-exercise registry data was
mutated. No product-route adoption, completion-language authority,
diagnostics, mastery/sequencing, PV, Scale Gate 1, broad product use, or
student/product use is authorized by this review.
