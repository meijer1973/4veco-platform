# BLUEPRINT-CHANGE-REVIEW — selected Books 3 and 4

Task/bundle: `BOOK34-CHAT-IMPORT-OUTLINES-1`. Date: 2026-09-14. Revision: `book34-chat-v2-20260914`.
Status: owner-selected structural migration prepared for independent technical/structural review and paired PRs. Not merged; no target approval or companion/product acceptance.

## Decision and source authority

The owner authorized execution of the supplied Book 3/4 handoff and selected both 6 September v2 outlines. This is a versioned human-reviewed edit of owned curriculum intent and an authored-registry migration under `references/SOURCE_OF_TRUTH.md`. It does not modify protected machine or external registries. The original proposal wording and input identities remain preserved; adoption metadata makes the current structural selection explicit without inventing historical approval.

Platform baseline: `7f1393d1f9db365ca5e129c0f2728844be47e08a`. Lesson baseline: `e1712a214a6e2e11dd36758f033ea35f0264f584`.
The migration is reproducible through `build-scripts/references/migrate-books34-selected-outlines.js`; it rejects unequal non-baseline edits. Original source snapshots and `kind: snapshot` relocation metadata preserve all pre-change source bytes, modes, source commits and target payloads. No existing Book 3/4 edition or standalone outline was found, so there is no invented legacy chapter move.

## Bounded structural decision

| Scope | Selected current structure | Preserved boundary |
|---|---|---|
| Book 3 | 3.1 intervention (6), 3.2 perfect competition (4), 3.3 trade (4) | Trade is qualitative/source-led with familiar world-price/trade-gap/tariff arithmetic; no numerical comparative-advantage algorithm or later monopoly/labour prerequisite |
| Book 4 | 4.1 monopoly (4), 4.2 market forms/failure (7), 4.3 labour (6) | Tax/subsidy transfer to externalities; price-floor transfer to minimum wage; explicit actor/variable bridge |
| Absorbed old labour equilibrium | 4.3.2 baseline, 4.3.3 shifts, 4.3.4 minimum wage, 4.3.6 independent mixed practice | Equilibrium is retained, not deleted or made a seventh labour paragraph |
| Year 1 | 12 + 12 + 14 + 17 = 55 | Book 1/2 structure, target payloads, artifacts and approval records unchanged |
| Three-year projection | 149 count-bearing / 153 scheduled, arithmetic only | Original frozen 148/152 model remains historical evidence; Years 2/3, Book 11, Q19 and critical path unchanged |

The finished PDF chapters already implement the selected order and are not swapped or rebuilt. Actual student chapter lengths are Book 3 48/38/38 and Book 4 38/60/50, distinguished from the proposals' inherited 40-page assumption. Book 3's delivered “volkomen concurrentie” title is an explicit alias of the selected outline title.

## Identity, target and dependency handling

The supplied `migration-live-v5-to-v2.csv` is a version-qualified operation-level aid, not the missing historical v1-to-v2 attachment or an equivalence certificate. Old 3.3 means monopoly; new 3.3 means trade. Old 4.2.3 means labour equilibrium; new 4.2.3 means market forms. All old target payloads/evidence remain in the full registry snapshot. Current selected Book 3/4 rows use `placeholder_needs_review`, explicit source revision/outline identity, and historical pointers with payload hashes. They do not inherit approval or old numerical trade objectives. No target exercise is authored or promoted by this migration.

Books 1/2 records remain exactly equal; semantic slices of their blueprint and the later-year v6 suffix are checked unchanged. Book 2 outline metadata, holds and approval records are untouched. Its whole-file shared-authority freshness guard may recognize only the exact before/after source identities recorded in `books34-structure-change.json`, with focused negative coverage for arbitrary edits. This is not a general stale-hash exception.

## Review and verification contract

The consolidated independent reviewer passed the operational plan, including this change-control route. Final review will cover this packet, all actual source changes, source/currentness and routing tests, preserved inputs/snapshots, technical PDF/source checks, and the exact committed pair. No final review verdict is claimed yet.

Required proof: exact 14/17 sets and kinds; 55 current Year 1 records; absorbed-equilibrium trace; no target approval promotion; matching v5 lesson projection; current outline lookup; original input hashes, all preserved file hashes and 24 PDF roles; historical snapshots/relocation lookup; negative modified/missing delivery and wrong revision, old counts, duplicate/misrouted IDs, altered non-final status and unrelated shared-source edits. Required platform CI continues to use lesson main. Paired local proof names both heads; existing three-state compatibility workflow establishes final and safe intermediate states before any later merge decision.

The missing historical proposal companions are recorded as a provenance limitation, not fabricated: `sources-and-scope.md`, `integration-handoff-v2.md`, and `paragraph-migration-v1-to-v2.csv`. The full outlines and finished book/source packages required for this assignment are supplied.
