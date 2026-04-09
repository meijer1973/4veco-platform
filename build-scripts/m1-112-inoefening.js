/**
 * m1-112-inoefening.js
 * Begeleide inoefening for 1.1.2 Kiezen of delen (Budgetlijnen).
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-112-inoefening.js
 */
const fs = require("fs");
const path = require("path");
const {
  buildBegeleideInoefeningSplit,
} = require("./lib-begeleide-inoefening.js");

const PARAGRAAF_NR = "1.1.2";
const ONDERWERP = "Kiezen of delen";
const HEADER_TEXT = "Paragraaf 1.1.2 Kiezen of delen";
const ASSETS_DIR = path.resolve(__dirname,
  "../../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.2 Paragraaf 2 - Kiezen of delen/_assets"
);
const OUTPUT_DIR = path.resolve(__dirname,
  "../../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.2 Paragraaf 2 - Kiezen of delen/3. Oefenen/begeleide inoefening"
);

// ====================================================================
// OEFENINGEN
// ====================================================================

const oefeningen = [
  // Oefening 1: Budgetvergelijking opstellen
  {
    nr: 1,
    title: "Budgetvergelijking opstellen",
    domain: "markt",
    introText:
      "Een consument heeft een budget (B) van €48. Hij kan twee goederen kopen: goed 1 kost €4 per stuk (p₁ = 4) en goed 2 kost €8 per stuk (p₂ = 8).",
    deelvragen: [
      {
        label: "Vraag 1a — Budgetvergelijking",
        vraagText: "Stel de budgetvergelijking op voor deze consument.",
        denkstappen: [
          "De budgetvergelijking luidt: p₁ · q₁ + p₂ · q₂ = B",
          "Vul de gegeven waarden in voor p₁, p₂ en B",
        ],
        hint: "De budgetvergelijking geeft alle combinaties van q₁ en q₂ waarvoor de consument precies zijn hele budget uitgeeft.",
        formuleHerinnering: ["Budgetvergelijking: p₁ · q₁ + p₂ · q₂ = B"],
        answerLines: 3,
        antwoord: [
          "Budgetvergelijking: p₁ · q₁ + p₂ · q₂ = B",
          [{ text: "Invullen: 4 · q₁ + 8 · q₂ = 48", bold: true }],
        ],
        uitleg: "De budgetvergelijking laat zien hoeveel je maximaal kunt kopen als je je hele budget besteedt. Elke combinatie (q₁, q₂) die aan deze vergelijking voldoet, ligt op de budgetlijn.",
      },
      {
        label: "Vraag 1b — Combinaties controleren",
        vraagText: "Controleer of de combinatie q₁ = 6, q₂ = 3 op de budgetlijn ligt.",
        denkstappen: [
          "Vul q₁ = 6 en q₂ = 3 in de budgetvergelijking in",
          "Kijk of de uitkomst gelijk is aan B = 48",
        ],
        answerLines: 3,
        antwoord: [
          "4 · 6 + 8 · 3 = 24 + 24 = 48 ✓",
          [{ text: "Ja, deze combinatie ligt precies op de budgetlijn.", bold: true }],
        ],
        uitleg: "Als de uitkomst gelijk is aan B, dan ligt het punt op de budgetlijn. Is het kleiner, dan houdt de consument geld over (punt onder de lijn). Is het groter, dan is het niet betaalbaar (punt boven de lijn).",
      },
    ],
  },

  // Oefening 2: Snijpunten met de assen
  {
    nr: 2,
    title: "Snijpunten met de assen berekenen",
    domain: "markt",
    introText:
      "Een consument heeft een budget van €120. De prijs van goed 1 is €10 (p₁ = 10) en de prijs van goed 2 is €20 (p₂ = 20).",
    deelvragen: [
      {
        label: "Vraag 2a — Snijpunt met de q₁-as",
        vraagText: "Bereken het snijpunt van de budgetlijn met de q₁-as (horizontale as).",
        denkstappen: [
          "Op de q₁-as geldt: q₂ = 0 (je koopt alleen goed 1)",
          "Vul q₂ = 0 in de budgetvergelijking in en los q₁ op",
        ],
        hint: "Het snijpunt met de q₁-as vind je door q₂ = 0 te stellen: q₁ = B / p₁.",
        formuleHerinnering: ["Snijpunt q₁-as: q₁ = B / p₁", "Snijpunt q₂-as: q₂ = B / p₂"],
        invulformaat: [
          "q₂ = 0, dus: p₁ · q₁ = B",
          "10 · q₁ = 120",
          "q₁ = ........",
        ],
        answerLines: 4,
        antwoord: [
          "q₂ = 0, dus: 10 · q₁ = 120",
          [{ text: "q₁ = 120 / 10 = 12", bold: true }],
          "Snijpunt met de q₁-as: (12, 0) — de consument kan maximaal 12 stuks van goed 1 kopen.",
        ],
        uitleg: "Dit snijpunt geeft het maximum aantal van goed 1 dat de consument kan kopen als hij niets van goed 2 koopt.",
      },
      {
        label: "Vraag 2b — Snijpunt met de q₂-as",
        vraagText: "Bereken het snijpunt van de budgetlijn met de q₂-as (verticale as).",
        denkstappen: [
          "Op de q₂-as geldt: q₁ = 0 (je koopt alleen goed 2)",
          "Vul q₁ = 0 in de budgetvergelijking in en los q₂ op",
        ],
        invulformaat: [
          "q₁ = 0, dus: p₂ · q₂ = B",
          "20 · q₂ = 120",
          "q₂ = ........",
        ],
        answerLines: 4,
        antwoord: [
          "q₁ = 0, dus: 20 · q₂ = 120",
          [{ text: "q₂ = 120 / 20 = 6", bold: true }],
          "Snijpunt met de q₂-as: (0, 6) — de consument kan maximaal 6 stuks van goed 2 kopen.",
        ],
        uitleg: "Met de twee snijpunten (12, 0) en (0, 6) kun je de budgetlijn tekenen als een rechte lijn.",
      },
    ],
  },

  // Oefening 3: Budgetlijn tekenen (beschrijving)
  {
    nr: 3,
    title: "Budgetlijn tekenen",
    domain: "markt",
    introText:
      "Een consument heeft een budget van €60. Goed 1 kost €5 per stuk (p₁ = 5) en goed 2 kost €15 per stuk (p₂ = 15).",
    deelvragen: [
      {
        label: "Vraag 3a — Snijpunten bepalen",
        vraagText: "Bereken de twee snijpunten met de assen.",
        denkstappen: [
          "Snijpunt q₁-as: stel q₂ = 0 → q₁ = B / p₁",
          "Snijpunt q₂-as: stel q₁ = 0 → q₂ = B / p₂",
        ],
        formuleHerinnering: ["q₁ = B / p₁", "q₂ = B / p₂"],
        answerLines: 4,
        antwoord: [
          [{ text: "Snijpunt q₁-as: ", bold: true }, { text: "q₁ = 60 / 5 = 12 → punt (12, 0)" }],
          [{ text: "Snijpunt q₂-as: ", bold: true }, { text: "q₂ = 60 / 15 = 4 → punt (0, 4)" }],
        ],
      },
      {
        label: "Vraag 3b — Beschrijf de budgetlijn",
        vraagText: "Beschrijf hoe je de budgetlijn tekent in een assenstelsel. Wat zet je op elke as en welke punten verbind je?",
        denkstappen: [
          "Kies welk goed op welke as komt",
          "Zet de snijpunten in het assenstelsel",
          "Trek een rechte lijn tussen de snijpunten",
        ],
        hint: "Conventie: q₁ op de horizontale as, q₂ op de verticale as.",
        answerLines: 5,
        antwoord: [
          "Horizontale as (x-as): hoeveelheid goed 1 (q₁), schaal 0 tot 12.",
          "Verticale as (y-as): hoeveelheid goed 2 (q₂), schaal 0 tot 4.",
          "Teken punt A (12, 0) op de q₁-as en punt B (0, 4) op de q₂-as.",
          [{ text: "Verbind A en B met een rechte lijn: dit is de budgetlijn.", bold: true }],
          "Alle punten op de lijn zijn combinaties waarvoor de consument precies €60 uitgeeft.",
        ],
        afterAnswerImage: { path: path.join(ASSETS_DIR, 'budgetlijn-basis.png'), width: 450, height: 225 },
        uitleg: "De budgetlijn is altijd een rechte lijn (lineair). De helling is −p₁/p₂ = −5/15 = −⅓. Dit betekent: voor elk extra goed 1 moet je ⅓ goed 2 opgeven.",
      },
    ],
  },

  // Oefening 4: Budgetstijging — evenwijdige verschuiving
  {
    nr: 4,
    title: "Budgetstijging en evenwijdige verschuiving",
    domain: "markt",
    introText:
      "Een consument heeft aanvankelijk een budget van €48, met p₁ = 4 en p₂ = 8. Zijn budget stijgt van €48 naar €72 (bijvoorbeeld door een loonsverhoging). De prijzen blijven gelijk.",
    deelvragen: [
      {
        label: "Vraag 4a — Oude en nieuwe snijpunten",
        vraagText: "Bereken de snijpunten met de assen voor zowel het oude als het nieuwe budget.",
        denkstappen: [
          "Bereken eerst de snijpunten bij B = 48",
          "Bereken daarna de snijpunten bij B = 72",
          "Vergelijk de uitkomsten",
        ],
        formuleHerinnering: ["q₁ = B / p₁", "q₂ = B / p₂"],
        invulformaat: [
          "Oud (B = 48):  q₁ = 48/4 = ........   q₂ = 48/8 = ........",
          "Nieuw (B = 72): q₁ = 72/4 = ........   q₂ = 72/8 = ........",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Oud (B = 48): ", bold: true }, { text: "q₁ = 48/4 = 12, q₂ = 48/8 = 6 → snijpunten (12, 0) en (0, 6)" }],
          [{ text: "Nieuw (B = 72): ", bold: true }, { text: "q₁ = 72/4 = 18, q₂ = 72/8 = 9 → snijpunten (18, 0) en (0, 9)" }],
        ],
      },
      {
        label: "Vraag 4b — Beschrijf de verschuiving",
        vraagText: "Beschrijf wat er met de budgetlijn gebeurt als het budget stijgt van €48 naar €72.",
        denkstappen: [
          "Veranderen de prijzen? (nee → de helling blijft gelijk)",
          "Wat verandert er wel? (het budget → de lijn schuift)",
          "In welke richting schuift de lijn?",
        ],
        hint: "Als alleen het budget verandert (en de prijzen niet), dan verschuift de budgetlijn evenwijdig.",
        answerLines: 4,
        antwoord: [
          [{ text: "De budgetlijn verschuift evenwijdig naar rechts/boven.", bold: true }],
          "De helling (−p₁/p₂ = −4/8 = −½) verandert niet, want de prijzen zijn gelijk gebleven.",
          "De consument kan nu van beide goederen méér kopen: de koopkracht is gestegen.",
        ],
        afterAnswerImage: { path: path.join(ASSETS_DIR, 'budgetlijn-verschuiving.png'), width: 450, height: 225 },
        uitleg: "Bij een inkomensstijging verschuift de budgetlijn evenwijdig naar buiten. Bij een inkomensdaling schuift hij naar binnen. De richting (helling) van de lijn verandert niet, want die hangt alleen af van de prijsverhouding p₁/p₂.",
      },
    ],
  },

  // Oefening 5: Prijsdaling — kantelen van de budgetlijn
  {
    nr: 5,
    title: "Prijsdaling en kantelen van de budgetlijn",
    domain: "markt",
    introText:
      "Een consument heeft een budget van €100. De prijs van goed 1 daalt van €10 naar €5. De prijs van goed 2 blijft €20.",
    deelvragen: [
      {
        label: "Vraag 5a — Oude en nieuwe snijpunten",
        vraagText: "Bereken de snijpunten met de assen voor de oude én de nieuwe situatie.",
        denkstappen: [
          "Bij de oude situatie: p₁ = 10, p₂ = 20, B = 100",
          "Bij de nieuwe situatie: p₁ = 5, p₂ = 20, B = 100",
          "Welk snijpunt verandert en welk niet?",
        ],
        formuleHerinnering: ["q₁ = B / p₁", "q₂ = B / p₂"],
        invulformaat: [
          "Oud:   q₁ = 100/10 = ........   q₂ = 100/20 = ........",
          "Nieuw: q₁ = 100/5  = ........   q₂ = 100/20 = ........",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Oud: ", bold: true }, { text: "q₁ = 100/10 = 10, q₂ = 100/20 = 5 → snijpunten (10, 0) en (0, 5)" }],
          [{ text: "Nieuw: ", bold: true }, { text: "q₁ = 100/5 = 20, q₂ = 100/20 = 5 → snijpunten (20, 0) en (0, 5)" }],
        ],
      },
      {
        label: "Vraag 5b — Wat gebeurt er met de budgetlijn?",
        vraagText: "Beschrijf wat er met de budgetlijn gebeurt als de prijs van goed 1 daalt.",
        denkstappen: [
          "Welk snijpunt is veranderd? Welk niet?",
          "Wat betekent dat voor de vorm van de verschuiving?",
          "Is dit een evenwijdige verschuiving of iets anders?",
        ],
        hint: "Als één prijs verandert, verandert maar één snijpunt. De lijn draait (kantelt) rond het andere snijpunt.",
        answerLines: 5,
        antwoord: [
          "Het snijpunt met de q₂-as (0, 5) is niet veranderd: als je alleen goed 2 koopt, maakt de prijs van goed 1 niet uit.",
          "Het snijpunt met de q₁-as is verschoven van (10, 0) naar (20, 0): je kunt nu meer van goed 1 kopen.",
          [{ text: "De budgetlijn kantelt naar buiten vanuit het snijpunt (0, 5) op de q₂-as.", bold: true }],
          "De helling verandert: van −10/20 = −½ naar −5/20 = −¼. Goed 1 is relatief goedkoper geworden.",
        ],
        afterAnswerImage: { path: path.join(ASSETS_DIR, 'budgetlijn-prijseffect.png'), width: 450, height: 225 },
        uitleg: "Bij een prijsverandering kantelt de budgetlijn. Het snijpunt van het goed waarvan de prijs verandert, verschuift. Het andere snijpunt blijft op zijn plaats. Bij een prijsdaling kantelt de lijn naar buiten; bij een prijsstijging naar binnen.",
      },
    ],
  },

  // Oefening 6: Werken en budget
  {
    nr: 6,
    title: "Werken voor je budget",
    domain: "markt",
    introText:
      "Sophie wil een nieuw budget van €120 bij elkaar werken. Haar uurloon is €15.",
    deelvragen: [
      {
        label: "Vraag 6a — Benodigde werkuren",
        vraagText: "Bereken hoeveel uur Sophie moet werken om een budget van €120 te hebben.",
        denkstappen: [
          "Budget = uurloon × aantal uren",
          "Los het aantal uren op",
        ],
        formuleHerinnering: ["Aantal uren = Budget / uurloon"],
        invulformaat: [
          "Aantal uren = €120 / €15 = ........",
        ],
        answerLines: 2,
        antwoord: [
          [{ text: "Aantal uren = €120 / €15 = 8 uur", bold: true }],
        ],
        uitleg: "Sophie moet 8 uur werken voor een budget van €120. Die 8 uur kan ze niet aan iets anders besteden — dat zijn de opofferingskosten in tijd.",
      },
      {
        label: "Vraag 6b — Opofferingskosten in tijd",
        vraagText: "Sophie koopt een boek van €45 van haar verdiende budget. Bereken hoeveel uur ze hiervoor heeft moeten werken.",
        denkstappen: [
          "Prijs van het boek = €45",
          "Uurloon = €15",
          "Hoeveel uur werken staat gelijk aan €45?",
        ],
        answerLines: 3,
        antwoord: [
          "Aantal uren voor het boek = €45 / €15 = 3 uur",
          [{ text: "Sophie heeft 3 uur van haar vrije tijd opgegeven voor het boek.", bold: true }],
          "De opofferingskosten van het boek zijn 3 uur vrije tijd.",
        ],
        uitleg: "Je kunt de prijs van goederen ook uitdrukken in tijd. Dit maakt de opofferingskosten tastbaar: het boek 'kost' 3 uur van Sophies leven.",
      },
    ],
  },

  // Oefening 7: Twee situaties vergelijken — opofferingskosten
  {
    nr: 7,
    title: "Opofferingskosten van vrije tijd vergelijken",
    domain: "markt",
    introText:
      "Mark kan kiezen tussen twee bijbanen:\n• Bijbaan A: uurloon €10\n• Bijbaan B: uurloon €12\nMark heeft per week 20 uur die hij kan besteden aan werken of vrije tijd.",
    deelvragen: [
      {
        label: "Vraag 7a — Opofferingskosten van vrije tijd",
        vraagText: "Bereken de opofferingskosten van 2 uur vrije tijd bij bijbaan A en bij bijbaan B.",
        denkstappen: [
          "Wat geeft Mark op als hij 2 uur vrije tijd neemt in plaats van te werken?",
          "Bereken het misgelopen loon voor beide bijbanen",
        ],
        formuleHerinnering: ["Opofferingskosten vrije tijd = misgelopen uren × uurloon"],
        invulformaat: [
          "Bijbaan A: 2 uur × €10 = €........",
          "Bijbaan B: 2 uur × €12 = €........",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Bijbaan A: ", bold: true }, { text: "opofferingskosten = 2 × €10 = €20" }],
          [{ text: "Bijbaan B: ", bold: true }, { text: "opofferingskosten = 2 × €12 = €24" }],
        ],
      },
      {
        label: "Vraag 7b — Vergelijking",
        vraagText: "Bij welke bijbaan zijn de opofferingskosten van vrije tijd hoger? Leg uit waarom.",
        denkstappen: [
          "Vergelijk de opofferingskosten uit vraag 7a",
          "Wat is de relatie tussen uurloon en opofferingskosten van vrije tijd?",
        ],
        answerLines: 4,
        antwoord: [
          [{ text: "Bij bijbaan B zijn de opofferingskosten hoger (€24 > €20).", bold: true }],
          "Hoe hoger het uurloon, hoe meer je misloopt als je niet werkt.",
          "De opofferingskosten van vrije tijd stijgen dus met het uurloon: vrije tijd wordt 'duurder' naarmate je meer kunt verdienen.",
        ],
        uitleg: "Dit is een belangrijk economisch inzicht: mensen met een hoger uurloon hebben hogere opofferingskosten van vrije tijd. Dat verklaart waarom hoogbetaalden soms minder vrije tijd nemen — de 'prijs' van hun vrije tijd is hoger.",
      },
      {
        label: "Vraag 7c — Budgetvergelijking met arbeid-vrije-tijd",
        vraagText: "Mark kiest bijbaan B (€12/uur) en werkt 14 uur. Bereken zijn weekbudget en het aantal uren vrije tijd.",
        denkstappen: [
          "Weekbudget = uurloon × gewerkte uren",
          "Vrije tijd = beschikbare uren − gewerkte uren",
        ],
        invulformaat: [
          "Weekbudget = ........ × ........ = €........",
          "Vrije tijd = ........ − ........ = ........ uur",
        ],
        answerLines: 3,
        antwoord: [
          [{ text: "Weekbudget = 14 × €12 = €168", bold: true }],
          [{ text: "Vrije tijd = 20 − 14 = 6 uur", bold: true }],
          "Mark ruilt 14 uur vrije tijd in voor €168 inkomen. De opofferingskosten van die €168 zijn 14 uur vrije tijd.",
        ],
        uitleg: "De keuze tussen werken en vrije tijd is een budgetlijnprobleem: op de ene as staat inkomen (€), op de andere as vrije tijd (uren). Meer werken = meer geld, maar minder vrije tijd.",
      },
    ],
  },
];

const samenvattendSchema = [
  ["Budgetvergelijking", "p₁ · q₁ + p₂ · q₂ = B"],
  ["Snijpunten", "q₁-as: B / p₁  |  q₂-as: B / p₂"],
  ["Helling budgetlijn", "−p₁ / p₂ (prijsverhouding)"],
  ["Evenwijdige verschuiving", "Budget verandert, prijzen niet → lijn schuift evenwijdig"],
  ["Kantelen", "Eén prijs verandert → lijn draait rond het andere snijpunt"],
  ["Opofferingskosten", "Wat je opgeeft (in geld of tijd) voor je keuze"],
];

// ====================================================================
// BUILD
// ====================================================================

async function main() {
  console.log("Building begeleide inoefening for 1.1.2 Kiezen of delen...\n");

  await buildBegeleideInoefeningSplit(
    PARAGRAAF_NR, ONDERWERP, HEADER_TEXT, oefeningen, samenvattendSchema, OUTPUT_DIR
  );

  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
