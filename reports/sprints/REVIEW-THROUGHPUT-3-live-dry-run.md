# REVIEW-THROUGHPUT-3 Live Dry-Run Evidence

Generated: 2026-06-22

## Purpose

Exercise the read-only PR readiness collector against real GitHub PR metadata
and representative fixtures. The live collector must fail closed when the
remote PR lacks machine-readable current-head checker proof or lead-review
proof.

## Live metadata runs

All live commands used `build-scripts/review-gates/review-pr-readiness.js` and
did not mutate GitHub state.

| PR | Current GitHub state on 2026-06-22 | Remote head | Live route | Human explanation |
|---|---|---|---|---|
| `meijer1973/4veco-platform#132` | OPEN draft, `validate-platform` success | `2ddac5b189ce3406d280d8d883841165d337e307` | `KEEP_DRAFT_REVISE` | Current CI and changed paths are visible, but the router cannot see machine-readable checker proof or lead-review proof. It correctly keeps the PR draft and returns corrections instead of asking the owner. |
| `meijer1973/4veco-platform#133` | MERGED, not draft | `839b22904dbff40815e75be4780844ee11e53acf` | `KEEP_DRAFT_REVISE` | The PR is already merged as of 2026-06-22, so no draft-to-ready transition is valid. |
| `meijer1973/4veco-platform#42` | MERGED, known historical L1 candidate | `6eb0e45ad2e30a0cad97c9855c0c797993ac8786` | `KEEP_DRAFT_REVISE` | Retrospectively this could have been L1 with current proof, but live routing refuses transition because it is no longer open and lacks the new decision-proof envelope. |
| `meijer1973/4veco-platform#48` | MERGED, historical high-authority/protected-reference PR | `2680b27ebfd73f4d30ad7e22040b3c1c6200a83d` | `KEEP_DRAFT_REVISE` | The collector detects protected-reference changed paths and escalates authority to L4, but the PR is already merged and lacks current router proof, so no transition is allowed. |
| `meijer1973/4veco-platform#52` | MERGED, small roadmap follow-through | `b0f9af24045f8dae2af58065296ed47513ff9b8c` | `KEEP_DRAFT_REVISE` | Retrospectively this is a small L1-style candidate, but live routing refuses a transition because the PR is closed and does not carry current router proof. |

The command log records the live runs and their exit codes. Per-PR live
decision JSON/Markdown files are not retained in the branch because live
decisions for a reviewed head belong in idempotent GitHub comments, not in
self-invalidating committed branch artifacts.

## Representative fixture routes

The fixture suite supplies complete proof where historical PRs cannot. These
dry runs prove the intended route semantics without mutating unrelated PRs:

| Fixture | Route | Human explanation |
|---|---|---|
| `live-l1-ready.json` | `READY_FOR_LEAD_ONLY` | Normal platform work with current-head CI, checker proof, lead-review PASS, changed paths, and no human authority can leave draft without owner permission. |
| `l3-substantial-human.json` | `READY_FOR_HUMAN_REVIEW` | A coherent generated-output product bundle is ready for the owner decision and must not auto-merge. |
| `l4-small-spec-human.json` | `READY_FOR_HUMAN_REVIEW` | A small product-specification change is consequential and must go to human review despite low file count. |
| `l3-thin-batch.json` | `KEEP_DRAFT_BATCH` | A small generated-output correction without owner-preapproved L2 coverage should be batched with the next coherent related bundle. |
| `l4-router-self-human.json` | `READY_FOR_HUMAN_REVIEW` | Review-autonomy or router self-modification is a consequential exception, including this sprint's implementation PR. |

## Branch-protection note

`reports/sprints/REVIEW-THROUGHPUT-3-branch-protection.md` records that branch
protection currently requires one approving PR review. The router can still
classify a PR as substantively lead-only, but merge may remain mechanically
blocked until a branch-protection-satisfying approval identity or explicit
ruleset decision exists.
