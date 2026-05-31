# Sprint SKILLMAP-OP-1: Student Route Proof

Generated: 2026-05-31

## Summary

SKILLMAP-OP-1 now gives the audited Book 1 routes a visible student-facing
skill-map panel. The rendered panels show:

- the relevant practice mode;
- the paragraph target;
- the reason this route belongs on the current practice surface;
- a practice action link;
- the recommended focus skill;
- local practice progress only;
- no visible MTU IDs.

This proof covers route visibility only. It does not claim target-equivalent
exit-ticket proof, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, Scale Gate 1, or
student/product use.

## Rendered Route Cases

| Case | Surface | Visible route proof |
|---|---|---|
| `1.1.1` | Redeneer-spel | Shows `Schaarste als kerneconomisch probleem` and `Alternatieve kosten in een keuze-situatie`, with paragraph target and `Open redeneer-spel`. |
| `1.1.2` | Redeneer-spel | Shows the calculation route for percentage/index reasoning, with `Procentuele verandering berekenen` and `Prijsindex (CPI) berekenen`. |
| `1.1.2` | Wiskundevaardigheden | Shows the shared calculation route on the math page, with paragraph target, focus, and `Open rekenroute`. |
| `1.1.2` | Grafiekenspel | Shows graph-reading skills plus the calculation chain needed for graph values. |
| `1.1.3` | Redeneer-spel | Shows table/graph source-route skills instead of an empty generic panel. |
| `1.1.3` | Wiskundevaardigheden | Shows table-value selection plus percentage/index support. |
| `1.1.3` | Grafiekenspel | Shows `Tabelwaarden selecteren voor berekening`, `Waarden aflezen uit staafdiagram`, and `Waarden aflezen uit lijngrafiek`. |

## Browser QA

The in-app browser inspected the live local output on desktop and mobile
viewports. The route DOM check found one route panel per audited page, no
route-item overflow, no route wider than the viewport, and no visible internal
MTU code in the route text.

Representative route text from browser QA:

```text
REKENEN Oefenroute Rekenen PARAGRAAFDOEL Procentuele verandering en indexcijfers controleerbaar berekenen. Oefen eerst procentuele verandering en daarna indexcijfers met zichtbare tussenstappen. Open rekenroute Focus: Procentuele verandering berekenen Procentuele verandering berekenen aanbevolen om nu te oefenen 0/3 Prijsindex (CPI) berekenen later nodig 0/3 Alleen lokale oefenvoortgang. Geen diagnose, beoordeling of automatische route.
```

## Deterministic Checks

`check-skillmap-op1-route-output.js` validates the generated output after
deploy. It asserts that:

- generated `base-elements.js` exports `ROUTE_SKILLS`;
- `B01` and `B02` appear in `ROUTE_SKILLS` but not in runnable `SKILLS`;
- all seven audited route panels render non-empty;
- expected student-facing skill labels appear;
- practice links render;
- visible route text does not expose internal MTU codes;
- prohibited product claims remain absent.

## Screenshot Evidence

Screenshots are listed in
`reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`.

