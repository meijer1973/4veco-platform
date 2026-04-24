/**
 * HOW TO ADAPT
 * 1. Copy this file to `b1-XYZ-game-data.js`.
 * 2. Change PAR_NR, PAR_NAME, and the data objects below.
 * 3. Keep runtime data in the book-root `shared/` tree.
 * 4. Keep reasoning CSV source in `source-data/book-1/reasoning/`.
 * 5. Run from `4veco-platform/`:
 *      node build-scripts/content/book-1/b1-112-game-data.js
 *      $env:MODULE_ROOT="..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"; node build-scripts/platform/build-reasoning-questions.js 1.1.2 math-economics source-data/book-1/reasoning/1.1.2.csv
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PAR_NR = '1.1.2';
const PAR_NAME = 'Percentages en indexcijfers';
const BOOK_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const SHARED = path.join(BOOK_ROOT, 'shared');
const REASONING_SOURCE = path.resolve(__dirname, '..', '..', '..', 'source-data', 'book-1', 'reasoning', `${PAR_NR}.csv`);
const DEPLOY_CONFIG = path.join(BOOK_ROOT, 'deploy-config.json');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJs(filePath, varName, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `var ${varName} = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  console.log(`written ${filePath}`);
}

const quizData = {
  meta: {
    parNr: PAR_NR,
    parName: PAR_NAME,
    subtitle: 'Oefen met procentuele verandering, indexcijfers en de valkuil indexpunten versus procenten.',
    testTopics: [
      'Procentuele verandering berekenen',
      'Indexcijfers berekenen',
      'Indexpunten en procenten uit elkaar houden',
      'Inflatie interpreteren',
    ],
  },
  categories: {
    procent: { name: 'Procentuele verandering', colors: { bg: '#EBF5FB', text: '#154360', bar: '#1A5276' } },
    index: { name: 'Indexcijfers', colors: { bg: '#E8F8F5', text: '#0B5E5A', bar: '#148F83' } },
    valkuil: { name: 'Indexpunten vs procenten', colors: { bg: '#F9EBEA', text: '#922B21', bar: '#C0392B' } },
    inflatie: { name: 'Inflatie toepassen', colors: { bg: '#FEF5E7', text: '#BA6A1C', bar: '#E67E22' } },
  },
  questions: [
    { category: 'procent', difficulty: 1, q: 'Een jas stijgt van EUR 80 naar EUR 88. Wat is de procentuele stijging?', options: ['10%', '8%', '11%', '12,5%'], answer: 0, rationale: '(88 - 80) / 80 x 100% = 10%. Je deelt door de oude waarde.' },
    { category: 'procent', difficulty: 1, q: 'Welke waarde staat in de noemer bij procentuele verandering?', options: ['De oude waarde', 'De nieuwe waarde', 'Het verschil', 'Het gemiddelde'], answer: 0, rationale: 'Je meet de verandering ten opzichte van waar je vandaan komt: de oude waarde.' },
    { category: 'procent', difficulty: 3, q: 'Een prijs daalt van EUR 250 naar EUR 200. Wat is de procentuele verandering?', options: ['-20%', '-25%', '20%', '25%'], answer: 0, rationale: '(200 - 250) / 250 x 100% = -20%. Het minteken betekent daling.' },
    { category: 'index', difficulty: 1, q: 'Wat is het indexcijfer van het basisjaar?', options: ['100', '0', '1', 'Het prijsniveau in euro'], answer: 0, rationale: 'Het basisjaar krijgt altijd index 100.' },
    { category: 'index', difficulty: 2, q: 'Een product kost in het basisjaar EUR 40 en later EUR 50. Wat is het indexcijfer?', options: ['125', '80', '110', '25'], answer: 0, rationale: '50 / 40 x 100 = 125.' },
    { category: 'index', difficulty: 3, q: 'Een indexcijfer is 96. Wat betekent dat ten opzichte van het basisjaar?', options: ['De waarde is 4% lager dan in het basisjaar', 'De waarde is 96% lager', 'De waarde is 96 euro', 'De waarde is 4 indexpunten hoger'], answer: 0, rationale: 'Onder 100 betekent lager dan het basisjaar. 96 is 4% onder 100.' },
    { category: 'valkuil', difficulty: 1, q: 'Een index stijgt van 120 naar 130. Hoeveel indexpunten is de stijging?', options: ['10 indexpunten', '10%', '8,3 indexpunten', '30 indexpunten'], answer: 0, rationale: 'Het verschil in indexcijfers is 130 - 120 = 10 indexpunten.' },
    { category: 'valkuil', difficulty: 2, q: 'Een index stijgt van 120 naar 130. Wat is de procentuele stijging?', options: ['8,3%', '10%', '30%', '120%'], answer: 0, rationale: '(130 - 120) / 120 x 100% = 8,3%. Indexpunten zijn geen procenten.' },
    { category: 'valkuil', difficulty: 3, q: 'Wanneer is een stijging van 10 indexpunten ook precies 10%?', options: ['Als het oude indexcijfer 100 is', 'Altijd', 'Als het nieuwe indexcijfer 100 is', 'Nooit'], answer: 0, rationale: 'Alleen vanaf 100 geldt: 10 / 100 x 100% = 10%.' },
    { category: 'inflatie', difficulty: 1, q: 'Wat betekent inflatie van 2,7%?', options: ['Het algemeen prijspeil is gemiddeld 2,7% hoger dan een jaar eerder', 'Alle producten zijn exact 2,7% duurder', 'Het indexcijfer is altijd 2,7', 'De koopkracht stijgt met 2,7%'], answer: 0, rationale: 'Inflatie is een gemiddelde procentuele stijging van het prijspeil.' },
    { category: 'inflatie', difficulty: 2, q: 'Als prijzen 12% hoger liggen dan het basisjaar, welk indexcijfer hoort daarbij?', options: ['112', '12', '88', '120'], answer: 0, rationale: 'Basisjaar 100 plus 12% stijging geeft index 112.' },
    { category: 'inflatie', difficulty: 3, q: 'Waarom kan jouw persoonlijke inflatie anders voelen dan het CBS-cijfer?', options: ['Omdat het CBS een gemiddeld mandje gebruikt en jouw uitgavenpatroon kan afwijken', 'Omdat indexcijfers geen percentages zijn', 'Omdat inflatie alleen over benzine gaat', 'Omdat prijzen nooit dalen'], answer: 0, rationale: 'Inflatie is gebaseerd op een gemiddeld pakket goederen en diensten. Jouw eigen mandje kan anders zijn.' },
  ],
};

const newsDetectiveData = {
  meta: { parNr: PAR_NR, parName: PAR_NAME },
  article: {
    headline: 'CBS: inflatie in maart 2026 is 2,7 procent',
    body: 'Het CBS meldt dat consumentengoederen en -diensten in maart 2026 gemiddeld 2,7 procent duurder waren dan een jaar eerder. Zo een inflatiecijfer is een procentuele verandering van het algemene prijspeil. Om zulke prijsontwikkelingen door de tijd te vergelijken gebruikt het CBS indexcijfers: een basisjaar krijgt waarde 100 en latere waarden worden daaraan gerelateerd.',
    source: 'CBS',
    sourceDate: '2026-04',
    sourceUrl: 'https://www.cbs.nl/nl-nl/nieuws/2026/15/inflatie-in-maart-2-7-procent',
    visualAlt: 'Indexgrafiek waarin een basisjaar 100 is en latere prijzen hoger liggen',
  },
  rounds: [
    {
      type: 'concept',
      question: 'Welk begrip helpt het meest om het CBS-inflatiecijfer te begrijpen?',
      options: [
        { text: 'Procentuele verandering: prijzen zijn gemiddeld 2,7% hoger dan een jaar eerder', correct: true, feedback: 'Juist. Inflatie is een procentuele stijging van een prijsniveau ten opzichte van een eerdere periode.' },
        { text: 'Alternatieve kosten: huishoudens geven andere aankopen op', correct: false, feedback: 'Dat kan een gevolg zijn, maar het cijfer zelf is een procentuele prijsverandering.' },
        { text: 'Indexpunten: inflatie is altijd het verschil tussen twee indexcijfers', correct: false, feedback: 'Indexpunten kunnen helpen, maar de claim 2,7% is al een procentuele verandering.' },
        { text: 'Schaarste: er zijn te weinig producten', correct: false, feedback: 'Schaarste kan prijzen beinvloeden, maar dit nieuws gaat over meten met procenten en indexcijfers.' },
      ],
    },
    {
      type: 'consequence',
      question: 'Zet de meetketen in de juiste volgorde.',
      chain: [
        { text: 'CBS meet prijzen van een pakket consumentengoederen en diensten', position: 0 },
        { text: 'Die prijzen worden vergeleken met een eerdere periode of basiswaarde', position: 1 },
        { text: 'De verandering wordt uitgedrukt als percentage of indexcijfer', position: 2 },
        { text: 'Leerlingen moeten het verschil tussen indexpunten en procenten bewaken', position: 3 },
      ],
      distractors: [
        { text: 'Elke winkelprijs stijgt met exact hetzelfde percentage' },
        { text: 'Het basisjaar krijgt index 0' },
      ],
    },
    {
      type: 'model',
      question: 'Welk rekenmodel past bij een prijs van 100 naar 102,7?',
      options: [
        { id: 'procentuele-verandering', label: 'Procentuele verandering', description: '(nieuw - oud) / oud x 100% = (102,7 - 100) / 100 x 100% = 2,7%', correct: true, feedback: 'Juist. De oude waarde staat in de noemer.' },
        { id: 'absolute-verandering', label: 'Absolute verandering', description: 'Nieuw - oud = 2,7 punten', correct: false, feedback: 'Dit geeft alleen het verschil in punten, niet de procentuele verandering.' },
        { id: 'alternatieve-kosten', label: 'Alternatieve kosten', description: 'De waarde van het beste niet-gekozen alternatief', correct: false, feedback: 'Dat is een ander concept uit 1.1.1.' },
      ],
    },
    {
      type: 'error',
      fakeAnalysis: 'Een leerling schrijft: "De inflatie is 2,7 indexpunten, dus de prijzen zijn 2,7 euro duurder. Het maakt niet uit welk basisjaar het CBS gebruikt, want indexpunten en procenten zijn hetzelfde."',
      errorPhrase: 'indexpunten en procenten zijn hetzelfde',
      errorExplanation: 'De fout is dat indexpunten en procenten door elkaar worden gehaald. Een verschil in indexcijfers is een aantal indexpunten. Een procentuele verandering bereken je door het verschil te delen door de oude waarde of het oude indexcijfer.',
      distractorPhrases: ['2,7 euro duurder', 'welk basisjaar het CBS gebruikt', '2,7 indexpunten'],
    },
  ],
  lesLink: 'Dit nieuws komt terug bij indexcijfers, inflatie en het verschil tussen indexpunten en procentuele verandering.',
};

const procedureData = {
  meta: { parNr: PAR_NR, parName: PAR_NAME },
  procedures: [
    {
      id: 'procentuele-verandering',
      title: 'Procentuele verandering berekenen',
      icon: 'fa-percent',
      description: 'Bereken in drie stappen een stijging of daling in procenten.',
      steps: [
        { type: 'given', label: 'Gegeven', text: 'Een oude waarde en een nieuwe waarde, bijvoorbeeld een prijs van EUR 600 naar EUR 648.' },
        { type: 'choose', label: 'Stap 1', options: [
          { text: 'Noteer de oude waarde en de nieuwe waarde', correct: true },
          { text: 'Tel oude en nieuwe waarde bij elkaar op', correct: false, feedback: 'Je vergelijkt twee waarden; optellen helpt niet om de verandering te meten.' },
          { text: 'Kies de hoogste waarde als noemer', correct: false, feedback: 'De noemer is altijd de oude waarde, niet automatisch de hoogste.' },
        ] },
        { type: 'choose', label: 'Stap 2', options: [
          { text: 'Bereken (nieuw - oud) / oud x 100%', correct: true },
          { text: 'Bereken (nieuw - oud) / nieuw x 100%', correct: false, feedback: 'Dit is de klassieke fout: deel door de oude waarde.' },
          { text: 'Bereken nieuw / oud zonder x 100%', correct: false, feedback: 'Dan krijg je een verhouding, geen procentuele verandering.' },
        ] },
        { type: 'choose', label: 'Stap 3', options: [
          { text: 'Interpreteer het teken: positief is stijging, negatief is daling', correct: true },
          { text: 'Maak elke uitkomst positief', correct: false, feedback: 'Een minteken is betekenisvol: het geeft een daling aan.' },
          { text: 'Rond altijd af op hele tientallen', correct: false, feedback: 'Rond alleen af als de opdracht daarom vraagt.' },
        ] },
        { type: 'given', label: 'Resultaat', text: 'Je hebt de procentuele stijging of daling berekend ten opzichte van de oude waarde.' },
      ],
    },
    {
      id: 'indexcijfer',
      title: 'Indexcijfer berekenen',
      icon: 'fa-chart-line',
      description: 'Zet een waarde om naar een indexcijfer met basisjaar 100.',
      steps: [
        { type: 'given', label: 'Gegeven', text: 'Een basiswaarde en een waarde in een ander jaar.' },
        { type: 'choose', label: 'Stap 1', options: [
          { text: 'Bepaal het basisjaar en zet dat op index 100', correct: true },
          { text: 'Kies het hoogste jaar als basisjaar', correct: false, feedback: 'Het basisjaar staat in de opdracht of wordt bewust gekozen.' },
          { text: 'Zet het eerste getal op index 0', correct: false, feedback: 'Een indexreeks gebruikt 100 voor het basisjaar.' },
        ] },
        { type: 'choose', label: 'Stap 2', options: [
          { text: 'Bereken waarde / basiswaarde x 100', correct: true },
          { text: 'Bereken basiswaarde / waarde x 100', correct: false, feedback: 'Dan draai je de verhouding om.' },
          { text: 'Bereken waarde - basiswaarde', correct: false, feedback: 'Dat is een absoluut verschil, geen indexcijfer.' },
        ] },
        { type: 'choose', label: 'Stap 3', options: [
          { text: 'Interpreteer: boven 100 is hoger, onder 100 is lager dan het basisjaar', correct: true },
          { text: 'Interpreteer elk indexcijfer als eurobedrag', correct: false, feedback: 'Een indexcijfer is een verhoudingsgetal, geen eurobedrag.' },
          { text: 'Noem elk verschil tussen indexcijfers een procent', correct: false, feedback: 'Dat verschil heet indexpunten.' },
        ] },
        { type: 'given', label: 'Resultaat', text: 'Je hebt de waarde vergeleken met het basisjaar.' },
      ],
    },
  ],
};

const csvHeaders = [
  'id', 'structure_type', 'structure_label', 'problem_text',
  'step_1_label', 'step_1_detail', 'step_1_formula',
  'step_2_label', 'step_2_detail', 'step_2_formula',
  'step_3_label', 'step_3_detail', 'step_3_formula',
  'distractor_1_label', 'distractor_1_detail', 'distractor_1_formula',
  'distractor_2_label', 'distractor_2_detail', 'distractor_2_formula',
  'distractor_3_label', 'distractor_3_detail', 'distractor_3_formula',
  'subq_1', 'subq_2', 'subq_3', 'subq_distractor_1', 'subq_distractor_2',
  'error_step_index', 'error_wrong_label', 'error_wrong_detail', 'error_wrong_formula',
  'flow_1_type', 'flow_1_text', 'flow_2_type', 'flow_2_text', 'flow_3_type', 'flow_3_text',
  'flow_4_type', 'flow_4_text', 'flow_5_type', 'flow_5_text', 'flow_6_type', 'flow_6_text',
];

function reasoningRow(id, type, label, problem, oldValue, newValue, result, context) {
  const diff = newValue - oldValue;
  return {
    id, structure_type: type, structure_label: label, problem_text: problem,
    step_1_label: 'Noteer oud en nieuw', step_1_detail: `Oud = ${oldValue}; nieuw = ${newValue}.`, step_1_formula: '',
    step_2_label: 'Bereken de verandering', step_2_detail: `Nieuw - oud = ${newValue} - ${oldValue} = ${diff}.`, step_2_formula: `${newValue} - ${oldValue} = ${diff}`,
    step_3_label: 'Deel door oud en interpreteer', step_3_detail: `(${diff} / ${oldValue}) x 100% = ${result}. ${context}`, step_3_formula: `(${diff} / ${oldValue}) x 100%`,
    distractor_1_label: 'Deel door nieuw', distractor_1_detail: 'Dit gebruikt de verkeerde noemer; de oude waarde hoort onder de breuk.', distractor_1_formula: `(${diff} / ${newValue}) x 100%`,
    distractor_2_label: 'Gebruik alleen het verschil', distractor_2_detail: 'Een absoluut verschil is nog geen percentage.', distractor_2_formula: `${diff}`,
    distractor_3_label: 'Maak de uitkomst altijd positief', distractor_3_detail: 'Een minteken geeft juist een daling aan.', distractor_3_formula: `abs(${diff}) / ${oldValue} x 100%`,
    subq_1: 'Wat is de oude waarde?', subq_2: 'Wat is de nieuwe waarde?', subq_3: 'Welke procentuele verandering hoort daarbij?', subq_distractor_1: 'Wat is het gemiddelde van oud en nieuw?', subq_distractor_2: 'Wat is de hoogste waarde?',
    error_step_index: '3', error_wrong_label: 'Deel door nieuw', error_wrong_detail: 'De leerling deelt door de nieuwe waarde en onderschat of overschat daardoor de procentuele verandering.', error_wrong_formula: `(${diff} / ${newValue}) x 100%`,
    flow_1_type: 'given', flow_1_text: `Oude waarde ${oldValue}`,
    flow_2_type: 'given', flow_2_text: `Nieuwe waarde ${newValue}`,
    flow_3_type: 'step', flow_3_text: `Verandering ${diff}`,
    flow_4_type: 'step', flow_4_text: `Deel door oude waarde ${oldValue}`,
    flow_5_type: 'result', flow_5_text: result,
    flow_6_type: 'result', flow_6_text: context,
  };
}

const reasoningRows = [
  reasoningRow(1, 'A', 'Procentuele verandering', 'Een telefoon stijgt van EUR 600 naar EUR 648. Bereken de procentuele stijging.', 600, 648, '8%', 'De prijs stijgt.'),
  reasoningRow(2, 'A', 'Procentuele verandering', 'Een fiets daalt van EUR 920 naar EUR 800. Bereken de procentuele daling.', 920, 800, '-13,0%', 'De prijs daalt.'),
  reasoningRow(3, 'B', 'Indexcijfer berekenen', 'Een mandje kost in het basisjaar EUR 120 en later EUR 150. Bereken het indexcijfer.', 120, 150, '125', 'Het prijsniveau ligt 25% boven het basisjaar.'),
  reasoningRow(4, 'B', 'Indexcijfer berekenen', 'Een loon is in het basisjaar EUR 3000 en later EUR 3240. Bereken het indexcijfer.', 3000, 3240, '108', 'Het loon ligt 8% boven het basisjaar.'),
  reasoningRow(5, 'C', 'Indexpunten versus procenten', 'Een index stijgt van 125 naar 135. Bereken de procentuele stijging.', 125, 135, '8%', 'Het verschil is 10 indexpunten, niet 10%.'),
  reasoningRow(6, 'C', 'Indexpunten versus procenten', 'Een index daalt van 115 naar 112. Bereken de procentuele verandering.', 115, 112, '-2,6%', 'Het verschil is -3 indexpunten; procentueel is dat -2,6%.'),
];

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[;"\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeReasoningCsv() {
  ensureDir(path.dirname(REASONING_SOURCE));
  const lines = [csvHeaders.join(';')];
  for (const row of reasoningRows) {
    lines.push(csvHeaders.map(h => csvEscape(row[h])).join(';'));
  }
  fs.writeFileSync(REASONING_SOURCE, `${lines.join('\n')}\n`, 'utf8');
  console.log(`written ${REASONING_SOURCE}`);
}

function updateManifest() {
  const cfg = JSON.parse(fs.readFileSync(DEPLOY_CONFIG, 'utf8'));
  const paragraph = cfg.paragraphs.find(p => p.id === PAR_NR);
  if (!paragraph) throw new Error(`Paragraph ${PAR_NR} not found in deploy-config.json`);
  if (!paragraph.skilltree) paragraph.skilltree = { skills: null };
  fs.writeFileSync(DEPLOY_CONFIG, `${JSON.stringify(cfg, null, 2)}\n`, 'utf8');
  console.log(`updated ${DEPLOY_CONFIG}`);
}

writeJs(path.join(SHARED, 'questions', `${PAR_NR}.js`), 'QUIZ_DATA', quizData);
writeJs(path.join(SHARED, 'newsdetective', `${PAR_NR}.js`), 'NEWS_DETECTIVE_DATA', newsDetectiveData);
writeJs(path.join(SHARED, 'procedure', `${PAR_NR}.js`), 'PROCEDURE_DATA', procedureData);
writeReasoningCsv();
updateManifest();
