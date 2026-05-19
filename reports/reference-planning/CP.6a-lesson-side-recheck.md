# CP.6a Lesson-Side Recheck

Generated: 2026-05-19

Status: lesson-side mismatch fixed with carried conditions.

CP-6 not closed. Year 1 not closed. No protected reference mutation, target-exercise promotion, placeholder finalization, or unit minting occurred.

## Recheck Basis

Lesson team completed and pushed `L-CP6A Book 1 Chapter 1.3 v5 Alignment Remediation`.

Reported commits:

- Platform: `6e2c06684e0c9b782cf005027a3b2ef3fd9fd230`
- Lessons: `1aa63e4f0968c39141c1a04809f6410b5435ee34`

Primary lesson evidence:

- `../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-handoff-to-references.md`
- `../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-closure-log.md`
- `../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-technical-qa-report.md`
- `../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-survival-map.md`

## Recheck Decision

The CP.6a source/lesson mismatch for active-v5 `1.3.2` and `1.3.3` is fixed on the lesson side with carried conditions.

This clears only the CP.6a lesson-side mismatch blocker. It does not clear target-exercise review, placeholder finalization, MTU backfill classification, graph-heavy review evidence, or the remaining `1.1.3` Part A gate.

## Current Lesson State

| Active v5 paragraph | Current lesson-side title | Current state |
|---|---|---|
| 1.3.1 | Aanbod | present |
| 1.3.2 | Marktevenwicht | present and aligned with active v5 |
| 1.3.3 | Verschuivingen en nieuw evenwicht | present and aligned with active v5 |
| 1.3.4 | Gemengde opgaven | rescoped to aanbod/marktevenwicht only |

Old active-Book-1 slots are no longer present as Chapter 1.3 paragraph folders:

- `1.3.2 Kostenstructuren`
- `1.3.3 Opbrengsten`

The displaced material is preserved under `../4veco-lessen/archive/sprints/L-CP6A/displaced-book2-material/` for future Book 2 survival routing.

## Local Recheck Validation

The references team reran the core evidence checks locally:

```bash
node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht"
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-book-print-scope.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-course-target-exercises-v5.js
```

Results:

- Chapter 1.3 validation passed with 0 errors and 0 warnings.
- Book health passed: 26/26.
- Book print scope passed: 12/12.
- v5 target-exercise count passed: 54 records with book counts 12/12/14/16.

## Carried Conditions

- `1.3.2` and `1.3.3` target exercises remain `migrated_from_v4_needs_v5_review`.
- `1.3.4` remains `placeholder_needs_review`.
- No target exercise is promoted to `reviewed_final`.
- Displaced costs/revenue material is preserved for Book 2 survival, but Book 2 is not produced by this evidence.
- CP-6 and Year 1 remain open.
- CP.6b, CP.6c, CP.6d, and CP.6e remain required before any responsible CP-6 closure proposal.

## Next Operational Step

Proceed to `CP.6b Year-1 Target-Exercise Review`.

Do not draft a CP-6 closure proposal yet.
