# Sprint SCALE-PROOF-3P: Three-Paragraph Product Proof

Generated: 2026-06-12

## Goal

Produce rendered, student-facing proof for the first three paragraphs as one
coherent product path before any `GATE-PRODUCT-3P` review or Scale Gate 1
decision.

The proof must trace what a student can actually do in `1.1.1`, `1.1.2`, and
`1.1.3`: landing page, Start, Leer, Oefen, skill map, practice task with
source/context where relevant, advisory short check, target-equivalent exit
ticket, feedback, and next action.

## Context

`GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review` is closed
with carried flags. Its closure sequence required platform landing V2 PR #47
and lesson PR #12 to merge before this proof-production sprint starts. Both
landing V2 PRs have now merged.

This sprint starts proof production only. It does not start
`GATE-PRODUCT-3P`, does not close `CHECK-SHORT-EXIT-2`, and does not authorize
product-route adoption, new target-equivalent completion language,
diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Quality Standard

Quality floor: the proof must satisfy the stable product specification within
this evidence-production scope. Passing validators or source checks is not
enough. Evidence must inspect rendered output and student-facing behavior,
showing that the first three paragraphs form a usable route a student can
follow from landing page through the relevant practice and check surfaces.

The proof standard is a complete rendered student-path matrix, screenshot or
DOM evidence for each required route segment, structured proof JSON, a
deterministic checker, validation commands, and lead-review confirmation. Any
missing route segment or weak product requirement must be named as a follow-up
or blocker rather than carried as ordinary polish.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Treat `1.1.1`, `1.1.2`, and `1.1.3` as one product proof set. | Student-path matrix with all three paragraphs and common route segments. | Checker verifies every required paragraph/segment row exists. | planned |
| Inspect rendered student-facing landing V2 output after PR #47/#12. | Browser/DOM evidence from current generated lesson output. | Screenshots and DOM assertions prove V2 structure and route affordance. | planned |
| Trace Start, Leer, Oefen, skill map, and practice-task paths. | Links, route panels, first playable task, context/source evidence where relevant. | Screenshots/DOM and reviewer notes inspect the actual student path. | planned |
| Trace advisory short check and target-equivalent exit ticket status. | Evidence rows for each paragraph's short check, exit ticket, feedback, next action, and authority language. | Checker rejects missing surfaces, hidden fake links, or overclaiming language. | planned |
| Preserve product-boundary language. | Proof artifacts explicitly keep product-route adoption, new completion language, diagnostics, mastery/sequencing, PV, Scale Gate 1, and student/product use false. | Lead review uses REV-STD-1 finding classifications; core failures block closure. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a structured proof JSON plus checker instead of only markdown screenshots. | include_now | Needed so `GATE-PRODUCT-3P` cannot reinterpret incomplete evidence. |
| Include desktop, mobile, and dark-mode samples for the common route shell. | include_now | Landing V2 changed the route surface; proof must reflect current rendered output. |
| Build missing product surfaces while producing proof. | reject_scope_creep | This sprint records rendered proof and blockers; repairs belong to named implementation sprints. |
| Run the human readiness gate immediately after first screenshots exist. | defer_named_follow_up | `GATE-PRODUCT-3P` starts only after proof is complete and reviewed. |

## Allowed paths

- `reports/sprints/SCALE-PROOF-3P-plan.md`
- `reports/sprints/SCALE-PROOF-3P-baseline.md`
- `reports/sprints/SCALE-PROOF-3P-command-log.md`
- `reports/sprints/SCALE-PROOF-3P-student-path-matrix.md`
- `reports/sprints/SCALE-PROOF-3P-student-path-proof.md`
- `reports/sprints/SCALE-PROOF-3P-screenshot-manifest.md`
- `reports/sprints/SCALE-PROOF-3P-lead-review-assignment.md`
- `reports/sprints/SCALE-PROOF-3P-lead-review-round1.md`
- `reports/sprints/SCALE-PROOF-3P-lead-review-corrections.md`
- `reports/sprints/SCALE-PROOF-3P-lead-review-round2.md`
- `reports/sprints/SCALE-PROOF-3P-result.md`
- `reports/sprints/SCALE-PROOF-3P-diff-summary.md`
- `reports/sprints/SCALE-PROOF-3P-screenshots/`
- `reports/json/scale-proof-3p-proof.json`
- `references/data/sprints/SCALE-PROOF-3P.plan.json`
- `references/data/sprints/SCALE-PROOF-3P.result.json`
- `build-scripts/sprints/check-scale-proof-3p.js`
- generated repository-map, URL-index, and dashboard artifacts if those indexes change
- roadmap status updates that only clarify proof-production status and preserve all downstream blocks

## Forbidden paths

- No generated lesson output changes.
- No hand edits to generated lesson output.
- No engine, task-shell, route, CSS, source-data, or lesson-content repairs.
- No source exit-ticket data writes.
- No edits under `references/machine/` or `references/external/`.
- No target-exercise registry writes.
- No candidate storage creation or candidate writes.
- No `GATE-PRODUCT-3P` review packet or gate-closure artifacts.
- No Scale Gate 1 artifacts.
- No product-route adoption, new target-equivalent completion language,
  diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use.

## Inputs

- `specifications/product-end-state.md` in the lesson repository
- `specifications/companion-core-specifications.md` in the lesson repository
- `specifications/paragraph-landing-layout-v2.md` in the lesson repository
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.md`
- the paired structured closure artifact in the same gate-closure folder
- Current platform main after PR #47: `5147c9efb22fdee11721bea47dff37d271850f29`
- Current lesson main after PR #12: `8b007cd86a485518bca8881051e11f5272f162c7`
- Generated Book 1 paragraph output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- Prior route proof artifacts for skill map, graph, math, reasoning, and check surfaces

## Outputs

- A rendered first-three student-path matrix.
- Screenshot and DOM evidence for the required path segments.
- `reports/json/scale-proof-3p-proof.json`.
- `build-scripts/sprints/check-scale-proof-3p.js`.
- Sprint command log, lead-review records, result, diff summary, and result metadata.
- A clear blocker list for any missing core product requirement.

## Operationalized sprint procedure

1. Record the post-merge baseline and worktree claim.
2. Build a student-path matrix with required rows for `1.1.1`, `1.1.2`, and `1.1.3`.
3. Serve the current lesson output read-only and capture rendered proof for landing V2 and the required route segments.
4. Capture practice-task evidence for skill map, graph, math, and reasoning routes where relevant.
5. Capture advisory short-check and exit-ticket evidence, including feedback, next action, and authority language.
6. Emit structured proof JSON and add a checker that validates required evidence, forbidden overclaims, and missing-surface blockers.
7. Run validation commands and record them in the command log.
8. Run lead review with REV-STD-1 finding classifications before any closure claim.
9. Stop and report if any core route segment is missing or if proof would require implementation repair.

Decision points:

- If a route segment is missing, record it as `core_spec_failure` or `scale_blocker` according to its authority impact; do not hide it as polish.
- If proof reveals a stale artifact after landing V2, refresh only proof evidence, not generated lesson output.
- If proof requires changing a student-facing surface, stop and route the repair to a named implementation sprint.

Stop conditions:

- Stop if the work would require source-data, engine, generated-output, or protected-reference changes.
- Stop if a proof artifact implies product-route adoption or Scale Gate 1 authority.
- Stop if `GATE-PRODUCT-3P` would be started before `SCALE-PROOF-3P` evidence is complete and lead-reviewed.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SCALE-PROOF-3P-plan.md
node build-scripts/sprints/check-sprint-bundle.js SCALE-PROOF-3P
node build-scripts/sprints/check-scale-proof-3p.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/SCALE-PROOF-3P-result.md
node build-scripts/sprints/check-sprint-bundle.js SCALE-PROOF-3P --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: rendered student-facing evidence exists for every
required route segment across `1.1.1`, `1.1.2`, and `1.1.3`; structured proof
JSON and checker pass; lead review returns PASS or PASS WITH FLAGS with no
`core_spec_failure`; all missing requirements are recorded as blockers or named
follow-up work; and no forbidden source, generated-output, protected-reference,
product-authority, `GATE-PRODUCT-3P`, or Scale Gate 1 artifact is changed.

## Rollback plan

This sprint writes proof artifacts only. If the proof-production branch is
wrongly scoped, abandon the branch and keep platform and lesson `main` at the
already-merged PR #47/#12 state. No generated lesson output or product source
should need rollback.

## Human review required

No direct human gate is opened by this sprint. Lead review is required before
`SCALE-PROOF-3P` can close. `GATE-PRODUCT-3P` remains the later human product
readiness review and must not start until this proof packet is complete.
