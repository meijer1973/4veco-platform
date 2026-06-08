const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const reviewedExitTicket = require(path.join(
  ROOT,
  'source-data',
  'book-1',
  'exit-ticket',
  '1.1.2-exit-ticket.json'
));

const sprintId = 'MTU-ANS-PROOF-IMPL-1';
const sourceTaskId = 'prijsstijging-procent';
const sourceTaskWrapper = reviewedExitTicket.tasks.find((task) => task.id === sourceTaskId);
if (!sourceTaskWrapper || !sourceTaskWrapper.taskShell) {
  throw new Error(`Missing reviewed 1.1.2 task_shell task ${sourceTaskId}`);
}

const sourceTask = sourceTaskWrapper.taskShell;
const reviewedRoute = {
  paragraph: '1.1.2',
  title: 'Percentages en indexcijfers',
  source_file: 'source-data/book-1/exit-ticket/1.1.2-exit-ticket.json',
  source_task_id: sourceTaskId,
  reviewed_surface: 'target_equivalent_exit_ticket',
  route_href: '1.1.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20wiskundevaardigheden.html',
  adoption_authorized: false,
  target_equivalent_claim: false,
  product_route_adoption: false
};

const requiredActionParts = [
  'formula_or_calculation_method',
  'labelled_substitution',
  'intermediate_work',
  'final_answer',
  'unit_or_notation',
  'short_contextual_conclusion'
];

const strictA96Task = {
  id: 'a96-112-prijsstijging-procent',
  family: 'calculation_work_capture',
  skillLabel: 'Bereken-vraag beantwoorden',
  purpose: 'Laat de volledige berekening zien bij de 1.1.2 fietsprijs-vraag.',
  prompt: sourceTask.prompt,
  contextRefs: ['ctx-112-fietsprijs'],
  interaction: {
    workLabel: 'Uitwerking met korte conclusie',
    finalAnswerLabel: 'Eindantwoord',
    finalAnswerPlaceholder: 'Vul het getal in',
    placeholder: 'Schrijf formule, labels, tussenstappen en conclusie.',
    unitNotationLabel: 'Eenheid of notatie',
    unitNotationPlaceholder: 'Vul de notatie in',
    showCriteriaBeforeCheck: false
  },
  expected: {
    kind: 'calculation',
    finalAnswer: {
      kind: 'text',
      accepted: ['15', '15%', '15 procent', '15,0', '15,0%', '15.0', '15.0%']
    },
    unitNotation: {
      kind: 'text',
      accepted: ['%', 'procent', 'procentteken'],
      required: true
    },
    workRequired: true,
    criteria: [
      'Gebruik een formule of rekenregel voor procentuele verandering.',
      'Vul nieuwe en oude prijs met labels in.',
      'Laat verschil, deling en procentstap zien.',
      'Geef eindantwoord, notatie en conclusie in context.'
    ],
    requiredWorkText: [
      {
        label: 'formula or method',
        any: [
          'procentuele verandering',
          'nieuw - oud',
          'nieuw min oud',
          'nieuwe prijs - oude prijs',
          '(nieuw - oud) / oud'
        ]
      },
      {
        label: 'labelled new price',
        any: [
          'nieuwe prijs = 920',
          'nieuw = 920',
          'nieuwe prijs 920',
          'nieuw 920'
        ]
      },
      {
        label: 'labelled old price',
        any: [
          'oude prijs = 800',
          'oud = 800',
          'oude prijs 800',
          'oud 800'
        ]
      },
      {
        label: 'difference intermediate',
        any: [
          '920 - 800 = 120',
          '920-800=120',
          'verschil = 120',
          'verschil 120'
        ]
      },
      {
        label: 'division intermediate',
        any: [
          '120 / 800',
          '120/800',
          '120 : 800',
          '120:800',
          'gedeeld door 800'
        ]
      },
      {
        label: 'percent intermediate',
        any: [
          '0,15 x 100',
          '0.15 x 100',
          '0,15 * 100',
          '0.15 * 100',
          '15%'
        ]
      },
      {
        label: 'contextual conclusion with direction',
        any: [
          'prijs stijgt',
          'stijgt met 15',
          'fiets wordt 15',
          'de stijging is 15'
        ]
      }
    ],
    answerFormProof: {
      unit_id: 'A96',
      route_specific: true,
      required_action_parts: requiredActionParts.slice(),
      modifier_units: [],
      standalone_modifier_pass_allowed: false
    }
  },
  feedback: {
    matchTitle: 'Berekening compleet',
    matchText: 'Je laat methode, invulling, tussenstappen, notatie en conclusie zien.',
    retryTitle: 'Maak je berekening controleerbaar',
    retryText: 'Laat niet alleen de uitkomst zien: noteer formule, labels, tussenstap, notatie en korte conclusie.'
  },
  practiceRoute: {
    label: 'Volgende actie: oefen percentages in de 1.1.2 rekenroute',
    href: reviewedRoute.route_href
  }
};

const taskSet = {
  schema_version: 1,
  title: 'A96 bereken-vraag proof lab',
  eyebrow: 'Review-only bewijs',
  intro: 'Deze labkaart gebruikt de reviewed 1.1.2 fietsprijs-vraag en controleert de volledige bereken-antwoordvorm.',
  surfaceKind: 'review_lab',
  contextBlocks: [
    {
      id: 'ctx-112-fietsprijs',
      type: 'source_excerpt',
      sourceLabel: 'Reviewed 1.1.2 calculation surface',
      caption: 'Bron 1 Fietsprijs',
      bodyMarkdown: 'Een fiets kost eerst 800 euro en daarna 920 euro.',
      sourceRefs: [reviewedRoute.source_file + '#' + reviewedRoute.source_task_id],
      accessibilitySummary: 'Tekstbron met de oude fietsprijs 800 euro en de nieuwe fietsprijs 920 euro.'
    }
  ],
  tasks: [strictA96Task]
};

const passingResponse = {
  work: [
    'Formule: procentuele verandering = (nieuw - oud) / oud x 100.',
    'Nieuwe prijs = 920, oude prijs = 800.',
    'Verschil = 920 - 800 = 120.',
    '120 / 800 = 0,15 en 0,15 x 100 = 15%.',
    'De prijs stijgt met 15 procent.'
  ].join('\n'),
  finalAnswer: '15',
  unitNotation: '%'
};

const negativeResponses = {
  finalAnswerOnly: {
    work: '',
    finalAnswer: '15',
    unitNotation: '%'
  },
  sourceOnly: {
    work: 'Bron: de fiets kost eerst 800 euro en daarna 920 euro. Nieuwe prijs 920, oude prijs 800.',
    finalAnswer: '15',
    unitNotation: '%'
  },
  directionFree: {
    work: [
      'Formule: procentuele verandering = (nieuw - oud) / oud x 100.',
      'Nieuwe prijs = 920, oude prijs = 800.',
      'Verschil = 920 - 800 = 120.',
      '120 / 800 = 0,15 en 0,15 x 100 = 15%.'
    ].join('\n'),
    finalAnswer: '15',
    unitNotation: '%'
  },
  exampleOnly: {
    work: 'Bijvoorbeeld: bij 800 en 920 kom je op 15%.',
    finalAnswer: '15',
    unitNotation: '%'
  },
  notationOmitted: {
    work: passingResponse.work,
    finalAnswer: '15',
    unitNotation: ''
  },
  standaloneA81: {
    work: 'Ik gebruik de bron: eerst 800 euro en daarna 920 euro.',
    finalAnswer: '',
    unitNotation: ''
  }
};

module.exports = {
  sprintId,
  reviewedRoute,
  requiredActionParts,
  sourceTask,
  sourceTaskId,
  strictA96Task,
  taskSet,
  passingResponse,
  negativeResponses
};
