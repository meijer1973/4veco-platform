# Sprint EX-LESSON-1: Result

Generated: 2026-05-30

Status: completed.

## Plan reference

Plan: `reports/sprints/EX-LESSON-1-plan.md`

## Summary

EX-LESSON-1 converted the exam-ingestion end state from stable specification
language into operational paragraph-build, review, and roadmap requirements.
The sprint did not build an exam-target paragraph and did not generate lesson
output. It made the handoff concrete so later GAME-UX-3A, L-EX0/L-EX1,
L1.7B-Q2, GATE-L1.7B-Q2, and Scale Gate 1 work can inspect a route trace
instead of relying on architecture words.

Completed changes:

- added the EX-LESSON-1 exam-target route checklist;
- updated `BUILD-PARAGRAPH.md` with required exam-target route trace and
  answer-form chain requirements;
- added an `Exam-target route trace` section to the paragraph-plan template;
- updated companion/textbook authoring guidance to require correction-model,
  source, route, task-shell, exit-ticket, and answer-model traceability;
- updated teacher-learning-quality and student-experience review prompts so
  exam-target routes are judged as student-facing operational routes;
- updated the lesson and platform roadmaps so EX-LESSON-1 is closed and
  GAME-UX-3A is the active next dependency;
- archived the previous platform roadmap as v3.18 and made v3.19 the active
  roadmap version;
- added lesson-side archive records for EX-LESSON-1.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-LESSON-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js EX-LESSON-1` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js EX-LESSON-1 --complete` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `rg -n "Exam-target route trace|official correction model|source annexes|shared task shell|target-equivalent exit ticket" BUILD-PARAGRAPH.md build-scripts/templates/template-paragraph-plan.md skills/econ-companion-artifacts.md skills/econ-textbook-paragraph.md agents/teacher-learning-quality-review-agent.md agents/student-experience-review-agent.md` | passed |
| `rg -n "EX-LESSON-1|GAME-UX-3A|MTU-H4C|Exam-target" references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Platform guidance and sprint records:

- `BUILD-PARAGRAPH.md`
- `build-scripts/templates/template-paragraph-plan.md`
- `skills/econ-companion-artifacts.md`
- `skills/econ-textbook-paragraph.md`
- `agents/teacher-learning-quality-review-agent.md`
- `agents/student-experience-review-agent.md`
- `reports/sprints/EX-LESSON-1-plan.md`
- `reports/sprints/EX-LESSON-1-baseline.md`
- `reports/sprints/EX-LESSON-1-planning-review.md`
- `reports/sprints/EX-LESSON-1-exam-target-route-checklist.md`
- `reports/sprints/EX-LESSON-1-result.md`
- `reports/sprints/EX-LESSON-1-diff-summary.md`
- `references/data/sprints/EX-LESSON-1.plan.json`
- `references/data/sprints/EX-LESSON-1.result.json`

Roadmaps and indexes:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.18-mtu-h4c-answer-form-executed.md`
- generated repository maps, URL indexes, source registries, document
  inventories, and internal dashboard outputs refreshed for remote navigation.

Lesson-side planning archive:

- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/EX-LESSON-1/EX-LESSON-1-sprint-plan.md`
- `../4veco-lessen/archive/sprints/EX-LESSON-1/EX-LESSON-1-closure-log.md`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` were not edited. `references/authored/course-target-exercises.json`
did not receive `question_type`, `answer_form`, or mapping fields.

No `references/data/exam-ingestion/answer-skill-candidates.json` file was
created, and no candidate writes occurred. No generated lesson output under
`../4veco-lessen/Boek *` changed. No engine implementation changed. No
diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use was authorized.

The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` file remained
untouched and uncommitted.

## Open follow-ups

- Proceed to `GAME-UX-3A` as the shared task-type UX foundation sprint.
- Keep answer-form units from MTU-H4C generator-blocked/non-interactive until
  a later implementation or no-exposure design authorizes use.
- Keep target-exercise `question_type` and `answer_form` fields out of scope
  until a separate authored-reference mutation packet exists.
- Use the EX-LESSON-1 checklist in L-EX0/L-EX1, L1.7B-Q2, GATE-L1.7B-Q2, and
  Scale Gate 1 when official exam evidence is involved.

## Rollback instructions

If EX-LESSON-1 must be reverted, roll back only the sprint records, route
checklist, guidance/template wording, roadmap updates, lesson-side archive
records, roadmap archive/version-index records, and generated maps/indexes.
Do not hand-edit `references/machine/`, `references/external/`, generated
lesson output, target-exercise mappings, or answer-skill candidate storage as
part of rollback.
