# RX.1 Proposed Mutation Queue

Status: proposed only; mutation_authorized is false for every record.

| Candidate | Name | Needs | Classification | Risk |
| --- | --- | --- | --- | --- |
| A61 | Tabelwaarden selecteren voor berekening |  | needs_new_representation_reading_unit | low |
| A62 | Waarden aflezen uit staafdiagram |  | needs_new_representation_reading_unit | medium |
| A63 | Waarden aflezen uit lijngrafiek |  | needs_new_representation_reading_unit | medium |
| A64 | Aandelen aflezen uit cirkeldiagram |  | needs_new_representation_reading_unit | medium |
| A65 | Absolute hoeveelheid berekenen uit aandeel en totaal | A64, A04 | needs_new_composed_calculation_unit | medium |
| A66 | Basiswaarde en vergelijkingswaarde in bron bepalen | A61 | needs_new_representation_reading_unit | low |
| A67 | Procentuele verandering berekenen vanuit tabel | A38, A61, A66 | needs_new_composed_calculation_unit | low |
| A68 | Procentuele verandering berekenen vanuit staafdiagram | A38, A62, A66 | needs_new_composed_calculation_unit | medium |
| A69 | Procentuele verandering berekenen vanuit lijngrafiek | A38, A63, A66 | needs_new_composed_calculation_unit | medium |
| A70 | Percentagepuntverandering in aandeel herkennen | A64 | needs_new_composed_calculation_unit | low |
| A71 | Procentuele verandering berekenen vanuit cirkeldiagram | A38, A64, A65, A70 | needs_new_composed_calculation_unit | high |
| A72 | Indexcijfer berekenen vanuit tabel | A39, A61 | needs_new_composed_calculation_unit | low |
| A73 | Indexverandering aflezen uit lijngrafiek | A39, A63 | needs_new_composed_calculation_unit | medium |
| A74 | Procentuele verandering berekenen vanuit indexcijfers | A38, A39, A66 | needs_new_composed_calculation_unit | low |
| A75 | Totale winst berekenen uit opbrengsten- en kostentabel | A04, A61 | needs_new_composed_calculation_unit | low |
| A76 | Totale winst berekenen uit P, GTK en Q | A14, A04 | needs_new_composed_calculation_unit | medium |
| A77 | Break-even aflezen uit TO-TK-grafiek | A63, A29 | needs_new_composed_calculation_unit | medium |
| A78 | Winst of verlies aflezen uit TO-TK-grafiek | A63, A75 | needs_new_composed_calculation_unit | medium |
| A79 | Maximale winst bepalen uit TO-TK-tabel | A75, A61 | needs_new_composed_calculation_unit | low |
| A80 | Winstrechthoek tekenen in producentengrafiek | A76, A45 | needs_new_composed_calculation_unit | medium |
| A81 | Winst, verlies en break-even herkennen in producentengrafiek | A76, A80 | needs_new_composed_calculation_unit | medium |
| A82 | Elasticiteit berekenen uit tabelwaarden | A15, A61, A66 | needs_new_composed_calculation_unit | medium |
| A83 | Elasticiteit berekenen uit vraaggrafiek | A15, A46, A66 | needs_new_composed_calculation_unit | medium |
| A84 | Omzetverandering beoordelen met elasticiteit uit bron | A15, A67 | needs_new_composed_calculation_unit | medium |

RX.2+ must re-check live numbering and apply only human-approved candidates through CLI.
