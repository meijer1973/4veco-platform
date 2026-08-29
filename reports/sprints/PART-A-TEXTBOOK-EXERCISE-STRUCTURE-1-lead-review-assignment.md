# Lead Review Assignment

Sprint: `PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1`

Generated: 2026-08-29

Assigned reviewer: independent lead-review agent.

## Assignment

Independently review the platform-only implementation of GitHub issue 218
against the original issue, the attachment interpretation, the governed sprint
plan, and the active source diff. This is an authoring-contract sprint, not a
Book 2 paragraph build and not a lesson-output change.

Evidence to inspect includes:

- `skills/econ-exercise-builder.md` as the operational source;
- `references/authored/didactiek-principes.md` as the rationale source;
- every active inheritance/review/build/rendering surface named in the plan;
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.js` and
  `build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js`;
- `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-teacher-learning-quality-review.md`;
- `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-command-log.jsonl`; and
- the clean detached lesson validation worktree at `../4veco-lessen`.

## Non-negotiable Requirements

1. Scope is newly authored Book 2+ Part A; Book 1 is frozen and no lesson file
   is retrofitted or scanned by the new source-contract checker.
2. Backward design is goals -> doeloefening -> target operations -> example and
   practice, with the exact required alignment-table columns.
3. The seven printed headings are contiguous and exactly ordered, with theory
   directly followed by Uitgewerkt voorbeeld and then Startopgaven.
4. Startopgaven contains taught-prerequisite retrieval and a compact
   current-content comprehension check under one heading, without mastery,
   diagnosis, or automatic-routing claims.
5. Begeleide inoefening remains a printed heading but is optional for students,
   retains the same goal/target, uses stronger scaffolding, deliberately fades,
   and has neutral skip wording.
6. The core route `Startopgaven -> Zelfstandige oefening -> Doeloefening` fits
   realistic student work time in one 55-minute lesson.
7. Bonus creates cognitive flexibility; closing review has 1–2 accessible
   cumulative/homework tasks and no new theory.
8. Summary follows section 7; website help is only a subordinate optional Part
   B pointer inside Startopgaven; the Part B route is not printed as Part A.
9. The guardrail is wired into normal CI, has meaningful mutation coverage,
   and is discoverable through repository maps/indexes.
10. No Book 2 paragraph, rendered textbook page, or student-facing lesson output
    is produced in this sprint.

## Review Plan

Classify every original requirement as met/not met/not applicable. Inspect the
teacher specialist report and logged test evidence. Return round 1 using the
required `# Lead Review Summary` format and only PASS when every core
requirement is met. Rendered-output proof is not applicable because this sprint
changes source contracts only and explicitly forbids paragraph production.

## Required Next Action

Write round 1, allow the implementation owner to record/apply corrections, and
perform a separate round 2 recheck before draft-PR publication.
