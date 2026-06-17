# TEXTBOOK-FIGURE-STANDARD-1 Lead Review Assignment

Generated: 2026-06-17

## Assignment

Act as the lead reviewer for `TEXTBOOK-FIGURE-STANDARD-1`.
Inspect whether the sprint correctly implements the figure-standard follow-up
requested by `TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1` and whether the sprint may
close under REV-STD-1.

Scope: this is a platform-only policy task. The review covers the authored
figure standard, textbook workflow wiring, sprint evidence, and lesson-side
no-change proof; it does not review or authorize generated lesson output.

## Product End-State

Future textbook and chapter-page work must preserve markdown and structured
target records as the content source of truth while using rendered PDF/HTML
pages as the acceptance proof for student-facing layout, figure legibility,
graph/table readability, print quality, and visible completeness.

## Original Sprint Spec

The sprint spec is `reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-plan.md`.
The upstream policy sprint is
`reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-result.md`. The sprint is
policy-only and platform-only. It must add a detailed textbook figure standard,
wire that standard into textbook planning/review surfaces, preserve final
rendered-page acceptance, and avoid editing lesson content or claiming
product/gate closure.

## Non-Negotiable Requirements

1. Cite the product end-state and original sprint/gate spec in the review.
2. Name the core requirements and classify findings with REV-STD-1 values.
3. Confirm that source figure checks are preflight only.
4. Confirm that full-page rendered PDF/HTML proof remains final acceptance for
   student-facing figure closure.
5. Confirm that figure source hygiene, SVG/PNG pairing, labels, graph
   conventions, density, color-not-sole-meaning, staged figures, and
   graph/text concordance are covered.
6. Confirm that visible student-facing figure defects block closure.
7. Confirm that PASS WITH FLAGS cannot carry a missing core requirement.
8. Confirm that no lesson content, generated lesson output, paragraph
   production sprint, or product gate changed.

## Evidence To Inspect

- `reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-plan.md`
- `reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-baseline.md`
- `references/data/sprints/TEXTBOOK-FIGURE-STANDARD-1.plan.json`
- `references/authored/textbook-figure-standard.md`
- `references/authored/textbook-rendered-page-acceptance-standard.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- `references/authored/README.md`
- `agents/lead-reviewer-agent.md`
- `reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-command-log.jsonl`
- `../4veco-lessen` working-tree status

## Review Questions

1. Does the figure standard satisfy the named follow-up from
   `TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1`?
2. Does the standard preserve full-page rendered proof as final authority?
3. Are source preflight checks useful but bounded?
4. Are missing/unreadable/stale/contradictory figures blockers rather than
   PASS WITH FLAGS items?
5. Do roadmap, ledger, end-state, README, rendered-page standard, and
   lead-review agent point future textbook work to the figure standard?
6. Does the sprint remain policy-only without starting `B2-2.2-READY-1`,
   editing lessons, regenerating output, or closing product gates?
7. Are carried issues, if any, classified with `blocks`, `does_not_block`, and
   `proof_required_to_close`?

## Boundary

This review cannot close a downstream product gate, Scale Gate, diagnostics,
mastery, PV, product-route adoption, or student/product-use gate. It can only
decide whether this platform policy sprint is complete enough to record its
result and prepare for normal PR review.

