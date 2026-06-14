# INSPECT-9B Sprint Plan

Status: draft for planning review
Date: 2026-06-11
Sprint: `INSPECT-9B`
Branch: `codex/inspect-9b-chapter-12-equivalence-support-review-20260611`
Platform worktree: `C:\wt\INSPECT-9B-20260611\4veco-platform`
Lesson evidence checkout: `C:\wt\INSPECT-9B-20260611\4veco-lessen`
Base commit: `f7888135bb57c4544761b483b753d00c09524cff`
Lesson evidence commit: `b858bca602bb7afdf75cad7c3ecc1a79b31fbb76`

## Goal

Decide whether Book 1 Chapter 1.2 has enough reviewed target-equivalent,
accessibility, and support/differentiation evidence for a later Dutch
report-only generator implementation, or whether those gaps must remain
explicit blockers.

INSPECT-9B is a review/design packet. It must not create an evidence pack, a
report-only generator, lesson output, package script, build/CI gate, dashboard
gate, quality-ref integration, Scale Gate integration, or any compliance,
approval, inspection-ready, OP0-complete, PTA-validity, summative-validity,
classroom-implementation, school-obligation, or school-SKA claim.

## Quality Floor

The sprint is not complete unless it produces a reviewer-readable packet that:

1. states target-equivalent proof status for each Chapter 1.2 target record;
2. separates route-local lesson evidence from reviewed target-equivalent proof;
3. records accessibility evidence against the INSPECT-9 rubric without claiming
   accessibility compliance;
4. records support/differentiation evidence against the INSPECT-9 rubric
   without claiming school support, monitoring, accommodations, or care-plan
   evidence;
5. names weak, stale, missing, or deferred evidence as blockers or constraints;
6. states whether INSPECT-10 is blocked or only allowed as a tightly scoped
   report-only implementation that preserves the blockers;
7. preserves the Dutch-only, product-side, no-personal-data, no-lesson-mutation
   boundary.

## Specification Requirements Fulfilled

From the roadmap INSPECT-9B row:

- no evidence-pack generation;
- no report-only generator implementation;
- no generated lesson-output mutation;
- target-equivalent proof status explicit per Chapter 1.2 target;
- accessibility/support evidence recorded with route-local boundaries;
- weak or deferred evidence remains visible;
- Chapter 1.2 declared either still blocked before INSPECT-10 or allowed only
  under a tightly scoped report-only-generator posture with named blockers;
- no unsafe compliance, approval, inspection-ready, OP0, PTA, summative,
  classroom, school-obligation, or school-SKA claim.

From quality-log requirements:

- every issue has `title`, `quality_category`, `evidence_path_or_url`,
  `affected_surface`, `severity`, `next_action`,
  `platform_handoff_required`, and `proof_required_to_close`.

## Evidence To Inspect

Platform evidence:

- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `reports/inspection-standards/dutch-evidence-gap-closure-plan.md`
- `reports/inspection-standards/dutch-evidence-gap-closure-plan.json`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json`
- `archive/sprints/INSPECT-9A/INSPECT-9A-closure-log.md`
- `references/authored/course-target-exercises.json`

Read-only lesson evidence:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/_chapter-plan.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1-quality-ref.yaml`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1-review.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1 Individuele vraag - opgaven.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1 Individuele vraag - antwoorden.md`
- equivalent `quality-ref`, `review`, `opgaven`, and `antwoorden` files for
  `1.2.2`, `1.2.3`, and `1.2.4`.

Evidence caveat: lesson filenames contain typographic separators on disk. The
report may cite the exact path as shown by `Get-ChildItem`, but validation must
check path existence directly rather than relying on hand-typed path strings.

## Preliminary Evidence Hypothesis

The expected conservative outcome is:

- Chapter 1.2 has useful generated lesson evidence, target records, doeloefening
  surfaces, answer models, paragraph reviews, and quality refs.
- Those surfaces are not the same as reviewed target-equivalent proof because
  they do not form a separate proof artifact with operation-chain comparison,
  answer-form comparison, no-answer scaffold boundary, and authority boundary.
- Accessibility and support/differentiation evidence exists mostly as
  route-local artifact/review metadata: asset presence, SVG/PNG pairing,
  visual support, scaffolding/fading, differentiatie notes, and answer feedback.
- Companion materials are absent in the Chapter 1.2 quality refs.
- INSPECT-10 should not treat Chapter 1.2 as pack-ready unless it is explicitly
  allowed to carry these blockers visibly, or a new proof/remediation sprint
  closes them first.

The implementation must be willing to revise this hypothesis if evidence proves
stronger or weaker.

## Allowed File Changes

Allowed:

- create `archive/sprints/INSPECT-9B/INSPECT-9B-sprint-plan.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-planning-review.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-validation-log.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-lead-review-assignment.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-lead-review-round1.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-correction-log.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-lead-review-round2.md`;
- create `archive/sprints/INSPECT-9B/INSPECT-9B-closure-log.md`;
- create `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md`;
- create `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json`;
- update the quality-standards roadmap, ledger, and end-state documents to
  record INSPECT-9B outcome and next action;
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

1. Confirm worktree safety and evidence checkout state.
2. Read roadmap, ledger, INSPECT-9, INSPECT-9A, target registry, Chapter 1.2
   lesson reviews, quality refs, doeloefening/opgaven, answer models, and
   chapter plan.
3. Create this sprint plan and send it to planning review before implementation.
4. After planning review passes, build the review/design report in Markdown and
   JSON.
5. For each target `1.2.1` through `1.2.4`, record:
   - target-record status after INSPECT-9A;
   - local target/doeloefening or consolidation evidence;
   - operation-chain overlap;
   - answer-form overlap;
   - proof gap status;
   - authority boundary.
6. For accessibility evidence, record:
   - asset presence/pairing;
   - text-equivalent or alt-context evidence where visible;
   - contrast/theme evidence state;
   - mobile evidence state;
   - keyboard/focus evidence state;
   - semantic structure evidence state;
   - inclusive-language/internal-code exposure evidence state.
7. For support/differentiation evidence, record:
   - prerequisite/start-state checks;
   - scaffolding/fading;
   - hints/repair routes;
   - advisory check or next-action evidence;
   - differentiated practice/enrichment;
   - product/school support boundary.
8. Create a quality log using the required roadmap fields.
9. Update roadmap/ledger/end-state with the INSPECT-9B decision and next action.
10. Validate JSON parse, required fields, path existence, safe-claim wording,
    no forbidden file changes, lesson checkout cleanliness, and platform tests.
11. Request lead review round 1.
12. If lead review returns `REVISE`, correct and revalidate. If it returns
    `PASS`, record a correction log with no blocking corrections needed.
13. Request lead review round 2 and require explicit closure authorization.
14. Create closure log, refresh maps/indexes, run final validation, commit,
    push, and report branch/commit/CI status.

The `dashboard:internal` refresh in this procedure is repository-index
maintenance only. It is not dashboard gate work and must not be described as a
new quality-control dashboard integration.

## Decision Points

1. Target-equivalent status:
   - `reviewed_proof_present`;
   - `route_local_candidate_only`;
   - `missing_reviewed_proof`;
   - `blocked_by_lesson_flag`.
2. Accessibility status:
   - `sufficient_for_route_local_report`;
   - `partial_route_local_evidence`;
   - `missing_required_evidence`;
   - `not_applicable_to_cited_surface`.
3. Support/differentiation status:
   - `sufficient_for_route_local_report`;
   - `partial_route_local_evidence`;
   - `missing_required_evidence`;
   - `school_owned_only`.
4. INSPECT-10 posture:
   - `blocked_before_generator`;
   - `generator_allowed_only_with_blocker_preservation`;
   - `generator_allowed_for_other_scope_not_chapter_1_2`;
   - `defer_and_insert_remediation_sprint`.

## Expected Output Shape

The Markdown report must include:

- safe-use note;
- executive decision;
- source/evidence checkout;
- target-equivalent matrix for `1.2.1` through `1.2.4`;
- accessibility matrix;
- support/differentiation matrix;
- product/school boundary section;
- INSPECT-10 posture decision;
- quality log;
- validation boundary;
- next action.

The JSON report must include machine-readable equivalents:

- `schema_version`;
- `report_id`;
- `sprint_id`;
- `generated_date`;
- `status`;
- `diagnostic_only`;
- `compliance_claim`;
- `personal_data_present`;
- `evidence_checkout`;
- `safe_use_note`;
- `executive_decision`;
- `target_equivalent_reviews`;
- `accessibility_reviews`;
- `support_reviews`;
- `inspect_10_posture`;
- `quality_log`;
- `validation_notes`.

## Acceptance Tests

Required:

- `npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-9B-20260611 --agent codex --require-prefix codex/,agent/`
- `npm.cmd run check:scope-language`
- JSON parse check for the INSPECT-9B report;
- JSON required-field check for every quality-log item;
- evidence path existence check for cited platform and lesson files;
- report decision check that all four target records have explicit
  target-equivalent status;
- report decision check that all four target records record their
  post-INSPECT-9A source-registry `record_status`;
- forbidden-change check that `../4veco-lessen` is clean and no source registry,
  machine reference, external reference, generator, package script, CI, quality
  ref, Scale Gate, or generated lesson-output path changed;
- `git diff --check`;
- `npm.cmd run check:platform`.

Final map/index refresh:

- `npm.cmd run agent:index`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/emit-url-index.js --check` or regenerate only if
  needed.

## Review Gate

Planning review must confirm:

- the plan expands the roadmap into executable evidence-review work;
- all planned outputs are named;
- lesson output remains read-only;
- report-only design stays separate from evidence-pack/generator work;
- target-equivalent, accessibility, and support criteria are concrete enough;
- validation catches forbidden surfaces and required fields.

Lead review must confirm before closure:

- target-equivalent statuses are conservative and evidence-backed;
- accessibility/support evidence is route-local and not overclaimed;
- INSPECT-10 posture follows from the evidence;
- weak/deferred evidence remains visible;
- no forbidden claims or work occurred;
- all required files and validations exist.

## Stop Conditions

Stop and record a blocker if:

- the lesson evidence checkout is dirty or not at the intended commit;
- the platform worktree branch changes unexpectedly;
- a needed evidence file is missing and no conservative status can be assigned;
- a proposed conclusion would require lesson-output mutation;
- evidence suggests target-equivalent proof is being inferred from ordinary
  opgaven presence without a reviewed proof artifact;
- the report begins to design generator behavior rather than only deciding the
  allowed or blocked INSPECT-10 posture;
- any source-registry mutation appears necessary;
- a validation command rewrites broad generated reports outside the packet;
- a safe-claim scan finds restricted claim language.

## Omitted Work And Follow-Up

INSPECT-9B will not fix lesson-output flags, create proof tasks, render
screenshots, add accessibility tests, update quality refs, mutate target
records, or implement a generator. It will name the proof/remediation work
required next.
