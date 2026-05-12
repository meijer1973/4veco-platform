/**
 * b1-111-inoefening.js
 * ══════════════════════════════════════════════════════════════════════
 * Generates begeleide inoefening documents for Boek 1 §1.1.1
 * "Schaarste en economisch denken".
 *
 * 6 scaffolded exercises (separate set from the 5 textbook exercises):
 *   1. Schaarste ja/nee — 3 mini-scenarios
 *   2. Alternatieve kosten bij 2 alternatieven (Max)         [scaffoldImage: fig_2_doc]
 *   3. Alternatieve kosten bij 3 alternatieven (Sam)         [scaffoldImage: fig_2_doc]
 *   4. Winst op schaars middel (boer, 12 ha, 3 gewassen)     [scaffoldImage: we_1_doc]
 *   5. Meerdere keuzerondes — €30-budget
 *   6. Verhaal-analyse — overheidskeuze bij budget (B02-stappen)
 *
 * Run from 4veco-platform/:
 *   node build-scripts/content/book-1/b1-111-inoefening.js
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");

const NODE_PATH = path.join(process.env.APPDATA || "", "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

const {
  buildBegeleideInoefening,
} = require("../../lib/lib-begeleide-inoefening.js");

// ── CONFIG ──
const PARAGRAAF_NR = "1.1.1";
const ONDERWERP = "Schaarste en economisch denken";
const HEADER_TEXT = "Paragraaf 1.1.1 Schaarste en economisch denken";

const PARAGRAAF_DIR = path.resolve(
  __dirname,
  "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken"
);
const OUTPUT_DIR = PARAGRAAF_DIR;
const ASSETS_DIR = path.join(PARAGRAAF_DIR, "_assets");

// L1.5V Bucket A4: each image config carries an `altText` string for the
// shared embedAssetFromPath() helper to emit as the docx descr.
const ALT = require("./b1-111-alt-text");

const IMG_FIG_2 = {
  path: path.join(ASSETS_DIR, "1.1.1_fig_2_doc.png"),
  assetName: "1.1.1_fig_2",
  altText: ALT["1.1.1_fig_2"],
  width: 520,
  height: 333,
};
const IMG_WE_1 = {
  path: path.join(ASSETS_DIR, "1.1.1_we_1_doc.png"),
  assetName: "1.1.1_we_1",
  altText: ALT["1.1.1_we_1"],
  width: 520,
  height: 333,
};

// ══════════════════════════════════════════════════════════════════════
// OEFENINGEN
// ══════════════════════════════════════════════════════════════════════

const oefeningen = [
  // ── Oefening 1: Schaarste ja/nee — 3 mini-scenarios ──
  {
    nr: 1,
    title: "Is er sprake van schaarste?",
    domain: "markt",
    introText:
      "Beoordeel per situatie of er sprake is van schaarste. Leg telkens kort uit waarom wel of niet. Denk aan de definitie: er is schaarste als de behoeften groter zijn dan de beschikbare middelen.",
    deelvragen: [
      {
        label: "Vraag 1a — Klas en computers",
        vraagText:
          "In een klas zitten 28 leerlingen. Ze willen allemaal tegelijk werken aan een opdracht op de computer. Het lokaal heeft 18 werkende computers. Is er sprake van schaarste? Leg uit.",
        thinkingSteps: [
          "Benoem de behoefte: wat willen de leerlingen?",
          "Benoem het middel: wat is er beschikbaar?",
          "Vergelijk: is de behoefte groter dan het middel?",
          "Conclusie: wel/geen schaarste + waarom moet er gekozen worden?",
        ],
        hint: "Schaarste gaat niet over 'weinig', maar over de verhouding tussen wensen en beschikbaar middel.",
        answerLines: 4,
        antwoord: [
          [{ text: "Ja, er is schaarste. ", bold: true }],
          "Behoefte: 28 leerlingen willen computeren. Middel: 18 computers.",
          "Behoefte (28) > middel (18), dus er moet gekozen worden wie wel en wie niet achter een computer kan.",
        ],
        explanation:
          "De kern van schaarste is de verhouding behoefte ÷ middel. Omdat er 10 computers tekort zijn, moet de docent een verdeelregel toepassen (bijvoorbeeld met z'n tweeën achter één computer). Dat is exact wat schaarste afdwingt: keuzes maken.",
      },
      {
        label: "Vraag 1b — Vrije tijd",
        vraagText:
          "Noa heeft op woensdagmiddag 3 uur vrij. Ze wil hockeytraining volgen (1,5 uur), haar wiskundehuiswerk maken (1 uur) en afspreken met een vriendin (2 uur). Is er sprake van schaarste? Leg uit.",
        thinkingSteps: [
          "Tel de totale tijd die Noa nodig heeft voor al haar wensen.",
          "Vergelijk dat met haar beschikbare tijd (3 uur).",
          "Conclusie: moet ze kiezen of niet?",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Ja, er is schaarste. ", bold: true }],
          "Behoefte: 1,5 + 1 + 2 = 4,5 uur aan activiteiten.",
          "Middel: 3 uur vrije tijd.",
          "Behoefte (4,5 uur) > middel (3 uur), dus Noa moet kiezen welke activiteit(en) ze laat vallen of inkort.",
        ],
        explanation:
          "Ook tijd is een schaars middel — misschien wel het meest universele. Elke keer dat je 'ik heb geen tijd' zegt, bedoel je eigenlijk: mijn tijd is schaars en ik moet kiezen.",
      },
      {
        label: "Vraag 1c — Zakgeld",
        vraagText:
          "Tim krijgt €10 zakgeld per week. Deze week wil hij één ding kopen: een stripboek van €7. Is er voor Tim sprake van schaarste bij deze keuze? Leg uit.",
        thinkingSteps: [
          "Benoem de behoefte en het middel van Tim.",
          "Let op: bij deze concrete keuze, niet in het algemeen.",
          "Is middel groter dan, gelijk aan, of kleiner dan de behoefte?",
        ],
        hint: "Let goed op: het gaat om deze specifieke keuze, niet om Tim's hele leven.",
        answerLines: 4,
        antwoord: [
          [{ text: "Nee, voor deze keuze is er geen schaarste. ", bold: true }],
          "Behoefte: €7 (het stripboek). Middel: €10 zakgeld.",
          "Middel (€10) > behoefte (€7), dus Tim kan zijn wens volledig vervullen — hij hoeft niet te kiezen.",
          "Zou Tim méér willen dan €10 (bijvoorbeeld ook een shirt van €15 én het boek), dan zou er wel schaarste zijn.",
        ],
        explanation:
          "Schaarste hangt altijd af van de verhouding tussen behoefte en middel. Hetzelfde bedrag (€10) kan bij de ene persoon ruim voldoende zijn en bij de andere persoon tekortschieten. Let ook op: 'geen schaarste' is hier bijna altijd tijdelijk — zodra Tim méér wil, komt schaarste terug.",
      },
    ],
  },

  // ── Oefening 2: Alternatieve kosten bij 2 alternatieven ──
  {
    nr: 2,
    title: "Alternatieve kosten bij twee alternatieven",
    domain: "markt",
    introText:
      "Max heeft zaterdagavond €25 te besteden. Hij twijfelt tussen twee opties: een pizza-avond met vrienden (waarde voor Max: €30 aan plezier) of een nieuwe game die in de aanbieding is (waarde voor Max: €22 aan speelplezier). Hij kan maar één ding kiezen.",
    deelvragen: [
      {
        label: "Vraag 2a — Alternatieven en opbrengsten benoemen",
        vraagText:
          "Noem de twee alternatieven en de opbrengst (waarde) van elk alternatief voor Max.",
        thinkingSteps: [
          "Welke opties staan in de tekst?",
          "Wat is per optie de opbrengst (waarde) voor Max?",
        ],
        scaffoldImage: IMG_FIG_2,
        answerLines: 4,
        antwoord: [
          [{ text: "Alternatief 1: ", bold: true }, { text: "pizza-avond met vrienden — opbrengst €30" }],
          [{ text: "Alternatief 2: ", bold: true }, { text: "nieuwe game — opbrengst €22" }],
        ],
        explanation:
          "Stap 1 en 2 van de procedure: altijd eerst alle opties en hun opbrengst in kaart brengen. Pas daarna kun je alternatieve kosten bepalen.",
      },
      {
        label: "Vraag 2b — Alternatieve kosten bij keuze voor pizza",
        vraagText:
          "Max kiest voor de pizza-avond. Wat zijn zijn alternatieve kosten?",
        thinkingSteps: [
          "Welk alternatief is niet gekozen?",
          "Wat is de opbrengst van dat niet-gekozen alternatief?",
          "Alternatieve kosten = opbrengst van het beste niet-gekozen alternatief.",
        ],
        formulaReminder: [
          "alternatieve kosten = opbrengst beste niet-gekozen alternatief",
        ],
        invulformaat: [
          "Niet gekozen alternatief: .................",
          "Opbrengst van dat alternatief: €.........",
          "Alternatieve kosten: €.........",
        ],
        antwoord: [
          "Niet gekozen alternatief: de game.",
          "Opbrengst van de game: €22.",
          [{ text: "Alternatieve kosten = €22", bold: true }, { text: " (het speelplezier dat hij misloopt)" }],
        ],
        explanation:
          "Let op: de alternatieve kosten zijn NIET de prijs (€25) en ook NIET de opbrengst van de gekozen optie. Het zijn de gemiste opbrengsten van de beste niet-gekozen optie.",
      },
      {
        label: "Vraag 2c — Heeft Max een economisch verstandige keuze gemaakt?",
        vraagText:
          "Vergelijk de opbrengst van Max' keuze met zijn alternatieve kosten. Is zijn keuze economisch verstandig? Leg uit.",
        thinkingSteps: [
          "Opbrengst van de gekozen optie?",
          "Alternatieve kosten (= opbrengst beste niet-gekozen)?",
          "Is de opbrengst groter dan de alternatieve kosten?",
        ],
        formulaReminder: [
          "nettowaarde keuze = opbrengst gekozen − alternatieve kosten",
        ],
        answerLines: 4,
        antwoord: [
          "Opbrengst pizza-avond: €30. Alternatieve kosten: €22.",
          "Nettowaarde = €30 − €22 = €8.",
          [{ text: "Ja, de keuze is economisch verstandig. ", bold: true }],
          "De opbrengst (€30) is groter dan de alternatieve kosten (€22): Max wint per saldo €8 aan plezier ten opzichte van het beste alternatief.",
        ],
        explanation:
          "Een keuze is economisch verstandig als de opbrengst groter is dan de alternatieve kosten. Dat betekent: je kiest het alternatief met de hóógste opbrengst van alle opties.",
      },
    ],
  },

  // ── Oefening 3: Alternatieve kosten bij 3 alternatieven ──
  {
    nr: 3,
    title: "Alternatieve kosten bij drie alternatieven",
    domain: "markt",
    introText:
      "Sam heeft een vrije zaterdag (6 uur). Zij kan maar één activiteit doen. Zij twijfelt tussen drie opties:",
    formules: [
      "Optie 1: Bijbaan — €48 verdienen (€8 per uur × 6 uur)",
      "Optie 2: Examen leren — betere cijfers (waarde voor Sam: €35)",
      "Optie 3: Festival met vriendinnen — plezier (waarde voor Sam: €40)",
    ],
    deelvragen: [
      {
        label: "Vraag 3a — Rangschik de alternatieven",
        vraagText:
          "Rangschik de drie alternatieven van hoogste naar laagste opbrengst.",
        thinkingSteps: [
          "Zet de opbrengsten op een rijtje.",
          "Rangschik van groot naar klein.",
        ],
        scaffoldImage: IMG_FIG_2,
        answerLines: 4,
        antwoord: [
          "1. Bijbaan: €48",
          "2. Festival: €40",
          "3. Examen leren: €35",
        ],
        explanation:
          "Rangschikken helpt je later: de alternatieve kosten zijn altijd de opbrengst van het BESTE niet-gekozen alternatief — dus de hoogste van wat je overlaat.",
      },
      {
        label: "Vraag 3b — Alternatieve kosten bij festival",
        vraagText:
          "Sam kiest voor het festival. Wat zijn haar alternatieve kosten?",
        thinkingSteps: [
          "Welke twee opties blijven over als Sam naar het festival gaat?",
          "Welke van die twee heeft de hoogste opbrengst? (Dat is het 'beste niet-gekozen alternatief'.)",
          "Alternatieve kosten = de opbrengst van dat beste niet-gekozen alternatief — NIET de som.",
        ],
        warning:
          "Veel leerlingen tellen alle niet-gekozen opbrengsten bij elkaar op (€48 + €35). Dat is fout. Je kunt maar ÉÉN alternatief tegelijk doen, dus de kosten zijn alleen het beste gemiste alternatief.",
        formulaReminder: [
          "alternatieve kosten = opbrengst beste niet-gekozen alternatief",
          "NIET: som van alle niet-gekozen opbrengsten",
        ],
        invulformaat: [
          "Niet-gekozen alternatieven: ................. en .................",
          "Beste niet-gekozen alternatief: .................",
          "Alternatieve kosten: €.........",
        ],
        antwoord: [
          "Niet-gekozen: bijbaan (€48) en examen leren (€35).",
          "Beste niet-gekozen: de bijbaan (€48 > €35).",
          [{ text: "Alternatieve kosten = €48", bold: true }],
          "Niet €48 + €35 = €83: Sam had ook maar één van die twee kunnen doen, niet allebei.",
        ],
        explanation:
          "Dit is dé klassieke valkuil bij alternatieve kosten. Als je 3 niet-gekozen opties hebt bij slechts één keuze, zou optellen betekenen dat je al die opties tegelijk had kunnen doen — en dat klopt niet. Je mist er slechts één: de beste.",
      },
      {
        label: "Vraag 3c — Is de keuze economisch verstandig?",
        vraagText:
          "Heeft Sam een economisch verstandige keuze gemaakt door voor het festival te gaan? Onderbouw met de opbrengsten en de alternatieve kosten.",
        thinkingSteps: [
          "Opbrengst gekozen alternatief (festival)?",
          "Alternatieve kosten (uit 3b)?",
          "Is opbrengst groter of kleiner dan alternatieve kosten?",
          "Conclusie: verstandig of niet?",
        ],
        answerLines: 4,
        antwoord: [
          "Opbrengst festival: €40. Alternatieve kosten: €48.",
          "Nettowaarde = €40 − €48 = −€8.",
          [{ text: "Nee, de keuze is economisch niet verstandig. ", bold: true }],
          "De bijbaan had een hogere opbrengst (€48) dan het festival (€40). Sam verliest per saldo €8 aan waarde door deze keuze.",
        ],
        explanation:
          "De economisch verstandige keuze is altijd het alternatief met de hóógste opbrengst (hier: de bijbaan). Kiezen voor een mindere optie betekent per definitie dat je alternatieve kosten hoger zijn dan je opbrengst — een negatieve nettowaarde.",
      },
    ],
  },

  // ── Oefening 4: Winst op schaars middel ──
  {
    nr: 4,
    title: "Winst op een schaars middel — de boer met 12 hectare",
    domain: "markt",
    introText:
      "Een akkerbouwer heeft 12 hectare land (haar schaarse middel). Zij kan kiezen uit drie gewassen. De winst per hectare verschilt per gewas. Zij gebruikt al haar land voor één gewas.",
    formules: [
      "Tarwe:         €450 winst per hectare",
      "Suikerbieten:  €600 winst per hectare",
      "Aardappelen:   €520 winst per hectare",
      "Beschikbaar:   12 hectare",
    ],
    deelvragen: [
      {
        label: "Vraag 4a — Totale winst per gewas",
        vraagText:
          "Bereken voor elk gewas de totale winst als de boerin al haar 12 hectare aan dat gewas besteedt.",
        thinkingSteps: [
          "Gebruik: totale opbrengst = eenheden × opbrengst per eenheid.",
          "Hier: eenheden = hectares (12); opbrengst per eenheid = winst per ha.",
          "Doe dit voor alle drie gewassen.",
        ],
        scaffoldImage: IMG_WE_1,
        formulaReminder: [
          "totale opbrengst = aantal eenheden × opbrengst per eenheid",
          "TO = q × o",
        ],
        invulformaat: [
          "Tarwe:        12 × €450  =  €........",
          "Suikerbieten: 12 × €600  =  €........",
          "Aardappelen:  12 × €520  =  €........",
        ],
        antwoord: [
          "Tarwe:        12 × €450 = €5.400",
          "Suikerbieten: 12 × €600 = €7.200",
          "Aardappelen:  12 × €520 = €6.240",
        ],
        explanation:
          "Bij een schaars middel (land, tijd, geld) bereken je totale opbrengst altijd als 'aantal eenheden × opbrengst per eenheid'. Dit is de basis voor de vergelijking van alternatieven.",
      },
      {
        label: "Vraag 4b — Beste keuze en alternatieve kosten",
        vraagText:
          "Welk gewas levert de hoogste winst op? En wat zijn de alternatieve kosten van die keuze?",
        thinkingSteps: [
          "Kijk naar jouw drie totalen uit 4a.",
          "Welk gewas levert het meest op? → dat is de beste keuze.",
          "Welke twee gewassen blijven over? Welke van die twee heeft de hoogste opbrengst?",
          "Alternatieve kosten = opbrengst van het beste niet-gekozen alternatief.",
        ],
        formulaReminder: [
          "alternatieve kosten = opbrengst beste niet-gekozen alternatief",
        ],
        invulformaat: [
          "Beste keuze: ................. (€.........)",
          "Beste niet-gekozen: ................. (€.........)",
          "Alternatieve kosten: €.........",
        ],
        antwoord: [
          [{ text: "Beste keuze: suikerbieten — €7.200. ", bold: true }],
          "Niet gekozen: aardappelen (€6.240) en tarwe (€5.400).",
          "Beste niet-gekozen alternatief: aardappelen (€6.240 > €5.400).",
          [{ text: "Alternatieve kosten = €6.240", bold: true }],
        ],
        explanation:
          "De hoogste opbrengst bepaalt de economisch beste keuze. De alternatieve kosten zijn nooit de laagste of het gemiddelde — altijd de hoogste opbrengst van wat je NIET kiest.",
      },
      {
        label: "Vraag 4c — Nettowaarde van de keuze",
        vraagText:
          "Hoeveel 'wint' de boerin per saldo door voor suikerbieten te kiezen in plaats van voor het beste alternatief?",
        thinkingSteps: [
          "Nettowaarde = opbrengst gekozen − alternatieve kosten.",
          "Dit is de extra winst die ze boekt dankzij de beste keuze.",
        ],
        formulaReminder: [
          "nettowaarde = opbrengst gekozen − alternatieve kosten",
        ],
        invulformaat: [
          "Nettowaarde = €........ − €........ = €........",
        ],
        antwoord: [
          "Nettowaarde = €7.200 − €6.240 = €960",
          [{ text: "De boerin 'wint' €960 door voor suikerbieten te kiezen ", bold: true }, { text: "in plaats van voor het beste alternatief (aardappelen)." }],
        ],
        explanation:
          "Deze €960 is het verschil ten opzichte van haar beste alternatief — niet ten opzichte van niets doen. Economisch gezien is dit de 'winst van de beste keuze'.",
      },
    ],
  },

  // ── Oefening 5: Meerdere keuzerondes — €30-budget ──
  {
    nr: 5,
    title: "Meerdere keuzerondes — Luuk verdeelt €30",
    domain: "markt",
    introText:
      "Luuk heeft €30. Hij maakt een lijstje van vier dingen die hij zou willen kopen. Hij mag combineren zolang zijn totale uitgaven €30 niet overschrijden. De waarde (hoe blij hij ervan wordt) heeft hij er zelf bij geschreven.",
    formules: [
      "Optie A: Bioscoopkaartje       — prijs €12, waarde €18",
      "Optie B: Boek                   — prijs €15, waarde €20",
      "Optie C: Pizza                  — prijs €10, waarde €12",
      "Optie D: Streamingabonnement    — prijs €8,  waarde €14",
      "Budget: €30",
    ],
    deelvragen: [
      {
        label: "Vraag 5a — Mogelijke combinaties",
        vraagText:
          "Noem drie verschillende combinaties die binnen het budget van €30 passen. Geef per combinatie de totale prijs.",
        thinkingSteps: [
          "Probeer combinaties van 2, 3 of 4 opties.",
          "Tel de prijzen bij elkaar op: mag niet boven €30 uitkomen.",
          "Geef bij elke combinatie de totale prijs.",
        ],
        hint: "Er zijn meerdere goede antwoorden. Je hoeft er maar drie te noemen.",
        answerLines: 6,
        antwoord: [
          "Voorbeelden van geldige combinaties (er zijn er meer):",
          "Combinatie 1: A + B = €12 + €15 = €27 ✓",
          "Combinatie 2: A + C + D = €12 + €10 + €8 = €30 ✓",
          "Combinatie 3: B + D = €15 + €8 = €23 ✓",
          "Ongeldig zou bijvoorbeeld zijn: A + B + C = €12 + €15 + €10 = €37 (boven €30).",
        ],
        explanation:
          "Bij een budgetbeperking is de schaarse factor het geld. Je kunt niet alles, dus je moet combinaties vergelijken. Meerdere combinaties 'passen' — welke de beste is, beoordeel je pas bij 5b.",
      },
      {
        label: "Vraag 5b — Beste combinatie beredeneren",
        vraagText:
          "Welke combinatie levert Luuk de hoogste totale waarde op? Laat je berekening zien en beargumenteer je keuze met de 4 stappen van economisch denken.",
        thinkingSteps: [
          "Stap 1: welke combinaties zijn haalbaar (binnen €30)?",
          "Stap 2: wat is de totale waarde van elke haalbare combinatie?",
          "Stap 3: welke combinatie levert de hoogste totale waarde op? Welke 'geef je op'?",
        ],
        warning:
          "Kijk niet alleen naar prijs of naar waarde los: het gaat om de totale waarde bij een gegeven budget. Reken alle haalbare combinaties door voordat je kiest.",
        formulaReminder: [
          "totale waarde combinatie = som van waardes gekozen opties",
          "beperking: som van prijzen ≤ budget (€30)",
        ],
        invulformaat: [
          "Combinatie ...: waarde €..........  prijs €..........",
          "Combinatie ...: waarde €..........  prijs €..........",
          "Combinatie ...: waarde €..........  prijs €..........",
          "Beste combinatie: ...........................",
        ],
        antwoord: [
          [{ text: "Stap 1 — haalbare combinaties (prijs ≤ €30):", bold: true }],
          "A + B         = €27, waarde 18 + 20 = €38",
          "A + C + D     = €30, waarde 18 + 12 + 14 = €44",
          "B + D         = €23, waarde 20 + 14 = €34",
          "B + C         = €25, waarde 20 + 12 = €32",
          "A + D         = €20, waarde 18 + 14 = €32",
          "A + B of A+C: hoger kan niet (A+B+C = €37 past niet, A+B+D = €35 past niet).",
          [{ text: "Stap 2 — hoogste totale waarde: A + C + D met €44.", bold: true }],
          [{ text: "Stap 3 — alternatieve kosten: ", bold: true }, { text: "de best haalbare niet-gekozen combinatie is A + B (€38). Luuk geeft dus €38 aan waarde op — veel minder dan de €44 die hij kiest." }],
          [{ text: "Beste keuze: A + C + D (bioscoop + pizza + streaming).", bold: true }],
        ],
        explanation:
          "Dit laat zien dat de schaarse middel (€30) niet één maar meerdere keuzes afdwingt. Je past dezelfde 4 stappen toe, maar nu op combinaties. De alternatieve kosten zijn de waarde van de best haalbare niet-gekozen combinatie (€38), niet de som van alle opties die je niet kiest.",
      },
    ],
  },

  // ── Oefening 6: Verhaal-analyse — overheidskeuze bij budget ──
  {
    nr: 6,
    title: "Overheidskeuze bij een schaars budget (volledige 4-stappenprocedure)",
    domain: "markt",
    introText:
      "Een gemeente heeft €2.000.000 (2 miljoen euro) beschikbaar voor één groot project. De wethouder overweegt drie plannen. Het ambtelijk apparaat heeft per plan de geschatte maatschappelijke opbrengst uitgerekend (in euro's, op basis van tijdsbesparing, veiligheid en gebruik).",
    formules: [
      "Plan 1: Nieuwe fietsbrug          — kosten €2.000.000, opbrengst €2.800.000",
      "Plan 2: Renovatie schoolgebouw    — kosten €2.000.000, opbrengst €3.200.000",
      "Plan 3: Aanleg stadspark          — kosten €2.000.000, opbrengst €2.500.000",
      "Beschikbaar budget: €2.000.000 (voor één plan)",
    ],
    deelvragen: [
      {
        label: "Vraag 6a — Stap 1 & 2 van economisch denken",
        vraagText:
          "Pas de eerste twee stappen van de procedure 'alternatieve kosten' toe: (1) benoem de alternatieven voor het schaarse middel; (2) bereken/benoem de opbrengst per alternatief.",
        thinkingSteps: [
          "Wat is het schaarse middel in dit verhaal?",
          "Welke alternatieve bestemmingen zijn er voor dit middel?",
          "Wat is van elk alternatief de opbrengst?",
        ],
        answerLines: 6,
        antwoord: [
          [{ text: "Schaars middel: ", bold: true }, { text: "gemeentelijk budget van €2.000.000." }],
          [{ text: "Stap 1 — alternatieven: ", bold: true }, { text: "fietsbrug, schoolrenovatie, stadspark." }],
          [{ text: "Stap 2 — opbrengsten:", bold: true }],
          "• Fietsbrug: €2.800.000",
          "• Schoolrenovatie: €3.200.000",
          "• Stadspark: €2.500.000",
        ],
        explanation:
          "Stap 1 en 2 klinken simpel, maar worden vaak overgeslagen. Zonder expliciete alternatieven-lijst en opbrengsten kun je géén alternatieve kosten berekenen — dus zet ze altijd eerst op papier.",
      },
      {
        label: "Vraag 6b — Stap 3 van economisch denken: rangschik en bepaal alternatieve kosten",
        vraagText:
          "Stel dat de gemeente kiest voor de schoolrenovatie. Rangschik de alternatieven, bepaal het beste niet-gekozen alternatief en benoem daarmee de alternatieve kosten.",
        thinkingSteps: [
          "Rangschik de drie opbrengsten van hoog naar laag.",
          "Haal het gekozen alternatief eruit.",
          "Het resterende hoogste = beste niet-gekozen = alternatieve kosten.",
        ],
        formulaReminder: [
          "alternatieve kosten = opbrengst beste niet-gekozen alternatief",
        ],
        invulformaat: [
          "Rangschikking: 1. .........  2. .........  3. .........",
          "Gekozen: .........",
          "Beste niet-gekozen: ......... (€.........)",
          "Alternatieve kosten: €.........",
        ],
        antwoord: [
          "Rangschikking: 1. Schoolrenovatie €3,2 mln  2. Fietsbrug €2,8 mln  3. Stadspark €2,5 mln.",
          "Gekozen: schoolrenovatie (€3,2 mln).",
          "Beste niet-gekozen: fietsbrug (€2,8 mln > €2,5 mln).",
          [{ text: "Alternatieve kosten = €2.800.000", bold: true }, { text: " (de maatschappelijke opbrengst van de fietsbrug die de gemeente misloopt)." }],
        ],
        explanation:
          "Niet optellen: de alternatieve kosten zijn NIET €2,8 + €2,5 mln. De gemeente kon immers maar één plan kiezen, dus ze mist maar één alternatief: het beste van de niet-gekozen plannen.",
      },
      {
        label: "Vraag 6c — Stap 4 van economisch denken: nettowaarde en advies",
        vraagText:
          "Pas stap 4 toe: vergelijk de opbrengst van het gekozen alternatief met de alternatieve kosten. Wat is de nettowaarde van de keuze? En welk advies zou je de wethouder geven op basis van deze berekening?",
        thinkingSteps: [
          "Nettowaarde = opbrengst gekozen − alternatieve kosten.",
          "Beoordeel: is de nettowaarde positief of negatief?",
          "Positief → economisch verstandige keuze. Negatief → een ander alternatief was beter.",
        ],
        formulaReminder: [
          "nettowaarde = opbrengst gekozen − alternatieve kosten",
        ],
        answerLines: 5,
        antwoord: [
          "Nettowaarde = €3.200.000 − €2.800.000 = €400.000.",
          [{ text: "Nettowaarde = +€400.000.", bold: true }],
          [{ text: "Advies: ", bold: true }, { text: "de schoolrenovatie is de economisch verstandigste keuze. De opbrengst overtreft de alternatieve kosten met €400.000. Elk ander plan zou een negatieve nettowaarde opleveren ten opzichte van de schoolrenovatie." }],
        ],
        explanation:
          "Stap 4 geeft de wethouder een onderbouwd advies — niet gebaseerd op voorkeur, maar op een vergelijking van de beste opbrengst met het beste alternatief. Dit is de kern van economisch denken: beslissen op basis van alternatieve kosten, niet alleen op absolute opbrengst.",
      },
      {
        label: "Vraag 6d — Kritische reflectie",
        vraagText:
          "De wethouder zegt tegen de gemeenteraad: 'De schoolrenovatie kost ons niets, want we krijgen er €3,2 miljoen aan maatschappelijke waarde voor terug.' Leg met behulp van het begrip alternatieve kosten uit waarom deze uitspraak economisch onjuist is.",
        thinkingSteps: [
          "Wat kost de gemeente echt bij deze keuze?",
          "Denk aan wat ze niet kunnen doen met hetzelfde geld.",
          "Zijn alternatieve kosten ook 'echte' kosten, ook al worden ze niet uitbetaald?",
        ],
        hint: "Denk terug aan de definitie: alternatieve kosten = opbrengst van het beste alternatief dat je opgeeft.",
        answerLines: 5,
        antwoord: [
          "De uitspraak is onjuist: de schoolrenovatie kost de gemeente wel degelijk iets — namelijk de alternatieve kosten.",
          "Door voor de schoolrenovatie te kiezen, geeft de gemeente de fietsbrug op. Die fietsbrug zou €2.800.000 aan maatschappelijke waarde hebben opgeleverd.",
          [{ text: "De 'echte' kosten van de schoolrenovatie zijn €2.800.000 aan gemiste brug-waarde ", bold: true }, { text: "— bovenop de €2 miljoen aan uitgegeven geld." }],
          "De keuze is nog steeds verstandig (nettowaarde +€400.000), maar 'kost ons niets' klopt niet: elk gekozen alternatief kost wat je opgeeft.",
        ],
        explanation:
          "Dit is een klassieke politieke drogreden: alleen kijken naar directe uitgaven versus opbrengsten, zonder de waarde van wat je opgeeft mee te rekenen. Een econoom rekent alternatieve kosten altijd mee — ook als er geen factuur voor binnenkomt.",
      },
    ],
  },
];

// ── SAMENVATTEND SCHEMA ──
const samenvattendSchema = [
  ["Schaarste", "Behoefte > middel → er moet gekozen worden. Geldt voor scholier, boer én overheid."],
  ["Schaarste ≠ weinig", "Het gaat om de verhouding behoefte ÷ middel, niet om absolute aantallen."],
  ["Alternatieve kosten", "Opbrengst van het beste alternatief dat je opgeeft bij een keuze."],
  ["Geen som", "Alternatieve kosten zijn NOOIT de som van alle niet-gekozen opties — alleen de beste."],
  ["Opbrengst schaars middel", "TO = aantal eenheden × opbrengst per eenheid (q × o)."],
  ["Nettowaarde keuze", "opbrengst gekozen − alternatieve kosten. Positief = verstandige keuze."],
  ["Economisch denken (4 stappen)", "1) Alternatieven benoemen  2) Opbrengst per alternatief  3) Beste niet-gekozen = alternatieve kosten  4) Nettowaarde bepalen."],
];

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════

async function main() {
  console.log("Building begeleide inoefening for 1.1.1 Schaarste en economisch denken...\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`  Created directory: ${OUTPUT_DIR}`);
  }

  // Sanity-check scaffold images
  for (const [label, img] of [["fig_2", IMG_FIG_2], ["we_1", IMG_WE_1]]) {
    if (!fs.existsSync(img.path)) {
      console.warn(`  WARNING: scaffold image ${label} missing at ${img.path}`);
    } else {
      console.log(`  OK: scaffold image ${label} found (${img.path})`);
    }
  }

  const vragenBuf = await buildBegeleideInoefening(
    PARAGRAAF_NR, ONDERWERP, HEADER_TEXT, oefeningen, samenvattendSchema, false
  );
  const answersBuf = await buildBegeleideInoefening(
    PARAGRAAF_NR, ONDERWERP, HEADER_TEXT, oefeningen, samenvattendSchema, true
  );

  const vragenPath = path.join(
    OUTPUT_DIR,
    "1.1.1 Schaarste en economisch denken – begeleide inoefening – vragen.docx"
  );
  const answersPath = path.join(
    OUTPUT_DIR,
    "1.1.1 Schaarste en economisch denken – begeleide inoefening – antwoorden.docx"
  );

  fs.writeFileSync(vragenPath, vragenBuf);
  fs.writeFileSync(answersPath, answersBuf);

  console.log(`\n  Vragen:      ${vragenPath} (${(vragenBuf.length / 1024).toFixed(0)} KB)`);
  console.log(`  Antwoorden:  ${answersPath} (${(answersBuf.length / 1024).toFixed(0)} KB)`);
  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
