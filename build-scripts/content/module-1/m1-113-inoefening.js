/**
 * m1-113-inoefening.js
 * Begeleide inoefening for 1.1.3 Toepassen (Chapter 1 review).
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-113-inoefening.js
 */
const fs = require("fs");
const path = require("path");
const {
  buildBegeleideInoefeningSplit,
} = require("../../lib/lib-begeleide-inoefening.js");

const PARAGRAAF_NR = "1.1.3";
const ONDERWERP = "Toepassen";
const HEADER_TEXT = "Paragraaf 1.1.3 Toepassen";
const ASSETS_DIR = path.resolve(__dirname,
  "../../../../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/_assets"
);
const OUTPUT_DIR = path.resolve(__dirname,
  "../../../../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/3. Oefenen/begeleide inoefening"
);

// ====================================================================
// OEFENINGEN
// ====================================================================

const oefeningen = [
  // Oefening 1: Schaarste herkennen (water context)
  {
    nr: 1,
    title: "Schaarste herkennen",
    domain: "markt",
    introText:
      "In veel delen van de wereld is er een tekort aan schoon drinkwater. Tegelijkertijd verbruikt de kledingindustrie enorme hoeveelheden water: voor \u00e9\u00e9n katoenen T-shirt is 2.700 liter water nodig. Boeren, fabrieken en huishoudens concurreren om hetzelfde water.",
    deelvragen: [
      {
        label: "Vraag 1a \u2014 Schaarste identificeren",
        vraagText: "Leg uit waarom water in deze situatie een schaars goed is. Gebruik het begrip schaarste.",
        thinkingSteps: [
          "Wat is het schaarse middel?",
          "Welke behoeften concurreren om dit middel?",
          "Waarom is er een keuze nodig?",
        ],
        hint: "Schaarste = middelen beperkt ten opzichte van behoeften.",
        answerLines: 4,
        antwoord: [
          "Water is schaars omdat de beschikbare hoeveelheid schoon water beperkt is (middel), terwijl er meerdere concurrerende behoeften zijn: drinkwater, landbouw, industrie en textielproductie.",
          [{ text: "De behoeften overtreffen het aanbod, waardoor er gekozen moet worden hoe het water wordt verdeeld.", bold: true }],
        ],
        explanation: "Schaarste betekent niet dat iets zeldzaam is, maar dat de middelen beperkt zijn ten opzichte van de behoeften. Water is er wel, maar niet genoeg voor alle toepassingen.",
      },
      {
        label: "Vraag 1b \u2014 Gevolg van schaarste",
        vraagText: "Welke keuze moeten overheden en bedrijven maken als gevolg van de schaarste aan water?",
        thinkingSteps: [
          "Wie moet er kiezen?",
          "Waaruit moeten ze kiezen?",
        ],
        answerLines: 3,
        antwoord: [
          "Overheden moeten water verdelen over drinkwater, landbouw en industrie.",
          "Bedrijven moeten kiezen tussen waterintensieve productie (katoen) of alternatieven (polyester, recycling).",
          [{ text: "Elke keuze heeft opofferingskosten: water dat naar textiel gaat, kan niet naar landbouw.", bold: true }],
        ],
        explanation: "Schaarste dwingt tot keuzes. De opofferingskosten van watergebruik in de textielindustrie zijn het water dat niet beschikbaar is voor andere toepassingen.",
      },
    ],
  },

  // Oefening 2: Opofferingskosten berekenen (Sophie profiel)
  {
    nr: 2,
    title: "Opofferingskosten berekenen",
    domain: "markt",
    introText:
      "Sophie heeft een bijbaan met een uurloon van \u20AC15. Ze heeft per week 20 uur beschikbaar voor werken of vrije tijd. Deze week moet ze kiezen: 4 uur extra werken of 4 uur vrije tijd om te sporten.",
    deelvragen: [
      {
        label: "Vraag 2a \u2014 Opofferingskosten in geld",
        vraagText: "Bereken de opofferingskosten van 4 uur vrije tijd (sporten) voor Sophie.",
        thinkingSteps: [
          "Wat geeft Sophie op als ze 4 uur niet werkt?",
          "Bereken het misgelopen inkomen",
        ],
        formulaReminder: ["Opofferingskosten vrije tijd = misgelopen uren \u00D7 uurloon"],
        invulformaat: [
          "Opofferingskosten = ........ uur \u00D7 \u20AC........ = \u20AC........",
        ],
        answerLines: 3,
        antwoord: [
          [{ text: "Opofferingskosten = 4 uur \u00D7 \u20AC15 = \u20AC60", bold: true }],
          "Sophie mist \u20AC60 aan inkomen door te kiezen voor vrije tijd.",
        ],
        explanation: "De opofferingskosten zijn het inkomen dat Sophie misloopt. Het uurloon is de 'prijs' van vrije tijd.",
      },
      {
        label: "Vraag 2b \u2014 Nettobaten",
        vraagText: "Sophie waardeert 4 uur sporten op \u20AC80 (in termen van gezondheid en plezier). Bereken de nettobaten van haar keuze om te sporten.",
        thinkingSteps: [
          "Baten = waarde van sporten",
          "Kosten = opofferingskosten (misgelopen inkomen)",
          "Nettobaten = baten \u2212 kosten",
        ],
        formulaReminder: ["Nettobaten = baten \u2212 kosten"],
        answerLines: 3,
        antwoord: [
          "Baten sporten: \u20AC80. Kosten (opofferingskosten): \u20AC60.",
          [{ text: "Nettobaten = \u20AC80 \u2212 \u20AC60 = \u20AC20 (positief)", bold: true }],
          "Omdat de nettobaten positief zijn, is sporten een rationele keuze.",
        ],
        explanation: "Nettobaten helpen om te beoordelen of een keuze de moeite waard is. Positieve nettobaten betekenen dat de baten groter zijn dan de kosten.",
      },
    ],
  },

  // Oefening 3: Begrippen toepassen op tekst
  {
    nr: 3,
    title: "Begrippen toepassen op tekst",
    domain: "markt",
    introText:
      "Lees de volgende tekst: \"De gemeente heeft \u20AC2 miljoen beschikbaar voor het wijkbudget. Bewoners willen een nieuw speelplein (\u20AC1,5 miljoen), betere verlichting (\u20AC0,8 miljoen) en meer groen (\u20AC0,6 miljoen). Het totaal van de wensen is \u20AC2,9 miljoen.\"",
    deelvragen: [
      {
        label: "Vraag 3a \u2014 Schaarste",
        vraagText: "Leg uit waarom er in deze situatie sprake is van schaarste. Gebruik de drieslag: begrip \u2192 definitie \u2192 toepassing.",
        thinkingSteps: [
          "Noem het begrip en geef de definitie",
          "Koppel aan concrete feiten uit de tekst",
        ],
        hint: "Drieslag: (1) begrip noemen, (2) definitie geven, (3) toepassen op de casus.",
        answerLines: 5,
        antwoord: [
          [{ text: "Begrip: ", bold: true }, { text: "Schaarste" }],
          [{ text: "Definitie: ", bold: true }, { text: "Middelen zijn beperkt ten opzichte van behoeften." }],
          [{ text: "Toepassing: ", bold: true }, { text: "Het budget van \u20AC2 miljoen (middel) is niet voldoende om alle wensen van de bewoners (\u20AC2,9 miljoen aan behoeften) te vervullen. Er is \u20AC0,9 miljoen tekort, dus de gemeente moet kiezen." }],
        ],
        explanation: "De drieslag is een krachtige methode om begrippen correct toe te passen. Begin altijd met het begrip, dan de definitie, en koppel pas dan aan de casus.",
      },
      {
        label: "Vraag 3b \u2014 Opofferingskosten",
        vraagText: "De gemeente kiest voor het speelplein (\u20AC1,5 miljoen). Wat zijn de opofferingskosten van deze keuze?",
        thinkingSteps: [
          "Resterend budget na het speelplein?",
          "Welk alternatief is het beste dat wordt opgegeven?",
        ],
        answerLines: 4,
        antwoord: [
          "Na het speelplein: \u20AC2 miljoen \u2212 \u20AC1,5 miljoen = \u20AC0,5 miljoen resterend.",
          "Verlichting kost \u20AC0,8 miljoen en groen \u20AC0,6 miljoen \u2014 geen van beide past volledig.",
          [{ text: "Het beste gemiste alternatief is betere verlichting (\u20AC0,8 miljoen) \u2014 dit zijn de opofferingskosten.", bold: true }],
          "Met \u20AC0,5 miljoen rest kan alleen een deel van het groen (\u20AC0,5 van \u20AC0,6 miljoen) worden gerealiseerd.",
        ],
      },
    ],
  },

  // Oefening 4: Gecombineerde budgetverschuiving
  {
    nr: 4,
    title: "Gecombineerde budgetverschuiving",
    domain: "markt",
    introText:
      "Een consument heeft een budget van \u20AC200. Goed 1 kost \u20AC10 per stuk (p\u2081 = 10) en goed 2 kost \u20AC20 per stuk (p\u2082 = 20). Door een loonsverhoging stijgt het budget naar \u20AC240, maar tegelijkertijd stijgt de prijs van goed 1 naar \u20AC15.",
    deelvragen: [
      {
        label: "Vraag 4a \u2014 Oude en nieuwe snijpunten",
        vraagText: "Bereken de snijpunten met de assen voor de oude \u00e9n de nieuwe situatie.",
        thinkingSteps: [
          "Oud: B = 200, p\u2081 = 10, p\u2082 = 20",
          "Nieuw: B = 240, p\u2081 = 15, p\u2082 = 20",
          "Bereken q\u2081\u1D50\u1D43\u02E3 en q\u2082\u1D50\u1D43\u02E3 voor beide situaties",
        ],
        formulaReminder: ["q\u2081\u1D50\u1D43\u02E3 = B / p\u2081", "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082"],
        scaffoldImage: { path: path.join(ASSETS_DIR, 'budgetlijn-gecombineerd.png'), width: 400, height: 200 },
        invulformaat: [
          "Oud:   q\u2081 = 200/10 = ........   q\u2082 = 200/20 = ........",
          "Nieuw: q\u2081 = 240/15 = ........   q\u2082 = 240/20 = ........",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Oud: ", bold: true }, { text: "q\u2081 = 200/10 = 20, q\u2082 = 200/20 = 10 \u2192 snijpunten (20, 0) en (0, 10)" }],
          [{ text: "Nieuw: ", bold: true }, { text: "q\u2081 = 240/15 = 16, q\u2082 = 240/20 = 12 \u2192 snijpunten (16, 0) en (0, 12)" }],
        ],
        afterAnswerImage: { path: path.join(ASSETS_DIR, 'budgetlijn-gecombineerd.png'), width: 450, height: 225 },
      },
      {
        label: "Vraag 4b \u2014 Beschrijf de verschuiving",
        vraagText: "Is dit een evenwijdige verschuiving, een kanteling, of iets anders? Leg uit.",
        thinkingSteps: [
          "Zijn beide snijpunten veranderd?",
          "In dezelfde richting of tegengesteld?",
          "Wat veranderde er: budget, prijs, of beide?",
        ],
        answerLines: 5,
        antwoord: [
          "Het y-snijpunt steeg van 10 naar 12 (meer van goed 2 mogelijk door hoger budget).",
          "Het x-snijpunt daalde van 20 naar 16 (minder van goed 1 door prijsstijging).",
          [{ text: "Dit is een gecombineerde verschuiving: g\u00e9\u00e9n zuivere evenwijdige verschuiving en g\u00e9\u00e9n zuivere kanteling.", bold: true }],
          "Het budget steeg (zou evenwijdig naar buiten geven), maar de prijs van goed 1 steeg ook (kantelt naar binnen op de x-as). Het netto-effect verschilt per as.",
        ],
        explanation: "Bij een gecombineerde verschuiving veranderen beide snijpunten, maar niet per se in dezelfde richting. Bereken altijd beide nieuwe snijpunten apart.",
      },
    ],
  },

  // Oefening 5: Budgetlijn tekenen bij nieuwe situatie
  {
    nr: 5,
    title: "Budgetlijn tekenen bij nieuwe situatie",
    domain: "markt",
    introText:
      "Een gezin heeft een maandbudget van \u20AC600 voor boodschappen (p\u2081 = \u20AC10 per zak) en uitjes (p\u2082 = \u20AC50 per uitje). Door inflatie stijgt de prijs van boodschappen naar \u20AC12 per zak.",
    deelvragen: [
      {
        label: "Vraag 5a \u2014 Oude en nieuwe snijpunten",
        vraagText: "Bereken de snijpunten met de assen voor de oude \u00e9n de nieuwe situatie.",
        thinkingSteps: [
          "Oud: B = 600, p\u2081 = 10, p\u2082 = 50",
          "Nieuw: B = 600, p\u2081 = 12, p\u2082 = 50",
        ],
        formulaReminder: ["q\u2081\u1D50\u1D43\u02E3 = B / p\u2081", "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082"],
        scaffoldImage: { path: path.join(ASSETS_DIR, 'budgetlijn-gecombineerd.png'), width: 400, height: 200 },
        invulformaat: [
          "Oud:   q\u2081 = 600/10 = ........   q\u2082 = 600/50 = ........",
          "Nieuw: q\u2081 = 600/12 = ........   q\u2082 = 600/50 = ........",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Oud: ", bold: true }, { text: "q\u2081 = 600/10 = 60 zakken, q\u2082 = 600/50 = 12 uitjes \u2192 (60, 0) en (0, 12)" }],
          [{ text: "Nieuw: ", bold: true }, { text: "q\u2081 = 600/12 = 50 zakken, q\u2082 = 600/50 = 12 uitjes \u2192 (50, 0) en (0, 12)" }],
        ],
        afterAnswerImage: { path: path.join(ASSETS_DIR, 'budgetlijn-gecombineerd.png'), width: 450, height: 225 },
      },
      {
        label: "Vraag 5b \u2014 Type verschuiving",
        vraagText: "Beschrijf wat er met de budgetlijn gebeurt. Is het een kanteling of een evenwijdige verschuiving?",
        thinkingSteps: [
          "Welk snijpunt is veranderd?",
          "Welk snijpunt is gelijk gebleven?",
          "Wat veranderde er: budget of prijs?",
        ],
        answerLines: 4,
        antwoord: [
          "Het snijpunt met de q\u2082-as (0, 12) is niet veranderd.",
          "Het snijpunt met de q\u2081-as verschoof van (60, 0) naar (50, 0).",
          [{ text: "De budgetlijn kantelt naar binnen rond het snijpunt (0, 12) op de q\u2082-as.", bold: true }],
          "De prijs van goed 1 steeg, het budget en p\u2082 bleven gelijk \u2192 dit is een zuivere kanteling.",
        ],
        explanation: "Bij een prijsverandering van \u00e9\u00e9n goed kantelt de budgetlijn. Het snijpunt van het goed waarvan de prijs niet verandert, blijft op zijn plaats.",
      },
    ],
  },

  // Oefening 6: Arbeidsmarkt-analyse
  {
    nr: 6,
    title: "Arbeidsmarkt-analyse",
    domain: "markt",
    introText:
      "Mark heeft per week 40 uur beschikbaar voor werken of vrije tijd. Hij kan kiezen tussen twee bijbanen:\n\u2022 Bijbaan A: supermarkt, uurloon \u20AC12\n\u2022 Bijbaan B: bijles geven, uurloon \u20AC20 (max 15 uur per week)",
    deelvragen: [
      {
        label: "Vraag 6a \u2014 Opofferingskosten vergelijken",
        vraagText: "Bereken de opofferingskosten van 1 uur vrije tijd bij bijbaan A en bij bijbaan B.",
        thinkingSteps: [
          "Opofferingskosten van vrije tijd = misgelopen uurloon",
          "Vergelijk voor beide bijbanen",
        ],
        formulaReminder: ["Opofferingskosten vrije tijd = uurloon"],
        scaffoldImage: { path: path.join(ASSETS_DIR, 'arbeidsmarkt-vacatures.png'), width: 400, height: 200 },
        answerLines: 3,
        antwoord: [
          [{ text: "Bijbaan A: ", bold: true }, { text: "opofferingskosten = \u20AC12 per uur vrije tijd" }],
          [{ text: "Bijbaan B: ", bold: true }, { text: "opofferingskosten = \u20AC20 per uur vrije tijd" }],
          "Bij bijbaan B is vrije tijd 'duurder' omdat je meer inkomen misloopt.",
        ],
        afterAnswerImage: { path: path.join(ASSETS_DIR, 'arbeidsmarkt-vacatures.png'), width: 450, height: 225 },
      },
      {
        label: "Vraag 6b \u2014 Maximaal inkomen",
        vraagText: "Mark combineert beide banen: eerst 15 uur bijles, dan de rest in de supermarkt. Bereken zijn maximale weekinkomen als hij alle 40 uur werkt.",
        thinkingSteps: [
          "Bijles: 15 uur \u00D7 \u20AC20",
          "Supermarkt: resterende uren \u00D7 \u20AC12",
          "Totaal optellen",
        ],
        invulformaat: [
          "Bijles: 15 \u00D7 \u20AC20 = \u20AC........",
          "Supermarkt: ........ \u00D7 \u20AC12 = \u20AC........",
          "Totaal: \u20AC........",
        ],
        answerLines: 4,
        antwoord: [
          "Bijles: 15 \u00D7 \u20AC20 = \u20AC300",
          "Supermarkt: 25 \u00D7 \u20AC12 = \u20AC300",
          [{ text: "Maximaal weekinkomen = \u20AC300 + \u20AC300 = \u20AC600", bold: true }],
        ],
        explanation: "Door banen te combineren maximaliseert Mark zijn inkomen. De opofferingskosten van vrije tijd zijn niet constant: de eerste uren kosten \u20AC12 (supermarkt), maar na 25 uur kosten de volgende uren \u20AC20 (bijles).",
      },
    ],
  },

  // Oefening 7: Bron analyseren met begrippen
  {
    nr: 7,
    title: "Bron analyseren met begrippen",
    domain: "markt",
    introText:
      "Bron: \"Het aantal jongeren met een bijbaan is gedaald van 45% naar 38%. Tegelijkertijd is het gemiddelde uurloon van bijbanen gestegen van \u20AC9 naar \u20AC12. Experts wijzen op de krapte op de arbeidsmarkt: werkgevers bieden hogere lonen om jongeren te trekken.\" \u2014 NOS, 2025",
    deelvragen: [
      {
        label: "Vraag 7a \u2014 Schaarste herkennen",
        vraagText: "Leg uit welke vorm van schaarste in deze bron beschreven wordt.",
        thinkingSteps: [
          "Wat is het schaarse middel?",
          "Welke behoeften zijn er?",
          "Wie moet er kiezen?",
        ],
        answerLines: 4,
        antwoord: [
          "Er is schaarste op de arbeidsmarkt: het aanbod van jonge werknemers (middel) is beperkt ten opzichte van de vraag van werkgevers (behoefte).",
          [{ text: "Werkgevers moeten concurreren om jongeren \u2192 ze verhogen het uurloon om werknemers te trekken.", bold: true }],
        ],
        explanation: "Schaarste op de arbeidsmarkt betekent dat er meer vacatures zijn dan werknemers. Dit is het tegenovergestelde van de schaarste die consumenten ervaren bij hun budget.",
      },
      {
        label: "Vraag 7b \u2014 Opofferingskosten",
        vraagText: "Bereken hoeveel de opofferingskosten van 1 uur vrije tijd zijn gestegen voor jongeren met een bijbaan.",
        thinkingSteps: [
          "Oud uurloon = opofferingskosten vrije tijd (oud)",
          "Nieuw uurloon = opofferingskosten vrije tijd (nieuw)",
          "Bereken het verschil",
        ],
        answerLines: 3,
        antwoord: [
          "Oud: opofferingskosten = \u20AC9 per uur vrije tijd.",
          "Nieuw: opofferingskosten = \u20AC12 per uur vrije tijd.",
          [{ text: "Stijging: \u20AC12 \u2212 \u20AC9 = \u20AC3 per uur. Vrije tijd is \u20AC3 duurder geworden.", bold: true }],
        ],
      },
      {
        label: "Vraag 7c \u2014 Effect op budgetlijn",
        vraagText: "Beschrijf het effect van de loonverhoging op de budgetlijn (vrije tijd vs. inkomen) van jongeren. Welk type verschuiving is dit?",
        thinkingSteps: [
          "Wat verandert: het uurloon (= 'prijs' van vrije tijd)",
          "Wat blijft gelijk: het totaal beschikbare uren",
          "Is dit een kanteling of evenwijdige verschuiving?",
        ],
        answerLines: 5,
        antwoord: [
          "Het uurloon stijgt van \u20AC9 naar \u20AC12. Het maximum beschikbare uren blijft gelijk.",
          "Het snijpunt op de x-as (vrije tijd) blijft gelijk (bijv. 40 uur).",
          "Het snijpunt op de y-as (inkomen) stijgt: van 40\u00D7\u20AC9 = \u20AC360 naar 40\u00D7\u20AC12 = \u20AC480.",
          [{ text: "De budgetlijn kantelt omhoog rond het x-snijpunt. Vrije tijd wordt duurder.", bold: true }],
          "Dit is een kanteling, want de 'prijs' van vrije tijd (uurloon) verandert, terwijl het 'budget' (beschikbare uren) gelijk blijft.",
        ],
        explanation: "Op de arbeidsmarkt is het uurloon de 'prijs' van vrije tijd. Als het uurloon stijgt, kantelt de budgetlijn: je kunt per gewerkt uur meer verdienen, maar elk uur vrije tijd kost je ook meer.",
      },
    ],
  },
];

const samenvattendSchema = [
  ["Schaarste", "Middelen beperkt t.o.v. behoeften \u2192 keuzes nodig"],
  ["Opofferingskosten", "Waarde van het beste gemiste alternatief"],
  ["Nettobaten", "Baten \u2212 kosten \u2192 positief = rationele keuze"],
  ["Budgetlijn", "Alle haalbare combinaties: B = p\u2081q\u2081 + p\u2082q\u2082"],
  ["Verschuivingen", "Evenwijdig (budget) of kantelen (prijs) of gecombineerd"],
  ["Arbeidsmarkt", "Opofferingskosten vrije tijd = uurloon"],
  ["Drieslag", "Begrip \u2192 definitie \u2192 toepassing op casus"],
];

// ====================================================================
// BUILD
// ====================================================================

async function main() {
  console.log("Building begeleide inoefening for 1.1.3 Toepassen...\n");

  await buildBegeleideInoefeningSplit(
    PARAGRAAF_NR, ONDERWERP, HEADER_TEXT, oefeningen, samenvattendSchema, OUTPUT_DIR
  );

  console.log("\nDone!");
}

main().catch(err => { console.error("ERROR:", err); process.exit(1); });
