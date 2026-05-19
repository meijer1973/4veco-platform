# CP.6a Lesson-Side Alignment Plan

Generated: 2026-05-19

Status: alignment plan ready, mismatch not resolved, no lesson output mutation.

CP-6 not closed. Year 1 not closed. No protected reference mutation authorized. No lesson output mutation authorized.

## Decision Basis

GATE-CP6 decided that active v5 is the intended source and the lesson side must be remediated before CP-6 can close.

CP.6a records the implementation path only. It does not edit lesson output.

## Active v5 Mapping

| Active v5 paragraph | Active v5 title | Migrated from v4 | Current lesson-side location | Current lesson-side title | Status |
|---|---|---|---|---|---|
| 1.3.2 | Marktevenwicht | 1.4.1 | `1.3 Hoofdstuk Aanbod en kosten/1.3.2 Kostenstructuren` | Kostenstructuren | wrong topic for active v5 Book 1 |
| 1.3.3 | Verschuivingen en nieuw evenwicht | 1.4.2 | `1.3 Hoofdstuk Aanbod en kosten/1.3.3 Opbrengsten` | Opbrengsten | wrong topic for active v5 Book 1 |

## Mixed Lesson-Surface State

CP.6a records a mixed generated-output state rather than a resolved alignment:

| Surface | `1.3.2` state | `1.3.3` state | Interpretation |
|---|---|---|---|
| Chapter folder and chapter plan | Kostenstructuren | Opbrengsten | stale for active v5 Book 1 |
| Chapter markdown | Kostenstructuren | Opbrengsten | stale for active v5 Book 1 |
| Aggregate Book 1 markdown | Marktevenwicht | Verschuivingen en nieuw evenwicht | already v5-titled, but not enough to prove validated remediation |

The aggregate Book 1 headings do not close the mismatch. Later remediation must align the chapter folders, chapter plan, chapter markdown, navigation, review evidence, and generated book surfaces through the authorized lesson-side build workflow.

## Equivalent Lesson-Side Material

The current lesson-side material that appears to correspond to active-v5 `1.3.2` and `1.3.3` is already present, but under Chapter 1.4:

| Current lesson paragraph | Title | Maps to active v5 | Review state | Flags carried forward |
|---|---|---|---|---|
| 1.4.1 | Marktevenwicht | 1.3.2 | PASS WITH FLAGS | limited start hints; ambiguous subsidy question; duplicated exercises |
| 1.4.2 | Verschuivingen en nieuw evenwicht | 1.3.3 | PASS WITH FLAGS | incorrect forward reference; exercise 8e ambiguity problem; duplicated exercises |

These flags must remain visible. Existing `1.4.1` and `1.4.2` material cannot simply be counted as final `1.3.2` and `1.3.3` coverage until it is regenerated or moved through an authorized lesson-side workflow and revalidated.

## Displaced Topics

The current Book 1 Chapter 1.3 topics are not deleted from the curriculum source. Active v5 moves them to Book 2:

| Current lesson paragraph | Current title | Active v5 destination | Destination title |
|---|---|---|---|
| 1.3.2 | Kostenstructuren | 2.1.1 | Kostenstructuren |
| 1.3.3 | Opbrengsten | 2.1.2 | Opbrengsten, winst en break-even |

Later remediation must preserve this distinction: costs and revenue do not count as Book 1 `1.3.2`/`1.3.3` coverage under active v5.

## Required Later Implementation Path

1. Open an authorized lesson-side regeneration sprint before claiming the source/lesson mismatch is resolved.
2. Regenerate Book 1 Chapter 1.3 so its theory sequence is:
   - `1.3.1 Aanbod`
   - `1.3.2 Marktevenwicht`
   - `1.3.3 Verschuivingen en nieuw evenwicht`
   - `1.3.4 Gemengde opgaven: aanbod en marktevenwicht`
3. Carry over or regenerate the existing `1.4.1` and `1.4.2` equivalent material only after addressing their recorded `PASS WITH FLAGS` items.
4. Route `Kostenstructuren` and `Opbrengsten` to active-v5 Book 2 destinations instead of counting them as Book 1 Chapter 1.3 coverage.
5. Regenerate chapter-level, book-level, navigation, PDF/HTML, asset, review, and quality-ref surfaces through the approved build workflow.
6. Run current Part A/Part B and validator evidence before any later CP-6 closure proposal counts the mismatch as resolved.

## Explicit Non-Actions In CP.6a

- No lesson files or folders were edited, renamed, moved, deleted, or rebuilt.
- No protected reference files were edited.
- No target-exercise records were promoted.
- No placeholders were finalized.
- No units were minted.
- No CP-6 closure or Year-1 closure was drafted.

## Stop Conditions Carried Forward

- Stop CP-6 closure while the lesson-side Book 1 sequence still names `1.3.2 Kostenstructuren` and `1.3.3 Opbrengsten`.
- Stop final Year-1 coverage while equivalent market-equilibrium material is still only located under `1.4.1` and `1.4.2`.
- Stop treating aggregate Book 1 markdown headings as enough to resolve the mismatch while chapter folders, chapter plan, and chapter markdown remain stale.
- Stop if the `PASS WITH FLAGS` states for existing `1.4.1` and `1.4.2` material are hidden.
- Stop if any later remediation attempts to hand-edit generated lesson output instead of using the authorized build workflow.

## Next Operational Step

Proceed to `CP.6b Year-1 Target-Exercise Review` after CP.6a is committed and pushed.

The source/lesson mismatch remains open until a later authorized lesson-side regeneration/remediation sprint executes and validates the alignment.
