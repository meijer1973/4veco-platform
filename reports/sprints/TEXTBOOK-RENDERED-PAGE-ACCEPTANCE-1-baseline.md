# Sprint TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1: Baseline

## Plan reference

`reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-plan.md`

## Starting State

The current platform branch is based on `origin/main` and the lesson worktree is
detached at `origin/main` for read-only validation. This sprint starts from a
clean platform and lesson worktree.

Existing policy already says actual student-facing output must be inspected:

- `../4veco-lessen/specifications/product-end-state.md` includes the
  non-negotiable product property "Quality gates inspect actual student-facing
  output".
- `docs/roadmaps/textbook/textbook-end-state.md` says complete textbook output
  requires generated rendered output, chapter/book validation, and a quality
  record naming carried flags.
- `agents/lead-reviewer-agent.md` requires rendered-output proof for visual and
  UI claims.

The gap is that no durable textbook rendered-page acceptance standard exists at
`references/authored/textbook-rendered-page-acceptance-standard.md`, and the
textbook sprint ledger does not yet give future agents a concrete rendered
proof checklist, proof artifact convention, or PASS WITH FLAGS blocker/flag
examples for textbook output.

## Baseline Evidence

- `references/authored/gemengde-opgaven-target-standard.md` already covers the
  mixed-opgaven target standard and is not part of this sprint's missing core
  requirement.
- `reports/sprints/SHORT-CHECK-WORKBENCH-112-RENDERED-1-*` and
  `reports/sprints/EXIT-TICKET-WORKBENCH-112-RENDERED-1-*` show rendered-proof
  patterns exist for interactive surfaces, but there is no textbook-wide
  rendered-page acceptance standard.
- `docs/roadmaps/textbook/sprint-ledger.md` has a sprint protocol reminder but
  does not yet name full-page rendered proof or contact-sheet requirements for
  future student-facing textbook changes.

## Data integrity notes

This sprint is platform policy work. It does not authorize edits to protected
reference data under `references/machine/` or `references/external/`, and it
does not edit generated lesson output under `../4veco-lessen/`.

`references/authored/` is an allowed hand-maintained policy bucket, and this
sprint adds a narrative standard there. No machine-reference, external-source,
target-exercise, lesson-output, diagnostics, adaptive routing, mastery,
sequencing, summative, PV, Scale Gate 1, product-route adoption, or
student/product-use authority is changed by the baseline.
