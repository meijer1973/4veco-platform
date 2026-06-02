# Sprint REASON-ANSWERFORM-2: Answer-Form Scaffold Map

Generated: 2026-06-02

Status: implementation evidence captured; sprint closure blocked until real
planning/lead-review artifacts are available.

## Scope

This map records how the generated Book 1 reasoning practice route now attaches
answer-form scaffold metadata to student-facing reasoning practice. It is local
practice evidence only. It does not authorize target-equivalent proof,
diagnostics, adaptive routing, mastery, sequencing, summative use, Scale Gate 1,
or product use.

Machine-readable map:
`reports/json/reason-answerform2-scaffold-map.json`

## Scaffold Families

| Unit | Student-facing label | Internal lane | Current use |
|---|---|---|---|
| A97 | Leg uit dat | `leg_uit_dat` | Active practice scaffold for fixed-conclusion and calculation-coordinated reasoning. |
| A98 | Leg uit of | `leg_uit_of` | Active practice scaffold for direction-first, correction, and judgement-style reasoning. |
| A99 | Leg uit met voorbeeld | `leg_uit_met_voorbeeld` | Available scaffold, but no generated Book 1 1.1.1/1.1.2 reasoning example currently selects it. |
| A81 | Bron gebruiken | `bron_modifier` | Future source-use modifier pattern only; must combine with an underlying answer form. |
| A96 | Berekening tonen | `bereken` | Coordination unit for calculation reasoning, not a standalone reasoning scaffold. |

## Paragraph Map

| Paragraph | Active generated scaffolds | Source-use pattern | Boundary |
|---|---|---|---|
| 1.1.1 | A97 and A98 | A81 + A97, future pattern only | Local practice scaffold, no target-equivalent proof. |
| 1.1.2 | A97 coordinated with A96, and A98 | A81 + A97, future pattern only | Local practice scaffold, no target-equivalent proof. |

## A81 Modifier Boundary

A81 is represented only as source-use plus an underlying answer form. The
runtime scaffold helper rejects A81 as a standalone complete answer form, and
the checker verifies the source-use pattern has both:

- `sourceUseModifier: true`
- `underlyingAnswerFormUnitId: "A97"`

No generated route currently claims a live source-based explanation route for
1.1.3.

## Student-Facing Output Boundary

Rendered output uses friendly labels such as `Leg uit dat`, `Leg uit of`, and
`Antwoordvorm oefenen`. Student-facing route text must not display A-codes, MTU
codes, generator IDs, PV labels, or target-equivalent/product claims.

The screenshot proof and route checker currently record:

- no visible A81/A96/A97/A98/A99 leakage;
- no MTU or generator-code leakage;
- no target-equivalent completion language;
- no diagnostics, mastery, sequencing, summative, Scale Gate 1, or product-use
  claim.

## Carried Flags

- A99 is available in the scaffold catalog but lacks a generated Book 1 1.1.1 or
  1.1.2 live evidence case.
- A81 remains a future source-use pattern. Actual source-based explanation needs
  source/value evidence and a separate route-adoption sprint.
- A96 is coordination metadata for calculation reasoning and must not be treated
  as a student-facing reasoning generator.
- The proof script allows protective boundary wording such as "Geen diagnose";
  positive diagnostic or completion claims still fail.
