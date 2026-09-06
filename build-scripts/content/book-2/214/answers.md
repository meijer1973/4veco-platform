# 2.1.4 Gemengde opgaven – antwoorden

Controleer de relatie, ingevulde waarden, uitkomst, eenheid en begrenzing.
Rond niet tussentijds af. Geef een afgerond geldbedrag waar nodig met twee
decimalen en een benaderingsteken; een exacte breuk mag ook. De genoemde
totalen gelden telkens voor dezelfde dag. Een andere juiste rekenroute of
een juiste uitleg in eigen woorden telt mee. Beoordeel de redenering na een
rekenfout apart; tel dezelfde fout niet onnodig opnieuw aan.

## Opgave 1 — Lichtservice bij de sportclub

### 1a — gegevens, gedrag en functies

| Onderdeel | Classificatie | Reden binnen deze dag en 0–40 montages |
|---|---|---|
| Werkplek en gereedschap: € 80 per dag | Constant | Het totale dagbedrag verandert niet met Q. |
| Reservering aansluiting: € 20 per dag | Constant | Het totale dagbedrag verandert niet met Q. |
| Lampje en bevestiging: € 2 per montage | Variabel | Het totale bedrag stijgt bij elke extra montage. |
| Stroomverbruik: € 0,50 per montage | Variabel | Het totale bedrag stijgt bij elke extra montage. |

De **800 leden** zijn niet de gemaakte en betaalde montages en zijn hier niet
nodig. Voor 0 ≤ Q ≤ 40, met dezelfde capaciteit en afspraken:

- TCK = 80 + 20 = **100 euro per dag**.
- TVK = (2 + 0,50)Q = **2,50Q euro per dag**.
- TK = TCK + TVK = **100 + 2,50Q euro per dag**.

*Waarom:* constante kosten gaan over een gelijkblijvend totaal bij veranderende
Q. Het tarief van € 2,50 per montage blijft hier gelijk, maar het variabele
**totaal** groeit met Q. De naam van een rekening bepaalt de classificatie niet.

**Nakijken:** vier classificaties, redenen over gedrag van totalen, het
uitgesloten ledenaantal, drie functies en het normale bereik. Gebruik deze
normale kostenfunctie niet voorbij 40 montages.

<div class="page-break"></div>

### 1b — alle totalen en gemiddelden

Bereken eerst de totalen bij dezelfde Q:

| Q (montages per dag) | TCK (€/dag) | TVK (€/dag) | TK (€/dag) |
|---|---|---|---|
| 20 | 100 | 2,50 × 20 = 50 | 100 + 50 = 150 |
| 40 | 100 | 2,50 × 40 = 100 | 100 + 100 = 200 |

Deel vervolgens elk passend totaal door diezelfde positieve Q:

| Q | GCK (€/montage) | GVK (€/montage) | GTK (€/montage) |
|---|---|---|---|
| 20 | 100/20 = 5 | 50/20 = 2,50 | 150/20 = 7,50 |
| 40 | 100/40 = 2,50 | 100/40 = 2,50 | 200/40 = 5 |

**Vergelijking en waarom:** TCK blijft € 100 per dag. TVK verdubbelt van
€ 50 naar € 100 per dag. TK stijgt met € 50, van € 150 naar € 200 per dag,
maar verdubbelt niet: het constante deel blijft gelijk.

GCK halveert van € 5 naar € 2,50 per montage doordat dezelfde € 100 over
twee keer zoveel montages wordt verdeeld. GVK blijft € 2,50 per montage
door het gelijkblijvende variabele tarief. GTK daalt van € 7,50 naar € 5
per montage, niet naar € 3,75: alleen GCK halveert, terwijl GVK gelijk blijft.
Dit geldt voor dezelfde dag, Q = 20–40 en dezelfde capaciteit en afspraken.

**Nakijken:** zes passende verhoudingen met eenheden, drie totale veranderingen
en drie verklaarde gemiddelde veranderingen. Een verkeerd gemiddelde?
Kies de bijbehorende totale kosten en deel door dezelfde Q; zie §2.1.1.

<div class="page-break"></div>

### 1c — opbrengsten, winst en break-even

Voor normale productie, 0 ≤ Q ≤ 40:
TO = P × Q = **6Q euro per dag**. Bij Q = 40:
GO = TO/Q = 240/40 = **€ 6 per montage**.
Iedere betaalde montage levert dezelfde prijs op; daarom is GO = 6Q/Q = 6
voor Q > 0. Bij Q = 0 bestaat TO = 0 wel, maar GO = 0/0 niet.

Winst = TO − TK bij dezelfde Q:

- Q = 20: 120 − 150 = **−€ 30 per dag**, dus € 30 verlies.
- Q = 40: 240 − 200 = **€ 40 per dag**.

Break-even: 6Q = 100 + 2,50Q → 3,50Q = 100 →
Q = 100/3,50 = **200/7 ≈ 28,57 montages per dag**.
Beide totale bedragen zijn daar 6 × 200/7 = **1200/7 ≈ € 171,43 per dag**.

| Geheel aantal montages | TO (€/dag) | TK (€/dag) | Winst (€/dag) |
|---|---|---|---|
| 28 | 6 × 28 = 168 | 100 + 2,50 × 28 = 170 | −2 |
| 29 | 6 × 29 = 174 | 100 + 2,50 × 29 = 172,50 | 1,50 |

Het eerste gehele aantal zonder verlies is **29**: 28 geeft nog verlies.
Je zoekt het kleinste gehele aantal op of rechts van het ongeronde snijpunt.
Naar beneden afronden geeft 28. Gewoon afronden naar het dichtstbijzijnde
gehele getal geeft hier óók 29, maar is niet de algemene regel voor geen verlies.

*Waarom:* pas vanaf de kruising dekken de ontvangsten de totale kosten. Dit
berekent geen beste productieaantal. **Nakijken:** functie, GO en Q > 0,
beide winstbedragen, gelijkheid, continue uitkomst en beide gehele controles.
Twijfel bij gehele aantallen? Vul beide buren in zoals bij de kajak in §2.1.2.

<div class="page-break"></div>

### 1d — het gegeven beeld verbinden met bedragen

![Lichtservice, antwoord: break-even bij (200/7; 1200/7), ongeveer (28,57; 171,43). Binnen 0–40 ligt links verlies en rechts winst, met nul winst op het snijpunt. Bij Q = 40 verbindt het verticale haakje TK = 200 en TO = 240: 40 euro winst per dag. Het open begin van de onderste bereikmarkering sluit de nulwinstgrens uit.](_assets/2.1.4_ex_2.svg){alt="Lichtservice: break-even, verlies en winst binnen 0–40; verticale winstafstand 40 euro bij 40 montages."}

L2 en L3 geven bij Q = 40 dezelfde hoogten: TK = **€ 200**, TO = **€ 240**
per dag. Markeer (200/7; 1200/7). Binnen 0–40: verlies bij Q < 200/7,
nul winst bij Q = 200/7, winst bij 200/7 < Q ≤ 40.

*Waarom:* het verschil 240 − 200 = **€ 40 per dag** hoort bij één Q,
dus een verticale afstand. Een oppervlakte voegt een breedte langs Q toe;
dat is niet de winst bij 40 montages. **Nakijken:** hoogten, assen/eenheden,
snijpunt, begrensde zones en het verticale haakje zonder winstvlak.

<div class="page-break"></div>

### 1e — de vier echte tabelintervallen

Gebruik MK = ΔTK/ΔQ en MO = ΔTO/ΔQ, steeds dezelfde eindpunten.

| Interval; rechter Q | MK (€/extra montage) | MO (€/extra montage) |
|---|---|---|
| 0–20; Q = 20 | (150 − 100)/(20 − 0) = 50/20 = 2,50 | (120 − 0)/20 = 6 |
| 20–40; Q = 40 | (200 − 150)/(40 − 20) = 50/20 = 2,50 | (240 − 120)/20 = 6 |
| 40–45; Q = 45 | (220 − 200)/(45 − 40) = 20/5 = 4 | (270 − 240)/5 = 6 |
| 45–55; Q = 55 | (275 − 220)/(55 − 45) = 55/10 = 5,50 | (330 − 270)/10 = 6 |

Elk bedrag geldt per extra montage **binnen het genoemde interval**.
De aantallen extra montages zijn 20, 20, 5 en 10, niet telkens hetzelfde.
Bij Q = 0 staat een streepje: geen voorafgaand tabelinterval, niet MK = MO = 0.

MK is in de twee normale intervallen constant € 2,50; daarna stijgt MK naar
€ 4 en € 5,50. MO blijft € 6 doordat iedere extra betaalde montage dezelfde
prijs oplevert. MK = € 5,50 bij Q = 55 betekent € 55 extra totale kosten
verdeeld over tien extra montages in 45–55. Je kent **TK bij Q = 54 niet**,
dus niet de extra kosten van alleen montage 55. Rechte verbindingen in L3
maken die ontbrekende afzonderlijke waarneming niet alsnog bekend.

**Nakijken:** alle tellers en positieve noemers, juiste rechter rijen, eenheden,
patronen en begrensde interpretatie. Alleen ΔTK berekend? Deel door de echte
ΔQ; het fotohoudervoorbeeld en Lus/Bout uit §2.1.3 laten dat onderscheid zien.

<div class="page-break"></div>

### 1f — hoogste winst is niet snelste winstgroei

De uitspraak is onjuist. De totale winst is TO − TK bij één hoeveelheid:

| Q (montages per dag) | Winst (€/dag) |
|---|---|
| 0 | 0 − 100 = −100 |
| 20 | 120 − 150 = −30 |
| 40 | 240 − 200 = 40 |
| 45 | 270 − 220 = 50 |
| 55 | 330 − 275 = 55 |

Het hoogste **gegeven totale niveau** is € 55 bij Q = 55. Vergelijk voor de
groei per extra montage echter alle intervallen:

| Interval | Δwinst/ΔQ (€/extra montage) | Controle: MO − MK |
|---|---|---|
| 0–20 | (−30 − (−100))/20 = 3,50 | 6 − 2,50 = 3,50 |
| 20–40 | (40 − (−30))/20 = 3,50 | 6 − 2,50 = 3,50 |
| 40–45 | (50 − 40)/5 = 2 | 6 − 4 = 2 |
| 45–55 | (55 − 50)/10 = 0,50 | 6 − 5,50 = 0,50 |

*Waarom:* de normale winsttoename per extra montage is het grootst. De
**positieve** verticale afstand groeit het snelst voor **200/7 < Q ≤ 40**;
op het snijpunt zelf is die afstand nul. Bij Q = 55 is het getoonde totale
winstniveau hoger, maar de laatste intervalgroei kleiner. L3 toont hoogten;
voor hun verandering vergelijk je dezelfde twee hoeveelheden.

**Nakijken:** onderbouwde weerlegging, vier genormaliseerde vergelijkingen,
niveau tegenover verandering en begrensde grafiekkoppeling. Vergelijk geen
ongeschaalde verschillen bij ongelijke ΔQ. Dit geeft geen optimale afzet en
geen voorspelling buiten de gegeven bronnen.

<div class="page-break"></div>

## Doeloefening — Opgave 2: SmoothBox

{{TARGET_ANSWERS}}

<div class="page-break"></div>

## Denkertje / Bonusopgave

**Modelantwoord**

Bij dezelfde Q = 40 zijn de oorspronkelijke TO = 6 × 40 = € 240 en
TK = 100 + 2,50 × 40 = € 200 per dag: **€ 40 winst**.
Alleen de extra vaste € 20 geeft TK = € 220, TO = € 240 en **€ 20 winst**.
Alleen de prijsverhoging geeft TO = 6,50 × 40 = € 260, TK = € 200 en
**€ 60 winst**. Samen: TO = € 260, TK = € 220, dus **€ 40 winst per dag**.
De effecten heffen elkaar bij deze Q op; de totale winst is niet hoger.

Kies bijvoorbeeld interval 20–40. Oorspronkelijk:
MK = (200 − 150)/(40 − 20) = **€ 2,50** en
MO = (240 − 120)/(40 − 20) = **€ 6**, per extra montage.
Met beide veranderingen zijn TK bij 20 en 40 respectievelijk € 170 en € 220;
TO is € 130 en € 260. Dus MK = (220 − 170)/20 = **€ 2,50** en
MO = (260 − 130)/20 = **€ 6,50**, per extra montage binnen 20–40.
De extra vaste € 20 valt weg bij aftrekken: (200 + 20) − (150 + 20) = 50.
Alleen MO stijgt, niet MK. Ook een juiste vergelijking over 40–45 of 45–55
mag: MK blijft daar respectievelijk 4 of 5,50, en MO wordt 6,50.

Het nieuwe vaste dagbedrag blijft **binnen dat contract** gelijk als Q
verandert. Een andere contractafspraak is iets anders dan veranderende Q
binnen één contract; de kosten worden daardoor niet variabel. De conclusie
houdt Q = 40 vast, neemt geen klantenreactie aan en adviseert geen afzet.

**Beoordelingscriteria — precies drie inhoudelijke criteria:**

- Je onderbouwt het afzonderlijke én gezamenlijke winsteffect bij Q = 40
  met de vier winstbedragen 40, 20, 60 en 40 euro per dag.
- Je vergelijkt MK en MO over hetzelfde werkelijk gegeven interval met
  teller, noemer en eenheid, en verklaart waarom de vaste toeslag in ΔTK wegvalt.
- Je onderscheidt veranderende contracten van veranderende Q binnen één
  contract en begrenst je conclusie tot de gegeven afspraken en hoeveelheid.

## Herhaling / Herhaling en interleaving

Bij Q = 45: GTK = TK/Q = 220/45 = **44/9 ≈ € 4,89 per montage**.
Over 40–45: MK = (220 − 200)/(45 − 40) = 20/5 =
**€ 4 per extra montage binnen 40–45**.

*Waarom:* GTK verdeelt het totale dagbedrag over alle 45 montages. MK verdeelt
alleen de extra € 20 over de vijf extra montages. Het kostenverschil door 45
delen is geen van beide gevraagde berekeningen. Beide uitkomsten zijn bedragen
per montage, maar hun economische betekenis en gebruikte hoeveelheid verschillen.
Lukt dit niet? Herhaal de gemiddelden uit §2.1.1 en het intervalvoorbeeld uit §2.1.3.

