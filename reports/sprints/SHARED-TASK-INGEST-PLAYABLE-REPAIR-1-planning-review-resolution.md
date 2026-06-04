# SHARED-TASK-INGEST-PLAYABLE-REPAIR-1 Planning Review Resolution

Date: 2026-06-04

## Round 1 Verdict

Planning review returned `REVISE`.

## Required Correction

The plan did not name repaired screenshot/proof evidence at exact PNG path and
proof-case-ID level for both labs.

## Resolution

Added `## Repaired Evidence Output Contract` to
`reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md` with exact case
IDs and PNG paths:

- actual-exam cases: `desktop-initial`, `desktop-wrong-retry`,
  `desktop-corrected`, `desktop-completed`, `mobile-completed`,
  `mobile-dark-completed`;
- textbook cases: `desktop-initial`, `desktop-wrong-retry`,
  `desktop-corrected`, `desktop-completed`, `mobile-completed`,
  `mobile-dark-completed`;
- exact lab, proof JSON, screenshot manifest, screenshot directory manifest,
  and checker paths for both labs;
- gate checker requirement to assert all six case IDs and PNG files.

## Recheck Status

Pending planning reviewer PASS recheck.
