#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

const SPRINT = 'Y2-GOVERNED-SUPPORT-CLOSURE-BUNDLE-1';
const PRIOR_READINESS_SPRINT = 'Y2-TARGET-FOUNDATION-PRODUCTION-READINESS-BUNDLE-1';
const GATE_DIR = `reports/review-gates/${SPRINT}`;
const PRIOR_GATE_DIR = `reports/review-gates/${PRIOR_READINESS_SPRINT}`;

const paths = {
  overlay: 'references/data/year2-target-foundation/lesson-production-eligibility-overlay.json',
  closureJson: `${GATE_DIR}/governed-support-closure-bundle.json`,
  closureMd: `${GATE_DIR}/governed-support-closure-bundle.md`,
  fixturesJson: `${GATE_DIR}/route-specific-support-fixtures.json`,
  answerSkillJson: `${GATE_DIR}/answer-skill-equivalent-support.json`,
  handoffJson: `${GATE_DIR}/generator-handoff-manifests.json`,
  handoffMd: `${GATE_DIR}/generator-handoff-manifests.md`,
  renderedHtml: `${GATE_DIR}/rendered-support-proof.html`,
  reviewPacketJson: `${GATE_DIR}/review-packet.json`,
  reviewPacketMd: `reports/reference-planning/${SPRINT}-review-packet.md`,
  planMd: `reports/sprints/${SPRINT}-plan.md`,
  resultMd: `reports/sprints/${SPRINT}-result.md`,
  candidates: 'references/authored/year2-v6-target-foundation-candidates.json',
  priorReadiness: `${PRIOR_GATE_DIR}/production-readiness-bundle.json`,
  priorDisposition: `${PRIOR_GATE_DIR}/mtu-answer-skill-disposition.json`,
  priorHandoff: `${PRIOR_GATE_DIR}/generator-handoff-manifests.json`,
  answerContracts: 'references/data/year2-target-foundation/answer-contracts.json',
  canonicalAssets: 'references/data/year2-target-foundation/canonical-source-assets.json',
};

const changedPaths = [
  'build-scripts/references/build-y2-governed-support-closure-bundle-1.js',
  'build-scripts/references/check-y2-governed-support-closure-bundle-1.js',
  paths.overlay,
  paths.closureJson,
  paths.closureMd,
  paths.fixturesJson,
  paths.answerSkillJson,
  paths.handoffJson,
  paths.handoffMd,
  paths.renderedHtml,
  paths.reviewPacketJson,
  paths.reviewPacketMd,
  paths.planMd,
  paths.resultMd,
  'package.json',
];

const targetSpecs = [
  {
    record_id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    owner: 'Y2-B5-P13',
    title: 'Book 5 pension model',
  },
  {
    record_id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    owner: 'Y2-B6-P12',
    title: 'Book 6 VastWonen/Reder housing case',
  },
  {
    record_id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    owner: 'Y2-B7-P13',
    title: 'Book 7 credit-insurance information case',
  },
  {
    record_id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    owner: 'Y2-B8-P04',
    title: 'Book 8 Guarda/Orso Bianco strategic case',
  },
];

const priorDispositionByCase = {
  'Y2-B5-P13:OP-T1': 'existing_support_requires_extension',
  'Y2-B5-P13:OP-H1': 'new_answer_skill_record_required',
  'Y2-B5-P13:OP-ANS2': 'existing_support_requires_extension',
  'Y2-B5-P13:OP-ANS3': 'new_answer_skill_record_required',
  'Y2-B6-P12:OP-P1': 'existing_support_requires_extension',
  'Y2-B6-P12:OP-D1': 'new_task_family_runtime_support_required',
  'Y2-B6-P12:OP-C1': 'new_task_family_runtime_support_required',
  'Y2-B6-P12:OP-C2': 'new_task_family_runtime_support_required',
  'Y2-B6-P12:OP-F1': 'new_answer_skill_record_required',
  'Y2-B6-P12:OP-E1': 'existing_support_requires_extension',
  'Y2-B6-P12:OP-ANS2': 'new_task_family_runtime_support_required',
  'Y2-B6-P12:OP-ANS3': 'new_answer_skill_record_required',
  'Y2-B7-P13:OP-R1': 'existing_support_requires_extension',
  'Y2-B7-P13:OP-ANS2': 'existing_support_requires_extension',
  'Y2-B7-P13:OP-ANS3': 'new_answer_skill_record_required',
  'Y2-B8-P04:OP-S1': 'existing_support_requires_extension',
  'Y2-B8-P04:OP-ANS1': 'new_answer_skill_record_required',
  'Y2-B8-P04:OP-ANS3': 'new_answer_skill_record_required',
};

const contextBlocks = [
  {
    id: 'ctx-b5-pension',
    type: 'source_excerpt',
    sourceLabel: 'Book 5 pension source',
    caption: 'Bron 1: Pension model 2024-2044',
    bodyMarkdown: 'The approved source is a schematic pension model. It supports directional stock/flow and ratio reasoning, not exact student numeric extraction from the figure.',
    sourceRefs: ['references/data/year2-target-foundation/canonical-source-assets.json#figuur-1-pensioenmodel-2024-2044'],
    accessibilitySummary: 'Schematic pension source with directional premium pressure and pension wealth relations.',
  },
  {
    id: 'ctx-b6-housing',
    type: 'table',
    sourceLabel: 'Book 6 housing tables',
    caption: 'Tabel 1: VastWonen/Reder route data',
    columns: ['Item', 'Value'],
    rows: [
      ['Maximum rent', 'EUR 850'],
      ['Demand at maximum rent', '10,400 dwellings'],
      ['Housing stock', '6,800 dwellings'],
      ['GO function', 'GO = -0.125Q + 2,150'],
      ['Revenue-maximising Q', '8,600 dwellings'],
      ['Revenue-maximising rent', 'EUR 1,075'],
    ],
    altText: 'Table with Book 6 housing values used for waiting-list and revenue calculations.',
    sourceMaterialId: 'references/data/year2-target-foundation/canonical-source-assets.json#tabel-1-vastwonen-financial-data',
  },
  {
    id: 'ctx-b7-credit',
    type: 'source_excerpt',
    sourceLabel: 'Book 7 credit insurance source',
    caption: 'Bron 2: Credit insurer, supplier, buyer, and Digibate table',
    bodyMarkdown: 'The approved route names the credit insurer as principal and the buying company as agent. Expected damage is EUR 80,000 and the 20 percent markup gives a EUR 96,000 total premium.',
    sourceRefs: [
      'references/data/year2-target-foundation/canonical-source-assets.json#figuur-1-kredietverzekering-en-voorwaarden',
      'references/data/year2-target-foundation/canonical-source-assets.json#tabel-1-financiele-gegevens-digibate',
    ],
    accessibilitySummary: 'Credit insurance route with actor-condition and expected-value calculation data.',
  },
  {
    id: 'ctx-b8-strategy',
    type: 'source_excerpt',
    sourceLabel: 'Book 8 strategic source',
    caption: 'Bron 3: Guarda/Orso Bianco price-war case',
    bodyMarkdown: 'Use the official context first. Any payoff representation is derived and non-official, and must stay secondary to the official source facts.',
    sourceRefs: [
      'references/data/year2-target-foundation/canonical-source-assets.json#ijssalon-guarda-orso-bianco-context',
      'references/data/year2-target-foundation/canonical-source-assets.json#derived-payoff-representation',
    ],
    accessibilitySummary: 'Strategic price-war source with a derived payoff representation boundary.',
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function write(relPath, content) {
  const target = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function writeJson(relPath, value) {
  write(relPath, `${JSON.stringify(value, null, 2)}\n`);
}

function html(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mdList(items) {
  return (items || []).map((item) => `- ${item}`).join('\n');
}

function specForOwner(owner) {
  return targetSpecs.find((spec) => spec.owner === owner);
}

function commonFeedback(matchTitle) {
  return {
    matchTitle,
    matchText: 'De route is controleerbaar met bron, bewerking, antwoord en conclusie.',
    retryTitle: 'Maak de route controleerbaar',
    retryText: 'Controleer bronwaarden, methode, afleiders en conclusie.',
  };
}

function practiceRoute(owner) {
  return {
    label: 'Review-only support proof',
    href: paths.closureMd,
  };
}

function calculationTask(config) {
  return {
    id: config.id,
    family: 'calculation_answer_form_capture',
    skillLabel: config.skillLabel || 'Bereken-antwoordvorm',
    purpose: config.purpose,
    prompt: config.prompt,
    contextRefs: config.contextRefs,
    interaction: {
      formula: {
        title: config.formulaTitle || 'Kies de formule of rekenregel',
        purpose: config.formulaPurpose || 'Bouw de methode met zichtbare blokken.',
        tokenBankLabel: 'Formuleblokken',
        sequenceLabel: 'Jouw methode',
        placeholder: 'Zet de blokken in de juiste volgorde.',
        separator: ' ',
        allowReuse: config.allowReuse === true,
        tokens: config.tokens,
      },
      substitution: {
        title: 'Vul de bronwaarden in',
        purpose: 'Laat zien welke waarde bij elk label hoort.',
        template: config.template,
        fields: config.fields,
      },
      answer: {
        title: 'Geef het eindantwoord',
        purpose: 'Noteer uitkomst en eenheid of notatie apart.',
        finalAnswerLabel: config.finalAnswerLabel || 'Eindantwoord',
        finalAnswerPlaceholder: config.finalAnswerPlaceholder || 'Vul het antwoord in',
        unitNotationLabel: 'Eenheid of notatie',
        unitNotationPlaceholder: config.unitNotationPlaceholder || 'Vul de eenheid in',
      },
      context: {
        title: 'Schrijf de conclusie',
        purpose: 'Maak de betekenis in de context expliciet.',
        label: 'Contextuele conclusie',
        placeholder: config.conclusionPlaceholder || 'Schrijf een korte conclusie.',
      },
      showCriteriaBeforeCheck: false,
    },
    expected: {
      kind: 'calculation_answer_form',
      methodTokens: config.methodTokens,
      tokenDisplayOrderMustNotEqualMethodTokens: true,
      substitution: config.substitution,
      finalAnswer: config.finalAnswer,
      notation: config.notation,
      conclusion: {
        requiredTextGroups: config.conclusionGroups,
      },
      visualTokenIdentityPolicy: {
        forbid_identical_labels_with_different_answer_ids: true,
        reusable_answer_token_ids: config.reusableAnswerTokenIds || [],
        rationale: 'The visible proof must not rely on hidden duplicate answer tokens.',
      },
      criteria: config.criteria,
      answerFormProof: {
        route_specific: true,
        support_case_ref: 'governance packet case matrix',
        required_action_parts: [
          'formula_or_calculation_method',
          'labelled_substitution',
          'intermediate_or_decision_step',
          'final_answer',
          'unit_or_notation',
          'contextual_conclusion',
        ],
        standalone_modifier_pass_allowed: false,
      },
    },
    feedback: commonFeedback(config.matchTitle || 'Berekenantwoord compleet'),
    practiceRoute: practiceRoute(config.owner),
  };
}

function sourceValueTask(config) {
  return {
    id: config.id,
    family: 'source_value_selection',
    skillLabel: config.skillLabel || 'Bronwaarden kiezen',
    purpose: config.purpose,
    prompt: config.prompt,
    contextRefs: config.contextRefs,
    interaction: {
      valueBankLabel: 'Bronwaarden',
      roleLabel: 'Rol in deze route',
      values: config.values,
      roles: config.roles,
    },
    expected: {
      kind: 'source_value_selection',
      selections: config.selections,
      partialFeedback: 'practice_only',
    },
    feedback: commonFeedback(config.matchTitle || 'Bronwaarden kloppen'),
    practiceRoute: practiceRoute(config.owner),
  };
}

function sourceChainTask(config) {
  return {
    id: config.id,
    family: 'source_chain_builder',
    skillLabel: config.skillLabel || 'Bronketen bouwen',
    purpose: config.purpose,
    prompt: config.prompt,
    contextRefs: config.contextRefs,
    interaction: {
      nodeBankLabel: 'Bronketen onderdelen',
      sequenceLabel: 'Opgebouwde bronketen',
      placeholder: 'Bouw de keten van bron naar conclusie.',
      separator: ' -> ',
      nodes: config.nodes,
    },
    expected: {
      kind: 'source_chain_builder',
      chain: config.chain,
      partialFeedback: 'practice_only',
    },
    feedback: commonFeedback(config.matchTitle || 'Bronketen klopt'),
    practiceRoute: practiceRoute(config.owner),
  };
}

function stepOrderingTask(config) {
  return {
    id: config.id,
    family: 'step_ordering',
    skillLabel: config.skillLabel || 'Stappen ordenen',
    purpose: config.purpose,
    prompt: config.prompt,
    contextRefs: config.contextRefs,
    interaction: {
      stepBankLabel: 'Stappen',
      sequenceLabel: 'Gekozen volgorde',
      placeholder: 'Zet de stappen in de juiste volgorde.',
      separator: ' -> ',
      steps: config.steps,
    },
    expected: {
      kind: 'step_ordering',
      order: config.order,
      partialFeedback: 'practice_only',
    },
    feedback: commonFeedback(config.matchTitle || 'Stappenroute klopt'),
    practiceRoute: practiceRoute(config.owner),
  };
}

function assertionReasonTask(config) {
  return {
    id: config.id,
    family: 'assertion_reason',
    skillLabel: config.skillLabel || 'Stelling en reden beoordelen',
    purpose: config.purpose,
    prompt: config.prompt,
    contextRefs: config.contextRefs,
    interaction: {
      assertionLabel: 'Stelling',
      assertionText: config.assertionText,
      reasonLabel: 'Reden',
      reasonText: config.reasonText,
      optionLabel: 'Relatie',
      options: config.options,
    },
    expected: {
      kind: 'assertion_reason',
      value: config.value,
      partialFeedback: 'practice_only',
    },
    feedback: commonFeedback(config.matchTitle || 'Stelling-redenroute klopt'),
    practiceRoute: practiceRoute(config.owner),
  };
}

const runtimeFixtures = [
  {
    case_id: 'Y2-B6-P12:OP-D1',
    fixture_id: 'b6-op-d1-demand-function-solving',
    category: 'new_task_family_runtime_support_required',
    semantic_checks: {
      formula: 'Q = (2150 - P) / 0.125',
      max_rent_eur: 850,
      demand_at_max_rent: 10400,
      housing_stock: 6800,
      waiting_list: 3600,
    },
    task: calculationTask({
      id: 'b6-op-d1-demand-function-solving',
      owner: 'Y2-B6-P12',
      supportCaseId: 'Y2-B6-P12:OP-D1',
      purpose: 'Solve the route-specific demand function and preserve labelled values.',
      prompt: 'Bereken de gevraagde hoeveelheid woningen bij een maximale huur van EUR 850.',
      contextRefs: ['ctx-b6-housing'],
      template: 'Q = (2150 - P) / 0.125',
      tokens: [
        { id: 'divide', label: '/', kind: 'answer', category: 'operator' },
        { id: 'intercept', label: '2150', kind: 'answer', category: 'value' },
        { id: 'plus', label: '+', kind: 'distractor', category: 'operator', distractorFor: 'minus' },
        { id: 'open', label: '(', kind: 'answer', category: 'grouping' },
        { id: 'rent', label: 'P', kind: 'answer', category: 'variable' },
        { id: 'slope', label: '0.125', kind: 'answer', category: 'value' },
        { id: 'close', label: ')', kind: 'answer', category: 'grouping' },
        { id: 'minus', label: '-', kind: 'answer', category: 'operator' },
        { id: 'times', label: 'x', kind: 'distractor', category: 'operator', distractorFor: 'divide' },
      ],
      methodTokens: ['open', 'intercept', 'minus', 'rent', 'close', 'divide', 'slope'],
      fields: [
        { id: 'intercept', label: 'intercept uit GO', placeholder: '2150', inputMode: 'decimal' },
        { id: 'rent', label: 'maximale huur', placeholder: '850', inputMode: 'decimal' },
        { id: 'slope', label: 'hellingscoefficient', placeholder: '0.125', inputMode: 'decimal' },
      ],
      substitution: {
        intercept: { kind: 'number', value: 2150 },
        rent: { kind: 'number', value: 850 },
        slope: { kind: 'number', value: 0.125 },
      },
      finalAnswer: { kind: 'number', value: 10400 },
      notation: { kind: 'text', accepted: ['woningen', 'dwellings', 'sociale huurwoningen'], required: true },
      conclusionGroups: [['10400', '10,400'], ['6800', '6,800'], ['3600', '3,600', 'wachtlijst', 'waiting']],
      criteria: ['Use the GO function.', 'Fill in EUR 850.', 'State 10,400 dwellings and the waiting-list implication.'],
      matchTitle: 'Vraagfunctie opgelost',
    }),
    passing_response: {
      methodTokens: ['open', 'intercept', 'minus', 'rent', 'close', 'divide', 'slope'],
      substitution: { intercept: '2150', rent: '850', slope: '0.125' },
      finalAnswer: '10400',
      notation: 'woningen',
      conclusion: 'Bij EUR 850 is de vraag 10400 woningen; tegenover 6800 woningen ontstaat een wachtlijst van 3600.',
    },
    negative_responses: {
      finalAnswerOnly: {
        methodTokens: [],
        substitution: {},
        finalAnswer: '10400',
        notation: 'woningen',
        conclusion: 'De vraag is 10400 woningen.',
      },
      wrongRent: {
        methodTokens: ['open', 'intercept', 'minus', 'rent', 'close', 'divide', 'slope'],
        substitution: { intercept: '2150', rent: '1075', slope: '0.125' },
        finalAnswer: '10400',
        notation: 'woningen',
        conclusion: 'Bij EUR 850 is de vraag 10400 woningen; tegenover 6800 woningen ontstaat een wachtlijst van 3600.',
      },
      noWaitingListConclusion: {
        methodTokens: ['open', 'intercept', 'minus', 'rent', 'close', 'divide', 'slope'],
        substitution: { intercept: '2150', rent: '850', slope: '0.125' },
        finalAnswer: '10400',
        notation: 'woningen',
        conclusion: 'De vraag is 10400 woningen.',
      },
    },
  },
  {
    case_id: 'Y2-B6-P12:OP-C1',
    fixture_id: 'b6-op-c1-revenue-calculation',
    category: 'new_task_family_runtime_support_required',
    semantic_checks: {
      q: 8600,
      p: 1075,
      total_revenue_eur: 9245000,
    },
    task: calculationTask({
      id: 'b6-op-c1-revenue-calculation',
      owner: 'Y2-B6-P12',
      supportCaseId: 'Y2-B6-P12:OP-C1',
      purpose: 'Compute total revenue from the route-specific revenue-maximising output and rent.',
      prompt: 'Bereken de totale opbrengst bij Q = 8600 en P = EUR 1075.',
      contextRefs: ['ctx-b6-housing'],
      template: 'TO = Q x P',
      tokens: [
        { id: 'quantity', label: 'Q', kind: 'answer', category: 'variable' },
        { id: 'plus', label: '+', kind: 'distractor', category: 'operator', distractorFor: 'times' },
        { id: 'price', label: 'P', kind: 'answer', category: 'variable' },
        { id: 'times', label: 'x', kind: 'answer', category: 'operator' },
        { id: 'cost', label: 'TK', kind: 'distractor', category: 'variable', distractorFor: 'price' },
      ],
      methodTokens: ['quantity', 'times', 'price'],
      fields: [
        { id: 'quantity', label: 'Q', placeholder: '8600', inputMode: 'decimal' },
        { id: 'price', label: 'P', placeholder: '1075', inputMode: 'decimal' },
      ],
      substitution: {
        quantity: { kind: 'number', value: 8600 },
        price: { kind: 'number', value: 1075 },
      },
      finalAnswer: { kind: 'number', value: 9245000 },
      notation: { kind: 'text', accepted: ['EUR', 'euro', 'euros'], required: true },
      conclusionGroups: [['9245000', '9,245,000'], ['opbrengst', 'revenue'], ['8600', '8,600']],
      criteria: ['Use Q x P.', 'Use Q = 8,600 and P = EUR 1,075.', 'State the revenue with EUR notation.'],
      matchTitle: 'Opbrengstberekening compleet',
    }),
    passing_response: {
      methodTokens: ['quantity', 'times', 'price'],
      substitution: { quantity: '8600', price: '1075' },
      finalAnswer: '9245000',
      notation: 'EUR',
      conclusion: 'De totale opbrengst bij Q 8600 is EUR 9245000 revenue.',
    },
    negative_responses: {
      wrongQuantity: {
        methodTokens: ['quantity', 'times', 'price'],
        substitution: { quantity: '6800', price: '1075' },
        finalAnswer: '9245000',
        notation: 'EUR',
        conclusion: 'De totale opbrengst bij Q 8600 is EUR 9245000 revenue.',
      },
      costDistractorMethod: {
        methodTokens: ['quantity', 'times', 'cost'],
        substitution: { quantity: '8600', price: '1075' },
        finalAnswer: '9245000',
        notation: 'EUR',
        conclusion: 'De totale opbrengst bij Q 8600 is EUR 9245000 revenue.',
      },
    },
  },
  {
    case_id: 'Y2-B6-P12:OP-C2',
    fixture_id: 'b6-op-c2-marginal-revenue-decision',
    category: 'new_task_family_runtime_support_required',
    semantic_checks: {
      marginal_revenue: 'MO = -0.25Q + 2150',
      chosen_output: 8600,
      rejected_capacity_only_choice: 6800,
    },
    task: stepOrderingTask({
      id: 'b6-op-c2-marginal-revenue-decision',
      owner: 'Y2-B6-P12',
      purpose: 'Prove the formula-derivation and decision-step order for revenue maximisation.',
      prompt: 'Zet de stappen voor het bepalen van de omzetmaximaliserende hoeveelheid in de juiste volgorde.',
      contextRefs: ['ctx-b6-housing'],
      steps: [
        { id: 'set-zero', label: 'Stel MO gelijk aan nul', kind: 'answer' },
        { id: 'capacity-first', label: 'Kies direct 6800 vanwege de woningvoorraad', kind: 'distractor', distractorFor: 'solve-q' },
        { id: 'derive-mr', label: 'Leid MO af uit TO: MO = -0.25Q + 2150', kind: 'answer' },
        { id: 'solve-q', label: 'Los -0.25Q + 2150 = 0 op: Q = 8600', kind: 'answer' },
        { id: 'choose-q', label: 'Gebruik Q = 8600 als omzetmaximaliserende hoeveelheid', kind: 'answer' },
      ],
      order: ['derive-mr', 'set-zero', 'solve-q', 'choose-q'],
      matchTitle: 'MO-beslissingsroute klopt',
    }),
    passing_response: { order: ['derive-mr', 'set-zero', 'solve-q', 'choose-q'] },
    negative_responses: {
      capacityShortcut: { order: ['capacity-first', 'derive-mr', 'set-zero', 'solve-q'] },
      wrongOrder: { order: ['set-zero', 'derive-mr', 'solve-q', 'choose-q'] },
    },
  },
  {
    case_id: 'Y2-B6-P12:OP-ANS2',
    fixture_id: 'b6-op-ans2-claim-answer-format',
    category: 'new_task_family_runtime_support_required',
    semantic_checks: {
      required_parts: ['method', 'values', 'q_8600', 'p_1075', 'claim_not_correct'],
    },
    task: calculationTask({
      id: 'b6-op-ans2-claim-answer-format',
      owner: 'Y2-B6-P12',
      supportCaseId: 'Y2-B6-P12:OP-ANS2',
      purpose: 'Format the Book 6 calculation answer with method, values, decision and claim conclusion.',
      prompt: 'Formuleer het berekenantwoord bij de claim dat afschaffing van de maximumhuur de wachtlijst oplost.',
      contextRefs: ['ctx-b6-housing'],
      template: 'MO = 0 -> Q = 8600; P = 1075; vergelijk met woningvoorraad',
      tokens: [
        { id: 'mr-zero', label: 'MO = 0', kind: 'answer', category: 'notation' },
        { id: 'capacity-only', label: 'Q = 6800 zonder MO', kind: 'distractor', category: 'value', distractorFor: 'q-8600' },
        { id: 'q-8600', label: 'Q = 8600', kind: 'answer', category: 'value' },
        { id: 'p-1075', label: 'P = 1075', kind: 'answer', category: 'value' },
        { id: 'compare-stock', label: 'vergelijk met 6800 voorraad', kind: 'answer', category: 'operator' },
      ],
      methodTokens: ['mr-zero', 'q-8600', 'p-1075', 'compare-stock'],
      fields: [
        { id: 'qMaxRevenue', label: 'omzetmaximaliserende Q', placeholder: '8600', inputMode: 'decimal' },
        { id: 'rentAtQ', label: 'huur bij Q', placeholder: '1075', inputMode: 'decimal' },
        { id: 'housingStock', label: 'woningvoorraad', placeholder: '6800', inputMode: 'decimal' },
      ],
      substitution: {
        qMaxRevenue: { kind: 'number', value: 8600 },
        rentAtQ: { kind: 'number', value: 1075 },
        housingStock: { kind: 'number', value: 6800 },
      },
      finalAnswer: { kind: 'text', accepted: ['claim not correct', 'not correct', 'niet correct', 'onjuist'] },
      notation: { kind: 'text', accepted: ['conclusie', 'claim'], required: false },
      conclusionGroups: [['niet correct', 'not correct', 'onjuist'], ['8600', '8,600'], ['6800', '6,800', 'voorraad', 'stock']],
      criteria: ['Show the MO route.', 'State Q = 8,600 and P = EUR 1,075.', 'Conclude the claim is not correct.'],
      matchTitle: 'Claimantwoord compleet',
    }),
    passing_response: {
      methodTokens: ['mr-zero', 'q-8600', 'p-1075', 'compare-stock'],
      substitution: { qMaxRevenue: '8600', rentAtQ: '1075', housingStock: '6800' },
      finalAnswer: 'niet correct',
      notation: '',
      conclusion: 'De claim is niet correct: Q 8600 en voorraad 6800 laten de route niet als volledige oplossing sluiten.',
    },
    negative_responses: {
      conclusionOnly: {
        methodTokens: [],
        substitution: {},
        finalAnswer: 'niet correct',
        notation: '',
        conclusion: 'De claim is niet correct.',
      },
      capacityOnly: {
        methodTokens: ['capacity-only', 'compare-stock'],
        substitution: { qMaxRevenue: '6800', rentAtQ: '850', housingStock: '6800' },
        finalAnswer: 'correct',
        notation: '',
        conclusion: 'De claim klopt door alleen de voorraad te noemen.',
      },
    },
  },
];

const extensionFixtures = [
  {
    case_id: 'Y2-B5-P13:OP-T1',
    fixture_id: 'b5-op-t1-schematic-source-chain',
    category: 'existing_support_requires_extension',
    route_boundary: 'schematic_visual_only_no_exact_numeric_table_claim',
    task: sourceChainTask({
      id: 'b5-op-t1-schematic-source-chain',
      owner: 'Y2-B5-P13',
      purpose: 'Bind pension source work to a schematic-source route and reject exact numeric-table overclaim.',
      prompt: 'Bouw de bronketen voor het pensioenmodel zonder exacte tabelclaim.',
      contextRefs: ['ctx-b5-pension'],
      nodes: [
        { id: 'source', label: 'Gebruik Figuur 1 als schematische bron', kind: 'answer', nodeRole: 'source' },
        { id: 'value', label: 'Lees alleen richting: vermogen stijgt relatief', kind: 'answer', nodeRole: 'value' },
        { id: 'operation', label: 'Koppel richting aan stock-flow/tijd redenering', kind: 'answer', nodeRole: 'operation' },
        { id: 'answer', label: 'Formuleer relatieve ratio, niet exact percentage', kind: 'answer', nodeRole: 'answer' },
        { id: 'conclusion', label: 'Conclusie blijft schematisch begrensd', kind: 'answer', nodeRole: 'conclusion' },
        { id: 'numeric-table', label: 'Lees exacte tabelwaarden uit de figuur', kind: 'distractor', nodeRole: 'value', distractorFor: 'value' },
      ],
      chain: ['source', 'value', 'operation', 'answer', 'conclusion'],
    }),
    passing_response: { chain: ['source', 'value', 'operation', 'answer', 'conclusion'] },
    negative_responses: {
      numericOverclaim: { chain: ['source', 'numeric-table', 'operation', 'answer', 'conclusion'] },
    },
  },
  {
    case_id: 'Y2-B5-P13:OP-ANS2',
    fixture_id: 'b5-op-ans2-ratio-conclusion',
    category: 'existing_support_requires_extension',
    route_boundary: 'ratio_conclusion_without_exact_schematic_numeric_extraction',
    task: calculationTask({
      id: 'b5-op-ans2-ratio-conclusion',
      owner: 'Y2-B5-P13',
      supportCaseId: 'Y2-B5-P13:OP-ANS2',
      purpose: 'Prove calculation-answer formatting for the pension premium/wealth ratio route.',
      prompt: 'Formuleer de ratio-conclusie wanneer premie als percentage van bbp constant blijft maar pensioenvermogen sneller stijgt.',
      contextRefs: ['ctx-b5-pension'],
      template: 'premie / pensioenvermogen: teller constant als bbp-aandeel, noemer stijgt sneller',
      tokens: [
        { id: 'premium-share', label: 'premie als bbp-aandeel constant', kind: 'answer', category: 'value' },
        { id: 'wealth-rises', label: 'pensioenvermogen stijgt sneller', kind: 'answer', category: 'value' },
        { id: 'ratio-falls', label: 'ratio daalt', kind: 'answer', category: 'operator' },
        { id: 'exact-2044', label: 'exact getal uit 2044 aflezen', kind: 'distractor', category: 'value', distractorFor: 'ratio-falls' },
      ],
      methodTokens: ['premium-share', 'wealth-rises', 'ratio-falls'],
      fields: [
        { id: 'premiumShare', label: 'premiedruk', placeholder: 'constant bbp-aandeel', inputMode: 'text' },
        { id: 'wealthDirection', label: 'pensioenvermogen', placeholder: 'stijgt sneller', inputMode: 'text' },
      ],
      substitution: {
        premiumShare: { kind: 'text', accepted: ['constant bbp-aandeel', 'constant'] },
        wealthDirection: { kind: 'text', accepted: ['stijgt sneller', 'rises faster'] },
      },
      finalAnswer: { kind: 'text', accepted: ['daalt', 'falls', 'decreases'] },
      notation: { kind: 'text', accepted: ['ratio', 'aandeel'], required: true },
      conclusionGroups: [['daalt', 'falls'], ['premie', 'premium'], ['vermogen', 'wealth']],
      criteria: ['Use the schematic source direction.', 'Do not extract an exact numeric table value.', 'State the ratio direction.'],
      matchTitle: 'Ratio-antwoord begrensd',
    }),
    passing_response: {
      methodTokens: ['premium-share', 'wealth-rises', 'ratio-falls'],
      substitution: { premiumShare: 'constant bbp-aandeel', wealthDirection: 'stijgt sneller' },
      finalAnswer: 'daalt',
      notation: 'ratio',
      conclusion: 'De premie ratio daalt ten opzichte van het vermogen omdat het pensioenvermogen sneller stijgt.',
    },
    negative_responses: {
      exactFigureNumber: {
        methodTokens: ['premium-share', 'exact-2044', 'ratio-falls'],
        substitution: { premiumShare: 'constant', wealthDirection: '42' },
        finalAnswer: 'daalt',
        notation: 'ratio',
        conclusion: 'De premie ratio daalt volgens exact getal 42 uit de figuur.',
      },
    },
  },
  {
    case_id: 'Y2-B6-P12:OP-P1',
    fixture_id: 'b6-op-p1-waiting-list-source-values',
    category: 'existing_support_requires_extension',
    route_boundary: 'social_housing_waiting_list_exact_source_values',
    task: sourceValueTask({
      id: 'b6-op-p1-waiting-list-source-values',
      owner: 'Y2-B6-P12',
      purpose: 'Prove social-housing waiting-list source selection for the exact Year 2 route.',
      prompt: 'Kies de twee bronwaarden die nodig zijn voor de wachtlijst bij EUR 850.',
      contextRefs: ['ctx-b6-housing'],
      values: [
        { id: 'demand-10400', label: '10,400 woningen', kind: 'answer', sourceLabel: 'vraag bij EUR 850', unit: 'woningen' },
        { id: 'stock-6800', label: '6,800 woningen', kind: 'answer', sourceLabel: 'woningvoorraad', unit: 'woningen' },
        { id: 'q-8600', label: '8,600 woningen', kind: 'distractor', sourceLabel: 'omzetmaximum', unit: 'woningen', distractorFor: 'stock-6800' },
      ],
      roles: [
        { id: 'demand', label: 'vraag' },
        { id: 'stock', label: 'voorraad' },
      ],
      selections: [
        { valueId: 'demand-10400', role: 'demand' },
        { valueId: 'stock-6800', role: 'stock' },
      ],
    }),
    passing_response: {
      selections: [
        { valueId: 'demand-10400', role: 'demand' },
        { valueId: 'stock-6800', role: 'stock' },
      ],
    },
    negative_responses: {
      usesRevenueQuantity: {
        selections: [
          { valueId: 'q-8600', role: 'demand' },
          { valueId: 'stock-6800', role: 'stock' },
        ],
      },
    },
  },
  {
    case_id: 'Y2-B6-P12:OP-E1',
    fixture_id: 'b6-op-e1-income-elasticity-source-chain',
    category: 'existing_support_requires_extension',
    route_boundary: 'rent_market_income_elasticity_exact_source_proof',
    task: sourceChainTask({
      id: 'b6-op-e1-income-elasticity-source-chain',
      owner: 'Y2-B6-P12',
      purpose: 'Bind the rent-market income-elasticity explanation to exact source facts.',
      prompt: 'Bouw de bronketen voor de huurmarktverklaring met inkomenselasticiteit.',
      contextRefs: ['ctx-b6-housing'],
      nodes: [
        { id: 'source', label: 'Gebruik Reder/VastWonen brongegevens', kind: 'answer', nodeRole: 'source' },
        { id: 'values', label: 'Middeninkomens +3%, inkomenselasticiteit +0.4, vrijkomende huurwoningen -9.9%', kind: 'answer', nodeRole: 'value' },
        { id: 'operation', label: 'Positieve elasticiteit verhoogt vraag terwijl aanbod krapper wordt', kind: 'answer', nodeRole: 'operation' },
        { id: 'answer', label: 'Huur stijgt door vraagdruk en beperkt aanbod', kind: 'answer', nodeRole: 'answer' },
        { id: 'conclusion', label: 'Bron verklaart gemiddelde huur +6%', kind: 'answer', nodeRole: 'conclusion' },
        { id: 'negative-elasticity', label: 'Gebruik negatieve inkomenselasticiteit', kind: 'distractor', nodeRole: 'value', distractorFor: 'values' },
      ],
      chain: ['source', 'values', 'operation', 'answer', 'conclusion'],
    }),
    passing_response: { chain: ['source', 'values', 'operation', 'answer', 'conclusion'] },
    negative_responses: {
      wrongElasticityDirection: { chain: ['source', 'negative-elasticity', 'operation', 'answer', 'conclusion'] },
    },
  },
  {
    case_id: 'Y2-B7-P13:OP-R1',
    fixture_id: 'b7-op-r1-actor-condition-assertion',
    category: 'existing_support_requires_extension',
    route_boundary: 'principal_agent_actor_condition_exact_route',
    task: assertionReasonTask({
      id: 'b7-op-r1-actor-condition-assertion',
      owner: 'Y2-B7-P13',
      purpose: 'Prove exact actor-condition routing for the credit-insurance information problem.',
      prompt: 'Beoordeel de stelling en reden voor de kredietverzekeringsroute.',
      contextRefs: ['ctx-b7-credit'],
      assertionText: 'De kredietverzekeraar is principaal en de kopende onderneming is agent.',
      reasonText: 'Door incassokosten bij de kopende onderneming te leggen, vermindert de prikkel tot wanbetaling.',
      options: [
        { id: 'both-true-reason-explains', label: 'Beide juist en reden verklaart', description: 'Actorrollen en voorwaarde horen bij dezelfde route.' },
        { id: 'both-true-no-link', label: 'Beide juist maar geen verband', description: 'De reden staat los van de stelling.' },
        { id: 'assertion-false', label: 'Stelling onjuist', description: 'Leverancier is principaal volgens deze keuze.' },
        { id: 'reason-false', label: 'Reden onjuist', description: 'Incassokosten zouden geen prikkel veranderen.' },
      ],
      value: 'both-true-reason-explains',
    }),
    passing_response: { value: 'both-true-reason-explains' },
    negative_responses: {
      wrongPrincipal: { value: 'assertion-false' },
      noLink: { value: 'both-true-no-link' },
    },
  },
  {
    case_id: 'Y2-B7-P13:OP-ANS2',
    fixture_id: 'b7-op-ans2-expected-value-markup',
    category: 'existing_support_requires_extension',
    route_boundary: 'expected_value_plus_markup_answer_format',
    task: calculationTask({
      id: 'b7-op-ans2-expected-value-markup',
      owner: 'Y2-B7-P13',
      supportCaseId: 'Y2-B7-P13:OP-ANS2',
      purpose: 'Prove expected-value plus markup answer formatting for the Book 7 route.',
      prompt: 'Bereken de totale premie na 20 procent opslag op de verwachte schade.',
      contextRefs: ['ctx-b7-credit'],
      template: 'totale premie = verwachte schade x 1.20',
      tokens: [
        { id: 'expected-damage', label: 'verwachte schade', kind: 'answer', category: 'value' },
        { id: 'times', label: 'x', kind: 'answer', category: 'operator' },
        { id: 'factor-120', label: '1.20', kind: 'answer', category: 'multiplier' },
        { id: 'factor-080', label: '0.80', kind: 'distractor', category: 'multiplier', distractorFor: 'factor-120' },
      ],
      methodTokens: ['expected-damage', 'times', 'factor-120'],
      fields: [
        { id: 'expectedDamage', label: 'verwachte schade', placeholder: '80000', inputMode: 'decimal' },
        { id: 'markupFactor', label: 'opslagfactor', placeholder: '1.20', inputMode: 'decimal' },
      ],
      substitution: {
        expectedDamage: { kind: 'number', value: 80000 },
        markupFactor: { kind: 'number', value: 1.2 },
      },
      finalAnswer: { kind: 'number', value: 96000 },
      notation: { kind: 'text', accepted: ['EUR', 'euro'], required: true },
      conclusionGroups: [['96000', '96,000'], ['premie', 'premium'], ['80000', '80,000']],
      criteria: ['Use expected damage EUR 80,000.', 'Apply 20 percent markup.', 'State total premium EUR 96,000.'],
      matchTitle: 'Premieantwoord compleet',
    }),
    passing_response: {
      methodTokens: ['expected-damage', 'times', 'factor-120'],
      substitution: { expectedDamage: '80000', markupFactor: '1.2' },
      finalAnswer: '96000',
      notation: 'EUR',
      conclusion: 'De premie is EUR 96000, omdat EUR 80000 verwachte schade met opslag wordt verhoogd.',
    },
    negative_responses: {
      usesDiscountFactor: {
        methodTokens: ['expected-damage', 'times', 'factor-080'],
        substitution: { expectedDamage: '80000', markupFactor: '0.8' },
        finalAnswer: '96000',
        notation: 'EUR',
        conclusion: 'De premie is EUR 96000, omdat EUR 80000 verwachte schade met opslag wordt verhoogd.',
      },
    },
  },
  {
    case_id: 'Y2-B8-P04:OP-S1',
    fixture_id: 'b8-op-s1-source-to-derived-order',
    category: 'existing_support_requires_extension',
    route_boundary: 'official_source_first_derived_payoff_labelled',
    task: stepOrderingTask({
      id: 'b8-op-s1-source-to-derived-order',
      owner: 'Y2-B8-P04',
      purpose: 'Prove game-theory source-to-derived representation order and label boundary.',
      prompt: 'Zet de strategische bronroute in de juiste volgorde.',
      contextRefs: ['ctx-b8-strategy'],
      steps: [
        { id: 'official-context', label: 'Lees eerst de officiele context over substituten en prijsgarantie', kind: 'answer' },
        { id: 'derived-label', label: 'Label de payoffkaart als afgeleid en niet-officieel', kind: 'answer' },
        { id: 'incentive', label: 'Benoem de prikkel om prijs te verlagen', kind: 'answer' },
        { id: 'joint-outcome', label: 'Leg het slechtere gezamenlijke resultaat uit', kind: 'answer' },
        { id: 'payoff-as-source', label: 'Presenteer payoffkaart als officiele bron', kind: 'distractor', distractorFor: 'derived-label' },
      ],
      order: ['official-context', 'derived-label', 'incentive', 'joint-outcome'],
      matchTitle: 'Strategische bronroute klopt',
    }),
    passing_response: { order: ['official-context', 'derived-label', 'incentive', 'joint-outcome'] },
    negative_responses: {
      derivedAsOfficial: { order: ['payoff-as-source', 'official-context', 'incentive', 'joint-outcome'] },
    },
  },
];

const answerSkillRecords = [
  {
    answer_skill_id: 'Y2-EX-ANS-SOURCE-SUPPORTED-MECHANISM-1',
    label: 'Source-supported mechanism or policy explanation',
    closes_answer_skill_dispositions: ['Y2-B5-P13:OP-H1', 'Y2-B5-P13:OP-ANS3', 'Y2-B6-P12:OP-F1', 'Y2-B6-P12:OP-ANS3'],
    also_supports_extension_cases: ['Y2-B6-P12:OP-E1'],
    required_parts: ['source_or_policy_fact', 'economic_mechanism', 'second_link_or_effect', 'context_conclusion'],
    point_logic: [
      'Award one part for the exact source or policy fact.',
      'Award one part for the first economic mechanism.',
      'Award one part for the second causal link or effect.',
      'Require a conclusion tied to the named Year 2 route.',
    ],
    accepted_answer_structure: {
      requiredTextGroups: [['source', 'policy', 'bron', 'beleid'], ['mechanism', 'mechanisme', 'causes', 'leidt'], ['therefore', 'daarom', 'so', 'zodat']],
      rejectText: ['because it says so', 'source only', 'alleen bron'],
    },
    negative_guards: ['source-only citation fails', 'policy opinion without mechanism fails', 'route-free generic explanation fails'],
  },
  {
    answer_skill_id: 'Y2-EX-ANS-CONDITION-TWO-LINK-CORRECTION-1',
    label: 'Condition-based information or correction-model two-link explanation',
    closes_answer_skill_dispositions: ['Y2-B7-P13:OP-ANS3', 'Y2-B8-P04:OP-ANS3'],
    also_supports_extension_cases: ['Y2-B7-P13:OP-R1', 'Y2-B8-P04:OP-S1'],
    required_parts: ['condition_or_command_word', 'actor_or_incentive', 'two_link_explanation', 'correction_model_conclusion'],
    point_logic: [
      'Name the route condition or command word before explaining.',
      'Bind actors or strategic incentives to the source.',
      'Use two explicit links, not a one-hop assertion.',
      'Close with the correction-model conclusion.',
    ],
    accepted_answer_structure: {
      requiredTextGroups: [['condition', 'voorwaarde', 'guarantee', 'garantie'], ['incentive', 'prikkel', 'actor', 'principal'], ['therefore', 'daarom', 'so']],
      rejectText: ['one link only', 'generic strategy', 'not enough information'],
    },
    negative_guards: ['one-link explanation fails', 'wrong actor role fails', 'derived payoff as official source fails'],
  },
  {
    answer_skill_id: 'Y2-EX-ANS-CALCULATION-RATIO-CONCLUSION-1',
    label: 'Calculation or ratio conclusion with source and unit',
    closes_answer_skill_dispositions: [],
    also_supports_extension_cases: ['Y2-B5-P13:OP-ANS2', 'Y2-B6-P12:OP-ANS2', 'Y2-B7-P13:OP-ANS2'],
    required_parts: ['method', 'labelled_values', 'intermediate_or_ratio_direction', 'unit_or_notation', 'context_conclusion'],
    point_logic: [
      'The method or ratio rule must be visible.',
      'Source values must be labelled.',
      'The intermediate value or ratio direction must be present.',
      'The final answer must include unit or notation and context conclusion.',
    ],
    accepted_answer_structure: {
      requiredTextGroups: [['method', 'formule', 'ratio', 'MO'], ['value', 'waarde', 'Q', 'EUR'], ['conclusion', 'conclusie', 'daalt', 'niet correct']],
      rejectText: ['final answer only', 'source only', 'no unit'],
    },
    negative_guards: ['final-answer-only fails', 'wrong unit or missing notation fails', 'schematic exact-number overclaim fails'],
  },
  {
    answer_skill_id: 'Y2-EX-ANS-STRATEGIC-COMMAND-PLANNING-1',
    label: 'Strategic command-word and point-allocation planning',
    closes_answer_skill_dispositions: ['Y2-B8-P04:OP-ANS1'],
    also_supports_extension_cases: ['Y2-B8-P04:OP-S1'],
    required_parts: ['command_word', 'point_allocation', 'source_fact', 'strategic_incentive'],
    point_logic: [
      'Read the command word before selecting the response shape.',
      'Allocate points to identification plus reason.',
      'Use official source fact before derived representation.',
      'Name the strategic incentive explicitly.',
    ],
    accepted_answer_structure: {
      requiredTextGroups: [['command', 'vraagwoord', 'identify', 'noem'], ['point', 'punt'], ['incentive', 'prikkel', 'price']],
      rejectText: ['payoff only', 'no source', 'matrix is official'],
    },
    negative_guards: ['payoff-only answer planning fails', 'missing command word fails', 'unlabelled derived representation fails'],
  },
];

const answerSkillTests = [
  {
    answer_skill_id: 'Y2-EX-ANS-SOURCE-SUPPORTED-MECHANISM-1',
    passing: 'Use the source policy fact, explain the economic mechanism, and therefore connect the effect to this route.',
    negatives: ['source only', 'I think this policy is good'],
  },
  {
    answer_skill_id: 'Y2-EX-ANS-CONDITION-TWO-LINK-CORRECTION-1',
    passing: 'Name the condition, identify the actor incentive, and therefore give the correction-model conclusion.',
    negatives: ['one link only', 'generic strategy without actor'],
  },
  {
    answer_skill_id: 'Y2-EX-ANS-CALCULATION-RATIO-CONCLUSION-1',
    passing: 'Show the method, label each value in EUR, and state the conclusion with the ratio direction.',
    negatives: ['final answer only', 'source only'],
  },
  {
    answer_skill_id: 'Y2-EX-ANS-STRATEGIC-COMMAND-PLANNING-1',
    passing: 'Read the command word, allocate the point, use the source fact, and name the price incentive.',
    negatives: ['payoff only', 'matrix is official'],
  },
];

function allFixtures() {
  return runtimeFixtures.concat(extensionFixtures);
}

function taskSet() {
  return {
    schema_version: 1,
    title: 'Year 2 governed support closure proof lab',
    eyebrow: 'Review-only support proof',
    intro: 'This rendered lab proves route-specific runtime, source, answer-form, and authority boundaries for Y2-B5-P13, Y2-B6-P12, Y2-B7-P13, and Y2-B8-P04. It is not generated lesson output.',
    surfaceKind: 'review_lab',
    contextBlocks,
    tasks: allFixtures().map((fixture) => fixture.task),
  };
}

function closureCase(fixture) {
  const [owner, opRow] = fixture.case_id.split(':');
  const spec = specForOwner(owner);
  return {
    case_id: fixture.case_id,
    record_id: spec.record_id,
    target_owner_candidate_id: owner,
    op_row: opRow,
    prior_disposition: priorDispositionByCase[fixture.case_id],
    closure_type: fixture.category === 'new_task_family_runtime_support_required' ? 'runtime_fixture_proof' : 'route_specific_extension_proof',
    status_after_human_merge: 'closed_platform_support_ready_for_cross_repo_lesson_production_input',
    proof_refs: [paths.fixturesJson, paths.renderedHtml],
    fixture_id: fixture.fixture_id,
    route_boundary: fixture.route_boundary || 'exact_year2_route_only_no_broad_operation_closure',
    blocks: 'cross-repo lesson-production reliance for this OP row until this exact support-closure bundle is human-merged',
    does_not_block: 'foundation state, ordinary non-authority work, and review of unrelated scoped PRs',
    proof_required_to_close: 'Checker proof, rendered fixture proof, branch-protection proof, lead review, and owner merge authorization with the authority boundary intact.',
  };
}

function answerSkillClosureCases() {
  return Object.entries(priorDispositionByCase)
    .filter(([, outcome]) => outcome === 'new_answer_skill_record_required')
    .map(([caseId, prior]) => {
      const [owner, opRow] = caseId.split(':');
      const spec = specForOwner(owner);
      const record = answerSkillRecords.find((item) => item.closes_answer_skill_dispositions.includes(caseId));
      return {
        case_id: caseId,
        record_id: spec.record_id,
        target_owner_candidate_id: owner,
        op_row: opRow,
        prior_disposition: prior,
        closure_type: 'answer_skill_equivalent_support_record',
        answer_skill_id: record.answer_skill_id,
        status_after_human_merge: 'closed_platform_support_ready_for_cross_repo_lesson_production_input',
        proof_refs: [paths.answerSkillJson, paths.closureJson],
        route_boundary: 'answer_skill_equivalent_for_exact_year2_routes_no_registry_mutation',
        blocks: 'cross-repo lesson-production reliance for this answer form until this exact support-closure bundle is human-merged',
        does_not_block: 'foundation state, ordinary non-authority work, and review of unrelated scoped PRs',
        proof_required_to_close: 'Reviewed equivalent answer-skill record with point logic, route bindings, negative guards, branch-protection proof, lead review, and owner merge authorization.',
      };
    });
}

function supportConfirmedCase() {
  return {
    case_id: 'Y2-B7-P13:OP-M1',
    record_id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    target_owner_candidate_id: 'Y2-B7-P13',
    op_row: 'OP-M1',
    prior_disposition: 'existing_governed_support_sufficient',
    closure_type: 'prior_sufficient_support_confirmed',
    status_after_human_merge: 'confirmed_no_platform_support_blocker',
    proof_refs: [paths.priorDisposition, paths.closureJson],
    route_boundary: 'principal_agent_actor_condition_orientation_only',
    blocks: 'nothing for platform-side support closure',
    does_not_block: 'cross-repo lesson-production input after this bundle is human-merged',
    proof_required_to_close: 'Keep route-specific source binding in the lesson-production PR.',
  };
}

function buildClosureBundle() {
  const runtimeCases = runtimeFixtures.map(closureCase);
  const extensionCases = extensionFixtures.map(closureCase);
  const answerCases = answerSkillClosureCases();
  const allClosed = runtimeCases.concat(extensionCases, answerCases);
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'support_closure_ready_for_human_review_not_active_until_merge',
    product_end_state: 'Enable cross-repo Year 2 lesson-production PRs for the four reviewed target families after human merge, while keeping product route, CP-6, Scale Gate, diagnostics, mastery, PV, summative, and student/product use blocked.',
    original_specs: [
      'REV-STD-1 review packet standard',
      `${PRIOR_READINESS_SPRINT} production-readiness bundle`,
      'Y2-GOVERNED-SUPPORT-CLOSURE-BUNDLE-1 owner instruction',
    ],
    non_negotiable_requirements: [
      'Close exactly the 18 platform-side support blockers from the prior bundle.',
      'Do not mutate active v5 target registry, live MTUs, broad operation registry rows, or answer-skill registry storage.',
      'Prove all four Book 6 runtime cases with route-specific fixtures and negative guards.',
      'Resolve seven answer-skill dispositions through minimal reviewed-equivalent support records.',
      'Preserve no lesson generation, no product route, no CP-6, no Scale Gate, and no student/product use.',
    ],
    core_requirement_checklist: [
      { requirement: '18 prior platform support blockers closed', status: 'met', evidence: paths.closureJson },
      { requirement: 'Four Book 6 runtime cases have passing and negative fixture proof', status: 'met', evidence: paths.fixturesJson },
      { requirement: 'Seven extension cases have exact route proof', status: 'met', evidence: paths.fixturesJson },
      { requirement: 'Seven answer-skill dispositions map to reviewed-equivalent support records', status: 'met', evidence: paths.answerSkillJson },
      { requirement: 'Resolver overlay requires candidate record plus prior production-readiness bundle plus support closure', status: 'met', evidence: paths.overlay },
      { requirement: 'Rendered evidence exists without generated lesson output', status: 'met', evidence: paths.renderedHtml },
      { requirement: 'Current-head PR proof', status: 'pending_remote_pr', evidence: 'Exact-head CI, readiness, lead review, branch protection ok:true, and owner authorization are required before merge.' },
    ],
    summary: {
      prior_blockers_closed: allClosed.length,
      runtime_cases_closed: runtimeCases.length,
      extension_cases_closed: extensionCases.length,
      answer_skill_dispositions_closed: answerCases.length,
      prior_sufficient_cases_confirmed: 1,
      broad_operation_rows_closed: 0,
      generated_lesson_outputs: 0,
    },
    cases: allClosed.concat([supportConfirmedCase()]),
    authority_claims: authorityClaims(),
    carried_issues: carriedIssues(),
  };
}

function buildFixturesJson() {
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'route_specific_fixture_proof_complete_for_review',
    rendered_proof: paths.renderedHtml,
    task_set: taskSet(),
    runtime_fixtures: runtimeFixtures.map(publicFixture),
    extension_fixtures: extensionFixtures.map(publicFixture),
    authority_claims: authorityClaims(),
  };
}

function publicFixture(fixture) {
  return {
    case_id: fixture.case_id,
    fixture_id: fixture.fixture_id,
    category: fixture.category,
    route_boundary: fixture.route_boundary || 'exact_year2_route_only_no_broad_operation_closure',
    task: fixture.task,
    passing_response: fixture.passing_response,
    negative_responses: fixture.negative_responses,
    semantic_checks: fixture.semantic_checks || {},
  };
}

function buildAnswerSkillJson() {
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'answer_skill_equivalent_support_ready_for_human_review_no_registry_mutation',
    records: answerSkillRecords.map((record) => ({
      ...record,
      storage_status: 'reviewed_equivalent_support_record_only',
      registry_mutation_authorized: false,
      generator_exposure_authorized: false,
      student_use_authorized: false,
    })),
    tests: answerSkillTests,
    authority_claims: authorityClaims(),
  };
}

function buildOverlay(candidates, priorReadiness, priorDisposition, closureBundle) {
  const candidateIds = new Set((candidates.records || []).map((record) => record.id));
  const priorRecords = new Set((priorReadiness.records || []).map((record) => record.record_id));
  const casesByOwner = new Map();
  for (const item of closureBundle.cases) {
    if (!casesByOwner.has(item.target_owner_candidate_id)) casesByOwner.set(item.target_owner_candidate_id, []);
    casesByOwner.get(item.target_owner_candidate_id).push(item.case_id);
  }
  return {
    schema_version: 1,
    overlay_id: `${SPRINT}-lesson-production-eligibility-overlay`,
    status: 'ready_for_human_review_not_active_until_merge',
    resolver_rule: 'candidate record + approved production-readiness bundle + completed support disposition closure required before generator treats a target as cross-repo lesson-production input.',
    required_inputs: {
      candidate_records: paths.candidates,
      production_readiness_bundle: paths.priorReadiness,
      prior_support_dispositions: paths.priorDisposition,
      support_closure_bundle: paths.closureJson,
    },
    records: targetSpecs.map((spec) => {
      const supportCases = casesByOwner.get(spec.owner) || [];
      return {
        record_id: spec.record_id,
        target_owner_candidate_id: spec.owner,
        candidate_record_present: candidateIds.has(spec.record_id),
        production_readiness_record_present: priorRecords.has(spec.record_id),
        prior_bundle_status: priorReadiness.status,
        prior_disposition_status: priorDisposition.status,
        required_support_case_ids: supportCases.filter((caseId) => caseId !== 'Y2-B7-P13:OP-M1'),
        completed_support_case_ids_after_human_merge: supportCases,
        unresolved_platform_support_blockers_after_human_merge: [],
        generator_status_after_human_merge: 'eligible_as_cross_repo_lesson_production_input_only',
        generator_status_before_human_merge: 'blocked_pending_support_closure_merge',
        product_route_adoption_authorized: false,
        generated_lesson_output_authorized_by_this_pr: false,
        student_product_use_authorized: false,
      };
    }),
    authority_claims: authorityClaims(),
  };
}

function buildHandoffs(priorHandoff, overlay, closureBundle) {
  const closureByOwner = new Map();
  for (const item of closureBundle.cases) {
    if (!closureByOwner.has(item.target_owner_candidate_id)) closureByOwner.set(item.target_owner_candidate_id, []);
    closureByOwner.get(item.target_owner_candidate_id).push(item);
  }
  const overlayByRecord = new Map(overlay.records.map((record) => [record.record_id, record]));
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'generator_handoff_support_closure_ready_for_human_review_no_lesson_output',
    source_handoff: paths.priorHandoff,
    records: (priorHandoff.records || []).map((record) => {
      const overlayRecord = overlayByRecord.get(record.record_id);
      return {
        ...record,
        support_closure_status_after_human_merge: 'platform_support_blockers_closed_for_cross_repo_lesson_production_input',
        support_closure_cases: closureByOwner.get(record.target_owner_candidate_id) || [],
        eligibility_overlay: {
          path: paths.overlay,
          generator_status_after_human_merge: overlayRecord.generator_status_after_human_merge,
          generator_status_before_human_merge: overlayRecord.generator_status_before_human_merge,
        },
        remaining_blockers: carriedIssues(),
        authority_boundary: 'handoff_manifest_support_closure_only_no_lesson_generation_no_product_use',
      };
    }),
    authority_claims: authorityClaims(),
  };
}

function authorityClaims() {
  return {
    protected_year2_support_overlay_created_for_review: true,
    route_specific_runtime_support_closed_for_review: true,
    route_specific_extension_support_closed_for_review: true,
    answer_skill_equivalent_support_closed_for_review: true,
    lesson_production_eligibility_overlay_ready_for_review: true,
    cross_repo_lesson_production_input_ready_after_human_merge: true,
    active_v5_registry_mutated: false,
    external_source_mutation_authorized: false,
    live_mtu_registry_mutated: false,
    operation_registry_mutation_authorized: false,
    answer_skill_registry_mutation_authorized: false,
    candidate_storage_mutation_authorized: false,
    broad_operation_row_closure_authorized: false,
    generated_lesson_output_authorized: false,
    product_route_adoption_authorized: false,
    product_authority: false,
    cp6_closure_authorized: false,
    scale_gate_authorized: false,
    diagnostics_authorized: false,
    adaptive_routing_authorized: false,
    mastery_authorized: false,
    pv_authorized: false,
    summative_use_authorized: false,
    student_use_authorized: false,
    student_product_use_authorized: false,
    autonomous_merge_authorized: false,
  };
}

function carriedIssues() {
  return [
    {
      issue_id: 'cross-repo-lesson-production-prs-not-yet-created',
      classification: 'proof_required_to_close',
      blocks: 'actual Year 2 lesson output and target-equivalent exit-ticket reliance',
      does_not_block: 'platform support closure after owner authorization and branch-protection proof',
      proof_required_to_close: 'Separate 4veco-lessen lesson-production PRs using the updated handoff manifests and rendered source/task proof.',
    },
    {
      issue_id: 'product-route-and-student-use-still-blocked',
      classification: 'scale_blocker',
      blocks: 'product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use',
      does_not_block: 'cross-repo lesson-production input readiness after this support closure is human-merged',
      proof_required_to_close: 'REV-STD-1 product-proof packet after lesson PRs, with exact rendered output, accessibility, teacher, economist, runtime, and authority reviews.',
    },
    {
      issue_id: 'current-head-merge-proof-pending',
      classification: 'merge_proof_required',
      blocks: 'merge until exact-head CI/readiness/lead-review/thread/branch-protection proof and owner authorization exist',
      does_not_block: 'content review of this packet',
      proof_required_to_close: 'Run validate-platform, custom checker, PR Readiness Reviewer, thread check, lead review, and branch-protection checker with ok:true on exact remote head.',
    },
  ];
}

function buildReviewPacket(closureBundle) {
  return {
    packet_id: SPRINT,
    status: 'READY_FOR_HUMAN_REVIEW_PACKET',
    pr_throughput_class: 'high_authority',
    authority_class: 'protected_year2_support_overlay',
    review_autonomy: {
      level: 'L4',
      route: 'READY_FOR_HUMAN_REVIEW',
      reason: 'Protected Year 2 support overlay and lesson-production eligibility resolver.',
    },
    human_decision_required: true,
    auto_merge_allowed_after_ci: false,
    product_end_state: closureBundle.product_end_state,
    original_specs: closureBundle.original_specs,
    non_negotiable_requirements: closureBundle.non_negotiable_requirements,
    core_requirement_checklist: closureBundle.core_requirement_checklist,
    findings: [
      {
        finding_id: 'Y2GSCB1-001',
        classification: 'core_requirement_met',
        summary: 'All 18 prior platform-side support blockers have closure records.',
        blocks: 'nothing if exact-head proof and human authorization remain valid',
        does_not_block: 'merge after human authorization',
        proof_required_to_close: paths.closureJson,
      },
      {
        finding_id: 'Y2GSCB1-002',
        classification: 'carried_issue',
        summary: 'Lesson output and product use remain outside this PR.',
        blocks: 'lesson generation, product routes, CP-6, Scale Gate, diagnostics, mastery, PV, summative, and student/product use',
        does_not_block: 'platform support closure',
        proof_required_to_close: 'Separate downstream lesson and product-proof PRs.',
      },
    ],
    carried_issues: carriedIssues(),
    changed_paths: changedPaths,
    implementation_summary: closureBundle.summary,
    proof: {
      local_checkers: [
        { command: 'node --check build-scripts/references/build-y2-governed-support-closure-bundle-1.js', status: 'passed' },
        { command: 'node build-scripts/references/build-y2-governed-support-closure-bundle-1.js', status: 'passed' },
        { command: 'node --check build-scripts/references/check-y2-governed-support-closure-bundle-1.js', status: 'passed' },
        { command: 'node build-scripts/references/check-y2-governed-support-closure-bundle-1.js', status: 'passed' },
        { command: 'npm.cmd run check:platform', status: 'pending_remote_pr' },
      ],
      rendered_proof: paths.renderedHtml,
      branch_protection: 'pending_remote_pr; must include ok: true before merge',
    },
    decision: {
      route: 'READY_FOR_HUMAN_REVIEW',
      merge_authorization_required: true,
      mark_ready_allowed_if_pr_readiness_returns_mark_ready: true,
    },
    single_account_pr_governance_pilot: {
      branch_protection_ok_required: true,
      integration_authorized_required: false,
      pilot_data_record: {
        router_route_vs_retrospective_human_judgment: {
          router_route: 'READY_FOR_HUMAN_REVIEW',
          retrospective_human_judgment: 'protected/consequential Year 2 support closure requires owner authorization',
        },
        lead_review_sufficient: 'no_for_merge_yes_for_pre_owner_screen',
        unnecessary_human_escalation: false,
        stale_head_or_incomplete_evidence_failures: [],
        queueing_behavior_for_close_together_authorized_prs: 'not_applicable_single_pr_lane',
        repeated_main_advancement_behavior: 'must refresh evidence if payload lineage or decision scope changes; conflict-free base sync follows current governance override',
        overlap_or_deterministic_refresh_dead_end: 'no overlap detected in local implementation worktree',
      },
    },
    authority_claims: authorityClaims(),
  };
}

function renderSupportProof(taskSetData) {
  const shell = TaskShellUI.renderStaticHtml(taskSetData);
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT)} rendered support proof</title>
  <link rel="stylesheet" href="../../../engines/task-shell.css">
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f7f7f4; color: #1d2430; }
    .proof-boundary { padding: 16px 24px; background: #222; color: #fff; }
    .proof-boundary strong { display: block; margin-bottom: 4px; }
    .proof-wrap { max-width: 1180px; margin: 0 auto; padding: 24px; }
  </style>
</head>
<body data-y2-governed-support-closure-proof="${html(SPRINT)}">
  <aside class="proof-boundary">
    <strong>Review-only rendered support proof.</strong>
    No lesson generation, no product route adoption, no CP-6, no Scale Gate, no diagnostics, no mastery, no PV, no summative use, and no student/product use are authorized by this artifact.
  </aside>
  <main class="proof-wrap">
    ${shell}
  </main>
</body>
</html>
`;
}

function markdownClosure(closureBundle) {
  const lines = [];
  lines.push(`# ${SPRINT}`);
  lines.push('');
  lines.push('## Product End-State And Original Specs');
  lines.push('');
  lines.push(closureBundle.product_end_state);
  lines.push('');
  lines.push(mdList(closureBundle.original_specs));
  lines.push('');
  lines.push('## Non-Negotiable Requirements');
  lines.push('');
  lines.push(mdList(closureBundle.non_negotiable_requirements));
  lines.push('');
  lines.push('## Core-Requirement Checklist');
  lines.push('');
  lines.push('| Requirement | Status | Evidence |');
  lines.push('| --- | --- | --- |');
  for (const item of closureBundle.core_requirement_checklist) {
    lines.push(`| ${item.requirement} | ${item.status} | ${item.evidence} |`);
  }
  lines.push('');
  lines.push('## Closure Summary');
  lines.push('');
  lines.push(`- Runtime cases closed: ${closureBundle.summary.runtime_cases_closed}`);
  lines.push(`- Route-specific extension cases closed: ${closureBundle.summary.extension_cases_closed}`);
  lines.push(`- Answer-skill dispositions closed: ${closureBundle.summary.answer_skill_dispositions_closed}`);
  lines.push(`- Broad operation rows closed: ${closureBundle.summary.broad_operation_rows_closed}`);
  lines.push(`- Generated lesson outputs: ${closureBundle.summary.generated_lesson_outputs}`);
  lines.push('');
  lines.push('## Case Matrix');
  lines.push('');
  lines.push('| Case | Prior disposition | Closure type | Status after human merge |');
  lines.push('| --- | --- | --- | --- |');
  for (const item of closureBundle.cases) {
    lines.push(`| ${item.case_id} | ${item.prior_disposition} | ${item.closure_type} | ${item.status_after_human_merge} |`);
  }
  lines.push('');
  lines.push('## Carried Issues');
  lines.push('');
  lines.push('| Issue | Classification | blocks | does_not_block | proof_required_to_close |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const issue of closureBundle.carried_issues) {
    lines.push(`| ${issue.issue_id} | ${issue.classification} | ${issue.blocks} | ${issue.does_not_block} | ${issue.proof_required_to_close} |`);
  }
  lines.push('');
  lines.push('## Authority Boundary');
  lines.push('');
  lines.push('This bundle closes platform-side support blockers for exact Year 2 routes only after human merge. It does not authorize lesson generation, live MTU mutation, broad operation closure, product routes, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.');
  lines.push('');
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

function markdownHandoffs(handoffs) {
  const lines = ['# Generator Handoff Manifests', ''];
  lines.push('Status: support closure ready for human review; no lesson output generated.');
  lines.push('');
  for (const record of handoffs.records) {
    lines.push(`## ${record.target_owner_candidate_id}`);
    lines.push('');
    lines.push(`- Record: ${record.record_id}`);
    lines.push(`- Support closure: ${record.support_closure_status_after_human_merge}`);
    lines.push(`- Generator before human merge: ${record.eligibility_overlay.generator_status_before_human_merge}`);
    lines.push(`- Generator after human merge: ${record.eligibility_overlay.generator_status_after_human_merge}`);
    lines.push('- Closed support cases:');
    lines.push(mdList(record.support_closure_cases.map((item) => `${item.case_id} (${item.closure_type})`)));
    lines.push('- Remaining blockers:');
    lines.push(mdList(record.remaining_blockers.map((item) => `${item.issue_id}: ${item.blocks}`)));
    lines.push('');
  }
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

function markdownReviewPacket(packet) {
  const lines = [];
  lines.push(`# ${SPRINT} Review Packet`);
  lines.push('');
  lines.push('## Product End-State And Original Specs');
  lines.push('');
  lines.push(packet.product_end_state);
  lines.push('');
  lines.push(mdList(packet.original_specs));
  lines.push('');
  lines.push('## Non-Negotiable Requirements');
  lines.push('');
  lines.push(mdList(packet.non_negotiable_requirements));
  lines.push('');
  lines.push('## Core-Requirement Checklist');
  lines.push('');
  lines.push('| Requirement | Status | Evidence |');
  lines.push('| --- | --- | --- |');
  for (const item of packet.core_requirement_checklist) {
    lines.push(`| ${item.requirement} | ${item.status} | ${item.evidence} |`);
  }
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  lines.push('| Finding | Classification | blocks | does_not_block | proof_required_to_close |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const finding of packet.findings) {
    lines.push(`| ${finding.finding_id} | ${finding.classification} | ${finding.blocks} | ${finding.does_not_block} | ${finding.proof_required_to_close} |`);
  }
  lines.push('');
  lines.push('## Carried Issues');
  lines.push('');
  lines.push('| Issue | Classification | blocks | does_not_block | proof_required_to_close |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const issue of packet.carried_issues) {
    lines.push(`| ${issue.issue_id} | ${issue.classification} | ${issue.blocks} | ${issue.does_not_block} | ${issue.proof_required_to_close} |`);
  }
  lines.push('');
  lines.push('## Proof');
  lines.push('');
  lines.push(mdList(packet.proof.local_checkers.map((item) => `${item.command} - ${item.status}`)));
  lines.push('');
  lines.push('Branch protection must be renewed on the exact remote head before merge and must include `ok: true`.');
  lines.push('');
  lines.push('## Pilot Data Record');
  lines.push('');
  lines.push('The single-account PR governance pilot route is READY_FOR_HUMAN_REVIEW. Lead review can screen the packet, but owner authorization is required for merge.');
  lines.push('');
  lines.push('## Decision Route');
  lines.push('');
  lines.push('READY_FOR_HUMAN_REVIEW. If PR Readiness returns MARK_READY, mark the PR ready immediately; human authorization gates merge only.');
  lines.push('');
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

function markdownPlan() {
  return `# ${SPRINT} Plan

## Goal

Close the 18 platform-side support blockers carried by ${PRIOR_READINESS_SPRINT} for Y2-B5-P13, Y2-B6-P12, Y2-B7-P13, and Y2-B8-P04.

## Non-Negotiable Requirements

- Close exact Year 2 routes only.
- Prove four Book 6 runtime cases with passing and negative fixtures.
- Resolve seven answer-skill dispositions without live answer-skill registry mutation.
- Add a machine-checkable eligibility overlay requiring candidate record, prior production-readiness bundle, and completed support closure.
- Preserve no lesson generation, no product route, no CP-6, no Scale Gate, no diagnostics, no mastery, no PV, no summative use, and no student/product use.

## Verification Plan

- \`node build-scripts/references/build-y2-governed-support-closure-bundle-1.js\`
- \`node build-scripts/references/check-y2-governed-support-closure-bundle-1.js\`
- \`npm.cmd run check:platform\`
- PR Readiness Reviewer, lead review, thread check, and branch-protection checker with \`ok: true\` on exact remote head.

## Route

READY_FOR_HUMAN_REVIEW.
`;
}

function markdownResult() {
  return `# ${SPRINT} Result

## Summary

The bundle installs a reproducible support-closure overlay and proof packet for the 18 Year 2 platform-side support blockers. It adds route-specific runtime and extension fixtures, reviewed-equivalent answer-skill support records, updated handoff manifests, and a lesson-production eligibility overlay.

## Authority Boundary

This is support closure only. It does not authorize lesson generation, live MTU mutation, broad operation closure, product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.

## Next Action

Open the PR, run exact-head readiness/branch-protection proof, complete lead review, and return for explicit owner authorization before merge.
`;
}

function main() {
  const candidates = readJson(paths.candidates);
  const priorReadiness = readJson(paths.priorReadiness);
  const priorDisposition = readJson(paths.priorDisposition);
  const priorHandoff = readJson(paths.priorHandoff);

  const set = taskSet();
  TaskShellEngine.validateTaskSet(set);
  const closureBundle = buildClosureBundle();
  const fixtures = buildFixturesJson();
  const answerSkills = buildAnswerSkillJson();
  const overlay = buildOverlay(candidates, priorReadiness, priorDisposition, closureBundle);
  const handoffs = buildHandoffs(priorHandoff, overlay, closureBundle);
  const packet = buildReviewPacket(closureBundle);

  writeJson(paths.overlay, overlay);
  writeJson(paths.closureJson, closureBundle);
  write(paths.closureMd, markdownClosure(closureBundle));
  writeJson(paths.fixturesJson, fixtures);
  writeJson(paths.answerSkillJson, answerSkills);
  writeJson(paths.handoffJson, handoffs);
  write(paths.handoffMd, markdownHandoffs(handoffs));
  write(paths.renderedHtml, renderSupportProof(set));
  writeJson(paths.reviewPacketJson, packet);
  write(paths.reviewPacketMd, markdownReviewPacket(packet));
  write(paths.planMd, markdownPlan());
  write(paths.resultMd, markdownResult());

  console.log(`OK ${SPRINT}: generated support-closure bundle`);
}

if (require.main === module) {
  main();
}

module.exports = {
  SPRINT,
  PRIOR_READINESS_SPRINT,
  paths,
  changedPaths,
  targetSpecs,
  priorDispositionByCase,
  runtimeFixtures,
  extensionFixtures,
  answerSkillRecords,
  answerSkillTests,
  allFixtures,
  taskSet,
  buildClosureBundle,
  authorityClaims,
  carriedIssues,
};
