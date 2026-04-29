#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - RX.2 first-lane work is planning/review only until the mutation review
 *   explicitly authorizes CLI execution.
 * - Keep execution_authorized and mutation_authorized false in this builder.
 * - Do not write references/machine/, references/external/, authored source
 *   files, RAG chunks, or lesson targets from this script.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RX1_INVENTORY = 'references/data/sprints/RX.1-representation-operation-inventory.json';
const RX1_CLOSURE = 'reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json';
const UNITS = 'references/machine/micro-teaching-units.json';
const GENERATORS = 'engines/skilltree/generators.js';
const OUT_SPECS = 'references/data/sprints/RX.2-first-lane-candidate-specs.json';
const GATE_DIR = 'reports/review-gates/GATE-RX2-first-lane-mutation-review';
const CANDIDATE_JSON = `${GATE_DIR}/candidate-specs.json`;
const CANDIDATE_MD = `${GATE_DIR}/candidate-specs.md`;
const CLI_PLAN_JSON = `${GATE_DIR}/cli-mutation-plan.json`;
const CLI_PLAN_MD = `${GATE_DIR}/cli-mutation-plan.md`;
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD = `${GATE_DIR}/review-packet.md`;

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

function toMarkdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(column.value(row) ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const FIRST_LANE_SPECS = [
  {
    id: 'A61',
    name: 'Tabelwaarden selecteren voor berekening',
    kern: 'Selecteer in een tabel de waarden die nodig zijn voor een berekening: juiste rij, kolom, periode en oude/nieuwe waarde.',
    needs: [],
    mastery_target: 'apply',
    prior_learning: 'review_and_extend',
    aspects: ['rekenen', 'verbaal'],
    terms: [],
    assumed_prior_knowledge: ['basisvaardigheid tabel lezen uit de onderbouw'],
    zero_needs_status: 'underbouw_assumed',
    zero_needs_review: {
      reviewed_on: '2026-04-29',
      reviewer: 'RX.2 mutation review pending',
      rationale: 'Candidate root extends lower-secondary table reading into economic source selection; final mutation requires RX.2 approval.',
      recommended_needs: [],
      severity: 'low',
    },
    procedure: [
      'Lees eerst de vraag: welke grootheid, periode, rij of kolom heb je nodig?',
      'Zoek de juiste bron, tabelkop en eenheid.',
      'Selecteer de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent.',
      'Controleer of je totaal, gemiddelde, percentage of indexwaarde gebruikt.',
      'Noteer de gekozen waarden met label zodat de berekening controleerbaar is.',
    ],
    pitfalls: [
      'Een zichtbaar getal kiezen zonder te controleren of het bij de juiste rij of kolom hoort.',
      'Totaalwaarden, gemiddelde waarden en procentwaarden door elkaar halen.',
    ],
    generator: 'GEN_A61',
  },
  {
    id: 'A66',
    name: 'Basiswaarde en vergelijkingswaarde in bron bepalen',
    kern: 'Bepaal in een bron welke waarde de basiswaarde is en welke waarde de vergelijkingswaarde is voordat je een procentuele verandering berekent.',
    needs: ['A61'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['rekenen', 'verbaal'],
    terms: [],
    procedure: [
      'Bepaal welke situatie eerder, oorspronkelijk of als basis geldt.',
      'Bepaal welke situatie nieuw, later of vergelijkend is.',
      'Label de basiswaarde als oud of basis en de vergelijkingswaarde als nieuw.',
      'Controleer of de vraag om stijging, daling of vergelijking vraagt.',
      'Gebruik de basiswaarde als noemer bij een procentuele verandering.',
    ],
    pitfalls: [
      'De nieuwe waarde als basiswaarde gebruiken.',
      'De volgorde in de tekst volgen zonder te kijken welke situatie de basis is.',
    ],
    generator: 'GEN_A66',
  },
  {
    id: 'A67',
    name: 'Procentuele verandering berekenen vanuit tabel',
    kern: 'Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een tabel hebt geselecteerd.',
    needs: ['A38', 'A61', 'A66'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['rekenen', 'verbaal'],
    terms: [],
    procedure: [
      'Selecteer in de tabel de oude waarde en de nieuwe waarde.',
      'Controleer de eenheid en of beide waarden dezelfde grootheid meten.',
      'Bereken de verandering: nieuwe waarde min oude waarde.',
      'Deel de verandering door de oude waarde.',
      'Vermenigvuldig met 100 procent en controleer teken en context.',
    ],
    pitfalls: [
      'De verkeerde tabelrij vergelijken.',
      'Het absolute verschil als procentuele verandering noteren.',
    ],
    generator: 'GEN_A67',
  },
  {
    id: 'A70',
    name: 'Percentagepuntverandering in aandeel herkennen',
    kern: 'Herken een verandering in procentpunten tussen twee percentagewaarden en onderscheid die van een procentuele verandering.',
    needs: ['A38'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['rekenen', 'verbaal'],
    terms: [],
    procedure: [
      'Lees de oude en nieuwe percentagewaarde.',
      'Bereken het verschil in procentpunten: nieuw percentage min oud percentage.',
      'Benoem de uitkomst als procentpunt of procentpunten.',
      'Controleer of de vraag toch een procentuele verandering vraagt.',
      'Gebruik A38 alleen wanneer de relatieve verandering van het percentage zelf gevraagd wordt.',
    ],
    pitfalls: [
      'Een stijging van 20% naar 25% als 5% benoemen in plaats van 5 procentpunt.',
      'Procentpunten en procentuele veranderingen door elkaar gebruiken.',
    ],
    generator: 'GEN_A70',
    review_flags: [
      {
        flag_id: 'A70-needs-adjustment',
        severity: 'medium',
        issue: 'RX.1 inventory listed A70 -> A64, but A64 is chart-only and deferred by the RX.1 gate.',
        proposed_resolution: 'Use A38 as the first-lane prerequisite for a generic percentage-point unit; keep pie-chart share reading in the deferred A64/A71 lane.',
      },
    ],
  },
  {
    id: 'A72',
    name: 'Indexcijfer berekenen vanuit tabel',
    kern: 'Bereken een indexcijfer vanuit tabelwaarden door het doeljaar te delen door het basisjaar en te vermenigvuldigen met 100.',
    needs: ['A39', 'A61'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['rekenen', 'verbaal'],
    terms: [],
    procedure: [
      'Selecteer in de tabel de waarde van het basisjaar.',
      'Selecteer de waarde van het doeljaar.',
      'Controleer dat beide waarden dezelfde mand, prijs of grootheid meten.',
      'Bereken index = waarde doeljaar / waarde basisjaar x 100.',
      'Controleer of het basisjaar op 100 staat.',
    ],
    pitfalls: [
      'Het doeljaar als basisjaar nemen.',
      'Indexpunten verwarren met procentuele verandering.',
    ],
    generator: 'GEN_A72',
  },
  {
    id: 'A74',
    name: 'Procentuele verandering berekenen vanuit indexcijfers',
    kern: 'Bereken een procentuele verandering tussen twee indexcijfers door de verandering te delen door het oude indexcijfer.',
    needs: ['A38', 'A39', 'A66'],
    mastery_target: 'apply',
    prior_learning: 'new_this_year',
    aspects: ['rekenen', 'verbaal'],
    terms: [],
    procedure: [
      'Bepaal welk indexcijfer de oude waarde is.',
      'Bepaal welk indexcijfer de nieuwe waarde is.',
      'Bereken het verschil tussen de indexcijfers.',
      'Deel het verschil door het oude indexcijfer.',
      'Vermenigvuldig met 100 procent en benoem het als procentuele verandering.',
    ],
    pitfalls: [
      'Alleen indexpunten aftrekken en dat percentage noemen.',
      'Delen door 100 in plaats van door het oude indexcijfer.',
    ],
    generator: 'GEN_A74',
  },
];

function main() {
  const inventory = readJson(RX1_INVENTORY);
  const closure = readJson(RX1_CLOSURE);
  const units = readJson(UNITS);
  if (closure.status !== 'pass_with_conditions' || closure.rx2_planning_authorized !== true) {
    throw new Error('RX.2 first-lane review requires RX.1 pass_with_conditions closure with planning authorization');
  }

  const liveIds = new Set(units.map((unit) => unit.id));
  const liveMaxA = Math.max(...units.filter((unit) => /^A\d{2}$/.test(unit.id)).map((unit) => Number(unit.id.slice(1))));
  const firstLane = closure.rx2_first_lane;
  const inventoryById = new Map(inventory.records.map((record) => [record.candidate_unit_id, record]));
  const specs = FIRST_LANE_SPECS.map((spec, index) => {
    const inventoryRecord = inventoryById.get(spec.id);
    if (!inventoryRecord) throw new Error(`missing RX.1 inventory record for ${spec.id}`);
    return {
      candidate_id: spec.id,
      sequence_index: index + 1,
      live_numbering_status: liveIds.has(spec.id) ? 'conflict_live_id_exists' : 'available_at_review_generation',
      rx1_inventory_operation_id: inventoryRecord.operation_id,
      rx1_inventory_name: inventoryRecord.candidate_unit_name,
      rx1_inventory_needs: inventoryRecord.needs,
      rx2_draft_spec: spec,
      evidence_refs: inventoryRecord.evidence_refs,
      evidence_status: inventoryRecord.evidence_status,
      risk: inventoryRecord.risk,
      generator_status: generatorExists(spec.generator) ? 'implemented' : 'missing_generator_implementation',
      generator_followup_required: !generatorExists(spec.generator),
      mutation_authorized: false,
      cli_execution_authorized: false,
    };
  });

  const candidateSpecs = {
    schema_version: 1,
    sprint_id: 'RX.2',
    artifact_id: 'RX.2-first-lane-candidate-specs',
    status: 'prepared_for_mutation_review',
    generated_by: 'build-scripts/references/build-rx2-first-lane-review.js',
    generated_on: new Date().toISOString(),
    source_files: [RX1_INVENTORY, RX1_CLOSURE, UNITS, GENERATORS],
    policy: {
      mutation_authorized: false,
      cli_execution_authorized: false,
      protected_reference_data_changed: false,
      candidate_ids_are_provisional_until_execution: true,
      live_a_domain_max_id_at_review_generation: `A${String(liveMaxA).padStart(2, '0')}`,
      first_lane_scope: firstLane,
      deferred_candidates: ['A62', 'A63', 'A64', 'A68', 'A69', 'A71', 'A73', 'A82', 'A83', 'A84'],
      held_duplicate_records_remain_blocked: true,
    },
    candidates: specs,
  };

  const cliPlan = {
    schema_version: 1,
    sprint_id: 'RX.2',
    plan_id: 'RX.2-first-lane-cli-mutation-plan',
    status: 'draft_pending_human_review',
    generated_by: candidateSpecs.generated_by,
    generated_on: candidateSpecs.generated_on,
    execution_authorized: false,
    mutation_authorized: false,
    required_pre_execution_checks: [
      'Re-run live A-domain numbering check.',
      'Confirm GATE-RX2-first-lane-mutation-review closure authorizes CLI execution.',
      'Confirm all candidate needs are live units or earlier approved first-lane candidates.',
      'Confirm generator status is implemented or explicitly tracked as blocked/non-interactive.',
    ],
    ordered_steps: specs.map((record) => ({
      candidate_id: record.candidate_id,
      command_template: `node build-scripts/references/unit-add.js --spec '${JSON.stringify(record.rx2_draft_spec)}'`,
      execution_authorized: false,
    })),
    forbidden_actions: [
      'Do not hand-edit references/machine/.',
      'Do not hand-edit references/external/.',
      'Do not mutate authored source files.',
      'Do not patch RAG chunks by hand.',
      'Do not execute unit-add.js before gate closure explicitly authorizes CLI execution.',
    ],
  };

  const reviewQuestions = [
    {
      id: 'RX2-Q1',
      question: 'Is the RX.2 first-lane scope correctly limited to A61, A66, A67, A70, A72, and A74?',
      options: ['A. Yes', 'B. Yes, but remove one candidate', 'C. No, add more candidates', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q2',
      question: 'Should the provisional IDs be preserved with gaps, or should the first lane be renumbered contiguously before mutation?',
      options: ['A. Preserve A61/A66/A67/A70/A72/A74', 'B. Renumber contiguously before mutation', 'C. Decide at execution time only', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q3',
      question: 'Is A61 acceptable as an underbouw-assumed root for table-value selection?',
      options: ['A. Yes', 'B. Yes, but strengthen zero-needs rationale', 'C. No, add prerequisite', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q4',
      question: 'Is the proposed A70 dependency adjustment acceptable, replacing the deferred A64 prerequisite with A38 for the first-lane generic percentage-point unit?',
      options: ['A. Yes', 'B. Use D31 instead or also', 'C. Hold A70', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q5',
      question: 'Are the draft kern, procedures, pitfalls, needs, aspects, and evidence references strong enough for mutation review?',
      options: ['A. Yes', 'B. Mostly, with wording fixes', 'C. No, revise before approval', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q6',
      question: 'Is it acceptable that all six generators are currently marked as missing implementation if generator follow-up is explicitly tracked?',
      options: ['A. Yes', 'B. Yes, but mark non-interactive until implemented', 'C. No, implement generators before unit mutation', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q7',
      question: 'Does the CLI mutation plan preserve protected-source boundaries and the required unit-add.js execution order?',
      options: ['A. Yes', 'B. Yes, but add checks', 'C. No, repair plan before approval', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q8',
      question: 'Should deferred chart-only, line-graph, elasticity, producer, and held duplicate/overlap candidates remain blocked during this first lane?',
      options: ['A. Yes', 'B. Mostly, name exceptions', 'C. No, expand scope now', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q9',
      question: 'If the gate passes, should it authorize immediate CLI-only unit mutation for the approved first-lane candidates?',
      options: ['A. Yes, all six', 'B. Yes, approved subset only', 'C. No, planning only', 'D. Not enough evidence'],
    },
    {
      id: 'RX2-Q10',
      question: 'What gate status should GATE-RX2-first-lane-mutation-review receive?',
      options: ['A. pass', 'B. pass_with_conditions', 'C. hold', 'D. fail'],
    },
  ];

  const reviewPacket = {
    gate_id: 'GATE-RX2-first-lane-mutation-review',
    sprint_id: 'RX.2',
    status: 'prepared_for_human_review',
    generated_by: candidateSpecs.generated_by,
    generated_on: candidateSpecs.generated_on,
    purpose: 'Review the bounded RX.2 first-lane candidate specs and decide whether any CLI-only unit mutation may proceed.',
    mutation_authorized: false,
    cli_execution_authorized: false,
    artifacts: [OUT_SPECS, CANDIDATE_JSON, CANDIDATE_MD, CLI_PLAN_JSON, CLI_PLAN_MD],
    first_lane: firstLane,
    blocked_candidates: candidateSpecs.policy.deferred_candidates,
    review_questions: reviewQuestions,
    valid_gate_statuses: ['pass', 'pass_with_conditions', 'hold', 'fail'],
  };

  writeJson(OUT_SPECS, candidateSpecs);
  writeJson(CANDIDATE_JSON, candidateSpecs);
  writeJson(CLI_PLAN_JSON, cliPlan);
  writeJson(REVIEW_PACKET_JSON, reviewPacket);

  writeText(CANDIDATE_MD, [
    '# RX.2 First-Lane Candidate Specs',
    '',
    `Generated: ${candidateSpecs.generated_on}`,
    '',
    'Mutation authorized: no',
    '',
    toMarkdownTable(specs, [
      { label: 'Candidate', value: (row) => row.candidate_id },
      { label: 'Name', value: (row) => row.rx2_draft_spec.name },
      { label: 'Needs', value: (row) => row.rx2_draft_spec.needs.join(', ') || '[]' },
      { label: 'Risk', value: (row) => row.risk },
      { label: 'Generator', value: (row) => row.generator_status },
      { label: 'Numbering', value: (row) => row.live_numbering_status },
    ]),
    '',
    'A70 includes an explicit dependency-review flag because the RX.1 inventory linked it to deferred A64.',
    '',
  ].join('\n'));

  writeText(CLI_PLAN_MD, [
    '# RX.2 CLI Mutation Plan',
    '',
    'Status: draft pending human review.',
    '',
    'Execution authorized: no',
    '',
    '## Required Pre-Execution Checks',
    '',
    ...cliPlan.required_pre_execution_checks.map((check) => `- ${check}`),
    '',
    '## Ordered Command Templates',
    '',
    ...cliPlan.ordered_steps.flatMap((step) => [
      `### ${step.candidate_id}`,
      '',
      '```bash',
      step.command_template,
      '```',
      '',
    ]),
    '## Forbidden Actions',
    '',
    ...cliPlan.forbidden_actions.map((action) => `- ${action}`),
    '',
  ].join('\n'));

  writeText(REVIEW_PACKET_MD, [
    '# GATE-RX2-first-lane-mutation-review Review Packet',
    '',
    'Status: `prepared_for_human_review`',
    '',
    'Purpose: review the bounded RX.2 first-lane candidate specs and decide whether any CLI-only unit mutation may proceed.',
    '',
    'Mutation authorized: no',
    '',
    '## First-Lane Candidates',
    '',
    ...firstLane.map((id) => `- \`${id}\``),
    '',
    '## Artifacts',
    '',
    ...reviewPacket.artifacts.map((artifact) => `- \`${artifact}\``),
    '',
    '## Review Questions',
    '',
    ...reviewQuestions.flatMap((question) => [
      `### ${question.id}`,
      '',
      question.question,
      '',
      'Options:',
      '',
      ...question.options.map((option) => `- ${option}`),
      '',
    ]),
  ].join('\n'));

  console.log(`OK RX.2 first-lane review packet: ${specs.length} candidates, mutation_authorized=false`);
}

if (require.main === module) main();
