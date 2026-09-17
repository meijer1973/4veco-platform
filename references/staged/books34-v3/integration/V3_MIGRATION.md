# Afgebakende repositorymigratie v2 → v3

## Doel en grens

Dit document is onderdeel van de opdracht in `HANDOFF.md`, niet een later toe te voegen instructie. De inhoudelijke v3-editie is aangeleverd en R1/R2/R4/R5 zijn in het pakket hersteld. De lokale coding agent maakt de nog noodzakelijke **repository-integratie**, met behoud van de huidige controles en v2-historie. Geen brede boekherziening, geen nieuwe autoriteitslaag en geen automatische doelgoedkeuring.

Structuur: `book34-lesson-balance-v3-20260915`. Technische levering: `book34-v3-r1-r5-20260916`. De reparatie verandert de curriculumrevisie niet. Boek 3 blijft 6+4+4; Boek 4 wordt 5+7+5; jaar 1 blijft 12/12/14/17 = 55.

## Geverifieerde uitgangssituatie en actualiteit

Bij de pakketcontrole was platform-main `67374a9808d226f1be7e8fa73eb104312c075267`. De review benoemt lessons-main `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`. Deze horen bij de bestaande v2-import, niet bij een al geïntegreerde v3. Fetch voor de uitvoering opnieuw beide repositories en leg de werkelijke basiscommits vast. Niet-gepushte Windows-werkbomen zijn hier niet onderzocht.

De repositorykaarten waren leesbaar via de GitHub-koppeling. Hun resterende “prepared/in PR”-tekst is geen bewijs dat de eerdere v2-import nog gemerged moet worden. Gebruik commits en echte bestanden; herhaal geen reeds afgeronde v2-import. Rechtstreekse raw-download naar deze bouwcontainer was niet beschikbaar; er is geen ontbrekende repositorykaart verondersteld.

## Waarom alleen bestanden kopiëren niet volstaat

| Bestaand onderdeel in platform | Concreet integratiewerk |
|---|---|
| `build-scripts/references/migrate-books34-selected-outlines.js` | Bevat vaste v2-hashes/revisie en de oude hoofdstukverdeling. Bewaar deze migratie en haar bronidentiteiten als historische v2-route. Maak een afgebakende v3-migratie, niet een herschreven geschiedenis. |
| `build-scripts/references/books34-selected-structure.js` | De bestaande route verlangt v2 en lege `placeholder_needs_review`-records. Maak de **actuele** lookup/migratie revisiebewust en controleer de gekozen v3-outline, 31 IDs/titels, soorten en 6+4+4 / 5+7+5. V3 moet gevulde `candidate_review_ready`-records aanvaarden zonder dat als onafhankelijke goedkeuring te presenteren. |
| `scripts/check-course-target-exercises-v5.js` | Behoud de huidige canonieke `source_ref`-eis, de 55-telling, soortcontrole, ankers en beoordelingsgrenzen. Alle pakketrecords hebben nu `references/owned/course-blueprint-v5.md §X.Y.Z`. Zorg dat de v3-projectie die paragrafen ook daadwerkelijk bevat. Het pakket maakt dit geen vrije manuscriptverwijzing. |
| `build-scripts/maintenance/check-books34-chat-import.js` | Deze controle is bewijs voor de **oorspronkelijke v2-import**, met vaste identiteiten en een gesloten bestandslijst. Behoud die historische bewijsfunctie. Voeg een even afgebakende v3-controle/route toe voor de gerepareerde levering en huidige projecties. Geen blanket-exceptie voor `edities/`, `archive/` of onbekende paden. |

Maak bij voorkeur één kleine v3-migratie plus gerichte tests binnen de bestaande hulpmiddelen. Een bestaand actueel dispatchpunt mag naar de juiste revisieroute verwijzen. Onbekende revisies, gemengde actieve revisies en ontbrekende bron-/assetlocaties moeten fouten blijven. De oude v2-route blijft op haar historische invoer controleerbaar; zij hoeft niet te doen alsof v3 haar oorspronkelijke vastgelegde uitvoer is.

## Plaatsing en bronverwijzingen

Bewaar `edities/chat-2026/` en de bijbehorende historische v2-bestanden/manifesten ongewijzigd. Importeer de uitgepakte v3-levering in een herkenbare nieuwe locatie. Eén gedeelde, relatief gekoppelde pakketmap, bijvoorbeeld `edities/books34-v3/` in lessons, voorkomt dubbel opgeslagen builds en gebroken paden. De bestaande boek-README's linken dan naar de juiste `books/book-3` en `books/book-4`-uitvoer daarbinnen. Een andere locatie volgens bestaande teamconventie mag, mits expliciet vastgelegd.

Plaats niet alleen een ZIP in Git. De Markdown, SVG, records en PDFs moeten direct vindbaar blijven. Indien de platform-eigendom van de bouwscripts fysieke verplaatsing vereist, wijzig alleen de root/configuratie en technische locators; behoud de ontvangen bron-/payloadidentiteiten daarnaast. Verifieer de aangepaste build. Neem geen lokale machinepaden op als actuele bronverwijzing.

Voor het register zijn twee soorten verwijzingen gescheiden:

- `source_ref` en `source_identity.outline`: canonieke curriculumbronnen in platform;
- `source_pin.student_file`, `answer_file` en `figures[].path`: exacte pakketrelatieve bestanden en hashes;
- `source_locator`: de door het hulpmiddel vastgelegde lessons-repository, definitieve pakketroot en concrete manuscript-/antwoord-/excerpt-/recordpaden.

De afnemer resolveert de pakketpaden tegen `source_locator.package_root`. Herbenoem niet alle figuren om oude nummers in een historische bestandsnaam kwijt te raken. De opschriften zijn hersteld; de relatieve verwijzingen blijven geldig.

## Register voorbereiden zonder Boeken 1–2 te veranderen

Vanaf de uitgepakte pakketroot, met de **werkelijk gekozen** repositoryrelatieve bestemming:

```text
python build/prepare_registry_update.py CURRENT_REGISTRY.json NEW_CANDIDATE.json --lesson-package-root edities/books34-v3
```

Gebruik een nieuwe uitvoerlocatie buiten het bronregister; het hulpmiddel weigert overschrijven. Het controleert 55 unieke bestaande records, de 24 Boeken 1–2-records en de 31 correcte v3-kandidaten; bewaart de 24 records inhoudelijk ongewijzigd; synchroniseert actieve register- en recordrevisies; houdt canonieke verwijzingen intact; en voegt concrete technische locators toe. Het promoveert geen kandidaten. De bestaande oudere archiefverwijzing blijft historisch behouden; de lokale migratie archiveert daarnaast het werkelijk ontvangen v2-register met commit en hash.

De uitvoer is nog steeds een **registerkandidaat**, niet een complete repositorypatch. De daadwerkelijke v3-lookup, metadata en bronbestanden moeten ermee overeenstemmen. Test het hulpmiddel op het actuele register; de meegeleverde unit tests gebruiken expliciet een schemafixture, niet een niet-gecontroleerde kopie van live main.

Werk samen bij:

1. Actuele outlinebestanden en metadata, met hashes van de aangenomen v3-bronnen en de juiste paragraaftitels/hoofdstukgrenzen. Bewaar de vorige v2-bronnen en adoptiegegevens als historie.
2. De 31 Book 3–4-records en actieve registermetadata. Vergelijk alle 24 Boeken 1–2-records voor/na; geen nieuwe vaardigheden, examencodes of goedkeuringen verzinnen.
3. De relevante Books 3–4-secties in v5, de lesprojectie en de betreffende v6-verwijzingen. `curriculum/blueprint-books34-v3.md` bevat de nieuwe inhoud en `§X.Y.Z -`-ankers. Bewaar de overige boek-/jaartotalen en historische 148/152 versus actuele 149/153-toelichting.
4. Toetsgrenzen: langetermijnevenwicht wordt voor het eerst in Boek 4 beoordeeld. Oud 4.3.5 cao/vakbonden is uitgesteld; nieuw 4.3.5 is consolidatie. De versiegekwalificeerde CSV is leidend voor die botsingen.
5. Actuele navigatie, structurele lookup, importcontrole en roadmap. Meld schrijven/samenstellen/herstel gereed en integratie in PR zolang er niet is gemerged. Houd onafhankelijke doelreview, de vijf tijdskwesties en de latere cao-plaatsing afzonderlijk open.

## Controleer ook de echte afnemer van doelopgaven

Het pakket levert volledige tekstcontext én `context_html` met tabel-/figuurstructuur. `sources[0].content` blijft het onverkorte bronfragment voor herkomstcontrole; gebruik dat niet als stille uitwijkroute om verlies uit de normale context-export te maskeren.

`python build/preview_targets.py` toont alle 31 doelopgaven uitsluitend vanuit de JSON. Geen manuscript wordt als fallback gelezen. Er worden 26 bronfiguurverwijzingen echt geconsumeerd; ontbrekende, niet-geregistreerde of gewijzigde assets geven een fout.

Traceer bij integratie de bestaande repository-afnemer. Test ten minste de formule/capaciteit/eenheden van **3.2.2**, de bevolkingscijfers/functies/grafiek van **4.3.2**, een doel met een tabel en een doel met een aparte bronpagina. Test zijn normale weergave/export, niet alleen dat het ruwe JSON-bestand velden bevat. Een toekomstige nog niet gebouwde companion is geen onderdeel van deze opdracht; markeer niettemin expliciet dat een nieuwe afnemer dit broncontract moet gebruiken.

## Gerichte acceptatiechecks

De v3-route moet fout gaan bij een oud/nieuw ID zonder revisie, verkeerde 4.1/4.3-telling, lege context, verdwenen bron/figuur, een niet-kloppende bronhash, gewijzigd Boek 1/2-record, een vals `reviewed_final` of ontbrekende v5-anker/verwijzing. Bewijs dat de historische v2-route niet als nieuwe v3-goedkeuring wordt hergebruikt.

Voer de relevante bestaande repositorytests en vereiste CI uit tegen de exacte voorgestelde platform/lessons-combinatie. Een platformrun tegen alleen lesson main is geen test van de ungemergde leskandidaat. Gebruik waar nodig de bestaande gekoppelde compatibiliteitsroute; de ondersteunde volgorde volgt uit het nieuwe bewijs, niet uit een oude PR-volgorde.

Deze opdracht verleent geen merge-, deploy- of publicatiebevoegdheid. Lever de PR(s), exacte heads, controles en de resterende inhoudelijke besluiten ter review op.
