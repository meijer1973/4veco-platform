# Sprint SPEC-ET-1: Exit Ticket Target-Equivalent Specification Correction

Date: 2026-05-29

Status: planned from human specification report.

## Goal

Correct the stable lesson product specifications and roadmaps so the exit
ticket end state is target-equivalent proof, not merely readiness-to-try.
The corrected specification must say that a successful exit ticket checks the
same reviewed target-exercise operation chain at the same cognitive level with
matching answer forms, and may justify only local non-summative paragraph
completion language.

The sprint must also strengthen exam-ingestion end-product integration:
official CvTE and CvTE-derived tasks must trace prompt, source material,
figures/tables/graphs, correction model, point allocation, answer-construction
requirements, concepts, calculations, graph/table/source operations,
reasoning operations, and answer-writing requirements into the student route.

This sprint must not generate lesson output, change engine code, mutate
protected reference data, create candidate storage, write candidate records,
refresh generated projections, activate `Check` surfaces, or authorize
diagnostics, adaptive routing, mastery, sequencing, summative use,
student-facing AI, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Context

The lesson and platform roadmaps already contain the shared task-type UI and
operational engine proof track from SYNC-4. The new human report states that
the current product specification still underclaims the intended exit-ticket
standard because it says the exit ticket checks whether a student is ready to
try the target exercise.

The intended end state is stronger:

```text
The exit ticket is the paragraph target-equivalent proof task.
Correct completion demonstrates, locally and non-summatively, that the student
can complete the paragraph target exercise operation chain.
```

The report also asks the roadmaps to make exam ingestion part of the
student-facing end product, not only a reference-platform north star.

## Quality Standard

The quality floor is a coherent specification correction across the stable
product files and the active roadmaps. The specification must replace
readiness-to-try language with target-equivalent proof language without
weakening product boundaries. Rendered output is out of scope for this sprint,
but future student-facing exit-ticket output must be judged against this
corrected specification. Proof must come from direct spec diffs, roadmap
entries, sprint bundle validation, roadmap-index validation, active wording
searches, and clean diff checks. Follow-up must be explicit: proceed to the
next governed gate or implementation sprint, or pause if a future task cannot
meet the target-equivalent standard.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exit ticket is target-equivalent proof | `product-end-state.md` and `companion-core-specifications.md` define the exit ticket as a same-level proof task over the complete reviewed operation chain | Search and diff prove readiness-to-try language is replaced in active spec sections | planned |
| Local completion language is allowed only after target-equivalent approval | Companion spec contains checkpoint-only copy, target-equivalent approved copy, and prohibited summative/mastery/diagnostic claims | Roadmap `GATE-L1.7B-Q2` row and detailed section match the copy hierarchy | planned |
| Exam ingestion is student-route end state | Product spec adds exam-ingestion end-state route trace from official prompt/correction model to paragraph plan, route, task shell, exit ticket, and answer model | Roadmaps include `EX-LESSON-1` and require exam-style answer-form support in GAME-UX-3A | planned |
| Shared task shell supports target-equivalent work | GAME-UX-3A rows state the shell serves target-equivalent exit tickets, graph/table practice, math/calculation practice, and exam-style answer-form requirements | Active lesson and platform roadmaps name the strengthened dependency | planned |
| Scale Gate cannot treat weak checks as proof | Scale Gate rows require target-equivalent status or explicit waiver with checkpoint-only consequences | Roadmap search shows Scale Gate language distinguishes proof from local practice check | planned |
| No unauthorized output or mutation | Diff contains only specification, roadmap, sprint-log, archive/index, and generated map/index records | Sprint result and git diff prove no lesson output, engine code, protected reference mutation, or product-use authority changed | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add explicit copy hierarchy for checkpoint-only versus target-equivalent completion | `include_now` | The report names the exact student-facing distinction that was missing. |
| Add exam-ingestion end-state section to the product spec | `include_now` | The report says exam ingestion must be tied to the student-facing route. |
| Rename current roadmap Q2/gate wording to target-equivalent proof | `include_now` | The current active roadmap rows still use readiness wording. |
| Build or regenerate an exit-ticket surface now | `reject_scope_creep` | This sprint is specification and roadmap correction only. |
| Create new answer-form MTUs, target-exercise fields, or answer-skill candidates | `reject_scope_creep` | Those require separate governed gates and are outside this sprint. |
| Implement GAME-UX-3A task shell now | `defer_named_follow_up` | GAME-UX-3A remains the platform implementation dependency after this spec correction. |

## Allowed paths

- `reports/sprints/SPEC-ET-1-*`
- `references/data/sprints/SPEC-ET-1.*.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.13-*`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/SPEC-ET-1/*`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories needed for remote reviewer navigation

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- engine source changes in `engines/`
- generated lesson output under `../4veco-lessen/Boek *`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- candidate-storage creation or candidate writes
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- generated projection refresh based on unexecuted source mutation
- lesson-output mutation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- human report in the current Codex task
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `references/reference-team-roadmap.md`
- `reports/sprints/SYNC-4-plan.md`
- `references/data/sprints/SYNC-4.plan.json`
- `reports/sprints/MTU-H4A-plan.md`
- `references/data/sprints/MTU-H4A.plan.json`

## Outputs

- Corrected product-end-state and companion-core specifications.
- Updated lesson roadmap with `SPEC-ET-1`, `EX-LESSON-1`, target-equivalent
  Q2/gate wording, GAME-UX-3A framing, and Scale Gate consequences.
- Updated platform roadmap and roadmap version index.
- SPEC-ET-1 sprint plan, baseline, planning review, result, diff summary, and
  JSON metadata.
- Lesson-side SPEC-ET-1 archive records.
- No generated lesson output, no engine implementation, no protected
  reference mutation, no candidate storage, no candidate writes, no target
  exercise mutation, no projection refresh, and no product-use authority.

## Operationalized sprint procedure

1. Record the baseline: current specs use readiness-to-try language, current
   roadmaps use Q2/readiness wording, and protected references plus generated
   lesson output are out of scope. Stop if the requested correction would
   require protected source mutation or generated output.
2. Patch `product-end-state.md` and `companion-core-specifications.md` so the
   active exit-ticket specification says target-equivalent proof, defines
   local non-summative completion language, and preserves all prohibited
   grade/mastery/diagnostic/sequencing/product-use claims.
3. Patch lesson and platform roadmaps so SPEC-ET-1 is recorded, EX-LESSON-1 is
   added, GAME-UX-3A is framed as shared task UI for target-equivalent exit
   tickets and exam-style answer forms, L1.7B-Q2/GATE-L1.7B-Q2 use
   target-equivalent proof wording, and Scale Gate 1 cannot rely on weak checks
   unless explicitly waived with checkpoint-only consequences.
4. Archive the previous platform roadmap version and update version indexes.
   Stop if the roadmap checker or sprint bundle checker cannot reconcile the
   new version.
5. Run acceptance tests and wording searches. If any active spec section still
   presents readiness-to-try as the end state, revise before closure.
6. Publish both repositories after validation unless remote state is behind or
   diverged. If remote state is not current, stop, fetch, reconcile, and report
   the required decision.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SPEC-ET-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js SPEC-ET-1
node build-scripts/sprints/check-sprint-bundle.js SPEC-ET-1 --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "target-equivalent|SPEC-ET-1|EX-LESSON-1|GAME-UX-3A|L1\\.7B-Q2|GATE-L1\\.7B-Q2|Scale Gate 1" ..\4veco-lessen\specifications ..\4veco-lessen\lessen-team-roadmap.md references\reference-team-roadmap.md
powershell -NoProfile -Command "if (rg -n 'ready to try|klaar om de eindopgave te proberen|target-exercise-readiness complete' ..\4veco-lessen\specifications\product-end-state.md ..\4veco-lessen\specifications\companion-core-specifications.md) { exit 1 } else { exit 0 }"
git diff --check
git -C ..\4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include sprint checker and bundle validator
validation, roadmap-version validation, acceptance test results, active wording
searches, diff checks for both
repositories, no protected reference data changes, no lesson-output or engine
implementation changes, updated repository maps/indexes, and a clear next
action: run GATE-MTU-H4A, proceed to EX-LESSON-1 or GAME-UX-3A when
authorized, or pause if target-equivalent proof cannot be supported by the
current task shell.

## Rollback plan

SPEC-ET-1 must not mutate protected reference data, generated lesson output,
engine code, candidate storage, or target-exercise records. If the correction
is rejected, roll back only the SPEC-ET-1 sprint logs, the specification
wording changes, roadmap rows, roadmap archive/index records, and generated
repository maps. Any later implementation of target-equivalent exit tickets,
exam-target paragraphs, answer-form MTUs, or shared task shell behavior needs
its own rollback path.

## Human review required

No interactive human review gate is required to write this specification
correction because the user supplied the explicit correction report and asked
Codex to update the repository. Later student-facing authority still requires
the named gates: `GATE-MTU-H4A` before answer-form execution planning,
`GATE-L1.7B-Q2` before target-equivalent completion copy, `GATE-ENGINE-1`
before engine scale, and Scale Gate 1 before broad controlled production.
