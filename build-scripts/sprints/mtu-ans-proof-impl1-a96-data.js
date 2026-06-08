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
  family: 'calculation_answer_form_capture',
  skillLabel: 'Bereken-vraag beantwoorden',
  purpose: 'Bouw de bereken-antwoordvorm bij de reviewed fietsprijs-vraag.',
  prompt: sourceTask.prompt,
  contextRefs: ['ctx-112-fietsprijs', 'ctx-112-fietsprijs-table'],
  interaction: {
    formula: {
      title: 'Kies de formule of rekenregel',
      purpose: 'Gebruik de blokken om de procentuele verandering te bouwen.',
      tokenBankLabel: 'Formuleblokken',
      sequenceLabel: 'Jouw formule',
      placeholder: 'Zet de blokken in de juiste volgorde.',
      separator: ' ',
      allowReuse: true,
      tokens: [
        { id: 'times100', label: 'x 100%', kind: 'answer', category: 'multiplier', maxUses: 1 },
        { id: 'newPrice', label: 'nieuwe prijs', kind: 'answer', category: 'variable', maxUses: 1 },
        { id: 'plus', label: '+', kind: 'distractor', category: 'operator', maxUses: 1, distractorFor: 'minus' },
        { id: 'open', label: '(', kind: 'answer', category: 'grouping', maxUses: 1 },
        { id: 'divide', label: '/', kind: 'answer', category: 'operator', maxUses: 1 },
        { id: 'oldMinusNew', label: 'oude prijs - nieuwe prijs', kind: 'distractor', category: 'variable', maxUses: 1, distractorFor: 'newPrice' },
        { id: 'oldPrice', label: 'oude prijs', kind: 'answer', category: 'variable', maxUses: 2, usageHint: 'Gebruik deze blok twee keer.' },
        { id: 'close', label: ')', kind: 'answer', category: 'grouping', maxUses: 1 },
        { id: 'minus', label: '-', kind: 'answer', category: 'operator', maxUses: 1 },
        { id: 'times10', label: 'x 10', kind: 'distractor', category: 'multiplier', maxUses: 1, distractorFor: 'times100' },
        { id: 'newDenominator', label: 'nieuwe prijs als noemer', kind: 'distractor', category: 'denominator', maxUses: 1, distractorFor: 'oldPrice' }
      ]
    },
    substitution: {
      title: 'Vul de bronwaarden in',
      purpose: 'Laat zien welke waarde bij elk label hoort.',
      template: '(nieuwe prijs - oude prijs) / oude prijs x 100%',
      fields: [
        { id: 'newPrice', label: 'nieuwe prijs', placeholder: '920', inputMode: 'decimal' },
        { id: 'oldPriceNumerator', label: 'oude prijs in teller', placeholder: '800', inputMode: 'decimal' },
        { id: 'oldPriceDenominator', label: 'oude prijs in noemer', placeholder: '800', inputMode: 'decimal' }
      ]
    },
    answer: {
      title: 'Geef het eindantwoord',
      purpose: 'Noteer de uitkomst en de vereiste procentnotatie.',
      finalAnswerLabel: 'Eindantwoord',
      finalAnswerPlaceholder: '15',
      unitNotationLabel: 'Eenheid of notatie',
      unitNotationPlaceholder: '%'
    },
    context: {
      title: 'Schrijf de conclusie',
      purpose: 'Noem kort wat de berekening betekent voor de fietsprijs.',
      label: 'Contextuele conclusie',
      placeholder: 'De prijs van de fiets stijgt met ...'
    },
    showCriteriaBeforeCheck: false
  },
  expected: {
    kind: 'calculation_answer_form',
    methodTokens: ['open', 'newPrice', 'minus', 'oldPrice', 'close', 'divide', 'oldPrice', 'times100'],
    tokenDisplayOrderMustNotEqualMethodTokens: true,
    substitution: {
      newPrice: { kind: 'number', value: 920 },
      oldPriceNumerator: { kind: 'number', value: 800 },
      oldPriceDenominator: { kind: 'number', value: 800 }
    },
    finalAnswer: {
      kind: 'number_or_percent_text',
      value: 15,
      acceptedNotations: ['15', '15%', '15 procent', '15,0', '15,0%', '15.0', '15.0%']
    },
    notation: {
      kind: 'text',
      accepted: ['%', 'procent', 'procentteken'],
      required: true
    },
    conclusion: {
      requiredTextGroups: [
        ['prijs', 'fiets'],
        ['stijgt', 'stijging', 'duurder', 'gestegen'],
        ['15', 'vijftien']
      ]
    },
    visualTokenIdentityPolicy: {
      forbid_identical_labels_with_different_answer_ids: true,
      reusable_answer_token_ids: ['oldPrice'],
      rationale: 'De oude prijs komt in teller en noemer terug als dezelfde zichtbare bouwsteen.'
    },
    criteria: [
      'Gebruik een formule of rekenregel voor procentuele verandering.',
      'Vul nieuwe en oude prijs met labels in.',
      'Laat teller, noemer en procentstap controleerbaar zien.',
      'Geef eindantwoord, notatie en conclusie in context.'
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
    retryText: 'Vul de formule, bronwaarden, uitkomst, notatie en contextzin apart in.'
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
    },
    {
      id: 'ctx-112-fietsprijs-table',
      type: 'table',
      sourceLabel: 'Reviewed 1.1.2 calculation surface',
      caption: 'Tabel 1 Fietsprijs',
      columns: ['Moment', 'Prijs'],
      rows: [
        ['Eerst', '800 euro'],
        ['Daarna', '920 euro']
      ],
      altText: 'Tabel met oude fietsprijs 800 euro en nieuwe fietsprijs 920 euro.',
      sourceMaterialId: reviewedRoute.source_file + '#' + reviewedRoute.source_task_id
    }
  ],
  tasks: [strictA96Task]
};

const passingResponse = {
  methodTokens: ['open', 'newPrice', 'minus', 'oldPrice', 'close', 'divide', 'oldPrice', 'times100'],
  substitution: {
    newPrice: '920',
    oldPriceNumerator: '800',
    oldPriceDenominator: '800'
  },
  finalAnswer: '15',
  notation: '%',
  conclusion: 'De prijs van de fiets stijgt met 15 procent.'
};

const negativeResponses = {
  finalAnswerOnly: {
    methodTokens: [],
    substitution: {},
    finalAnswer: '15',
    notation: '%',
    conclusion: 'De prijs van de fiets stijgt met 15 procent.'
  },
  sourceOnly: {
    methodTokens: [],
    substitution: {
      newPrice: '920',
      oldPriceNumerator: '800',
      oldPriceDenominator: '800'
    },
    finalAnswer: '',
    notation: '',
    conclusion: 'De bron zegt dat de fiets eerst 800 euro kost en daarna 920 euro.'
  },
  directionFree: {
    methodTokens: passingResponse.methodTokens.slice(),
    substitution: {
      newPrice: '920',
      oldPriceNumerator: '800',
      oldPriceDenominator: '800'
    },
    finalAnswer: '15',
    notation: '%',
    conclusion: 'De fiets heeft 15 procent.'
  },
  exampleOnly: {
    methodTokens: passingResponse.methodTokens.slice(),
    substitution: {},
    finalAnswer: '15%',
    notation: '%',
    conclusion: 'Bijvoorbeeld 15 procent.'
  },
  notationOmitted: {
    methodTokens: passingResponse.methodTokens.slice(),
    substitution: {
      newPrice: '920',
      oldPriceNumerator: '800',
      oldPriceDenominator: '800'
    },
    finalAnswer: '15',
    notation: '',
    conclusion: 'De prijs van de fiets stijgt met 15 procent.'
  },
  standaloneA81: {
    methodTokens: [],
    substitution: {},
    finalAnswer: '',
    notation: '',
    conclusion: 'Ik gebruik de bron: eerst 800 euro en daarna 920 euro.'
  },
  wrongDenominator: {
    methodTokens: passingResponse.methodTokens.slice(),
    substitution: {
      newPrice: '920',
      oldPriceNumerator: '800',
      oldPriceDenominator: '920'
    },
    finalAnswer: '15',
    notation: '%',
    conclusion: 'De prijs van de fiets stijgt met 15 procent.'
  },
  missingSubstitutionField: {
    methodTokens: passingResponse.methodTokens.slice(),
    substitution: {
      newPrice: '920',
      oldPriceNumerator: '800',
      oldPriceDenominator: ''
    },
    finalAnswer: '15',
    notation: '%',
    conclusion: 'De prijs van de fiets stijgt met 15 procent.'
  },
  leftToRightTokenClickOrder: {
    methodTokens: strictA96Task.interaction.formula.tokens.map((token) => token.id),
    substitution: {
      newPrice: '920',
      oldPriceNumerator: '800',
      oldPriceDenominator: '800'
    },
    finalAnswer: '15',
    notation: '%',
    conclusion: 'De prijs van de fiets stijgt met 15 procent.'
  }
};

const invalidTaskFixtures = {
  visuallyIdenticalOldPriceTokensWithDistinctIds: (() => {
    const fixture = JSON.parse(JSON.stringify(strictA96Task));
    fixture.id = 'a96-invalid-identical-old-price-tokens';
    fixture.interaction.formula.tokens.push({
      id: 'oldPriceDenominatorOnly',
      label: 'oude prijs',
      kind: 'answer',
      category: 'variable',
      maxUses: 1
    });
    fixture.expected.methodTokens = ['open', 'newPrice', 'minus', 'oldPrice', 'close', 'divide', 'oldPriceDenominatorOnly', 'times100'];
    return fixture;
  })()
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
  negativeResponses,
  invalidTaskFixtures
};
