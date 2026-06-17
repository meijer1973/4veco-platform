# TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1 Lead Review Assignment

Generated: 2026-06-16

## Assignment

Act as the lead reviewer for `TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1`.
Inspect whether the sprint correctly implements the rendered-page acceptance
policy requested by the replacement sprint report and whether the sprint may
close under REV-STD-1.

Scope: this is a platform-only policy task. The review covers the authored
standard, textbook workflow wiring, sprint evidence, and lesson-side no-change
proof; it does not review or authorize generated lesson output.

## Product End-State

Future textbook and chapter-page work must preserve markdown and structured
target records as the content source of truth while using rendered PDF/HTML
pages as the acceptance proof for student-facing layout, legibility, figures,
tables, print quality, and visible completeness.

## Original Sprint Spec

The sprint spec is `reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-plan.md`.
The sprint is policy-only and platform-only. It must add a rendered-page
acceptance standard, wire that standard into textbook planning/review surfaces,
and avoid editing lesson content or claiming product/gate closure.

## Non-Negotiable Requirements

1. Cite the product end-state and original sprint/gate spec in the review.
2. Name the core requirements and classify findings with REV-STD-1 values.
3. Confirm that markdown remains the content source of truth.
4. Confirm that rendered PDF/HTML pages are required acceptance proof for
   student-facing textbook surfaces.
5. Confirm that visible student-facing rendered defects block closure.
6. Confirm that PASS WITH FLAGS cannot carry a missing core requirement.
7. Confirm that no lesson content or generated lesson output changed.

## Evidence To Inspect

- `reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-plan.md`
- `reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-baseline.md`
- `references/data/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1.plan.json`
- `references/authored/textbook-rendered-page-acceptance-standard.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `references/authored/README.md`
- `agents/lead-reviewer-agent.md`
- `reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-command-log.jsonl`
- `../4veco-lessen` working-tree status

## Review Questions

1. Does the rendered-page standard require full-page rendered proof, not just
   source or cropped checks, for future student-facing textbook changes?
2. Does the standard preserve the markdown/content-source boundary?
3. Does the standard make visible rendered defects blocking?
4. Do the roadmap, ledger, end-state, README, and lead-review agent point future
   textbook work to the new standard?
5. Does the sprint remain policy-only without editing lessons or generated
   lesson output?
6. Are carried issues, if any, classified with `blocks`, `does_not_block`, and
   `proof_required_to_close`?

## Boundary

This review cannot close a downstream product gate, Scale Gate, diagnostics,
mastery, PV, or student/product-use gate. It can only decide whether this
platform policy sprint is complete enough to record its result and prepare for
normal PR review.
