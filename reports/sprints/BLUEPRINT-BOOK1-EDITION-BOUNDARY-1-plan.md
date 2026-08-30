# BLUEPRINT-BOOK1-EDITION-BOUNDARY-1 — Sprint Plan

Status: active
Date: 2026-08-30
Scope: owned blueprint clarification, Book 1 second-edition backlog, and Book 2 first-edition handoff
Owner instruction: Book 1 first edition is already printed and frozen; current production focus is Book 2 first edition; website/companion work is intentionally deferred.

## Goal

Clarify the Year 1 blueprint so it distinguishes terminal learning targets from deliberate pedagogical scaffolding without weakening target-exercise discipline. Record genuine Book 1 issues for the second edition instead of attempting to retrofit the printed first edition. Make the consequences for Book 2 production explicit.

## Quality floor

- Preserve exercise-first and exam-grounded planning.
- Do not reinterpret every explanatory concept, representation, or supplied formula as a terminal learning goal.
- Do not make pedagogical concessions merely to force literal target-only coverage.
- Do not treat an anticipatory encounter as mastered prerequisite knowledge in a later book.
- Keep Book 1 first-edition printed content frozen.
- Keep website/companion work out of scope.

## Blueprint clarification to encode

The detailed Year 1 blueprint may permit bounded anticipatory scaffolding when it improves understanding of the active paragraph target. Such scaffolding is not itself a terminal target unless the target registry says so.

Examples to resolve explicitly:

1. A short consumer-surplus introduction in Book 1 may connect willingness to pay and price before the full Book 2 surplus/welfare treatment.
2. A step-function representation may be used didactically to build intuition for a continuous/linear demand model even when step functions are not an exam end goal.
3. A later-book formula may appear in an earlier exercise when the formula is supplied and the student task is source reading, substitution, arithmetic, or interpretation rather than recall, derivation, formula selection, or full conceptual mastery.
4. Normal/inferior-good terminology may appear as light anticipatory language before income elasticity, provided later Book 2 treatment does not assume mastery.

## Boundaries

Anticipatory scaffolding is acceptable only when:

- it serves the active target rather than displacing it;
- it is clearly bounded in depth;
- the later formal treatment still teaches the concept from an appropriate starting point;
- earlier exposure is not silently promoted to prerequisite mastery;
- mixed-opgaven paragraphs remain consolidation-first and do not become hidden theory chapters;
- target-equivalent claims remain governed by reviewed target exercises, not by incidental explanatory material.

## Book 1 second-edition backlog to record

Record, without editing the printed first edition:

- §1.1.4: current first-edition mixed exercise set differs from the reviewed integration target and omits the target's explicit graph-drawing operation; supplied profit-formula use may remain as a bounded preview, but target coverage should be reconciled in the second edition.
- §1.2.2: fix the stale forward reference that says §1.2.3 moves to supply; review whether normal/inferior terminology remains clearly preview-level rather than a mastery requirement.
- §1.2.3: preserve the intuitive buyer-dropout idea but review whether formal kink/piecewise/domain treatment is too deep for the Year 1 target and should be compressed in the second edition.
- Book 1 repository hygiene: remove/archive stale legacy 1.4 and 1.5 active-tree artifacts through the platform workflow; do not hand-delete generated lesson output.
- Consumer surplus and step-function material are not automatic defects; review presentation only for clarity about preview/scaffold status.

## Book 2 handoff requirements

- Chapter 2.1 must teach costs/revenue/profit as formal Book 2 content; Book 1 supplied-formula exposure counts as familiarity only.
- §2.2.3 must teach normal/inferior classification through income elasticity; Book 1 terminology is not assumed mastery.
- §2.3.1 must teach consumer surplus formally and may reactivate Book 1 familiarity, but must not skip the concept, graphical area treatment, or required target operations because students have seen a simple discrete example before.
- Step-function construction is not a prerequisite target for Book 2 unless a Book 2 target explicitly needs it.

## Planned repository changes

1. Add a human-readable owned blueprint addendum for pedagogical-boundary interpretation.
2. Link that addendum from the v5 and v6 blueprint metadata without changing book counts, book roles, or assessment structure.
3. Open a durable Book 1 second-edition backlog issue containing the genuine repair items and Book 2 handoff.
4. Record a sprint result and open a draft PR so platform CI can judge repository integrity.

## Out of scope

- Editing Book 1 first-edition textbook files or PDFs.
- Companion/web remediation.
- Rewriting Book 2 paragraphs in this sprint.
- Target-registry mutation.
- Machine/external reference mutation.
- Changing Book 1/Book 2 paragraph counts or book placement.
- Deleting generated lesson folders directly from `4veco-lessen`.

## Acceptance tests

- v5 and v6 metadata point to the clarification addendum.
- The addendum explicitly distinguishes terminal targets, anticipatory scaffolding, and prerequisite mastery.
- Book 1 first-edition freeze is explicit.
- Book 2 handoff prevents preview material from being treated as mastered prior knowledge.
- A second-edition backlog issue exists with concrete proof-to-close criteria.
- Platform PR is opened from the dedicated branch and CI status is checked.

## Stop conditions

Stop if the change would alter Year 1 counts, book roles, target-registry records, or the printed first edition. Stop if legacy cleanup would require hand-editing generated lesson output instead of a platform workflow.