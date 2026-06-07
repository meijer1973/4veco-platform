# Empty-Needs Audit

Generated: 2026-06-07T07:31:58.624Z
Sprint: R2.1
Source: `references/machine/micro-teaching-units.json`

## Status

Non-mutating audit. No machine-reference data was changed.

## Summary

- Live units: 253
- Units with empty needs: 52
- Status distribution: underbouw_assumed=20, true_zero=3, ambiguous=27, false_zero=2
- Severity distribution: low=23, medium=29

## Review Table

| Unit | Name | Layer | Mastery | Recommended status | Severity | Recommended needs |
|---|---|---:|---|---|---|---|
| A01 | Lineaire functie opstellen | 0 | apply | underbouw_assumed | low | - |
| A02 | Vergelijking oplossen | 0 | apply | underbouw_assumed | low | - |
| A03 | Functie omschrijven (P↔Q) | 0 | apply | underbouw_assumed | low | - |
| A04 | Substitueren | 0 | apply | underbouw_assumed | low | - |
| A05 | Snijpunt met P-as berekenen | 0 | apply | underbouw_assumed | low | - |
| A38 | Procentuele verandering berekenen | 0 | apply | underbouw_assumed | low | - |
| A42 | Grafische verschuiving met voor-en-na pijlen | 1 | apply | underbouw_assumed | low | - |
| A45 | P-Q grafiek tekenen uit tabel | 0 | apply | underbouw_assumed | low | - |
| A61 | Tabelwaarden selecteren voor berekening | 0 | apply | underbouw_assumed | low | - |
| A62 | Waarden aflezen uit staafdiagram | 0 | apply | underbouw_assumed | low | - |
| A63 | Waarden aflezen uit lijngrafiek | 0 | apply | underbouw_assumed | low | - |
| A64 | Aandelen aflezen uit cirkeldiagram | 0 | apply | underbouw_assumed | low | - |
| A80 | Noem of geef-aan antwoord geven | 0 | apply | underbouw_assumed | low | - |
| A81 | Bron gebruiken in een antwoord | 0 | apply | underbouw_assumed | low | - |
| A88 | Schaalfactoren in examencijfers toepassen | 0 | apply | underbouw_assumed | low | - |
| A89 | GO herkennen als prijsfunctie van de monopolist | 0 | understand | underbouw_assumed | low | - |
| A96 | Bereken-vraag beantwoorden | 0 | apply | underbouw_assumed | low | - |
| A97 | Leg-uit-dat antwoord opbouwen | 0 | apply | underbouw_assumed | low | - |
| A98 | Leg-uit-of antwoord opbouwen | 0 | apply | underbouw_assumed | low | - |
| A99 | Leg uit met voorbeeld beantwoorden | 0 | apply | underbouw_assumed | low | - |
| B01 | Schaarste als kerneconomisch probleem | 1 | understand | true_zero | low | - |
| D02 | Constante kosten en winst | 1 | understand | ambiguous | medium | - |
| D09 | Homogene en heterogene goederen | 1 | understand | ambiguous | medium | - |
| D15 | Marktvormen classificeren | 1 | understand | ambiguous | medium | - |
| D27 | Substituten en complementen | 1 | understand | ambiguous | medium | - |
| D32 | Verschuiving versus beweging langs de curve | 1 | understand | false_zero | medium | D01, D03 |
| D35 | Betalingsbereidheid definiëren | 1 | understand | ambiguous | medium | - |
| D42 | Belastingdruk in eurobedragen berekenen | 0 | apply | true_zero | low | - |
| E02 | Intertemporele ruil in pensioenstelsels | 1 | understand | ambiguous | medium | - |
| E06 | Voorraad- en stroomgrootheden onderscheiden | 1 | understand | ambiguous | medium | - |
| F01 | Berovingsprobleem herkennen | 1 | understand | ambiguous | medium | - |
| F02 | Collectief goed classificeren | 1 | understand | ambiguous | medium | - |
| F03 | Dominante strategie | 1 | understand | ambiguous | medium | - |
| F15 | Verzonken kosten negeren in beslissingen | 1 | understand | ambiguous | medium | - |
| F16 | MPC–MSC en MPB–MSB onderscheiden | 1 | understand | ambiguous | medium | - |
| F19 | Maatschappelijke kosten verbaal herkennen | 0 | understand | true_zero | low | - |
| G06 | Principaal-agentprobleem identificeren | 1 | understand | ambiguous | medium | - |
| G07 | Transactiekosten berekenen en interpreteren | 1 | apply | ambiguous | medium | - |
| G08 | Risicodeling via gemeenschappelijk fonds | 1 | understand | ambiguous | medium | - |
| G10 | Informatieasymmetrie verzekeringsmarkt | 1 | understand | ambiguous | medium | - |
| G11 | Wisselkoersrisico bij internationale handel | 1 | understand | ambiguous | medium | - |
| H05 | Circulaire economie in groen bbp | 1 | understand | ambiguous | medium | - |
| H10 | Gini-coefficient bij recessie | 1 | understand | ambiguous | medium | - |
| H16 | Soepeler ontslagrecht en werkgeversrisico | 1 | understand | false_zero | medium | L10 |
| H21 | Staatsschuldquote berekenen | 1 | apply | ambiguous | medium | - |
| H29 | Obligatie als verhandelbaar schuldpapier | 1 | understand | ambiguous | medium | - |
| I01 | Anticyclisch begrotingsbeleid | 1 | understand | ambiguous | medium | - |
| I06 | Deflatiespiraal | 1 | understand | ambiguous | medium | - |
| I14 | Multiplier en lekkages | 1 | understand | ambiguous | medium | - |
| L01 | Waarde marginaal product (VMP) | 1 | apply | ambiguous | medium | - |
| L03 | Afgeleide vraag (derived demand) | 1 | understand | ambiguous | medium | - |
| L05 | Beroepsbevolking, niet-beroepsbevolking, werkloze beroepsbevolking | 1 | understand | ambiguous | medium | - |

## Review Rule

These are machine-suggested classifications for review. They are not accepted dependency changes. Human review is required before applying any `false_zero` recommendation to `references/machine/`.
