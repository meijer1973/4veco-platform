# REF-CT1 CP-6 Review Packet

Generated: 2026-05-19

Status: CP-6 packet ready, CP-6 not closed.

No CLI mutation authorized.

## Review Scope

The reviewer should assess whether the Year-1 coverage baseline is complete enough to start the CP-6 closure path, not whether Year 1 is already closed.

Evidence base:

- Active v5 source: `references/owned/course-blueprint-v5.md`
- Active target-exercise registry: `references/authored/course-target-exercises.json`
- REF-CT0 classification: `references/data/sprints/REF-CT0-mtu-classification.json`
- Lesson-side read-only evidence for `1.1.1`, `1.1.2`, and `1.1.3`

## Planned Review Questions

1. Are the 12 Book 1 count-bearing target-exercise records the correct v5 basis for Year-1 coverage review?
2. For the 9 migrated Book 1 target-exercise records, what evidence is still required before any record can become `reviewed_final`?
3. For the 3 placeholder records, what integration target exercise must be designed before each paragraph can count as covered?
4. For the 9 Year-1 missing-flag records, which are true missing MTUs, which map to existing live units, and which should be merged or deferred?
5. Does the L1.6R status of `1.1.3` block CP-6 closure until human review confirms the visual remediation?
6. Is any protected mutation authorized now? The REF-CT1 packet recommendation is no.

## Current Blockers

- 3 Book 1 placeholder target-exercise records still need reviewed integration target exercises.
- 9 migrated Book 1 target-exercise records still need v5 final review before reviewed_final claims.
- 9 Book 1 missing-flag records remain Year-1 backfill candidates, not mutation authority.
- 1.1.3 remains pending L1.6R human review and has Part A FLAG status.

## Placeholder Records

- 1.1.4: 1.1.4 Gemengde opgaven: economisch denken en rekenen
- 1.2.4: 1.2.4 Gemengde opgaven: vraag
- 1.3.4: 1.3.4 Gemengde opgaven: aanbod en marktevenwicht

## Missing-Flag Backfill Candidates

- 1.1.3: Draw a (P,Q) graph from a table with the economist's axis convention (P vertical, Q horizontal) (A-domain candidate)
- 1.1.3: Read values from a (P,Q) graph; interpolate between data points (A-domain candidate)
- 1.2.2: Classify a normal vs inferior good response to an income change (concept-level, prerequisite for D11 inkomenselasticiteit)
- 1.2.3: Horizontal sum: aggregate individual demand tables into collective demand (A-domain candidate, mirror of A31 for aanbod)
- 1.2.3: Algebraic horizontal sum of linear demand functions (A-domain candidate, Q-at-equal-P)
- 1.2.3: Recognise the kink in collective demand when one consumer exits (concept-level)
- 1.3.1: Draw an upward-sloping supply curve with correct economist axes (A-domain candidate)
- 1.3.2: Determine surplus (aanbodoverschot) vs shortage (vraagoverschot) at a non-equilibrium price and calculate its size (A-domain candidate, prerequisite for government price interventions in §2.4)
- 1.3.3: Reason about simultaneous supply+demand shifts: determinate Q-direction but ambiguous P-direction (concept-level, diagnostic checkpoint)

## Stop Conditions

Stop CP-6 closure if any of these remain true:

- A placeholder record is still counted as final coverage.
- A migrated record is treated as `reviewed_final` without a later review/mutation artifact.
- `1.1.3` remains pending L1.6R human review or unresolved Part A flags while the packet claims final closure.
- A missing-flag candidate is directly converted into machine data without a protected CLI mutation sprint.
- Any student diagnostics, adaptive routing, mastery, AI, summative, PV, or product-use claim is made from this baseline.

## Packet Recommendation

Use this packet to start CP-6 review and the next precision/coverage audit. Do not close CP-6, do not close Year 1, and do not mutate protected reference data from REF-CT1 alone.
