# Sprint ISSUE-223-GATE-0-1: Book 2 Paragraph 2.1.1 Audit And Design Hold

## Goal

Preserve the completed technical baseline audit and accepted process correction
for §2.1.1 Kostenstructuren, insert a Book 2 foundation-and-outline gate, and
block final paragraph-goal and target approval until that separate platform-only
outline has been reviewed, approved, and integrated.

Current operative status:

`Baseline audit PASS; Book 2 foundation Gate 0B-0 REQUIRED NEXT; §2.1.1 design Gate 0B-1 BLOCKED.`

## Context

PR #224 originally treated independent planning review as authority to begin
lesson and guardrail work. Owner review on 2026-09-01 at PR head
`998de1c698e2b225ed38985582d9c38ec68353ce` rejects that conclusion. The
technical audit remains valid, but the earlier design PASS and implementation
authorization are superseded.

The correction published at PR head
`e8c0acca5400209decd262e84267b3b8e6be4e44` was accepted by owner review on
2026-09-01. That acceptance does not approve the provisional §2.1.1 design.
The same owner decision identifies a missing meso-level production authority
between the course blueprint and chapter plans. A separate Book 2 foundation
and outline task must now run before the paragraph design can receive final
specialist or owner approval.

The exact baselines remain:

- platform `main`: `15bb80496916e3c07f5c957226b857cc689d9f43`;
- lesson `main`: `f09fd6e88edc5049b026b16b0158e7e188091d2d`;
- target source file SHA-256:
  `33928e7929fa1c9af86159b07769e2f01d28963873ef34c40e55c2001feb87ac`;
- current §2.1.1 record SHA-256:
  `f01cd43c65e639e396a14b3dcfe5ed546ed7baa5cf8d2aa20a8bbe0c2c310de8`.

The record's `reviewed_final` status identifies the current authority. It does
not make that target immune to this explicit owner-authorized curriculum-design
review. The old target remains read-only baseline evidence in this PR. If the
owner approves a replacement, the authority change must use a separate focused
platform PR that preserves the old target as history and completes teacher,
economic-content, lead, exact-head CI, and governed integration review.

### Gate state

| Gate | Status | Meaning |
|---|---|---|
| Gate 0A — baseline audit | PASS | Exact heads, target/artifact hashes, current quality-ref, stale zip, missing handoff, rendered PDFs, and layout defects are valid audit evidence. |
| Gate 0B-0 — Book 2 foundation and outline | REQUIRED NEXT | A separate platform-only task must validate the Book 2 blueprint/registry foundation and create, review, approve, and integrate the canonical Book 2 production outline. PR #224 records this dependency but does not implement it. |
| Gate 0B-1 — §2.1.1 goals and target design | BLOCKED | The four-goal/target candidate remains a review seed. Final teacher, economist, lead, and owner approval begins only after Gate 0B-0 is integrated and its §2.1.1 role is pinned. |
| Gate 0C — target authority | BLOCKED | Starts only if the approved design changes the current registry target; use a separate focused platform PR. |
| Gate 1 — blank-slate paragraph architecture | BLOCKED | Starts only after the approved target is authoritative. No old paragraph or named exercise receives a presumption of reuse. |
| Gate 2 — exercise and answer design | BLOCKED | Starts only from the approved goals, target, and Gate 1 architecture. |
| Gate 3 — timing, rendering, guardrails, and review | BLOCKED | Starts after actual questions exist; only then freeze question-level timing and decide generic/paragraph-specific automation. |

### Audit of the current target against its current goals

| Current lesson goal | Current target evidence | Curriculum-design assessment |
|---|---|---|
| Distinguish constant and variable costs. | The context labels €500 constant and €0.80 per loaf variable before the student acts. | Gap: classification is supplied, not elicited or justified from cost behaviour. |
| Construct and calculate `TCK`, `TVK`, and `TK`. | Formulas and calculations at `Q = 500` and `Q = 1000`. | Aligned, but arithmetic is repeated too often across the old route. |
| Calculate `GCK`, `GVK`, and `GTK` with correct units. | All three averages at both quantities. | Numerically aligned; unit interpretation should be made explicit in the prompt and review. |
| Explain falling `GCK`. | Compare `GTK`; reject “GCK is always the same.” | Substantially aligned through explanation and misconception evaluation. |
| Explain constant `GVK` when variable cost per unit is constant. | Equal `GVK` values are calculated, but no explanation is requested. | Partial gap: an answer model cannot manufacture a student operation absent from the prompt. |

The printed target also weakens source parity by omitting what the fixed €500
represents. Its unqualified energy wording can teach that expense names determine
classification. The redesign must instead classify a cost from how its total
amount behaves when `Q` changes within a stated period and capacity range.

### Gate 0B-0 Book 2 foundation prerequisite

The separate task `BOOK-2-FOUNDATION-OUTLINE-1` must start from current
platform `main`, use its own issue, branch, worktree, and PR, and make no lesson
repository change. It must:

- audit v5/v6 Book 2 authority, the target registry, pedagogical boundaries,
  the Part A contract, lesson-root/chapter-plan maturity, and owner decisions;
- record one of `VALID`, `VALID_WITH_DERIVED_OUTLINE_REQUIRED`, or
  `BLOCKED_BLUEPRINT_REPAIR_REQUIRED`;
- create the canonical outline and lean metadata under
  `references/authored/book-outlines/` only if the audit permits it;
- add the reusable book-outline freshness guardrail and paragraph-workflow
  foundation check;
- obtain teacher-learning-quality, economic-content, curriculum-sequencing,
  structural-lead, and explicit human owner review before integration;
- pass exact-head and post-merge CI through the governed integration route.

The outline defines book-wide progression, prerequisites, paragraph roles,
dependencies, retrieval, conventions, and holds. It references target records
  but does not duplicate or compete with target authority. Book 2 is the first application;
this task does not create outlines for other books.

### Provisional Gate 0B-1 lesson goals

These are review candidates, not authority and not yet student-facing output:

1. Classify cost components as constant or variable from how their total amount
   changes when `Q` changes within the stated period and production range,
   including cases where one expense category has both components.
2. Construct `TCK`, `TVK`, and `TK` from a context and calculate with them.
3. Calculate and interpret `GCK`, `GVK`, and `GTK`, using correct units.
4. Explain how total and average costs change as `Q` rises when variable cost per
   product remains constant.

Gate 0B-1 must separately approve concise Dutch student-visible wording in a
non-heading box near the paragraph start:

`**Na deze paragraaf kun je**`

The box must not create an eighth exercise heading. Goal wording must be
approved before the target is finalized.

### Provisional target-design requirements

The target must use a concrete period and capacity boundary, identify fixed and
variable components without pre-answering their classification, and elicit:

- classification plus justification from cost behaviour;
- formula construction;
- a proportionate sample of total and average calculations;
- correct units;
- comparison of total versus average movements;
- explanation of fixed-cost spreading;
- explanation of the condition under which `GVK` remains constant;
- evaluation of the energy-component misconception.

The owner-provided revised bakery candidate in
`reports/sprints/ISSUE-223-GATE-0-1-curriculum-design-brief.md` is a review seed,
not an approved registry replacement. It provisionally aims for approximately
12–14 minutes, subject to specialist testing after the Book 2 outline is
integrated.

### Blank-slate and salvage rule

After an approved target is integrated, create the new paragraph from a blank
authoring file. The old paragraph is a salvage library only. Core identities,
fixed-cost-spreading wording, the overtime flexibility idea, or a redesigned
cost graph may be reused only after an explicit goal/target/design justification.
The foodtruck example, graph-reading task, old tables, Opgaven 1–8, and current
target have no presumption of retention.

### Timing boundary

The former exact 52-minute equation is withdrawn because it timed inherited and
not-yet-authored questions. Gate 0B-1 freezes only these constraints:

- final whole-lesson equation must be `<= 55` minutes;
- design toward approximately 48–52 minutes to preserve ordinary contingency;
- include motivation, student-visible goals, instruction, worked example,
  compact summary/transitions, route reading, actual Startopgaven, actual
  independent work, actual target questions, writing/table time, and
  contingency;
- optional guided, bonus, and closing review remain accounted for separately;
- produce the question-level equation only after the target and exercise ladder
  are authored and reviewed;
- remove duplicated work before removing any approved target operation.

### Guardrail decision

The proposed §2.1.1-specific checker is deferred. Building it now would encode
an unapproved target, hash, mapping, and route. After the final design is stable,
Gate 3 may justify automation for objectively testable properties such as
visible goals, canonical heading order, approved target hash, question/answer
parity, summary placement, paper-only wording, required context fields, and
generated-file integrity. Teacher judgment about whether questions genuinely
elicit understanding remains review evidence, not a regex substitute.

## Quality Standard

This specification requires Gate 0B-0 to establish an approved Book 2
foundation and Gate 0B-1 to establish educationally sound internal and
student-visible goals,
a balanced contextual target, and explicit human owner approval. The target
must sample every approved goal through requested student operations rather than
answer-model inference. Proof must address classification, explanation,
comparison, formula construction, calculation, units, misconceptions, context,
answer forms, difficulty, and realistic target time. No student-facing rendered
output is authorized at this gate. Later rendered output must meet the printed-textbook
quality floor, include reviewable page images/contact sheets, and receive
teacher-learning-quality, student-experience, mathematical/economic, and lead
review in addition to validators. Every deferred concern must have a named
follow-up rather than an implicit implementation assumption.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Preserve the technical baseline audit. | Existing baseline hashes, PDF inventory, stale-zip and handoff findings, clean lesson branch. | Exact-head/diff verification. | include_now |
| Supersede the rejected design PASS. | Owner-review record, revised plan/JSON, corrected roadmap/Issue/PR language. | Owner review mapped to every changed assertion. | include_now |
| Insert the Book 2 foundation layer. | Gate 0B-0 dependency, separate task/issue/PR route, and explicit no-implementation boundary for PR #224. | Owner acceptance plus later integrated outline path/version/hash. | include_now; implementation in separate task |
| Approve internal and student-visible goals before the target. | Gate 0B-1 four-goal set plus concise `Na deze paragraaf kun je` wording. | After outline integration: teacher/economic-content/lead review and explicit human owner decision. | blocked_by_gate_0b_0 |
| Design a balanced contextual target. | Revised review seed and goal-to-target matrix covering every requested operation. | After outline integration: balance, misconception, answer-form, difficulty, context, and target-timing review. | blocked_by_gate_0b_0 |
| Change target authority if approved design differs. | Separate platform target-authority PR preserving history. | Teacher, economist, lead, exact-head CI, human authorization, governed integration. | defer_named_follow_up |
| Build the paragraph from a blank slate. | New lesson architecture after target integration; explicit salvage decisions only. | Gate 1 human-reviewed architecture. | defer_named_follow_up |
| Author seven-section exercises and answers. | New ladder with healthier classification/explanation/comparison/calculation balance. | Gate 2 specialist review against the approved target. | defer_named_follow_up |
| Freeze timing, rendering proof, and automation. | Actual question-level equation, regenerated outputs, page images/contact sheets, final objective guardrails. | Gate 3 every-page specialist/lead review and exact-head CI. | defer_named_follow_up |

## Quality Improvement Candidates

| Candidate | Classification | Rationale |
|---|---|---|
| Reopen lesson-goal and target quality under owner authority. | include_now | Current authority is incomplete evidence for classification and constant-`GVK` explanation. |
| Add a canonical Book 2 production outline between blueprint and chapter plan. | separate_required_task | The missing meso-level layer must be approved and integrated before §2.1.1 design approval. |
| Split energy into constant contract and variable usage components. | include_now | Teaches classification from behaviour and directly addresses the misconception. |
| Replace duplicate arithmetic with conceptual evidence. | include_now | Improves balance without lengthening the route. |
| Add student-visible goals near the paragraph start. | include_now | Required by the active review standard and improves student orientation. |
| Preserve named old exercises or the foodtruck example now. | reject_scope_creep | It anchors the new design before goals and target approval. |
| Implement a paragraph-specific checker now. | defer_named_follow_up | Objective properties can be automated only after the design and target hash are stable. |
| Write or regenerate lesson output before target approval. | reject_scope_creep | Gates 0B-0 and 0B-1 are platform planning/authority work only. |

## Allowed paths

PR #224 planning/evidence correction only:

- `reports/sprints/ISSUE-223-GATE-0-1-*.md`
- `reports/sprints/ISSUE-223-GATE-0-1-command-log.jsonl`
- `references/data/sprints/ISSUE-223-GATE-0-1.plan.json`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- Generated repository indexes only when required by freshness checks.
- PR #224 description/comments and Issue #223 comments needed to record the
  superseding owner decision.

## Forbidden paths

- No lesson repository file or generated-output change, including the stale zip
  or missing handoff, until the appropriate later gate authorizes it.
- No target registry, blueprint authority, MTU, candidate, PV, protected
  reference, `references/machine/`, or `references/external/` change in PR #224.
- No paragraph-specific or generic checker implementation in PR #224.
- No Book 2 outline, outline metadata, book-outline checker, mutation test, or
  paragraph-workflow implementation in PR #224; those belong only to the
  separate `BOOK-2-FOUNDATION-OUTLINE-1` PR.
- No Book 1, Part B, another Book 2 paragraph, Chapter 2.1 assembly, or other
  book change.
- No claim that independent planning review, green CI, or `reviewed_final`
  status alone approves curriculum design.
- No student-facing AI, diagnostics, adaptive routing, mastery/sequencing,
  summative, product-wide, or broad companion authorization.

## Inputs

- GitHub Issue #223.
- Owner PR #224 review at head `998de1c698e2b225ed38985582d9c38ec68353ce`.
- Accepted process-correction review at head
  `e8c0acca5400209decd262e84267b3b8e6be4e44` and the owner decision inserting
  Gate 0B-0.
- `reports/sprints/ISSUE-223-GATE-0-1-baseline.md`.
- `references/authored/course-target-exercises.json` current §2.1.1 record.
- `references/owned/course-blueprint-v5.md` §2.1.1.
- `references/owned/course-blueprint-pedagogical-boundaries.md`.
- `skills/econ-exercise-builder.md`.
- `skills/econ-textbook-paragraph.md`.
- `skills/econ-didactiek.md`.
- `skills/econ-paragraph-review.md`.
- `docs/workflows/textbook-paragraph-lane.md`.
- Current lesson sources/rendered output as read-only audit and salvage evidence.

## Outputs

- Revised Gate 0 plan and machine plan with Gate 0B-0 required and all
  §2.1.1 implementation blocked.
- `reports/sprints/ISSUE-223-GATE-0-1-owner-review-supersession.md`.
- `reports/sprints/ISSUE-223-GATE-0-1-curriculum-design-brief.md`.
- Updated historical planning-review record that no longer authorizes work.
- Corrected textbook roadmap/ledger and superseding PR/Issue records.
- A separate Book 2 outline issue/branch/PR; its implementation is not part of
  PR #224.
- Future Gate 0B-1 teacher, economic-content, lead, and explicit human owner
  decision evidence after the outline is integrated; these are required before
  Gate 0C or lesson work.

## Operationalized sprint procedure

1. Retain Gate 0A baseline evidence and verify both worktrees remain at the
   pinned heads. Stop if any lesson diff exists.
2. Record the owner review as the operative authority and supersede the earlier
   planning PASS, machine authorization, roadmap authorization, PR description,
   and Issue comments.
3. Record Gate 0B-0 as the immediate blocker and open
   `BOOK-2-FOUNDATION-OUTLINE-1` as a separate platform-only issue, branch, and
   PR from current platform `main`. Do not implement that task in PR #224.
4. After the Book 2 outline is reviewed, owner-approved, integrated, and green
   on post-merge CI, refresh PR #224 against current platform `main` and pin the
   approved outline path, version, commit, hash, status, and §2.1.1 role.
5. Reopen Gate 0B-1 and review the four-goal, student-visible-goal, contextual
   target, alignment, balance, misconception, answer-form, difficulty, and
   12–14-minute timing seed against the outline.
6. Obtain independent teacher-learning-quality, economic-content, and structural
   lead reviews of those planning artifacts. Resolve blocking findings without
   editing lesson or target authority.
7. Present the reviewed Gate 0B-1 design for explicit human owner decision. Valid
   outcomes are `APPROVE_FOR_TARGET_AUTHORITY`, `REVISE`, or `REJECT`. Do not
   infer approval from silence, CI, or file existence.
8. If the owner-approved target differs from the registry, open Gate 0C as a
   separate focused target-authority PR. Preserve old authority as history and
   integrate through governed teacher/economist/lead/exact-head/human gates.
9. Only after the approved target is authoritative, open Gate 1 and author the
   paragraph architecture from a blank slate. Make individual salvage decisions
   explicitly; do not copy the old paragraph as the starting document.
10. Gate 2 authors the canonical seven-section exercises/answers from the approved
   target. Gate 3 then freezes actual timing, regenerates/render-inspects every
   page, obtains all specialist/lead reviews, and decides final guardrails.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/ISSUE-223-GATE-0-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js ISSUE-223-GATE-0-1
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/workflows/check-part-a-exercise-authoring-contract.js
node build-scripts/workflows/check-blueprint-pedagogical-boundaries.js
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../issue223-lesson/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren"
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm run check:agent-index-freshness
git diff --check
git -C "../issue223-lesson" diff --check
```

The paragraph validator is baseline-integrity evidence only. It is not a
curriculum-design acceptance test. No lesson-lane or future target/checker test
is runnable in Gate 0B-1 because those surfaces must remain unchanged.

## Proof Required to Close

Closure proof to close Gate 0B-1 cannot exist until the canonical Book 2 outline
is approved, integrated, green on post-merge CI, and pinned in this plan. Gate
0B-1 proof must then include the planned validator/test evidence, approved
internal goals, student-visible goals,
balanced contextual target, goal-to-target matrix, misconception/balance/
answer-form/difficulty reviews, realistic question-level target timing,
teacher-learning-quality review, economic-content review, structural lead
review, and explicit human owner decision all exist and agree. Green CI proves
repository integrity only. It does not close curriculum design.

## Rollback plan

Revert only PR #224's planning/evidence/roadmap corrections if they are rejected.
The lesson branch requires no rollback because it remains at
`f09fd6e88edc5049b026b16b0158e7e188091d2d`. Do not reset either repository,
delete baseline evidence, or mutate protected authority as rollback.

## Human review required

Yes. Gate 0B-0 requires teacher-learning-quality, economic-content,
curriculum-sequencing, structural-lead, and explicit human owner approval in
the separate outline task. Gate 0B-1 later requires explicit human owner
approval after teacher-learning-quality, economic-content, and structural lead
reviews. Set
`lead_review_phase` to `before_human_gate`. Until that decision is recorded,
generated lesson output, student-facing editing, target-authority mutation, and
guardrail implementation remain blocked.
