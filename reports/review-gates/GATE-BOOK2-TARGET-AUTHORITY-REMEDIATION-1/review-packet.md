# Gate GATE-BOOK2-TARGET-AUTHORITY-REMEDIATION-1: Human Review Packet

Generated: 2026-09-04

Issue: #229

Draft PR: https://github.com/meijer1973/4veco-platform/pull/230

Route: `DRAFT_PR_THEN_LEAD_REVIEW_AND_OWNER_EXACT_PACKAGE_DECISION`

Product end state: `../4veco-lessen/specifications/product-end-state.md`

Original specification: Issue #229,
`reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-plan.md`, the approved
Book 2 outline/meta, and `../Boek_2_doelopgaven_en_lesdoelen_audit.pdf`.

## Exact package

The requested human decision will bind the complete twelve-record Book 2
candidate package:

`914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`

Candidate-file SHA-256:
`aba9f8f0408905820cc94ed49eb5f8deef4a5ed4aca66e42d1fb171c935d3675`.

The package covers §2.1.1 through §2.3.4. It is one authority decision: partial
approval is not proposed by this packet.

## What is being reviewed

- Twelve independently executable Dutch 4-vwo target exercises and short
  answer models.
- Direct lesson-goal → visible operation → answer-form mappings, including
  explicit time/action/point budgets.
- Corrected Ei language: `inferieur`, `normaal`, and `luxe`, with Ei=0 and Ei=1
  treated as boundary values.
- Recalculated costs, revenues, elasticities, surplus, Pareto, tables, graph
  regions, units, and point allocations.
- An explicit non-approval candidate lifecycle that keeps all downstream
  authority gates closed.

## Review evidence

- Economics/mathematical precision: PASS.
- Teacher-learning quality: PASS, 13/14; classroom validation of the
  §2.3.3 twelve-minute load is an advisory Phase B follow-up.
- Student language/experience: PASS.
- Finished artifact/test plan: PASS after a round-1 blocker correction and
  independent recheck.
- Structural lead round 1: REVISE on `eade17c…`; its two content blockers and
  commit-relative fixture blocker are corrected in the new package.
- Structural lead round 2: PASS WITH FLAGS at effective head `c324fc7f…` on
  substantive package commit `6cd02e8d…`; the only carried flag is empirical
  classroom timing for Phase B.
- Final local validation: PASS with 109 suites and 1,769 tests; hosted
  exact-head CI remains the final publication tail.

The specialist and verifier reports are independent Codex role reviews, not
human owner approval.

## Calibration questions

1. Does each goal map to at least one point-bearing learner action, and does
   every point-bearing question map back to a goal?
2. Are the theory targets concise enough for 8–12 minutes and the mixed
   targets coherent enough for 18–25 minutes without introducing new theory?
3. Are the interval MK/MO, elasticity, revenue, surplus, Pareto-efficiency,
   and fairness boundaries economically precise?
4. Is the three-way Ei terminology decision appropriate for all student-facing
   Book 2 exercises?
5. Are the candidate lifecycle and open holds sufficiently explicit to prevent
   accidental approval, integration, lesson work, or merge?

## Decision requested after lead review and CI

Choose exactly one:

- `APPROVE EXACT BOOK 2 TARGET PACKAGE 914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`
- `REVISE EXACT BOOK 2 TARGET PACKAGE 914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310` with named corrections
- `REJECT EXACT BOOK 2 TARGET PACKAGE 914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`

Approval would authorize only a separately governed target-authority
integration transition. It would not itself authorize lesson writes,
student-output generation, Phase B, or merge.

## Holds and stop rule

All twelve Issue #229 candidate holds and `H-229-EI-SUPERSESSION` remain open.
Approved use, target integration, paragraph/chapter/book production, lesson
authoring, and merge remain blocked. The PR must stay draft. After successful
final exact-head CI, stop for the owner's exact-package decision.

Stop immediately if a core requirement or specialist disagreement remains, an
exact hash drifts, any required validator/CI job fails, or closure would require
a lesson write, generated student output, premature authority transition, or
merge. A missing core requirement cannot be carried under PASS WITH FLAGS.
