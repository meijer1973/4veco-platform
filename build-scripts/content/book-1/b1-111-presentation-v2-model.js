/**
 * Semantic presentation model for the implemented §1.1.1 web presentation.
 *
 * The accepted exemplar JSON stays frozen in references/. This file maps that
 * content into the reusable presentation-v2 renderer contract used for lesson
 * generation.
 */

const accepted = require('../../../references/exemplars/1.1.1-golden-presentation/golden-presentation-content-model.json');

const DASH = '–';

const LAYOUT_BY_ROLE = {
  route_contract: 'routeContract',
  narrative_anchor: 'narrativeAnchor',
  concept_model_development: 'conceptModel',
  transfer_slide: 'transferCards',
  misconception_slide: 'misconceptionCards',
  procedure_route: 'procedureRoute',
  worked_example_calculation: 'workedCalculation',
  worked_example_interpretation: 'workedInterpretation',
  retrieval_check: 'retrievalCheck',
  summary_bridge: 'summaryBridge',
};

const teacherCues = {
  'slide-01': 'Laat leerlingen de route in eigen woorden voorspellen: van Lisa naar begrip naar boer.',
  'slide-02': 'Laat eerst het tekort uitrekenen en vraag daarna welke opties om hetzelfde geld concurreren.',
  'slide-03': 'Corrigeer direct de valkuil dat schaarste hetzelfde zou zijn als zeldzaamheid.',
  'slide-04': 'Vraag bij elke kaart hardop: wie kiest, welk middel is beperkt, welke alternatieven botsen?',
  'slide-05': 'Laat leerlingen eerst de prijs noemen en daarna expliciet uitleggen waarom dat nog niet de alternatieve kosten zijn.',
  'slide-06': 'Gebruik de twee foutkaarten als klassikale diagnose voordat leerlingen zelf rekenen.',
  'slide-07': 'Laat de volgorde nazeggen: middel, opbrengsten, alternatieve kosten, conclusie.',
  'slide-08': 'Stop na de tabel en laat leerlingen voorspellen waarom er nog geen conclusie staat.',
  'slide-09': 'Benadruk dat nettowaarde een vergelijking boven het beste alternatief is, geen totale winstclaim.',
  'slide-10': 'Laat leerlingen eerst individueel invullen en open daarna de antwoorden per kaart.',
  'slide-11': 'Laat één leerling elke zin koppelen aan een dia of voorbeeld uit de les.',
};

const transitions = {
  'slide-01': 'We starten met Lisa, omdat haar keuze klein genoeg is om het patroon scherp te zien.',
  'slide-02': 'Van Lisa gaan we naar het begrip dat onder dit keuzeprobleem ligt: schaarste.',
  'slide-03': 'Nu we schaarste kunnen herkennen, testen we of hetzelfde patroon ook buiten Lisa werkt.',
  'slide-04': 'Daarna voegen we het tweede kernbegrip toe: alternatieve kosten.',
  'slide-05': 'Voordat we gaan rekenen, halen we twee hardnekkige verwarringen weg.',
  'slide-06': 'Met die valkuilen helder kunnen we de vaste vierstappenroute gebruiken.',
  'slide-07': 'De route passen we nu toe op de boer met 10 hectare land.',
  'slide-08': 'Na het rekenen volgt de interpretatie: wat geeft de boer op en wat blijft netto over?',
  'slide-09': 'Daarna controleren leerlingen of ze het patroon zelf kunnen terughalen.',
  'slide-10': 'We sluiten af met de kernzinnen die de volgende opgave dragen.',
  'slide-11': 'Gebruik deze samenvatting als brug naar zelfstandige verwerking.',
};

const extras = {
  'slide-01': {
    routeCards: [
      { label: '1', title: 'Lisa', text: 'een herkenbaar keuzeprobleem' },
      { label: '2', title: 'Begrippen', text: 'schaarste en alternatieve kosten' },
      { label: '3', title: 'Boer', text: 'de procedure met opbrengsten' },
    ],
    visual: 'Drie routekaarten zetten de lesvolgorde neer: voorbeeld, begrip, toepassing.',
  },
  'slide-02': {
    tension: {
      available: { label: 'budget', value: '€20' },
      wanted: { label: 'samen nodig', value: '€27' },
      gap: { label: 'tekort', value: '€7' },
    },
    options: [
      { key: 'A', title: 'Bioscoop', price: '€12', benefit: 'Een middag kijkplezier.', accent: 'teal' },
      { key: 'B', title: 'Nieuw boek', price: '€15', benefit: 'Avonden leesplezier.', accent: 'amber' },
    ],
    visual: 'Een budgetspanning en twee optiekaarten maken zichtbaar dat beide opties om hetzelfde geld strijden.',
  },
  'slide-03': {
    relation: {
      left: { label: 'behoeften', value: '€27' },
      operator: '>',
      right: { label: 'middelen', value: '€20' },
      result: 'schaarste',
      caution: 'niet: zeldzaam',
    },
    visual: 'Een verhoudingsdiagram laat zien dat schaarste ontstaat uit behoeften groter dan middelen.',
  },
  'slide-04': {
    transferCards: [
      { title: 'Scholier', chooser: 'Lisa', limited: 'geld of tijd', alternatives: 'bioscoop, boek, sporten' },
      { title: 'Producent', chooser: 'boer', limited: 'land, machines, personeel', alternatives: 'tarwe of maïs' },
      { title: 'Overheid', chooser: 'gemeente', limited: 'belastinggeld of ruimte', alternatives: 'park, weg, school' },
    ],
    visual: 'Drie transferkaarten houden dezelfde vragen vast in andere contexten.',
  },
  'slide-05': {
    relation: {
      left: { label: 'gekozen', value: 'bioscoop' },
      operator: '→',
      right: { label: 'niet gekozen', value: 'boek lezen' },
      result: 'waarde van beste alternatief',
      caution: 'niet: betaalde prijs',
    },
    visual: 'Een gekozen/niet-gekozen-relatie maakt de definitie van alternatieve kosten visueel.',
  },
  'slide-06': {
    misconceptions: [
      { title: 'Fout 1', wrong: 'Alternatieve kosten = prijs', fix: 'Prijs is wat je betaalt; alternatieve kosten zijn wat je opgeeft.' },
      { title: 'Fout 2', wrong: 'Alle gemiste opties optellen', fix: 'Je gebruikt alleen het beste niet-gekozen alternatief.' },
    ],
    visual: 'Twee foutkaarten zetten verwarring naast de correcte controlevraag.',
  },
  'slide-07': {
    steps: [
      { number: '01', title: 'Schaars middel', prompt: 'Welk middel kan maar één keer worden gebruikt?', accent: 'teal' },
      { number: '02', title: 'Opbrengsten', prompt: 'Wat levert elk alternatief op?', accent: 'green' },
      { number: '03', title: 'Alternatieve kosten', prompt: 'Wat is het beste niet-gekozen alternatief?', accent: 'amber' },
      { number: '04', title: 'Conclusie', prompt: 'Vergelijk opbrengst met wat je opgeeft.', accent: 'coral' },
    ],
    example: 'Eerst rekenen en vergelijken; daarna pas beoordelen.',
    visual: 'Een vierstappenroute voorkomt dat leerlingen meteen naar de hoogste opbrengst springen.',
  },
  'slide-08': {
    data: ['10 hectare land', 'tarwe: €500 per hectare', 'maïs: €350 per hectare'],
    table: {
      headers: ['Alternatief', 'Per hectare', '10 hectare'],
      rows: [
        ['Tarwe', '€500', '€5.000'],
        ['Maïs', '€350', '€3.500'],
      ],
    },
    formulaCards: [
      { title: 'Tarwe', formula: '10 × €500 = €5.000' },
      { title: 'Maïs', formula: '10 × €350 = €3.500' },
    ],
    visual: 'Een rekentabel maakt beide alternatieven vergelijkbaar voordat de conclusie volgt.',
  },
  'slide-09': {
    equation: {
      chosen: '€5.000',
      minus: '€3.500',
      result: '€1.500',
      label: 'nettowaarde tarwe boven maïs',
    },
    interpretationCards: [
      { title: 'Gekozen', text: 'Tarwe levert €5.000 op.' },
      { title: 'Opgegeven', text: 'Maïs is het beste niet-gekozen alternatief.' },
      { title: 'Nettowaarde', text: 'Tarwe ligt €1.500 boven het alternatief.' },
    ],
    visual: 'Een nettowaarde-vergelijking toont opbrengst min alternatieve kosten.',
  },
};

function slideNotes(slide) {
  const extra = extras[slide.id] || {};
  return {
    label: accepted.design_contract.notes_label,
    student: slide.student_explanation,
    misconception: slide.misconception_watch || [],
    teacherCue: teacherCues[slide.id],
    transition: transitions[slide.id],
    data: extra.data || [],
    visual: extra.visual || '',
  };
}

function toDeckSlide(slide, index) {
  const extra = extras[slide.id] || {};
  return {
    ...extra,
    id: slide.id,
    role: slide.role,
    layout: LAYOUT_BY_ROLE[slide.role],
    navTitle: slide.title,
    teacherTitle: slide.title,
    studentTitle: slide.h2,
    title: slide.title,
    subtitle: slide.subtitle,
    eyebrow: `${accepted.paragraph} · ${slide.subtitle}`,
    assertion: slide.assertion,
    action: slide.action,
    studentExplanation: slide.student_explanation,
    misconceptionWatch: slide.misconception_watch || [],
    checks: slide.checks || [],
    speakerNotes: slideNotes(slide),
    acceptedSlideNumber: index + 1,
  };
}

const deck = {
  version: 'presentation-v2',
  schemaVersion: accepted.schema_version,
  exemplarId: accepted.exemplar_id,
  titleLabel: 'Webpresentatie',
  sideLabel: 'Lespresentatie',
  notesLabel: accepted.design_contract.notes_label,
  paragraph: {
    number: accepted.paragraph,
    title: 'Schaarste en economisch denken',
    chapter: '1.1 Hoofdstuk Economisch denken en rekenen',
  },
  title: accepted.title,
  subtitle: 'Schaarste en economisch denken',
  outputBase: `1.1.1 Schaarste en economisch denken ${DASH} presentatie`,
  sourceSnapshot: {
    path: accepted.source_snapshot.path,
    sha256: accepted.source_snapshot.sha256,
    package: accepted.source_snapshot.source_package,
    packageFile: accepted.source_snapshot.package_file,
    acceptedOn: accepted.source_snapshot.accepted_on,
  },
  routeContract: accepted.route_contract,
  designContract: accepted.design_contract,
  slides: accepted.slides.map(toDeckSlide),
};

module.exports = deck;
