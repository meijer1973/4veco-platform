# INSPECT-2 Bounded Pilot Evidence Audit

Status: audit complete, validated, and lead-reviewed
Date: 2026-06-08
Sprint: INSPECT-2
Profile audited: `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`

## Scope

Read-only audit of Book 1 Chapter 1.1 evidence against the Dutch v0 evidence
categories.

Audited live lesson scope:

- `1.1.1 Schaarste en economisch denken`
- `1.1.2 Percentages en indexcijfers`
- `1.1.3 Grafieken en tabellen`

Scope note: the human review text named `1.1.2 Ruilen en rekenen`, but the live
course blueprint, target-exercise registry, chapter plan, and lesson folder use
`1.1.2 Percentages en indexcijfers`. This audit uses the live source of truth.

## Evidence Inspected

Platform sources:

- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `references/data/inspection-standards/source-register.json`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-result.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/L1.7B-Q2-result.md`
- `reports/sprints/L1.7B-Q2-COPY-result.md`
- `reports/sprints/ENGINE-OP-1-result.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`

Lesson sources, inspected read-only:

- `../4veco-lessen/course_blueprint_v5.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/_chapter-plan.md`
- per-paragraph `_paragraph-plan.md`
- per-paragraph `*-quality-ref.yaml`
- per-paragraph `*-review.md`
- per-paragraph `*-companion-visual-review.md`
- paragraph, opgaven, antwoorden, generated HTML/PDF presence in the three
  paragraph folders

## Executive Finding

The Dutch v0 profile categories can locate real product evidence in the pilot
scope. The strongest categories are didactic quality, quality assurance, and
the product-side improvement cycle. Subject-relevant basic-skills evidence is
also strong when phrased carefully as product evidence for economic reasoning,
calculation, and graph/table/source handling.

The weak points are not category selection. The weak points are evidence
finality and coverage status:

- the `1.1.1`, `1.1.2`, and `1.1.3` target-exercise records are still
  `migrated_from_v4_needs_v5_review`;
- the target-exercise records have no `exam_codes`;
- only `1.1.2` has reviewed local target-equivalent exit-ticket completion
  copy;
- `1.1.1` remains advisory-check only;
- `1.1.3` still lacks target-equivalent graph/table exit-ticket proof;
- all three paragraphs are `PASS WITH FLAGS`, not clean final evidence.

Before schema design, the profile should be adjusted so future evidence records
can distinguish:

- artifact presence;
- reviewed artifact quality;
- target-exercise finality;
- target-equivalent proof;
- diagnostic report evidence;
- school-owned implementation evidence.

## Category Results

| Category | Pilot result | Evidence strength | Summary |
|---|---|---|---|
| `curriculum_offer` | usable but weak | `present_but_weak` | Blueprint, chapter plan, paragraph plans, target exercises, and generated lesson folders are easy to locate, but target exercises remain migrated/needs-review and exam-code links are empty. |
| `basic_skills` | strong if bounded | `present` | The three paragraphs expose subject-material evidence for reasoning, calculation, graph/table reading, source/value selection, and answer construction. This is not complete OP0 evidence. |
| `didactic_quality` | strong | `present` | Paragraph plans, Part A reviews, companion reviews, dual-coding contracts, procedures, worked examples, guided practice, and route surfaces provide strong product evidence. |
| `student_development_and_support` | uneven | `present_but_weak` | Checks, route panels, skilltree/math routes, and guided practice exist, but check status varies sharply by paragraph and no school support decision evidence exists. |
| `assessment_and_closure` | mixed/weak | `present_but_weak` | Target exercises and answer models exist; only `1.1.2` has reviewed local target-equivalent proof. `1.1.1` and `1.1.3` are not closure-proof ready. |
| `accessibility_and_inclusion` | usable but not complete | `present_but_weak` | Review records show alt text, layout, dark/mobile screenshot QA, and no internal-code exposure in several surfaces, but there is no unified inspection accessibility audit. |
| `quality_assurance` | strong | `present` | Quality-ref YAML, Part A reviews, companion reviews, validators, sprint reports, lead reviews, and full platform validation are robust product QA evidence. |
| `improvement_cycle` | strong product evidence | `present` | The repository records correction loops, human gates, lead reviews, carried flags, and next actions. This supports product improvement, not school self-evaluation replacement. |

## Detailed Findings

### 1. Curriculum Offer

Evidence found:

- `references/owned/course-blueprint-v5.md` lists `1.1.1`, `1.1.2`, and
  `1.1.3` as Chapter 1.1 theory paragraphs.
- `references/authored/course-target-exercises.json` contains target exercises
  for all three pilot paragraphs.
- The live lesson chapter plan names the three live theory paragraphs and their
  roles:
  - `1.1.1`: scarcity and opportunity cost reasoning;
  - `1.1.2`: percentage change and index numbers;
  - `1.1.3`: graph/table reading and drawing.
- The three paragraph folders contain paragraph, opgaven, antwoorden, generated
  HTML/PDF, review, and quality-ref evidence.

Weak or missing:

- all three target-exercise records are
  `migrated_from_v4_needs_v5_review`;
- target exercises have no `exam_codes`;
- the current profile has no field for target-exercise finality or live-title
  reconciliation;
- the audit had to resolve a title mismatch manually for `1.1.2`.

Product/school boundary:

4veco can show product curriculum sequence and paragraph-level target intent.
The school owns whole-curriculum planning, scheduling, enactment, and local
curriculum policy.

Profile adjustment before schema design:

Add explicit evidence-finality language for target exercises and title/source
reconciliation. The profile should not let future reports treat a migrated
target exercise as final-reviewed curriculum evidence.

### 2. Basic Skills

Evidence found:

- `1.1.1` target exercise and reviews cover economic reasoning around scarcity,
  opportunity costs, comparison, and explanation.
- `1.1.2` target exercise and lesson evidence cover percentage change, price
  index calculation, index-to-index percentage change, and index-point versus
  percentage reasoning.
- `1.1.3` target exercise and lesson evidence cover graph/table reading,
  economic axis convention, interpolation, percentage interpretation, and
  misleading-claim critique.
- `1.1.3` paragraph plan explicitly requires table values, graph reading,
  interpolation, and misleading-axis comparison learning objects.

Weak or missing:

- OP0 evidence is product-side and subject-material only;
- citizenship evidence is contextual, not a complete citizenship curriculum
  proof;
- language reasoning is present through answer construction, but not evidence
  of school-wide Dutch-language basic-skills practice.

Product/school boundary:

4veco can expose subject-material evidence relevant to OP0 basic skills:
calculation, graph/table/source interpretation, and economics answer reasoning.
The school owns deliberate basic-skills curriculum choices and classroom
practice across Dutch language, mathematics/arithmetic, and citizenship.

Profile adjustment before schema design:

Keep the current caution, but add a report-level label such as
`subject_material_basic_skills_evidence` so future outputs do not imply
complete OP0 school evidence.

### 3. Didactic Quality

Evidence found:

- `_chapter-plan.md` defines chapter dependencies, interleaving, dual coding,
  procedure plans, graph style, and the unified experience.
- `1.1.1` quality-ref records Part A and companion evidence, meaningful alt,
  checklist routing, artifact render cleanliness, and clean companion surfaces.
- `1.1.2` companion review records aligned four-step routes for percentage
  change, index numbers, and indexpoints versus percentage change.
- `1.1.3` paragraph plan and companion review record concrete graph/table
  learning objects and a closure rule that procedure parity is insufficient
  without visible learning objects.
- Part A reviews for all three return `PASS WITH FLAGS` with no unresolved
  hard fails.

Weak or missing:

- all three are `PASS WITH FLAGS`, not unconditional pass;
- some flags remain, such as duplicate exercise copies, process/design flags,
  scaffolded graph-game status, and later harder graph-reading variants;
- classroom enactment is not product evidence.

Product/school boundary:

4veco can expose planned and reviewed didactic design. The school owns actual
teacher practice, adaptation, class interaction, and lesson execution.

Profile adjustment before schema design:

Preserve `PASS WITH FLAGS` semantics. Future evidence records should carry
flag disposition, not collapse flagged reviews into simple pass/fail.

### 4. Student Development And Support

Evidence found:

- `CHECK-SHORT-EXIT-1` records first-three-paragraph check-surface inventory.
- `1.1.1` has advisory `Korte check` only.
- `1.1.2` has a reviewed local target-equivalent exit ticket and approved
  local completion copy, but lacks a separate advisory short check.
- `1.1.3` lacks both advisory short check and target-equivalent graph/table
  exit-ticket proof.
- Skilltree/math/graph/reasoning routes and guided practice provide local
  practice and remediation-style support surfaces.

Weak or missing:

- support evidence is uneven across the three pilot paragraphs;
- no product evidence shows school-owned care plans, intervention decisions, or
  student-monitoring records;
- the profile does not yet separate advisory support from target-equivalent
  closure evidence.

Product/school boundary:

4veco can expose local practice routes, hints, route panels, and advisory
checks. The school owns student monitoring, support decisions, intervention
records, and accommodations.

Profile adjustment before schema design:

Add explicit distinction between advisory support evidence and closure/target
proof. Do not let future reports count all checks as the same evidence type.

### 5. Assessment And Closure

Evidence found:

- Target exercises exist for all three pilot paragraphs in
  `references/authored/course-target-exercises.json`.
- Opgaven and antwoorden markdown/PDF files exist in the paragraph folders.
- `GAME-ARCH-2-target-operation-coverage.md` maps target-operation chains for
  `1.1.1`, `1.1.2`, and `1.1.3`.
- `L1.7B-Q2` implemented the first reviewed target-equivalent exit-ticket
  candidate for `1.1.2`.
- `L1.7B-Q2-COPY` enabled exact local non-summative completion copy for the
  reviewed `1.1.2` proof only.

Weak or missing:

- `1.1.1` lacks target-equivalent A43/B01/B02 proof;
- `1.1.3` lacks target-equivalent graph/table exit-ticket proof;
- target exercises remain migrated and need v5 review;
- deterministic text matching for `1.1.2` is accepted only as local proof, not
  broad semantic scoring;
- no summative or school assessment evidence is present.

Product/school boundary:

4veco can expose target exercises, answer models, and reviewed local
non-summative checks. The school owns PTA, grading, transition decisions,
formal assessment policy, and summative judgement.

Profile adjustment before schema design:

Add `target_equivalent_status` or equivalent language before schema design.
The profile should require paragraph-specific proof state and must not infer
closure evidence from target-exercise presence alone.

### 6. Accessibility And Inclusion

Evidence found:

- `1.1.1` companion review records meaningful alt text, route blocks, DOCX
  render health, surface-adapted visual variants, and no hard fails.
- `1.1.2` companion review records browser screenshot QA for representative
  wide/narrow and light/dark states and no student-facing internal unit codes.
- `1.1.3` companion review records desktop/mobile light/dark screenshot QA,
  concrete visual learning objects, and ordinary student language rather than
  internal code exposure.
- Quality-ref files record surface status and hard-fail counts.

Weak or missing:

- evidence is review-record based rather than one unified accessibility audit;
- keyboard/focus and inclusive-usability proof are not uniformly present in the
  pilot evidence;
- individual accommodations are school-owned.

Product/school boundary:

4veco can expose product accessibility and inclusive-language evidence. The
school owns individual accommodations, device access, and implementation
support.

Profile adjustment before schema design:

Keep accessibility as a category, but require sub-evidence labels for alt text,
contrast/theme, mobile, keyboard/focus, semantic structure, and inclusive
language. Do not treat one screenshot QA record as full accessibility proof.

### 7. Quality Assurance

Evidence found:

- Quality-ref YAML exists for all three pilot paragraphs with schema version 2.
- Part A reviews and companion visual reviews exist for all three.
- `1.1.1`, `1.1.2`, and `1.1.3` reviews record `PASS WITH FLAGS` and hard
  fails open as zero where applicable.
- Platform sprint reports record lead review, validation, flags, and boundaries
  for check surfaces, task families, engine operations, and exit-ticket proof.
- Full platform validation passed in INSPECT-1A and will be rerun for this
  sprint.

Weak or missing:

- generated reports are diagnostic evidence, not primary proof;
- quality-ref integration is still not authorised for inspection evidence;
- no inspection-specific validator exists, by design.

Product/school boundary:

4veco can expose its own product QA process and review records. The school owns
school-level quality assurance, self-evaluation, and inspection conversation.

Profile adjustment before schema design:

Keep quality assurance as strong product evidence, but label generated reports
as diagnostic unless they point to source/review artifacts.

### 8. Improvement Cycle

Evidence found:

- The quality-standards track now has INSPECT-0, INSPECT-1, INSPECT-1A, and
  INSPECT-2 sprint records.
- INSPECT-1A consumed human feedback, corrected source/claim hygiene, validated
  the packet, and received human correction-review PASS.
- Lesson and platform roadmap records preserve carried flags and stop
  conditions for target-equivalent proof, Scale Gate, and generated-output
  mutation.
- Review files document correction loops, lead-review rounds, and residual
  flags.

Weak or missing:

- this is product improvement evidence, not school improvement-cycle evidence;
- no school self-evaluation artifacts are present or expected in product
  evidence.

Product/school boundary:

4veco can expose a disciplined product improvement cycle. It cannot replace a
school's own quality cycle or inspection preparation narrative.

Profile adjustment before schema design:

Add boundary language that product improvement evidence may support school
preparation but is not school SKA evidence by itself.

## Cross-Category Lessons

Strong categories:

- `basic_skills`, when phrased as subject-material evidence only;
- `didactic_quality`;
- `quality_assurance`;
- `improvement_cycle`.

Implicit or usable-but-weak categories:

- `curriculum_offer`, because target exercises and live chapter structure exist
  but target finality and exam-code linkage are weak;
- `student_development_and_support`, because support routes exist but are
  uneven and not school monitoring evidence;
- `assessment_and_closure`, because target exercises and answer models exist
  but target-equivalent proof is only reviewed for `1.1.2`;
- `accessibility_and_inclusion`, because review evidence exists but is not a
  complete accessibility audit.

Missing evidence:

- complete OP0/basic-skills evidence;
- school implementation evidence;
- school support decisions;
- school assessment policy;
- school quality assurance records;
- inspectorate approval or compliance evidence;
- target-equivalent proof for `1.1.1` and `1.1.3`;
- final-reviewed v5 target-exercise status for all three pilot paragraphs.

## Profile Adjustment Recommendations Before Schema Design

1. Add evidence-finality language before schema design.
   Future records should distinguish `artifact_present`, `reviewed_quality`,
   `pass_with_flags`, `target_exercise_migrated`, `target_exercise_reviewed`,
   `target_equivalent_reviewed`, and `diagnostic_report_only`.

2. Add target-equivalent proof boundary language.
   Target exercises and answer models are not the same as reviewed closure
   proof. `1.1.2` is local reviewed proof; `1.1.1` and `1.1.3` are not.

3. Add subject-material OP0 wording.
   Keep OP0 evidence as subject-material support for basic skills. Do not
   allow future reports to describe it as complete OP0 evidence.

4. Add title/source reconciliation expectation.
   Audit packets should cite the live blueprint/title and flag mismatches like
   the `1.1.2` review-text title mismatch.

5. Preserve report diagnostic status.
   Reports can direct reviewers to evidence but should not become primary
   proof unless they cite the source/review artifacts they summarize.

6. Preserve product/school boundary per category.
   Future schema design should require a boundary note per category so product
   evidence cannot silently become school evidence.

## Recommendation

Do not start schema design immediately from INSPECT-2. First have a human review
the pilot audit and decide whether to insert a small profile-adjustment sprint
that updates the Dutch v0 profile language for evidence finality, target-proof
status, and product/school boundaries.

## Explicit Non-Claims

This audit does not claim:

- Dutch inspection compliance;
- inspectorate approval;
- legal compliance;
- complete OP0/basic-skills evidence;
- complete school-level evidence;
- target-equivalent proof beyond the reviewed local `1.1.2` case;
- readiness for schemas, validators, generated evidence packs, dashboard gates,
  quality-ref integration, Scale Gate integration, or generated lesson-output
  changes.

## Required Next Action

Run validation and lead review, then send INSPECT-2 for human review. The next
human decision should choose between a small profile-adjustment sprint and
schema design; this audit recommends profile adjustment first.
