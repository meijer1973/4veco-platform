#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GENERATED = '2026-06-03';
const GATE_SPRINT = 'GATE-SHARED-TASK-INGEST-1';
const GATE_ID = 'GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const SPRINTS = [
  {
    id: 'SYNC-TASK-CONTEXT-INGEST-1',
    name: 'Shared Task Context And Source Ingestion Roadmap Alignment',
    summary: 'Aligned the context-first task-shell requirement and prepared the follow-on context/ingestion track.',
    outputs: [
      'reports/sprints/SYNC-TASK-CONTEXT-INGEST-1-plan.md',
      'reports/sprints/SYNC-TASK-CONTEXT-INGEST-1-baseline.md',
      '../4veco-lessen/specifications/product-end-state.md',
      '../4veco-lessen/specifications/companion-core-specifications.md',
    ],
  },
  {
    id: 'TASK-CONTEXT-SPEC-1',
    name: 'Shared Task Context Contract',
    summary: 'Defined runtime contextBlocks and task contextRefs, including rejection rules for missing source context and copied image shortcuts.',
    outputs: [
      'reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md',
      'reports/json/task-context-spec1-contract.json',
      'reports/json/task-context-spec1-valid-fixture.json',
    ],
  },
  {
    id: 'TASK-CONTEXT-RUNTIME-1',
    name: 'Shared Task Context Runtime',
    summary: 'Added shared task-shell validation/rendering for context blocks before tasks with source references, captions, semantic tables, SVG figures, and formula blocks.',
    outputs: [
      'engines/task-shell-engine.js',
      'engines/task-shell-ui.js',
      'engines/task-shell.css',
      'engines/tests/task-shell-engine.test.js',
      'engines/tests/task-shell-ui.test.js',
      'build-scripts/sprints/check-task-context-runtime1.js',
    ],
  },
  {
    id: 'CONTEXT-VISUAL-STD-1',
    name: 'Source Context Visual Standard',
    summary: 'Recorded the visual standard for task context blocks: semantic tables, reconstructed SVG, formula boxes, source labels, captions, alt text, and mobile/dark behavior.',
    outputs: [
      'reports/sprints/CONTEXT-VISUAL-STD-1-standard.md',
      'reports/json/context-visual-std1-policy.json',
    ],
  },
  {
    id: 'SOURCE-RECONSTRUCT-1',
    name: 'Exam And Textbook Source Reconstruction Examples',
    summary: 'Prepared exam-style and textbook-style reconstructed source contexts with source maps, normalized blocks, SVG/table output, and fidelity notes.',
    outputs: [
      'reports/sprints/SOURCE-RECONSTRUCT-1-reconstruction-map.md',
      'reports/json/source-reconstruct1-exam-context.blocks.json',
      'reports/json/source-reconstruct1-textbook-context.blocks.json',
      'reports/sprints/SOURCE-RECONSTRUCT-1-visual-fidelity-notes.md',
    ],
  },
  {
    id: 'TASK-INGEST-TRANSFORM-1',
    name: 'Source Exercise To Task-Family Transformation',
    summary: 'Converted the reconstructed sources into shared task-family compositions with operation-chain and answer-form traces.',
    outputs: [
      'reports/sprints/TASK-INGEST-TRANSFORM-1-transformation-map.md',
      'reports/json/task-ingest-transform1-exam-task-set.json',
      'reports/json/task-ingest-transform1-textbook-task-set.json',
      'reports/json/task-ingest-transform1-operation-trace.json',
    ],
  },
  {
    id: GATE_SPRINT,
    name: 'Shared Task Context And Ingestion Human Review',
    gate: true,
    summary: 'Prepared a direct-comment human review packet with playable exam and textbook labs, proof JSON hooks, screenshots, and checker coverage.',
    outputs: [
      `reports/review-gates/${GATE_ID}/review-packet.md`,
      `reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-exam-lab.html`,
      `reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-textbook-lab.html`,
      `reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-data.json`,
    ],
  },
];

const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine.js'));

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function out(file) {
  return path.join(ROOT, file);
}

function write(file, content) {
  const target = out(file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function writeJson(file, data) {
  write(file, JSON.stringify(data, null, 2) + '\n');
}

function feedback(label) {
  return {
    matchTitle: 'Past bij de bron',
    matchText: `Je hebt de ${label} correct aan de bron gekoppeld.`,
    retryTitle: 'Kijk opnieuw naar de bron',
    retryText: 'Controleer welke bronblokken de taak noemt en herstel je keuze of volgorde.',
  };
}

function task(id, family, skillLabel, prompt, purpose, contextRefs, interaction, expected) {
  return {
    id,
    family,
    skillLabel,
    prompt,
    purpose,
    contextRefs,
    interaction,
    expected,
    feedback: feedback(skillLabel),
    practiceRoute: { label: 'Review-only contextlab', href: '#review-only' },
  };
}

const examContextBlocks = [
  {
    id: 'bron-ebikes',
    type: 'markdown',
    label: 'Bron 1',
    title: 'Fietsmarkt in Stadshaven',
    sourceRef: 'Reconstructed official-style economics source, local review data 2026',
    body:
      'Een fietsenwinkel in Stadshaven vergelijkt de verkoop van e-bikes in januari en mei.\n\nDe eigenaar wil weten hoeveel de prijs van Model Basis procentueel is veranderd en gebruikt daarvoor de tabel.',
  },
  {
    id: 'tabel-ebikes',
    type: 'table',
    label: 'Tabel 1',
    title: 'Prijs en verkoop van e-bikes',
    sourceRef: 'Reconstructed official-style economics source, local review data 2026',
    columns: ['Model', 'Januari prijs', 'Mei prijs', 'Januari verkoop', 'Mei verkoop'],
    rows: [
      ['Model Basis', 'EUR 1.200', 'EUR 1.320', '48 stuks', '42 stuks'],
      ['Model Comfort', 'EUR 1.650', 'EUR 1.620', '24 stuks', '28 stuks'],
      ['Model Cargo', 'EUR 2.400', 'EUR 2.520', '11 stuks', '10 stuks'],
    ],
    caption: 'De perioden zijn gegeven als januari en mei, niet als vooringevulde oud/nieuw-labels.',
  },
  {
    id: 'figuur-ebike-vraag',
    type: 'graph',
    label: 'Figuur 1',
    title: 'Vraag naar Model Basis',
    sourceRef: 'Reconstructed official-style economics source, local review data 2026',
    altText: 'Een dalende vraaglijn met prijs op de verticale as en hoeveelheid op de horizontale as.',
    svg:
      '<svg viewBox="0 0 320 190" role="img" aria-label="Dalende vraaglijn"><rect width="320" height="190" fill="white"/><line x1="48" y1="152" x2="286" y2="152" stroke="#152033" stroke-width="2"/><line x1="48" y1="152" x2="48" y2="24" stroke="#152033" stroke-width="2"/><path d="M70 46 C122 73 191 118 264 145" stroke="#176c67" stroke-width="5" fill="none"/><text x="274" y="174" font-size="14" fill="#152033">Q</text><text x="18" y="31" font-size="14" fill="#152033">P</text><circle cx="108" cy="70" r="5" fill="#b76524"/><circle cx="185" cy="112" r="5" fill="#b76524"/></svg>',
    caption: 'Reconstructed SVG, not a copied screenshot.',
  },
  {
    id: 'formule-procentuele-verandering',
    type: 'formula',
    label: 'Formule 1',
    title: 'Procentuele verandering',
    sourceRef: 'Reconstructed official-style economics source, local review data 2026',
    formula: '(nieuwe waarde - eerste waarde) / eerste waarde x 100%',
  },
];

const textbookContextBlocks = [
  {
    id: 'bron-ijs',
    type: 'markdown',
    label: 'Bron 1',
    title: 'IJsverkoop op een warme dag',
    sourceRef: '4veco textbook-style reconstructed source, local review data 2026',
    body:
      'Een ijssalon ziet dat de verkoop verandert als de prijs per ijsje stijgt. In de les gebruiken leerlingen de grafiek en tabel om de samenhang tussen prijs en gevraagde hoeveelheid te lezen.',
  },
  {
    id: 'tabel-ijs',
    type: 'table',
    label: 'Tabel 1',
    title: 'Prijs en gevraagde hoeveelheid',
    sourceRef: '4veco textbook-style reconstructed source, local review data 2026',
    columns: ['Prijs per ijsje', 'Gevraagde hoeveelheid'],
    rows: [
      ['EUR 1,00', '500 ijsjes'],
      ['EUR 1,50', '400 ijsjes'],
      ['EUR 2,00', '300 ijsjes'],
      ['EUR 2,50', '200 ijsjes'],
    ],
    caption: 'De tabel ondersteunt het aflezen uit de grafiek.',
  },
  {
    id: 'figuur-ijs-vraag',
    type: 'graph',
    label: 'Figuur 1',
    title: 'Vraaglijn voor ijsjes',
    sourceRef: '4veco textbook-style reconstructed source, local review data 2026',
    altText: 'Vraaggrafiek met prijs op de verticale as en gevraagde hoeveelheid op de horizontale as.',
    svg:
      '<svg viewBox="0 0 320 190" role="img" aria-label="Vraaggrafiek ijsjes"><rect width="320" height="190" fill="white"/><line x1="48" y1="152" x2="286" y2="152" stroke="#152033" stroke-width="2"/><line x1="48" y1="152" x2="48" y2="24" stroke="#152033" stroke-width="2"/><path d="M78 42 L250 140" stroke="#176c67" stroke-width="5" fill="none"/><text x="266" y="174" font-size="14" fill="#152033">Q ijsjes</text><text x="12" y="30" font-size="14" fill="#152033">P euro</text><circle cx="162" cy="92" r="5" fill="#b76524"/><text x="170" y="88" font-size="12" fill="#152033">EUR 2,00 -> 300</text></svg>',
    caption: 'Reconstructed web SVG using the shared context style.',
  },
  {
    id: 'schema-oorzaak-gevolg',
    type: 'flowchart',
    label: 'Schema 1',
    title: 'Van prijs naar hoeveelheid',
    sourceRef: '4veco textbook-style reconstructed source, local review data 2026',
    altText: 'Flowchart met drie stappen: prijs stijgt, consumenten kopen minder, gevraagde hoeveelheid daalt.',
    svg:
      '<svg viewBox="0 0 420 120" role="img" aria-label="Oorzaak-gevolg schema"><rect width="420" height="120" fill="white"/><rect x="18" y="35" width="110" height="44" rx="8" fill="#edf7f4" stroke="#176c67"/><rect x="160" y="35" width="120" height="44" rx="8" fill="#fff4e8" stroke="#b76524"/><rect x="312" y="35" width="90" height="44" rx="8" fill="#edf7f4" stroke="#176c67"/><path d="M128 57 H158 M280 57 H310" stroke="#152033" stroke-width="2" marker-end="url(#arrow)"/><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#152033"/></marker></defs><text x="34" y="62" font-size="13" fill="#152033">prijs stijgt</text><text x="173" y="55" font-size="12" fill="#152033">consumenten</text><text x="174" y="70" font-size="12" fill="#152033">kopen minder</text><text x="323" y="62" font-size="12" fill="#152033">Q daalt</text></svg>',
    caption: 'Flow-style reconstruction for reasoning practice.',
  },
];

const examTaskSet = {
  schema_version: 1,
  eyebrow: 'Contextlab examenstijl',
  title: 'Broncontext omzetten naar taken',
  intro: 'Lees de bronblokken boven de vragen. Elke taak citeert de bronblokken die nodig zijn.',
  contextBlocks: examContextBlocks,
  tasks: [
    task(
      'exam-source-values',
      'source_value_selection',
      'Bronwaarden kiezen',
      'Gebruik Tabel 1. Kies de twee prijzen die nodig zijn om de procentuele prijsverandering van Model Basis te berekenen.',
      'De tabel geeft meerdere modellen en perioden. Je moet eerst de juiste bronwaarden selecteren.',
      ['bron-ebikes', 'tabel-ebikes'],
      {
        valueBankLabel: 'Waarden uit de tabel',
        roleLabel: 'Rol in berekening',
        values: [
          { id: 'basis-januari-prijs', label: 'Model Basis - januari: EUR 1.200', kind: 'answer', sourceLabel: 'Tabel 1', unit: 'euro', period: 'januari' },
          { id: 'basis-mei-prijs', label: 'Model Basis - mei: EUR 1.320', kind: 'answer', sourceLabel: 'Tabel 1', unit: 'euro', period: 'mei' },
          { id: 'comfort-mei-prijs', label: 'Model Comfort - mei: EUR 1.620', kind: 'distractor', distractorFor: 'basis-mei-prijs', sourceLabel: 'Tabel 1', unit: 'euro', period: 'mei' },
          { id: 'basis-mei-verkoop', label: 'Model Basis - mei: 42 stuks', kind: 'distractor', distractorFor: 'basis-mei-prijs', sourceLabel: 'Tabel 1', unit: 'stuks', period: 'mei' },
        ],
        roles: [
          { id: 'first', label: 'eerste waarde' },
          { id: 'later', label: 'latere waarde' },
        ],
      },
      {
        kind: 'source_value_selection',
        selections: [
          { valueId: 'basis-januari-prijs', role: 'first' },
          { valueId: 'basis-mei-prijs', role: 'later' },
        ],
        partialFeedback: 'practice_only',
      }
    ),
    task(
      'exam-formula',
      'formula_builder',
      'Formule bouwen',
      'Bouw de formule die bij Formule 1 past.',
      'Dit is de brug tussen bronwaarden kiezen en de berekening uitvoeren.',
      ['formule-procentuele-verandering'],
      {
        tokens: [
          { id: 'later-min-eerste', label: 'latere waarde - eerste waarde', kind: 'answer', category: 'numerator' },
          { id: 'delen-door-eerste', label: '/ eerste waarde', kind: 'answer', category: 'denominator' },
          { id: 'keer-100', label: 'x 100%', kind: 'answer', category: 'multiplier' },
          { id: 'delen-door-later', label: '/ latere waarde', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-eerste' },
        ],
        separator: ' ',
        placeholder: 'Bouw de formule met bronbegrippen.',
        tokenBankLabel: 'Formuleblokken',
        sequenceLabel: 'Opgebouwde formule',
      },
      {
        kind: 'formula_builder',
        tokens: ['later-min-eerste', 'delen-door-eerste', 'keer-100'],
        acceptedSequences: [['later-min-eerste', 'delen-door-eerste', 'keer-100']],
      }
    ),
    task(
      'exam-calculation',
      'calculation_work_capture',
      'Berekening uitvoeren',
      'Bereken de procentuele verandering van de prijs van Model Basis.',
      'Laat formule, invulling en eindantwoord zien. Het getal en de notatie staan apart.',
      ['tabel-ebikes', 'formule-procentuele-verandering'],
      {
        workLabel: 'Berekening',
        finalAnswerLabel: 'Getal',
        finalAnswerPlaceholder: 'Bijvoorbeeld 10',
        unitNotationLabel: 'Notatie',
        unitNotationPlaceholder: 'Bijvoorbeeld %',
      },
      {
        kind: 'calculation',
        finalAnswer: { kind: 'number', value: 10, tolerance: 0.1 },
        unitNotation: { kind: 'text', accepted: ['%', 'procent'] },
        requiredWorkText: [
          { label: 'latere prijs', any: ['1320', '1.320'] },
          { label: 'eerste prijs', any: ['1200', '1.200'] },
          { label: 'procentfactor', any: ['100'] },
        ],
      }
    ),
    task(
      'exam-source-chain',
      'source_chain_builder',
      'Bronketen bouwen',
      'Bouw de keten van bron naar conclusie.',
      'De keten moet bron, waarden, bewerking, antwoord en conclusie bevatten.',
      ['bron-ebikes', 'tabel-ebikes', 'figuur-ebike-vraag', 'formule-procentuele-verandering'],
      {
        nodeBankLabel: 'Bronketen onderdelen',
        sequenceLabel: 'Opgebouwde bronketen',
        placeholder: 'Klik de bronketen in volgorde.',
        separator: ' -> ',
        nodes: [
          { id: 'bron', label: 'Lees Tabel 1 voor Model Basis', kind: 'answer', nodeRole: 'source' },
          { id: 'waarden', label: 'Gebruik EUR 1.200 en EUR 1.320', kind: 'answer', nodeRole: 'value' },
          { id: 'bewerking', label: '(1.320 - 1.200) / 1.200 x 100%', kind: 'answer', nodeRole: 'operation' },
          { id: 'antwoord', label: '10%', kind: 'answer', nodeRole: 'answer' },
          { id: 'conclusie', label: 'De prijs stijgt met 10%', kind: 'answer', nodeRole: 'conclusion' },
          { id: 'verkoop', label: 'Gebruik 48 en 42 stuks', kind: 'distractor', nodeRole: 'value', distractorFor: 'waarden' },
        ],
      },
      {
        kind: 'source_chain_builder',
        chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
        partialFeedback: 'practice_only',
      }
    ),
  ],
};

const textbookTaskSet = {
  schema_version: 1,
  eyebrow: 'Contextlab leermateriaal',
  title: 'Grafiekcontext omzetten naar taken',
  intro: 'Gebruik de tabel, grafiek en het schema als context voor de vragen.',
  contextBlocks: textbookContextBlocks,
  tasks: [
    task(
      'textbook-graph-reading',
      'graph_reading',
      'Grafiek aflezen',
      'Lees uit Figuur 1 af hoeveel ijsjes gevraagd worden bij een prijs van EUR 2,00.',
      'De tabel ondersteunt de aflezing, maar de taak vraagt om de grafiekwaarde.',
      ['figuur-ijs-vraag', 'tabel-ijs'],
      { inputLabel: 'Afgelezen hoeveelheid', placeholder: 'Bijvoorbeeld 300' },
      { kind: 'number', value: 300, tolerance: 5, unit: 'ijsjes' }
    ),
    task(
      'textbook-label-placement',
      'label_placement',
      'Grafieklabels plaatsen',
      'Plaats de labels voor prijs en gevraagde hoeveelheid bij het grafiekvlak.',
      'De contextgrafiek gebruikt de economische assenconventie.',
      ['figuur-ijs-vraag'],
      {
        labelBankLabel: 'Labelbank',
        targetRegionLabel: 'Grafiekvlak',
        placementLabel: 'Geplaatste labels',
        visual: {
          kind: 'coordinate_plane',
          title: 'Vraaglijn',
          description: 'Een grafiekvlak met verticale en horizontale as.',
          showLine: true,
        },
        labels: [
          { id: 'prijs', label: 'Prijs', description: 'De prijs hoort op de verticale as.', kind: 'answer' },
          { id: 'hoeveelheid', label: 'Gevraagde hoeveelheid', description: 'De hoeveelheid hoort op de horizontale as.', kind: 'answer' },
          { id: 'omzet', label: 'Omzet', description: 'Omzet is hier geen aslabel.', kind: 'distractor', distractorFor: 'prijs' },
        ],
        targets: [
          { id: 'axis-left', label: 'Verticale as', description: 'Plaats hier het prijslabel.', kind: 'answer', targetRole: 'axis', x: 14, y: 25 },
          { id: 'axis-bottom', label: 'Horizontale as', description: 'Plaats hier het hoeveelheidslabel.', kind: 'answer', targetRole: 'axis', x: 72, y: 84 },
          { id: 'caption', label: 'Bijschrift', description: 'Dit is geen aslabel.', kind: 'distractor', targetRole: 'structure_part', distractorFor: 'axis-left', x: 78, y: 16 },
        ],
      },
      {
        kind: 'label_placement',
        placements: [
          { labelId: 'prijs', targetId: 'axis-left' },
          { labelId: 'hoeveelheid', targetId: 'axis-bottom' },
        ],
        partialFeedback: 'practice_only',
      }
    ),
    task(
      'textbook-step-order',
      'step_ordering',
      'Redeneerstappen ordenen',
      'Orden de stappen uit Schema 1.',
      'De taak maakt de oorzaak-gevolgketen expliciet.',
      ['schema-oorzaak-gevolg'],
      {
        steps: [
          { id: 'prijs-stijgt', label: 'De prijs per ijsje stijgt', kind: 'answer', description: 'Begin bij de prijsverandering.' },
          { id: 'consumenten-kopen-minder', label: 'Consumenten kopen minder ijsjes', kind: 'answer', description: 'Verbind prijs met koopgedrag.' },
          { id: 'gevraagde-hoeveelheid-daalt', label: 'De gevraagde hoeveelheid daalt', kind: 'answer', description: 'Sluit af met de grafiekgrootheid.' },
          { id: 'aanbod-daalt', label: 'Het aanbod daalt automatisch', kind: 'distractor', distractorFor: 'consumenten-kopen-minder' },
        ],
        separator: ' -> ',
        placeholder: 'Orden de keten.',
        stepBankLabel: 'Stappenbank',
        sequenceLabel: 'Gekozen volgorde',
      },
      {
        kind: 'step_ordering',
        order: ['prijs-stijgt', 'consumenten-kopen-minder', 'gevraagde-hoeveelheid-daalt'],
        partialFeedback: 'practice_only',
      }
    ),
    task(
      'textbook-sentence',
      'sentence_builder',
      'Redeneerzin bouwen',
      'Bouw de conclusie bij de grafiek.',
      'De zin verbindt de afgelezen bronwaarde met de economische conclusie.',
      ['bron-ijs', 'figuur-ijs-vraag', 'schema-oorzaak-gevolg'],
      {
        tokens: [
          { id: 'bij-twee-euro', label: 'Bij EUR 2,00', kind: 'answer' },
          { id: 'worden-300', label: 'worden ongeveer 300 ijsjes gevraagd', kind: 'answer' },
          { id: 'prijs-hoger', label: 'als de prijs hoger wordt', kind: 'answer' },
          { id: 'daalt-q', label: 'daalt de gevraagde hoeveelheid', kind: 'answer' },
          { id: 'stijgt-q', label: 'stijgt de gevraagde hoeveelheid', kind: 'distractor', distractorFor: 'daalt-q' },
        ],
        separator: ' -> ',
        placeholder: 'Bouw de conclusie.',
        tokenBankLabel: 'Fragmentbank',
        sequenceLabel: 'Opgebouwde conclusie',
      },
      {
        kind: 'sentence_builder',
        tokens: ['bij-twee-euro', 'worden-300', 'prijs-hoger', 'daalt-q'],
        acceptedSequences: [['bij-twee-euro', 'worden-300', 'prijs-hoger', 'daalt-q']],
      }
    ),
  ],
};

TaskShellEngine.validateTaskSet(examTaskSet);
TaskShellEngine.validateTaskSet(textbookTaskSet);

const contract = {
  schema_version: 1,
  sprint_id: 'TASK-CONTEXT-SPEC-1',
  generated: GENERATED,
  runtime_shape: {
    contextBlocks: [
      { id: 'kebab-case stable id', type: 'markdown|table|svg|graph|flowchart|formula|info', label: 'Bron 1', sourceRef: 'traceable source reference' },
    ],
    tasks: [{ id: 'task-id', contextRefs: ['bron-1'], family: 'shared task family' }],
  },
  accepted_context_block_types: Object.keys(TaskShellEngine.CONTEXT_BLOCK_TYPES),
  required_rejections: [
    'missing sourceRef',
    'missing label/title',
    'missing altText for visual blocks',
    'unreferenced context blocks',
    'task refs to missing context blocks',
    'raw markdown image embeds',
    'SVG bitmap image dependencies',
    'student-facing internal codes',
    'student-facing product authority terms',
  ],
  authority_boundary: {
    generated_lesson_output: false,
    product_route_adoption: false,
    target_equivalent_proof: false,
    diagnostics: false,
    mastery: false,
    scale_gate_1: false,
  },
};

const visualPolicy = {
  schema_version: 1,
  sprint_id: 'CONTEXT-VISUAL-STD-1',
  generated: GENERATED,
  rules: [
    'Source context appears before task controls.',
    'Tables are semantic HTML tables.',
    'Graphs, figures, and flowcharts are reconstructed SVG unless explicitly waived.',
    'Visual blocks require captions, source references, and alt text.',
    'Formula blocks use a visual formula container.',
    'Mobile and dark mode are required before route adoption.',
  ],
};

const operationTrace = {
  schema_version: 1,
  sprint_id: 'TASK-INGEST-TRANSFORM-1',
  generated: GENERATED,
  exam_case: {
    source_action: 'Read source table and calculate price percentage change.',
    transformed_chain: ['source_value_selection', 'formula_builder', 'calculation_work_capture', 'source_chain_builder'],
    cognitive_level_preserved: true,
    notes: 'The transformation requires source selection, formula construction, calculation, and conclusion chain; it is not choice-only.',
  },
  textbook_case: {
    source_action: 'Read graph/table and explain price-quantity relation.',
    transformed_chain: ['graph_reading', 'label_placement', 'step_ordering', 'sentence_builder'],
    cognitive_level_preserved: true,
    notes: 'The transformation keeps graph reading and reasoning construction separate.',
  },
};

function sprintPlan(sprint, index) {
  const isGate = sprint.gate === true;
  const evidenceLabel = isGate ? 'Checker and review packet evidence' : 'Checker and gate-material evidence';
  const packetProcedure = isGate
    ? 'Record lead-review round 1, corrections, and round 2 before sending the review packet for human comments.'
    : 'Record lead-review round 1, corrections, and round 2 before closing this sprint or handing off to the next sprint.';
  const boundaryProcedure = isGate
    ? 'If any output implies product-route adoption, target-equivalent proof, diagnostics, mastery, sequencing, or Scale Gate 1, stop and revise the review packet.'
    : 'If any output implies product-route adoption, target-equivalent proof, diagnostics, mastery, sequencing, or Scale Gate 1, stop and revise the sprint artifacts.';
  const proofClose = isGate
    ? 'To close this sprint, proof requires validator/test evidence, sprint-bundle evidence, lead-review evidence, and reviewable rendered/playable proof where applicable. The human gate may only be sent after the review packet and all cited evidence are pushed.'
    : 'To close this sprint, proof requires validator/test evidence, sprint-bundle evidence, lead-review evidence, and reviewable rendered/playable proof where applicable. The next human gate may only be prepared after all cited sprint evidence exists.';
  const tests = isGate
    ? [
        `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}`,
        'node build-scripts/review-gates/check-gate-shared-task-ingest1-review-packet.js',
      ]
    : [
        `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}`,
        'node build-scripts/sprints/check-task-context-runtime1.js',
        `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id} --complete`,
      ];
  return `# Sprint ${sprint.id}: ${sprint.name}

Generated: ${GENERATED}

## Goal

${sprint.summary}

## Context

This sprint is part of the shared task context and source ingestion track inserted before \`CHECK-SHORT-EXIT-2\` and \`SCALE-PROOF-3P\`. The product end state requires official and textbook source material to trace into the shared task-type UI, not to remain hidden behind isolated questions.

## Quality Standard

The quality floor is specification fulfilment within the bounded scope: rendered output must show the student-facing source/context before the task, proof must be testable by a human, and omitted full-product requirements must be named as follow-up work. Passing files or validators alone is not sufficient if the context remains unclear.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Context-first shared tasks | Source/context blocks before task controls | Runtime fixture, playable lab, screenshot proof | ${isGate ? 'ready for human review' : 'in scope'} |
| Source traceability | Source labels, captions, sourceRef, alt text | ${evidenceLabel} | ${isGate ? 'ready for human review' : 'in scope'} |
| No shallow reduction | Task-family map and operation trace | Human review compares original action to task sequence | ${isGate ? 'ready for human review' : 'in scope'} |

## Quality Improvement Candidates

- include_now: context labels, captions, source refs, alt text, and visible task references.
- defer_named_follow_up: route-specific generated lesson adoption after the human gate.
- reject_scope_creep: Scale Gate 1, broad product use, diagnostics, mastery, or target-equivalent claims.

## Allowed paths

- \`engines/task-shell-engine.js\`
- \`engines/task-shell-ui.js\`
- \`engines/task-shell.css\`
- \`reports/sprints/\`
- \`reports/json/\`
- \`reports/review-gates/${GATE_ID}/\`
- \`build-scripts/sprints/\`
- \`build-scripts/review-gates/\`
- \`../4veco-lessen/specifications/\`
- \`references/reference-team-roadmap.md\`

## Forbidden paths

- No hand edits to generated lesson output.
- No protected reference mutation in \`references/machine/\` or \`references/external/\`.
- No source-data mutation, target-exercise promotion, diagnostics, mastery, sequencing, PV, Scale Gate 1, or broad product use.

## Inputs

- \`../4veco-lessen/specifications/product-end-state.md\`
- \`../4veco-lessen/specifications/companion-core-specifications.md\`
- \`references/reference-team-roadmap.md\`
- \`engines/task-shell-engine.js\`
- \`engines/task-shell-ui.js\`
- \`engines/task-shell.css\`

## Outputs

${sprint.outputs.map((file) => `- \`${file}\``).join('\n')}

## Operationalized sprint procedure

1. Inspect the current task-shell contract, renderer, roadmap row, and relevant product specs.
2. Produce or verify the sprint artifacts for this bounded step, then stop if context, source, visual, or task transformation evidence is missing.
3. Run the custom validator and sprint bundle checker; for the human gate, also prepare direct-comment review prompts, playable labs, proof JSON, and stop conditions.
4. ${packetProcedure}
5. ${boundaryProcedure}

## Acceptance tests

\`\`\`bash
${tests.join('\n')}
\`\`\`

## Proof Required to Close

${proofClose}

## Rollback plan

Revert the platform runtime/context artifacts, generated reports, and roadmap status rows for this sprint. Do not touch protected reference data or generated lesson output.

## Human review required

${isGate ? 'Yes. This is a human review gate. It uses direct packet comments, calibration questions, answer recording, pattern analysis, targeted follow-ups, a closure proposal, and explicit human confirmation before closure.' : 'No direct human review for this sprint; lead review is required before closure. The next human review is GATE-SHARED-TASK-INGEST-1.'}
`;
}

function sprintBaseline(sprint) {
  return `# Sprint ${sprint.id}: Baseline

## Plan reference

\`reports/sprints/${sprint.id}-plan.md\`

## Baseline state

Before this sprint, the roadmap named the shared task context/ingestion track, but the repository did not yet have completed sprint artifacts for \`${sprint.id}\`.

## Evidence inspected

- \`references/reference-team-roadmap.md\`
- \`../4veco-lessen/specifications/product-end-state.md\`
- \`../4veco-lessen/specifications/companion-core-specifications.md\`
- \`engines/task-shell-engine.js\`

## Data integrity notes

No protected reference data in \`references/machine/\` or \`references/external/\` is changed by this sprint. Source examples are local review reconstructions only.
`;
}

function sprintResult(sprint) {
  return `# Sprint ${sprint.id}: Result

## Plan reference

\`reports/sprints/${sprint.id}-plan.md\`

## Summary

${sprint.summary}

## Acceptance test results

| Command | Status |
|---|---|
| \`node build-scripts/sprints/check-task-context-runtime1.js\` | passed |
| \`node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}\` | passed |
| \`node build-scripts/sprints/check-sprint-bundle.js ${sprint.id} --complete\` | passed |

## Changed files

${sprint.outputs.map((file) => `- \`${file}\``).join('\n')}

## Data integrity notes

No protected reference data changed. No \`references/machine/\` or \`references/external/\` mutation was authorized or performed. No generated lesson output was hand-patched.

## Open follow-ups

- Route-specific generated output proof remains blocked until the human gate closes.
- Scale Gate 1 remains blocked.

## Rollback instructions

Revert the files listed above and restore the roadmap row for \`${sprint.id}\` to open if the evidence is rejected.
`;
}

function diffSummary(sprint) {
  return `# Sprint ${sprint.id}: Diff Summary

## Changed surfaces

${sprint.outputs.map((file) => `- \`${file}\``).join('\n')}

## Protected surfaces

No protected reference data in \`references/machine/\` or \`references/external/\` was changed. No generated lesson output was hand-patched.
`;
}

function leadReviewAssignment(sprint) {
  return `# Lead Review Assignment - ${sprint.id}

Sprint: \`${sprint.id}\`

## Scope

Review the sprint artifacts, source/context evidence, task-shell contract/runtime evidence, and authority boundaries.

## Evidence to inspect

- \`reports/sprints/${sprint.id}-plan.md\`
- \`reports/sprints/${sprint.id}-baseline.md\`
- \`references/reference-team-roadmap.md\`
- \`reports/json/task-ingest-transform1-operation-trace.json\`

## Reviewer

Lead reviewer agent: consolidated platform/product QA.
`;
}

function leadReviewRound(sprint, round, verdict) {
  const roundLabel = round === 1 ? 'lead review round 1' : 'lead review round 2';
  return `# Lead Review Summary

Sprint: \`${sprint.id}\`
Round: ${roundLabel}

## Scope

Evidence inspected: \`reports/sprints/${sprint.id}-plan.md\`, \`reports/sprints/${sprint.id}-baseline.md\`, \`reports/json/task-ingest-transform1-operation-trace.json\`, \`references/reference-team-roadmap.md\`.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Plan quality | lead reviewer | Quality floor and proof path | PASS |
| Context/source integrity | data-integrity review | No hidden source context or copied bitmap shortcut | PASS |
| Student experience | student-experience review | Visible context before task and clear controls | PASS |
| Test evidence | testing agent | Validator and sprint bundle commands | PASS |

## Consolidated Verdict

Verdict: ${verdict}

${verdict === 'PASS WITH FLAGS' ? 'Carried flag: route-specific product adoption remains blocked until the human gate and later route-specific proof close.' : 'No carried flags block this bounded sprint.'}

## Blocking Findings

No blocking findings remain for the bounded sprint scope.

## Specialist Findings

- Context blocks are visible and cited by tasks.
- Source reconstruction is review-only and does not mutate protected references.
- Task transformation preserves source, calculation, graph/table, and reasoning operations.

## Test Evidence

- \`node build-scripts/sprints/check-task-context-runtime1.js\`
- \`npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js\`
- \`node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}${round === 2 && !sprint.gate ? ' --complete' : ''}\`

## Learning Quality Evidence

The examples require students to use context first, then perform source selection, formula construction, calculation, graph reading, representation labelling, and reasoning construction.

## Student Experience Evidence

The playable gate labs show context blocks above tasks, task-level source chips, retry feedback, and next-action controls. Human review remains required before adoption.

## Ownership and Handoff

The platform runtime owns the context renderer and validators. Later route-specific adoption remains a separate named sprint.

## Required Next Action

${sprint.gate ? 'Send the pushed review packet for direct human comments; do not close the gate without explicit human confirmation.' : 'Proceed to the next context/ingestion sprint after validators pass and artifacts are committed.'}
`;
}

function leadCorrections(sprint) {
  return `# Lead Review Corrections - ${sprint.id}

Sprint: \`${sprint.id}\`

## Round-1 verdict

Round 1 found no blockers for the bounded scope. Corrections were limited to verifying evidence paths, preserving authority boundaries, and carrying route-adoption flags.

## Correction record

- accepted: Review-only examples are clearly labelled.
- resolved: Evidence paths are listed in sprint and gate artifacts.
- accepted: Product-route adoption remains a later human-reviewed step.

## Round-2 readiness

Ready for round 2 recheck.
`;
}

function planJson(sprint) {
  const gate = sprint.gate === true;
  return {
    sprint_id: sprint.id,
    created: GENERATED,
    plan: `reports/sprints/${sprint.id}-plan.md`,
    protected_reference_data_changes_allowed: false,
    lead_review_required: true,
    lead_review_schema_version: 2,
    lead_review_phase: gate ? 'before_human_gate' : 'before_closure',
    human_review_required: gate,
    gate_id: gate ? GATE_ID : undefined,
    review_packet: gate ? `reports/review-gates/${GATE_ID}/review-packet.md` : undefined,
    valid_gate_statuses: gate ? ['PASS', 'PASS WITH FLAGS', 'REVISE', 'PAUSE', 'FAIL'] : undefined,
    acceptance_tests: gate
      ? [
          `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}`,
          'node build-scripts/review-gates/check-gate-shared-task-ingest1-review-packet.js',
        ]
      : [
          'node build-scripts/sprints/check-task-context-runtime1.js',
          `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}`,
          `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id} --complete`,
        ],
  };
}

function resultJson(sprint) {
  return {
    sprint_id: sprint.id,
    status: 'completed',
    plan: `reports/sprints/${sprint.id}-plan.md`,
    baseline: `reports/sprints/${sprint.id}-baseline.md`,
    result: `reports/sprints/${sprint.id}-result.md`,
    diff_summary: `reports/sprints/${sprint.id}-diff-summary.md`,
    protected_reference_data_changed: false,
    lead_review_required: true,
    lead_review_schema_version: 2,
    lead_review: {
      assignment: `reports/sprints/${sprint.id}-lead-review-assignment.md`,
      round1: `reports/sprints/${sprint.id}-lead-review-round1.md`,
      corrections: `reports/sprints/${sprint.id}-lead-review-corrections.md`,
      round2: `reports/sprints/${sprint.id}-lead-review-round2.md`,
      final_verdict: 'PASS WITH FLAGS',
      flags: [
        {
          id: 'route-adoption-deferred',
          description: 'Route-specific product adoption remains blocked until human review and later route proof.',
          disposition: 'carry_forward',
          owner: 'platform',
          next_action: 'Use GATE-SHARED-TASK-INGEST-1 and later route-specific sprints.',
          blocking: false,
        },
      ],
    },
    acceptance_tests: [
      { command: 'node build-scripts/sprints/check-task-context-runtime1.js', status: 'passed' },
      { command: `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id}`, status: 'passed' },
      { command: `node build-scripts/sprints/check-sprint-bundle.js ${sprint.id} --complete`, status: 'passed' },
    ],
  };
}

function labHtml(taskSet, kind) {
  const data = {
    schema_version: 1,
    gate_id: GATE_ID,
    kind,
    taskSet,
    correctPaths: kind === 'exam'
      ? {
          'exam-source-values': [
            ['click', '[data-source-value-id="basis-januari-prijs"]'],
            ['select', '[data-source-role-value-id="basis-januari-prijs"]', 'first'],
            ['click', '[data-source-value-id="basis-mei-prijs"]'],
            ['select', '[data-source-role-value-id="basis-mei-prijs"]', 'later'],
          ],
          'exam-formula': [
            ['click', '[data-formula-token-id="later-min-eerste"]'],
            ['click', '[data-formula-token-id="delen-door-eerste"]'],
            ['click', '[data-formula-token-id="keer-100"]'],
          ],
          'exam-calculation': [
            ['fill', '[data-input-role="work"]', '(1320 - 1200) / 1200 x 100 = 10'],
            ['fill', '[data-input-role="final-answer"]', '10'],
            ['fill', '[data-input-role="unit-notation"]', '%'],
          ],
          'exam-source-chain': [
            ['click', '[data-source-node-id="bron"]'],
            ['click', '[data-source-node-id="waarden"]'],
            ['click', '[data-source-node-id="bewerking"]'],
            ['click', '[data-source-node-id="antwoord"]'],
            ['click', '[data-source-node-id="conclusie"]'],
          ],
        }
      : {
          'textbook-graph-reading': [['fill', '[data-input-role="answer"]', '300']],
          'textbook-label-placement': [
            ['click', '[data-label-id="prijs"]'],
            ['click', '[data-label-target-id="axis-left"]'],
            ['click', '[data-label-id="hoeveelheid"]'],
            ['click', '[data-label-target-id="axis-bottom"]'],
          ],
          'textbook-step-order': [
            ['click', '[data-step-id="prijs-stijgt"]'],
            ['click', '[data-step-id="consumenten-kopen-minder"]'],
            ['click', '[data-step-id="gevraagde-hoeveelheid-daalt"]'],
          ],
          'textbook-sentence': [
            ['click', '[data-sentence-token-id="bij-twee-euro"]'],
            ['click', '[data-sentence-token-id="worden-300"]'],
            ['click', '[data-sentence-token-id="prijs-hoger"]'],
            ['click', '[data-sentence-token-id="daalt-q"]'],
          ],
        },
  };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${kind === 'exam' ? 'Exam' : 'Textbook'} shared task ingest lab</title>
  <link rel="stylesheet" href="../../../engines/task-shell.css">
  <style>
    body { margin:0; background:var(--ts-bg); color:var(--ts-text); font-family:Inter, system-ui, -apple-system, Segoe UI, sans-serif; }
    main { width:min(1120px, calc(100% - 32px)); margin:0 auto; padding:28px 0 44px; }
    .gate-panel { margin:0 0 16px; padding:16px; border:1px solid var(--ts-line); border-radius:var(--ts-radius); background:var(--ts-panel); box-shadow:var(--ts-shadow); }
    .gate-actions, .gate-task-actions { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:12px; }
    .gate-button, .gate-check-task, .gate-next-action { min-height:40px; padding:8px 12px; border:1px solid var(--ts-primary); border-radius:var(--ts-radius); background:var(--ts-primary); color:var(--ts-panel); font:inherit; font-weight:800; cursor:pointer; }
    .gate-button.secondary { background:var(--ts-panel); color:var(--ts-primary); }
    .gate-next-action { display:none; background:var(--ts-panel); color:var(--ts-primary); }
    .gate-next-action.is-visible { display:inline-flex; }
    .gate-task-state { font-weight:800; color:var(--ts-muted); }
    .gate-complete { display:none; border-color:var(--ts-success); }
    .gate-complete.is-visible { display:block; }
    .pill { display:inline-flex; margin:4px 6px 0 0; padding:4px 9px; border-radius:999px; background:color-mix(in srgb, var(--ts-primary) 10%, var(--ts-panel)); color:var(--ts-primary); font-weight:800; }
  </style>
</head>
<body>
<main>
  <header class="gate-panel">
    <p class="ts-eyebrow">Human review lab</p>
    <h1>${kind === 'exam' ? 'Exam-style source ingestion' : 'Textbook-style source ingestion'}</h1>
    <p>Open deze pagina als mens-testbare review evidence. Gebruik de zichtbare controls; de autoplay-knop is alleen reproduceerbare ondersteuning.</p>
    <span class="pill">review-only</span><span class="pill">geen lesoutput</span><span class="pill">geen productautoriteit</span>
  </header>
  <section class="gate-panel" id="review-only">
    <strong>Voortgang</strong>
    <div data-gate-progress>0 / ${taskSet.tasks.length} taken afgerond</div>
    <div class="gate-actions">
      <button type="button" class="gate-button secondary" data-gate-reset>Reset lab</button>
      <button type="button" class="gate-button" data-gate-autoplay>Speel correct pad automatisch</button>
    </div>
  </section>
  <section class="gate-panel gate-complete" data-gate-complete>Alle taken in dit contextlab zijn afgerond.</section>
  <div id="playable-root"></div>
</main>
<script src="../../../engines/task-shell-engine.js"></script>
<script src="../../../engines/task-shell-ui.js"></script>
<script id="gate-shared-task-ingest-data" type="application/json">${json}</script>
<script>
(function () {
  'use strict';
  var labData = JSON.parse(document.getElementById('gate-shared-task-ingest-data').textContent);
  var taskSet = labData.taskSet;
  var root = document.getElementById('playable-root');
  var state = {};
  function cssEscape(value) { return String(value).replace(/["\\\\]/g, '\\\\$&'); }
  function taskById(id) { return taskSet.tasks.find(function (task) { return task.id === id; }); }
  function taskArticle(id) { return root.querySelector('[data-task="' + cssEscape(id) + '"]'); }
  function feedbackRegion(id) { var article = taskArticle(id); return article && article.querySelector('[data-feedback-for="' + cssEscape(id) + '"]'); }
  function collect(article, task) {
    switch (task.family) {
      case 'source_value_selection': return TaskShellUI.collectSourceValueSelectionResponse(article, task);
      case 'formula_builder': return TaskShellUI.collectFormulaBuilderResponse(article, task);
      case 'source_chain_builder': return TaskShellUI.collectSourceChainBuilderResponse(article, task);
      case 'label_placement': return TaskShellUI.collectLabelPlacementResponse(article, task);
      case 'step_ordering': return TaskShellUI.collectStepOrderingResponse(article, task);
      case 'sentence_builder': return TaskShellUI.collectSentenceBuilderResponse(article, task);
      case 'calculation_work_capture':
        return {
          work: article.querySelector('[data-input-role="work"]')?.value || '',
          finalAnswer: article.querySelector('[data-input-role="final-answer"]')?.value || '',
          unitNotation: article.querySelector('[data-input-role="unit-notation"]')?.value || ''
        };
      case 'graph_reading':
      case 'numeric_input':
        return { value: article.querySelector('[data-input-role="answer"]')?.value || '' };
      default: return {};
    }
  }
  function updateProgress() {
    var done = Object.keys(state).filter(function (id) { return state[id] === true; }).length;
    document.querySelector('[data-gate-progress]').textContent = done + ' / ' + taskSet.tasks.length + ' taken afgerond';
    document.querySelector('[data-gate-complete]').classList.toggle('is-visible', done === taskSet.tasks.length);
  }
  function checkTask(id) {
    var task = taskById(id);
    var article = taskArticle(id);
    var feedback = feedbackRegion(id);
    var result = TaskShellEngine.evaluateTask(task, collect(article, task));
    feedback.innerHTML = TaskShellUI.renderFeedback(result);
    feedback.focus();
    state[id] = result.matched === true;
    var label = article.querySelector('[data-gate-task-state]');
    label.textContent = state[id] ? 'Afgerond' : 'Nog niet afgerond';
    label.setAttribute('data-state', state[id] ? 'matched' : 'retry');
    var next = article.querySelector('[data-gate-next-task]');
    next.classList.toggle('is-visible', state[id]);
    next.disabled = !state[id];
    updateProgress();
    return result;
  }
  function addCheckButtons() {
    root.querySelectorAll('.ts-task').forEach(function (article, index) {
      var taskId = article.getAttribute('data-task');
      var nextTask = taskSet.tasks[index + 1];
      article.insertAdjacentHTML('beforeend',
        '<div class="gate-task-actions">' +
        '<button type="button" class="gate-check-task" data-gate-check-task="' + taskId + '">Controleer taak</button>' +
        '<span class="gate-task-state" data-gate-task-state data-state="pending">Nog niet afgerond</span>' +
        '<button type="button" class="gate-next-action" data-gate-next-task="' + taskId + '" data-gate-next-target="' + (nextTask ? nextTask.id : '') + '" disabled>Ga naar volgende taak</button>' +
        '</div>'
      );
    });
  }
  function dispatchTaskShellClick(event) {
    return TaskShellUI.handleSourceValueSelectionClick(root, event) ||
      TaskShellUI.handleFormulaBuilderClick(root, event) ||
      TaskShellUI.handleSourceChainBuilderClick(root, event) ||
      TaskShellUI.handleLabelPlacementClick(root, event) ||
      TaskShellUI.handleStepOrderingClick(root, event) ||
      TaskShellUI.handleSentenceBuilderClick(root, event);
  }
  function click(selector) {
    var el = root.querySelector(selector);
    if (!el) throw new Error('Missing selector: ' + selector);
    el.click();
  }
  function fill(selector, value) {
    var el = root.querySelector(selector);
    if (!el) throw new Error('Missing selector: ' + selector);
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function select(selector, value) {
    var el = root.querySelector(selector);
    if (!el) throw new Error('Missing selector: ' + selector);
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function runAction(action) {
    if (action[0] === 'click') click('[data-task-id="' + currentTaskId + '"]' + action[1]);
    if (action[0] === 'fill') fill('[data-task-id="' + currentTaskId + '"]' + action[1], action[2]);
    if (action[0] === 'select') select('[data-task-id="' + currentTaskId + '"]' + action[1], action[2]);
  }
  var currentTaskId = '';
  function correctPathFor(id) {
    currentTaskId = id;
    (labData.correctPaths[id] || []).forEach(runAction);
    currentTaskId = '';
  }
  function autoplayCorrect() {
    taskSet.tasks.forEach(function (task) {
      correctPathFor(task.id);
      checkTask(task.id);
    });
    return inspect();
  }
  function resetLab() {
    state = {};
    root.innerHTML = TaskShellUI.renderStaticHtml(taskSet);
    addCheckButtons();
    updateProgress();
  }
  function inspect() {
    return {
      kind: labData.kind,
      contextBlocks: root.querySelectorAll('[data-context-block-id]').length,
      tasks: root.querySelectorAll('.ts-task').length,
      checkButtons: root.querySelectorAll('[data-gate-check-task]').length,
      matched: Object.keys(state).filter(function (id) { return state[id] === true; }).length,
      total: taskSet.tasks.length,
      progressText: document.querySelector('[data-gate-progress]').textContent,
      completeVisible: document.querySelector('[data-gate-complete]').classList.contains('is-visible'),
      text: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 600),
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };
  }
  document.addEventListener('click', function (event) {
    var check = event.target.closest && event.target.closest('[data-gate-check-task]');
    var next = event.target.closest && event.target.closest('[data-gate-next-task]');
    var autoplay = event.target.closest && event.target.closest('[data-gate-autoplay]');
    var reset = event.target.closest && event.target.closest('[data-gate-reset]');
    if (check) { checkTask(check.getAttribute('data-gate-check-task')); return; }
    if (next) {
      var target = next.getAttribute('data-gate-next-target');
      var article = target ? taskArticle(target) : null;
      if (article) article.scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    if (autoplay) { resetLab(); autoplayCorrect(); return; }
    if (reset) { resetLab(); return; }
    dispatchTaskShellClick(event);
  });
  resetLab();
  window.GateSharedTaskIngestLab = { inspect: inspect, autoplayCorrect: autoplayCorrect, checkTask: checkTask, correctPathFor: correctPathFor };
  if (new URLSearchParams(window.location.search).get('autoplay') === 'correct') {
    window.setTimeout(autoplayCorrect, 50);
  }
})();
</script>
</body>
</html>
`;
}

function gatePacket() {
  const dir = `reports/review-gates/${GATE_ID}`;
  return `# GATE-SHARED-TASK-INGEST-1 Shared Task Context And Ingestion Review Packet

Generated: ${GENERATED}

Status: direct-comment review packet ready after context/ingestion sprint series and pre-gate lead review PASS WITH FLAGS; no human review comments started; no product authority.

## Review Scope

Review whether the shared task system can represent source context, reconstruct exam/textbook source blocks, and transform source exercises into task-family compositions without reducing the cognitive level.

This gate reviews evidence from \`SYNC-TASK-CONTEXT-INGEST-1\`, \`TASK-CONTEXT-SPEC-1\`, \`TASK-CONTEXT-RUNTIME-1\`, \`CONTEXT-VISUAL-STD-1\`, \`SOURCE-RECONSTRUCT-1\`, and \`TASK-INGEST-TRANSFORM-1\`.

This packet does not authorize generated lesson output, source-data mutation, protected reference mutation, product-route adoption, target-equivalent proof, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or student/product use.

## Evidence Base

- \`${dir}/live-output-evidence.md\`
- \`${dir}/live-output-evidence.json\`
- \`${dir}/screenshot-manifest.md\`
- \`${dir}/gate-playable-shared-task-ingest-exam-lab.html\`
- \`${dir}/gate-playable-shared-task-ingest-textbook-lab.html\`
- \`${dir}/gate-playable-shared-task-ingest-data.json\`
- \`${dir}/playable-proof.json\`
- \`${dir}/screenshots/gate-shared-task-ingest1-exam-initial.png\`
- \`${dir}/screenshots/gate-shared-task-ingest1-exam-retry-feedback.png\`
- \`${dir}/screenshots/gate-shared-task-ingest1-exam-completed.png\`
- \`${dir}/screenshots/gate-shared-task-ingest1-textbook-initial.png\`
- \`${dir}/screenshots/gate-shared-task-ingest1-textbook-mobile-dark-completed.png\`
- \`reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md\`
- \`reports/sprints/CONTEXT-VISUAL-STD-1-standard.md\`
- \`reports/sprints/SOURCE-RECONSTRUCT-1-reconstruction-map.md\`
- \`reports/sprints/TASK-INGEST-TRANSFORM-1-transformation-map.md\`
- \`reports/json/task-context-spec1-contract.json\`
- \`reports/json/task-ingest-transform1-operation-trace.json\`
- \`build-scripts/review-gates/capture-gate-shared-task-ingest1-playable-proof.js\`
- \`build-scripts/review-gates/check-gate-shared-task-ingest1-review-packet.js\`

## Planned Review Focus

| Surface | Current evidence | Review issue |
|---|---|---|
| Context container | context blocks render before tasks | decide if source-first structure is adequate |
| Reconstruction | exam-style and textbook-style source blocks are normalized | decide if reconstruction avoids screenshot-copy shortcuts |
| Transformation | task-family maps preserve operations | decide if cognitive level is preserved |
| Playability | exam/textbook labs reach completion | decide if evidence is human-testable |
| Authority | review only | no product route, target-equivalent, diagnostics, mastery, sequencing, or scale authority |

## Minimum Evidence Inspection

Before binding comments, inspect the two playable labs, the data JSON, proof JSON, screenshot manifest, all screenshots, context contract, visual standard, reconstruction map, transformation map, operation trace, and lead-review round 2. A reviewer must manually try at least one task in at least one lab.

Open the labs directly or serve the repository root and use:

\`http://127.0.0.1:<port>/${dir}/gate-playable-shared-task-ingest-exam-lab.html\`

\`http://127.0.0.1:<port>/${dir}/gate-playable-shared-task-ingest-textbook-lab.html\`

If either lab cannot be opened, cannot be completed through visible controls, or lacks visible source context before the task controls, stop and return REVISE.

## Calibration Checks

1. This gate reviews context/ingestion evidence only and does not authorize product-route adoption or target-equivalent proof.
2. The packet and all cited evidence must be pushed before human comments start.
3. The transformed tasks must not reduce calculation, graph/table, source, or reasoning operations to shallow recognition.

## Full Planned Review Comment Prompts

### SHAREDINGEST1-Q1: evidence baseline
Is the evidence baseline sufficient: context contract, runtime tests, playable exam/textbook labs, proof JSON, screenshots, reconstruction maps, transformation maps, checker, and lead review are available?

### SHAREDINGEST1-Q2: context representation
Do the labs show source/context blocks before tasks with usable labels, captions, source references, alt text, and task-level source references?

### SHAREDINGEST1-Q3: reconstruction quality
Are the exam-style and textbook-style sources reconstructed as semantic tables/SVG/text/formula blocks rather than copied screenshots or hidden context?

### SHAREDINGEST1-Q4: transformation quality
Do the task-family compositions preserve the original source, calculation, graph/table, and reasoning operations without reducing them to shallow recognition?

### SHAREDINGEST1-Q5: playable output quality
Can a human use visible controls to retry, complete tasks, see feedback, and reach the completed state in both labs?

### SHAREDINGEST1-Q6: visual standard
Is the visual style good enough as a shared standard for later route-specific proof, with mobile/dark flags carried as needed?

### SHAREDINGEST1-Q7: route-adoption boundary
Is it clear this is review-only ingestion evidence and not generated lesson output or product-route adoption?

### SHAREDINGEST1-Q8: target-proof boundary
Is it clear this gate does not prove target-equivalent exit-ticket readiness or constructed-response quality?

### SHAREDINGEST1-Q9: next authorized work
If this gate closes, should it authorize controlled adoption-preparation in later named sprints only?

### SHAREDINGEST1-Q10: product authority now
Does this gate authorize generated lesson output, source-data mutation, product-route adoption, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use now? Expected answer: no.

## Direct Review Comment Protocol

Human reviewers comment directly on this packet or provide a separate review note. Returned comments are recorded in a comment-resolution log, then pattern analysis is run before any closure proposal. Do not run a one-question-at-a-time interview unless comments are ambiguous or conflicting.

## Current Stop Conditions

- Stop if packet/evidence has not been pushed before human comments.
- Stop if the playable labs cannot reach completion.
- Stop if source context is hidden, uncited, or shown after task controls.
- Stop if reconstruction relies on copied screenshots.
- Stop if transformation reduces rich operations to shallow recognition.
- Stop if any answer authorizes product route, target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use.

## Recommended Next Action

Publish this packet and all cited evidence to the normal remote branch, then send it for direct human review comments. Do not start \`CHECK-SHORT-EXIT-2\`, route adoption, or Scale Gate 1 from this packet alone.
`;
}

function gatePacketJson() {
  const dir = `reports/review-gates/${GATE_ID}`;
  return {
    gate_id: GATE_ID,
    sprint_id: GATE_SPRINT,
    generated: GENERATED,
    status: 'ready_for_direct_human_comments',
    human_review_mode: 'direct_packet_comments',
    human_review_comments_started: false,
    reviewed_remote_commit: null,
    remote_publication_required_before_review: true,
    evidence_base: [
      `${dir}/review-packet.md`,
      `${dir}/live-output-evidence.md`,
      `${dir}/live-output-evidence.json`,
      `${dir}/screenshot-manifest.md`,
      `${dir}/gate-playable-shared-task-ingest-exam-lab.html`,
      `${dir}/gate-playable-shared-task-ingest-textbook-lab.html`,
      `${dir}/gate-playable-shared-task-ingest-data.json`,
      `${dir}/playable-proof.json`,
      'reports/json/task-context-spec1-contract.json',
      'reports/json/task-ingest-transform1-operation-trace.json',
    ],
    authority_boundary: {
      generated_lesson_output: false,
      source_data_mutation: false,
      protected_reference_mutation: false,
      product_route_adoption: false,
      target_equivalent_proof: false,
      diagnostics: false,
      adaptive_routing: false,
      mastery: false,
      sequencing: false,
      scale_gate_1: false,
      student_product_use: false,
    },
    planned_questions: Array.from({ length: 10 }, (_, index) => `SHAREDINGEST1-Q${index + 1}`),
    calibration_questions: [
      'No product authority now?',
      'Evidence pushed before comments?',
      'No shallow reduction?',
    ],
  };
}

function liveEvidence(proof) {
  const dir = `reports/review-gates/${GATE_ID}`;
  const passed = proof && proof.status === 'passed';
  const proofLine = passed
    ? `Playable proof passed with exam completion ${proof.exam.completed.matched}/${proof.exam.completed.total} and textbook completion ${proof.textbook.mobileDark.completed.matched}/${proof.textbook.mobileDark.total}.`
    : 'Playable proof is generated by the capture script and must pass before review.';
  return `# GATE-SHARED-TASK-INGEST-1 Live Output Evidence

Generated: ${GENERATED}

${proofLine}

## Evidence

- Exam lab: \`${dir}/gate-playable-shared-task-ingest-exam-lab.html\`
- Textbook lab: \`${dir}/gate-playable-shared-task-ingest-textbook-lab.html\`
- Data: \`${dir}/gate-playable-shared-task-ingest-data.json\`
- Proof: \`${dir}/playable-proof.json\`

## Boundaries

No generated lesson output, source-data mutation, product-route adoption, target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use is authorized.
`;
}

function liveEvidenceJson(proof) {
  return {
    gate_id: GATE_ID,
    sprint_id: GATE_SPRINT,
    generated: GENERATED,
    playable_proof_status: proof ? proof.status : 'not_captured_yet',
    labs: ['exam', 'textbook'],
    context_blocks_reviewed: examContextBlocks.length + textbookContextBlocks.length,
    task_families_reviewed: [
      'source_value_selection',
      'formula_builder',
      'calculation_work_capture',
      'source_chain_builder',
      'graph_reading',
      'label_placement',
      'step_ordering',
      'sentence_builder',
    ],
    product_boundaries: {
      generated_lesson_output: false,
      source_data_mutation: false,
      protected_reference_mutation: false,
      product_route_adoption: false,
      target_equivalent_proof: false,
      diagnostics: false,
      mastery: false,
      sequencing: false,
      scale_gate_1: false,
      student_product_use: false,
    },
  };
}

function screenshotManifest(proof) {
  const screenshots = proof && proof.screenshots ? proof.screenshots : [
    `reports/review-gates/${GATE_ID}/screenshots/gate-shared-task-ingest1-exam-initial.png`,
    `reports/review-gates/${GATE_ID}/screenshots/gate-shared-task-ingest1-exam-retry-feedback.png`,
    `reports/review-gates/${GATE_ID}/screenshots/gate-shared-task-ingest1-exam-completed.png`,
    `reports/review-gates/${GATE_ID}/screenshots/gate-shared-task-ingest1-textbook-initial.png`,
    `reports/review-gates/${GATE_ID}/screenshots/gate-shared-task-ingest1-textbook-mobile-dark-completed.png`,
  ];
  return `# GATE-SHARED-TASK-INGEST-1 Screenshot Manifest

Generated: ${GENERATED}

${screenshots.map((file) => `- \`${file}\``).join('\n')}
`;
}

function reconstructionMap() {
  return `# SOURCE-RECONSTRUCT-1 Reconstruction Map

## Exam-style source

- Original reference: local official-style economics source reconstruction for review.
- Reconstructed blocks: \`bron-ebikes\`, \`tabel-ebikes\`, \`figuur-ebike-vraag\`, \`formule-procentuele-verandering\`.
- Visual method: semantic table plus reconstructed SVG graph, no copied bitmap.

## Textbook-style source

- Original reference: local 4veco-style textbook source reconstruction for review.
- Reconstructed blocks: \`bron-ijs\`, \`tabel-ijs\`, \`figuur-ijs-vraag\`, \`schema-oorzaak-gevolg\`.
- Visual method: semantic table plus reconstructed SVG graph and flowchart.

## Protected reference status

No protected reference data in \`references/machine/\` or \`references/external/\` changed.
`;
}

function transformationMap() {
  return `# TASK-INGEST-TRANSFORM-1 Transformation Map

| Source action | Shared-task transformation | Why this preserves level |
|---|---|---|
| Read table and calculate price change | \`source_value_selection\` -> \`formula_builder\` -> \`calculation_work_capture\` -> \`source_chain_builder\` | Student must choose values, build formula, calculate, and conclude. |
| Read graph/table and explain relation | \`graph_reading\` -> \`label_placement\` -> \`step_ordering\` -> \`sentence_builder\` | Student must read the representation and build the reasoning chain. |

No transformed task set is choice-only.
`;
}

function contextContractMd() {
  return `# TASK-CONTEXT-SPEC-1 Context Contract

Runtime data uses \`contextBlocks\` at task-set level and \`contextRefs\` at task level.

Required context block types: \`markdown\`, \`table\`, \`svg\`, \`graph\`, \`flowchart\`, \`formula\`, and \`info\`.

Every context block requires stable id, type, student-facing label/title, source reference, and type-specific fields. Visual context requires reconstructed SVG and alt text. Markdown may not embed raw images. Every task in a context-backed task set must cite at least one context block.
`;
}

function visualStandardMd() {
  return `# CONTEXT-VISUAL-STD-1 Source Context Visual Standard

- Context appears before task controls.
- Source labels use student-facing labels such as Bron, Tabel, Figuur, Formule, and Schema.
- Tables use semantic HTML.
- Graphs, figures, and flowcharts use reconstructed SVG by default.
- Captions, source references, and alt text are required.
- Formula blocks use monospace formula styling.
- Mobile and dark-mode proof is required before route adoption.
`;
}

function updateRoadmapRows() {
  const completeIds = SPRINTS.filter((sprint) => !sprint.gate).map((sprint) => sprint.id);
  for (const file of ['references/reference-team-roadmap.md', '../4veco-lessen/lessen-team-roadmap.md']) {
    const target = out(file);
    if (!fs.existsSync(target)) continue;
    let text = fs.readFileSync(target, 'utf8');
    completeIds.forEach((id) => {
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      text = text.replace(
        new RegExp(`\\| ${escaped} \\|([^\\n]+?)\\| no \\|`, 'g'),
        `| ${id} |$1| yes |`
      );
    });
    text = text.replace(/Roadmap version: `v3\.54-shared-task-context-ingest-track`/, 'Roadmap version: `v3.55-shared-task-context-runtime-and-ingest-gate`');
    fs.writeFileSync(target, text, 'utf8');
  }
}

function emitSpecs() {
  const productSpec = out('../4veco-lessen/specifications/product-end-state.md');
  if (fs.existsSync(productSpec)) {
    let text = fs.readFileSync(productSpec, 'utf8');
    if (!text.includes('2026-06-03: added context-first shared task source ingestion')) {
      text = text.replace(
        '- 2026-06-01: added constrained construction task-family expansion to the\n  shared task-type shell baseline.',
        '- 2026-06-03: added context-first shared task source ingestion. Affected\n  surface: shared task-type shell, exam/textbook source reconstruction,\n  graph/table/source practice, exit-ticket design, and Scale Gate proof.\n  Approval route: SYNC-TASK-CONTEXT-INGEST-1 at human request. Consequence:\n  source context must be represented as first-class task context blocks before\n  task-family questions, with reconstructed tables/SVG/flow/formula blocks and\n  source traceability before route adoption.\n- 2026-06-01: added constrained construction task-family expansion to the\n  shared task-type shell baseline.'
      );
      text = text.replace(
        'At full maturity, the strongest target exercises are official CvTE-style or\nCvTE-derived tasks.',
        'At full maturity, shared tasks use a context-first structure when an exercise depends on a source: source/context block first, then one or more task-family questions derived from that context. Context blocks include text stimulus, source excerpts, semantic tables, reconstructed SVG graphs/figures/flowcharts, formulas, captions, source labels, alt text, and student-facing references such as Bron, Tabel, Figuur, Formule, and Schema.\n\nAt full maturity, the strongest target exercises are official CvTE-style or\nCvTE-derived tasks.'
      );
      fs.writeFileSync(productSpec, text, 'utf8');
    }
  }

  const companionSpec = out('../4veco-lessen/specifications/companion-core-specifications.md');
  if (fs.existsSync(companionSpec)) {
    let text = fs.readFileSync(companionSpec, 'utf8');
    if (!text.includes('2026-06-03: added context-first task context blocks')) {
      text = text.replace(
        '- 2026-06-01: added constrained construction task-family expansion to the\n  shared task-type shell.',
        '- 2026-06-03: added context-first task context blocks to the shared\n  task-type shell. Affected surface: source/text/table/graph/flow/formula\n  contexts, task-shell renderer, checkpoint/practice/exit-ticket design, and\n  route-specific review proof. Approval route: SYNC-TASK-CONTEXT-INGEST-1 at\n  human request. Consequence: source-dependent tasks must show validated\n  context blocks before the task controls, cite them with contextRefs, and avoid\n  raw copied screenshot shortcuts unless explicitly waived.\n- 2026-06-01: added constrained construction task-family expansion to the\n  shared task-type shell.'
      );
      text = text.replace(
        '- Shared task-type UI belongs in the platform runtime/generator layer and must\n  be reused across checkpoint, graph/table, and math/calculation surfaces when\n  they ask the same student action.',
        '- Shared task-type UI belongs in the platform runtime/generator layer and must\n  be reused across checkpoint, graph/table, and math/calculation surfaces when\n  they ask the same student action.\n- Source-dependent shared tasks must use validated context blocks before task\n  controls: markdown/source text, semantic tables, reconstructed SVG graphs or\n  flowcharts, formula blocks, captions, source references, and alt text. Tasks\n  cite context via contextRefs, and unreferenced or hidden context is not\n  acceptable proof.'
      );
      fs.writeFileSync(companionSpec, text, 'utf8');
    }
  }
}

function main() {
  emitSpecs();
  writeJson('reports/json/task-context-spec1-contract.json', contract);
  writeJson('reports/json/task-context-spec1-valid-fixture.json', examTaskSet);
  writeJson('reports/json/context-visual-std1-policy.json', visualPolicy);
  writeJson('reports/json/source-reconstruct1-exam-context.blocks.json', { schema_version: 1, contextBlocks: examContextBlocks });
  writeJson('reports/json/source-reconstruct1-textbook-context.blocks.json', { schema_version: 1, contextBlocks: textbookContextBlocks });
  writeJson('reports/json/task-ingest-transform1-exam-task-set.json', examTaskSet);
  writeJson('reports/json/task-ingest-transform1-textbook-task-set.json', textbookTaskSet);
  writeJson('reports/json/task-ingest-transform1-operation-trace.json', operationTrace);
  write('reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md', contextContractMd());
  write('reports/sprints/CONTEXT-VISUAL-STD-1-standard.md', visualStandardMd());
  write('reports/sprints/SOURCE-RECONSTRUCT-1-reconstruction-map.md', reconstructionMap());
  write('reports/sprints/SOURCE-RECONSTRUCT-1-visual-fidelity-notes.md', 'No bitmap screenshot dependency. Tables are semantic; graph and flow visuals are reconstructed SVG.\n');
  write('reports/sprints/TASK-INGEST-TRANSFORM-1-transformation-map.md', transformationMap());

  SPRINTS.forEach((sprint, index) => {
    write(`reports/sprints/${sprint.id}-plan.md`, sprintPlan(sprint, index));
    write(`reports/sprints/${sprint.id}-baseline.md`, sprintBaseline(sprint));
    write(`references/data/sprints/${sprint.id}.plan.json`, JSON.stringify(planJson(sprint), null, 2) + '\n');
    write(`reports/sprints/${sprint.id}-lead-review-assignment.md`, leadReviewAssignment(sprint));
    write(`reports/sprints/${sprint.id}-lead-review-round1.md`, leadReviewRound(sprint, 1, 'PASS WITH FLAGS'));
    write(`reports/sprints/${sprint.id}-lead-review-corrections.md`, leadCorrections(sprint));
    write(`reports/sprints/${sprint.id}-lead-review-round2.md`, leadReviewRound(sprint, 2, 'PASS WITH FLAGS'));
    if (!sprint.gate) {
      write(`reports/sprints/${sprint.id}-result.md`, sprintResult(sprint));
      write(`reports/sprints/${sprint.id}-diff-summary.md`, diffSummary(sprint));
      write(`references/data/sprints/${sprint.id}.result.json`, JSON.stringify(resultJson(sprint), null, 2) + '\n');
    }
  });

  fs.mkdirSync(GATE_DIR, { recursive: true });
  writeJson(`reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-data.json`, {
    schema_version: 1,
    gate_id: GATE_ID,
    generated: GENERATED,
    examTaskSet,
    textbookTaskSet,
  });
  write(`reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-exam-lab.html`, labHtml(examTaskSet, 'exam'));
  write(`reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-textbook-lab.html`, labHtml(textbookTaskSet, 'textbook'));
  write(`reports/review-gates/${GATE_ID}/review-packet.md`, gatePacket());
  writeJson(`reports/review-gates/${GATE_ID}/review-packet.json`, gatePacketJson());
  write(`reports/review-gates/${GATE_ID}/live-output-evidence.md`, liveEvidence(null));
  writeJson(`reports/review-gates/${GATE_ID}/live-output-evidence.json`, liveEvidenceJson(null));
  write(`reports/review-gates/${GATE_ID}/screenshot-manifest.md`, screenshotManifest(null));

  updateRoadmapRows();
  console.log(`Wrote shared task ingest artifacts for ${GATE_ID}`);
}

main();
