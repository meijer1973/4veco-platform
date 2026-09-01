# ISSUE-223-GATE-0-1 Curriculum Design Brief

Status: **DRAFT FOR SPECIALIST AND HUMAN OWNER REVIEW**

This brief is planning evidence only. It is not target authority and must not be
copied into student-facing lesson files before approval.

## Design principle

Use the sequence:

`lesson goals → target exercise → target operations → theory and worked example → exercise ladder`

Do not use the old target and paragraph to validate one another. Treat the old
package as a salvage library only after the new design is approved.

## Provisional internal goals

1. Explain from the behaviour of a cost item whether it is constant or variable
   when production changes.
2. Construct `TCK`, `TVK`, and `TK` from a context and calculate with them.
3. Calculate `GCK`, `GVK`, and `GTK` and use the correct units.
4. Explain how total and average costs change as `Q` rises when variable cost per
   product remains constant.
5. Explain why one expense type, such as energy, can contain both a constant and
   a variable component.

## Provisional student-visible goals

> **Na deze paragraaf kun je**
>
> - aan het gedrag van een kostenpost uitleggen of deze constant of variabel is;
> - uit een context de formules voor `TCK`, `TVK` en `TK` opstellen en gebruiken;
> - `GCK`, `GVK` en `GTK` berekenen met de juiste eenheid;
> - uitleggen hoe totale en gemiddelde kosten veranderen als `Q` stijgt, wanneer de variabele kosten per product gelijk blijven;
> - uitleggen waarom energiekosten een constant én een variabel deel kunnen hebben.

Specialist review must decide whether five bullets are sufficiently concise and
whether bullet four remains readable while stating the required model condition.

## Candidate target context

**Bakkerij De Korenaar** bekijkt haar kosten per maand, binnen haar huidige
productiecapaciteit:

- Huur en verzekering kosten samen €440 per maand.
- Voor de aansluiting en het vaste deel van het energiecontract betaalt de
  bakkerij €60 per maand.
- Per brood gebruikt zij €0,70 aan meel en verpakking.
- Het extra elektriciteitsverbruik van de oven kost gemiddeld €0,10 per brood.
- `Q` is het aantal broden per maand.

## Candidate target subquestions

a. Deel de vier kostencomponenten in als constant of variabel. Leg je indeling
uit vanuit wat er met het totale bedrag gebeurt als `Q` verandert. Leg ook uit
waarom de twee energiecomponenten in verschillende categorieën vallen.

b. Stel de formules voor `TCK`, `TVK` en `TK` op als functie van `Q`.

c. Bereken bij `Q = 500` de `TCK`, `TVK`, `TK`, `GCK`, `GVK` en `GTK`. Noteer
steeds de juiste eenheid.

d. Bereken bij `Q = 1000` de `TK`, `GCK`, `GVK` en `GTK`.

e. Vergelijk beide situaties. Leg uit waarom:

- `TK` stijgt;
- `GCK` daalt;
- `GVK` in dit model gelijk blijft;
- `GTK` kan dalen terwijl de totale kosten stijgen.

f. Een leerling zegt: “Energiekosten zijn variabele kosten, dus een
energiecontract kan nooit constante kosten bevatten.” Leg uit waarom deze
uitspraak onjuist is.

## Goal-to-target matrix

| Goal | Candidate target evidence | Current design status |
|---|---|---|
| Classify from behaviour. | a and f require classification and justification. | Covered in principle; wording/load review required. |
| Construct and calculate total costs. | b, c, and d. | Covered; calculation volume may be reducible. |
| Calculate averages and units. | c and d. | Covered; verify total-cost versus average-cost unit wording. |
| Explain total/average movement under constant unit variable cost. | e. | Covered explicitly rather than inferred by the answer model. |
| Explain mixed energy components. | a and f. | Covered twice; review whether both are needed or one can be integrated. |

## Balance audit

The candidate adds the missing classification, explanation, comparison, units,
and misconception operations. It may still ask too much in one target because
both a and f address energy classification and c/d retain substantial arithmetic.
Specialist review should reduce redundancy without deleting any approved goal.

Potential simplifications for review, not decisions:

- combine a's energy explanation with f rather than require it twice;
- supply one intermediate total in d while retaining independent average and
  comparison operations;
- calculate all six measures at one quantity and only the measures needed for
  comparison at the second;
- use a compact table without turning table production into a target operation.

## Misconception review set

- Cost names do not determine constant/variable classification; behaviour does.
- An energy bill may have constant and variable components.
- `TCK` can remain equal while `GCK` changes.
- `TK` can rise while `GTK` falls.
- `GVK` is constant only under the model assumption that variable cost per unit
  remains constant.
- Total costs use euros for the period; average costs use euros per product.

## Provisional target timing

| Target component | Initial estimate |
|---|---:|
| Read context | 1.0 min |
| a classification and justification | 3.0 min |
| b formula construction | 1.5 min |
| c first calculation set and units | 4.0 min |
| d second calculation set | 2.5 min |
| e four-part comparison/explanation | 4.0 min |
| f misconception evaluation | 2.0 min |
| **Total candidate target** | **18.0 min** |

Eighteen minutes is a design warning, not approval. Gate 0B must decide which
redundancy to remove and produce a target that remains balanced at an intended
difficulty and fits the eventual `<= 55` minute whole-lesson equation. The
former 52-minute route is not reused.

## Human decisions required

1. Approve/revise/reject the five internal goals.
2. Approve/revise the student-visible wording.
3. Decide whether explicit mixed energy-component understanding is a core goal.
4. Reduce or approve the target's calculation and explanation load.
5. Confirm required units and relevant-period/capacity wording.
6. Approve a final target before any target-authority PR begins.

Valid overall outcomes: `APPROVE_FOR_TARGET_AUTHORITY`, `REVISE`, or `REJECT`.
