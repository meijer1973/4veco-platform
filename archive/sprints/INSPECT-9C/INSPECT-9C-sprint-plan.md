# INSPECT-9C Sprint Plan

Status: draft for planning review
Date: 2026-06-14
Sprint: `INSPECT-9C`
Branch: `codex/inspect-9c-proof-support-closure-20260614`
Platform worktree: `C:\wt\INSPECT-9C-20260614\4veco-platform`
Lesson evidence checkout: `C:\wt\INSPECT-9C-20260614\4veco-lessen`
Base commit: `8872c43a5961950078b82e422ace21d56ba34bd7`
Lesson evidence commit: `8b007cd86a485518bca8881051e11f5272f162c7`

## Baselines

- Product end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original roadmap sprint specification:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
  section `INSPECT-9C - Chapter 1.2 Proof And Support Remediation`
- Sprint ledger:
  `docs/roadmaps/quality-standards/sprint-ledger.md`
- REV-STD-1 disposition:
  `reports/sprints/REV-STD-1-flag-disposition.md`
- INSPECT-9B input report:
  `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md`
- INSPECT-9A source-registry input:
  `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md`

## Goal

Close or explicitly carry the Chapter 1.2 blockers found by INSPECT-9B before
any Chapter 1.2 report-only generator work.

The sprint creates platform-side proof/remediation records for target
equivalence, minimum accessibility evidence, and support/differentiation
evidence. It does not repair generated lesson output.

## Non-Negotiable Requirements

- Dutch scope only.
- Proof/remediation packet only.
- No evidence-pack generation.
- No report-only generator implementation.
- No generated lesson-output mutation in `../4veco-lessen`.
- No source-registry mutation.
- No package script, CI/build gate, dashboard gate, quality-ref integration, or
  Scale Gate integration.
- No product-route adoption, diagnostics, mastery/sequencing, PV, or
  student/product-use authority.
- No personal-data processing.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.
- PASS WITH FLAGS may not carry a missing core requirement.

## Core Requirements

| Core requirement | Required result |
|---|---|
| Product end-state cited | Report cites the Dutch quality-control end state and stays within product-side evidence support. |
| Original sprint/gate spec cited | Report cites the INSPECT-9C roadmap row and this sprint plan. |
| Target proof status for `1.2.1` through `1.2.4` | Each target has a reviewed proof status or an explicit carried blocker. |
| Proof comparison | Each target records operation-chain match, answer-form match, scaffold/no-answer-before-attempt boundary, local-only authority, and exact flags to fix or carry. |
| Accessibility proof | Mobile/responsive, contrast/theme, semantic/PDF, keyboard/focus applicability, text equivalents, and internal-code/inclusive-language status are recorded. |
| Support proof | Hints/repair, companion/advisory route, next-action evidence, differentiation/enrichment, and product/school support boundary are recorded. |
| Generated-output flags | `1.2.2` local answer/substitute issue, `1.2.4` frozen-yoghurt wording, and `1.2.4` orphaned-asset note are fixed under explicit authority or carried as blockers. |
| INSPECT-10 posture | Report states whether Chapter 1.2 remains blocked, may proceed only as diagnostic-only generator input with blockers visible, or may proceed as pack-strength input. |
| REV-STD-1 carry fields | Carried findings include `blocks`, `does_not_block`, and `proof_required_to_close`. |

## Allowed File Changes

Allowed:

- create `archive/sprints/INSPECT-9C/INSPECT-9C-sprint-plan.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-planning-review.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-validation-log.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-lead-review-assignment.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-lead-review-round1.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-correction-log.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-lead-review-round2.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-closure-log.md`;
- create `archive/sprints/INSPECT-9C/INSPECT-9C-rev-std1-pr-refresh.md`;
- create `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`;
- create `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`;
- update the quality-standards roadmap, ledger, and end-state documents to
  record the INSPECT-9C outcome and next action;
- refresh generated repository maps/indexes after final artifacts are staged.

Forbidden:

- editing `../4veco-lessen`;
- editing `references/authored/course-target-exercises.json`;
- editing `references/machine` or `references/external`;
- generating evidence packs;
- implementing or modifying report-only generator code;
- adding or modifying package scripts;
- adding CI/build/dashboard gates;
- integrating quality-ref or Scale Gate;
- refreshing broad generated reports outside the planned packet;
- processing personal data;
- starting non-Dutch standards work.

## Procedure

1. Confirm platform worktree safety and read-only lesson evidence state.
2. Read roadmap, ledger, end-state, REV-STD-1 disposition, INSPECT-9A,
   INSPECT-9B, target registry, Chapter 1.2 lesson reviews, quality refs,
   rendered HTML signals, and chapter plan.
3. Create this sprint plan and planning review before implementation.
4. Build the Markdown and JSON proof/remediation report.
5. Record target proof status for `1.2.1` through `1.2.4`.
6. Record minimum accessibility and support/differentiation proof.
7. Classify every finding using REV-STD-1.
8. Update roadmap/ledger/end-state with the outcome and next operational step.
9. Validate JSON parse, required fields, path existence, safe-claim wording,
   forbidden file changes, lesson checkout cleanliness, and platform tests.
10. Run lead review, correction logging, round-2 review, closure logging, map
    refresh, commit, push, and PR creation.

## Stop Conditions

Stop and record a blocker if:

- lesson evidence checkout is dirty;
- a needed evidence file is missing and no conservative status can be assigned;
- a proposed conclusion would require generated-output mutation;
- proof would be inferred from ordinary opgaven presence without operation and
  answer-form comparison;
- the report begins to design generator behavior rather than only deciding the
  allowed or blocked INSPECT-10 posture;
- a source-registry mutation appears necessary;
- validation rewrites broad generated reports outside the packet;
- safe-claim scan finds restricted claim language.

## Acceptance Tests

Required:

- `npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-9C-20260614 --agent codex --require-prefix codex/,agent/`
- `npm.cmd run check:scope-language`
- JSON parse check for the INSPECT-9C report
- quality-log required-field check, including REV-STD-1 carry fields
- proof status check for all four Chapter 1.2 targets
- cited path existence check for platform and lesson evidence files
- forbidden-change check for lesson checkout and protected platform surfaces
- `git diff --check`
- `npm.cmd run check:platform`
- final map/index refresh:
  - `npm.cmd run agent:index`
  - `npm.cmd run dashboard:internal`
  - `node build-scripts/sprints/emit-url-index.js --check` or regenerate only
    if needed

