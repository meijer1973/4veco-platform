/**
 * inoefening-352-naar-het-examen.js
 * ══════════════════════════════════════════════════════════════════════
 * Generates begeleide inoefening documents for 3.5.2 Naar het examen.
 * CE-style exam exercises with scaffolding.
 *
 * Run: NODE_PATH="$(npm root -g)" node inoefening-352-naar-het-examen.js
 *
 * HOW TO ADAPT:
 * This is an exam-prep paragraph — exercises simulate CE exam style.
 * To reuse, update the oefeningen array and output paths below.
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const {
  buildBegeleideInoefening,
} = require("./lib-begeleide-inoefening.js");

// ── CONFIG ──
const PARAGRAAF_NR = "3.5.2";
const ONDERWERP = "Naar het examen";
const HEADER_TEXT = "Paragraaf 3.5.2 Naar het examen";
const OUTPUT_DIR = path.resolve(__dirname,
  "../../3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting/3.5.2 Paragraaf 2 - Naar het examen/3. Oefenen/begeleide inoefening"
);

// ══════════════════════════════════════════════════════════════════════
// OEFENINGEN — CE-style exam exercises
// ══════════════════════════════════════════════════════════════════════

const oefeningen = [
  // ── Oefening 1: CE-style marktanalyse ──
  {
    nr: 1,
    title: "CE-opgave: Marktanalyse smartphones",
    domain: "markt",
    introText:
      "Gebruik de volgende informatie.\n\nDe markt voor smartphones in Europa wordt gedomineerd door drie grote spelers: Apple (28%), Samsung (31%) en Xiaomi (17%). De overige aanbieders hebben gezamenlijk 24% marktaandeel. Elk merk onderscheidt zich door eigen besturingssysteem, design en ecosysteem. De R&D-kosten voor een nieuw smartphone-merk bedragen meer dan €1 miljard.",
    deelvragen: [
      {
        label: "Vraag 1a (2 punten)",
        vraagText: "Beredeneer dat de Europese smartphonemarkt kenmerken heeft van een heterogeen oligopolie.",
        thinkingSteps: [
          "Noem het kenmerk → geef het bewijs uit de tekst.",
          "Doe dit voor minstens drie kenmerken.",
          "Gebruik de termen: weinig aanbieders, heterogeen product, hoge toetredingsbarrières.",
        ],
        hint: "Bij een 'beredeneer'-vraag op het CE moet je elk kenmerk koppelen aan een feit uit de bron. Alleen benoemen is niet genoeg.",
        answerLines: 6,
        antwoord: [
          [{ text: "Weinig aanbieders: ", bold: true }, { text: "drie bedrijven (Apple, Samsung, Xiaomi) hebben samen 76% marktaandeel." }],
          [{ text: "Heterogeen product: ", bold: true }, { text: "elk merk heeft een eigen besturingssysteem, design en ecosysteem." }],
          [{ text: "Hoge toetredingsbarrières: ", bold: true }, { text: "R&D-kosten van meer dan €1 miljard maken toetreding zeer moeilijk." }],
          "Conclusie: weinig aanbieders + heterogeen product + hoge barrières = heterogeen oligopolie.",
        ],
        explanation: "Op het CE krijg je punten per correct benoemd kenmerk mét bronverwijzing. Drie kenmerken met bewijs = maximale score. Let op dat je niet monopolistische concurrentie zegt — daar zijn veel aanbieders.",
      },
      {
        label: "Vraag 1b (3 punten)",
        vraagText: "De HHI (Herfindahl-Hirschman Index) wordt gebruikt om de marktconcentratie te meten. Bereken de HHI voor de drie grootste aanbieders, exclusief de overige aanbieders. Verklaar wat de uitkomst zegt over de mate van concurrentie.",
        thinkingSteps: [
          "HHI = som van de gekwadrateerde marktaandelen (in percentages).",
          "Bereken voor Apple, Samsung en Xiaomi.",
          "Beoordeel: HHI > 2500 = hoge concentratie.",
        ],
        formulaReminder: [
          "HHI = s₁² + s₂² + s₃² + ...",
          "waarbij s = marktaandeel in %",
        ],
        invulformaat: [
          "HHI = 28² + 31² + 17²",
          "HHI = ........ + ........ + ........",
          "HHI = ........",
        ],
        antwoord: [
          "HHI = 28² + 31² + 17²",
          "HHI = 784 + 961 + 289",
          [{ text: "HHI = 2.034", bold: true }],
          "Een HHI tussen 1.500 en 2.500 duidt op een matig geconcentreerde markt. Hoewel drie bedrijven domineren, is de concurrentie niet minimaal — er is nog een restgroep van 24%.",
        ],
        explanation: "Let op: als je de overige aanbieders (24%) als één groep meetelt, wordt de HHI hoger (2.034 + 576 = 2.610). De vraag specificeert 'exclusief de overige' — lees altijd nauwkeurig.",
      },
    ],
  },

  // ── Oefening 2: CE-style overheidsbeleid ──
  {
    nr: 2,
    title: "CE-opgave: Overheidsbeleid en accijns",
    domain: "markt",
    introText:
      "Gebruik de volgende informatie.\n\nDe overheid overweegt een suikertaks van €0,30 per liter op frisdrank. De huidige marktsituatie is:",
    formules: [
      "Vraagfunctie:  Qv = 500 − 200p   (Q in miljoenen liters, p in euro's)",
      "Aanbodfunctie: Qa = −100 + 400p",
    ],
    deelvragen: [
      {
        label: "Vraag 2a (2 punten)",
        vraagText: "Bereken het huidige marktevenwicht (prijs en hoeveelheid).",
        thinkingSteps: [
          "Stel Qv = Qa.",
          "Los op naar p.",
          "Vul terug voor Q.",
        ],
        invulformaat: [
          "500 − 200p = −100 + 400p",
          "p* = ........",
          "Q* = ........",
        ],
        antwoord: [
          "500 − 200p = −100 + 400p",
          "600 = 600p",
          [{ text: "p* = €1,00", bold: true }],
          "Q = 500 − 200 × 1 = 300",
          [{ text: "Q* = 300 miljoen liter", bold: true }],
        ],
        explanation: "Standaard evenwichtsberekening. Controleer altijd door Q ook in de aanbodfunctie in te vullen: Qa = −100 + 400 × 1 = 300 ✓",
      },
      {
        label: "Vraag 2b (3 punten)",
        vraagText: "Bereken het nieuwe evenwicht na invoering van de suikertaks. Bereken ook hoeveel van de belasting de consument draagt en hoeveel de producent.",
        thinkingSteps: [
          "Pas de aanbodfunctie aan: vervang p door (p − 0,30).",
          "Bereken het nieuwe evenwicht.",
          "Belastingdeel consument = p_nieuw − p_oud.",
          "Belastingdeel producent = belasting − deel consument.",
        ],
        formulaReminder: [
          "Nieuwe aanbod: Qa = −100 + 400(p − t)",
          "Deel consument = p_nieuw − p_oud",
          "Deel producent = t − deel consument",
        ],
        invulformaat: [
          "Qa_nieuw = −100 + 400(p − 0,30) = ........",
          "Nieuw evenwicht: p = ........    Q = ........",
          "Deel consument: ........    Deel producent: ........",
        ],
        antwoord: [
          "Qa_nieuw = −100 + 400(p − 0,30) = −100 + 400p − 120 = −220 + 400p",
          "500 − 200p = −220 + 400p",
          "720 = 600p",
          [{ text: "p_consument = €1,20", bold: true }],
          "Q_nieuw = 500 − 200 × 1,20 = 260",
          [{ text: "Q_nieuw = 260 miljoen liter", bold: true }],
          [{ text: "p_producent = 1,20 − 0,30 = €0,90", bold: true }],
          "",
          [{ text: "Deel consument: ", bold: true }, { text: "€0,20 (= 1,20 − 1,00) → 67% van de belasting" }],
          [{ text: "Deel producent: ", bold: true }, { text: "€0,10 (= 1,00 − 0,90) → 33% van de belasting" }],
        ],
        explanation: "De verdeling van de belastingdruk hangt af van de prijselasticiteiten. Hier is de vraag minder elastisch dan het aanbod (helling vraag = −200, helling aanbod = 400), waardoor de consument een groter deel draagt.",
      },
      {
        label: "Vraag 2c (2 punten)",
        vraagText: "Bereken het welvaartsverlies door de suikertaks.",
        thinkingSteps: [
          "Welvaartsverlies = de driehoek van niet meer verhandelde eenheden.",
          "Basis = verschil in hoeveelheid, hoogte = belasting.",
        ],
        formulaReminder: [
          "DWL = ½ × t × (Q_oud − Q_nieuw)",
        ],
        invulformaat: "DWL = ½ × ........ × ........ = ........",
        antwoord: [
          "DWL = ½ × 0,30 × (300 − 260)",
          "DWL = ½ × 0,30 × 40",
          [{ text: "DWL = 6 miljoen euro", bold: true }],
        ],
        explanation: "Het welvaartsverlies is €6 miljoen. Dit is de maatschappelijke kosten van de belasting bovenop de herverdeling. Op het CE moet je dit getal kunnen interpreteren: het is de waarde van de transacties die niet meer plaatsvinden.",
      },
    ],
  },

  // ── Oefening 3: CE-style internationale handel ──
  {
    nr: 3,
    title: "CE-opgave: Internationale handel en invoerheffing",
    domain: "markt",
    introText:
      "Gebruik de volgende informatie.\n\nNederland importeert staal uit China. Op de binnenlandse markt gelden de volgende vergelijkingen:",
    formules: [
      "Binnenlandse vraag:  Qv = 1200 − 4p",
      "Binnenlands aanbod:  Qa = −300 + 6p",
      "Wereldmarktprijs:    p_w = €120 per ton",
    ],
    deelvragen: [
      {
        label: "Vraag 3a (2 punten)",
        vraagText: "Bereken de binnenlandse vraag, het binnenlands aanbod en de omvang van de import bij de wereldmarktprijs.",
        thinkingSteps: [
          "Vul p_w = 120 in bij zowel de vraag- als de aanbodfunctie.",
          "Import = vraag − aanbod.",
        ],
        invulformaat: [
          "Qv = 1200 − 4 × 120 = ........",
          "Qa = −300 + 6 × 120 = ........",
          "Import = ........",
        ],
        antwoord: [
          "Qv = 1200 − 4 × 120 = 1200 − 480 = 720",
          "Qa = −300 + 6 × 120 = −300 + 720 = 420",
          [{ text: "Import = 720 − 420 = 300 ton", bold: true }],
        ],
        explanation: "Bij de wereldmarktprijs is de binnenlandse vraag groter dan het binnenlands aanbod. Het verschil wordt geïmporteerd.",
      },
      {
        label: "Vraag 3b (3 punten)",
        vraagText: "De EU legt een invoerheffing van €20 per ton op Chinees staal. Bereken de nieuwe binnenlandse prijs, de nieuwe import en de opbrengst van de heffing voor de overheid.",
        thinkingSteps: [
          "Nieuwe binnenlandse prijs = wereldmarktprijs + heffing.",
          "Vul de nieuwe prijs in bij vraag en aanbod.",
          "Nieuwe import = nieuwe vraag − nieuw aanbod.",
          "Heffingsopbrengst = heffing × nieuwe import.",
        ],
        formulaReminder: [
          "p_nieuw = p_w + heffing",
          "Heffingsopbrengst = heffing × import_nieuw",
        ],
        invulformaat: [
          "p_nieuw = ........",
          "Qv_nieuw = ........    Qa_nieuw = ........",
          "Import_nieuw = ........",
          "Heffingsopbrengst = ........",
        ],
        antwoord: [
          [{ text: "p_nieuw = 120 + 20 = €140", bold: true }],
          "Qv_nieuw = 1200 − 4 × 140 = 1200 − 560 = 640",
          "Qa_nieuw = −300 + 6 × 140 = −300 + 840 = 540",
          [{ text: "Import_nieuw = 640 − 540 = 100 ton", bold: true }],
          [{ text: "Heffingsopbrengst = 20 × 100 = €2.000", bold: true }],
        ],
        explanation: "Door de heffing stijgt de binnenlandse prijs, daalt de import (van 300 naar 100 ton), en groeit het binnenlands aanbod (van 420 naar 540). Binnenlandse producenten profiteren, maar consumenten betalen meer.",
      },
      {
        label: "Vraag 3c (2 punten)",
        vraagText: "Verklaar waarom de invoerheffing leidt tot een welvaartsverlies voor Nederland, ondanks de heffingsopbrengst voor de overheid.",
        thinkingSteps: [
          "Welvaartsverlies bestaat uit twee driehoeken.",
          "Driehoek 1: inefficiënte binnenlandse productie (aanbodzijde).",
          "Driehoek 2: verloren consumptie (vraagzijde).",
          "Denk aan: heffingsopbrengst is geen nettoverlies, maar de driehoeken wel.",
        ],
        warning: "Bij een 'verklaar'-vraag moet je de economische logica uitleggen, niet alleen het rekenen.",
        answerLines: 6,
        antwoord: [
          "De invoerheffing leidt tot welvaartsverlies door twee effecten:",
          [{ text: "1. Productie-inefficiëntie: ", bold: true }, { text: "binnenlandse producenten maken 120 ton extra (540 − 420) tegen hogere kosten dan de wereldmarktprijs. Die extra productie kost meer dan €120 per ton maar levert geen extra welvaart op." }],
          [{ text: "2. Consumptieverlies: ", bold: true }, { text: "80 ton (720 − 640) wordt niet meer geconsumeerd, terwijl consumenten hiervoor meer dan €120 wilden betalen." }],
          "De heffingsopbrengst (€2.000) is slechts een overdracht van consumenten naar overheid — geen nettowelvaart. De twee driehoeken zijn het nettoverlies voor de maatschappij als geheel.",
        ],
        explanation: "Dit is een standaard CE-antwoordmodel. Je moet twee effecten noemen (productie-inefficiëntie en consumptieverlies) en uitleggen waarom de heffingsopbrengst geen welvaartswinst is. Bij 'verklaar' is de redenering belangrijker dan het getal.",
      },
    ],
  },

  // ── Oefening 4: CE-style verklaar-vraag marktfalen ──
  {
    nr: 4,
    title: "CE-opgave: Marktfalen en externe effecten",
    domain: "markt",
    introText:
      "Gebruik de volgende informatie.\n\nEen chemiefabriek loost afvalwater in een rivier. De fabriek produceert onder volkomen concurrentie. De productiekosten zijn €30 per eenheid, maar de vervuiling veroorzaakt €8 per eenheid aan schade bij omwonenden en visserij. De marktprijs is €30.",
    deelvragen: [
      {
        label: "Vraag 4a (2 punten)",
        vraagText: "Leg uit waarom hier sprake is van een negatief extern effect en waarom de markt faalt.",
        thinkingSteps: [
          "Wat is een extern effect? → kosten/baten die niet in de prijs verwerkt zijn.",
          "Wie draagt de schade? Is dit dezelfde partij als de producent?",
          "Waarom leidt dit tot overproductie?",
        ],
        answerLines: 5,
        antwoord: [
          [{ text: "Negatief extern effect: ", bold: true }, { text: "de vervuiling veroorzaakt €8 per eenheid schade bij derden (omwonenden, visserij) die niet in de productiekosten van de fabriek zijn opgenomen." }],
          [{ text: "Marktfalen: ", bold: true }, { text: "de private kosten (€30) zijn lager dan de maatschappelijke kosten (€30 + €8 = €38). De fabriek produceert op basis van private kosten en produceert daardoor meer dan maatschappelijk optimaal is. De markt zelf corrigeert dit niet." }],
        ],
        explanation: "Het sleutelwoord is 'niet in de prijs verwerkt'. Externe effecten leiden tot een verschil tussen private en maatschappelijke kosten, waardoor de marktuitkomst niet efficiënt is.",
      },
      {
        label: "Vraag 4b (3 punten)",
        vraagText: "De overheid overweegt een Pigouviaanse belasting. Hoe hoog moet deze belasting zijn? Verklaar waarom deze belasting de efficiëntie verbetert.",
        thinkingSteps: [
          "Een Pigouviaanse belasting is gelijk aan het externe effect per eenheid.",
          "Wat gebeurt er met de aanbodcurve?",
          "Waarom komt de marktuitkomst dan dichter bij het maatschappelijk optimum?",
        ],
        answerLines: 6,
        antwoord: [
          [{ text: "Hoogte: ", bold: true }, { text: "de Pigouviaanse belasting moet €8 per eenheid zijn, gelijk aan de marginale externe kosten." }],
          [{ text: "Werking: ", bold: true }, { text: "door de belasting stijgen de private kosten van €30 naar €38 per eenheid. Nu zijn de private kosten gelijk aan de maatschappelijke kosten." }],
          [{ text: "Efficiëntie: ", bold: true }, { text: "de fabriek zal haar productie verminderen tot het punt waar de marktprijs gelijk is aan de maatschappelijke kosten. Eenheden waarvan de productie meer kost dan ze opleveren (inclusief milieuschade) worden niet meer geproduceerd." }],
          "De belasting 'internaliseert' het externe effect: de vervuiler betaalt nu de volledige maatschappelijke kosten van zijn productie.",
        ],
        explanation: "Bij een Pigouviaanse belasting gaat het altijd om internalisering van externe effecten. De belasting is exact gelijk aan de marginale schade, zodat private kosten = maatschappelijke kosten. Dit is een standaard CE-onderwerp.",
      },
    ],
  },

  // ── Oefening 5: CE-style surplus en welvaartsverlies ──
  {
    nr: 5,
    title: "CE-opgave: Surplus bij minimumprijs",
    domain: "markt",
    introText:
      "Gebruik de volgende informatie.\n\nDe overheid stelt een minimumprijs in op de markt voor graan om boeren te beschermen.",
    formules: [
      "Vraagfunctie:  Qv = 600 − 10p",
      "Aanbodfunctie: Qa = −200 + 20p",
      "Minimumprijs:  p_min = €32",
    ],
    deelvragen: [
      {
        label: "Vraag 5a (2 punten)",
        vraagText: "Bereken het marktevenwicht zonder overheidsingrijpen. Toon aan dat de minimumprijs boven de evenwichtsprijs ligt.",
        thinkingSteps: [
          "Bereken het evenwicht: Qv = Qa.",
          "Vergelijk p* met p_min.",
        ],
        invulformaat: [
          "600 − 10p = −200 + 20p",
          "p* = ........    Q* = ........",
          "p_min (........) is ........ dan p* (........)",
        ],
        antwoord: [
          "600 − 10p = −200 + 20p",
          "800 = 30p",
          [{ text: "p* = €26⅔ ≈ €26,67", bold: true }],
          "Q* = 600 − 10 × 26⅔ = 600 − 266⅔ = 333⅓",
          [{ text: "Q* ≈ 333 eenheden", bold: true }],
          "De minimumprijs (€32) ligt boven de evenwichtsprijs (€26,67). De minimumprijs is bindend.",
        ],
        explanation: "Een minimumprijs is alleen bindend als deze boven het evenwicht ligt. Anders heeft de maatregel geen effect.",
      },
      {
        label: "Vraag 5b (3 punten)",
        vraagText: "Bereken bij de minimumprijs: de gevraagde hoeveelheid, de aangeboden hoeveelheid en de omvang van het overschot. Bereken het welvaartsverlies.",
        thinkingSteps: [
          "Vul p_min = 32 in bij vraag en aanbod.",
          "Overschot = aanbod − vraag.",
          "Welvaartsverlies: driehoek tussen Q_verhandeld en Q_evenwicht.",
          "Let op: bij een minimumprijs wordt de gevraagde hoeveelheid verhandeld (korte kant van de markt).",
        ],
        formulaReminder: [
          "Bij minimumprijs: Q_verhandeld = Qv (de korte kant)",
          "DWL = ½ × (p_min − p_aanbod bij Qv) × (Q* − Qv)",
        ],
        warning: "De verhandelde hoeveelheid is de gevraagde hoeveelheid, niet de aangeboden hoeveelheid!",
        invulformaat: [
          "Qv bij p=32: ........",
          "Qa bij p=32: ........",
          "Overschot: ........",
          "DWL = ........",
        ],
        antwoord: [
          "Qv = 600 − 10 × 32 = 600 − 320 = 280",
          "Qa = −200 + 20 × 32 = −200 + 640 = 440",
          [{ text: "Overschot = 440 − 280 = 160 eenheden", bold: true }],
          "",
          "Voor het welvaartsverlies: bij Q = 280 is de aanbodprijs:",
          "280 = −200 + 20p → p = 480/20 = €24",
          "DWL = ½ × (32 − 24) × (333⅓ − 280)",
          "DWL = ½ × 8 × 53⅓",
          [{ text: "DWL ≈ €213", bold: true }],
        ],
        explanation: "Het welvaartsverlies ontstaat doordat 53 eenheden (333 − 280) niet meer verhandeld worden, terwijl consumenten er meer voor wilden betalen dan de productiekosten. Het overschot van 160 eenheden is apart — die worden geproduceerd maar niet verkocht.",
      },
    ],
  },

  // ── Oefening 6: CE-style prijselasticiteit en belastingverdeling ──
  {
    nr: 6,
    title: "CE-opgave: Prijselasticiteit en belastingverdeling",
    domain: "markt",
    introText:
      "Gebruik de volgende informatie.\n\nOp de markt voor benzine geldt:",
    formules: [
      "Vraagfunctie:  Qv = 100 − 5p    (Q in miljoenen liters, p in €/liter)",
      "Aanbodfunctie: Qa = −20 + 20p",
      "",
      "De overheid overweegt een accijnsverhoging van €0,50 per liter.",
    ],
    deelvragen: [
      {
        label: "Vraag 6a (2 punten)",
        vraagText: "Bereken de prijselasticiteit van de vraag in het huidige evenwicht.",
        thinkingSteps: [
          "Bereken eerst het evenwicht.",
          "De prijselasticiteit van de vraag = (dQ/dp) × (p/Q).",
          "dQ/dp lees je af uit de vraagfunctie (de coëfficiënt van p).",
        ],
        formulaReminder: [
          "Ev = (ΔQ/Δp) × (p/Q)",
          "Bij lineaire vraagfunctie: ΔQ/Δp = coëfficiënt van p",
        ],
        invulformaat: [
          "Evenwicht: p* = ........    Q* = ........",
          "Ev = ........ × (........ / ........)",
          "Ev = ........",
        ],
        antwoord: [
          "100 − 5p = −20 + 20p → 120 = 25p → p* = €4,80",
          "Q* = 100 − 5 × 4,80 = 100 − 24 = 76",
          "Ev = −5 × (4,80 / 76)",
          [{ text: "Ev = −0,316 (inelastisch)", bold: true }],
        ],
        explanation: "|Ev| < 1, dus de vraag is inelastisch. Dit is typisch voor benzine: consumenten zijn weinig gevoelig voor prijsveranderingen op korte termijn.",
      },
      {
        label: "Vraag 6b (3 punten)",
        vraagText: "Bereken het nieuwe evenwicht na de accijnsverhoging. Welk percentage van de accijns wordt doorberekend aan de consument?",
        thinkingSteps: [
          "Pas de aanbodfunctie aan: Qa = −20 + 20(p − 0,50).",
          "Bereken het nieuwe evenwicht.",
          "Deel consument = (p_nieuw − p_oud) / accijns × 100%.",
        ],
        invulformaat: [
          "Qa_nieuw = −20 + 20(p − 0,50) = ........",
          "p_nieuw = ........",
          "Doorberekend aan consument: ........ %",
        ],
        antwoord: [
          "Qa_nieuw = −20 + 20(p − 0,50) = −20 + 20p − 10 = −30 + 20p",
          "100 − 5p = −30 + 20p → 130 = 25p",
          [{ text: "p_consument = €5,20", bold: true }],
          "Q_nieuw = 100 − 5 × 5,20 = 74",
          [{ text: "p_producent = 5,20 − 0,50 = €4,70", bold: true }],
          "",
          "Prijsstijging consument: 5,20 − 4,80 = €0,40",
          [{ text: "Doorberekend: 0,40 / 0,50 × 100% = 80%", bold: true }],
        ],
        explanation: "Omdat de vraag inelastisch is (|Ev| = 0,316), draagt de consument het grootste deel van de accijns (80%). Dit is een kernregel: de partij met de minst elastische curve draagt het grootste deel van de belasting.",
      },
      {
        label: "Vraag 6c (2 punten)",
        vraagText: "Verklaar met behulp van het begrip prijselasticiteit waarom de consument een groter deel van de accijns draagt dan de producent.",
        thinkingSteps: [
          "Vergelijk de elasticiteit van vraag en aanbod.",
          "Welke partij kan makkelijker 'ontwijken'?",
          "Wie draagt het meeste = wie het minst elastisch is.",
        ],
        answerLines: 5,
        antwoord: [
          "De vraag naar benzine is inelastisch (|Ev| = 0,316): consumenten verminderen hun benzinegebruik nauwelijks bij een prijsstijging, omdat benzine een noodzakelijk goed is met weinig substituten.",
          "Het aanbod is elastischer: producenten kunnen hun aanbod makkelijker aanpassen.",
          [{ text: "Kernregel: ", bold: true }, { text: "de partij met de minst elastische curve draagt het grootste deel van de belasting. Consumenten kunnen niet makkelijk 'ontwijken', dus accepteren ze de hogere prijs." }],
        ],
        explanation: "Op het CE wordt verwacht dat je het verband legt tussen elasticiteit en belastingdruk. Noem altijd: (1) welke partij inelastischer is, (2) waarom (noodzakelijk goed/weinig substituten), en (3) de conclusie voor de belastingverdeling.",
      },
    ],
  },
];

// ── SAMENVATTEND SCHEMA ──
const samenvattendSchema = [
  ["Beredeneer-vragen", "Kenmerk noemen + bronbewijs geven; minstens 3 argumenten"],
  ["HHI", "Som van gekwadrateerde marktaandelen; >2500 = hoge concentratie"],
  ["Belasting", "Aanbod verschuift omhoog; verdeling via elasticiteiten"],
  ["Invoerheffing", "p_binnenlands = p_wereld + heffing; twee welvaartsverliesdriehoeken"],
  ["Extern effect", "Verschil private en maatschappelijke kosten; Pigouviaanse belasting = marginale schade"],
  ["Minimumprijs", "Bindend als p_min > p*; korte kant van de markt = verhandelde Q"],
  ["Prijselasticiteit", "Ev = (ΔQ/Δp) × (p/Q); inelastisch → consument draagt meer belasting"],
  ["CE-aanpak", "Lees de vraag, markeer sleutelwoorden, gebruik de juiste formule, controleer je antwoord"],
];

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════

async function main() {
  console.log("Building begeleide inoefening for 3.5.2 Naar het examen...\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`  Created directory: ${OUTPUT_DIR}`);
  }

  const vragenBuf = await buildBegeleideInoefening(
    PARAGRAAF_NR, ONDERWERP, HEADER_TEXT, oefeningen, samenvattendSchema, false
  );
  const answersBuf = await buildBegeleideInoefening(
    PARAGRAAF_NR, ONDERWERP, HEADER_TEXT, oefeningen, samenvattendSchema, true
  );

  const vragenPath = path.join(OUTPUT_DIR, "3.5.2 Naar het examen \u2013 begeleide inoefening \u2013 vragen.docx");
  const answersPath = path.join(OUTPUT_DIR, "3.5.2 Naar het examen \u2013 begeleide inoefening \u2013 antwoorden.docx");

  fs.writeFileSync(vragenPath, vragenBuf);
  fs.writeFileSync(answersPath, answersBuf);

  console.log(`  Vragen:      ${vragenPath} (${(vragenBuf.length / 1024).toFixed(0)} KB)`);
  console.log(`  Antwoorden:  ${answersPath} (${(answersBuf.length / 1024).toFixed(0)} KB)`);
  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
