/**
 * Semantic presentation model for the implemented section 1.1.2 web presentation.
 *
 * This extracts the presentation-v2 deck that used to live inside the student-web
 * builder so registry builds, HTML QA, and PPTX proof checks share one source.
 */

const PAR_NR = '1.1.2';
const PAR_NAME = 'Percentages en indexcijfers';
const DASH = '\u2013';

function notes(studentExplanation, { misconceptionWatch = [], teacherCue = [], transition = '' } = {}) {
  return {
    label: 'Studentgerichte uitleg',
    studentExplanation,
    misconceptionWatch,
    teacherCue,
    transition,
  };
}

const deck = {
  version: 'presentation-v2',
  schemaVersion: 1,
  exemplarId: '1.1.2-percentages-indexcijfers-presentation',
  titleLabel: 'Webpresentatie',
  sideLabel: 'Lespresentatie',
  notesLabel: 'Studentgerichte uitleg',
  paragraph: {
    number: PAR_NR,
    title: PAR_NAME,
    chapter: '1.1 Hoofdstuk Economisch denken en rekenen',
  },
  title: 'Hoeveel duurder is het geworden?',
  subtitle: PAR_NAME,
  outputBase: `${PAR_NR} ${PAR_NAME} ${DASH} presentatie`,
  routeContract: {
    learningGoal: 'Leerlingen berekenen procentuele veranderingen, lezen indexcijfers en onderscheiden indexpunten van procenten.',
    successCriteria: [
      'Ik bepaal eerst de oude waarde, nieuwe waarde en het verschil.',
      'Ik bereken een procentuele verandering met de oude waarde als basis.',
      'Ik leg uit wat index 100, index 125 en een indexpuntenverschil betekenen.',
      'Ik gebruik de juiste eenheid: procent, procentpunt of indexpunt.',
    ],
  },
  designContract: {
    notesLabel: 'Studentgerichte uitleg',
    minBodyFontPt: 18,
    minLabelFontPt: 14,
  },
  slides: [
    {
      id: 'start',
      role: 'route_contract',
      navTitle: 'Startvraag',
      teacherTitle: 'Hoeveel duurder is het geworden?',
      studentTitle: 'Hoeveel duurder?',
      title: 'Hoeveel duurder?',
      layout: 'choiceTensionCover',
      eyebrow: `${PAR_NR} ${DASH} Percentages`,
      assertion: 'Een percentage zegt pas iets als je weet welke oude waarde de basis is.',
      action: 'Lees eerst oud, nieuw en verschil; reken daarna pas relatief.',
      thesis: 'Sanne ziet een telefoon die van EUR 600 naar EUR 648 stijgt.',
      prompt: 'Is EUR 48 veel? Dat hangt af van de basis.',
      tension: {
        available: { label: 'oude prijs', value: 'EUR 600' },
        wanted: { label: 'nieuwe prijs', value: 'EUR 648' },
        gap: { label: 'verschil', value: 'EUR 48' },
      },
      paths: [
        { label: 'absoluut', text: 'EUR 48 extra' },
        { label: 'relatief', text: '8% duurder' },
      ],
      studentExplanation: [
        'Het euroverschil krijgt pas betekenis als je het vergelijkt met de oude prijs.',
      ],
      misconceptionWatch: [
        'Een bedrag zonder basis kan groot lijken terwijl het relatief klein is.',
      ],
      speakerNotes: notes(
        [
          'Start met de drie getallen: oude prijs EUR 600, nieuwe prijs EUR 648 en verschil EUR 48.',
          'De kernvraag is: EUR 48 ten opzichte van welke basis?',
        ],
        {
          misconceptionWatch: ['Een eurobedrag alleen is nog geen procentuele verandering.'],
          teacherCue: ['Laat leerlingen eerst hardop benoemen wat oud, nieuw en verschil zijn.'],
          transition: 'Daarna zetten we oud en nieuw naast elkaar.',
        },
      ),
    },
    {
      id: 'oud-nieuw',
      role: 'narrative_anchor',
      navTitle: 'Oud en nieuw',
      teacherTitle: 'Oud, nieuw en verschil',
      studentTitle: 'Eerst de basis vinden',
      title: 'Eerst de basis vinden',
      layout: 'choiceComparison',
      eyebrow: 'Procentuele verandering',
      assertion: 'De oude waarde is de basis waarmee je de verandering vergelijkt.',
      action: 'Wijs eerst oud en nieuw aan voordat je de formule invult.',
      lead: 'Een percentage begint met zorgvuldig lezen.',
      goals: ['oude waarde vinden', 'nieuwe waarde vinden', 'verschil berekenen'],
      options: [
        { key: 'A', title: 'Oud', price: 'EUR 600', benefit: 'De basis waarmee je vergelijkt.', accent: 'teal' },
        { key: 'B', title: 'Nieuw', price: 'EUR 648', benefit: 'De waarde na de verandering.', accent: 'amber' },
      ],
      conclusion: 'Het verschil is EUR 48, maar het percentage bereken je met de oude prijs als basis.',
      studentExplanation: [
        'Oud is het startpunt; nieuw is de waarde na de verandering.',
      ],
      misconceptionWatch: [
        'Te snel naar de formule gaan leidt vaak tot oud en nieuw verwisselen.',
      ],
      speakerNotes: notes(
        [
          'Laat leerlingen de twee waarden aanwijzen: oud is EUR 600 en nieuw is EUR 648.',
          'Pas daarna komt het verschil: nieuw min oud is EUR 48.',
        ],
        {
          misconceptionWatch: ['Wie de nieuwe waarde als basis neemt, berekent een ander verhaal.'],
          teacherCue: ['Vraag steeds: waar begon de situatie?'],
          transition: 'Met de basis helder kunnen we de procentuele route uitvoeren.',
        },
      ),
    },
    {
      id: 'percentage-route',
      role: 'procedure_route',
      navTitle: 'Percentage',
      teacherTitle: 'Procentuele verandering berekenen',
      studentTitle: 'Van EUR 48 naar 8%',
      title: 'Van EUR 48 naar 8%',
      layout: 'procedureRoute',
      routeLabel: 'Procentuele verandering berekenen in vier stappen',
      eyebrow: 'Vaste aanpak',
      assertion: 'Procentuele verandering is verschil gedeeld door oud, keer 100%.',
      action: 'Controleer na het rekenen of het antwoord een stijging of daling is.',
      lead: 'Gebruik deze route bij een verandering van bedrag naar bedrag.',
      steps: [
        { number: '01', title: 'Bepaal oud en nieuw', prompt: 'Oud = 600, nieuw = 648.', accent: 'teal' },
        { number: '02', title: 'Bereken het verschil', prompt: '648 - 600 = 48.', accent: 'green' },
        { number: '03', title: 'Deel door oud', prompt: '48 / 600 x 100% = 8%.', accent: 'amber' },
        { number: '04', title: 'Benoem het teken', prompt: 'Positief, dus een stijging.', accent: 'coral' },
      ],
      example: 'De smartphone is 8% duurder geworden.',
      studentExplanation: [
        'Je deelt door de oude waarde omdat je vraagt hoeveel procent van de oude prijs de verandering is.',
      ],
      misconceptionWatch: [
        'Delen door de nieuwe waarde maakt de stijging te klein.',
      ],
      speakerNotes: notes(
        [
          'Dit is de vaste rekenroute: oud en nieuw, verschil, delen door oud en keer honderd.',
          'De noemer is de oude waarde omdat die het startpunt van de vergelijking is.',
        ],
        {
          misconceptionWatch: ['Gebruik niet automatisch het grootste getal als noemer.'],
          teacherCue: ['Laat leerlingen de breuk hardop lezen als verschil ten opzichte van oud.'],
          transition: 'Dezelfde relatieve gedachte gebruiken we bij indexcijfers.',
        },
      ),
    },
    {
      id: 'waarom-index',
      role: 'concept_model_development',
      navTitle: 'Waarom index',
      teacherTitle: 'Van een prijs naar een reeks',
      studentTitle: 'Waarom indexcijfers?',
      title: 'Waarom indexcijfers?',
      layout: 'choiceComparison',
      eyebrow: 'Indexcijfers',
      assertion: 'Een index maakt verschillende jaren vergelijkbaar door een basisjaar op 100 te zetten.',
      action: 'Lees index 125 als 25% boven het basisjaar, niet als EUR 125.',
      lead: 'Economen willen vaak meerdere jaren vergelijken.',
      goals: ['basisjaar herkennen', 'index 100 lezen', 'reeks vergelijken'],
      options: [
        { key: 'A', title: 'Eurobedragen', price: '120, 150, 162', benefit: 'Precies, maar soms lastig te vergelijken.', accent: 'teal' },
        { key: 'B', title: 'Indexreeks', price: '100, 125, 135', benefit: 'Laat meteen zien hoe elk jaar zich verhoudt tot de basis.', accent: 'amber' },
      ],
      conclusion: 'Het basisjaar krijgt index 100. Andere jaren lees je ten opzichte van dat basisjaar.',
      studentExplanation: [
        'Index 100 betekent dat het basisjaar het startpunt van de vergelijking is.',
      ],
      misconceptionWatch: [
        'Index 125 is geen bedrag; het is een verhouding tot het basisjaar.',
      ],
      speakerNotes: notes(
        [
          'Een indexcijfer is handig zodra er een reeks ontstaat.',
          'Leerlingen lezen alles ten opzichte van het basisjaar in plaats van losse bedragen te onthouden.',
        ],
        {
          misconceptionWatch: ['Index 100 betekent basisjaar, niet automatisch EUR 100.'],
          teacherCue: ['Laat leerlingen bij 125 de zin afmaken: ten opzichte van het basisjaar is dit...'],
          transition: 'Nu berekenen we zo een indexcijfer.',
        },
      ),
    },
    {
      id: 'index-formule',
      role: 'procedure_route',
      navTitle: 'Index formule',
      teacherTitle: 'Indexcijfer berekenen',
      studentTitle: 'Basisjaar = 100',
      title: 'Basisjaar = 100',
      layout: 'procedureRoute',
      routeLabel: 'Indexcijfer berekenen in vier stappen',
      eyebrow: 'Vaste aanpak',
      assertion: 'Een indexcijfer is doelwaarde gedeeld door basiswaarde, keer 100.',
      action: 'Schrijf na het antwoord altijd wat de index betekent.',
      lead: 'Gebruik deze route bij een waarde ten opzichte van een basisjaar.',
      steps: [
        { number: '01', title: 'Kies het basisjaar', prompt: 'Dat jaar krijgt index 100.', accent: 'teal' },
        { number: '02', title: 'Neem de doelwaarde', prompt: 'Bijvoorbeeld EUR 150 in 2023.', accent: 'green' },
        { number: '03', title: 'Deel door de basis', prompt: '150 / 120 x 100 = 125.', accent: 'amber' },
        { number: '04', title: 'Interpreteer', prompt: 'Index 125 is 25% boven de basis.', accent: 'coral' },
      ],
      example: 'Een mandje van EUR 120 naar EUR 150 krijgt index 125.',
      studentExplanation: [
        'De doelwaarde staat boven de breuk en de basisjaarwaarde staat onder de breuk.',
      ],
      misconceptionWatch: [
        'Teller en noemer omdraaien vertelt het omgekeerde verhaal.',
      ],
      speakerNotes: notes(
        [
          'De doelwaarde staat boven en de basisjaarwaarde staat onder de breuk.',
          'Daarna vermenigvuldig je met honderd zodat het basisjaar index 100 wordt.',
        ],
        {
          misconceptionWatch: ['Als teller en noemer omgedraaid worden, krijg je bijvoorbeeld 80 in plaats van 125.'],
          teacherCue: ['Vraag na het getal om een interpretatiezin.'],
          transition: 'Tot slot halen we indexpunten en procenten uit elkaar.',
        },
      ),
    },
    {
      id: 'indexpunten',
      role: 'misconception_slide',
      navTitle: 'Indexpunten',
      teacherTitle: 'Indexpunten zijn geen procenten',
      studentTitle: '125 naar 135 is niet 10%',
      title: '125 naar 135 is niet 10%',
      layout: 'procedureRoute',
      routeLabel: 'Indexpunten en procentuele verandering onderscheiden in vier stappen',
      eyebrow: 'Valkuil',
      assertion: 'Een verschil van 10 indexpunten is pas 10% als de oude index 100 is.',
      action: 'Reken een puntenverschil opnieuw om ten opzichte van de oude index.',
      lead: 'Het verschil in punten is nog niet de procentuele verandering.',
      steps: [
        { number: '01', title: 'Oude index', prompt: '125.', accent: 'teal' },
        { number: '02', title: 'Nieuwe index', prompt: '135.', accent: 'green' },
        { number: '03', title: 'Puntenverschil', prompt: '135 - 125 = 10 indexpunten.', accent: 'amber' },
        { number: '04', title: 'Deel door oud', prompt: '10 / 125 x 100% = 8%.', accent: 'coral' },
      ],
      example: 'De index stijgt 10 punten, maar de procentuele stijging is 8%.',
      studentExplanation: [
        'Het puntenverschil is 10, maar het percentage bereken je met oude index 125 als basis.',
      ],
      misconceptionWatch: [
        'Schrijf niet automatisch een procentteken achter een indexpuntenverschil.',
      ],
      speakerNotes: notes(
        [
          'Dit is de belangrijkste valkuil: 10 indexpunten klinkt als 10%, maar dat klopt hier niet.',
          'Omdat de oude index 125 is, deel je 10 door 125.',
        ],
        {
          misconceptionWatch: ['Indexpunten en procenten zijn verschillende eenheden.'],
          teacherCue: ['Laat leerlingen de twee eenheden uitspreken: 10 indexpunten en 8%.'],
          transition: 'We sluiten af door de drie routes naast elkaar te zetten.',
        },
      ),
    },
    {
      id: 'samenvatting',
      role: 'summary_bridge',
      navTitle: 'Samenvatting',
      teacherTitle: 'Welke route kies je?',
      studentTitle: 'Drie routes',
      title: 'Drie routes',
      layout: 'procedureRoute',
      routeLabel: 'Drie rekenroutes kiezen en eenheden controleren',
      eyebrow: 'Afronding',
      assertion: 'Kies eerst het soort vraag; daarna kies je de formule en de eenheid.',
      action: 'Noem bij elk antwoord of het om procent, procentpunt of indexpunt gaat.',
      lead: 'Kies eerst het soort vraag, daarna de formule.',
      steps: [
        { number: '01', title: 'Bedrag naar bedrag', prompt: 'Procentuele verandering.', accent: 'teal' },
        { number: '02', title: 'Waarde naar basisjaar', prompt: 'Indexcijfer berekenen.', accent: 'green' },
        { number: '03', title: 'Index naar index', prompt: 'Procentuele verandering op indexcijfers.', accent: 'amber' },
        { number: '04', title: 'Eenheden controleren', prompt: 'Procent, procentpunt of indexpunt?', accent: 'coral' },
      ],
      example: 'In de volgende paragraaf gebruik je deze rekenroutes bij tabellen en grafieken.',
      studentExplanation: [
        'De formule volgt uit het soort vraag: verandering, index of vergelijking tussen indexcijfers.',
      ],
      misconceptionWatch: [
        'Alleen formules onthouden is kwetsbaar als je niet weet welke vraag erbij hoort.',
      ],
      speakerNotes: notes(
        [
          'Sluit af met de keuze voor de route: bedrag naar bedrag, waarde naar basisjaar of index naar index.',
          'De laatste controle is taal: het juiste antwoord heeft ook de juiste eenheid.',
        ],
        {
          misconceptionWatch: ['Laat leerlingen niet eindigen met alleen een los getal.'],
          teacherCue: ['Vraag per route om een voorbeeldzin, niet alleen om de formule.'],
          transition: 'In de volgende paragraaf gebruiken leerlingen dezelfde routes bij tabellen en grafieken.',
        },
      ),
    },
  ],
};

module.exports = deck;
