# Sprint ENGINE-OP-1: Student-Path Trace

Generated: 2026-05-31

Plan: `reports/sprints/ENGINE-OP-1-plan.md`

## Method

Existing generated Book 1 output was served locally from
`../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod` on
`http://127.0.0.1:8765`. Pages were opened without running deploy or mutating
lesson output. Screenshots are recorded in
`reports/sprints/ENGINE-OP-1-screenshot-manifest.md`.

## Path Trace

| Paragraph | Landing route visible to student | Opened practice/check route | Visible skill-map state | Task played or exposed | Feedback / next action | Operational judgment |
|---|---|---|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | Landing shows Start, Leer, Oefen, Check, Verdiep. Oefen text says the student can choose an oefenroute for redeneren; Rekenen/Grafieken are not primary oefenroutes. | Redeneren opens. Check opens as `Korte check`. Math/support pages exist but are not primary Oefen-route cards. | Redeneren route panel is visible, but focus is mis-scoped: it recommends `Vergelijking oplossen`, `Substitueren`, and `Tabelwaarden selecteren voor berekening`, which do not match the paragraph's schaarste/alternatieve-kosten target. | Redeneren menu offers five modes. Check page offers four choice questions about schaarste and alternatieve kosten. | Check gives local feedback such as "Dat past bij de uitleg" and next-step suggestions like "Oefen dit nog met Redeneren" or "Oefen dit nog met het Stappenplan". | Check is useful as a local short check, but not target-equivalent proof. Skill-map route is visible yet unreliable for this paragraph because it surfaces unrelated calculation/graph skills. |
| `1.1.2` Percentages en indexcijfers | Landing shows Redeneren, Rekenen, Grafieken. No paragraph Check section is visible; the old instapquiz still says "Check snel wat je al weet" in Start. | Rekenen opens the scoped `wiskundevaardigheden.html` route. Redeneren opens. Grafieken opens. No exit-ticket/check page exists for the paragraph. | Math skill tree shows two scoped skills: `Procentuele verandering berekenen` and `Prijsindex (CPI) berekenen`. Redeneren and Grafieken shared route panels are visible but empty: "Deze route is nog niet gevuld." | Math opens a numeric exercise: "Een waarde verandert van 127 naar 152.4. Bereken de procentuele verandering." Redeneren opens a steps-ordering task. Grafieken opens a graph-reading numeric input task. | Math route offers "Controleer" and hint/error counters. Redeneren and Grafieken show local progress/session counters but empty shared route panels. | Rekenen is restored and operational at a practice level. The shared route layer is not coherent across engines yet, and there is no target-equivalent checkpoint route. |
| `1.1.3` Grafieken en tabellen | Landing shows Redeneren, Rekenen, Grafieken. No paragraph Check section is visible; the old instapquiz still says "Check snel wat je al weet" in Start. | Grafieken opens the strongest operational route. Rekenen and Redeneren also open. No exit-ticket/check page exists for the paragraph. | Grafieken route panel is useful and scoped: focus is `Waarden aflezen uit staafdiagram`, with `Waarden aflezen uit lijngrafiek` available. Redeneren route focuses `Tabelwaarden selecteren voor berekening`. Math skill tree shows graph/table and calculation skills. | Graph game asks the student to read a bar value and enter a numeric answer with unit context. | On answer `300`, graph game responds "Goed gelezen" and gives source/value/calculation feedback, then offers "Volgende opgave". Boundary copy says local practice only, no diagnosis, assessment, or automatic route. | Graph route is the clearest current operational proof. It still uses its own task UI rather than the GAME-UX-3A shared task shell and does not yet connect to a target-equivalent checkpoint. |

## Cross-Route Observations

- The landing pages make the three practice modes visible for `1.1.2` and
  `1.1.3`, but not for `1.1.1`.
- Shared skill-map route panels exist on reasoning, graph, exit-ticket, and
  procedure surfaces, but not consistently in the math skill-tree page.
- Several shared route panels are empty or mis-scoped, especially `1.1.2`
  reasoning/graph and `1.1.1` reasoning.
- The GAME-UX-3A task shell is not present in generated Book 1 output; current
  math and graph tasks still use their engine-specific interaction models.
- No target-equivalent completion language was observed or authorized.
