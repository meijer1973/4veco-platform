/**
 * Semantic presentation model for the implemented section 1.1.3 web presentation.
 *
 * This deck transfers the graph/table learning objects from the 1.1.3 student-web
 * bundle into the reusable presentation-v2 renderer. The existing PPTX remains a
 * legacy secondary download and is not generated from this model in this pass.
 */

const PAR_NR = '1.1.3';
const PAR_NAME = 'Grafieken en tabellen';
const DASH = '\u2013';

const tableVisual = {
  type: 'table',
  id: 'slide_ice_table',
  title: 'IJsjesverkoop',
  headers: ['Prijs', 'Aantal verkocht'],
  rows: [
    [{ text: '\u20ac1,00', highlight: true }, { text: '500 ijsjes', highlight: true }],
    ['\u20ac1,50', '400 ijsjes'],
    [{ text: '\u20ac2,00', highlight: true }, { text: '300 ijsjes', highlight: true }],
    ['\u20ac2,50', '200 ijsjes'],
    ['\u20ac3,00', '100 ijsjes'],
  ],
  caption: 'Bronwaarden krijgen pas betekenis met label en eenheid.',
};

const pqVisual = {
  type: 'pqGraph',
  id: 'slide_pq_graph',
  title: 'P-Q-grafiek',
  alt: 'P-Q-grafiek met prijs verticaal en hoeveelheid horizontaal',
  points: [
    { x: 330, y: 62, label: '' },
    { x: 275, y: 94, label: '' },
    { x: 220, y: 126, label: '(300; 2,00)' },
    { x: 165, y: 158, label: '' },
    { x: 110, y: 190, label: '' },
  ],
  caption: 'Prijs staat verticaal; hoeveelheid staat horizontaal.',
};

const interpolationVisual = {
  ...pqVisual,
  id: 'slide_interpolation_graph',
  title: 'Interpoleren bij \u20ac1,75',
  guides: { x: 248, y: 112, xLabel: 'Q ongeveer 350', yLabel: '\u20ac1,75' },
  caption: 'Hulplijnen maken de schatting controleerbaar.',
};

const axisVisual = {
  type: 'axisComparison',
  id: 'slide_misleading_axis_comparison',
  title: 'Zelfde data, andere schaal',
  panels: [
    {
      title: 'Y-as vanaf 0',
      values: [
        { label: 'Week 1', height: 96, value: '520' },
        { label: 'Week 2', height: 92, value: '500' },
      ],
    },
    {
      title: 'Y-as vanaf 490',
      values: [
        { label: 'Week 1', height: 96, value: '520' },
        { label: 'Week 2', height: 34, value: '500' },
      ],
    },
  ],
  caption: 'De ingezoomde as maakt dezelfde daling dramatischer.',
};

function notes(student, { misconception = [], transition = '' } = {}) {
  return {
    label: 'Studentgerichte uitleg',
    student,
    misconception,
    transition,
  };
}

function procedureSlide({
  id,
  navTitle,
  role,
  studentTitle,
  assertion,
  action,
  routeLabel,
  rows,
  example,
  speakerNotes,
  visual,
}) {
  return {
    id,
    role,
    navTitle,
    teacherTitle: routeLabel,
    studentTitle,
    title: studentTitle,
    layout: 'procedureRoute',
    routeLabel,
    eyebrow: `${PAR_NR} ${DASH} ${navTitle}`,
    assertion,
    action,
    steps: rows.map(([number, title, prompt], index) => ({
      number,
      title,
      prompt,
      accent: ['teal', 'green', 'amber', 'coral'][index] || 'teal',
    })),
    visual,
    example,
    speakerNotes,
  };
}

const deck = {
  version: 'presentation-v2',
  schemaVersion: 1,
  exemplarId: '1.1.3-graph-transfer-presentation',
  titleLabel: 'Webpresentatie',
  sideLabel: 'Lespresentatie',
  notesLabel: 'Studentgerichte uitleg',
  paragraph: {
    number: PAR_NR,
    title: PAR_NAME,
    chapter: '1.1 Hoofdstuk Economisch denken en rekenen',
  },
  title: 'Wat vertelt de grafiek echt?',
  subtitle: PAR_NAME,
  outputBase: `${PAR_NR} ${PAR_NAME} ${DASH} presentatie`,
  routeContract: {
    learningGoal: 'Leerlingen lezen tabelwaarden, zetten data om naar een P-Q-grafiek en controleren grafiekclaims.',
    productBoundary: 'Webpresentatie zonder nieuwe PPTX-generatie; de bestaande PowerPoint blijft alleen een secundaire download.',
  },
  slides: [
    {
      id: 'route',
      role: 'route_contract',
      navTitle: 'Route',
      teacherTitle: 'Van bron naar oordeel',
      studentTitle: 'Van tabel naar oordeel',
      title: 'Van tabel naar oordeel',
      layout: 'routeContract',
      eyebrow: `${PAR_NR} ${DASH} lesroute`,
      assertion: 'Je leest eerst de bron, dan pas teken of beoordeel je een grafiek.',
      action: 'Gebruik de route als checklist tijdens elke grafiekopgave.',
      routeCards: [
        { label: '1', title: 'Bron', text: 'Lees tabelkop, rij, kolom en eenheid.' },
        { label: '2', title: 'Grafiek', text: 'Zet P verticaal en Q horizontaal.' },
        { label: '3', title: 'Oordeel', text: 'Controleer schaal, vergelijking en claim.' },
      ],
      speakerNotes: notes(
        [
          'De lesroute voorkomt dat leerlingen meteen naar losse getallen springen.',
          'Elke grafiekclaim begint bij de bron: welke waarden worden eigenlijk vergeleken?',
        ],
        { transition: 'Daarna gebruiken we de ijskraam als concrete bron.' },
      ),
    },
    {
      id: 'ijskraam',
      role: 'source_table_anchor',
      navTitle: 'Bron',
      teacherTitle: 'Hoeveel ijsjes verkoop je bij welke prijs?',
      studentTitle: 'Van tabel naar grafiek',
      title: 'Van tabel naar grafiek',
      layout: 'choiceTensionCover',
      eyebrow: `${PAR_NR} ${DASH} ijskraam`,
      thesis: 'Een ijskraam verkoopt bij lagere prijzen meer ijsjes.',
      prompt: 'De tabel geeft de data; de grafiek laat het patroon zien.',
      assertion: 'De tabel ordent de waarden; de grafiek maakt het verband zichtbaar.',
      action: 'Noem bij twee rijen hardop de prijs, hoeveelheid en eenheid.',
      tension: {
        available: { label: 'lage prijs', value: '\u20ac1,00' },
        wanted: { label: 'verkoop', value: '500' },
        gap: { label: 'hoge prijs', value: '\u20ac3,00 -> 100' },
      },
      visual: { type: 'combo', id: 'slide_start_table_graph', items: [tableVisual, pqVisual] },
      paths: [
        { label: 'tabel', text: 'rijen en kolommen' },
        { label: 'grafiek', text: 'verband in beeld' },
      ],
      speakerNotes: notes(
        [
          'De tabel bevat al informatie, maar het verband wordt sneller zichtbaar in de grafiek.',
          'Laat leerlingen eerst de kolommen benoemen voordat ze de lijn interpreteren.',
        ],
        { transition: 'Nu kiezen we precies welke tabelwaarden nodig zijn.' },
      ),
    },
    procedureSlide({
      id: 'tabelwaarden',
      role: 'table_value_selection',
      navTitle: 'Tabelwaarden',
      studentTitle: 'Kies de juiste bronwaarde',
      assertion: 'Een getal uit een tabel is pas bruikbaar als je label en eenheid meeneemt.',
      action: 'Label de waarden voordat je rekent.',
      routeLabel: 'Tabelwaarden selecteren voor een berekening',
      rows: [
        ['01', 'Lees de vraag', 'Welke rij, kolom of periode is nodig?'],
        ['02', 'Controleer labels', 'Tabelkop, rijlabel, kolomlabel en eenheid.'],
        ['03', 'Selecteer waarden', 'Kies oud, nieuw of de gevraagde waarde.'],
        ['04', 'Label je waarden', 'Schrijf bijvoorbeeld oud = 500 ijsjes.'],
      ],
      example: 'Voor een procentuele verandering noteer je eerst oud en nieuw.',
      visual: tableVisual,
      speakerNotes: notes(
        [
          'Dit is de broncontrole die veel rekenfouten voorkomt.',
          'Zonder label weet je later niet meer of 300 een prijs, hoeveelheid of index is.',
        ],
        { transition: 'Met de bronwaarden helder kunnen we de grafiekopzet controleren.' },
      ),
    }),
    procedureSlide({
      id: 'assen',
      role: 'axis_convention',
      navTitle: 'Assen',
      studentTitle: 'Gebruik de economie-assen',
      assertion: 'In deze P-Q-grafiek staat prijs op de verticale as en hoeveelheid op de horizontale as.',
      action: 'Spreek een punt uit als hoeveelheid en prijs: (Q; P).',
      routeLabel: 'Grafiek tekenen van tabeldata',
      rows: [
        ['01', 'Bepaal variabelen', 'Prijs en hoeveelheid.'],
        ['02', 'Kies assen', 'Prijs verticaal, hoeveelheid horizontaal.'],
        ['03', 'Kies schaal', 'Alle punten moeten passen.'],
        ['04', 'Zet punten uit', 'Verbind ze passend.'],
      ],
      example: 'Het punt (300; 2,00) betekent: 300 ijsjes bij een prijs van \u20ac2,00.',
      visual: pqVisual,
      speakerNotes: notes(
        ['De valkuil is dat leerlingen vanuit wiskunde automatisch de prijs horizontaal zetten.'],
        {
          misconception: ['Draai de assen niet om: in deze economiegrafiek staat P verticaal en Q horizontaal.'],
          transition: 'Daarna lezen we een tussenwaarde af.',
        },
      ),
    }),
    procedureSlide({
      id: 'interpoleren',
      role: 'graph_reading_interpolation',
      navTitle: 'Aflezen',
      studentTitle: 'Lees tussen twee punten',
      assertion: 'Interpoleren is een beredeneerde schatting tussen bekende punten.',
      action: 'Gebruik hulplijnen en noem de schatting als ongeveer.',
      routeLabel: 'Waarden aflezen en interpoleren',
      rows: [
        ['01', 'Lees titel en assen', 'Wat meet de grafiek?'],
        ['02', 'Zoek de waarde', 'Bijvoorbeeld \u20ac1,75 op de prijsas.'],
        ['03', 'Trek hulplijnen', 'Naar de grafiek en dan naar de andere as.'],
        ['04', 'Schat netjes', 'Tussen 400 en 300 ligt ongeveer 350.'],
      ],
      example: 'Bij \u20ac1,75 verkoop je ongeveer 350 ijsjes.',
      visual: interpolationVisual,
      speakerNotes: notes(
        ['Interpoleren is hier geen gok: de schatting ligt tussen twee bekende bronpunten.'],
        { transition: 'Tot slot kijken we kritisch naar de schaal van een grafiek.' },
      ),
    }),
    procedureSlide({
      id: 'kritisch',
      role: 'graph_claim_check',
      navTitle: 'Kritisch',
      studentTitle: 'Controleer de schaal',
      assertion: 'Een grafiek kan hetzelfde verschil groter of kleiner laten voelen.',
      action: 'Lees de asstart en vergelijkingsbasis voordat je de conclusie overneemt.',
      routeLabel: 'Grafiekclaim controleren',
      rows: [
        ['01', 'Lees de kop', 'Wat beweert de tekst?'],
        ['02', 'Controleer de as', 'Begint die bij nul?'],
        ['03', 'Lees waarden', 'Welke getallen worden vergeleken?'],
        ['04', 'Check basis', 'Past het percentage bij die basis?'],
      ],
      example: 'Een ingezoomde as kan een kleine daling dramatisch maken.',
      visual: axisVisual,
      speakerNotes: notes(
        ['Grafieken zijn niet verdacht, maar schaalkeuzes sturen wel hoe groot een verschil voelt.'],
        {
          misconception: ['Een steile staaf is geen bewijs zonder de as en waarden te lezen.'],
          transition: 'We sluiten af door de kernvragen terug te halen.',
        },
      ),
    }),
    {
      id: 'terughalen',
      role: 'retrieval_check',
      navTitle: 'Check',
      teacherTitle: 'Kun je de route terughalen?',
      studentTitle: 'Controleer je grafiekroute',
      title: 'Controleer je grafiekroute',
      layout: 'retrievalCheck',
      eyebrow: `${PAR_NR} ${DASH} terughalen`,
      assertion: 'Deze checks vatten de basis van grafieken en tabellen samen.',
      action: 'Beantwoord eerst zelf; open daarna de kaart.',
      checks: [
        {
          prompt: 'Wat controleer je voordat je een tabelwaarde gebruikt?',
          hint: 'Denk aan kop, rij, kolom en eenheid.',
          answer: 'Je controleert label en eenheid, zodat het getal betekenis heeft.',
        },
        {
          prompt: 'Waar staan P en Q in deze economiegrafiek?',
          hint: 'Prijs en hoeveelheid staan niet willekeurig.',
          answer: 'P staat verticaal; Q staat horizontaal.',
        },
        {
          prompt: 'Waarom schrijf je bij interpoleren vaak ongeveer?',
          hint: 'Je leest tussen bekende punten.',
          answer: 'Omdat je een beredeneerde schatting maakt tussen bronpunten.',
        },
      ],
      speakerNotes: notes(
        [
          'Deze check is bedoeld als snelle terughaalronde, niet als bewijs dat alles onder de knie is.',
          'Laat leerlingen eerst stil antwoorden en daarna per kaart controleren.',
        ],
        { transition: 'Gebruik dezelfde route in de oefenpagina en het grafiekenspel.' },
      ),
    },
  ],
};

module.exports = deck;
