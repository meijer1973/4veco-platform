# Sprint CP.6a: Baseline

## Plan reference

`reports/sprints/CP.6a-plan.md`

## Current state

CP.6a is the active references roadmap sprint at baseline.

Git baseline: `7353710d49ab0f4afc0c6a38ff9ec5b57b90a556`.

The active roadmap version at sprint start is `v2.52-gate-cp6-routing-decision`. GATE-CP6 recorded the human routing decision and opened CP.6a as the first remediation lane.

Lesson-side baseline in `../4veco-lessen`:

- repository status: `main...origin/main`
- commit: `8ea857ac7aec04ad7da6c6830e1d951b046f037d`
- Book 1 Chapter 1.3 folder: `1.3 Hoofdstuk Aanbod en kosten`
- Chapter 1.3 current folders: `1.3.1 Aanbod`, `1.3.2 Kostenstructuren`, `1.3.3 Opbrengsten`, `1.3.4 Gemengde opgaven`
- Book 1 Chapter 1.4 folder: `1.4 Hoofdstuk Marktevenwicht en marginale analyse`
- Chapter 1.4 current folders include `1.4.1 Marktevenwicht` and `1.4.2 Verschuivingen`

Active v5 source baseline:

- `1.3.2` is `Marktevenwicht`, migrated from v4 `1.4.1`
- `1.3.3` is `Verschuivingen en nieuw evenwicht`, migrated from v4 `1.4.2`
- `2.1.1` is `Kostenstructuren`, migrated from v4 `1.3.2`
- `2.1.2` is `Opbrengsten, winst en break-even`, migrated from v4 `1.3.3`

## Data integrity notes

Protected reference data must not change in CP.6a. `references/machine/` and `references/external/` are read-only. `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` are read-only source inputs.

No lesson output changes are authorized. CP.6a may inspect lesson evidence in `../4veco-lessen`, but it must not edit, rename, move, delete, or rebuild lesson files or folders.

CP.6a is an alignment-plan sprint. It must not mark the source/lesson mismatch resolved until a later authorized lesson-side remediation and validation pass exists.

## Baseline risks

- The existing `1.4.1` and `1.4.2` lesson material appears to be the closest equivalent to active-v5 `1.3.2` and `1.3.3`, but it carries `PASS WITH FLAGS` review states that must not be hidden.
- Costs and revenue are not simply deleted; active v5 maps them to Book 2 `2.1.1` and `2.1.2`.
- Chapter-level navigation, book assembly, generated PDFs/HTML, shared assets, and paragraph cross-references will all need later regeneration if the lesson-side alignment is implemented.
- CP.6a must not drift into CP.6b target-exercise final review, CP.6c MTU backfill classification, CP.6d graph-heavy evidence upgrade, or CP.6e focused `1.1.3` review.

## Acceptance baseline

CP.6a closes only when the alignment JSON/report, read-only validator, sprint result, diff summary, roadmap bookkeeping, map refresh, and complete lead-review cycle all validate. Remote state and repository maps must be refreshed and pushed before final closure.
