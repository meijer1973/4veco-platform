#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const sprintId = 'TASK-INGEST-TRANSFORM-3-TEXTBOOK';
const platformRoot = path.resolve(__dirname, '..', '..');
const lessonRoot = path.resolve(platformRoot, '..', '4veco-lessen');
const TaskShellEngine = require(path.join(platformRoot, 'engines', 'task-shell-engine'));

const paths = {
  transform: path.join(platformRoot, 'reports/json/task-ingest-transform3-textbook.json'),
  proof: path.join(platformRoot, 'reports/json/task-ingest-transform3-textbook-proof.json'),
  sourceMap: path.join(platformRoot, `reports/sprints/${sprintId}-source-map.md`),
  visualMap: path.join(platformRoot, `reports/sprints/${sprintId}-visual-variant-map.md`),
  operationTrace: path.join(platformRoot, `reports/sprints/${sprintId}-operation-chain-trace.md`),
  answerTrace: path.join(platformRoot, `reports/sprints/${sprintId}-answer-form-trace.md`),
  familyMap: path.join(platformRoot, `reports/sprints/${sprintId}-task-family-map.md`),
  reviewerNotes: path.join(platformRoot, `reports/sprints/${sprintId}-reviewer-notes.md`),
  lab: path.join(platformRoot, `reports/sprints/${sprintId}-rendered-lab.html`),
  manifest: path.join(platformRoot, `reports/sprints/${sprintId}-screenshot-manifest.md`),
  roadmap: path.join(platformRoot, 'references/reference-team-roadmap.md'),
  lessonRoadmap: path.join(lessonRoot, 'lessen-team-roadmap.md'),
};

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function readJson(file) {
  assert(fs.existsSync(file), `missing ${rel(file)}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  assert(fs.existsSync(file), `missing ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${rel(file)} is not a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function gitStatus(args, cwd = platformRoot) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    fail(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function taskById(taskSet, id) {
  const task = taskSet.tasks.find((candidate) => candidate.id === id);
  assert(task, `missing task ${id}`);
  return task;
}

function expectMatch(task, response, label) {
  const result = TaskShellEngine.evaluateTask(task, response);
  assert(result.matched === true, `${label} should match`);
}

function expectReject(task, response, label) {
  const result = TaskShellEngine.evaluateTask(task, response);
  assert(result.matched !== true, `${label} should be rejected`);
}

function roadmapLine(markdown, sprint) {
  return markdown.split(/\r?\n/).find((line) => line.includes(`| ${sprint} |`));
}

function main() {
  const transform = readJson(paths.transform);
  const proof = readJson(paths.proof);
  const transformText = readText(paths.transform);

  assert(transform.schema_version === 1, 'transform schema_version must be 1');
  assert(transform.sprint_id === sprintId, 'wrong transform sprint id');
  assert(transform.status === 'textbook_source_task_transformation_ready_for_review', 'wrong transform status');
  assert(transform.sourceAuthority.kind === 'owned_textbook_source', 'sourceAuthority.kind must be owned_textbook_source');
  assert(transform.sourceAuthority.kind !== 'external_primary', 'textbook source must not claim external_primary authority');
  assert(!transform.sourceAuthority.exam_item_id, 'textbook source must not declare exam_item_id');
  assert(!transform.sourceAuthority.prompt_pdf, 'textbook source must not declare prompt_pdf');
  assert(!transform.sourceAuthority.correction_pdf, 'textbook source must not declare correction_pdf');
  assert(transform.sourceAuthority.paragraph_id === '1.1.3', 'wrong paragraph id');
  assert(transform.sourceAuthority.target_registry_ref.includes('course-target-exercises.json#paragraph_id=1.1.3'), 'missing target registry ref');
  assert(transform.sourceAuthority.authority_note.includes('not official exam authority'), 'authority note must reject official exam authority');
  assert(transform.productBoundary.official_exam_claim_authorized === false, 'official exam claim boundary must be false');
  assert(transform.productBoundary.external_primary_claim_authorized === false, 'external primary boundary must be false');
  assert(!/"kind"\s*:\s*"external_primary"/.test(transformText), 'transform JSON contains external_primary kind claim');

  const platformRoadmap = readText(paths.roadmap);
  const lessonRoadmap = readText(paths.lessonRoadmap);
  assert(roadmapLine(platformRoadmap, sprintId), 'platform roadmap missing current sprint row');
  assert(roadmapLine(lessonRoadmap, sprintId), 'lesson roadmap missing current sprint row');
  assert(roadmapLine(platformRoadmap, 'TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM'), 'platform roadmap missing actual-exam predecessor row');
  assert(roadmapLine(lessonRoadmap, 'TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM'), 'lesson roadmap missing actual-exam predecessor row');

  assert(TaskShellEngine.validateTaskSet(transform.taskSet) === true, 'transform taskSet must validate');
  assert(transform.taskSet.contextBlocks.length === 6, 'expected six context blocks');
  assert(transform.taskSet.tasks.length === 9, 'expected nine task cards');
  const contextIds = new Set(transform.taskSet.contextBlocks.map((block) => block.id));
  for (const id of ['ctx-icecream-prompt', 'ctx-icecream-source', 'ctx-icecream-table', 'ctx-icecream-graph', 'ctx-icecream-formula', 'ctx-icecream-procedure']) {
    assert(contextIds.has(id), `missing context block ${id}`);
  }
  const requiredFamilies = new Set([
    'table_value_selection',
    'structured_short_response',
    'step_ordering',
    'point_placement',
    'source_value_selection',
    'graph_reading',
    'calculation_work_capture',
    'source_chain_builder',
  ]);
  const actualFamilies = new Set(transform.taskSet.tasks.map((task) => task.family));
  for (const family of requiredFamilies) assert(actualFamilies.has(family), `missing family ${family}`);
  for (const task of transform.taskSet.tasks) {
    assert(Array.isArray(task.contextRefs) && task.contextRefs.length === 6, `${task.id} must reference all context blocks`);
  }

  const tableValue = taskById(transform.taskSet, 'tb113-table-value');
  const axes = taskById(transform.taskSet, 'tb113-axis-convention');
  const stepOrder = taskById(transform.taskSet, 'tb113-graph-step-order');
  const point = taskById(transform.taskSet, 'tb113-point-placement');
  const sourceValues = taskById(transform.taskSet, 'tb113-interpolation-source-values');
  const graphReading = taskById(transform.taskSet, 'tb113-graph-reading');
  const calculation = taskById(transform.taskSet, 'tb113-claim-calculation');
  const sourceChain = taskById(transform.taskSet, 'tb113-source-chain');
  const answerForm = taskById(transform.taskSet, 'tb113-answer-form');

  expectMatch(tableValue, 'q-400', 'table value correct response');
  expectReject(tableValue, 'q-300', 'table value distractor response');

  expectMatch(axes, { fields: { x_axis: 'hoeveelheid', y_axis: 'prijs' } }, 'axis convention correct response');
  expectReject(axes, { fields: { x_axis: 'prijs', y_axis: 'hoeveelheid' } }, 'axis convention swapped response');

  expectMatch(stepOrder, { order: stepOrder.expected.order }, 'graph step order correct response');
  expectReject(stepOrder, { order: stepOrder.expected.order.slice().reverse() }, 'graph step order reversed response');

  expectMatch(point, { point: { x: 300, y: 2 } }, 'point placement correct response');
  expectReject(point, { point: { x: 2, y: 300 } }, 'point placement axis-swapped response');

  expectMatch(sourceValues, { selections: sourceValues.expected.selections }, 'interpolation source values correct response');
  expectReject(sourceValues, { selections: sourceValues.expected.selections.slice(0, 2) }, 'interpolation source values incomplete response');
  expectReject(sourceValues, {
    selections: [
      { valueId: 'p150', role: 'higher_price' },
      { valueId: 'q400', role: 'lower_quantity' },
      { valueId: 'p200', role: 'lower_price' },
      { valueId: 'q300', role: 'higher_quantity' },
    ],
  }, 'interpolation source values wrong role response');

  expectMatch(graphReading, 350, 'graph reading correct response');
  expectReject(graphReading, 330, 'graph reading far-off response');

  expectMatch(calculation, {
    work: '400 naar 200; (200 - 400) / 400 x 100 = -50%; dus een daling',
    finalAnswer: 'eur 1.50 tot eur 2.50',
    unitNotation: 'procentuele daling',
  }, 'claim calculation paragraph-taught interval');
  expectMatch(calculation, {
    work: '200 naar 100; (100 - 200) / 200 x 100 = -50%; dus een daling',
    finalAnswer: 'eur 2.50 tot eur 3.00',
    unitNotation: 'procentuele daling',
  }, 'claim calculation alternate source-valid interval');
  expectReject(calculation, {
    work: '',
    finalAnswer: 'eur 1.50 tot eur 2.50',
    unitNotation: 'procentuele daling',
  }, 'claim calculation final interval only');
  expectReject(calculation, {
    work: '400 naar 200; (200 - 400) / 400 x 100 = -50%; dus een daling',
    finalAnswer: 'eur 1.50 tot eur 2.50',
    unitNotation: '',
  }, 'claim calculation missing unit notation');

  expectMatch(sourceChain, { chain: sourceChain.expected.chain }, 'source chain correct response');
  expectReject(sourceChain, { chain: sourceChain.expected.chain.slice().reverse() }, 'source chain reversed response');
  expectReject(sourceChain, { chain: ['source-table', 'choose-interval', 'state-claim'] }, 'source chain shallow response');

  expectMatch(answerForm, {
    fields: {
      interval: 'eur 1.50 tot eur 2.50',
      source_values: '400 naar 200',
      calculation: '-50 procent',
      sentence: 'de uitspraak kan bij die bronwaarden kloppen',
    },
  }, 'answer form paragraph-taught interval');
  expectMatch(answerForm, {
    fields: {
      interval: 'eur 2.50 tot eur 3.00',
      source_values: '200 naar 100',
      calculation: '50 procent daling',
      sentence: 'met dit interval klopt de uitspraak',
    },
  }, 'answer form alternate source-valid interval');
  expectReject(answerForm, {
    fields: {
      interval: 'eur 1.50 tot eur 2.50',
      source_values: '400 naar 200',
      calculation: '',
      sentence: 'de uitspraak kan bij die bronwaarden kloppen',
    },
  }, 'answer form missing calculation');

  assert(transform.textbookSourceAmbiguity.paragraph_taught_interval.percent_change === -50, 'paragraph interval must be -50 percent');
  assert(transform.textbookSourceAmbiguity.also_source_valid_interval.percent_change === -50, 'alternate interval must be -50 percent');
  assert(transform.answerFormTrace.accepted_interval_candidates.length === 2, 'answer-form trace must record two interval candidates');

  const operationIds = new Set(transform.operationChainTrace.map((item) => item.operation_id));
  for (const op of ['read_table_value', 'select_pq_axes', 'order_graph_procedure', 'plot_table_point', 'select_interpolation_source_values', 'interpolate_graph_value', 'calculate_percent_drop', 'state_claim_with_source_limits']) {
    assert(operationIds.has(op), `missing operation ${op}`);
  }
  for (const entry of transform.operationChainTrace) {
    assert(Array.isArray(entry.task_ids) && entry.task_ids.length > 0, `${entry.operation_id} missing task ids`);
    for (const taskId of entry.task_ids) taskById(transform.taskSet, taskId);
  }
  assert(transform.taskFamilyMap.length === transform.taskSet.tasks.length, 'taskFamilyMap must map every task');
  assert(transform.visualVariantMap.length >= 2, 'visualVariantMap must include graph and procedure visuals');
  for (const visual of transform.visualVariantMap) {
    assert(visual.raw_copied_image === false, `${visual.visual_id} must not be raw copied image`);
    assert(visual.variants.review_lab_light, `${visual.visual_id} missing light variant`);
    assert(visual.variants.review_lab_dark, `${visual.visual_id} missing dark variant`);
    assert(visual.variants.thumbnail, `${visual.visual_id} missing thumbnail variant`);
  }
  for (const [key, value] of Object.entries(transform.antiReductionChecks)) {
    assert(value === true, `antiReductionChecks.${key} must be true`);
  }
  const boundary = transform.productBoundary;
  assert(boundary.task_transformation_authorized === true, 'task transformation must be authorized');
  for (const [key, value] of Object.entries(boundary)) {
    if (key !== 'task_transformation_authorized') assert(value === false, `boundary ${key} must be false`);
  }

  for (const doc of [paths.sourceMap, paths.visualMap, paths.operationTrace, paths.answerTrace, paths.familyMap, paths.reviewerNotes]) {
    const text = readText(doc);
    assert(text.includes(sprintId), `${rel(doc)} missing sprint id`);
  }
  assert(readText(paths.sourceMap).includes('owned_textbook_source'), 'source map must state owned textbook authority');
  assert(readText(paths.sourceMap).includes('not official exam authority'), 'source map must reject official authority');
  assert(readText(paths.sourceMap).includes('tb113-claim-calculation'), 'source map must mention claim calculation task');
  assert(readText(paths.visualMap).includes('mobile-dark.png'), 'visual map must mention dark-mode proof');
  assert(readText(paths.operationTrace).includes('tb113-source-chain'), 'operation trace must mention source-chain task');
  assert(readText(paths.answerTrace).includes('EUR 2.50 to EUR 3.00'), 'answer trace must mention alternate interval');
  assert(readText(paths.familyMap).includes('final interval'), 'task-family map must name final-interval reduction');
  assert(readText(paths.reviewerNotes).includes('TaskShellEngine'), 'reviewer notes must cite task-shell validation');

  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === sprintId, 'wrong proof sprint_id');
  assert(proof.status === 'task_transformation_rendering_proof_complete', 'wrong proof status');
  assert(proof.task_transformation.source_authority_kind === 'owned_textbook_source', 'proof must record textbook source authority');
  assert(proof.task_transformation.context_before_tasks === true, 'proof aggregate context ordering failed');
  assert(proof.task_transformation.visible_internal_ids === false, 'proof aggregate exposes internal ids');
  assert(proof.task_transformation.raw_image_count === 0, 'proof aggregate contains raw images');
  assert(proof.task_transformation.visual_counts.tables === 1, 'proof must render one table');
  assert(proof.task_transformation.visual_counts.graphs === 1, 'proof must render one graph');
  assert(proof.task_transformation.visual_counts.flowcharts === 1, 'proof must render one flowchart');
  assert(proof.ambiguity_evidence.paragraph_taught_interval_recorded === true, 'proof missing paragraph interval ambiguity evidence');
  assert(proof.ambiguity_evidence.also_source_valid_interval_recorded === true, 'proof missing alternate interval ambiguity evidence');
  assert(proof.ambiguity_evidence.source_values_plus_calculation_required === true, 'proof must require source values plus calculation');

  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 3, 'proof must include three screenshots');
  const expectedCases = new Map([
    ['desktop-light', { width: 1280, theme: 'light' }],
    ['mobile-light', { width: 390, theme: 'light' }],
    ['mobile-dark', { width: 390, theme: 'dark' }],
  ]);
  for (const capture of proof.screenshots) {
    const expected = expectedCases.get(capture.case);
    assert(expected, `unexpected screenshot case ${capture.case}`);
    assert(capture.theme === expected.theme, `${capture.case} wrong theme`);
    assert(capture.viewport.width === expected.width, `${capture.case} wrong requested width`);
    const file = path.join(platformRoot, capture.file);
    assert(fs.existsSync(file), `missing screenshot ${capture.file}`);
    const dimensions = pngDimensions(file);
    assert(dimensions.width === expected.width, `${capture.case} screenshot width ${dimensions.width}, expected ${expected.width}`);
    assert(dimensions.height >= 400, `${capture.case} screenshot height too small`);
    assert(capture.proof.contextBlockCount === 6, `${capture.case} wrong context block count`);
    assert(capture.proof.taskCardCount === 9, `${capture.case} wrong task card count`);
    assert(capture.proof.contextBeforeTasks === true, `${capture.case} does not render context before tasks`);
    assert(capture.proof.tableCount === 1, `${capture.case} wrong table count`);
    assert(capture.proof.graphCount === 1, `${capture.case} wrong graph count`);
    assert(capture.proof.flowchartCount === 1, `${capture.case} wrong flowchart count`);
    assert(capture.proof.sourceRefsVisible === true, `${capture.case} missing source refs`);
    assert(capture.proof.visibleInternalIds === false, `${capture.case} exposes internal ids`);
    assert(capture.proof.answerSignalVisibleInContext === false, `${capture.case} exposes derived answer signal in context`);
    assert(capture.proof.answerSignalVisibleInTaskCards === false, `${capture.case} exposes derived answer signal in task cards`);
    assert(capture.proof.rawImageCount === 0, `${capture.case} contains raw images`);
    assert(capture.proof.overflowingCount === 0, `${capture.case} has non-table/formula overflow`);
    for (const family of requiredFamilies) assert(capture.proof.families.includes(family), `${capture.case} missing rendered family ${family}`);
  }
  assert(fs.existsSync(paths.lab), `missing ${rel(paths.lab)}`);
  assert(fs.existsSync(paths.manifest), `missing ${rel(paths.manifest)}`);
  const labHtml = readText(paths.lab);
  for (const forbidden of ['ctx-icecream', 'tb113-', '-50', '350']) {
    assert(!labHtml.includes(forbidden), `lab HTML source contains forbidden detector value ${forbidden}`);
  }

  assert(proof.boundary_evidence.protected_reference_status === '', 'proof recorded protected reference changes');
  assert(proof.boundary_evidence.source_data_status === '', 'proof recorded source-data changes');
  assert(proof.boundary_evidence.book1_generated_output_status === '', 'proof recorded Book 1 generated-output changes');
  assert(gitStatus(['status', '--short', '--', 'references/machine', 'references/external']) === '', 'protected reference paths changed');
  assert(gitStatus(['status', '--short', '--', 'source-data']) === '', 'source-data paths changed');
  assert(
    gitStatus([
      '-c',
      'safe.directory=C:/Projects/4veco/4veco-lessen',
      '-C',
      '../4veco-lessen',
      'status',
      '--short',
      '--',
      'Boek 1 - Grondslagen, vraag en aanbod',
    ]) === '',
    'Book 1 generated-output paths changed'
  );

  for (const [key, value] of Object.entries(proof.product_boundaries)) {
    if (key === 'task_transformation') assert(value === true, 'proof task_transformation boundary must be true');
    else assert(value === false, `proof product boundary ${key} must be false`);
  }

  console.log(`OK ${sprintId} textbook source task transformation`);
}

main();
