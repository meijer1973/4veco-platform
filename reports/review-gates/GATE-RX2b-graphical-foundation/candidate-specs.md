# RX.2b Candidate Specs

Status: prepared for human review. Mutation is not authorized by this artifact.

| ID | Name | Lane | Needs | Aspects | Risk | Evidence | Generator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A62 | Waarden aflezen uit staafdiagram | approved_review_queue | [] | grafisch | medium | didactic_prior_rationale | missing_generator_implementation |
| A63 | Waarden aflezen uit lijngrafiek | approved_review_queue | [] | grafisch | medium | target_exercise_evidence | missing_generator_implementation |
| A64 | Aandelen aflezen uit cirkeldiagram | approved_review_queue | [] | grafisch, rekenen | medium | didactic_prior_rationale | missing_generator_implementation |
| A65 | Absolute hoeveelheid berekenen uit aandeel en totaal | approved_review_queue | A64, A04 | grafisch, rekenen | medium | exam_question_evidence | missing_generator_implementation |
| A68 | Procentuele verandering berekenen vanuit staafdiagram | approved_review_queue | A38, A62, A66 | grafisch, rekenen | medium | didactic_prior_rationale | missing_generator_implementation |
| A69 | Procentuele verandering berekenen vanuit lijngrafiek | approved_review_queue | A38, A63, A66 | grafisch, rekenen | medium | target_exercise_evidence | missing_generator_implementation |
| A73 | Indexverandering aflezen uit lijngrafiek | approved_review_queue | A39, A63 | grafisch, rekenen | medium | target_exercise_evidence | missing_generator_implementation |
| A71 | Procentuele verandering berekenen vanuit cirkeldiagram | conditional_high_risk | A38, A64, A65, A70 | grafisch, rekenen, verbaal | high | didactic_prior_rationale | missing_generator_implementation |

## Draft Unit Specs

### A62 Waarden aflezen uit staafdiagram

- lane: approved_review_queue
- kern: Lees een waarde af uit een staafdiagram door context, labels, eenheid en schaal te controleren voordat je de staafhoogte gebruikt.
- needs: []
- aspects: [grafisch]
- risk: medium
- evidence_status: didactic_prior_rationale
- generator_status: missing_generator_implementation
- procedure:
  1. Lees de titel en bepaal de economische context van het staafdiagram.
  2. Bepaal welke variabele wordt weergegeven en in welke eenheid die staat.
  3. Controleer de categorie- of legendalabels zodat je de juiste staaf kiest.
  4. Controleer de schaal van de as, inclusief sprongen en of de as bij nul begint.
  5. Lees de hoogte van de gevraagde staaf af.
  6. Bepaal of de waarde exact kan worden afgelezen of dat je moet schatten tussen schaalstrepen.
- pitfalls:
  - Staven visueel vergelijken zonder de schaal of asbreuk te controleren.
  - Een staaf bij de verkeerde categorie of legenda aflezen.
### A63 Waarden aflezen uit lijngrafiek

- lane: approved_review_queue
- kern: Lees een punt of periode af uit een lijngrafiek door context, aslabels, eenheden, schaal en eventuele interpolatie expliciet te controleren.
- needs: []
- aspects: [grafisch]
- risk: medium
- evidence_status: target_exercise_evidence
- generator_status: missing_generator_implementation
- procedure:
  1. Lees de titel en bepaal welke ontwikkeling of context de lijngrafiek toont.
  2. Bepaal welke variabelen op de horizontale en verticale as staan en noteer de eenheden.
  3. Controleer de labels, jaartallen of meetpunten die bij de vraag horen.
  4. Controleer de schaal op beide assen en let op ongelijke stappen of asbreuken.
  5. Lees het gevraagde punt of de gevraagde punten af.
  6. Bepaal of je exact afleest, schat tussen schaalstrepen, of interpoleert tussen twee punten.
- pitfalls:
  - Het verkeerde jaar of meetpunt gebruiken.
  - Een lijnstuk behandelen als totaal over een periode in plaats van als waarden op meetpunten.
### A64 Aandelen aflezen uit cirkeldiagram

- lane: approved_review_queue
- kern: Lees een aandeel uit een cirkeldiagram door context, categorie, legenda, totaal en de betekenis van procenten of delen te controleren.
- needs: []
- aspects: [grafisch, rekenen]
- risk: medium
- evidence_status: didactic_prior_rationale
- generator_status: missing_generator_implementation
- procedure:
  1. Lees de titel en bepaal welk totaal het cirkeldiagram verdeelt.
  2. Bepaal welke categorie of legenda bij het gevraagde deel hoort.
  3. Controleer welke variabele, eenheid of meetgroep het diagram gebruikt.
  4. Controleer de schaal of verdeling van de sectoren: percentages, graden, breuken of alleen visuele delen.
  5. Controleer of er een totaalbedrag of totale hoeveelheid bij de bron hoort.
  6. Lees het aandeel van de gevraagde categorie af.
  7. Bepaal of het aandeel exact is gegeven of dat je het moet schatten uit de sector of legenda.
- pitfalls:
  - Een aandeel uit het cirkeldiagram behandelen als een absolute hoeveelheid.
  - Aandelen uit twee cirkeldiagrammen vergelijken zonder te controleren of de totalen gelijk zijn.
### A65 Absolute hoeveelheid berekenen uit aandeel en totaal

- lane: approved_review_queue
- kern: Bereken een absolute hoeveelheid door een aandeel uit een bron te vermenigvuldigen met het totale aantal, bedrag of volume.
- needs: [A64, A04]
- aspects: [grafisch, rekenen]
- risk: medium
- evidence_status: exam_question_evidence
- generator_status: missing_generator_implementation
- procedure:
  1. Lees het aandeel uit de bron en zet het om naar een decimaal of breuk.
  2. Bepaal het totale aantal, bedrag of volume waarop het aandeel slaat.
  3. Controleer of aandeel en totaal bij dezelfde periode, groep en eenheid horen.
  4. Bereken absolute hoeveelheid = aandeel x totaal.
  5. Rond af op de manier die bij de context of vraag past.
- pitfalls:
  - Het percentage als geheel getal gebruiken, bijvoorbeeld 25 x totaal in plaats van 0,25 x totaal.
  - Een aandeel gebruiken dat bij een ander totaal of andere periode hoort.
### A68 Procentuele verandering berekenen vanuit staafdiagram

- lane: approved_review_queue
- kern: Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een staafdiagram hebt afgelezen met de juiste basiswaarde.
- needs: [A38, A62, A66]
- aspects: [grafisch, rekenen]
- risk: medium
- evidence_status: didactic_prior_rationale
- generator_status: missing_generator_implementation
- procedure:
  1. Lees de titel, variabele, eenheid, labels en schaal van het staafdiagram.
  2. Bepaal welke staaf de oude waarde is en welke staaf de nieuwe waarde is.
  3. Lees beide staafwaarden zo nauwkeurig mogelijk af.
  4. Controleer of beide waarden dezelfde grootheid en eenheid hebben.
  5. Bereken de verandering: nieuwe waarde min oude waarde.
  6. Deel de verandering door de oude waarde en vermenigvuldig met 100 procent.
- pitfalls:
  - De nieuwe waarde als noemer gebruiken.
  - Staafhoogtes visueel vergelijken zonder de as-schaal te gebruiken.
### A69 Procentuele verandering berekenen vanuit lijngrafiek

- lane: approved_review_queue
- kern: Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een lijngrafiek of tijdreeks hebt afgelezen.
- needs: [A38, A63, A66]
- aspects: [grafisch, rekenen]
- risk: medium
- evidence_status: target_exercise_evidence
- generator_status: missing_generator_implementation
- procedure:
  1. Lees de titel, assen, eenheden en schaal van de lijngrafiek.
  2. Bepaal welk punt de oude waarde is en welk punt de nieuwe waarde is.
  3. Lees beide waarden exact af, schat tussen schaalstrepen, of interpoleer als dat nodig is.
  4. Controleer of de periode en grootheid overeenkomen met de vraag.
  5. Bereken de verandering: nieuwe waarde min oude waarde.
  6. Deel door de oude waarde en vermenigvuldig met 100 procent.
- pitfalls:
  - Het verkeerde begin- of eindjaar nemen.
  - Indexpunten, absolute verandering en procentuele verandering door elkaar halen.
### A73 Indexverandering aflezen uit lijngrafiek

- lane: approved_review_queue
- kern: Lees indexcijfers uit een lijngrafiek af en onderscheid een verandering in indexpunten van een procentuele verandering.
- needs: [A39, A63]
- aspects: [grafisch, rekenen]
- risk: medium
- evidence_status: target_exercise_evidence
- generator_status: missing_generator_implementation
- procedure:
  1. Lees de titel, assen, eenheden en schaal van de indexgrafiek.
  2. Bepaal het basisjaar en controleer dat dit op 100 staat of als basis wordt genoemd.
  3. Lees het oude en nieuwe indexcijfer uit de lijngrafiek af.
  4. Bereken de verandering in indexpunten door oud van nieuw af te trekken.
  5. Controleer of de vraag indexpunten of een procentuele verandering vraagt.
  6. Gebruik A74 als de vraag een procentuele verandering tussen indexcijfers vraagt.
- pitfalls:
  - Een indexpuntverandering direct als procentuele verandering benoemen.
  - Een indexgrafiek behandelen alsof de verticale as absolute eurobedragen toont.
### A71 Procentuele verandering berekenen vanuit cirkeldiagram

- lane: conditional_high_risk
- kern: Bereken een procentuele verandering vanuit cirkeldiagrammen alleen nadat je aandelen, totalen en procentpuntverschillen correct hebt onderscheiden.
- needs: [A38, A64, A65, A70]
- aspects: [grafisch, rekenen, verbaal]
- risk: high
- evidence_status: didactic_prior_rationale
- generator_status: missing_generator_implementation
- procedure:
  1. Lees per cirkeldiagram de titel, categorie, legenda en het totaal waarop de aandelen slaan.
  2. Lees het oude en nieuwe aandeel van de relevante categorie af.
  3. Controleer of de totalen in beide perioden gelijk zijn.
  4. Als de totalen verschillen, bereken eerst de absolute oude en nieuwe hoeveelheid.
  5. Bepaal of de vraag een procentpuntverandering of een procentuele verandering vraagt.
  6. Bereken de procentuele verandering alleen met de oude absolute waarde of oude percentagewaarde als basis.
- pitfalls:
  - Een verschil van aandelen in procentpunten verwarren met een procentuele verandering.
  - Aandelen uit twee diagrammen vergelijken terwijl de onderliggende totalen verschillen.
- review_flags:
  - A71-high-risk-conditional: Pie-chart percentage change can require share reading, share-times-total reconstruction, percentage-point distinction, and total comparison.
