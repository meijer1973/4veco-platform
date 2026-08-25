# COMPANION-WORKFLOW-GUARDRAILS-1 Lead Review Assignment

Lead reviewer: `agents/lead-reviewer-agent.md`

## Requested Reviews

Run three lead-review passes:

1. **Plan review**: review
   `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-sprint-plan.md`
   before execution.
2. **Work review**: review the implemented diff, validation evidence, and
   correction log before PR publication.
3. **PR workflow review**: review the final commit/PR packet before the PR is
   presented for human review.

## Review Baselines

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `agents/lead-reviewer-agent.md`
- `skills/econ-companion-artifacts.md`
- `agents/econ-companion-visual-review.md`
- `skills/econ-quality-control.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `scripts/validate-paragraph.js`
- `scripts/tests/validate-paragraph.test.js`

## Required Decision

Use the lead-reviewer verdict vocabulary: PASS, PASS WITH FLAGS, REVISE, FAIL,
or PAUSE. For this sprint, treat PASS or an explicit OK/no-blockers result as
approval to proceed. Any REVISE/FAIL/PAUSE finding must name the file, blocker,
and proof required to close.
