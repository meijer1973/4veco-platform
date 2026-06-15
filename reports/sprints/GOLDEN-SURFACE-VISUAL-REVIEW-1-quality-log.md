# GOLDEN-SURFACE-VISUAL-REVIEW-1 Quality Log

Date: 2026-06-15
Platform branch: `codex/golden-surface-visual-review-1-20260615`
Lesson branch: `codex/golden-surface-visual-revision-1-20260615`

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
not used as evidence because it is on `codex/exercises-20260609` and contains
stale legacy `1.1.2` output.

## Commands Run

```powershell
gh pr view 65 --json number,state,isDraft,headRefName,headRefOid,baseRefName,url,mergeable,mergeStateStatus
git status -sb
git log -1 --oneline
git -C C:\Projects\4veco\4veco-lessen fetch origin --prune
git -C C:\Projects\4veco\4veco-lessen switch -c codex/golden-surface-visual-revision-1-20260615 origin/main
npm.cmd test -- engines/tests/golden-ticket-layout.test.js engines/tests/exit-ticket-engine.test.js build-scripts/sprints/check-golden-exercise-workbench.test.js --runInBand
node build-scripts/sprints/check-golden-exercise-workbench.js
node scripts/deploy.js "C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js "C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
$env:GOLDEN_SURFACE_BOOK_ROOT='C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod'
node build-scripts/sprints/capture-golden-surface-visual-review1.js
Remove-Item Env:\GOLDEN_SURFACE_BOOK_ROOT
node --check build-scripts/sprints/capture-golden-surface-visual-review1.js
```

The deploy command completed with valid local references, reachable interactive
files, and data validation tests passing.

## Generated Evidence

```text
reports/json/checksurface-113-exemplar-exit1-proof.json
reports/json/golden-exercise-checkers-1-proof.json
reports/json/golden-surface-visual-review-1-proof.json
reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshot-manifest.md
reports/sprints/GOLDEN-SURFACE-VISUAL-REVIEW-1-screenshots/
```

Generated proof summary:

```text
overall_verdict: PASS
screenshots: 9
112-exit-ticket: PASS
112-korte-check: PASS
113-exit-ticket: PASS
mobile_runtime_overflow: false for every 390px mobile state
old_formula_token_ids_absent: true
duplicate_visible_token_labels_absent: true
```

## Repair Notes

`GSVR1-F1` mobile clipping was repaired through shared Golden layout CSS:

- grid children and panels now have explicit `min-width: 0`;
- long headings, intro copy, route pills, controls, inputs, and tables wrap
  within their containers;
- screenshot capture now uses CDP device metrics, matching the runtime proof.

`GSVR1-F2` formula-token ambiguity was repaired in `1.1.3` source data:

- `oldQden` became `oldQBase` with visible label `oude Q als basis`;
- `oldQnum` became `oldQBeforeChange` with visible label `oude Q in teller`;
- `newQden` became `newQBase` with visible label `nieuwe Q als basis`;
- the expected formula sequence was updated to the repaired token IDs.

## Visual Inspection Notes

`1.1.2` exit ticket:

- Desktop light view uses the Golden shell and source/task split.
- Mobile light and dark views wrap cleanly at 390px.
- Authority remains held.

`1.1.2-korte-check`:

- Desktop light view is advisory and uses the Golden shell.
- Mobile light and dark views wrap cleanly at 390px.
- Advisory-only status remains held.

`1.1.3` exit ticket:

- Desktop light view uses the Golden shell, source/task split, graph workspace,
  and route panel.
- Mobile light and dark views wrap cleanly at 390px.
- Fake slope/connect-line controls are absent.
- Formula-token ambiguity is closed; old internal token IDs and duplicate
  visible token labels are absent.

## Boundary Confirmation

Generated lesson output was regenerated through the platform deploy pipeline on
the lesson branch. It was not hand-edited. Target-exercise registry data was not
mutated. No product-route adoption, completion-language authority, diagnostics,
mastery/sequencing, PV, Scale Gate 1, broad product use, or student/product use
is authorized by this review.
