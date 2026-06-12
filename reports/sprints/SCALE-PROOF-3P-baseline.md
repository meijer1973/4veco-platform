# SCALE-PROOF-3P Baseline

Generated: 2026-06-12
Owner: codex
Status: started as proof production
Branch: `codex/scale-proof-3p-20260612`
Worktree: `C:\w\SCALE3P\4veco-platform`

## Baseline SHAs

- Platform main: `5147c9efb22fdee11721bea47dff37d271850f29`
- Lesson main: `8b007cd86a485518bca8881051e11f5272f162c7`
- Platform gate closure PR #53 merge: `91154093e8d4c637f29de4663503e07dbcfca0a4`
- Platform landing V2 PR #47 merge: `5147c9efb22fdee11721bea47dff37d271850f29`
- Lesson landing V2 PR #12 merge: `8b007cd86a485518bca8881051e11f5272f162c7`

## Start Authority

`GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review` closure
records this sequence:

1. merge the gate-closure PR;
2. review and merge platform PR #47;
3. review and merge lesson PR #12;
4. start `SCALE-PROOF-3P` as proof production.

The first three steps are complete. This branch starts step 4 only.

## Authority Boundary

This sprint may produce rendered student-path proof. It may not authorize:

- product-route adoption;
- new target-equivalent completion language;
- diagnostics;
- adaptive routing;
- mastery/sequencing;
- PV;
- Scale Gate 1;
- student/product use;
- `GATE-PRODUCT-3P` start or closure.

## Required Proof Set

For `1.1.1`, `1.1.2`, and `1.1.3`, proof must inspect:

- landing V2 route;
- Start row;
- Leer row;
- Oefen row;
- skill map or route overview where relevant;
- first practice task with source/context where relevant;
- advisory short check;
- target-equivalent exit ticket status;
- feedback;
- next action;
- product-boundary language.

## Initial Worktree Claim

Command:

```bash
npm.cmd run check:agent-worktree-safety -- --claim --task SCALE-PROOF-3P --agent codex --require-prefix codex/,agent/ --require-clean
```

Result: passed. Lock owner `codex`; task `SCALE-PROOF-3P`; branch
`codex/scale-proof-3p-20260612`; dirty count `0`.

## Known Baseline Caveat

Some roadmap rows still contain pre-closure wording that describes
`SCALE-PROOF-3P` as blocked. The merged gate-closure artifact and current human
direction supersede that wording for proof production only. Downstream product
authority remains blocked.
