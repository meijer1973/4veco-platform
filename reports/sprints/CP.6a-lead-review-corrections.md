# Sprint CP.6a: Lead Review Corrections

Generated: 2026-05-19

## Round 1 Verdict

Round 1 lead review verdict: FAIL for sprint closure.

The failure was procedural and evidentiary, not a finding of protected mutation. The reviewer confirmed that CP.6a preserved the non-mutating boundary, kept CP-6 and Year 1 open, routed costs/revenue to Book 2, and left the lesson repo clean.

## Corrections Applied

1. Recorded the round-1 review in `reports/sprints/CP.6a-lead-review-round1.md`.
2. Added this correction log.
3. Added mixed lesson-surface evidence to `references/data/sprints/CP.6a-lesson-side-alignment.json`.
4. Added a `Mixed Lesson-Surface State` section to `reports/reference-planning/CP.6a-lesson-side-alignment.md`.
5. Updated `build-scripts/review-gates/check-cp6a-lesson-side-alignment.js` so the mixed-surface evidence is required.
6. Updated `reports/sprints/CP.6a-result.md` to record the round-1 failure and correction pass.

## Mixed-Surface Clarification

CP.6a now records that the lesson repo is mixed:

- chapter folders and chapter markdown still show `1.3.2 Kostenstructuren` and `1.3.3 Opbrengsten`;
- aggregate Book 1 markdown already shows `1.3.2 Marktevenwicht` and `1.3.3 Verschuivingen en nieuw evenwicht`;
- the aggregate headings are not sufficient to close the mismatch because the chapter folders, chapter plan, chapter markdown, navigation/review evidence, and generated surfaces have not been regenerated and validated through an authorized lesson-side remediation sprint.

## Not Changed

- No lesson output was edited, renamed, moved, deleted, or rebuilt.
- No protected reference file was edited.
- No target exercise was promoted.
- No placeholder was finalized.
- No unit was minted.
- No CP-6 or Year-1 closure was drafted.

## Recheck Instruction

Run lead-review round 2 against the corrected CP.6a bundle. If round 2 passes, update `references/data/sprints/CP.6a.result.json` to completed and run the final complete-bundle validation.
