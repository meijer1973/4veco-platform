# REF-CT1 Year-1 Coverage Baseline

Generated: 2026-05-19

Authority: non_mutating_year1_coverage_baseline. No CLI mutation authorized.

## Summary

- Book 1 count-bearing paragraphs: 12
- Migrated records needing v5 review: 9
- Placeholder records needing reviewed target exercises: 3
- Reviewed-final target-exercise records: 0
- Confirmed target-exercise-backed MTUs: 19
- Year-1 missing-flag backfill candidates: 9
- Placeholder needs-evidence records: 3

## Coverage Decision

CP-6 status: `review_packet_ready_not_closed`

Final Year-1 closure status: `blocked_pending_cp6_human_review`

Protected reference mutation allowed: `false`

Blockers:

- 3 Book 1 placeholder target-exercise records still need reviewed integration target exercises.
- 9 migrated Book 1 target-exercise records still need v5 final review before reviewed_final claims.
- 9 Book 1 missing-flag records remain Year-1 backfill candidates, not mutation authority.
- 1.1.3 remains pending L1.6R human review and has Part A FLAG status.

## Paragraph Coverage

| Paragraph | Title | Record status | Placeholder | Units | Missing flags | Final coverage claim | Built evidence |
|---|---|---:|---:|---|---:|---:|---|
| 1.1.1 | Schaarste en economisch denken | migrated_from_v4_needs_v5_review | no | A43 (required+introduced)<br>B01 (required+introduced)<br>B02 (required+introduced) | 0 | no | Part A: PASS WITH FLAGS<br>Companion: PASS WITH FLAGS |
| 1.1.2 | Percentages en indexcijfers | migrated_from_v4_needs_v5_review | no | A38 (required+introduced)<br>A39 (required+introduced)<br>D31 (required+introduced) | 0 | no | Part A: PASS WITH FLAGS<br>Companion: PASS WITH FLAGS |
| 1.1.3 | Grafieken en tabellen | migrated_from_v4_needs_v5_review | no | A38 (required+assumed) | 2 | no | Part A: FLAG<br>Companion: PASS WITH FLAGS<br>Human: l16r_visual_remediated_pending_human_review |
| 1.1.4 | Gemengde opgaven: economisch denken en rekenen | placeholder_needs_review | yes | - | 0 | no | not required/read in REF-CT1 |
| 1.2.1 | Individuele vraag | migrated_from_v4_needs_v5_review | no | A44 (required+introduced)<br>D35 (required+introduced)<br>D36 (required+introduced)<br>D37 (required+introduced) | 0 | no | not required/read in REF-CT1 |
| 1.2.2 | Vraagfactoren | migrated_from_v4_needs_v5_review | no | A42 (required+introduced)<br>D27 (required+introduced)<br>D32 (required+introduced)<br>D33 (required+introduced) | 1 | no | not required/read in REF-CT1 |
| 1.2.3 | Van individuele naar collectieve vraag | migrated_from_v4_needs_v5_review | no | A01 (required+assumed) | 3 | no | not required/read in REF-CT1 |
| 1.2.4 | Gemengde opgaven: vraag | placeholder_needs_review | yes | - | 0 | no | not required/read in REF-CT1 |
| 1.3.1 | Aanbod | migrated_from_v4_needs_v5_review | no | D13 (required+introduced)<br>D32 (required+assumed)<br>D33 (required+assumed) | 1 | no | not required/read in REF-CT1 |
| 1.3.2 | Marktevenwicht | migrated_from_v4_needs_v5_review | no | A02 (required+assumed)<br>A04 (required+introduced)<br>A06 (required+introduced) | 1 | no | not required/read in REF-CT1 |
| 1.3.3 | Verschuivingen en nieuw evenwicht | migrated_from_v4_needs_v5_review | no | A02 (required+assumed)<br>A04 (required+assumed)<br>A06 (required+assumed)<br>A42 (required+assumed)<br>D13 (required+assumed) | 1 | no | not required/read in REF-CT1 |
| 1.3.4 | Gemengde opgaven: aanbod en marktevenwicht | placeholder_needs_review | yes | - | 0 | no | not required/read in REF-CT1 |

## Built Evidence Read From Lesson Repository

Lesson repository commit: `f16918d669b663c7038d52a29802055041155fea`

| Paragraph | Quality ref present | Part A verdict | Companion verdict | Human review status | L1.6R status | Quality ref |
|---|---:|---|---|---|---|---|
| 1.1.1 | yes | PASS WITH FLAGS | PASS WITH FLAGS | - | - | ../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1-quality-ref.yaml |
| 1.1.2 | yes | PASS WITH FLAGS | PASS WITH FLAGS | - | - | ../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2-quality-ref.yaml |
| 1.1.3 | yes | FLAG | PASS WITH FLAGS | l16r_visual_remediated_pending_human_review | visual_remediated_pending_human_review | ../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3-quality-ref.yaml |

## Source Boundary

This report reads active v5, REF-CT0 classification data, and read-only lesson evidence. It does not edit `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen`.

No placeholder record may count as final Year-1 coverage. No migrated record may count as reviewed final until a later review/mutation path explicitly promotes it.
