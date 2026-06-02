# GATE-TASK-FAMILY-1 Human Precheck Corrections

Generated: 2026-06-02

Status: corrections applied before human review comments; proof regenerated
after repair.

## Scope

This record resolves the human precheck findings on the playable
GATE-TASK-FAMILY-1 lab before the packet is sent for direct-comment human
review. The corrections affect review-only proof artifacts and packet evidence,
not generated lesson output, source data, product routes, target-equivalent
claims, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use.

## Findings and Corrections

| Surface | Human finding | Correction |
|---|---|---|
| Task 3 matching pairs | The distractor pair was actually correct: `Omzet` matched `Prijs keer afzet`. | Replaced the distractors with `Onbeperkte middelen` and `Er is geen keuze nodig`, so distractors no longer form a valid hidden pair. |
| Task 10 source value selection | The context made the task too easy because the rows were labelled old price and new price. | Added a fietsenwinkel/e-bike context and source rows by product and year. The student now maps `2024` to beginwaarde and `2025` to eindwaarde without source labels giving away old/new. |
| Task 11 source chain builder | The prompt said to read a table, but no table/source was visible; the numbers had to be guessed. | Added visible `Bron 1` context with `2024 = EUR 800` and `2025 = EUR 920`, and changed the first chain nodes to reference the shown source data. |
| Task 12 label placement | Target labels/descriptions gave away the answers, and the visual felt odd. | Changed the visual to a neutral empty coordinate plane, removed target descriptions that named the correct label, renamed targets to `As links`, `As onder`, and `Los vak`, repositioned target hotspots, and suppressed the default graph line/center guide grid for this empty-axis task. |

## Validation Guard Added

The gate checker now fails if:

- Task 3 distractors recreate the `Omzet` / `Prijs keer afzet` valid pair.
- Task 10 source rows are labelled as old/new price.
- Task 10 lacks real context.
- Task 11 lacks visible source data.
- Task 12 target text includes answer-giving phrases such as price label or
  quantity label.
- Task 12 reintroduces the default graph line or center guide grid in this
  empty-axis proof.
- The packet JSON omits this human-precheck correction artifact.

## Proof Presentation Policy

Human-review proof presentation policy is carried forward: UI/game review gates
must present proof in a form that a human can inspect directly. For interactive
surfaces, that means playable or reproducible artifacts, screenshots of the
important states, proof JSON or state logs, and a checker that verifies the
evidence bundle. This proof format should remain standard because it made the
review problems visible and actionable.

## Result

The playable lab was repaired at source level, regenerated, replayed to
completion, and recaptured. The proof screenshots and `playable-proof.json`
were refreshed after repair, and the review-packet checker passes.
