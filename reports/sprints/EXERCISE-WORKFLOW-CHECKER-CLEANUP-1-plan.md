# Sprint EXERCISE-WORKFLOW-CHECKER-CLEANUP-1: Exercise Workflow Checker Cleanup

Generated: 2026-06-29

## Goal

Repair the exercise-template and check-surface workflow evidence layer after
the exit-ticket source split from legacy unsuffixed files such as
`1.1.2.json` into current suffixed files such as
`1.1.2-exit-ticket.json` and `1.1.2-korte-check.json`.

The sprint should make live validators, active report JSON, gate-evidence
checks, and workflow documentation refer to current source paths or explicitly
mark historical evidence as archival. It must not change exercise source data,
engines, rendered lesson output, product authority, or student-facing behavior.

## Context

Current `main` has the correct split source files in
`source-data/book-1/exit-ticket/`, and generated lesson output in
`../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/`
also uses the split files. The stale layer is the governance and validation
surface.

Confirmed current-main failures include:

- `node build-scripts/sprints/check-standard-exercises1-coverage.js` fails
  because it requires missing
  `source-data/book-1/exit-ticket/1.1.2.json`.
- `node build-scripts/sprints/check-task-shell-ux2.js` fails for the same
  missing path.
- `node build-scripts/sprints/check-l1-7b-q2-implementation.js`,
  `check-l1-7b-q2-copy.js`, `check-l1-7b-q2-d31-struct.js`, and
  `check-check-short-exit1-inventory.js` fail because they require missing
  `1.1.1.json` or `1.1.2.json`.
- `node build-scripts/sprints/check-math-ux2-route-output.js` fails because it
  forbids the now-valid `1.1.2` exit-ticket page.
- `node build-scripts/sprints/check-reason-ux2-route-output.js` passes while
  guarding old nonexistent filenames, so it no longer proves the intended
  boundary.
- Active JSON evidence and gate-packet records still cite old source paths.

## Quality Standard

Quality floor: every live checker touched by this sprint must prove the
current specification rather than merely pass. The implementation must
distinguish current split source files from historical unsuffixed sprint
evidence, preserve student-facing and rendered output boundaries, and make
follow-up work explicit when old claims cannot be safely reinterpreted.

Proof standard: deterministic checker runs must demonstrate that current
source paths exist, old unsuffixed paths are not treated as active inputs, and
gate-evidence or report records cannot silently bless missing current files.
Rendered output is used only as read-only evidence for path parity; no rendered
lesson output may be changed. Any omitted or intentionally archival reference
must be named as a follow-up or non-blocking historical record.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Live exercise/check-surface validators use current split source paths. | Updated checker scripts for standard exercises, task shell UX2, L1.7B-Q2, short/exit inventory, and route-output guards. | Commands that failed in the baseline now pass or are explicitly marked historical with a replacement validator. | planned |
| Active JSON reports and gate-evidence checks do not cite missing source files as current evidence. | Updated active report JSON, gate evidence JSON, and checker-required path lists where they are part of current evidence. | `validate-report-json`, gate checker, and targeted path-existence sweep pass. | planned |
| Historical sprint reports remain historical instead of being bulk-rewritten. | Historical markdown under old sprint records is left unchanged unless active tooling reads it as current evidence. | Lead review confirms historical archive mentions are not presented as current workflow instructions. | planned |
| No source data, engine behavior, generated lesson output, or product authority changes. | Git diff contains checker/report/documentation changes only. | Git diff, lesson diff, and lead review verify forbidden surfaces are untouched. | planned |
| Workflow reproducibility issue around global DOCX template dependencies is recorded without scope creep. | Result records the `%APPDATA%/npm/node_modules` template dependency as follow-up unless a tiny documentation guard is needed. | Lead review checks that no broad DOCX builder migration is hidden in this cleanup. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add or update a shared helper for current exit-ticket source paths. | include_now | Use if it reduces duplicate stale path fixes across live checkers. |
| Make gate-evidence checks verify file existence for current source evidence. | include_now | Prevents a gate checker from passing while citing missing active files. |
| Rewrite every old sprint markdown mention of `1.1.2.json`. | reject_scope_creep | Historical reports should remain historical unless active tooling consumes them. |
| Migrate all DOCX builder templates away from global Node dependencies. | defer_named_follow_up | Real improvement, but outside this checker/report cleanup. |
| Regenerate Book 1 lesson output. | reject_scope_creep | Current lesson output already uses split files; no generated-output change is authorized. |

## Allowed paths

- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-baseline.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan-review-round1.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan-review-round2.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-lead-review-assignment.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-lead-review-round1.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-lead-review-corrections.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-lead-review-round2.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-result.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-diff-summary.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-quality-log.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.jsonl`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.md`
- `reports/json/standard-exercise-family-coverage.json`
- `reports/json/check-short-exit-inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/**`
- `references/data/procedure-visual/inventory.json`
- `references/data/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1.plan.json`
- `references/data/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1.result.json`
- `references/reference-team-roadmap.md`
- `build-scripts/sprints/check-standard-exercises1-coverage.js`
- `build-scripts/sprints/check-task-shell-ux2.js`
- `build-scripts/sprints/check-check-short-exit1-inventory.js`
- `build-scripts/sprints/check-l1-7b-q2-implementation.js`
- `build-scripts/sprints/check-l1-7b-q2-copy.js`
- `build-scripts/sprints/check-l1-7b-q2-d31-struct.js`
- `build-scripts/sprints/check-math-ux2-route-output.js`
- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js`
- generated repository-map, URL-index, and dashboard artifacts only if the
  normal validators require refresh.

## Forbidden paths

- No `source-data/book-1/exit-ticket/*.json` edits.
- No generated lesson output edits in `../4veco-lessen/`.
- No engine implementation or CSS/JS behavior changes.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise registry writes.
- No candidate storage creation or candidate writes.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, product
  route adoption, or student/product use.

## Inputs

- `source-data/book-1/exit-ticket/`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/`
- `build-scripts/platform/build-exit-ticket-shells.test.js`
- `references/ui/README.md`
- `references/ui/layout-registry.json`
- `reports/json/standard-exercise-family-coverage.json`
- `reports/json/check-short-exit-inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `references/data/procedure-visual/inventory.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.json`
- the live checker scripts listed in Allowed paths.

## Outputs

- Updated live checker scripts that understand the split source model.
- Updated active JSON evidence where it functions as current proof.
- Updated gate-evidence checker path validation for L1.7B-Q2 evidence.
- Sprint plan, lead-review records, implementation review records, result,
  baseline, command log, quality log, diff summary, and result metadata.
- A draft PR routed by the PR Readiness Reviewer after lead-review approval.

## Operationalized sprint procedure

1. Write this plan and run the subagent lead reviewer on it.
2. If lead review returns changes, update the plan and repeat until the plan
   receives `PASS` or explicit `OK`.
3. Write the baseline artifact and run the non-complete sprint bundle check.
4. Patch live validators to use current split source files or, where a
   historical validator cannot be reinterpreted safely, mark the historical
   boundary and provide the current replacement proof.
5. Update active report JSON and gate-evidence checks that currently cite
   missing unsuffixed files as current evidence.
6. Add `check-exercise-workflow-checker-cleanup.js` as the deterministic
   path-existence and stale-active-evidence sweep. It must prove current split
   paths exist and fail if active evidence records still treat unsuffixed
   files as current source evidence.
7. Run focused baseline-repair commands:
   - `node build-scripts/sprints/check-standard-exercises1-coverage.js`
   - `node build-scripts/sprints/check-task-shell-ux2.js`
   - `node build-scripts/sprints/check-l1-7b-q2-implementation.js`
   - `node build-scripts/sprints/check-l1-7b-q2-copy.js`
   - `node build-scripts/sprints/check-l1-7b-q2-d31-struct.js`
   - `node build-scripts/sprints/check-check-short-exit1-inventory.js`
   - `node build-scripts/sprints/check-math-ux2-route-output.js`
   - `node build-scripts/sprints/check-reason-ux2-route-output.js`
   - `node build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js`
   - `node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
8. Record final commands in
   `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.jsonl`
   and summarize them in the command-log markdown.
9. Run platform/report hygiene validation and path-existence sweeps.
10. Write result, quality log, diff summary, and result metadata, including
    `plan`, `baseline`, `result`, `diff_summary`, `acceptance_tests`, and
    lead-review fields required by `check-sprint-bundle.js`.
11. Run implementation lead review. Apply every blocking or material suggestion
   and repeat until the implementation receives `PASS` or explicit `OK`.
12. Run `node build-scripts/sprints/check-sprint-bundle.js
    EXERCISE-WORKFLOW-CHECKER-CLEANUP-1 --complete` before PR publication.
13. Publish a draft PR from this branch.
14. Run the PR Readiness Reviewer against the exact remote PR head. Apply
    material suggestions and repeat until the PR workflow lead review and
    readiness route are clean.
15. Present the PR for human review with exact head SHA, checker proof, lead
    review proof, PR readiness route, and branch-protection output.

Decision points:

- If a checker was written for a historical claim that is no longer meaningful
  after the source split, do not force it green by deleting assertions. Either
  revise it to prove the current equivalent boundary or record that it is
  superseded by a current checker.
- If any fix would require source-data mutation, generated lesson output, or
  engine behavior changes, stop and replan.
- If active JSON and markdown disagree, prefer current live files and
  validators over old prose.

Stop conditions:

- Stop if a proposed repair changes `source-data/`, engines, generated lesson
  output, protected references, target registries, or product-route authority.
- Stop if a validator can pass while citing a missing current evidence file.
- Stop if the PR Readiness Reviewer routes this as human review and exact-head
  evidence is stale.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-WORKFLOW-CHECKER-CLEANUP-1
node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js
node build-scripts/sprints/check-standard-exercises1-coverage.js
node build-scripts/sprints/check-task-shell-ux2.js
node build-scripts/sprints/check-l1-7b-q2-implementation.js
node build-scripts/sprints/check-l1-7b-q2-copy.js
node build-scripts/sprints/check-l1-7b-q2-d31-struct.js
node build-scripts/sprints/check-check-short-exit1-inventory.js
node build-scripts/sprints/check-math-ux2-route-output.js
node build-scripts/sprints/check-reason-ux2-route-output.js
node build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/sprints/check-sprint-command-log.js EXERCISE-WORKFLOW-CHECKER-CLEANUP-1
node build-scripts/sprints/check-lead-review-substance.js EXERCISE-WORKFLOW-CHECKER-CLEANUP-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-result.md
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-WORKFLOW-CHECKER-CLEANUP-1 --complete
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the baseline-failing checker commands pass or have a
documented current replacement; active JSON and gate-evidence checks use
existing split source paths; old unsuffixed source paths are not accepted as
current evidence; no source-data, engine, generated lesson output, protected
reference, target registry, product authority, or student/product-use change is
present; lead-review plan and implementation rounds return `PASS` or explicit
`OK`; the PR Readiness Reviewer inspects the exact remote head; and the PR is
presented for human review with exact-head proof.

## Rollback plan

Revert this branch before merge. Because the sprint is limited to checkers,
active evidence records, and sprint documentation, rollback should not require
lesson regeneration, source-data restoration, or engine rollback.

## Human review required

Human review is required before merge because the PR changes validation and
review-evidence behavior used by future exercise/check-surface workflows. The
PR Readiness Reviewer should route the PR according to the normal single-account
PR governance workflow after the draft PR exists. The plan JSON declares
`lead_review_phase: "before_human_gate"` so bundle validation and the
human-review route use the same lead-review requirement.
