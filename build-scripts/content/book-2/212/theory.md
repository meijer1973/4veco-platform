# 2.1.2 Opbrengsten, winst en break-even

## Een volle kas: is dat ook winst?

Voor een kleine theatervoorstelling betaal je € 5 per bezoeker. Bij 30 bezoekers
komt er € 150 binnen. Toch houdt de organisator niet al dat geld over: de zaal
en de voorstelling kosten ook geld. **Hoeveel bezoekers zijn nodig om geen
verlies te maken?** En hoe zie je dat in een grafiek?

In §2.1.1 leerde je totale en gemiddelde kosten berekenen. Nu vergelijk je de
kosten met wat een bedrijf ontvangt. Je leert:

{{GOALS}}

> **Haal de benodigde bewerkingen terug.**
>
> Vul dezelfde Q in de kostenfunctie in. Bijvoorbeeld: bij TK = 12 + 3Q en
> Q = 2 is TK = 18. Het totaal is € 18 per middag; 18 / 2 = € 9 per product.
> Deel alleen door een positieve Q.
>
> In §1.3.2 loste je een lineaire vergelijking op door aan beide kanten
> dezelfde bewerking te doen: 3Q = 12 + Q geeft 2Q = 12, dus Q = 6.
> Controle: links 18, rechts 12 + 6 = 18.
>
> In §1.1.3 zette je tabelwaarden om in punten. Kies per as een vaste
> stapgrootte. Bij TK = 12 + 3Q horen (0; 12) en (2; 18). Zet eerst Q
> horizontaal en lees daarna de hoogte af. Twee punten bepalen een rechte lijn.

## Van prijs naar totale opbrengst

Voor de voorstelling geldt **één avond**, 0 tot en met 30 betalende bezoekers.
Q is het aantal bezoekers per avond. Iedereen betaalt dezelfde prijs P = € 5
per bezoeker; elke toegelaten bezoeker betaalt. Binnen dit model blijven de
zaal, de prijs en de kosten per bezoeker gelijk. De kosten zijn TK = 60 + 2Q
in euro per avond. De formules tekenen we als continue lijnen; werkelijk komen
er alleen gehele aantallen bezoekers.

> **Definitie: totale opbrengst (TO).**
> De totale opbrengst, of omzet, is het totale bedrag dat een bedrijf met zijn
> verkopen ontvangt in de gekozen periode. Bij een vaste prijs per verkochte
> eenheid geldt TO = P × Q.

Bij 10 bezoekers is TO = 5 × 10 = € 50 per avond. Voor iedere Q in het model
geldt dus **TO = 5Q**. Bij nul bezoekers is TO nul. Dat is nog geen uitspraak
over de kosten of de winst.

| Q (bezoekers per avond) | TO (€ per avond) |
|---|---|
| 0 | 0 |
| 10 | 50 |
| 20 | 100 |
| 30 | 150 |

![Eerst alleen TO: de lijn gaat door (0; 0) en (30; 150). De verticale as toont een totaalbedrag per avond, geen prijs per bezoeker.](_assets/2.1.2_fig_1.svg)

## Opbrengst per bezoeker

> **Definitie: gemiddelde opbrengst (GO).**
> De gemiddelde opbrengst is de totale opbrengst gedeeld door het aantal
> verkochte eenheden: GO = TO / Q, voor Q > 0. De eenheid is euro per product
> of dienst, hier euro per bezoeker.

| Positieve Q | Berekening GO | Opbrengst per bezoeker |
|---|---|---|
| 10 bezoekers | 50 / 10 | € 5 |
| 20 bezoekers | 100 / 20 | € 5 |

De twee uitkomsten zijn gelijk omdat **iedere bezoeker dezelfde prijs betaalt**.
Algebraïsch: GO = (P × Q) / Q = P, zolang Q > 0. Hier is GO dus steeds
€ 5 per bezoeker. Bij Q = 0 kun je TO / Q niet uitrekenen: delen door nul
kan niet. Teken GO niet op de TO-as: euro per bezoeker en euro per avond zijn
verschillende grootheden.

## Wat blijft er over?

> **Definitie: winst.**
> De winst is het verschil tussen totale opbrengst en totale kosten in
> dezelfde periode: winst = TO − TK. Een negatieve winst betekent verlies.

Bij 10 bezoekers ontvang je € 50. De kosten zijn 60 + 2 × 10 = € 80.
De winst is 50 − 80 = −€ 30 per avond: een verlies van € 30.
Vergelijk steeds dezelfde Q en dezelfde periode.

| Q | TO (€ per avond) | TK (€ per avond) | Winst (€ per avond) |
|---|---|---|---|
| 0 | 0 | 60 | −60 |
| 10 | 50 | 80 | −30 |
| 20 | 100 | 100 | 0 |
| 30 | 150 | 120 | 30 |

![Voeg TK toe op precies dezelfde assen. De gestreepte kostenlijn begint bij 60. Bij Q = 10 ligt TO onder TK: de opbrengst is kleiner dan de kosten.](_assets/2.1.2_fig_2.svg)

> **Let op: ontvangen is niet overhouden.**
> “Er komt € 150 binnen, dus de winst is € 150” klinkt logisch als je alleen
> naar de kassa kijkt. Maar € 150 is TO. Bij 30 bezoekers zijn de kosten
> € 120, dus de winst is € 30. GO is evenmin winst: GO vertelt wat je gemiddeld
> ontvangt, voordat je kosten aftrekt.

## Break-even: opbrengst en kosten gelijk

> **Definitie: break-even-afzet.**
> De break-even-afzet is de hoeveelheid waarbij TO = TK. De winst is dan
> precies nul: er is geen winst en geen verlies.

Bereken eerst de hoeveelheid met de formules:

::: {style="break-inside: avoid"}

TO = TK

5Q = 60 + 2Q

Trek aan beide kanten 2Q af: 3Q = 60.

Deel beide kanten door 3: **Q = 20 bezoekers**.

Controle: TO = 5 × 20 = 100 en TK = 60 + 2 × 20 = 100 euro per avond.

:::

In de grafiek is dezelfde gelijkheid het snijpunt: bij Q = 20 hebben beide
lijnen hoogte 100. Links van dat punt ligt TO onder TK; rechts erboven.
Die uitspraken gelden binnen dit model, met de genoemde vaste prijs en kosten.

![Markeer nu het break-evenpunt (20; 100). Links ervan verlies, op het punt nul winst en rechts ervan winst; de schalen zijn niet veranderd.](_assets/2.1.2_fig_3.svg)

De algebra geeft het precieze punt; de grafiek maakt de drie situaties
zichtbaar. Het zijn twee manieren om **dezelfde vergelijking** te lezen.

## Winst als verticale afstand

Kies één Q, bijvoorbeeld 30. Lees op diezelfde verticale lijn TO = 150 en
TK = 120 af. Het hoogteverschil is 150 − 120 = **€ 30 per avond**.
Het haakje in de figuur verbindt de twee hoogten bij dezelfde Q.

![Voeg bij Q = 30 het verticale verschil van € 30 toe. Winst is hier een afstand in euro per avond, niet een ingekleurde oppervlakte.](_assets/2.1.2_fig_4.svg)

> **Let op: afstand, geen oppervlakte.**
> Een ruimte tussen twee lijnen valt op, maar de verticale as geeft al euro
> per avond aan. Voor winst bij één Q trek je twee hoogten af. Een vlak met
> een breedte langs de Q-as is een ander soort maat; kleur dat hier niet als winst.

Bij een andere Q kan de verticale afstand anders zijn. “Verder naar rechts
betekent altijd meer winst” is geen algemene wet: we gebruiken hier uitsluitend
de gegeven rechte kosten- en opbrengstlijnen met een vaste prijs.

## Een deel van een product verkopen?

Het continue model kan een breuk als break-even-afzet opleveren. Bij gehele
producten zoek je daarna het **eerste gehele aantal waarbij geen verlies**
ontstaat. In de modellen van deze paragraaf stijgt de winst met Q en ligt het
snijpunt binnen het gegeven bereik. Kies dan het kleinste gehele aantal op of
rechts van het continue snijpunt en controleer door invullen.

| Continue uitkomst | Eerste gehele aantal zonder verlies |
|---|---|
| Q = 20 precies | 20: nul winst telt ook als geen verlies |
| Q = 3⅓ | 4, mits invullen bevestigt dat 3 nog verlies geeft |

> **Let op: niet gewoon afronden naar het dichtstbijzijnde getal.**
> Je bent gewend 3⅓ af te ronden naar 3. Maar de vraag is nu wanneer het
> verlies ophoudt. Het uitgewerkte voorbeeld laat zien waarom 3 niet voldoet
> en 4 wel. Is de continue uitkomst al geheel, dan tel je er niet alsnog 1 bij op.
