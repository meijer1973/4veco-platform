# CHECK-SHORT-EXIT-1 Lead Review Assignment

Generated: 2026-06-01

Sprint: `CHECK-SHORT-EXIT-1`

Reviewer: lead reviewer agent `Ampere` (`019e8243-1d59-7c23-b24c-ec21f9c6ae5e`)

## Scope

Review the completed paragraph check-surface inventory and contract before
sprint closure. This is an audit/contract sprint only. The review must decide
whether the first three paragraphs now have a deterministic, evidence-backed
status for advisory short checks and target-equivalent exit tickets, and
whether the roadmap correctly points to `STANDARD-EXERCISES-1` next.

## Evidence To Inspect

- `reports/sprints/CHECK-SHORT-EXIT-1-plan.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-baseline.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-planning-review.md`
- `references/data/sprints/CHECK-SHORT-EXIT-1.plan.json`
- `reports/sprints/CHECK-SHORT-EXIT-1-inventory.md`
- `reports/json/check-short-exit-inventory.json`
- `build-scripts/sprints/check-check-short-exit1-inventory.js`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/1.1.1.json` as read-only evidence
- `source-data/book-1/exit-ticket/1.1.2.json` as read-only evidence
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

## Required Review Questions

1. Does the inventory correctly classify `1.1.1` as advisory short check only,
   with target-equivalent proof still missing?
2. Does the inventory correctly classify `1.1.2` as reviewed local
   target-equivalent exit ticket, while recording the separate advisory short
   check as missing?
3. Does the inventory correctly classify `1.1.3` as missing both advisory
   short check and target-equivalent graph/table exit ticket?
4. Are hints, task types, landing visibility, target-readiness evidence, and
   completion-language status recorded clearly enough to drive later work?
5. Does the checker validate the important source/generated/landing facts and
   guard against accidental source, engine, protected-reference, target
   exercise, or generated-output mutation?
6. Do the platform and lesson roadmaps close `CHECK-SHORT-EXIT-1`, point next
   to `STANDARD-EXERCISES-1`, and continue blocking Scale Gate 1 until
   `GATE-PRODUCT-3P` and `REV-STD-1` close or are explicitly waived?
7. Did the sprint avoid generated output, source exit-ticket writes, engine
   implementation, protected reference mutation, target-exercise writes,
   candidate storage, diagnostics, adaptive routing, mastery/sequencing,
   student-facing AI, summative use, PV, Scale Gate 1, and product-wide use?

## Expected Output Format

Return a strict lead-review report using the repo-required headings:

- `# Lead Review Summary`
- `Sprint: `CHECK-SHORT-EXIT-1``
- `Round: lead review round 1`
- `## Scope`
- `## Review Plan`
- `## Consolidated Verdict`
- `## Blocking Findings`
- `## Specialist Findings`
- `## Test Evidence`
- `## Learning Quality Evidence`
- `## Student Experience Evidence`
- `## Ownership and Handoff`
- `## Required Next Action`

Valid round-1 verdicts are `PASS`, `PASS WITH FLAGS`, `REVISE`, `PAUSE`, or
`FAIL`. If any paragraph status is unsupported by evidence, or if the sprint
quietly weakens the short-check versus exit-ticket distinction, return
`REVISE`, not `PASS WITH FLAGS`.
