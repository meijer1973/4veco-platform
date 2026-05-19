# REF-CT1 MTU Gap Classification

Generated: 2026-05-19

Authority: non_mutating_year1_coverage_baseline. No CLI mutation authorized.

## Classification Summary

- `year_1_confirmed`: 19 target-exercise-backed live MTUs in Book 1.
- `year_1_backfill_candidate`: 9 missing-flag records.
- `needs_evidence`: 3 placeholder target-exercise records.
- `year_2_skeleton_candidate`, `year_3_skeleton_candidate`, `duplicate_merge_split_candidate`, and `parked`: none assigned for the Book 1 missing/placeholder surface by REF-CT1.

## Confirmed Book 1 MTUs

| Unit | Label | Domain | Active v5 paragraphs | Roles | Target record statuses |
|---|---|---:|---|---|---|
| A01 | Lineaire functie opstellen | A | 1.2.3 | assumed<br>required | migrated_from_v4_needs_v5_review |
| A02 | Vergelijking oplossen | A | 1.3.2<br>1.3.3 | assumed<br>required | migrated_from_v4_needs_v5_review |
| A04 | Substitueren | A | 1.3.2<br>1.3.3 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| A06 | Evenwichtsprijs & -hoeveelheid | A | 1.3.2<br>1.3.3 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| A38 | Procentuele verandering berekenen | A | 1.1.2<br>1.1.3 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| A39 | Prijsindex (CPI) berekenen | A | 1.1.2 | introduced<br>required | migrated_from_v4_needs_v5_review |
| A42 | Grafische verschuiving met voor-en-na pijlen | A | 1.2.2<br>1.3.3 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| A43 | Totale winst uit gemengde allocatie berekenen | A | 1.1.1 | introduced<br>required | migrated_from_v4_needs_v5_review |
| A44 | Individuele stapfunctie-vraagcurve tekenen uit betalingsbereidheid | A | 1.2.1 | introduced<br>required | migrated_from_v4_needs_v5_review |
| B01 | Schaarste als kerneconomisch probleem | B | 1.1.1 | introduced<br>required | migrated_from_v4_needs_v5_review |
| B02 | Alternatieve kosten in een keuze-situatie | B | 1.1.1 | introduced<br>required | migrated_from_v4_needs_v5_review |
| D13 | Kostenstijging en aanbodverschuiving | D | 1.3.1<br>1.3.3 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| D27 | Substituten en complementen | D | 1.2.2 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| D31 | Indexpunt versus procentuele verandering | D | 1.1.2 | introduced<br>required | migrated_from_v4_needs_v5_review |
| D32 | Verschuiving versus beweging langs de curve | D | 1.2.2<br>1.3.1 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| D33 | Vraag- en aanbodverschuivingsfactoren benoemen | D | 1.2.2<br>1.3.1 | assumed<br>introduced<br>required | migrated_from_v4_needs_v5_review |
| D35 | Betalingsbereidheid definiëren | D | 1.2.1 | introduced<br>required | migrated_from_v4_needs_v5_review |
| D36 | Beslisregel: koop als P ≤ betalingsbereidheid | D | 1.2.1 | introduced<br>required | migrated_from_v4_needs_v5_review |
| D37 | Wet van de vraag verbaal uitleggen | D | 1.2.1 | introduced<br>required | migrated_from_v4_needs_v5_review |

## Year-1 Backfill Candidates

These records are target-exercise-backed gaps from REF-CT0. They are review input only; later CLI mutation requires separate authorization.

| Paragraph | Record | Classification | Flag | Required skills | Next review action |
|---|---|---|---|---|---|
| 1.1.3 | missing_flag:1.1.3:1 | year_1_backfill_candidate | Draw a (P,Q) graph from a table with the economist's axis convention (P vertical, Q horizontal) (A-domain candidate) | A38 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.1.3 | missing_flag:1.1.3:2 | year_1_backfill_candidate | Read values from a (P,Q) graph; interpolate between data points (A-domain candidate) | A38 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.2.2 | missing_flag:1.2.2:1 | year_1_backfill_candidate | Classify a normal vs inferior good response to an income change (concept-level, prerequisite for D11 inkomenselasticiteit) | A42<br>D27<br>D32<br>D33 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.2.3 | missing_flag:1.2.3:1 | year_1_backfill_candidate | Horizontal sum: aggregate individual demand tables into collective demand (A-domain candidate, mirror of A31 for aanbod) | A01 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.2.3 | missing_flag:1.2.3:2 | year_1_backfill_candidate | Algebraic horizontal sum of linear demand functions (A-domain candidate, Q-at-equal-P) | A01 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.2.3 | missing_flag:1.2.3:3 | year_1_backfill_candidate | Recognise the kink in collective demand when one consumer exits (concept-level) | A01 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.3.1 | missing_flag:1.3.1:1 | year_1_backfill_candidate | Draw an upward-sloping supply curve with correct economist axes (A-domain candidate) | D13<br>D32<br>D33 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.3.2 | missing_flag:1.3.2:1 | year_1_backfill_candidate | Determine surplus (aanbodoverschot) vs shortage (vraagoverschot) at a non-equilibrium price and calculate its size (A-domain candidate, prerequisite for government price interventions in §2.4) | A02<br>A04<br>A06 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |
| 1.3.3 | missing_flag:1.3.3:1 | year_1_backfill_candidate | Reason about simultaneous supply+demand shifts: determinate Q-direction but ambiguous P-direction (concept-level, diagnostic checkpoint) | A02<br>A04<br>A06<br>A42<br>D13 | Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU. |

## Needs-Evidence Placeholders

These records are count-bearing paragraphs with placeholder target exercises. They cannot count as final coverage and must receive reviewed integration target exercises before closure.

| Paragraph | Record | Classification | Current status | Next review action |
|---|---|---|---|---|
| 1.1.4 | missing_flag:1.1.4:1 | needs_evidence | placeholder_needs_review | REF-CT1 should record placeholder coverage status and route it to target-exercise review before final claims. |
| 1.2.4 | missing_flag:1.2.4:1 | needs_evidence | placeholder_needs_review | REF-CT1 should record placeholder coverage status and route it to target-exercise review before final claims. |
| 1.3.4 | missing_flag:1.3.4:1 | needs_evidence | placeholder_needs_review | REF-CT1 should record placeholder coverage status and route it to target-exercise review before final claims. |

## Deliberately Deferred, Duplicate, Or Parked Items

REF-CT1 found no Book 1 missing/placeholder records that can be safely labelled future-year, duplicate, or parked from the available evidence. If a reviewer wants to defer or merge any backfill candidate, that decision belongs in CP-6 or a later protected mutation sprint.
