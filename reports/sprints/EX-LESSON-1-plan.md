# Sprint EX-LESSON-1: Exam-Ingestion End-State Integration

Date: 2026-05-30

Status: planned from active roadmap row after MTU-H4C.

## Goal

Turn the exam-ingestion end state from a product-spec statement into concrete
lesson-build and review-gate requirements. Official CvTE and CvTE-derived target
exercises must trace prompt, source annexes, figures/tables/graphs, correction
model, point allocation, answer-construction requirements, concepts,
calculations, graph/table/source operations, reasoning operations, and
answer-writing requirements into the paragraph plan, explanation, skill-map
route, practice route, shared task shell, target-equivalent exit ticket, and
answer model.

This sprint must not generate lesson output, mutate protected references, write
target-exercise fields, create candidate storage, write candidate records,
refresh projections, or authorize diagnostics, adaptive routing, mastery,
sequencing, summative use, student-facing AI, PV projection, PV machine
promotion, Scale Gate 1, or student/product use.

## Context

SPEC-ET-1 already corrected the stable product and companion specifications so
exam ingestion is part of the student-facing end product. MTU-H4C has now
executed the bounded answer-form MTU lane, but those new units remain
generator-blocked/non-interactive and no target-exercise mappings or lesson
surfaces are authorized.

The active roadmap now names EX-LESSON-1 as the next sprint before GAME-UX-3A.
The gap is operational: paragraph builders and review gates need an explicit
checklist that prevents official exam evidence from staying as background
reference data while the student route remains under-specified.

## Quality Standard

The quality floor is an operational specification handoff, not a paper label.
The sprint must make the specification usable by future paragraph builders and
reviewers: an exam-target paragraph must have a visible trace from official
exam evidence to the student-facing route and answer model. Rendered output is
out of scope, but future rendered output must be reviewable against the checklist
created here. Proof must include concrete changes to paragraph-plan
requirements, build handoff guidance, roadmap state, sprint records, validators
where available, diff checks, and named follow-up work for GAME-UX-3A,
ENGINE-OP-1, L-EX0/L-EX1, L1.7B-Q2, and Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exam-target paragraphs trace official evidence into the student route | `BUILD-PARAGRAPH.md` and `template-paragraph-plan.md` require official prompt/source/correction-model/answer-form route-trace sections | Search/diff shows paragraph-plan and build guide contain the route trace checklist | planned |
| Companion and task-shell handoff is explicit | Companion authoring skill requires exam-target route trace checks before graph/math/checkpoint artifacts are built | Active skill wording links source/correction-model evidence to shared task shell, skill-map route, exit ticket, and answer model | planned |
| Review gates know what to inspect | EX-LESSON-1 handoff/checklist record names gate evidence for official prompt/source/correction-model/answer-form trace | Sprint result and roadmap point future GATE-L1.7B-Q2/Scale Gate review to the checklist | planned |
| Lesson roadmap reflects current H4C and EX-LESSON state | `../4veco-lessen/lessen-team-roadmap.md` records H4B/H4C closure, closes EX-LESSON-1, and makes GAME-UX-3A next | Lesson diff and platform sprint result prove no generated output changed | planned |
| Platform roadmap advances after EX-LESSON-1 | `references/reference-team-roadmap.md` marks EX-LESSON-1 complete and makes GAME-UX-3A the next operational dependency | Roadmap version index validates with archived v3.18 and active v3.19 | planned |
| No unauthorized mutation or product use | Diff excludes `references/machine/`, `references/external/`, target-exercise field writes, candidate storage, and generated lesson output | Baseline/result records plus git diff prove protected surfaces unchanged | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a reusable exam-target route checklist as a sprint handoff artifact | `include_now` | It makes the product-spec requirement concrete for future builders and reviewers. |
| Add exam-target sections to the paragraph-plan template | `include_now` | Future exam-target builds need a place to record traceability before output exists. |
| Update companion authoring checks for official correction-model evidence | `include_now` | The shared task shell and exit ticket cannot be designed honestly without answer-form evidence. |
| Build an exam-target paragraph now | `reject_scope_creep` | L-EX1 remains the later controlled implementation sprint. |
| Implement GAME-UX-3A task shell now | `defer_named_follow_up` | GAME-UX-3A is the next platform implementation dependency after this handoff closes. |
| Write `question_type` or `answer_form` fields to target exercises | `reject_scope_creep` | Those fields require a separate authored-reference mutation route. |

## Allowed paths

- `reports/sprints/EX-LESSON-1-*`
- `references/data/sprints/EX-LESSON-1.*.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.18-*`
- `BUILD-PARAGRAPH.md`
- `build-scripts/templates/template-paragraph-plan.md`
- `skills/econ-companion-artifacts.md`
- `skills/econ-textbook-paragraph.md`
- `agents/teacher-learning-quality-review-agent.md`
- `agents/student-experience-review-agent.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/EX-LESSON-1/*`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories needed for remote reviewer navigation

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- generated lesson output under `../4veco-lessen/Boek *`
- engine implementation changes in `engines/`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- candidate-storage creation or candidate writes
- target-exercise `question_type`, `answer_form`, or mapping writes
- projection refresh based on unexecuted source mutation
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `BUILD-PARAGRAPH.md`
- `build-scripts/templates/template-paragraph-plan.md`
- `skills/econ-companion-artifacts.md`
- `skills/econ-textbook-paragraph.md`
- H4/H4A/H4B/H4C sprint and gate records as current answer-form context

## Outputs

- EX-LESSON-1 sprint plan, baseline, planning review, result, diff summary, and
  JSON metadata.
- A concrete exam-target route checklist/handoff record under
  `reports/sprints/`.
- Updated paragraph-build guide and paragraph-plan template for exam-target
  route traceability.
- Updated companion/textbook authoring guidance and relevant review-agent
  prompts.
- Updated lesson and platform roadmaps with EX-LESSON-1 completed and
  GAME-UX-3A as next operational dependency.
- Lesson-side archive records for EX-LESSON-1.
- No generated lesson output, no protected reference mutation, no target
  exercise field writes, no candidate storage, no projection refresh, and no
  product-use authority.

## Operationalized sprint procedure

1. Record baseline: EX-LESSON-1 is active, stable specs already state the
   end-state, the paragraph-plan template and authoring/review guides need
   operational route-trace requirements, and protected/generated surfaces are
   out of scope. Stop if any required change would require protected reference
   mutation or generated lesson output.
2. Create a platform-side exam-target route checklist that future L-EX0/L-EX1,
   GAME-UX-3A, L1.7B-Q2, GATE-L1.7B-Q2, and Scale Gate 1 can reference.
3. Patch `BUILD-PARAGRAPH.md` and `template-paragraph-plan.md` so official
   exam-target paragraphs must record prompt/source/correction-model/point
   allocation/answer-form/operation-chain traceability before production
   reliance.
4. Patch companion/textbook authoring and review guidance so future generated
   surfaces must check the route trace rather than only content coverage.
5. Update the lesson roadmap and platform roadmap: close EX-LESSON-1, carry
   H4C as completed answer-form context, keep all product-use blocks, and make
   GAME-UX-3A the next operational dependency.
6. Refresh maps/indexes, run acceptance tests, and stop if scope-language,
   roadmap, sprint-bundle, or diff checks fail.
7. Fetch, reconcile, commit, and push both repositories. If either repo is
   behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-LESSON-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-LESSON-1
node build-scripts/sprints/check-sprint-bundle.js EX-LESSON-1 --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "Exam-target route trace|official correction model|source annexes|shared task shell|target-equivalent exit ticket" BUILD-PARAGRAPH.md build-scripts/templates/template-paragraph-plan.md skills/econ-companion-artifacts.md skills/econ-textbook-paragraph.md agents/teacher-learning-quality-review-agent.md agents/student-experience-review-agent.md
rg -n "EX-LESSON-1|GAME-UX-3A|MTU-H4C|Exam-target" references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include sprint checker and bundle validator
validation, roadmap-version validation, scope-language validation, active
wording searches for the exam-target route trace, diff checks in both repos,
no protected reference data changes, no generated lesson output changes,
updated repository maps/indexes, and a clear next action: proceed to GAME-UX-3A
or pause if the shared task shell cannot consume the handoff.

## Rollback plan

EX-LESSON-1 must not mutate protected references, generated lesson output,
engine code, candidate storage, target-exercise records, or projections. If
the sprint is rejected, roll back only the EX-LESSON-1 sprint records, build
guidance/template wording, lesson/platform roadmap updates, roadmap archive and
version-index records, and generated maps/inventories/indexes. Future generated
exam-target paragraph output belongs to L-EX1 or another explicitly governed
implementation sprint.

## Human review required

No interactive human review gate is required for this documentation and
handoff integration sprint because the active roadmaps already authorize
EX-LESSON-1 after MTU-H4C. Later student-facing authority still requires the
named gates: GAME-UX-3A for task-shell implementation, GATE-ENGINE-1 before
engine scale, GATE-L1.7B-Q2 before target-equivalent completion copy, and Scale
Gate 1 before controlled production reliance.
