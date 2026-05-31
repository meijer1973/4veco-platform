# CHECK-Q2-PLAN Lead Review Corrections

Generated: 2026-05-31

Sprint: `CHECK-Q2-PLAN`

## Round 1 Verdict

REVISE.

## Blocking Finding

The deterministic evidence checker guarded protected/source/generated-output
surfaces with `git diff --name-only`. That can miss staged-only changes and
untracked forbidden files.

## Corrections Applied

| Finding | Correction |
|---|---|
| Checker could false-pass staged or untracked protected/source changes. | Replaced protected/source guard with `git status --porcelain -- <paths>` in `build-scripts/sprints/check-check-q2-plan-evidence.js`. |
| Checker could false-pass staged or untracked generated Book 1 output changes. | Replaced lesson output guard with `git -C ..\4veco-lessen status --porcelain -- "Boek 1 - Grondslagen, vraag en aanbod"`. |
| Acceptance-test guard in the plan used the weaker diff command. | Updated `reports/sprints/CHECK-Q2-PLAN-plan.md` to use `git status --porcelain` guards for both repos. |
| Round-2 recheck found stale metadata acceptance-test guard. | Updated `references/data/sprints/CHECK-Q2-PLAN.plan.json` to use the same `git status --porcelain` guards as the Markdown plan and checker. |

## Recheck Evidence

To be run before round 2:

```powershell
node build-scripts/sprints/check-check-q2-plan-evidence.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECK-Q2-PLAN-plan.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-Q2-PLAN
```

## Remaining Risk

None known after correction. Round 2 must verify that the stricter checker
still passes and that no new authority or scope drift was introduced.
