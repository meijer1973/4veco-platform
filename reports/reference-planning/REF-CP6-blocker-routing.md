# REF-CP6 Blocker Routing

Generated: 2026-05-19

No CLI mutation authorized. CP-6 not closed. Year 1 not closed.

## Lane Details

### source_lesson_alignment: Resolve or formally route active-v5 versus lesson-side topic mismatch

Status: `human_decision_required`

Allowed next action: Prepare the mismatch decision for the CP-6 human gate.

Blocked action: Silent source edit, silent lesson edit, or final coverage claim for mismatched records.

| Item | Detail |
|---|---|
| 1.3.2 | Marktevenwicht |
| 1.3.3 | Verschuivingen en nieuw evenwicht |

### placeholder_target_exercises: Replace or explicitly hold placeholder target exercises

Status: `target_exercise_design_review_required`

Allowed next action: Use the packet to decide whether placeholders block closure or route to a design sprint.

Blocked action: Counting placeholder target exercises as reviewed_final coverage.

| Item | Detail |
|---|---|
| 1.1.4 | Gemengde opgaven: economisch denken en rekenen |
| 1.2.4 | Gemengde opgaven: vraag |
| 1.3.4 | Gemengde opgaven: aanbod en marktevenwicht |

### backfill_candidates: Classify Year-1 MTU backfill candidates before mutation

Status: `mtu_backfill_review_required`

Allowed next action: Classify each candidate as true missing, existing-unit mapping, merge, defer, or hold.

Blocked action: Minting units or editing machine references from REF-CP6.

| Item | Detail |
|---|---|
| 1.1.3 | Draw a (P,Q) graph from a table with the economist's axis convention (P vertical, Q horizontal) (A-domain candidate) |
| 1.1.3 | Read values from a (P,Q) graph; interpolate between data points (A-domain candidate) |
| 1.2.2 | Classify a normal vs inferior good response to an income change (concept-level, prerequisite for D11 inkomenselasticiteit) |
| 1.2.3 | Horizontal sum: aggregate individual demand tables into collective demand (A-domain candidate, mirror of A31 for aanbod) |
| 1.2.3 | Algebraic horizontal sum of linear demand functions (A-domain candidate, Q-at-equal-P) |
| 1.2.3 | Recognise the kink in collective demand when one consumer exits (concept-level) |
| 1.3.1 | Draw an upward-sloping supply curve with correct economist axes (A-domain candidate) |
| 1.3.2 | Determine surplus (aanbodoverschot) vs shortage (vraagoverschot) at a non-equilibrium price and calculate its size (A-domain candidate, prerequisite for government price interventions in §2.4) |
| 1.3.3 | Reason about simultaneous supply+demand shifts: determinate Q-direction but ambiguous P-direction (concept-level, diagnostic checkpoint) |

### legacy_review_evidence: Upgrade legacy graph-heavy review evidence

Status: `current_review_evidence_required`

Allowed next action: Name which legacy-evidence paragraphs need upgraded review before closure.

Blocked action: Treating legacy quality-ref shape or asset counts as closure-ready.

| Item | Detail |
|---|---|
| 1.1.4 | Gemengde opgaven: economisch denken en rekenen |
| 1.2.1 | Individuele vraag |
| 1.2.2 | Vraagfactoren |
| 1.2.3 | Van individuele naar collectieve vraag |
| 1.2.4 | Gemengde opgaven: vraag |
| 1.3.1 | Aanbod |
| 1.3.2 | Marktevenwicht |
| 1.3.3 | Verschuivingen en nieuw evenwicht |
| 1.3.4 | Gemengde opgaven: aanbod en marktevenwicht |

### part_a_l16r_flag: Resolve remaining 1.1.3 Part A FLAG while preserving L1.6R pass-with-flags evidence

Status: `part_a_review_required`

Allowed next action: Keep L1.6R pass-with-flags visible without collapsing the remaining Part A FLAG.

Blocked action: Closing CP-6 while the Part A FLAG is hidden or ignored.

| Item | Detail |
|---|---|
| 1.1.3 | Grafieken en tabellen |

### target_exercise_final_review: Review migrated target-exercise records before reviewed_final promotion

Status: `target_exercise_review_required`

Allowed next action: Decide which migrated records can enter final review and what proof they need.

Blocked action: Promoting migrated records to reviewed_final from REF-CP6 alone.

| Item | Detail |
|---|---|
| 1.1.1 | Schaarste en economisch denken |
| 1.1.2 | Percentages en indexcijfers |
| 1.1.3 | Grafieken en tabellen |
| 1.2.1 | Individuele vraag |
| 1.2.2 | Vraagfactoren |
| 1.2.3 | Van individuele naar collectieve vraag |
| 1.3.1 | Aanbod |
| 1.3.2 | Marktevenwicht |
| 1.3.3 | Verschuivingen en nieuw evenwicht |

### formal_cp6_human_gate: Run formal CP-6 human review before any closure claim

Status: `packet_ready_not_closed`

Allowed next action: Use this packet as input to the future CP-6 human gate.

Blocked action: Writing closure or mutation authority inside REF-CP6.

| Item | Detail |
|---|---|
| GATE-CP6-year-1-paragraph-coverage | reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md |

## Paragraph Routing

| Paragraph | Target title | Lesson title | Alignment | Status | Routed lanes |
|---|---|---|---|---|---|
| 1.1.1 | Schaarste en economisch denken | Schaarste en economisch denken | aligned | migrated_from_v4_needs_v5_review | target_exercise_final_review |
| 1.1.2 | Percentages en indexcijfers | Percentages en indexcijfers | aligned | migrated_from_v4_needs_v5_review | target_exercise_final_review |
| 1.1.3 | Grafieken en tabellen | Grafieken en tabellen | aligned | migrated_from_v4_needs_v5_review | backfill_candidates<br>part_a_l16r_flag<br>target_exercise_final_review |
| 1.1.4 | Gemengde opgaven: economisch denken en rekenen | Gemengde opgaven | placeholder_title_aligned | placeholder_needs_review | placeholder_target_exercises<br>legacy_review_evidence |
| 1.2.1 | Individuele vraag | Individuele vraag | aligned | migrated_from_v4_needs_v5_review | legacy_review_evidence<br>target_exercise_final_review |
| 1.2.2 | Vraagfactoren | Vraagfactoren | aligned | migrated_from_v4_needs_v5_review | backfill_candidates<br>legacy_review_evidence<br>target_exercise_final_review |
| 1.2.3 | Van individuele naar collectieve vraag | Van individuele naar collectieve vraag | aligned | migrated_from_v4_needs_v5_review | backfill_candidates<br>legacy_review_evidence<br>target_exercise_final_review |
| 1.2.4 | Gemengde opgaven: vraag | Gemengde opgaven | placeholder_title_aligned | placeholder_needs_review | placeholder_target_exercises<br>legacy_review_evidence |
| 1.3.1 | Aanbod | Aanbod | aligned | migrated_from_v4_needs_v5_review | backfill_candidates<br>legacy_review_evidence<br>target_exercise_final_review |
| 1.3.2 | Marktevenwicht | Kostenstructuren | topic_mismatch | migrated_from_v4_needs_v5_review | source_lesson_alignment<br>backfill_candidates<br>legacy_review_evidence<br>target_exercise_final_review |
| 1.3.3 | Verschuivingen en nieuw evenwicht | Opbrengsten | topic_mismatch | migrated_from_v4_needs_v5_review | source_lesson_alignment<br>backfill_candidates<br>legacy_review_evidence<br>target_exercise_final_review |
| 1.3.4 | Gemengde opgaven: aanbod en marktevenwicht | Gemengde opgaven | placeholder_title_aligned | placeholder_needs_review | placeholder_target_exercises<br>legacy_review_evidence |
