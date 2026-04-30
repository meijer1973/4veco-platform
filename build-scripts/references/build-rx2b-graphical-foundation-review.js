#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - RX.2b packet work is planning/review only until
 *   GATE-RX2b-graphical-foundation explicitly authorizes CLI execution.
 * - Keep mutation_authorized and cli_execution_authorized false in this
 *   builder.
 * - Do not write references/machine/, references/external/, authored source
 *   files, RAG chunks, lesson targets, or generator files from this script.
 */

const fs = require('fs');
const path = require('path');
const { validateSpec } = require('./unit-add');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RX1_INVENTORY = 'references/data/sprints/RX.1-representation-operation-inventory.json';
const RX1_CLOSURE = 'reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json';
const RX2_CLOSURE = 'reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json';
const RX2_GENERATOR_BLOCK = 'references/data/sprints/RX.2-generator-blocked-units.json';
const UNITS = 'references/machine/micro-teaching-units.json';
const GENERATORS = 'engines/skilltree/generators.js';

const COVERAGE_JSON = 'reports/json/graphical-foundation-coverage.json';
const COVERAGE_MD = 'reports/markdown/graphical-foundation-coverage.md';
const OUT_SPECS = 'references/data/sprints/RX.2b-candidate-specs.json';
const GATE_DIR = 'reports/review-gates/GATE-RX2b-graphical-foundation';
const GATE_SPECS_JSON = `${GATE_DIR}/candidate-specs.json`;
const GATE_SPECS_MD = `${GATE_DIR}/candidate-specs.md`;
const CLI_PLAN_JSON = `${GATE_DIR}/cli-mutation-plan.json`;
const CLI_PLAN_MD = `${GATE_DIR}/cli-mutation-plan.md`;
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD = `${GATE_DIR}/review-packet.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const MUTATION_LOG_JSON = `${GATE_DIR}/RX.2b-mutation-log.json`;

const APPROVED_REVIEW_QUEUE = ['A62', 'A63', 'A64', 'A65', 'A68', 'A69', 'A73'];
const CONDITIONAL_QUEUE = ['A71'];
const MUTATION_REVIEW_ORDER = [...APPROVED_REVIEW_QUEUE, ...CONDITIONAL_QUEUE];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function generatorExists(generatorName) {
  const source = fs.readFileSync(repoPath(GENERATORS), 'utf8');
  const id = generatorName.replace(/^GEN_/, '');
  return new RegExp(`GEN\\.${id}\\s*=`).test(source);
}

function mdEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function toMarkdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => mdEscape(column.value(row))).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const CANDIDATE_SPECS = [
  {
    id: 'A62',
    name: 'Waarden aflezen uit staafdiagram',
    kern: 'Lees een waarde af uit een staafdiagram door context, labels, eenheid en schaal te controleren voordat je de staafhoogte gebruikt.',
    needs: [],
    mastery_target: 'apply',
    prior_learning: 'review_and_extend',
    aspects: ['grafisch'],
    terms: [],
    assumed_prior_knowledge: ['basisvaardigheid grafieken lezen uit de onderbouw'],
    zero_needs_status: 'underbouw_assumed',
    zero_needs_review: {
      reviewed_on: '2026-04-30',
      reviewer: 'RX.2b graphical foundation review pending',
      rationale: 'Candidate root extends lower-secondary bar-chart reading into economic source-value reading with explicit context, unit, scale, and estimate checks.',
      recommended_needs: [],
      severity: 'medium',
    },
    procedure: [
      'Lees de titel en bepaal de economische context van het staafdiagram.',
      'Bepaal welke variabele wordt weergegeven en in welke eenheid die staat.',
      'Controleer de categorie- of legendalabels zodat je de juiste staaf kiest.',
      'Controleer de schaal van de as, inclusief sprongen en of de as bij nul begint.',
      'Lees de hoogte van de gevraagde staaf af.',
      'Bepaal of de waarde exact kan worden afgelezen of dat je moet schatten tussen schaalstrepen.',
    ],
    pitfalls: [
      'Staven visueel vergelijken zonder de schaal of asbreuk te controleren.',
      'Een staaf bij de verkeerde categorie of legenda aflezen.',
    ],
    generator: 'GEN_A62',
  },
  {
    id: 'A63',
    name: 'Waarden aflezen uit lijngrafiek',
    kern: 'Lees een punt of periode af uit een lijngrafiek door context, aslabels, eenheden, schaal en eventuele interpolatie expliciet te controleren.',
    needs: [],
    mastery_target: 'apply',
    prior_learning: 'review_and_extend',
    aspects: ['grafisch'],
    terms: [],
    assumed_prior_knowledge: ['basisvaardigheid grafieken lezen uit de onderbouw'],
    zero_needs_status: 'underbouw_assumed',
    zero_needs_review: {
      reviewed_on: '2026-04-30',
      reviewer: 'RX.2b graphical foundation review pending',
      rationale: 'Candidate root extends lower-secondary line-graph reading into economic time-series source-value selection with explicit point, period, scale, and interpolation checks.',
      recommended_needs: [],
      severity: 'medium',
    },
    procedure: [
      'Lees de titel en bepaal welke ontwikkeling of context de lijngrafiek toont.',
      'Bepaal welke variabelen op de horizontale en verticale as staan en noteer de eenheden.',
      'Controleer de labels, jaartallen of meetpunten die bij de vraag horen.',
      'Controleer de schaal op beide assen en let op ongelijke stappen of asbreuken.',
      'Lees het gevraagde punt of de gevraagde punten af.',
      'Bepaal of je exact afleest, schat tussen schaalstrepen, of interpoleert tussen twee punten.',
    ],
    pitfalls: [
      'Het verkeerde jaar of meetpunt gebruiken.',
      'Een lijnstuk behandelen als totaal over een periode in plaats van als waarden op meetpunten.',
    ],
    generator: 'GEN_A63',
  },
  {
    id: 'A64',
    name: 'Aandelen aflezen uit cirkeldiagram',
    kern: 'Lees een aandeel uit een cirkeldiagram door context, categorie, legenda, totaal en de betekenis van procenten of delen te controleren.',
    needs: [],
    mastery_target: 'apply',
    prior_learning: 'review_and_extend',
    aspects: ['grafisch', 'rekenen'],
    terms: [],
    assumed_prior_knowledge: ['basisvaardigheid diagrammen lezen uit de onderbouw'],
    zero_needs_status: 'underbouw_assumed',
    zero_needs_review: {
      reviewed_on: '2026-04-30',
      reviewer: 'RX.2b graphical foundation review pending',
      rationale: 'Candidate root extends lower-secondary pie-chart reading into economic share reading; it must keep shares distinct from absolute amounts.',
      recommended_needs: [],
      severity: 'medium',
    },
    procedure: [
      'Lees de titel en bepaal welk totaal het cirkeldiagram verdeelt.',
      'Bepaal welke categorie of legenda bij het gevraagde deel hoort.',
      'Controleer welke variabele, eenheid of meetgroep het diagram gebruikt.',
      'Controleer de schaal of verdeling van de sectoren: percentages, graden, breuken of alleen visuele delen.',
      'Controleer of er een totaalbedrag of totale hoeveelheid bij de bron hoort.',
      'Lees het aandeel van de gevraagde categorie af.',
      'Bepaal of het aandeel exact is gegeven of dat je het moet schatten uit de sector of legenda.',
    ],
    pitfalls: [
      'Een aandeel uit het cirkeldiagram behandelen als een absolute hoeveelheid.',
      'Aandelen uit twee cirkeldiagrammen vergelijken zonder te controleren of de totalen gelijk zijn.',
    ],
    generator: 'GEN_A64',
  },
  {
    id: 'A65',
    name: 'Absolute hoeveelheid berekenen uit aandeel en totaal',
    kern: 'Bereken een absolute hoeveelheid door een aandeel uit een bron te vermenigvuldigen met het totale aantal, bedrag of volume.',
    needs: ['A64', 'A04'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['grafisch', 'rekenen'],
    terms: [],
    procedure: [
      'Lees het aandeel uit de bron en zet het om naar een decimaal of breuk.',
      'Bepaal het totale aantal, bedrag of volume waarop het aandeel slaat.',
      'Controleer of aandeel en totaal bij dezelfde periode, groep en eenheid horen.',
      'Bereken absolute hoeveelheid = aandeel x totaal.',
      'Rond af op de manier die bij de context of vraag past.',
    ],
    pitfalls: [
      'Het percentage als geheel getal gebruiken, bijvoorbeeld 25 x totaal in plaats van 0,25 x totaal.',
      'Een aandeel gebruiken dat bij een ander totaal of andere periode hoort.',
    ],
    generator: 'GEN_A65',
  },
  {
    id: 'A68',
    name: 'Procentuele verandering berekenen vanuit staafdiagram',
    kern: 'Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een staafdiagram hebt afgelezen met de juiste basiswaarde.',
    needs: ['A38', 'A62', 'A66'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['grafisch', 'rekenen'],
    terms: [],
    procedure: [
      'Lees de titel, variabele, eenheid, labels en schaal van het staafdiagram.',
      'Bepaal welke staaf de oude waarde is en welke staaf de nieuwe waarde is.',
      'Lees beide staafwaarden zo nauwkeurig mogelijk af.',
      'Controleer of beide waarden dezelfde grootheid en eenheid hebben.',
      'Bereken de verandering: nieuwe waarde min oude waarde.',
      'Deel de verandering door de oude waarde en vermenigvuldig met 100 procent.',
    ],
    pitfalls: [
      'De nieuwe waarde als noemer gebruiken.',
      'Staafhoogtes visueel vergelijken zonder de as-schaal te gebruiken.',
    ],
    generator: 'GEN_A68',
  },
  {
    id: 'A69',
    name: 'Procentuele verandering berekenen vanuit lijngrafiek',
    kern: 'Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een lijngrafiek of tijdreeks hebt afgelezen.',
    needs: ['A38', 'A63', 'A66'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['grafisch', 'rekenen'],
    terms: [],
    procedure: [
      'Lees de titel, assen, eenheden en schaal van de lijngrafiek.',
      'Bepaal welk punt de oude waarde is en welk punt de nieuwe waarde is.',
      'Lees beide waarden exact af, schat tussen schaalstrepen, of interpoleer als dat nodig is.',
      'Controleer of de periode en grootheid overeenkomen met de vraag.',
      'Bereken de verandering: nieuwe waarde min oude waarde.',
      'Deel door de oude waarde en vermenigvuldig met 100 procent.',
    ],
    pitfalls: [
      'Het verkeerde begin- of eindjaar nemen.',
      'Indexpunten, absolute verandering en procentuele verandering door elkaar halen.',
    ],
    generator: 'GEN_A69',
  },
  {
    id: 'A73',
    name: 'Indexverandering aflezen uit lijngrafiek',
    kern: 'Lees indexcijfers uit een lijngrafiek af en onderscheid een verandering in indexpunten van een procentuele verandering.',
    needs: ['A39', 'A63'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['grafisch', 'rekenen'],
    terms: [],
    procedure: [
      'Lees de titel, assen, eenheden en schaal van de indexgrafiek.',
      'Bepaal het basisjaar en controleer dat dit op 100 staat of als basis wordt genoemd.',
      'Lees het oude en nieuwe indexcijfer uit de lijngrafiek af.',
      'Bereken de verandering in indexpunten door oud van nieuw af te trekken.',
      'Controleer of de vraag indexpunten of een procentuele verandering vraagt.',
      'Gebruik A74 als de vraag een procentuele verandering tussen indexcijfers vraagt.',
    ],
    pitfalls: [
      'Een indexpuntverandering direct als procentuele verandering benoemen.',
      'Een indexgrafiek behandelen alsof de verticale as absolute eurobedragen toont.',
    ],
    generator: 'GEN_A73',
  },
  {
    id: 'A71',
    name: 'Procentuele verandering berekenen vanuit cirkeldiagram',
    kern: 'Bereken een procentuele verandering vanuit cirkeldiagrammen alleen nadat je aandelen, totalen en procentpuntverschillen correct hebt onderscheiden.',
    needs: ['A38', 'A64', 'A65', 'A70'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['grafisch', 'rekenen', 'verbaal'],
    terms: [],
    procedure: [
      'Lees per cirkeldiagram de titel, categorie, legenda en het totaal waarop de aandelen slaan.',
      'Lees het oude en nieuwe aandeel van de relevante categorie af.',
      'Controleer of de totalen in beide perioden gelijk zijn.',
      'Als de totalen verschillen, bereken eerst de absolute oude en nieuwe hoeveelheid.',
      'Bepaal of de vraag een procentpuntverandering of een procentuele verandering vraagt.',
      'Bereken de procentuele verandering alleen met de oude absolute waarde of oude percentagewaarde als basis.',
    ],
    pitfalls: [
      'Een verschil van aandelen in procentpunten verwarren met een procentuele verandering.',
      'Aandelen uit twee diagrammen vergelijken terwijl de onderliggende totalen verschillen.',
    ],
    generator: 'GEN_A71',
    review_flags: [
      {
        flag_id: 'A71-high-risk-conditional',
        severity: 'high',
        issue: 'Pie-chart percentage change can require share reading, share-times-total reconstruction, percentage-point distinction, and total comparison.',
        proposed_resolution: 'Allow the RX.2b gate to hold A71 while approving the lower-risk graphical foundation queue.',
      },
    ],
  },
];

function buildCoverageRows(unitsById, inventoryById, rx2BlockedIds) {
  const coverageSpec = [
    ['table_value_selection', 'Tabelwaarde selecteren voor berekening', 'A61', 'live_unit'],
    ['pq_graph_drawing', 'P-Q grafiek tekenen uit tabel', 'A45', 'live_unit'],
    ['pq_graph_value_reading', 'Waarden aflezen en interpoleren in P-Q grafiek', 'A46', 'live_unit'],
    ['bar_chart_value_reading', 'Waarden aflezen uit staafdiagram', 'A62', 'candidate_unit'],
    ['line_graph_value_reading', 'Waarden aflezen uit lijngrafiek', 'A63', 'candidate_unit'],
    ['pie_chart_share_reading', 'Aandelen aflezen uit cirkeldiagram', 'A64', 'candidate_unit'],
    ['share_times_total', 'Absolute hoeveelheid berekenen uit aandeel en totaal', 'A65', 'candidate_unit'],
    ['base_comparison_value_selection', 'Basiswaarde en vergelijkingswaarde in bron bepalen', 'A66', 'live_unit'],
    ['percentage_change_table', 'Procentuele verandering berekenen vanuit tabel', 'A67', 'live_unit'],
    ['percentage_point_distinction', 'Percentagepuntverandering in aandeel herkennen', 'A70', 'live_unit'],
    ['percentage_change_bar_chart', 'Procentuele verandering berekenen vanuit staafdiagram', 'A68', 'candidate_unit'],
    ['percentage_change_line_graph', 'Procentuele verandering berekenen vanuit lijngrafiek', 'A69', 'candidate_unit'],
    ['percentage_change_pie_chart', 'Procentuele verandering berekenen vanuit cirkeldiagram', 'A71', 'held_high_risk_unit'],
    ['index_from_table', 'Indexcijfer berekenen vanuit tabel', 'A72', 'live_unit'],
    ['index_change_line_graph', 'Indexverandering aflezen uit lijngrafiek', 'A73', 'candidate_unit'],
    ['percentage_change_index_values', 'Procentuele verandering berekenen vanuit indexcijfers', 'A74', 'live_unit'],
    ['producer_graph_foundation', 'Producentengrafiek en TO-TK grafiek lezen', 'A77/A78/A80/A81', 'deferred_not_rx2b_scope'],
    ['elasticity_graph_foundation', 'Elasticiteit vanuit bron of vraaggrafiek', 'A82/A83/A84', 'deferred_not_rx2b_scope'],
    ['other_chart_forms', 'Andere diagramtypen zoals spreidingsdiagram of gestapelde staaf', null, 'missing_not_yet_scoped'],
  ];

  return coverageSpec.map(([coverage_id, label, unit_id, planned_status]) => {
    const primaryId = unit_id && /^[A-Z]\d{2}$/.test(unit_id) ? unit_id : null;
    const liveUnit = primaryId ? unitsById.get(primaryId) : null;
    const inventoryRecord = primaryId ? inventoryById.get(primaryId) : null;
    const status = liveUnit ? 'live_unit' : planned_status;
    const generator = liveUnit && (liveUnit.generator || `GEN_${liveUnit.id}`);
    const generatorImplemented = generator ? generatorExists(generator) : false;
    return {
      coverage_id,
      label,
      unit_id,
      status,
      representation: inventoryRecord ? inventoryRecord.representation : null,
      base_operation: inventoryRecord ? inventoryRecord.base_operation : null,
      evidence_status: inventoryRecord ? inventoryRecord.evidence_status : null,
      risk: inventoryRecord ? inventoryRecord.risk : null,
      aspects: liveUnit ? liveUnit.aspects : (inventoryRecord ? inventoryRecord.aspects : []),
      generator_status: liveUnit
        ? (generatorImplemented ? 'implemented' : 'missing_generator_implementation')
        : (MUTATION_REVIEW_ORDER.includes(primaryId) ? 'future_generator_block_required_if_mutated' : 'not_applicable'),
      generator_blocked: liveUnit ? (!generatorImplemented || rx2BlockedIds.has(liveUnit.id)) : false,
      rx2b_role: APPROVED_REVIEW_QUEUE.includes(primaryId)
        ? 'approved_target_queue_for_mutation_review'
        : CONDITIONAL_QUEUE.includes(primaryId)
          ? 'conditional_review_target'
          : status === 'live_unit'
            ? 'baseline_live_dependency'
            : status === 'deferred_not_rx2b_scope'
              ? 'deferred_to_later_rx_sprint'
              : 'missing_but_not_yet_scoped',
      note: status === 'missing_not_yet_scoped'
        ? 'No current RX.1 evidence row scoped this as Book 1-4 graphical foundation work; keep as watch item rather than minting from syllabus or abstract possibility.'
        : null,
    };
  });
}

function buildCandidateBundle(inventoryById, unitsById) {
  const existingPlusPrior = new Set(unitsById.keys());
  return CANDIDATE_SPECS.map((spec, index) => {
    const inventoryRecord = inventoryById.get(spec.id);
    if (!inventoryRecord) throw new Error(`missing RX.1 inventory record for ${spec.id}`);
    const specErrors = validateSpec(spec, existingPlusPrior);
    const unresolvedNeeds = (spec.needs || []).filter((need) => !existingPlusPrior.has(need));
    existingPlusPrior.add(spec.id);
    return {
      candidate_id: spec.id,
      sequence_index: index + 1,
      lane: CONDITIONAL_QUEUE.includes(spec.id) ? 'conditional_high_risk' : 'approved_review_queue',
      live_numbering_status: unitsById.has(spec.id) ? 'conflict_live_id_exists' : 'available_at_review_generation',
      rx1_inventory_operation_id: inventoryRecord.operation_id,
      rx1_inventory_name: inventoryRecord.candidate_unit_name,
      rx1_inventory_needs: inventoryRecord.needs,
      rx2b_draft_spec: spec,
      evidence_refs: inventoryRecord.evidence_refs,
      evidence_status: inventoryRecord.evidence_status,
      risk: inventoryRecord.risk,
      generator_status: generatorExists(spec.generator) ? 'implemented' : 'missing_generator_implementation',
      generator_followup_required: !generatorExists(spec.generator),
      spec_validation_errors: specErrors,
      unresolved_needs_in_sequence: unresolvedNeeds,
      mutation_authorized: false,
      cli_execution_authorized: false,
    };
  });
}

function renderCandidateSpecsMarkdown(bundle) {
  const rows = bundle.candidates.map((candidate) => ({
    id: candidate.candidate_id,
    name: candidate.rx2b_draft_spec.name,
    lane: candidate.lane,
    needs: candidate.rx2b_draft_spec.needs.join(', ') || '[]',
    aspects: candidate.rx2b_draft_spec.aspects.join(', '),
    risk: candidate.risk,
    evidence: candidate.evidence_status,
    generator: candidate.generator_status,
  }));

  const procedureSections = bundle.candidates.map((candidate) => {
    const spec = candidate.rx2b_draft_spec;
    return [
      `### ${spec.id} ${spec.name}`,
      '',
      `- lane: ${candidate.lane}`,
      `- kern: ${spec.kern}`,
      `- needs: [${spec.needs.join(', ')}]`,
      `- aspects: [${spec.aspects.join(', ')}]`,
      `- risk: ${candidate.risk}`,
      `- evidence_status: ${candidate.evidence_status}`,
      `- generator_status: ${candidate.generator_status}`,
      '- procedure:',
      ...spec.procedure.map((step, index) => `  ${index + 1}. ${step}`),
      '- pitfalls:',
      ...spec.pitfalls.map((pitfall) => `  - ${pitfall}`),
      ...(spec.review_flags ? ['- review_flags:', ...spec.review_flags.map((flag) => `  - ${flag.flag_id}: ${flag.issue}`)] : []),
    ].join('\n');
  });

  return [
    '# RX.2b Candidate Specs',
    '',
    'Status: prepared for human review. Mutation is not authorized by this artifact.',
    '',
    toMarkdownTable(rows, [
      { label: 'ID', value: (row) => row.id },
      { label: 'Name', value: (row) => row.name },
      { label: 'Lane', value: (row) => row.lane },
      { label: 'Needs', value: (row) => row.needs },
      { label: 'Aspects', value: (row) => row.aspects },
      { label: 'Risk', value: (row) => row.risk },
      { label: 'Evidence', value: (row) => row.evidence },
      { label: 'Generator', value: (row) => row.generator },
    ]),
    '',
    '## Draft Unit Specs',
    '',
    ...procedureSections,
    '',
  ].join('\n');
}

function renderCoverageMarkdown(coverage) {
  const rows = coverage.coverage_rows.map((row) => ({
    id: row.coverage_id,
    label: row.label,
    unit: row.unit_id || '',
    status: row.status,
    role: row.rx2b_role,
    risk: row.risk || '',
    evidence: row.evidence_status || '',
    generator: row.generator_status,
  }));
  return [
    '# Graphical Foundation Coverage',
    '',
    `Generated on: ${coverage.generated_on}`,
    '',
    'This report distinguishes live units, candidate units, held/high-risk units, missing but not-yet-scoped items, and generator-blocked units for the RX graphical foundation layer.',
    '',
    '## Summary',
    '',
    `- live units: ${coverage.summary.live_unit_count}`,
    `- candidate units: ${coverage.summary.candidate_unit_count}`,
    `- held/high-risk units: ${coverage.summary.held_high_risk_count}`,
    `- missing/not-yet-scoped items: ${coverage.summary.missing_not_yet_scoped_count}`,
    `- generator-blocked live units: ${coverage.summary.generator_blocked_live_count}`,
    '',
    '## Coverage Matrix',
    '',
    toMarkdownTable(rows, [
      { label: 'Coverage ID', value: (row) => row.id },
      { label: 'Label', value: (row) => row.label },
      { label: 'Unit', value: (row) => row.unit },
      { label: 'Status', value: (row) => row.status },
      { label: 'RX.2b role', value: (row) => row.role },
      { label: 'Risk', value: (row) => row.risk },
      { label: 'Evidence', value: (row) => row.evidence },
      { label: 'Generator', value: (row) => row.generator },
    ]),
    '',
    '## Generator-Blocked Live Units',
    '',
    coverage.generator_blocked_units.length
      ? toMarkdownTable(coverage.generator_blocked_units, [
          { label: 'Unit', value: (row) => row.unit_id },
          { label: 'Generator', value: (row) => row.generator },
          { label: 'Status', value: (row) => row.generator_status },
        ])
      : 'No live graphical-foundation units are generator-blocked.',
    '',
    ...(coverage.backlog ? [
      '## Backlog',
      '',
      ...coverage.backlog.map((item) => [
        `### ${item.item_id}`,
        '',
        `- status: ${item.status}`,
        `- next_action: ${item.next_action}`,
        `- proof_required_to_close: ${item.proof_required_to_close}`,
      ].join('\n')),
      '',
    ] : []),
    '## Interpretation',
    '',
    '- RX.2b has not mutated the live unit catalog.',
    '- A62, A63, and A64 are the missing representation-reading foundation candidates and require explicit human review before CLI mutation.',
    '- A71 remains high risk and can be held while the lower-risk graphical foundation queue proceeds.',
    '- Student-facing skill-tree exposure remains blocked until generators are implemented and validated in a later sprint.',
    '',
  ].join('\n');
}

function isPostMutationState(unitsById) {
  if (!fs.existsSync(repoPath(CLOSURE_JSON)) || !fs.existsSync(repoPath(MUTATION_LOG_JSON))) return false;
  return APPROVED_REVIEW_QUEUE.every((id) => unitsById.has(id)) && CONDITIONAL_QUEUE.every((id) => !unitsById.has(id));
}

function markCoveragePostMutation(coverage, unitsById) {
  coverage.status = 'updated_after_cli_mutation';
  coverage.updated_on = new Date().toISOString();
  coverage.policy.protected_reference_data_changed = true;
  coverage.policy.protected_reference_data_change_mode = 'CLI-only via build-scripts/references/unit-add.js';
  for (const row of coverage.coverage_rows) {
    if (APPROVED_REVIEW_QUEUE.includes(row.unit_id)) {
      row.status = 'live_unit';
      row.rx2b_role = 'approved_mutated_unit_generator_blocked';
      row.generator_status = 'missing_generator_implementation';
      row.generator_blocked = true;
      row.aspects = unitsById.get(row.unit_id).aspects || row.aspects || [];
    }
    if (CONDITIONAL_QUEUE.includes(row.unit_id)) {
      row.status = 'held_high_risk_unit';
      row.rx2b_role = 'held_high_risk_for_later_focused_review';
      row.generator_status = 'not_applicable_until_mutated';
      row.generator_blocked = false;
    }
  }
  coverage.summary = {
    live_unit_count: coverage.coverage_rows.filter((row) => row.status === 'live_unit').length,
    candidate_unit_count: coverage.coverage_rows.filter((row) => row.status === 'candidate_unit').length,
    held_high_risk_count: coverage.coverage_rows.filter((row) => row.status === 'held_high_risk_unit').length,
    missing_not_yet_scoped_count: coverage.coverage_rows.filter((row) => row.status === 'missing_not_yet_scoped').length,
    deferred_not_rx2b_scope_count: coverage.coverage_rows.filter((row) => row.status === 'deferred_not_rx2b_scope').length,
    generator_blocked_live_count: coverage.coverage_rows.filter((row) => row.status === 'live_unit' && row.generator_blocked).length,
  };
  coverage.generator_blocked_units = coverage.coverage_rows
    .filter((row) => row.status === 'live_unit' && row.generator_blocked)
    .map((row) => ({
      unit_id: row.unit_id,
      generator: unitsById.get(row.unit_id).generator || `GEN_${row.unit_id}`,
      generator_status: row.generator_status,
      source: APPROVED_REVIEW_QUEUE.includes(row.unit_id) ? 'RX.2b' : 'prior_generator_block',
      student_facing_skilltree_use_allowed: false,
    }));
  coverage.backlog = [
    {
      item_id: 'other_chart_forms',
      status: 'missing_not_yet_scoped',
      next_action: 'Do not mint from abstract possibility. Add only if target exercises or exam evidence show scatterplots, stacked bars, or other chart forms requiring explicit representation-reading units.',
      proof_required_to_close: 'Evidence-backed row exists in a later representation-operation inventory or the item is explicitly closed as out of current course scope.',
    },
    {
      item_id: 'A71',
      status: 'held_high_risk',
      next_action: 'Run a later focused review for pie-chart percentage-change composition.',
      proof_required_to_close: 'Procedure and evidence show how to handle share versus absolute quantity, changing totals, percentage-point versus percentage change, and reconstruction before calculation.',
    },
  ];
}

function renderCliPlanMarkdown(cliPlan) {
  const rows = cliPlan.ordered_steps.map((step) => ({
    order: step.sequence_index,
    id: step.candidate_id,
    lane: step.lane,
    command: step.command_template,
    authorized: step.execution_authorized,
  }));
  return [
    '# RX.2b Draft CLI Mutation Plan',
    '',
    'Status: draft pending human review. Do not execute these commands until the gate closure explicitly authorizes CLI execution.',
    '',
    toMarkdownTable(rows, [
      { label: 'Order', value: (row) => row.order },
      { label: 'ID', value: (row) => row.id },
      { label: 'Lane', value: (row) => row.lane },
      { label: 'Execution authorized', value: (row) => row.authorized },
      { label: 'Command template', value: (row) => row.command },
    ]),
    '',
  ].join('\n');
}

function renderReviewPacketMarkdown(packet, coverage, candidates) {
  const questions = packet.review_questions.map((question) => [
    `### ${question.id}`,
    '',
    question.question,
    '',
    ...question.options.map((option) => `- ${option}`),
  ].join('\n'));

  return [
    '# GATE-RX2b Graphical Foundation Review Packet',
    '',
    `Status: ${packet.status}`,
    '',
    '## Purpose',
    '',
    packet.purpose,
    '',
    '## Boundary',
    '',
    '- Mutation is not authorized by this packet.',
    '- Any later mutation must be CLI-only through `build-scripts/references/unit-add.js`.',
    '- No hand edits to `references/machine/`, `references/external/`, authored source files, RAG chunks, or lesson targets are allowed.',
    '- No student diagnostics, adaptive routing, student-facing AI, sequencing, mastery decisions, or summative use is authorized.',
    '',
    '## Target Queue',
    '',
    '- Approved review queue: `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, `A73`.',
    '- Conditional high-risk review target: `A71`.',
    '',
    '## Coverage Summary',
    '',
    `- live units: ${coverage.summary.live_unit_count}`,
    `- candidate units: ${coverage.summary.candidate_unit_count}`,
    `- held/high-risk units: ${coverage.summary.held_high_risk_count}`,
    `- missing/not-yet-scoped items: ${coverage.summary.missing_not_yet_scoped_count}`,
    `- generator-blocked live units: ${coverage.summary.generator_blocked_live_count}`,
    '',
    '## Candidate Summary',
    '',
    toMarkdownTable(candidates.candidates, [
      { label: 'ID', value: (row) => row.candidate_id },
      { label: 'Name', value: (row) => row.rx2b_draft_spec.name },
      { label: 'Lane', value: (row) => row.lane },
      { label: 'Needs', value: (row) => row.rx2b_draft_spec.needs.join(', ') || '[]' },
      { label: 'Risk', value: (row) => row.risk },
      { label: 'Evidence', value: (row) => row.evidence_status },
    ]),
    '',
    '## Review Questions',
    '',
    ...questions,
    '',
  ].join('\n');
}

function main() {
  const inventory = readJson(RX1_INVENTORY);
  const rx1Closure = readJson(RX1_CLOSURE);
  const rx2Closure = readJson(RX2_CLOSURE);
  const rx2Block = readJson(RX2_GENERATOR_BLOCK);
  const units = readJson(UNITS);

  if (rx1Closure.status !== 'pass_with_conditions') {
    throw new Error('RX.2b requires RX.1 gate status pass_with_conditions');
  }
  if (rx2Closure.status !== 'pass_with_conditions') {
    throw new Error('RX.2b requires RX.2 gate status pass_with_conditions');
  }

  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const inventoryById = new Map(inventory.records.map((record) => [record.candidate_unit_id, record]));
  const rx2BlockedIds = new Set((rx2Block.units || []).map((unit) => unit.unit_id));
  const liveAIds = units
    .filter((unit) => /^A\d{2}$/.test(unit.id))
    .map((unit) => Number(unit.id.slice(1)));
  const liveMaxA = `A${String(Math.max(...liveAIds)).padStart(2, '0')}`;

  const coverageRows = buildCoverageRows(unitsById, inventoryById, rx2BlockedIds);
  const coverage = {
    schema_version: 1,
    report_id: 'graphical-foundation-coverage',
    sprint_id: 'RX.2b',
    status: 'prepared_for_human_review',
    generated_by: 'build-scripts/references/build-rx2b-graphical-foundation-review.js',
    generated_on: new Date().toISOString(),
    source_files: [RX1_INVENTORY, RX1_CLOSURE, RX2_CLOSURE, RX2_GENERATOR_BLOCK, UNITS, GENERATORS],
    policy: {
      mutation_authorized: false,
      cli_execution_authorized: false,
      protected_reference_data_changed: false,
      live_a_domain_max_id_at_generation: liveMaxA,
      candidate_ids_are_provisional_until_execution: true,
      student_facing_skilltree_use_allowed: false,
    },
    summary: {
      live_unit_count: coverageRows.filter((row) => row.status === 'live_unit').length,
      candidate_unit_count: coverageRows.filter((row) => row.status === 'candidate_unit').length,
      held_high_risk_count: coverageRows.filter((row) => row.status === 'held_high_risk_unit').length,
      missing_not_yet_scoped_count: coverageRows.filter((row) => row.status === 'missing_not_yet_scoped').length,
      deferred_not_rx2b_scope_count: coverageRows.filter((row) => row.status === 'deferred_not_rx2b_scope').length,
      generator_blocked_live_count: coverageRows.filter((row) => row.status === 'live_unit' && row.generator_blocked).length,
    },
    coverage_rows: coverageRows,
    generator_blocked_units: coverageRows
      .filter((row) => row.status === 'live_unit' && row.generator_blocked)
      .map((row) => ({
        unit_id: row.unit_id,
        generator: unitsById.get(row.unit_id).generator || `GEN_${row.unit_id}`,
        generator_status: row.generator_status,
        student_facing_skilltree_use_allowed: false,
      })),
  };

  if (isPostMutationState(unitsById)) {
    markCoveragePostMutation(coverage, unitsById);
    writeJson(COVERAGE_JSON, coverage);
    writeText(COVERAGE_MD, renderCoverageMarkdown(coverage));
    console.log(`OK RX.2b graphical foundation coverage refreshed post-mutation: ${coverage.summary.live_unit_count} live units`);
    return;
  }

  const candidates = {
    schema_version: 1,
    sprint_id: 'RX.2b',
    artifact_id: 'RX.2b-graphical-foundation-candidate-specs',
    status: 'prepared_for_mutation_review',
    generated_by: 'build-scripts/references/build-rx2b-graphical-foundation-review.js',
    generated_on: coverage.generated_on,
    source_files: [RX1_INVENTORY, RX1_CLOSURE, RX2_CLOSURE, UNITS, GENERATORS],
    policy: {
      mutation_authorized: false,
      cli_execution_authorized: false,
      protected_reference_data_changed: false,
      candidate_ids_are_provisional_until_execution: true,
      live_a_domain_max_id_at_review_generation: liveMaxA,
      approved_review_queue: APPROVED_REVIEW_QUEUE,
      conditional_queue: CONDITIONAL_QUEUE,
      required_mutation_order_if_approved: MUTATION_REVIEW_ORDER,
      student_facing_skilltree_use_allowed: false,
    },
    candidates: buildCandidateBundle(inventoryById, unitsById),
  };

  const cliPlan = {
    schema_version: 1,
    sprint_id: 'RX.2b',
    gate_id: 'GATE-RX2b-graphical-foundation',
    status: 'draft_pending_human_review',
    generated_by: 'build-scripts/references/build-rx2b-graphical-foundation-review.js',
    generated_on: coverage.generated_on,
    mutation_authorized: false,
    execution_authorized: false,
    required_execution_mode_if_approved: 'CLI-only via build-scripts/references/unit-add.js',
    ordered_steps: candidates.candidates.map((candidate) => ({
      sequence_index: candidate.sequence_index,
      candidate_id: candidate.candidate_id,
      lane: candidate.lane,
      execution_authorized: false,
      mutation_authorized: false,
      command_template: `node build-scripts/references/unit-add.js --spec '${JSON.stringify(candidate.rx2b_draft_spec)}'`,
    })),
  };

  const reviewPacket = {
    gate_id: 'GATE-RX2b-graphical-foundation',
    sprint_id: 'RX.2b',
    status: 'prepared_for_human_review',
    generated_by: 'build-scripts/references/build-rx2b-graphical-foundation-review.js',
    generated_on: coverage.generated_on,
    purpose: 'Review the RX.2b graphical foundation coverage report and decide whether any CLI-only unit mutation may proceed for the basic graphical representation-reading queue.',
    mutation_authorized: false,
    cli_execution_authorized: false,
    protected_reference_data_changed: false,
    artifacts: [COVERAGE_JSON, COVERAGE_MD, OUT_SPECS, GATE_SPECS_JSON, GATE_SPECS_MD, CLI_PLAN_JSON, CLI_PLAN_MD],
    approved_review_queue: APPROVED_REVIEW_QUEUE,
    conditional_queue: CONDITIONAL_QUEUE,
    required_procedure_standard_for_foundation_units: [
      'Identify the title/context.',
      'Identify the variable and unit.',
      'Check axis, legend, or category labels.',
      'Check the scale.',
      'Read the value.',
      'Decide whether exact reading, estimation, or interpolation is required.',
    ],
    review_questions: [
      {
        id: 'RX2b-Q1',
        question: 'Is the graphical foundation queue complete enough for bar, line, pie, percentage-change, and index-reading basics?',
        options: ['A. Yes', 'B. Mostly, with additions needed', 'C. No, hold and expand the queue', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q2',
        question: 'Are A62, A63, and A64 acceptable as representation-reading foundation units with explicit context, labels, units, scale, exact/estimated reading, and interpolation steps?',
        options: ['A. Yes', 'B. Yes, with wording fixes', 'C. No, procedures are too thin', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q3',
        question: 'Is A65 justified as a composed share-times-total unit after A64 and A04?',
        options: ['A. Yes', 'B. Yes, but revise needs or wording', 'C. No, hold A65', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q4',
        question: 'Are A68, A69, and A73 sufficiently grounded for mutation review?',
        options: ['A. Yes', 'B. Mostly, approve a subset', 'C. No, hold all composed visual calculations', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q5',
        question: 'Is A71 safe to mutate now, or should it remain held because pie-chart percentage-change composition is high risk?',
        options: ['A. Approve A71', 'B. Hold A71 for later review', 'C. Split A71 before approval', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q6',
        question: 'Should the provisional IDs A62/A63/A64/A65/A68/A69/A73 and conditional A71 be preserved with gaps?',
        options: ['A. Preserve IDs with gaps', 'B. Renumber before mutation', 'C. Decide only at execution time', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q7',
        question: 'Does the dependency order work without unresolved needs or cycles if approved candidates are applied in the proposed order?',
        options: ['A. Yes', 'B. Yes, but add checks', 'C. No, revise order or needs', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q8',
        question: 'Does the graphical foundation coverage report clearly distinguish live, candidate, held/high-risk, missing/not-scoped, and generator-blocked skills?',
        options: ['A. Yes', 'B. Mostly, with report wording fixes', 'C. No, revise report before closure', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q9',
        question: 'Are all newly approved A-units to remain generator-blocked/non-interactive until RX.6 generator implementation and validation?',
        options: ['A. Yes', 'B. Yes, but strengthen warnings', 'C. No, implement generators first', 'D. Not enough evidence'],
      },
      {
        id: 'RX2b-Q10',
        question: 'What gate status should GATE-RX2b-graphical-foundation receive?',
        options: ['A. pass', 'B. pass_with_conditions', 'C. hold', 'D. fail'],
      },
    ],
    valid_gate_statuses: ['pass', 'pass_with_conditions', 'hold', 'fail'],
  };

  writeJson(COVERAGE_JSON, coverage);
  writeText(COVERAGE_MD, renderCoverageMarkdown(coverage));
  writeJson(OUT_SPECS, candidates);
  writeJson(GATE_SPECS_JSON, candidates);
  writeText(GATE_SPECS_MD, renderCandidateSpecsMarkdown(candidates));
  writeJson(CLI_PLAN_JSON, cliPlan);
  writeText(CLI_PLAN_MD, renderCliPlanMarkdown(cliPlan));
  writeJson(REVIEW_PACKET_JSON, reviewPacket);
  writeText(REVIEW_PACKET_MD, renderReviewPacketMarkdown(reviewPacket, coverage, candidates));

  console.log(`OK RX.2b graphical foundation review: ${candidates.candidates.length} candidates, mutation_authorized=false`);
}

if (require.main === module) main();
