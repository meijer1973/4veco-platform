/**
 * inoefening-111-kiezen-is-kostbaar.js
 * Begeleide inoefening for 1.1.1 Kiezen is kostbaar.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-111-inoefening.js
 */
const fs = require("fs");
const path = require("path");
const {
  buildBegeleideInoefening,
} = require("./lib-begeleide-inoefening.js");

const PARAGRAAF_NR = "1.1.1";
const ONDERWERP = "Kiezen is kostbaar";
const HEADER_TEXT = "Paragraaf 1.1.1 Kiezen is kostbaar";
const OUTPUT_DIR = path.resolve(__dirname,
  "../../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.1 Paragraaf 1 - Kiezen is kostbaar/3. Oefenen/begeleide inoefening"
);

// ====================================================================
// OEFENINGEN
// ====================================================================

const oefeningen = [
  // Oefening 1: Schaarste herkennen
  {
    nr: 1,
    title: "Schaarste herkennen in het dagelijks leven",
    domain: "markt",
    introText:
      "Lisa is 16 jaar en heeft een bijbaan bij de Albert Heijn. Ze verdient \u20AC200 per maand. Ze wil graag een nieuwe telefoon (\u20AC400), een festivalkaartje (\u20AC80) en wil sparen voor haar rijbewijs (\u20AC2.000). Daarnaast heeft ze elke dag 4 uur vrije tijd na school.",
    deelvragen: [
      {
        label: "Vraag 1a \u2014 Schaarste identificeren",
        vraagText: "Leg uit waarom er bij Lisa sprake is van schaarste.",
        thinkingSteps: [
          "Wat zijn Lisa's behoeften (wensen)?",
          "Wat zijn haar middelen (geld en tijd)?",
          "Is er een verschil tussen behoeften en middelen?",
        ],
        hint: "Schaarste = behoeften > middelen. Noem zowel geld als tijd.",
        answerLines: 4,
        antwoord: [
          "Lisa heeft onbeperkte behoeften: telefoon (\u20AC400) + festival (\u20AC80) + rijbewijs (\u20AC2.000) = \u20AC2.480.",
          "Haar middelen zijn beperkt: \u20AC200 per maand inkomen en 4 uur vrije tijd per dag.",
          [{ text: "Conclusie: ", bold: true }, { text: "er is schaarste omdat haar behoeften (\u20AC2.480+) groter zijn dan haar middelen (\u20AC200/mnd). Ze kan niet alles tegelijk kopen." }],
        ],
        explanation: "Schaarste geldt voor iedereen \u2014 ook als je geld hebt. Het gaat om het verschil tussen wat je wilt en wat je kunt.",
      },
      {
        label: "Vraag 1b \u2014 Primair vs. secundair",
        vraagText: "Noem een primaire en een secundaire behoefte van Lisa.",
        thinkingSteps: [
          "Primair = noodzakelijk voor levensonderhoud",
          "Secundair = luxe, niet strikt noodzakelijk",
        ],
        answerLines: 3,
        antwoord: [
          [{ text: "Primair: ", bold: true }, { text: "eten, onderdak, vervoer naar school (niet expliciet in de tekst, maar noodzakelijk)" }],
          [{ text: "Secundair: ", bold: true }, { text: "nieuwe telefoon, festivalkaartje, rijbewijs \u2014 dit zijn luxebehoeften" }],
        ],
        explanation: "Het onderscheid primair/secundair kan per persoon en per cultuur verschillen, maar de kern is: kun je zonder overleven?",
      },
    ],
  },

  // Oefening 2: Alternatieve kosten
  {
    nr: 2,
    title: "Alternatieve kosten bepalen",
    domain: "markt",
    introText:
      "Tom heeft zaterdagmiddag 4 uur vrij. Hij kan kiezen uit drie activiteiten:\n\u2022 Optie A: Werken bij de supermarkt (\u20AC10/uur = \u20AC40 verdienen)\n\u2022 Optie B: Naar een voetbalwedstrijd (kaartje kost \u20AC25, plezierwaarde \u20AC60)\n\u2022 Optie C: Studeren voor een toets (geen geldkosten, toekomstige batenwaarde \u20AC50)",
    deelvragen: [
      {
        label: "Vraag 2a \u2014 Alternatieve kosten van werken",
        vraagText: "Tom kiest optie A (werken). Wat zijn de alternatieve kosten van deze keuze?",
        thinkingSteps: [
          "Welke opties geeft Tom op?",
          "Wat is de waarde van elke opgegeven optie?",
          "Welke opgegeven optie is het meest waard? (= alternatieve kosten)",
        ],
        hint: "Alternatieve kosten = waarde van het beste niet-gekozen alternatief. Tel alleen de netto-waarde.",
        answerLines: 4,
        antwoord: [
          "Opgegeven opties:",
          [{ text: "  Optie B: ", bold: true }, { text: "nettobaten = \u20AC60 (plezier) \u2212 \u20AC25 (kaartje) = \u20AC35" }],
          [{ text: "  Optie C: ", bold: true }, { text: "nettobaten = \u20AC50 \u2212 \u20AC0 = \u20AC50" }],
          [{ text: "Alternatieve kosten = \u20AC50", bold: true }, { text: " (optie C is het beste niet-gekozen alternatief)" }],
        ],
        explanation: "Je vergelijkt alleen de nettobaten van de niet-gekozen opties. Het beste alternatief (hoogste nettobaten) bepaalt de alternatieve kosten.",
      },
      {
        label: "Vraag 2b \u2014 Nettobaten berekenen",
        vraagText: "Bereken de nettobaten van Toms keuze (werken).",
        thinkingSteps: [
          "Baten van werken = \u20AC40",
          "Kosten van werken = directe kosten + alternatieve kosten",
          "Nettobaten = baten \u2212 totale kosten",
        ],
        formulaReminder: ["Nettobaten = Baten \u2212 (directe kosten + alternatieve kosten)"],
        invulformaat: [
          "Baten = \u20AC........",
          "Directe kosten = \u20AC........",
          "Alternatieve kosten = \u20AC........",
          "Nettobaten = \u20AC........ \u2212 (\u20AC........ + \u20AC........) = \u20AC........",
        ],
        antwoord: [
          "Baten = \u20AC40",
          "Directe kosten = \u20AC0",
          "Alternatieve kosten = \u20AC50 (studeren)",
          [{ text: "Nettobaten = \u20AC40 \u2212 (\u20AC0 + \u20AC50) = \u2212\u20AC10", bold: true }],
        ],
        explanation: "De nettobaten zijn negatief! Dat betekent dat werken eigenlijk niet de beste keuze is. Rationeel gezien zou Tom beter kunnen studeren (nettobaten = \u20AC50 \u2212 \u20AC40 = +\u20AC10).",
      },
    ],
  },

  // Oefening 3: Productiefactoren
  {
    nr: 3,
    title: "Productiefactoren herkennen",
    domain: "markt",
    introText:
      "Een bakkerij in Amsterdam bakt dagelijks 500 broden. De bakker (eigenaar) heeft twee medewerkers in dienst. Hij gebruikt een professionele oven, meel uit Canada en water uit de Amsterdamse waterleiding.",
    deelvragen: [
      {
        label: "Vraag 3a \u2014 Factoren benoemen",
        vraagText: "Benoem bij elk element in de tekst de bijbehorende productiefactor.",
        thinkingSteps: [
          "Arbeid = inzet van mensen",
          "Natuur = grondstoffen uit de natuur",
          "Kapitaal = machines en gebouwen",
          "Ondernemerschap = organiseren en risico nemen",
        ],
        answerLines: 5,
        antwoord: [
          [{ text: "Arbeid: ", bold: true }, { text: "twee medewerkers (en de bakker zelf als hij meebakt)" }],
          [{ text: "Natuur: ", bold: true }, { text: "meel (graan), water" }],
          [{ text: "Kapitaal: ", bold: true }, { text: "de professionele oven, het pand van de bakkerij" }],
          [{ text: "Ondernemerschap: ", bold: true }, { text: "de bakker als eigenaar \u2014 hij combineert de factoren en neemt het risico" }],
        ],
        explanation: "Let op: de bakker kan zowel arbeid leveren (brood bakken) als ondernemer zijn (beslissingen nemen). Dat zijn twee verschillende rollen.",
      },
      {
        label: "Vraag 3b \u2014 Kapitaal vs. geld",
        vraagText: "De bakker leent \u20AC50.000 bij de bank voor een nieuwe oven. Is dit bedrag een productiefactor? Leg uit.",
        thinkingSteps: [
          "Wat bedoelen economen met 'kapitaal'?",
          "Is geld hetzelfde als kapitaal?",
        ],
        answerLines: 3,
        antwoord: [
          "Nee, het geldbedrag (\u20AC50.000) is zelf geen productiefactor.",
          [{ text: "Geld is geen productiefactor ", bold: true }, { text: "\u2014 het is een ruilmiddel. De oven die hij ermee koopt is w\u00e9l kapitaal (een productiefactor)." }],
        ],
        explanation: "Dit is een veelgemaakte fout op het examen. Geld wordt gebruikt om productiefactoren te kopen, maar is zelf geen factor waarmee je iets produceert.",
      },
    ],
  },
];

const samenvattendSchema = [
  ["Schaarste", "Behoeften > middelen \u2192 je moet kiezen"],
  ["Alternatieve kosten", "Waarde van het beste niet-gekozen alternatief"],
  ["Nettobaten", "Baten \u2212 (directe kosten + alternatieve kosten)"],
  ["Productiefactoren", "Arbeid, natuur, kapitaal (niet geld!), ondernemerschap"],
  ["Rationeel kiezen", "Kies de optie met de hoogste nettobaten"],
];

// ====================================================================
// BUILD
// ====================================================================

async function main() {
  console.log("Building begeleide inoefening for 1.1.1 Kiezen is kostbaar...\n");

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

  const vragenPath = path.join(OUTPUT_DIR, "1.1.1 Kiezen is kostbaar \u2013 begeleide inoefening \u2013 vragen.docx");
  const answersPath = path.join(OUTPUT_DIR, "1.1.1 Kiezen is kostbaar \u2013 begeleide inoefening \u2013 antwoorden.docx");

  fs.writeFileSync(vragenPath, vragenBuf);
  fs.writeFileSync(answersPath, answersBuf);

  console.log(`  Vragen:      ${vragenPath} (${(vragenBuf.length / 1024).toFixed(0)} KB)`);
  console.log(`  Antwoorden:  ${answersPath} (${(answersBuf.length / 1024).toFixed(0)} KB)`);
  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
