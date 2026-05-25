# Sprint SYNC-2: Exit-Ticket And Scale-Gate Roadmap Precision

## Goal

Clarify the cross-repo roadmap state for the exit-ticket path and Scale Gate 1
without implementing product code, importing the prototype, mutating protected
references, or generating lesson output.

SYNC-2 must make the current state explicit:

- the exit-ticket contract is done;
- the exit-ticket MVP implementation remains paused;
- a boundary-safe MVP resume path is still required;
- a product-boundary human review gate is still required;
- platform support belongs in a future source-controlled checkpoint-engine
  lane, not a lesson-side one-off;
- Scale Gate 1 must not treat the contract as equivalent to a safe checkpoint
  surface.

## Context

The lesson roadmap already records L1.7A, L1.7B, L1.7C-0, L1.7C, and L1.7D
progress, but the single L1.7B row combines completed contract work with paused
implementation work. That ambiguity can make "after L1.7B" look complete when
only the contract is complete.

The platform roadmap tracks lesson pre-scale gates through `LESSON-SCALE-1` and
already has `GAME-UX-1` closed for the shared skill-map runtime. It does not yet
name the future exit-ticket checkpoint engine support lane clearly enough.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. SYNC-2 must not stage, edit, move,
extract, or delete that file.

## Allowed paths

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.76-ex5-operation-answer-skill-contract.md`
- `reports/sprints/SYNC-2-plan.md`
- `references/data/sprints/SYNC-2.plan.json`
- `reports/sprints/SYNC-2-baseline.md`
- `reports/sprints/SYNC-2-planning-review.md`
- `reports/sprints/SYNC-2-result.md`
- `reports/sprints/SYNC-2-diff-summary.md`
- `reports/sprints/SYNC-2-lead-review-assignment.md`
- `reports/sprints/SYNC-2-lead-review-round1.md`
- `reports/sprints/SYNC-2-lead-review-corrections.md`
- `reports/sprints/SYNC-2-lead-review-round2.md`
- `references/data/sprints/SYNC-2.result.json`
- `../4veco-lessen/lessen-team-roadmap.md`

Generated output statement: SYNC-2 creates planning and roadmap records only.
It generates no student-facing lesson output.

## Forbidden paths

- `knowledge/exit-ticket-game-1.1.1.zip`
- hand edits to generated lesson output under `../4veco-lessen/Boek*/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/data/skill-operation-registry.json`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
- operation-registry mutation or answer-skill mutation
- q19 source-annex or graph-object extraction execution
- target-exercise promotion
- lesson-output mutation
- CP-6 closure or Year-1 closure
- diagnostics, adaptive routing, mastery, automatic sequencing, student-facing
  AI, summative use, PV projection, PV machine promotion, or student-facing
  product use

## Inputs

- The user-provided roadmap review report for exit-ticket and Scale Gate 1
  precision.
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/L1.7B/`
- `../4veco-lessen/archive/sprints/L1.7C/`
- `../4veco-lessen/archive/sprints/L1.7D/`

## Outputs

- Platform roadmap version `v2.77-exit-ticket-scale-gate-precision`.
- Roadmap version-index update plus an archived v2.76 snapshot.
- Platform `GAME-UX-2` future support row for the exit-ticket checkpoint engine
  MVP.
- Updated `LESSON-SCALE-1`, `Product Gate`, critical-path, and immediate-next
  text so L1.7B-C and L1.7B-R are not conflated.
- Lesson roadmap split from L1.7B into `L1.7B-C` and `L1.7B-R`.
- Lesson-side `GATE-L1.7B` row.
- Revised lesson Scale Gate 1 prerequisites and L2.0 expectations.
- SYNC-2 sprint plan, baseline, planning review, result, diff, lead-review
  logs, and JSON metadata.

## Operationalized sprint procedure

1. Record the SYNC-2 plan, plan JSON, baseline, and planning-review log. Stop
   if the requested work would require importing the exit-ticket prototype,
   generating lesson output, or touching protected reference data.
2. Verify current roadmap state in both repositories. Stop if L1.7B is already
   split, if Scale Gate 1 already names the required safe MVP and review gate,
   or if the platform already has a future checkpoint-engine support lane.
3. Patch the lesson roadmap so L1.7B-C is the closed contract-only outcome and
   L1.7B-R is the future boundary-safe implementation resume. Add GATE-L1.7B,
   revise L2.0, and revise Scale Gate 1. Stop if wording implies student-facing
   use, mastery, diagnostics, adaptive routing, summative use, or output
   mutation.
4. Patch the platform roadmap and version index. Add GAME-UX-2 as future
   platform support, revise LESSON-SCALE-1 and Product Gate, add the SYNC-2
   closed sprint row, and keep GATE-EX5 as the immediate active human review.
   Stop if the order makes GAME-UX-2 active ahead of the required lesson or
   reference gates.
5. Run acceptance validators for sprint metadata, roadmap versioning, and repo
   hygiene. Review the diff for stale "after L1.7B" ambiguity.
6. Record lead-review assignment, round-1 review, correction log, and recheck.
   Stop if final lead review is not PASS or PASS WITH FLAGS.
7. Commit and push both repositories separately. Keep the untracked prototype
   file unstaged and untouched.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SYNC-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js SYNC-2
node build-scripts/sprints/check-sprint-bundle.js SYNC-2 --complete
node build-scripts/references/check-roadmap-version-index.js
git diff --check
```

Run an additional lesson-roadmap ambiguity scan from `../4veco-lessen`:

```bash
rg -n "L1\.7B|after L1\.7B|Scale Gate 1|GATE-L1\.7B|GAME-UX-2" lessen-team-roadmap.md
git diff --check
```

## Rollback plan

Revert the SYNC-2 commits in both repositories. Rollback removes only roadmap
precision text, the platform roadmap v2.77 index update, the v2.76 snapshot,
and SYNC-2 sprint logs.

Do not manually patch `references/machine/`, `references/external/`,
`references/data/skill-operation-registry.json`, authored target exercises,
owned blueprint sources, generated lesson output, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.

## Human review required

No human-review gate is completed by SYNC-2. The sprint records roadmap
precision only.

Future human review is still required for `GATE-EX5` on the platform side and
for lesson-side `GATE-L1.7B` after a boundary-safe exit-ticket MVP exists.
