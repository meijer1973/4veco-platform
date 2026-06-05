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
  visualQa: path.join(platformRoot, 'reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-visual-qa-report.md'),
  economy: path.join(platformRoot, 'reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-transformation-economy-report.md'),
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
  if (result.status !== 0) fail(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  return (result.stdout || '').trim();
}

function roadmapLine(markdown, sprint) {
  return markdown.split(/\r?\n/).find((line) => line.includes(`| ${sprint} |`));
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
  assert(transform.sourceAuthority.authority_note.includes('not official exam authority'), 'authority note must reject official exam authority');
  assert(!/"kind"\s*:\s*"external_primary"/.test(transformText), 'transform JSON contains external_primary kind claim');

  const platformRoadmap = readText(paths.roadmap);
  const lessonRoadmap = readText(paths.lessonRoadmap);
  assert(roadmapLine(platformRoadmap, 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-2'), 'platform roadmap missing repair2 row');
  assert(roadmapLine(lessonRoadmap, 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-2'), 'lesson roadmap missing repair2 row');

  assert(TaskShellEngine.validateTaskSet(transform.taskSet) === true, 'transform taskSet must validate');
  assert(transform.taskSet.contextBlocks.length === 6, 'expected six source-contract context blocks');
  assert(transform.taskSet.tasks.length === 3, 'textbook task set must have at most three required cards');
  assert(transform.taskSet.tasks[0].family === 'graph_construction_substitute', 'primary textbook task must be graph_construction_substitute');
  assert(transform.taskSet.tasks[0].prompt.includes('Teken de P-Q-grafiek'), 'primary textbook task must carry the original target prompt');

  const contextIds = new Set(transform.taskSet.contextBlocks.map((block) => block.id));
  for (const id of ['ctx-icecream-prompt', 'ctx-icecream-source', 'ctx-icecream-table', 'ctx-icecream-graph', 'ctx-icecream-formula', 'ctx-icecream-procedure']) {
    assert(contextIds.has(id), `missing context block ${id}`);
  }
  const promptBlock = transform.taskSet.contextBlocks.find((block) => block.id === 'ctx-icecream-prompt');
  const graphBlock = transform.taskSet.contextBlocks.find((block) => block.id === 'ctx-icecream-graph');
  assert(promptBlock.renderPolicy.sourcePaneVisible === false, 'prompt block must not be source-pane visible');
  assert(graphBlock.renderPolicy.defaultVisibleBeforeGraphConstruction === false, 'completed graph must be hidden before graph construction');

  const families = transform.taskSet.tasks.map((task) => task.family);
  assert(JSON.stringify(families) === JSON.stringify(['graph_construction_substitute', 'graph_reading', 'calculation_work_capture']), 'textbook families must be graph construction -> graph reading -> optional calculation follow-up');
  for (const forbiddenFamily of ['table_value_selection', 'step_ordering', 'point_placement', 'source_value_selection', 'source_chain_builder']) {
    assert(!families.includes(forbiddenFamily), `${forbiddenFamily} must not be a required textbook support card`);
  }
  for (const task of transform.taskSet.tasks) {
    assert(Array.isArray(task.contextRefs) && task.contextRefs.length === 6, `${task.id} must reference all context blocks`);
  }

  const graphConstruction = taskById(transform.taskSet, 'tb113-graph-construction');
  const graphReading = taskById(transform.taskSet, 'tb113-graph-reading');
  const dropCheck = taskById(transform.taskSet, 'tb113-quantity-drop-check');
  assert(graphConstruction.interaction.pointCount === 2, 'graph construction must require two plotted points');
  assert(graphConstruction.interaction.clickInstruction && graphConstruction.interaction.clickInstruction.includes('Klik twee'), 'graph construction must declare click-to-place instruction');
  const graphResponse = {
    axes: { x: 'hoeveelheid q', y: 'prijs p' },
    points: [
      { x: 500, y: 1 },
      { x: 100, y: 3 },
    ],
    lineShape: 'decreasing',
  };
  expectMatch(graphConstruction, graphResponse, 'graph construction correct response');
  expectReject(graphConstruction, { ...graphResponse, axes: { x: 'prijs p', y: 'hoeveelheid q' } }, 'graph construction swapped axes');
  expectReject(graphConstruction, { ...graphResponse, points: graphResponse.points.slice(0, 1) }, 'graph construction missing point');
  expectReject(graphConstruction, { ...graphResponse, lineShape: '' }, 'graph construction missing line confirmation');

  expectMatch(graphReading, 350, 'graph reading correct response');
  expectReject(graphReading, 330, 'graph reading far-off response');

  expectMatch(dropCheck, {
    work: '400 naar 200; (200 - 400) / 400 x 100 = -50%; dus een daling',
    finalAnswer: 'eur 1.50 tot eur 2.50',
    unitNotation: '50 procent daling',
  }, 'quantity drop paragraph interval');
  expectMatch(dropCheck, {
    work: '200 naar 100; (100 - 200) / 200 x 100 = -50%; dus een daling',
    finalAnswer: 'eur 2.50 tot eur 3.00',
    unitNotation: '50 procent daling',
  }, 'quantity drop alternate interval');
  expectReject(dropCheck, {
    work: '',
    finalAnswer: 'eur 1.50 tot eur 2.50',
    unitNotation: '50 procent daling',
  }, 'quantity drop final interval only');

  assert(transform.textbookSourceAmbiguity.handling.includes('optional follow-up'), 'ambiguity must be optional follow-up after graph task');
  assert(transform.answerFormTrace.primary_answer_form.family === 'graph_construction_substitute', 'answer trace must make graph construction primary');
  assert(transform.answerFormTrace.target_task_economy.max_required_cards === 3, 'answer trace must record max card economy');
  assert(transform.taskFamilyMap.length === 3, 'taskFamilyMap must map the three tasks');
  assert(transform.taskFamilyMap[0].original_target_task === 'Teken een P-Q-grafiek bij de tabel.', 'task family map must show original target to graph construction');
  assert(transform.antiReductionChecks.graph_construction_primary_task_required === true, 'graph construction must be primary');
  assert(transform.antiReductionChecks.two_point_click_graph_construction_required === true, 'two-point click graph construction guard missing');
  assert(transform.antiReductionChecks.typed_point_entry_fallback_only === true, 'typed fallback guard missing');
  assert(transform.antiReductionChecks.axis_labels_hidden_until_axis_selection === true, 'axis label reveal guard missing');
  assert(transform.antiReductionChecks.completed_graph_hidden_before_construction_success === true, 'completed graph guard missing');
  assert(transform.antiReductionChecks.prompt_not_rendered_as_source === true, 'prompt/source guard missing');
  assert(transform.antiReductionChecks.target_task_economy_enforced === true, 'target-task economy guard missing');

  const operationIds = new Set(transform.operationChainTrace.map((item) => item.operation_id));
  for (const op of ['construct_pq_graph_from_table', 'read_quantity_from_constructed_graph', 'check_one_quantity_drop_interval']) {
    assert(operationIds.has(op), `missing operation ${op}`);
  }
  for (const entry of transform.operationChainTrace) {
    assert(Array.isArray(entry.task_ids) && entry.task_ids.length > 0, `${entry.operation_id} missing task ids`);
    for (const taskId of entry.task_ids) taskById(transform.taskSet, taskId);
  }

  for (const doc of [paths.sourceMap, paths.visualMap, paths.operationTrace, paths.answerTrace, paths.familyMap, paths.reviewerNotes, paths.visualQa, paths.economy]) {
    const text = readText(doc);
    assert(text.includes(sprintId) || text.includes('SHARED-TASK-INGEST-PLAYABLE-REPAIR-2'), `${rel(doc)} missing sprint id`);
  }
  assert(readText(paths.sourceMap).includes('not official exam authority'), 'source map must reject official authority');
  assert(readText(paths.familyMap).includes('Teken een P-Q-grafiek bij de tabel'), 'task-family map must mention original graph target');
  assert(readText(paths.familyMap).includes('graph_construction_substitute'), 'task-family map must mention graph construction substitute');
  assert(readText(paths.visualQa).includes('graph workspace'), 'visual QA report must inspect graph workspace');
  assert(readText(paths.economy).includes('max 3'), 'economy report must name max-card rule');

  const boundary = transform.productBoundary;
  assert(boundary.task_transformation_authorized === true, 'task transformation must be authorized');
  for (const [key, value] of Object.entries(boundary)) {
    if (key !== 'task_transformation_authorized') assert(value === false, `boundary ${key} must be false`);
  }

  assert(fs.existsSync(paths.lab), `missing ${rel(paths.lab)}`);
  assert(fs.existsSync(paths.manifest), `missing ${rel(paths.manifest)}`);
  const labHtml = readText(paths.lab);
  for (const forbidden of ['ctx-icecream', 'tb113-', 'Keuze A', 'Keuze B']) {
    assert(!labHtml.includes(forbidden), `lab HTML source contains forbidden detector value ${forbidden}`);
  }
  assert(labHtml.includes('data-semantic-validation="required"'), 'lab HTML must require semantic validation');
  assert(labHtml.includes('graph_construction_substitute'), 'lab HTML must render graph construction family controls');
  assert(labHtml.includes('data-graph-workspace="construction"'), 'lab HTML must render graph workspace');
  assert(labHtml.includes('data-completed-graph="true" hidden'), 'completed graph must be hidden by default');
  assert(labHtml.includes('support-box'), 'lab HTML must render collapsed support boxes');

  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === sprintId, 'wrong proof sprint_id');
  assert(proof.status === 'playable_repair_proof_complete', 'wrong proof status');
  assert(proof.task_transformation.task_count === 3, 'proof must record three task cards');
  assert(proof.task_transformation.playable_lab.graph_construction_controls_rendered === true, 'proof missing graph construction controls');
  assert(proof.task_transformation.playable_lab.click_to_place_primary === true, 'proof missing click-to-place graph construction');
  assert(proof.task_transformation.playable_lab.typed_point_entry_fallback_only === true, 'proof missing collapsed typed fallback');
  assert(proof.task_transformation.playable_lab.graph_labels_hidden_before_axis_selection === true, 'proof missing hidden initial graph labels');
  assert(proof.task_transformation.playable_lab.graph_labels_reveal_after_axis_selection === true, 'proof missing graph label reveal after axis selection');
  assert(proof.task_transformation.playable_lab.target_task_economy_enforced === true, 'proof missing target economy');
  assert(proof.task_transformation.playable_lab.prompt_not_in_source_pane === true, 'proof missing prompt/source guard');
  assert(proof.task_transformation.playable_lab.completed_graph_hidden_before_attempt === true, 'proof missing completed graph guard');
  assert(proof.task_transformation.playable_lab.graph_workspace_in_task_pane === true, 'proof missing task-pane graph workspace');
  assert(proof.task_transformation.playable_lab.graph_workspace_width_pass === true, 'proof missing graph workspace width pass');
  assert(proof.task_transformation.playable_lab.source_pane_readability_pass === true, 'proof missing source-pane readability pass');
  assert(proof.ambiguity_evidence.primary_graph_construction_first === true, 'proof must record primary graph construction first');

  const expectedCases = new Map([
    ['desktop-initial', { width: 1280, theme: 'light', action: 'initial', renderedContextBlocks: 4 }],
    ['desktop-axis-selected', { width: 1280, theme: 'light', action: 'axis-selected', renderedContextBlocks: 4 }],
    ['desktop-wrong-retry', { width: 1280, theme: 'light', action: 'wrong', renderedContextBlocks: 4 }],
    ['desktop-corrected', { width: 1280, theme: 'light', action: 'corrected', renderedContextBlocks: 4 }],
    ['desktop-completed', { width: 1280, theme: 'light', action: 'complete', renderedContextBlocks: 4 }],
    ['mobile-completed', { width: 390, theme: 'light', action: 'complete', renderedContextBlocks: 4 }],
    ['mobile-dark-completed', { width: 390, theme: 'dark', action: 'complete', renderedContextBlocks: 4 }],
  ]);
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 7, 'proof must include seven screenshots');
  for (const capture of proof.screenshots) {
    const expected = expectedCases.get(capture.case);
    assert(expected, `unexpected screenshot case ${capture.case}`);
    assert(capture.theme === expected.theme, `${capture.case} wrong theme`);
    assert(capture.action === expected.action, `${capture.case} wrong action`);
    assert(capture.viewport.width === expected.width, `${capture.case} wrong requested width`);
    const file = path.join(platformRoot, capture.file);
    assert(fs.existsSync(file), `missing screenshot ${capture.file}`);
    const dimensions = pngDimensions(file);
    assert(dimensions.width === expected.width, `${capture.case} screenshot width ${dimensions.width}, expected ${expected.width}`);
    assert(capture.proof.contextBlockCount === expected.renderedContextBlocks, `${capture.case} wrong rendered context block count`);
    assert(capture.proof.taskCardCount === 3, `${capture.case} wrong task card count`);
    assert(capture.proof.promptInSourcePaneCount === 0, `${capture.case} renders prompt in source pane`);
    assert(capture.proof.sourcePaneCompletedGraphCount === 0, `${capture.case} renders completed graph in source pane`);
    assert(capture.proof.completedGraphVisibleBeforeAttempt === false, `${capture.case} shows completed graph before construction attempt`);
    assert(capture.proof.graphWorkspaceInTaskPane === true, `${capture.case} graph workspace is not in task pane`);
    assert(capture.proof.graphWorkspaceWidthPass === true, `${capture.case} graph workspace width is too small`);
    assert(capture.proof.graphClickToPlaceSupported === true, `${capture.case} missing click-to-place surface`);
    assert(capture.proof.semanticValidationEnabled === true, `${capture.case} missing semantic validation`);
    assert(capture.proof.supportCollapsedByDefault === true, `${capture.case} support is not collapsed`);
    assert(capture.proof.sourcePaneIndependentScroll === true, `${capture.case} source pane does not scroll independently`);
    assert(capture.proof.questionVisibleAfterSourceScroll === true, `${capture.case} prompt is not visible after source scroll`);
    assert(capture.proof.sourceRefsVisible === false, `${capture.case} shows long source refs`);
    assert(capture.proof.sourceTableVisibleAtTop === true, `${capture.case} source table is not visible at source-pane top`);
    if (capture.viewport.width >= 900) assert(capture.proof.sourcePaneComfortableInitial === true, `${capture.case} desktop source pane is not readable at initial layout`);
    assert(capture.proof.familyAffordances.graph_construction_substitute.graphWorkspace === true, `${capture.case} missing graph workspace affordance`);
    assert(capture.proof.familyAffordances.graph_construction_substitute.graphAxisControls === true, `${capture.case} missing graph axis controls`);
    assert(capture.proof.familyAffordances.graph_construction_substitute.graphClickToPlace === true, `${capture.case} missing click-to-place affordance`);
    assert(capture.proof.familyAffordances.graph_construction_substitute.typedPointFallbackCollapsed === true, `${capture.case} typed point fallback is not collapsed`);
    assert(capture.proof.familyAffordances.graph_construction_substitute.typedPointFallbackOpen === false, `${capture.case} typed point fallback is open`);
    assert(capture.proof.familyAffordances.graph_construction_substitute.graphLineConfirmation === true, `${capture.case} missing graph line confirmation`);
    assert(capture.proof.familyAffordances.graph_reading.numericField === true, `${capture.case} missing graph reading field`);
    assert(capture.proof.familyAffordances.calculation_work_capture.calculationFields === true, `${capture.case} missing calculation fields`);
    if (capture.case === 'desktop-initial') {
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should start incomplete`);
      assert(capture.proof.completedGraphVisibleCount === 0, `${capture.case} completed graph must not be visible initially`);
      assert(capture.proof.graphAxisLabelsVisibleCount === 0, `${capture.case} reveals axis labels before axis selection`);
      assert(capture.proof.graphScaleLabelsVisibleCount === 0, `${capture.case} reveals numeric scale before axis selection`);
      assert(capture.proof.graphLabelsVisibleBeforeAxisSelection === false, `${capture.case} shows labels before axis selection`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not be complete`);
    } else if (capture.case === 'desktop-axis-selected') {
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should not complete on axis selection only`);
      assert(capture.proof.graphAxisLabelsVisibleCount > 0, `${capture.case} should reveal axis labels after correct axis selection`);
      assert(capture.proof.graphScaleLabelsVisibleCount > 0, `${capture.case} should reveal numeric labels after correct axis selection`);
      assert(capture.proof.completedGraphVisibleCount === 0, `${capture.case} should not reveal completed graph after axis selection only`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not be complete`);
    } else if (capture.case === 'desktop-wrong-retry') {
      assert(capture.proof.wrongRetryCount > 0, `${capture.case} missing retry state`);
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should reject wrong attempt`);
      assert(capture.proof.completedGraphVisibleCount === 0, `${capture.case} must not reveal completed graph after wrong axes`);
    } else if (capture.case === 'desktop-corrected') {
      assert(capture.proof.completedTaskCount === 1, `${capture.case} should complete exactly one corrected card`);
      assert(capture.proof.completedGraphVisibleCount >= 1, `${capture.case} should reveal completed graph after corrected construction`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete the whole lab`);
    } else {
      assert(capture.proof.completedTaskCount === 3, `${capture.case} demo path did not complete all tasks`);
      assert(capture.proof.labCompleted === true, `${capture.case} demo path did not reach completion`);
    }
    assert(capture.proof.visibleInternalIds === false, `${capture.case} exposes internal ids`);
    assert(capture.proof.derivedAnswerVisibleInContext === false, `${capture.case} exposes derived answer signal in context`);
    assert(capture.proof.derivedAnswerVisibleInTaskCards === false, `${capture.case} exposes derived answer signal in task cards`);
    assert(capture.proof.rawImageCount === 0, `${capture.case} contains raw images`);
    assert(capture.proof.overflowingCount === 0, `${capture.case} has non-table/formula overflow`);
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

  console.log(`OK ${sprintId} textbook target-task transformation`);
}

main();
