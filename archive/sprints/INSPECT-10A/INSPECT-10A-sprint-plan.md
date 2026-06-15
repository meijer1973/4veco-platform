# Sprint INSPECT-10A: Diagnostic Report Generator Implementation Plan

Status: draft for planning review
Date: 2026-06-15
Sprint: `INSPECT-10A`
Branch: `codex/inspect-10a-diagnostic-generator-implementation-plan-20260615`
Platform worktree: `C:\Projects\4veco-worktrees\INSPECT-10A-20260615\4veco-platform`
Lesson evidence checkout: `C:\Projects\4veco\4veco-lessen` read-only fallback for evidence/indexing
Base commit: `27e686b11a7f33d254ffe680331b5c00de8ff474`

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
- Accepted diagnostic-planning packet:
  `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md`
  and
  `archive/sprints/INSPECT-10/INSPECT-10R-three-reviewer-gate-results.md`
- Current controlling authority:
  `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
  section `INSPECT-10 Posture`
- Sprint ledger:
  `docs/roadmaps/quality-standards/sprint-ledger.md`
- REV-STD-1 disposition:
  `reports/sprints/REV-STD-1-flag-disposition.md`

## Goal

Create an INSPECT-10A implementation-plan packet for a future internal Dutch
diagnostic report generator.

This sprint resolves procedural ambiguity after INSPECT-10R by defining exact
source files a later generator may read, exact output files a later
implementation may write, the blocker-visible output contract, refusal and
stop conditions, and a sample internal diagnostic output shape.

This sprint does not implement a generator. It does not generate a diagnostic
report, evidence pack, teacher/school-facing pack, public-facing output,
external-facing output, package script, CI gate, dashboard gate, quality-ref
integration, Scale Gate integration, lesson-output mutation, diagnostics,
mastery, PV, product-route adoption, or student/product-use authority.

## Context

PR #66 merged INSPECT-10 after the INSPECT-10R three-reviewer gate returned
`MORE_THAN_SATISFIED` for teacher, legal/privacy, and Dutch
quality-inspection roles after the public/external output correction.

The accepted INSPECT-10 packet authorises only a later diagnostic-only,
blocker-visible follow-up. It does not authorise the original INSPECT-10
first-implementation scope. The remaining ambiguity is procedural: a future
implementation sprint needs a narrow allowlist and refusal contract so
reviewers can tell what implementation would do without treating diagnostic
planning as pack-strength evidence generation.

Active blockers carried into INSPECT-10A:

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
  work until renewed human review confirms closure.
- Public-facing or external-facing generated output/report/sharing remains
  blocked unless a later human review gate explicitly authorises that surface.

## Quality Standard

The quality floor is specification fidelity: the implementation plan must cite
the product end-state, operational product end-state, original INSPECT-10
specification, accepted INSPECT-10R gate result, and current blocker posture
without pretending that implementation is complete.

There is no rendered output and no student-facing artifact in this sprint.
That absence is intentional and must be explicit in the proof. The packet must
state that no generated diagnostic report, evidence pack, teacher/school-
facing pack, public/external generated output, lesson output, dashboard gate,
quality-ref integration, Scale Gate integration, diagnostics, mastery, PV, or
product-use authority is created.

The proof required to close this sprint is a reviewable Markdown and JSON
implementation-plan packet with:

- product end-state and original sprint/gate spec citations;
- named non-negotiable requirements;
- a core-requirement checklist;
- finding classifications using REV-STD-1 values;
- `blocks`, `does_not_block`, and `proof_required_to_close` for every carried
  issue;
- exact future source-file allowlist and future output-file allowlist;
- refusal/stop conditions for unsafe input, output, or requested authority;
- a static sample output shape that is clearly not generated evidence;
- a decision on whether future implementation is safe or whether remediation
  must happen first.

Any omitted full INSPECT-10 implementation requirement must be named as a
blocker or follow-up, not hidden as a flag.

## Non-Negotiable Requirements

- Dutch scope only.
- Implementation-plan packet only.
- No generator implementation in INSPECT-10A.
- No generated diagnostic report in INSPECT-10A.
- No evidence-pack generation.
- No teacher/school-facing evidence-pack generation.
- No public-facing or external-facing generated output, report, or sharing
  without a later human review gate.
- No generated lesson-output mutation in `../4veco-lessen`.
- No source-registry mutation.
- No `references/machine/` or `references/external/` mutation.
- No package script, CI/build gate, dashboard gate, quality-ref integration, or
  Scale Gate integration.
- No product-route adoption, diagnostics, mastery/sequencing, PV, or
  student/product-use authority.
- No personal-data processing.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.
- PASS WITH FLAGS may not carry a missing core requirement.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Cite product end-state and original INSPECT-10 spec | Plan and report cite quality-control end state, operational product end state, product vision, original INSPECT-10 row, and INSPECT-10R result | Planning review and lead review verify citations | planned |
| Preserve INSPECT-10R authority limit | Report states INSPECT-10A is implementation planning only and not generator code | Finding classification records what this blocks and does not block | planned |
| Name exact future source files | Report and JSON define a source-file allowlist for later implementation | Lead review checks no broad lesson-output or protected-reference read authority is implied | planned |
| Name exact future output files | Report and JSON define a write allowlist for later implementation | Lead review checks no evidence-pack, teacher/school-facing, public/external, package/CI/dashboard/quality-ref/Scale Gate output is included | planned |
| Keep Chapter 1.2 blockers visible | Report carries `1.2.2`, `1.2.4`, accessibility/support, check-surface, and public/external blockers | JSON required-field check for `blocks`, `does_not_block`, `proof_required_to_close` | planned |
| Define refusal/stop conditions | Report defines hard stops for unsafe input/output requests, missing citations, hidden blockers, personal data, and authority expansion | Lead review checks each stop condition has owner action and proof requirement | planned |
| Include sample diagnostic shape | Report includes static internal-only sample output shape with blockers visible | Validation confirms the sample is marked non-generated and non-authoritative | planned |
| Avoid rendered/student-facing output | No generated report, lesson output, or evidence pack is produced | Git diff and validation logs prove no lesson checkout mutation and no generator output | planned |
| Preserve REV-STD-1 | Findings use allowed classifications and no PASS WITH FLAGS carries a missing core requirement | Lead review and JSON validation | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add exact future source-file allowlist | include_now | Required to resolve procedural ambiguity without implementing the generator |
| Add exact future output-file allowlist | include_now | Required before any later implementation sprint can be reviewed safely |
| Add refusal and stop-condition codes | include_now | Keeps future generated output blocker-visible and non-authoritative |
| Add a static diagnostic output shape sample | include_now | Helps reviewers inspect the future surface without generating a report |
| Implement the diagnostic report generator now | reject_scope_creep | INSPECT-10A is planning only |
| Add package or CI command for diagnostic generation | reject_scope_creep | Separate implementation and integration approval required |
| Generate Chapter 1.2 evidence pack or teacher/school-facing pack | reject_scope_creep | Pack-strength and teacher/school-facing work remain blocked |
| Produce public-facing or external-facing generated report sharing | reject_scope_creep | Public/external output requires later human review authority |
| Define reusable JSON schema for all future Dutch diagnostic reports | defer_named_follow_up | Useful later, but this sprint should keep to implementation-plan specificity |

## Allowed paths

Allowed:

- create `archive/sprints/INSPECT-10A/INSPECT-10A-sprint-plan.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-planning-review.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-validation-log.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-lead-review-assignment.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-lead-review-round1.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-correction-log.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-lead-review-round2.md`;
- create `archive/sprints/INSPECT-10A/INSPECT-10A-closure-log.md`;
- create
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.md`;
- create
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.json`;
- update `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`,
  `docs/roadmaps/quality-standards/sprint-ledger.md`,
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`,
  `docs/roadmaps/roadmap-version-index.md`, and
  `docs/roadmaps/roadmap-version-index.json` to record the implementation-plan
  outcome and next action;
- refresh generated repository maps/indexes after final artifacts are staged.

## Forbidden paths

Forbidden:

- editing `../4veco-lessen`;
- editing `references/authored/course-target-exercises.json`;
- editing `references/machine/`;
- editing `references/external/`;
- creating or editing `build-scripts/inspection/build-dutch-evidence-pack.js`;
- creating a diagnostic generator script in INSPECT-10A;
- generating diagnostic reports or evidence packs in INSPECT-10A;
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
- `archive/sprints/INSPECT-10/INSPECT-10R-three-reviewer-gate-results.md`
- `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md`
- `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`
- `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md`
- `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json`
- `reports/inspection-standards/dutch-evidence-scale-readiness.json`
- `reports/inspection-standards/dutch-evidence-gap-closure-plan.json`
- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json`
- `docs/inspection-standards/report-only-generator-plan.md`
- `docs/inspection-standards/evidence-pack-source-contract.md`
- `docs/inspection-standards/report-only-validator-design.md`

## Outputs

- INSPECT-10A sprint plan and planning review.
- INSPECT-10A implementation-plan report in Markdown and JSON.
- INSPECT-10A validation log.
- INSPECT-10A lead-review assignment, round-1 review, correction log, and
  round-2 recheck.
- INSPECT-10A closure log.
- Updated quality-standards roadmap, ledger, end-state, and roadmap-version
  index notes.
- Refreshed repository indexes/dashboard if roadmap/report paths change.

## Operationalized sprint procedure

1. Confirm worktree safety with the INSPECT-10A task lock and confirm the
   platform branch starts from current `origin/main`.
2. Read the product end-state, strategic vision, quality-control end-state,
   original INSPECT-10 roadmap row, INSPECT-10R result, INSPECT-10 diagnostic
   planning packet, REV-STD-1 disposition, and Chapter 1.2 blocker reports.
3. Create this plan before producing implementation-plan content. Stop if the
   plan would authorise generator implementation, generated reports,
   evidence-pack generation, lesson-output mutation, protected reference
   mutation, public/external-facing generated output or sharing, or hidden
   blockers.
4. Run planning review against the roadmap, INSPECT-10R authority, core
   requirements, allowed paths, forbidden paths, and REV-STD-1 carry fields.
   Stop before implementation-plan authoring if planning review finds a
   missing core requirement.
5. Build the Markdown and JSON implementation-plan report. The report must
   define exact future source files, exact future output files, blocker-visible
   fields, refusal/stop conditions, sample internal output shape, authority
   boundaries, and decision status.
6. Update roadmap, ledger, end-state, and version-index documents only to
   record the implementation-plan state and next action. Stop if an update
   would mark Chapter 1.2 pack-ready, imply generator implementation is
   complete, or imply public/external, teacher/school-facing, Scale Gate,
   product-route, diagnostics/mastery/PV, or student/product-use authority.
7. Validate JSON parse, required fields, safe-claim wording, forbidden-change
   surfaces, lesson checkout cleanliness, roadmap version index, URL index,
   generated indexes/dashboard, and selected platform checks for this
   documentation/report scope.
8. Run lead review. If round 1 returns `REVISE`, record corrections and re-run
   the needed validation before another review. If a missing core requirement
   remains, do not close as PASS WITH FLAGS.
9. Close only as an implementation-plan packet ready for human review. Commit,
   push, and open a PR so off-site reviewers can inspect the packet.

## Acceptance tests

Required validation:

```bash
npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-10A-20260615 --agent codex --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-10A/INSPECT-10A-sprint-plan.md
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run agent:index
npm.cmd run dashboard:internal
git diff --check origin/main...HEAD
npm.cmd run check:platform
```

Repository sprint-bundle policy reference:

```bash
node build-scripts/sprints/check-sprint-bundle.js INSPECT-10A
```

The current quality-standards track stores sprint packets in `archive/sprints/`
rather than the newer `reports/sprints/` bundle layout, so the bundle checker
is not applicable unless a later migration creates the corresponding
`reports/sprints` and `references/data/sprints` bundle files.

Additional INSPECT-10A-specific checks:

- parse
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.json`;
- verify `generator_implemented` is `false`;
- verify `diagnostic_report_generated` is `false`;
- verify `evidence_pack_generated` is `false`;
- verify `teacher_school_pack_generated` is `false`;
- verify `public_external_facing_output_generated` is `false`;
- verify `implementation_allowed_by_this_packet` is `false`;
- verify source and output allowlists are non-empty and exact;
- verify refusal/stop-condition records include owner action and proof needed;
- verify carried findings include `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- verify no changed file is under `../4veco-lessen`, `references/machine/`,
  `references/external/`, package scripts, CI workflow files, quality-ref
  files, or Scale Gate integration surfaces.

## Proof Required to Close

Closure proof must include:

- Markdown and JSON implementation-plan report;
- planning review verdict;
- lead-review round-2 verdict;
- validation log with command, validator, and test evidence;
- clean protected-surface and lesson-output checks;
- refreshed repository indexes/dashboard if roadmap/report paths changed;
- a closure log stating that this sprint is implementation planning only and
  ready for human review, not generator implementation.

To close, reviewers must be able to inspect the review, validator, and test
evidence listed above.

## Rollback plan

If validation or review finds scope drift, remove the INSPECT-10A report and
roadmap/ledger updates from the branch or revise them back to
implementation-planning-only language. Do not revert unrelated `main` changes.
Do not touch lesson output or protected reference data during rollback.

## Human review required

Yes. This sprint prepares generator implementation planning, so the
quality-standards three-reviewer gate still applies before future
implementation:

- teacher reviewer: `MORE_THAN_SATISFIED`;
- legal/privacy reviewer: `MORE_THAN_SATISFIED`;
- Dutch quality-inspection reviewer: `MORE_THAN_SATISFIED`.

This branch may be opened for human review after lead review, validation,
push, and fresh PR CI. Human review must judge whether the source/output
allowlists and refusal contract are safe enough to authorise a later narrow
internal diagnostic generator implementation sprint.
