# ISSUE-223-GATE-0-1 Independent Planning Review Assignment

## Reviewer task

Independently decide whether Gate 0 is sufficiently complete and internally
coherent to authorize §2.1.1 student-facing implementation. This is a planning
review, not a content edit or final lesson review.

## Evidence to inspect

- `reports/sprints/ISSUE-223-GATE-0-1-plan.md`
- `reports/sprints/ISSUE-223-GATE-0-1-baseline.md`
- `references/data/sprints/ISSUE-223-GATE-0-1.plan.json`
- `references/authored/course-target-exercises.json` record `2.1.1`
- `references/owned/course-blueprint-v5.md` §2.1.1
- GitHub Issue #223
- Current §2.1.1 paragraph, exercises, answers, review, quality-ref, build
  script, figure assets, and rendered PDFs in the dedicated lesson worktree.
- The merged PR #222 policy and Part A authoring contracts named by the plan.

## Required checks

1. Exact platform/lesson baseline and target-authority freeze.
2. Complete goals, subquestions, operations, representations, answer forms,
   prior-knowledge boundary, and explicit non-target boundary.
3. One-to-one alignment with no target operation supplied only by optional work.
4. Exact seven-section disposition, compact-summary placement, paper-only route,
   both Startopgaven roles, guided optionality, and deliberate fading.
5. Question-level core route at 50–52 minutes including writing, table work,
   route reading, transitions, and contingency, without dropping target work.
6. Exact allowed/forbidden paths and stop conditions.
7. Evidence-based validator-gap decision and separation of the planning branch,
   platform guardrail branch, and lesson branch.
8. Baseline rendered-output findings and final every-page inspection plan.
9. Evidence gates for specialist review, lead review, exact-head CI, readiness,
   and governed integration.
10. Exact `_assets` inventory, explicit stale-zip removal, and creation of the
    required Part A `2.1.1-textbook-handoff.md` without companion output.

## Verdict format

Return `PASS` only if student-facing work may safely begin under this plan.
Otherwise return `REVISE` with numbered blocking findings, precise evidence,
and the correction required. Non-blocking improvements must be clearly
separated from blockers. Do not edit either repository.
