/**
 * inoefening-351-afsluiting.js
 * ══════════════════════════════════════════════════════════════════════
 * Generates begeleide inoefening documents for 3.5.1 Afsluiting.
 * Cross-chapter review exercises with scaffolding.
 *
 * Run: NODE_PATH="$(npm root -g)" node inoefening-351-afsluiting.js
 *
 * HOW TO ADAPT:
 * This is a final-chapter review — exercises span all 4 chapters.
 * To reuse for another review paragraph, update the oefeningen array
 * and output paths below.
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const {
  buildBegeleideInoefening,
} = require("../../lib/lib-begeleide-inoefening.js");

// ── CONFIG ──
const PARAGRAAF_NR = "3.5.1";
const ONDERWERP = "Afsluiting";
const HEADER_TEXT = "Paragraaf 3.5.1 Afsluiting";
const OUTPUT_DIR = path.resolve(__dirname,
  "../../../../3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting/3.5.1 Paragraaf 1 - Afsluiting/3. Oefenen/begeleide inoefening"
);

// ══════════════════════════════════════════════════════════════════════
// OEFENINGEN — Cross-chapter review
// ══════════════════════════════════════════════════════════════════════

const oefeningen = [
  // ── Oefening 1: Marktvorm herkennen ──
  {
    nr: 1,
    title: "Marktvorm herkennen in een casus",
    domain: "markt",
    introText:
      "In de Nederlandse markt voor biologische kaas zijn vier grote zuivelproducenten actief: FrieslandCampina, CONO Kaasmakers, Henri Willig en Landana. Samen hebben ze 85% marktaandeel. Elke producent biedt kaas aan met een eigen smaakprofiel, verpakking en herkomstverhaal. Nieuwe toetreders hebben hoge opstartkosten vanwege het Skal-keurmerk en de benodigde boerderijcontracten.",
    deelvragen: [
      {
        label: "Vraag 1a — Kenmerken benoemen",
        vraagText: "Benoem de vier kenmerken van marktstructuur die je in deze casus kunt herkennen.",
        thinkingSteps: [
          "Hoeveel aanbieders zijn er? Zijn het er veel of weinig?",
          "Zijn de producten homogeen of heterogeen?",
          "Is er sprake van toe- en uittredingsbarrières?",
          "Hebben de aanbieders prijszettingsmacht?",
        ],
        hint: "Denk aan de vier criteria: aantal aanbieders, productdifferentiatie, toetredingsbarrières en prijszettingsmacht.",
        answerLines: 5,
        antwoord: [
          [{ text: "1. Aantal aanbieders: ", bold: true }, { text: "weinig (4 grote spelers met 85% marktaandeel)" }],
          [{ text: "2. Product: ", bold: true }, { text: "heterogeen (eigen smaakprofiel, verpakking, herkomstverhaal)" }],
          [{ text: "3. Toetredingsbarrières: ", bold: true }, { text: "hoog (Skal-keurmerk, boerderijcontracten)" }],
          [{ text: "4. Prijszettingsmacht: ", bold: true }, { text: "ja, vanwege productdifferentiatie en beperkt aantal aanbieders" }],
        ],
        explanation: "Bij weinig aanbieders met heterogene producten en hoge toetredingsbarrières is sprake van een heterogeen oligopolie.",
      },
      {
        label: "Vraag 1b — Marktvorm bepalen",
        vraagText: "Welke marktvorm past het best bij deze markt? Onderbouw je antwoord.",
        thinkingSteps: [
          "Combineer de vier kenmerken uit vraag 1a.",
          "Vergelijk met het schema van marktvormen.",
          "Let op: weinig aanbieders + heterogeen product = welke marktvorm?",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Marktvorm: ", bold: true }, { text: "heterogeen oligopolie" }],
          "Er zijn weinig aanbieders (4 grote met 85% marktaandeel), het product is heterogeen (eigen smaak/verpakking), er zijn hoge toetredingsbarrières en de producenten hebben prijszettingsmacht.",
        ],
        explanation: "Het onderscheid met monopolistische concurrentie zit in het aantal aanbieders: bij monopolistische concurrentie zijn er veel aanbieders, bij oligopolie weinig. De 85% concentratie bij slechts 4 bedrijven wijst duidelijk op oligopolie.",
      },
    ],
  },

  // ── Oefening 2: Marktevenwicht berekenen ──
  {
    nr: 2,
    title: "Marktevenwicht berekenen",
    domain: "markt",
    introText:
      "Op de markt voor fietsbanden gelden de volgende vergelijkingen:",
    formules: [
      "Vraagfunctie:  Qv = 800 − 20p",
      "Aanbodfunctie: Qa = −200 + 30p",
    ],
    deelvragen: [
      {
        label: "Vraag 2a — Evenwichtsprijs",
        vraagText: "Bereken de evenwichtsprijs.",
        thinkingSteps: [
          "In evenwicht geldt: Qv = Qa",
          "Stel de twee functies aan elkaar gelijk.",
          "Los op naar p.",
        ],
        formulaReminder: ["Evenwicht: Qv = Qa"],
        invulformaat: [
          "800 − 20p = −200 + 30p",
          "........  = ........",
          "p = ........",
        ],
        antwoord: [
          "800 − 20p = −200 + 30p",
          "800 + 200 = 30p + 20p",
          "1000 = 50p",
          [{ text: "p = 20", bold: true }],
        ],
        explanation: "Je stelt vraag gelijk aan aanbod en lost op naar p. Alle Q-termen verdwijnen.",
      },
      {
        label: "Vraag 2b — Evenwichtshoeveelheid",
        vraagText: "Bereken de evenwichtshoeveelheid.",
        thinkingSteps: [
          "Vul de evenwichtsprijs in bij de vraag- of aanbodfunctie.",
          "Controleer door ook in de andere functie in te vullen.",
        ],
        hint: "Vul p = 20 in bij Qv óf Qa. Beide moeten hetzelfde getal opleveren.",
        invulformaat: "Q = ........",
        antwoord: [
          "Qv = 800 − 20 × 20 = 800 − 400 = 400",
          "Controle: Qa = −200 + 30 × 20 = −200 + 600 = 400 ✓",
          [{ text: "Q* = 400", bold: true }],
        ],
        explanation: "Invullen in beide functies geeft dezelfde hoeveelheid — dat is de controle dat je goed hebt gerekend.",
      },
    ],
  },

  // ── Oefening 3: Surplus berekenen ──
  {
    nr: 3,
    title: "Consumentensurplus en producentensurplus",
    domain: "markt",
    introText:
      "Gebruik de gegevens uit oefening 2: evenwichtsprijs p* = 20, evenwichtshoeveelheid Q* = 400.",
    formules: [
      "Vraagfunctie:  Qv = 800 − 20p  →  p = 40 − 0,05Q",
      "Aanbodfunctie: Qa = −200 + 30p  →  p = 6⅔ + Q/30",
    ],
    deelvragen: [
      {
        label: "Vraag 3a — Consumentensurplus (CS)",
        vraagText: "Bereken het consumentensurplus.",
        thinkingSteps: [
          "Bepaal de maximale betalingsbereidheid (het snijpunt van de vraagcurve met de p-as: Q = 0).",
          "Het CS is de driehoek boven de evenwichtsprijs en onder de vraagcurve.",
          "Gebruik: CS = ½ × basis × hoogte",
        ],
        formulaReminder: [
          "CS = ½ × Q* × (p_max − p*)",
          "p_max = snijpunt vraagcurve met p-as (Q = 0)",
        ],
        invulformaat: [
          "p_max = ........",
          "CS = ½ × ........ × (........ − ........)",
          "CS = ........",
        ],
        antwoord: [
          "Bij Q = 0: p_max = 40 − 0,05 × 0 = 40",
          "CS = ½ × 400 × (40 − 20)",
          "CS = ½ × 400 × 20",
          [{ text: "CS = 4.000", bold: true }],
        ],
        explanation: "Het consumentensurplus is het verschil tussen wat consumenten maximaal willen betalen en wat ze werkelijk betalen, over alle eenheden.",
      },
      {
        label: "Vraag 3b — Producentensurplus (PS)",
        vraagText: "Bereken het producentensurplus.",
        thinkingSteps: [
          "Bepaal de minimale aanbodprijs (snijpunt aanbodcurve met p-as: Q = 0).",
          "Het PS is de driehoek onder de evenwichtsprijs en boven de aanbodcurve.",
          "Gebruik: PS = ½ × basis × hoogte",
        ],
        formulaReminder: [
          "PS = ½ × Q* × (p* − p_min)",
          "p_min = snijpunt aanbodcurve met p-as (Q = 0)",
        ],
        invulformaat: [
          "p_min = ........",
          "PS = ½ × ........ × (........ − ........)",
          "PS = ........",
        ],
        antwoord: [
          "Bij Q = 0: p_min = 6⅔ + 0/30 = 6⅔",
          "PS = ½ × 400 × (20 − 6⅔)",
          "PS = ½ × 400 × 13⅓",
          [{ text: "PS = 2.666⅔ (≈ 2.667)", bold: true }],
        ],
        explanation: "Het producentensurplus is het verschil tussen de ontvangen prijs en de minimale prijs waarvoor producenten willen leveren.",
      },
    ],
  },

  // ── Oefening 4: Effect van belasting op de markt ──
  {
    nr: 4,
    title: "Effect van een belasting op de markt",
    domain: "markt",
    introText:
      "De overheid legt een accijns van €4 per fietsband op aan de producenten. De oorspronkelijke vergelijkingen zijn:",
    formules: [
      "Vraagfunctie:  Qv = 800 − 20p",
      "Aanbodfunctie: Qa = −200 + 30p",
      "Accijns: t = €4 per stuk (opgelegd aan producenten)",
    ],
    deelvragen: [
      {
        label: "Vraag 4a — Nieuwe aanbodfunctie",
        vraagText: "Stel de nieuwe aanbodfunctie op na invoering van de accijns.",
        thinkingSteps: [
          "De producent ontvangt de marktprijs p, maar moet €4 per stuk afdragen.",
          "De netto-opbrengst voor de producent is (p − 4).",
          "Vervang p in de oude aanbodfunctie door (p − 4).",
        ],
        hint: "Bij een producentenbelasting schuift de aanbodcurve omhoog met het belastingbedrag.",
        invulformaat: [
          "Qa_nieuw = −200 + 30 × (p − 4)",
          "Qa_nieuw = ........",
        ],
        antwoord: [
          "Qa_nieuw = −200 + 30 × (p − 4)",
          "Qa_nieuw = −200 + 30p − 120",
          [{ text: "Qa_nieuw = −320 + 30p", bold: true }],
        ],
        explanation: "De aanbodcurve verschuift omhoog (naar links) met €4: producenten willen pas leveren bij een hogere marktprijs om dezelfde netto-opbrengst te behouden.",
      },
      {
        label: "Vraag 4b — Nieuw evenwicht",
        vraagText: "Bereken de nieuwe evenwichtsprijs en -hoeveelheid.",
        thinkingSteps: [
          "Stel de vraagfunctie gelijk aan de nieuwe aanbodfunctie.",
          "Los op naar p (dit is de consumentenprijs).",
          "Bereken Q door in te vullen.",
        ],
        invulformaat: [
          "800 − 20p = −320 + 30p",
          "p_consument = ........",
          "Q_nieuw = ........",
        ],
        antwoord: [
          "800 − 20p = −320 + 30p",
          "1120 = 50p",
          [{ text: "p_consument = 22,40", bold: true }],
          "Q = 800 − 20 × 22,40 = 800 − 448 = 352",
          [{ text: "Q_nieuw = 352", bold: true }],
          [{ text: "p_producent = 22,40 − 4 = 18,40", bold: true }],
        ],
        explanation: "De consument betaalt €2,40 meer (van €20 naar €22,40) en de producent ontvangt €1,60 minder (van €20 naar €18,40). De belastingdruk wordt verdeeld: 60% voor de consument, 40% voor de producent. Dit komt door de relatieve elasticiteiten van vraag en aanbod.",
      },
      {
        label: "Vraag 4c — Belastingopbrengst en welvaartsverlies",
        vraagText: "Bereken de belastingopbrengst voor de overheid en het welvaartsverlies (deadweight loss).",
        thinkingSteps: [
          "Belastingopbrengst = accijns × nieuwe hoeveelheid",
          "Welvaartsverlies = ½ × accijns × (Q_oud − Q_nieuw)",
        ],
        formulaReminder: [
          "Belastingopbrengst = t × Q_nieuw",
          "Welvaartsverlies = ½ × t × ΔQ",
        ],
        invulformaat: [
          "Belastingopbrengst = ........ × ........ = ........",
          "Welvaartsverlies   = ½ × ........ × ........ = ........",
        ],
        antwoord: [
          "Belastingopbrengst = 4 × 352 = 1.408",
          [{ text: "Belastingopbrengst = €1.408", bold: true }],
          "Welvaartsverlies = ½ × 4 × (400 − 352) = ½ × 4 × 48",
          [{ text: "Welvaartsverlies = €96", bold: true }],
        ],
        explanation: "Het welvaartsverlies ontstaat doordat 48 eenheden niet meer verhandeld worden die bij het oude evenwicht wel een positief surplus opleverden. Dit is de driehoek tussen de vraag- en aanbodcurve, tussen Q = 352 en Q = 400.",
      },
    ],
  },

  // ── Oefening 5: Comparatief voordeel ──
  {
    nr: 5,
    title: "Comparatief voordeel bepalen",
    domain: "markt",
    introText:
      "Twee landen produceren twee goederen. De onderstaande tabel toont de productiekosten per eenheid (in arbeidsuren).",
    formules: [
      "                  Kaas    Wijn",
      "Nederland          2       6",
      "Frankrijk           5       5",
    ],
    deelvragen: [
      {
        label: "Vraag 5a — Absoluut voordeel",
        vraagText: "Welk land heeft een absoluut voordeel bij de productie van kaas? En bij wijn?",
        thinkingSteps: [
          "Absoluut voordeel = het land dat het product met minder arbeidsuren kan maken.",
          "Vergelijk de kosten per product.",
        ],
        answerLines: 3,
        antwoord: [
          [{ text: "Kaas: ", bold: true }, { text: "Nederland (2 uur < 5 uur) — absoluut voordeel" }],
          [{ text: "Wijn: ", bold: true }, { text: "Frankrijk (5 uur < 6 uur) — absoluut voordeel" }],
        ],
        explanation: "Je vergelijkt simpelweg de productiekosten per product. Het land met de lagere kosten heeft het absolute voordeel.",
      },
      {
        label: "Vraag 5b — Alternatieve kosten",
        vraagText: "Bereken de alternatieve kosten van 1 eenheid kaas in beide landen, uitgedrukt in eenheden wijn.",
        thinkingSteps: [
          "Alternatieve kosten kaas = hoeveel wijn moet je opgeven om 1 kaas te maken?",
          "Gebruik de verhouding: kosten kaas / kosten wijn",
        ],
        formulaReminder: [
          "Alternatieve kosten kaas (in wijn) = arbeidsuren kaas / arbeidsuren wijn",
        ],
        invulformaat: [
          "Nederland: AK kaas = 2/6 = ........ eenheid wijn",
          "Frankrijk: AK kaas = 5/5 = ........ eenheid wijn",
        ],
        antwoord: [
          [{ text: "Nederland: ", bold: true }, { text: "AK kaas = 2/6 = ⅓ eenheid wijn" }],
          [{ text: "Frankrijk: ", bold: true }, { text: "AK kaas = 5/5 = 1 eenheid wijn" }],
        ],
        explanation: "Nederland heeft lagere alternatieve kosten voor kaas (⅓ < 1), dus Nederland heeft een comparatief voordeel bij kaas.",
      },
      {
        label: "Vraag 5c — Specialisatieadvies",
        vraagText: "Welk land moet zich specialiseren in welk product? Waarom levert handel voordeel op?",
        thinkingSteps: [
          "Het land met de laagste alternatieve kosten heeft het comparatief voordeel.",
          "Elk land specialiseert in het product waarvoor het comparatief voordeel heeft.",
          "Door handel kunnen beide landen meer consumeren dan in autarkie.",
        ],
        answerLines: 5,
        antwoord: [
          [{ text: "Nederland: ", bold: true }, { text: "specialiseert in kaas (AK kaas = ⅓ wijn < 1 wijn)" }],
          [{ text: "Frankrijk: ", bold: true }, { text: "specialiseert in wijn (AK wijn = 1 kaas < 3 kaas)" }],
          "Door specialisatie en handel kunnen beide landen buiten hun eigen productiemogelijkhedencurve consumeren. De ruilvoet moet liggen tussen de alternatieve kosten van beide landen: tussen ⅓ en 1 eenheid wijn per eenheid kaas.",
        ],
        explanation: "Comparatief voordeel (David Ricardo) toont aan dat handel voordelig is zolang de alternatieve kosten verschillen — zelfs als één land bij beide producten een absoluut voordeel heeft.",
      },
    ],
  },

  // ── Oefening 6: Welvaartsverlies bij monopolie vs. volkomen concurrentie ──
  {
    nr: 6,
    title: "Welvaartsverlies bij monopolie",
    domain: "markt",
    introText:
      "Een monopolist opereert op een markt met de volgende gegevens:",
    formules: [
      "Vraagfunctie: p = 100 − 2Q",
      "Totale kosten: TK = 20Q (constante MK = 20)",
      "Marginale opbrengst: MO = 100 − 4Q",
    ],
    deelvragen: [
      {
        label: "Vraag 6a — Monopolie-evenwicht",
        vraagText: "Bereken de winstmaximaliserende prijs en hoeveelheid van de monopolist.",
        thinkingSteps: [
          "De monopolist maximaliseert winst waar MO = MK.",
          "Bereken Q uit MO = MK.",
          "Vul Q in de vraagfunctie in om p te vinden.",
        ],
        formulaReminder: [
          "Winstmaximum: MO = MK",
          "MO = 100 − 4Q",
          "MK = 20",
        ],
        invulformaat: [
          "100 − 4Q = 20",
          "Q_monopolie = ........",
          "p_monopolie = ........",
        ],
        antwoord: [
          "100 − 4Q = 20",
          "80 = 4Q",
          [{ text: "Q_monopolie = 20", bold: true }],
          "p = 100 − 2 × 20 = 100 − 40",
          [{ text: "p_monopolie = 60", bold: true }],
        ],
        explanation: "De monopolist produceert minder en vraagt een hogere prijs dan bij volkomen concurrentie, omdat MO < p bij dalende vraagcurve.",
      },
      {
        label: "Vraag 6b — Volkomen concurrentie-evenwicht",
        vraagText: "Bereken prijs en hoeveelheid bij volkomen concurrentie op dezelfde markt.",
        thinkingSteps: [
          "Bij volkomen concurrentie geldt: p = MK.",
          "Stel de vraagfunctie gelijk aan MK.",
          "Los op naar Q en p.",
        ],
        hint: "Bij volkomen concurrentie is er geen verschil tussen prijs en marginale opbrengst.",
        invulformaat: [
          "100 − 2Q = 20",
          "Q_vc = ........",
          "p_vc = ........",
        ],
        antwoord: [
          "100 − 2Q = 20",
          "80 = 2Q",
          [{ text: "Q_vc = 40", bold: true }],
          [{ text: "p_vc = 20 (= MK)", bold: true }],
        ],
        explanation: "Bij volkomen concurrentie wordt er meer geproduceerd (40 vs. 20) tegen een lagere prijs (€20 vs. €60). Dit is allocatief efficiënt.",
      },
      {
        label: "Vraag 6c — Welvaartsverlies berekenen",
        vraagText: "Bereken het welvaartsverlies (deadweight loss) door de monopolie.",
        thinkingSteps: [
          "Het welvaartsverlies is de driehoek tussen Q_monopolie en Q_vc.",
          "De bovenkant is de vraagcurve, de onderkant is de MK-lijn.",
          "Gebruik: DWL = ½ × (p_monopolie − MK) × (Q_vc − Q_monopolie)",
        ],
        formulaReminder: [
          "DWL = ½ × (p_mon − MK) × (Q_vc − Q_mon)",
        ],
        invulformaat: [
          "DWL = ½ × (........ − ........) × (........ − ........)",
          "DWL = ........",
        ],
        warning: "Gebruik de monopolieprijs en MK als hoogte, niet de prijzen aan de boven- en onderkant van de grafiek.",
        antwoord: [
          "DWL = ½ × (60 − 20) × (40 − 20)",
          "DWL = ½ × 40 × 20",
          [{ text: "DWL = 400", bold: true }],
        ],
        explanation: "Dit welvaartsverlies ontstaat doordat de monopolist 20 eenheden minder produceert dan bij volkomen concurrentie. Voor die eenheden was de betalingsbereidheid hoger dan de productiekosten, maar ze worden niet verhandeld. Dit is de reden dat de overheid soms ingrijpt bij monopolies.",
      },
    ],
  },
];

// ── SAMENVATTEND SCHEMA ──
const samenvattendSchema = [
  ["Marktvormen", "Bepaal aantal aanbieders, producttype, toetredingsbarrières en prijszettingsmacht"],
  ["Evenwicht", "Qv = Qa → los op naar p → vul terug voor Q"],
  ["CS / PS", "Driehoek: ½ × Q* × (verschil met snijpunt op p-as)"],
  ["Belasting", "Aanbodcurve verschuift omhoog; consument + producent delen de last"],
  ["Welvaartsverlies", "½ × belasting × ΔQ   of   ½ × (p_mon − MK) × (Q_vc − Q_mon)"],
  ["Comparatief voordeel", "Alternatieve kosten vergelijken → laagste AK = specialisatie"],
  ["Monopolie vs. VC", "Monopolist: MO = MK; VC: p = MK → monopolie = minder Q, hogere p, DWL"],
];

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════

async function main() {
  console.log("Building begeleide inoefening for 3.5.1 Afsluiting...\n");

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

  const vragenPath = path.join(OUTPUT_DIR, "3.5.1 Afsluiting \u2013 begeleide inoefening \u2013 vragen.docx");
  const answersPath = path.join(OUTPUT_DIR, "3.5.1 Afsluiting \u2013 begeleide inoefening \u2013 antwoorden.docx");

  fs.writeFileSync(vragenPath, vragenBuf);
  fs.writeFileSync(answersPath, answersBuf);

  console.log(`  Vragen:      ${vragenPath} (${(vragenBuf.length / 1024).toFixed(0)} KB)`);
  console.log(`  Antwoorden:  ${answersPath} (${(answersBuf.length / 1024).toFixed(0)} KB)`);
  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
