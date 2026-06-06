# Sprint MERGE-HANDOFF-CHECKSURFACE-1: Check Surface Branch Preservation Merge

## Goal
Merge `codex/check-short-exit-2` into `main` as preservation/handoff only, after updating from `origin/main`, preserving all useful check-surface evidence, and proving that no human gate or product authority is being closed or broadened.

This sprint changes repository state and review evidence only. It does not change generated lesson output, protected references, source-data authority, product routes, target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, broad product use, or student use.

## Context
The branch contains useful check-surface work and the current `GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review` packet. That packet says human review comments have not started and no closure or product authority exists. The earlier `GATE-CHECK-SHORT-EXIT-2-RETRY` packet is superseded and must not be sent as current evidence.

The branch was behind `origin/main`, so the merge must preserve branch evidence while accepting newer main CI/protocol changes. Generated GitHub maps and internal dashboard files may conflict and must be regenerated from the merged tree.

## Quality Standard
The specification quality floor is a clean preservation merge with proof, not a product approval:

- check-surface artifacts remain present and fetchable from the remote repository;
- `GATE-CHECK-SURFACE-EXCELLENT-1`, `GATE-CHECK-SHORT-EXIT-2`, and `GATE-CHECK-SHORT-EXIT-2-RETRY` remain open or superseded, not closed;
- no rendered output or student-facing generated lesson output is hand-edited;
- `1.1.1` and `1.1.3` completion language remains held;
- reviewed `1.1.2` authority remains local and non-summative only;
- proof includes local validators, book check, no-conflict/no-closure assertions, and remote CI;
- follow-up work is named for the next team branch.

## Specification Fulfilment Matrix
| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Update from `origin/main` before merge | Merge commit or resolved merge state includes current main changes | `git status`, branch history, remote CI | planned |
| Preserve branch evidence | Gate packet, proof JSON, screenshots, maps, and reports remain present | report JSON validation, packet checker, map refresh | planned |
| Keep gate open | No closure, closure-proposal, direct-review, or comment-resolution artifacts for the excellent gate | explicit file checks and packet text search | planned |
| Preserve completion authority boundary | `targetEquivalent.completionLanguageEligible` false for `1.1.1`/`1.1.3`, true only for reviewed `1.1.2` | source-data assertion command and scope-language checker | planned |
| Refresh GitHub-facing maps | regenerated agent indexes, URL index, and internal dashboard | generator output and `emit-url-index --check` | planned |
| Prove local and remote safety | prescribed validators pass locally and remote `platform-ci / validate-platform` passes | command log, CI run URL, final merge report | planned |

## Quality Improvement Candidates
| Candidate | Decision | Rationale |
|---|---|---|
| Add explicit handoff note and plan. | include_now | Prevents future agents from mistaking a merge to `main` for product approval. |
| Regenerate generated indexes after command-log and report additions. | include_now | Keeps GitHub-facing maps aligned for off-site reviewers. |
| Repair the check-surface product on this branch. | reject_scope_creep | The instruction explicitly limits this branch to preservation/handoff. |
| Send or close the human gate from this branch. | reject_scope_creep | Human comments and closure belong to a later authorized gate workflow. |
| Let the next team replan from `main`. | defer_named_follow_up | Product-quality work should start from `codex/checksurface-product-excellence-2` or similar. |

## Allowed paths
- `references/reference-team-roadmap.md`
- `reports/sprints/MERGE-HANDOFF-CHECKSURFACE-1.md`
- `reports/sprints/MERGE-HANDOFF-CHECKSURFACE-1-plan.md`
- `reports/sprints/MERGE-HANDOFF-CHECKSURFACE-1-command-log.md`
- `reports/sprints/MERGE-HANDOFF-CHECKSURFACE-1-command-log.jsonl`
- `build-scripts/sprints/check-merge-handoff-checksurface1.js`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`
- Files brought in from `origin/main` during the merge.

## Forbidden paths
- `references/machine/`
- `references/external/`
- generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `source-data/book-1/exit-ticket/1.1.1-exit-ticket.json`
- `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.*`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/closure-proposal.*`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/direct-review-comments.*`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/comment-resolution-log.*`

## Inputs
- `../CLAUDE.md`
- `AGENTS.md`
- `RESEARCH_AGENT_MAP.md`
- `references/reference-team-roadmap.md`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md`
- `reports/json/checksurface-policy-regression1-proof.json`
- `reports/json/check-short-exit2-proof.json`
- `reports/json/graph-check-ux1-proof.json`
- `reports/json/graph-exit-ux1-proof.json`
- `reports/json/visual-qa-harden2-proof.json`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs
No student-facing or generated lesson output is generated or changed.

Required outputs:

- preservation handoff note;
- operational sprint plan;
- minimal roadmap row;
- refreshed GitHub-facing maps, URL index, and internal dashboard;
- command-log evidence;
- remote CI details in the handoff note as far as possible without self-referential commit churn;
- final merge report.

## Operationalized sprint procedure
1. Fetch `origin`, check out `codex/check-short-exit-2`, and inspect status. Stop if the sibling lesson repository is missing.
2. Merge `origin/main`. If conflicts occur, preserve branch evidence and newer main CI/protocol changes. Resolve generated map/dashboard conflicts by regenerating, not by choosing one side.
3. Add the handoff note and minimal roadmap row. Decision point: if the roadmap implies gate closure, stop and repair the roadmap before validation.
4. Verify no conflict markers, no premature excellent-gate review/closure artifacts, no authority overclaim strings, and no completion-language broadening.
5. Run local validators through the sprint command-log wrapper. Stop on any failed validator except a plan-schema failure that is immediately corrected and rerun.
6. Stage new report files, command logs, and map/dashboard output, then regenerate maps/dashboard again so newly tracked files appear in the GitHub-facing indexes.
7. Commit and push the branch. Stop if remote CI fails; fix only merge hygiene or validation failures.
8. Record available remote CI details in the handoff note and final report. Because a CI run ID is only known after a commit is pushed, the final answer must also report the final commit and final run precisely.
9. Merge through the protected PR path, pull `main`, rerun `npm.cmd run check:platform`, and verify no gate closure artifact exists on `main`.

## Acceptance tests
```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MERGE-HANDOFF-CHECKSURFACE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MERGE-HANDOFF-CHECKSURFACE-1
node build-scripts/sprints/check-merge-handoff-checksurface1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-checksurface-policy-regression1.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
git diff --check
git -C ../4veco-lessen diff --check
node build-scripts/sprints/check-sprint-command-log.js MERGE-HANDOFF-CHECKSURFACE-1
```

## Proof Required to Close
Proof to close this handoff merge must include review, validator, test, and remote evidence:

- planning/review audit result;
- no unresolved conflicts;
- no excellent-gate closure, closure-proposal, direct-review, or comment-resolution files;
- completion-language authority assertions for `1.1.1`, `1.1.2`, and `1.1.3`;
- successful local validator commands in the command log;
- successful `platform-ci / validate-platform` run on the final branch commit;
- merge to `main` and post-merge `npm.cmd run check:platform`;
- final report stating that product authority was not broadened and next work starts on a new branch.

## Rollback plan
If validation or remote CI fails, do not merge. Keep the branch pushed only if it contains useful diagnostic evidence; otherwise repair merge hygiene on the branch and rerun. Do not remove useful check-surface evidence, do not create gate closure artifacts, and do not hand-edit generated lesson output. If the protected merge path is blocked by branch protection or unavailable PR state, report the exact blocker and leave the gate open.

## Human review required
No human review is required or authorized for this preservation merge itself. `GATE-CHECK-SURFACE-EXCELLENT-1` remains the later direct human-review surface and must not be treated as closed by this merge.
