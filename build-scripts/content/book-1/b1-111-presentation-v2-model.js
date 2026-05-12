/**
 * Semantic presentation model for §1.1.1 prototype.
 *
 * This file is the source of truth for both the editable PPTX prototype and
 * the HTML prototype. The HTML renderer must not infer slide meaning from a
 * PPTX file; it reads these semantic blocks directly.
 */

const deck = {
  version: 'presentation-v2-prototype',
  paragraph: {
    number: '1.1.1',
    title: 'Schaarste en economisch denken',
    chapter: '1.1 Hoofdstuk Economisch denken en rekenen',
  },
  title: 'Kiezen kost altijd iets',
  subtitle: 'Schaarste en economisch denken',
  outputBase: '1.1.1 Schaarste en economisch denken – presentatie-v2-prototype',
  slides: [
    {
      id: 'cover',
      navTitle: 'Kiezen kost iets',
      teacherTitle: 'Kiezen kost altijd iets',
      studentTitle: 'Kiezen kost altijd iets',
      layout: 'choiceTensionCover',
      eyebrow: '§ 1.1.1 · Schaarste',
      thesis: 'Lisa heeft €20. Haar twee verleidingen kosten samen €27.',
      prompt: 'Wat laat je liggen als je kiest?',
      tension: {
        available: { label: 'budget', value: '€20' },
        wanted: { label: 'samen nodig', value: '€27' },
        gap: { label: 'tekort', value: '€7' },
      },
      paths: [
        { label: 'zichtbare keuze', text: 'wat Lisa wél doet' },
        { label: 'onzichtbare keuze', text: 'wat Lisa opgeeft' },
      ],
      speakerNotes: {
        script: [
          'Kijk eerst naar de spanning op deze dia. Lisa heeft twintig euro, maar de twee dingen die ze graag wil doen kosten samen zevenentwintig euro. Er is dus niet genoeg geld om alles te kiezen.',
          'Dat tekort van zeven euro is niet alleen een rekensom. Het zorgt ervoor dat Lisa moet kiezen. De zichtbare keuze is wat ze uiteindelijk wél doet. De onzichtbare keuze is wat ze daardoor opgeeft.',
          'Die onzichtbare keuze is waar economie interessant wordt: kiezen kost altijd iets, ook als je geen extra euro betaalt.',
        ],
      },
    },
    {
      id: 'lisa-choice',
      navTitle: 'Lisa moet kiezen',
      teacherTitle: 'Lisa moet kiezen',
      studentTitle: 'Lisa heeft €20',
      layout: 'choiceComparison',
      eyebrow: 'Narratief verhaal',
      lead: 'Zaterdagmiddag. Twee verleidingen.',
      goals: ['schaarste herkennen', 'alternatieve kosten bepalen', 'nettowaarde beoordelen'],
      options: [
        {
          key: 'A',
          title: 'Bioscoop',
          price: '€12',
          benefit: 'Een middag kijkplezier.',
          accent: 'teal',
        },
        {
          key: 'B',
          title: 'Nieuw boek',
          price: '€15',
          benefit: 'Avonden leesplezier.',
          accent: 'amber',
        },
      ],
      conclusion: 'Beide samen kost €27. Lisa heeft maar €20. Ze móét kiezen.',
      speakerNotes: {
        script: [
          'Lisa heeft twee aantrekkelijke opties. Ze kan naar de bioscoop voor twaalf euro, of ze kan een nieuw boek kopen voor vijftien euro. Allebei leveren iets op: de bioscoop geeft haar een middag kijkplezier, het boek geeft haar avonden leesplezier.',
          'Samen kosten de opties zevenentwintig euro, maar Lisa heeft maar twintig euro. Daardoor kan ze niet simpelweg alles nemen wat ze wil. Ze moet één optie kiezen en de andere laten liggen.',
          'Precies dat noemen we schaarste: je behoeften zijn groter dan je middelen. Let op: het gaat hier niet alleen om geld. Tijd, ruimte en aandacht kunnen ook schaarse middelen zijn.',
        ],
      },
    },
    {
      id: 'alternatieve-kosten-route',
      navTitle: 'Alternatieve kosten',
      teacherTitle: 'Economisch denken in vier stappen',
      studentTitle: 'Van keuze naar nettowaarde',
      layout: 'procedureRoute',
      eyebrow: 'Alternatieve kosten',
      lead: 'Alternatieve kosten in een keuze-situatie: van alternatieven naar nettowaarde.',
      steps: [
        { number: '01', title: 'Benoem alternatieven', prompt: 'Welke opties heb je?', accent: 'teal' },
        { number: '02', title: 'Bereken opbrengsten', prompt: 'Wat levert elk alternatief op?', accent: 'green' },
        { number: '03', title: 'Rangschik', prompt: 'Beste niet-gekozen = alternatieve kosten.', accent: 'amber' },
        { number: '04', title: 'Bereken nettowaarde', prompt: 'Opbrengst − alternatieve kosten.', accent: 'coral' },
      ],
      example: 'Tarwe kiezen → opbrengst €5.000; beste alternatief maïs €3.500; nettowaarde €1.500.',
      speakerNotes: {
        script: [
          'Deze dia laat de vaardigheid Alternatieve kosten in een keuze-situatie zien. Eerst benoem je welke alternatieven er zijn. Daarna bereken je wat elk alternatief oplevert. Pas daarna kun je eerlijk vergelijken.',
          'In stap drie kijk je naar het beste alternatief dat je niet kiest. Dat beste niet-gekozen alternatief zijn de alternatieve kosten. Bij Lisa is dat wat ze laat liggen; bij de boer is dat de opbrengst van het gewas dat hij niet verbouwt.',
          'Stap vier is belangrijk: je berekent de nettowaarde. Dat is de opbrengst van je gekozen alternatief min de alternatieve kosten. Zo zie je niet alleen wat je krijgt, maar ook wat er overblijft nadat je rekening houdt met wat je opgeeft.',
        ],
      },
    },
  ],
};

module.exports = deck;
