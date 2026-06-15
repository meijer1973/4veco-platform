# Sprint INSPECT-10: Dutch Report-Only Generator Diagnostic Planning

Status: draft for planning review
Date: 2026-06-15
Sprint: `INSPECT-10`
Branch: `codex/inspect-10-diagnostic-generator-planning-20260615`
Platform worktree: `C:\Projects\4veco-worktrees\INSPECT-10-20260615\4veco-platform`
Lesson evidence checkout: `C:\Projects\4veco\4veco-lessen` read-only fallback for evidence/indexing
Base commit: `d4b74dd54f9a1756e42077f73c89dee6465f1cac`

## Baselines

- Product end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Strategic product vision:
  `../4veco-lessen/specifications/product-vision.md`
- Original roadmap sprint specification:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
  section `INSPECT-10 - Dutch Report-Only Generator First Implementation`
- Current controlling authority:
  `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
  section `INSPECT-10 Posture`
- Sprint ledger:
  `docs/roadmaps/quality-standards/sprint-ledger.md`
- REV-STD-1 disposition:
  `reports/sprints/REV-STD-1-flag-disposition.md`

## Goal

Create a diagnostic-only INSPECT-10 planning packet for a future Dutch
report-only generator surface.

This sprint does not implement the generator named in the original INSPECT-10
roadmap row. The post-INSPECT-9C authority narrows the current stack item to
planning only, with Chapter 1.2 blockers visible. The result must define what
a later generator may and may not do, which evidence it may ingest, how it must
display blockers, and what proof is required before pack-strength or
teacher/school-facing evidence-pack work can start.

## Context

INSPECT-9C was accepted and merged through PR #59. It records route-local proof
status for `1.2.1` through `1.2.4`, but it does not clear Chapter 1.2 for
pack-strength evidence generation.

The active blockers carried into this sprint are:

- `1.2.2` generated-output substitute-mechanism wording constrains clean proof
  closure.
- `1.2.4` frozen-yoghurt substitute-mechanism wording constrains clean
  integrated proof closure.
- `1.2.4` has an orphaned-asset note that blocks clean asset-strength claims.
- Chapter 1.2 accessibility evidence remains below pack-strength.
- Chapter 1.2 support, companion/advisory, and next-action evidence remains
  below pack-strength.
- Check-surface gate authority remains separate and blocks Scale Gate 1,
  product-route adoption, diagnostics/mastery/PV, and student/product-use
  work until renewed human review closes that authority.

## Quality Standard

The quality floor is specification fidelity: the packet must preserve the
Dutch quality-control end state, the original INSPECT-10 implementation
specification, and the post-INSPECT-9C restriction without pretending that a
smaller planning step fulfills the full generator requirement.

There is no rendered output and no student-facing artifact in this sprint.
That absence is intentional and must be explicit in the proof. The packet must
state that no generated evidence pack, teacher/school-facing pack, lesson
output, dashboard gate, quality-ref integration, Scale Gate integration,
diagnostics, mastery, PV, or product-use authority is created.

The proof required to close this sprint is a reviewable Markdown and JSON
planning packet with:

- product end-state and original sprint/gate spec citations;
- named non-negotiable requirements;
- a core-requirement checklist;
- finding classifications using REV-STD-1 values;
- `blocks`, `does_not_block`, and `proof_required_to_close` for every carried
  issue;
- a clear follow-up path for future implementation and human review.

Any omitted full INSPECT-10 implementation requirement must be named as a
blocker or follow-up, not hidden as a flag.

## Non-Negotiable Requirements

- Dutch scope only.
- Planning packet only.
- No generator implementation.
- No evidence-pack generation.
- No teacher/school-facing evidence-pack generation.
- No generated lesson-output mutation in `../4veco-lessen`.
- No source-registry mutation.
- No `references/machine/` or `references/external/` mutation.
- No package script, CI/build gate, dashboard gate, quality-ref integration, or
  Scale Gate integration.
- No product-route adoption, diagnostics, mastery/sequencing, PV, or
  student/product-use authority.
- No personal-data processing.
- No public-facing or external-facing generated output, report, or sharing
  without a later human review gate.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.
- PASS WITH FLAGS may not carry a missing core requirement.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Cite product end-state and original INSPECT-10 spec | Plan and report cite quality-control end state, operational product end state, product vision, and original INSPECT-10 row | Planning review and lead review verify citations | planned |
| Preserve post-9C authority limit | Report states original implementation outputs are blocked and current work is diagnostic planning only | Finding classification records what this blocks and does not block | planned |
| Keep Chapter 1.2 blockers visible | Report carries `1.2.2`, `1.2.4`, accessibility/support, and check-surface blockers | JSON required-field check for `blocks`, `does_not_block`, `proof_required_to_close` | planned |
| Define future diagnostic generator contract | Report defines allowed inputs, output vocabulary, blocker display, safe claims, and stop conditions | Lead review checks no pack-ready or teacher/school-facing language is introduced | planned |
| Avoid rendered/student-facing output | No generated lesson output or evidence pack is produced | Git diff and validation logs prove no lesson checkout mutation and no generator output | planned |
| Preserve REV-STD-1 | Findings use allowed classifications and no PASS WITH FLAGS carries a missing core requirement | Lead review round 2 and JSON validation | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Define a reusable blocker status vocabulary for later generator implementation | include_now | Useful planning output without implementing generator code |
| Add a future source-object schema for diagnostic generator inputs | defer_named_follow_up | Needs human review and may become implementation design in a later sprint |
| Generate a Chapter 1.2 evidence pack from the 9C records | reject_scope_creep | Pack-strength Chapter 1.2 generation is blocked |
| Add package or CI command for report generation | reject_scope_creep | Separate approval required |
| Produce teacher/school-facing first-screen pack copy | reject_scope_creep | Teacher/school-facing pack work requires later review authority |
| Produce public-facing or external-facing generated reports or sharing | reject_scope_creep | Public/external-facing output requires later human review authority |

## Allowed paths

Allowed:

- create `archive/sprints/INSPECT-10/INSPECT-10-sprint-plan.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-planning-review.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-validation-log.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-lead-review-assignment.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-lead-review-round1.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-correction-log.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-lead-review-round2.md`;
- create `archive/sprints/INSPECT-10/INSPECT-10-closure-log.md`;
- create `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md`;
- create `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json`;
- update `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`,
  `docs/roadmaps/quality-standards/sprint-ledger.md`, and
  `docs/roadmaps/quality-standards/quality-standards-end-state.md` to record
  the planning-only outcome and next action;
- refresh generated repository maps/indexes after final artifacts are staged.

## Forbidden paths

Forbidden:

- editing `../4veco-lessen`;
- editing `references/authored/course-target-exercises.json`;
- editing `references/machine/`;
- editing `references/external/`;
- creating or editing `build-scripts/inspection/build-dutch-evidence-pack.js`;
- generating evidence packs;
- adding package scripts;
- adding CI/build/dashboard gates;
- integrating quality-ref or Scale Gate;
- changing source-profile semantics;
- refreshing broad generated reports outside the planned packet and required
  repository indexes;
- processing personal data;
- producing public-facing or external-facing generated output, reports, or
  sharing without a later human review gate;
- starting non-Dutch standards work;
- claiming compliance, approval, inspection readiness, complete OP0, PTA
  validity, summative validity, school-obligation closure, school-SKA closure,
  diagnostics, mastery, PV, product-route adoption, or student/product use.

## Inputs

- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/product-vision.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `reports/sprints/REV-STD-1-flag-disposition.md`
- `reports/inspection-standards/dutch-evidence-scale-readiness.md`
- `reports/inspection-standards/dutch-evidence-gap-closure-plan.md`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md`
- `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`
- `docs/inspection-standards/report-only-generator-plan.md`
- `docs/inspection-standards/report-only-validator-design.md`

## Outputs

- INSPECT-10 sprint plan and planning review.
- INSPECT-10 diagnostic planning report in Markdown and JSON.
- INSPECT-10 validation log.
- INSPECT-10 lead-review assignment, round-1 review, correction log, and
  round-2 recheck.
- INSPECT-10 closure log.
- Updated quality-standards roadmap, ledger, and end-state notes.
- Refreshed repository indexes/dashboard if roadmap/report paths change.

## Operationalized sprint procedure

1. Confirm worktree safety with the INSPECT-10 task lock and confirm the
   platform branch starts from current `origin/main`.
2. Read the product end-state, strategic vision, quality-control end-state,
   original INSPECT-10 roadmap row, INSPECT-9C output, REV-STD-1 disposition,
   and report-only generator/validator design docs.
3. Create this plan before producing report content. Stop if the plan would
   authorize generator implementation, evidence-pack generation, lesson-output
   mutation, protected reference mutation, public/external-facing generated
   output or sharing, or any hidden blocker.
4. Run planning review against the roadmap, post-9C authority, core
   requirements, allowed paths, forbidden paths, and REV-STD-1 carry fields.
   Stop before implementation if planning review finds a missing core
   requirement.
5. Build the Markdown and JSON diagnostic planning report. The report must
   define future generator input posture, output status vocabulary, blocker
   display rules, public/external sharing boundaries, safe-use language,
   human-review questions, and exact stop conditions.
6. Update roadmap, ledger, and end-state documents only to record the
   planning-only state and next action. Stop if an update would mark Chapter
   1.2 pack-ready or imply INSPECT-10 implementation is complete.
7. Validate JSON parse, required fields, safe-claim wording, forbidden-change
   surfaces, lesson checkout cleanliness, roadmap version index, URL index,
   generated indexes/dashboard, and platform tests selected for this
   documentation/report scope.
8. Run lead review. If round 1 returns `REVISE`, record corrections and re-run
   the needed validation before round 2. If a missing core requirement remains,
   do not close as PASS WITH FLAGS.
9. Close only as a planning packet ready for human review. Commit, push, and
   open a PR so off-site reviewers can inspect the packet.

## Acceptance tests

Required validation:

```bash
npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-10-20260615 --agent codex --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-10/INSPECT-10-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js INSPECT-10
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run agent:index
npm.cmd run dashboard:internal
git diff --check origin/main...HEAD
npm.cmd run check:platform
```

Additional INSPECT-10-specific checks:

- parse `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json`;
- verify `generator_implemented` is `false`;
- verify `evidence_pack_generated` is `false`;
- verify `chapter_1_2_pack_ready` is `false`;
- verify carried findings include `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- verify no changed file is under `../4veco-lessen`, `references/machine/`,
  `references/external/`, package scripts, CI workflow files, quality-ref
  files, or Scale Gate integration surfaces.

## Proof Required to Close

Closure proof must include:

- Markdown and JSON diagnostic planning report;
- planning review verdict;
- lead-review round 2 verdict;
- validation log with command, validator, and test evidence;
- clean protected-surface and lesson-output checks;
- refreshed repository indexes/dashboard if roadmap/report paths changed;
- a closure log stating that this sprint is planning-only and ready for human
  review, not generator implementation.

To close, reviewers must be able to inspect the review, validator, and test
evidence listed above.

## Rollback plan

If validation or review finds scope drift, remove the INSPECT-10 report and
roadmap/ledger updates from the branch or revise them back to planning-only
language. Do not revert unrelated `main` changes. Do not touch lesson output
or protected reference data during rollback.

## Human review required

Yes. This sprint prepares generator planning, so the quality-standards
three-reviewer gate still applies before future implementation:

- teacher reviewer: `MORE_THAN_SATISFIED`;
- legal/privacy reviewer: `MORE_THAN_SATISFIED`;
- Dutch quality-inspection reviewer: `MORE_THAN_SATISFIED`.

This branch may be opened for human review after lead review, validation, push,
and fresh PR CI. Human review must judge whether the diagnostic-only planning
contract preserves blockers visibly enough to allow a later implementation
planning or implementation sprint.
