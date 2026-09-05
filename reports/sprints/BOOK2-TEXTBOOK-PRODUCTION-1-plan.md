# Sprint BOOK2-TEXTBOOK-PRODUCTION-1: Book 2 paper textbook production

## Goal

Execute the combined #229/#223 continuation: rebuild nine theory paragraphs,
three consolidation paragraphs, three chapters and the complete Book 2 student
book with separate answers. Establish §2.1.1 as the independently reviewed first
internal exemplar. Accountable executor/integrator: codex-root.

## Context

The owner approved PR #231 at 086e6b212edc9260fa34f050e9b01b02ec04b035.
The authorized trusted-main lane merged it with a merge commit and no admin
bypass as 96416b6b5bd57094576e9aba0a42d682584ec479 on 2026-09-05.
Owner authorization comment: https://github.com/meijer1973/4veco-platform/pull/231#issuecomment-5551428005.
Post-merge CI run 33963305398 passed on that exact merge SHA; the trusted lane
completed exit0, phase merged, post_merge_ci.ok true. The integration gate is
complete; student-facing authoring still requires the normal planning reviews.

The existing immutable task grant in
`reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md` covers gated
Part A production, not approval of future unreviewed teaching plans or merge of
future payloads. This plan operationalizes
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-continuation-plan.md`.
The latest owner instruction explicitly prevents later action-specific holds
from delaying unaffected paragraphs. Therefore §2.1.1 begins after its normal
plan/review gate, while later prerequisites are resolved before affected work.

## Quality Standard

The specification quality floor is an independently usable, complete paper
lesson route with exact frozen targets and fully explained answers. Student-facing
quality is judged on rendered output at normal reading scale, not file presence.
Proof includes target-operation alignment, independent recalculation, source/render
parity, realistic question-level timing, and independent economics, teaching,
Dutch language, student-experience and visual review. No core defect is carried
as a flag. Named follow-up work: Part B companions and digital exit tickets;
empirical classroom timing and attainment observations; OP-C2 formal output choice.
Vision fit: exercise-first learning and repeatable agent production are advantage
investments; accurate accessible print output is a parity requirement.

Print body and table text use at least 12pt. The legacy chapter-front 11pt rule
is superseded by this readability floor: simplify the front-page composition,
not the type size, and independently review its normal-scale rendering.
The quality skill's freshness check found the protected Inspectie reference
still on the 2025 framework although the official 2026 revision is effective.
Do not change that protected reference or claim current Inspectie compliance.
Record a named external-reference refresh follow-up; the optional Inspectie
mapping is omitted from this Part A quality record, without omitting any
paragraph, teaching, mathematical, student-experience or rendered-output review.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Governed target integration before lessons | PR231 merge SHA, exact post-merge CI and lane outcome | Baseline and command log | PASS |
| Frozen twelve targets and Ei semantics | Package hash 914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310; exact transcription per target | Durable authority check and source comparison | Planned |
| Current foundation for every action | v6/v5, semantic outline 919c39f64dd212dba37b62902a5bb2e2ce6388c6020a0491e1621017ae2192a1, chapter and target pins | Currentness and independently reviewed plans | Planned |
| Complete goal-to-target route | Four or fewer exact goals; decomposition/alignment table per theory paragraph; unchanged target sources/prompts/points | Teacher/economics review | Planned |
| Paper-only seven-stage exercise route | Worked example, compact non-heading summary, two-role start, printed optional guided fading, independent work, target, bonus and closing retrieval | Independent paragraph and student-experience reviews | Planned |
| Whole-lesson feasibility | Actual question estimates plus instruction/motivation/example/transitions <=55 minutes; support/bonus separate | Solve-and-timing walkthrough; observed timing remains open | Planned |
| Accurate visual and answer route | Paired SVG/PNG, direct labels, explicit units/conditions, every subquestion answered | Recalculation, geometry checks, all final rendered pages inspected | Planned |
| Consolidation without new theory | Current point-bearing mixed target and source-rich tasks after reviewed prerequisites | Independent mixed-target and chapter coverage review | Planned |
| Complete 41-PDF package | 33 paragraph, 6 chapter, 2 book PDFs and reproducible sources/builders | Output inventory, paragraph/chapter/book validators, rendered proof | Planned |
| Reviewable publication | Paired branches/PRs, immutable evidence hashes and compatibility matrix | Independent verification, structural lead rounds 1/2, CI/readiness | Planned |

## Quality Improvement Candidates

- include_now: preserve capacity/time/model bounds beside formulas; directly label
  diagrams; use a single exercise source to prevent paragraaf/opgaven drift;
  keep large answer tables readable; reuse correct draft ideas only after review.
- defer_named_follow_up: observed classroom pacing and attainment; Part B route
  and target-equivalent digital exit tickets; broader accessibility audits of
  untouched output.
- reject_scope_creep: target mutation, changing Ei categories, Book 1 retrofit,
  Part B output, formal OP-C2, new assessment/diagnostic or mastery authority.

## Allowed paths

- Lesson repository: Part A source/output/plans/assets/reviews/handoffs only under
  `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/` as enumerated below.
  Preserve existing unrelated companion files and their quality-ref block.
- Platform: `reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-*`,
  `references/data/sprints/BOOK2-TEXTBOOK-PRODUCTION-1.*`,
  `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`,
  `reports/review-gates/GATE-BOOK2-TEXTBOOK-PRODUCTION-1/`.
- Platform reusable production work: `build-scripts/content/book-2/`,
  `build-scripts/books/book-manifests/book-2.json` and `book-2-voorwoord.md`;
  bounded tested extensions to existing PDF/chapter/book workflow where needed
  for the expressly requested separate answer book. No Book 1 output regeneration.
- Outline metadata and its lifecycle-only Markdown hold projection solely after
  exact evidence satisfies root/chapter/teaching-plan hold release. Preserve the
  semantic hash and all historical approval/integration evidence. Owner-decision
  holds may not be self-approved.
- Exact textbook-plan/assembly filename recognition in lane-scope checks if
  necessary, with regression tests; no broad ZIP or companion exceptions.
- Current production status in textbook roadmap/ledger and deterministic maps,
  URL index, GitHub-facing indexes/dashboard as required for publication.

## Forbidden paths

- `references/machine/`, `references/external/`, frozen target registry and
  approved candidate/alignment packages; v6/v5 and terminology semantics.
- Book 1 output; Part B indexes/games/presentations/shared data and companion
  review or quality ownership; formal OP-C2 output-choice extension.
- Integration policy, branch protection, governance entrypoints; other agents'
  branches/worktrees and the dirty older §2.1.1 production branch.

## Inputs

Platform baseline 96416b6b5bd57094576e9aba0a42d682584ec479; lesson baseline
f09fd6e88edc5049b026b16b0158e7e188091d2d. Dedicated paired worktrees under
`C:/wt/book2-part-a-production-20260905/`, both on
`codex/book2-part-a-production-20260905`, claimed by codex-root for this sprint.
Both AGENTS; product vision/end-state; Part A lane, complete BUILD-PARAGRAPH and
BUILD-CHAPTER; textbook/exercise/didactic/graph/PDF/quality/review skills and
their selected references; chapter/consolidation/assembler/book skills before
their stages. Canonical outline/meta and current registry control semantics.

Read-only salvage comes from the older
`C:/wt/Issue 218, textbook excercises/b2-211-part-a-production/` pair.
Record exact salvaged source hashes before use. Do not copy its old target,
reviews, authority/timing claims, classifier ZIP exception, or whole branch.
Existing lesson-main Book 2 outputs likewise need renewed review.

## Outputs

Let B be `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus`.
Root planning artifact is `B/_book-plan.md`. The platform book manifest is the
machine assembly contract, not a second semantic outline. Chapter plans remain
`_chapter-plan.md` inside these exact folders:

| Chapter folder beneath B | Chapter output stem |
|---|---|
| 2.1 Hoofdstuk Kosten en opbrengsten | 2.1 Kosten en opbrengsten |
| 2.2 Hoofdstuk Elasticiteit | 2.2 Elasticiteit |
| 2.3 Hoofdstuk Surplus en welvaart | 2.3 Surplus en welvaart |

The new root plan must carry canonical authority pins, all twelve target
identities, chapter/paragraph references, dependency and hold inventory,
assembly order, student/answer separation, the output manifest, independent
review evidence, and exact release provenance. No existing root-plan template
or earlier root-plan approval is presumed.

Retain existing Windows-safe folder names. New names follow the active blueprint;
colons in mixed titles are omitted from filesystem names, not student titles.

| Paragraph folder inside its chapter | Type | Filename stem |
|---|---|---|
| 2.1.1 Kostenstructuren | theory | 2.1.1 Kostenstructuren |
| 2.1.2 Opbrengsten, winst en break-even | theory | 2.1.2 Opbrengsten, winst en break-even |
| 2.1.3 Marginale kosten en marginale opbrengsten | theory | 2.1.3 Marginale kosten en marginale opbrengsten |
| 2.1.4 Gemengde opgaven | consolidation | 2.1.4 Gemengde opgaven |
| 2.2.1 Prijselasticiteit | theory | 2.2.1 Prijselasticiteit |
| 2.2.2 Elasticiteit en omzet | theory | 2.2.2 Elasticiteit en omzet |
| 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit | theory | 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit |
| 2.2.4 Gemengde opgaven elasticiteit | consolidation | 2.2.4 Gemengde opgaven elasticiteit |
| 2.3.1 Consumentensurplus | theory | 2.3.1 Consumentensurplus |
| 2.3.2 Producentensurplus en totaal surplus | theory | 2.3.2 Producentensurplus en totaal surplus |
| 2.3.3 Pareto-efficientie en welvaartsverlies | theory | 2.3.3 Pareto-efficientie en welvaartsverlies |
| 2.3.4 Gemengde opgaven surplus en welvaart | consolidation | 2.3.4 Gemengde opgaven surplus en welvaart |

For each theory stem emit ` – paragraaf`, ` – opgaven`, ` – antwoorden` in
`.md`, `.html`, `.pdf`; each consolidation emits opgaven and antwoorden only.
All twelve paragraphs receive `build_pdf.py` thin platform wrapper, paired
`_assets/<id>_{fig,we,ex}_N.svg/.png` as named by their reviewed visual plans,
`<id>-textbook-plan.md`, `<id>-review.md`, `<id>-quality-ref.yaml` schema2 partA,
and `<id>-textbook-handoff.md`. Asset filenames are pinned before generation.

Each chapter emits its stem plus ` – hoofdstuk` and ` – antwoorden` in
`.md/.html/.pdf`, `_assets/`, and `build_chapter.py`. The student chapter embeds
each theory route once and the mixed opgaven once, never duplicate exercises.
Book outputs are `Boek 2 Kosten, opbrengsten, elasticiteit en surplus – boek`
and `Boek 2 Kosten, opbrengsten, elasticiteit en surplus – antwoorden`, each in
`.md/.html/.pdf`, with collected `_assets/`. Separate answers are expressly
requested; they are never inserted into the student book. The newer paper-only
contract overrides legacy book-preface advice to visit a website for answers.

PDF count: 9x3 + 3x2 + 3x2 + 2 = 41. Print estimates and internal plan/review
language stay out of student files. Final proof directory per output contains
manifest.json, contact-sheet.png and pages/page-NNN.png; manifests carry exact
source/output/asset hashes and actual inspection disposition, never prefilled PASS.

Sprint records: plan, baseline, planning-review, command-log, salvage-inventory,
prerequisite-decisions, output-manifest, target-trace, timing-walkthrough,
review-corrections, finished-verification, result, diff-summary,
lead-review-assignment/round1/corrections/round2 Markdown; plan/result JSON.
Proof and review artifacts are generated only when that work actually occurs.

## Operationalized sprint procedure

Builder ownership: codex-root is coordinator and sole integration owner.
Each paragraph is assigned to a separate paragraph-building agent in its own
claimed, isolated paired worktrees. A builder may draft its paragraph plan but
must wait for an independent plan review before student-content authoring.
For the first exemplar, released_pin_analysis is the assigned builder and
correction_plan_review is the independent planning/paragraph reviewer;
an additional non-author specialist supplies independent QC/quality-ref and
teacher/student/visual evidence. Later paragraph assignments and worktree paths
are recorded before authoring. No builder accepts its own paragraph, produces
its independent quality-ref, or integrates another agent's branch. Root may
author cross-cutting root/chapter plans and reusable production tooling; those
also require non-author review. The coordinator integrates reviewed commits
without overwriting another agent's worktree.

1. Verify exact PR231 lane result and green merge CI before student authoring.
   Fetch, verify governance freshness, create/claim clean paired worktrees and
   record baseline. Validate this operational plan and obtain independent planning
   review; repair all blocking findings before implementation.
2. Run structural/approved outline checks and exact action checks. Revalidate and
   refresh the Chapter 2.1 plan, then complete the current §2.1.1 template and
   backward alignment. Independent plan review precedes its source authoring.
   Review all skill-required references before the relevant stage.
3. Build §2.1.1 first: selectively salvage useful ideas, replace stale target
   copies, teach formal cost reasoning in full. Pin visual intent/geometry, write
   sources and platform builder, regenerate paired assets/HTML/PDF. Run asset,
   target-transcription, calculation, heading, answer and timing checks. Inspect
   every final rendered page; independent Pass0/1/2, teacher/student/Dutch/render
   review; fix sources and re-review. Independent agent produces quality-ref.
4. Continue §§2.1.2–2.1.3 only after their prerequisite teaching is reviewed,
   then §2.1.4. Apply the same source/build/review gates to every paragraph.
   This is a coherent internal milestone, not the end of the combined project.
5. Before §§2.2.1–2.2.2, prepare reviewed retrieval and elastic-contrast plans.
   H-221-PRIOR and H-22-ELASTIC-CONTRAST require goal_owner_decision: publish exact
   reviewed plan evidence and request the owner decision if not already given.
   Do not infer that the task grant approves an unseen plan. Keep the frozen
   registry unchanged and explicitly record no registry-normalization mutation.
   These holds do not block Chapter 2.1 or unrelated planning.
6. Create/review root and Chapter 2.3 plans under book_plan_repair and
   chapter_plan_repair. Record exact evidence before releasing those holds.
   New Chapter 2.3 paragraph production waits for its plan gate. Revalidate 2.2;
   use current three-way Ei semantics and no OP-C2. Finish remaining chapters
   in dependency order, retaining action-specific stops.
7. Independently review chapter consistency, prerequisites and all target traces;
   then build chapter student/answer outputs. Verify source assets equal aggregate
   copies. Assemble the book only after root and applicable teaching/chapter holds
   release. Use platform book pipeline, separate answer assembly, zero duplicates,
   complete front/back matter and no student-facing web dependency.
8. Re-render every final PDF and inspect all pages at normal scale; record actual
   defects and fixes. Independent finished-output verification and structural lead
   round1, correction log, round2 judge specification fulfilment, not checker counts.
   Run applicable focused/full tests and all paragraph/chapter/book/scope gates.
9. Fetch, refresh maps/indexes, commit/push both branches and publish paired draft
   PRs with exact payloads and compatibility for platform-first, lesson-first and
   bundle-final. Required platform CI uses lesson main. Apply exact-head readiness
   when allowed. Return substantial reviewed package at READY_FOR_HUMAN_REVIEW,
   or earlier only for a required owner decision or genuine blocker. No future
   payload is merged using PR231 authorization.

Stop the affected action for failed currentness/CI, unresolved core review defect,
missing owner decision, unverifiable provenance, target drift, unexpected branch
or dirty-worktree collision. Preserve safe unrelated work; do not bypass a gate.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1
npm.cmd run check:book-outline-currentness -- --require-approved
npm.cmd run check:book-outline-currentness -- --require-approved --action paragraph_production --paragraph 2.1.1
node build-scripts/workflows/check-book2-target-authority-remediation.js --durable
node scripts/validate-paragraph.js --mode part-a --profile student-web "<each paragraph>"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "<each paragraph>"
node scripts/validate-chapter.js "<each chapter>"
npm.cmd run check:book -- "../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus"
node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base origin/main --head HEAD
npm.cmd run check:platform
git diff --check
```

Repeat action currentness for every paragraph/chapter/book action, not only 211.
Retain student-web for required HTML and require publisher-print before chapter
or book print handoff; chapter validation does not replace that paragraph gate.
Add bounded regression tests for any production-tool change. Verify all 41 PDFs,
exact targets, source/output parity, units, arithmetic and geometry separately.
The complete sprint bundle is a closure gate and is expected incomplete during
planning; do not fabricate its result/reviews to make it pass early.

## Proof Required to Close

Close only with all manifest outputs, all reviewed target traces, exact source,
asset and output hashes, all final page proof, zero visible/core defects,
independent paragraph/quality/teacher/student/economics/language/visual evidence,
finished verification and structural lead correction cycle, validators/tests,
green exact-head CI, remote currentness and paired compatibility/readiness proof.
Classroom timing remains an observation-dependent flag with explicit proof needed;
estimated timing never proves learner attainment. Scope closes Part A only.

## Rollback plan

Keep both baseline SHAs and salvage hashes. Repair owned source/builders and
regenerate; never hand-patch generated files. Revert only this sprint's commits
if directed, via normal reviewed workflow. Do not reset shared worktrees,
rewrite history, remove unrelated files, or change frozen targets to fit lessons.

## Human review required

Yes for required owner teaching-plan decisions and final generated-output payload
authorization. Independent reviews are not owner approvals. Bundle review must
present calibration questions, planned review questions, exact rendered evidence
and comment prompts. Record reviewer answers/comments, analyze patterns, resolve
comments, ask targeted follow-ups only for ambiguity, and propose closure only
with explicit human confirmation. No repeated small-fragment handoffs absent a
real decision gate. PR231 merge authority is consumed and is not reusable.
