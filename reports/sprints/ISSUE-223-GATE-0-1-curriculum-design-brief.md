# ISSUE-223-GATE-0-1 Curriculum Design Brief

Status: **PROVISIONAL GATE 0B-1 REVIEW SEED — BLOCKED BY BOOK 2 GATE 0B-0**

This brief is planning evidence only. It is not target authority and must not be
copied into student-facing lesson files. Final specialist or owner approval is
blocked until `BOOK-2-FOUNDATION-OUTLINE-1` has produced an approved and
integrated Book 2 outline and PR #224 has pinned that outline’s path, version,
commit, hash, status, and §2.1.1 role.

## Design principle

Use the sequence:

`course blueprint → Book 2 outline → chapter plan → lesson goals → target exercise → target operations → theory and worked example → exercise ladder`

Do not use the old target and paragraph to validate one another. Treat the old
package as a salvage library only after the new design is approved.

## Book-foundation check still required

| Field | Current evidence |
|---|---|
| Active course blueprint | To be pinned by `BOOK-2-FOUNDATION-OUTLINE-1`. |
| Detailed year/book blueprint | To be pinned by `BOOK-2-FOUNDATION-OUTLINE-1`. |
| Approved Book 2 outline | Not yet available. |
| Book-outline status | `blocked_pending_separate_outline_task` |
| §2.1.1 role | Provisional: first formal cost-structure paragraph; must be confirmed by the outline. |
| Incoming prerequisites | Provisional: generic arithmetic, algebraic substitution, and graph/table reading; no prior cost-structure mastery. |
| Explicit non-goals | Provisional: revenue, profit, break-even, marginal-cost operations, welfare, and market structures. |
| Downstream dependencies | Provisional: revenue/profit and marginal analysis; must be confirmed by the outline. |
| Target-registry record | `2.1.1`, current `reviewed_final`, unchanged in PR #224. |
| Unresolved warnings | Book 2 meso-level progression, prerequisite, convention, and dependency authority is absent. |
| Foundation verdict | `BLOCKED` until the approved outline is integrated and current. |

## Provisional internal goals

1. Classify cost components as constant or variable from how their total amount
   changes when `Q` changes within the stated period and production range,
   including cases where one expense category has both components.
2. Construct and use the functions for `TCK`, `TVK`, and `TK` from a context.
3. Calculate and interpret `GCK`, `GVK`, and `GTK`, using correct units.
4. Explain and compare what happens to total and average costs when `Q` changes
   under the assumption that variable cost per product remains constant.

The energy example is an application and misconception check within goal 1,
not a separate terminal goal unless stronger curriculum authority requires it.

## Provisional student-visible goals

> **Na deze paragraaf kun je**
>
> - kostenposten op basis van hun gedrag indelen als constant of variabel, ook als één soort kosten uit beide delen bestaat;
> - uit een context de formules voor `TCK`, `TVK` en `TK` opstellen en gebruiken;
> - `GCK`, `GVK` en `GTK` berekenen, interpreteren en van de juiste eenheid voorzien;
> - uitleggen waarom totale kosten kunnen stijgen terwijl de kosten per product dalen.

## Provisional target context

> **Bakkerij De Korenaar**
>
> De volgende gegevens gelden zolang de bakkerij tussen 500 en 1.000 broden per
> maand produceert en dezelfde ruimte en ovens gebruikt.
>
> - Voor huur en verzekering betaalt de bakkerij samen €440 per maand. Dit
>   bedrag verandert niet wanneer zij meer broden produceert.
> - Voor de netaansluiting en het energieabonnement betaalt zij €60 per maand.
>   Ook dit bedrag verandert niet met het aantal broden.
> - Meel en verpakking kosten samen €0,70 per brood.
> - Voor ieder extra brood nemen de elektriciteitskosten van de oven met €0,10
>   toe.
> - `Q` is het aantal broden per maand.

The context describes behaviour rather than naming categories, states the
relevant period and production range, and makes the simplifying electricity
assumption explicit.

## Provisional target questions

**a.** Deel de vier kostencomponenten in bij de constante of variabele kosten.
Leg vooral uit waarom de twee energiecomponenten niet in dezelfde categorie
vallen.

**b.** Stel de formules voor `TCK`, `TVK` en `TK` op als functie van `Q`.

**c.** Bereken bij `Q = 500` de `TCK`, `TVK`, `TK`, `GCK`, `GVK` en `GTK`.
Noteer telkens de juiste eenheid.

**d.** Bereken bij `Q = 1000` de `TK`, `GCK`, `GVK` en `GTK`. Gebruik de
formules uit vraag b.

**e.** Een leerling zegt:

> “Als de productie verdubbelt, verdubbelen alle totale kosten en halveren alle
> gemiddelde kosten.”

Welke delen van deze uitspraak zijn juist en welke niet? Leg met behulp van
`TCK`, `TVK`, `TK`, `GCK`, `GVK` en `GTK` uit wat er werkelijk gebeurt.

## Goal-to-target matrix

| Goal | Candidate target evidence | Current design status |
|---|---|---|
| Classify from behaviour, including a mixed expense category. | a requires classification and explanation of the different energy behaviours without pre-labelling. | Covered in principle; blocked pending outline and specialist review. |
| Construct and use total-cost functions. | b constructs the three functions; c and d use them. | Covered with reduced repeated arithmetic. |
| Calculate and interpret averages with correct units. | c samples all measures; d samples only measures needed for comparison; e requires interpretation. | Covered in principle; review must enforce euros per month versus euros per loaf. |
| Explain total/average movement under constant unit variable cost. | e requires an integrated judgment for all six measures. | Covered explicitly rather than inferred by the answer model. |

## Balance audit

The revised seed removes the duplicate energy item and avoids repeating all six
calculations at both quantities. It retains classification, formula
construction, calculation, units, comparison, misconception evaluation, and
verbal explanation. The Book 2 outline and specialist tests must still confirm
that this balance fits §2.1.1’s book role and does not crowd out necessary
preparation or retrieval.

## Misconception review set

- Cost names do not determine constant/variable classification; behaviour does.
- An energy bill may have constant and variable components.
- `TCK` can remain equal while `GCK` changes.
- `TK` can rise while `GTK` falls.
- `GVK` is constant only under the model assumption that variable cost per unit
  remains constant.
- Total costs use euros per month in this context; average costs use euros per
  loaf. Bare euro labels are insufficient for average costs.

## Provisional target timing

| Target component | Review estimate |
|---|---:|
| Read context | 1.0 min |
| a classification and explanation | 2.5 min |
| b formula construction | 1.5 min |
| c complete first calculation set and units | 3.5 min |
| d reduced second calculation set | 2.0 min |
| e integrated verbal judgment | 3.0 min |
| **Total candidate target** | **13.5 min** |

The design aim is approximately 12–14 minutes, subject to actual specialist
testing after Gate 0B-0. This estimate is not classroom proof and does not
authorize the former fixed 52-minute lesson route.

## Human decisions required after Gate 0B-0

1. Confirm the four goals against the approved Book 2 outline.
2. Approve or revise the student-visible wording.
3. Confirm mixed energy-component understanding as an application of goal 1.
4. Confirm target balance, dimensions, answer forms, difficulty, and timing.
5. Approve a final target before any target-authority PR begins.

Valid Gate 0B-1 outcomes remain `APPROVE_FOR_TARGET_AUTHORITY`, `REVISE`, or
`REJECT`. No outcome may be issued until the integrated outline is current.
