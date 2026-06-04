#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const sprintId = 'TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM';
const platformRoot = path.resolve(__dirname, '..', '..');
const lessonRoot = path.resolve(platformRoot, '..', '4veco-lessen');
const TaskShellEngine = require(path.join(platformRoot, 'engines', 'task-shell-engine'));

const paths = {
  transform: path.join(platformRoot, 'reports/json/task-ingest-transform2-actual-exam.json'),
  proof: path.join(platformRoot, 'reports/json/task-ingest-transform2-actual-exam-proof.json'),
  authority: path.join(platformRoot, 'reports/json/exam-source-authority1-contract.json'),
  reconstruction: path.join(platformRoot, 'reports/json/source-reconstruct2-actual-exam.json'),
  sourceProof: path.join(platformRoot, 'reports/json/source-reconstruct2-actual-exam-proof.json'),
  constructionContract: path.join(platformRoot, 'reports/json/task-family-construction-contract.json'),
  sourceProofContract: path.join(platformRoot, 'reports/json/task-family-source1-proof.json'),
  formulaProof: path.join(platformRoot, 'reports/json/task-family-formula1-proof.json'),
  orderProof: path.join(platformRoot, 'reports/json/task-family-order1-proof.json'),
  shellProof: path.join(platformRoot, 'reports/json/task-shell-ux2-proof.json'),
  roadmap: path.join(platformRoot, 'references/reference-team-roadmap.md'),
  lessonRoadmap: path.join(lessonRoot, 'lessen-team-roadmap.md'),
  operationTrace: path.join(platformRoot, `reports/sprints/${sprintId}-operation-chain-trace.md`),
  answerTrace: path.join(platformRoot, `reports/sprints/${sprintId}-answer-form-trace.md`),
  familyMap: path.join(platformRoot, `reports/sprints/${sprintId}-task-family-map.md`),
  reviewerNotes: path.join(platformRoot, `reports/sprints/${sprintId}-reviewer-notes.md`),
  lab: path.join(platformRoot, `reports/sprints/${sprintId}-rendered-lab.html`),
  manifest: path.join(platformRoot, `reports/sprints/${sprintId}-screenshot-manifest.md`),
};

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  assert(fs.existsSync(file), `missing ${rel(file)}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  assert(fs.existsSync(file), `missing ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
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

function roadmapLine(markdown, sprint) {
  return markdown.split(/\r?\n/).find((line) => line.includes(`| ${sprint} |`));
}

function assertClosed(markdown, sprint, label) {
  const line = roadmapLine(markdown, sprint);
  assert(line, `${label}: missing roadmap row ${sprint}`);
  assert(/\|\s*(yes|\*\*2026-\d{2}-\d{2}\*\*)\s*\|/.test(line), `${label}: ${sprint} is not closed`);
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

function ids(items) {
  return new Set(items);
}

function main() {
  const transform = readJson(paths.transform);
  const proof = readJson(paths.proof);
  const authority = readJson(paths.authority);
  const reconstruction = readJson(paths.reconstruction);
  const sourceProof = readJson(paths.sourceProof);
  const constructionContract = readJson(paths.constructionContract);
  const sourceFamilyProof = readJson(paths.sourceProofContract);
  const formulaProof = readJson(paths.formulaProof);
  const orderProof = readJson(paths.orderProof);
  const shellProof = readJson(paths.shellProof);

  assert(transform.schema_version === 1, 'transform schema_version must be 1');
  assert(transform.sprint_id === sprintId, 'wrong transform sprint id');
  assert(transform.status === 'actual_exam_task_transformation_ready_for_review', 'wrong transform status');
  assert(deepEqual(transform.sourceAuthority, authority.sourceAuthority), 'sourceAuthority does not match authority contract');
  assert(deepEqual(transform.sourceAuthority, reconstruction.sourceAuthority), 'sourceAuthority does not match source reconstruction');
  assert(sourceProof.status === 'source_reconstruction_rendering_proof_complete', 'source reconstruction proof is not complete');

  const platformRoadmap = readText(paths.roadmap);
  const lessonRoadmap = readText(paths.lessonRoadmap);
  for (const prereq of ['EXAM-SOURCE-AUTH-1', 'TASK-CONTEXT-SPEC-1', 'TASK-CONTEXT-RUNTIME-1', 'CONTEXT-VISUAL-STD-1', 'SOURCE-RECONSTRUCT-2-ACTUAL-EXAM']) {
    assertClosed(platformRoadmap, prereq, 'platform roadmap');
    assertClosed(lessonRoadmap, prereq, 'lesson roadmap');
  }
  assert(roadmapLine(platformRoadmap, sprintId), 'platform roadmap missing current sprint row');
  assert(roadmapLine(lessonRoadmap, sprintId), 'lesson roadmap missing current sprint row');

  assert(deepEqual(transform.sourceMaterialRefs, [authority.sourceAuthority.source_material_id]), 'wrong sourceMaterialRefs');
  for (const ref of authority.futureTransformedTaskAuthorityShape.answerModelRefs) {
    assert(transform.answerModelRefs.includes(ref), `missing answer model ref ${ref}`);
  }
  assert(transform.officialCorrectionComparison.required_threshold === authority.answerModelAuthority.required_threshold, 'wrong threshold');

  const contractFamilies = new Set(constructionContract.families.map((family) => family.id));
  assert(contractFamilies.has('source_value_selection'), 'construction contract missing source_value_selection');
  assert(contractFamilies.has('source_chain_builder'), 'construction contract missing source_chain_builder');
  assert(contractFamilies.has('formula_builder'), 'construction contract missing formula_builder');
  assert(sourceFamilyProof.runtime_support.source_value_selection.exact_value_role_set === true, 'source value runtime proof missing exact set');
  assert(sourceFamilyProof.runtime_support.source_chain_builder.exact_ordered_chain === true, 'source chain runtime proof missing exact order');
  assert(formulaProof.runtime_support.deterministic_matching === true, 'formula proof missing deterministic matching');
  assert(orderProof.runtime_support.exact_order_matching === true, 'order proof missing exact matching');
  assert(shellProof.unit_notation.wrappers_collect_unit_notation === true, 'task shell proof missing unit notation support');

  assert(TaskShellEngine.validateTaskSet(transform.taskSet) === true, 'transform taskSet must validate');
  assert(transform.taskSet.contextBlocks.length === 4, 'expected four context blocks');
  assert(deepEqual(transform.taskSet.contextBlocks, reconstruction.contextBlocks), 'taskSet contextBlocks must exactly match source reconstruction');
  assert(transform.taskSet.tasks.length === 6, 'expected six task cards');
  const requiredFamilies = ids(['source_value_selection', 'source_chain_builder', 'formula_builder', 'step_ordering', 'calculation_work_capture', 'structured_short_response']);
  const actualFamilies = new Set(transform.taskSet.tasks.map((task) => task.family));
  for (const family of requiredFamilies) assert(actualFamilies.has(family), `missing family ${family}`);
  for (const task of transform.taskSet.tasks) {
    assert(Array.isArray(task.contextRefs) && task.contextRefs.length === 4, `${task.id} must reference all context blocks`);
  }

  const sourceValues = taskById(transform.taskSet, 'q3-source-values');
  const formula = taskById(transform.taskSet, 'q3-annual-premium-formula');
  const ordering = taskById(transform.taskSet, 'q3-operation-order');
  const calculation = taskById(transform.taskSet, 'q3-calculation');
  const sourceChain = taskById(transform.taskSet, 'q3-source-chain');
  const direction = taskById(transform.taskSet, 'q3-threshold-direction');

  expectMatch(sourceValues, { selections: sourceValues.expected.selections }, 'source values correct response');
  expectReject(sourceValues, { selections: sourceValues.expected.selections.slice(0, 2) }, 'source values missing rows');
  expectReject(sourceValues, {
    selections: [
      { valueId: 'std-premium-10825', role: 'standard_monthly_premium' },
      { valueId: 'std-deductible-385', role: 'standard_deductible' },
      { valueId: 'inc-premium-8625', role: 'standard_monthly_premium' },
      { valueId: 'inc-deductible-885', role: 'increased_deductible' },
    ],
  }, 'source values wrong role');

  expectMatch(formula, { tokens: formula.expected.tokens }, 'formula correct response');
  expectReject(formula, { tokens: ['maandpremie', 'plus-eigen-risico', 'twaalf'] }, 'formula distractor response');
  expectReject(formula, { tokens: ['maandpremie', 'twaalf', 'keer'] }, 'formula wrong order');

  expectMatch(ordering, { order: ordering.expected.order }, 'ordering correct response');
  expectReject(ordering, { order: ['read-table', 'choose-lowest-premium', 'standard-annual-premium', 'add-standard-deductible', 'increased-annual-premium', 'derive-threshold'] }, 'ordering distractor response');
  expectReject(ordering, { order: ordering.expected.order.slice().reverse() }, 'ordering reversed response');

  expectMatch(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: 'euro per jaar',
  }, 'calculation correct response');
  expectReject(calculation, { work: '', finalAnswer: '649', unitNotation: 'euro per jaar' }, 'final-answer-only calculation');
  expectReject(calculation, { work: 'ik kies de laagste premie', finalAnswer: '649', unitNotation: 'euro per jaar' }, 'bogus calculation work');
  expectReject(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: '',
  }, 'calculation without unit');

  expectMatch(sourceChain, { chain: sourceChain.expected.chain }, 'source chain correct response');
  expectReject(sourceChain, { chain: sourceChain.expected.chain.slice().reverse() }, 'source chain reversed response');
  expectReject(sourceChain, { chain: ['source-table', 'role-values', 'use-885-only', 'direction'] }, 'source chain shallow response');

  expectMatch(direction, {
    fields: {
      threshold: '649 euro per jaar',
      direction: 'tot dat bedrag is verhoogd eigen risico voordeliger',
    },
  }, 'direction correct response');
  expectReject(direction, {
    fields: {
      threshold: '649 euro per jaar',
      direction: '',
    },
  }, 'direction missing direction text');

  const operationIds = new Set(transform.operationChainTrace.map((item) => item.operation_id));
  for (const op of ['select_source_values', 'annualize_monthly_premium', 'compare_deductible_exposure', 'derive_equal_cost_threshold', 'state_threshold_with_direction']) {
    assert(operationIds.has(op), `missing operation ${op}`);
  }
  const outputs = JSON.stringify(transform.operationChainTrace);
  for (const value of ['1299', '1035', '1684', '649']) {
    assert(outputs.includes(value), `operation trace missing ${value}`);
  }
  for (const entry of transform.operationChainTrace) {
    assert(Array.isArray(entry.task_ids) && entry.task_ids.length > 0, `${entry.operation_id} missing task ids`);
    for (const taskId of entry.task_ids) taskById(transform.taskSet, taskId);
  }

  assert(transform.answerFormTrace.source_use_modifier.blocked_as_standalone_proof === true, 'source use must be blocked as standalone proof');
  assert(transform.answerFormTrace.not_target_equivalent === true, 'answer-form trace must not claim target equivalence');
  const answerFormText = JSON.stringify(transform.answerFormTrace);
  for (const lane of ['calculation_work', 'formula_procedure_control', 'constructed_threshold_direction']) {
    assert(answerFormText.includes(lane), `answer-form trace missing ${lane}`);
  }
  for (const [key, value] of Object.entries(transform.antiReductionChecks)) {
    assert(value === true, `antiReductionChecks.${key} must be true`);
  }
  assert(transform.taskFamilyMap.length === transform.taskSet.tasks.length, 'taskFamilyMap must map every task');

  for (const doc of [paths.operationTrace, paths.answerTrace, paths.familyMap, paths.reviewerNotes]) {
    const text = readText(doc);
    assert(text.includes(sprintId), `${rel(doc)} missing sprint id`);
    assert(text.includes('q3-'), `${rel(doc)} missing task ids`);
  }
  assert(readText(paths.familyMap).includes('final-answer field alone'), 'task-family map must name final-answer reduction');
  assert(readText(paths.reviewerNotes).includes('TaskShellEngine'), 'reviewer notes must cite task-shell validation');

  const boundary = transform.productBoundary;
  assert(boundary.task_transformation_authorized === true, 'task transformation must be authorized');
  for (const [key, value] of Object.entries(boundary)) {
    if (key !== 'task_transformation_authorized') assert(value === false, `boundary ${key} must be false`);
  }

  assert(fs.existsSync(paths.lab), `missing ${rel(paths.lab)}`);
  assert(fs.existsSync(paths.manifest), `missing ${rel(paths.manifest)}`);
  const labHtml = readText(paths.lab);
  for (const forbidden of ['ctx-zoohee', 'q3-', 'Keuze A', 'Keuze B']) {
    assert(!labHtml.includes(forbidden), `lab HTML source contains forbidden detector value ${forbidden}`);
  }
  assert(labHtml.includes('data-semantic-validation="required"'), 'lab HTML must require semantic validation');
  assert(labHtml.includes('source_value_selection'), 'lab HTML must render source value family controls');
  assert(labHtml.includes('formula_builder'), 'lab HTML must render formula family controls');
  assert(labHtml.includes('source_chain_builder'), 'lab HTML must render source chain family controls');
  assert(labHtml.includes('support-box'), 'lab HTML must render collapsed support boxes');
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === sprintId, 'wrong proof sprint_id');
  assert(proof.status === 'playable_repair_proof_complete', 'wrong proof status');
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 6, 'proof must include six screenshots');

  const expectedCases = new Map([
    ['desktop-initial', { width: 1280, theme: 'light', action: 'initial' }],
    ['desktop-wrong-retry', { width: 1280, theme: 'light', action: 'wrong' }],
    ['desktop-corrected', { width: 1280, theme: 'light', action: 'corrected' }],
    ['desktop-completed', { width: 1280, theme: 'light', action: 'complete' }],
    ['mobile-completed', { width: 390, theme: 'light', action: 'complete' }],
    ['mobile-dark-completed', { width: 390, theme: 'dark', action: 'complete' }],
  ]);
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
    assert(dimensions.height >= 400, `${capture.case} screenshot height too small`);
    assert(capture.proof.contextBlockCount === 4, `${capture.case} wrong context block count`);
    assert(capture.proof.taskCardCount === 6, `${capture.case} wrong task card count`);
    assert(capture.proof.contextBeforeTasks === true, `${capture.case} does not render context before tasks`);
    assert(capture.proof.tableCount === 1, `${capture.case} wrong table count`);
    assert(capture.proof.sourceRefsVisible === true, `${capture.case} missing source refs`);
    assert(capture.proof.visibleInternalIds === false, `${capture.case} exposes internal ids`);
    assert(capture.proof.derivedAnswerVisibleInContext === false, `${capture.case} exposes derived answer in context`);
    assert(capture.proof.derivedAnswerVisibleInTaskCards === false, `${capture.case} exposes derived answer in task cards`);
    assert(capture.proof.rawImageCount === 0, `${capture.case} contains raw images`);
    assert(capture.proof.overflowingCount === 0, `${capture.case} has non-table overflow`);
    assert(capture.proof.semanticValidationEnabled === true, `${capture.case} missing semantic validation`);
    assert(capture.proof.genericOptionLabelVisible === false, `${capture.case} renders generic controls`);
    assert(capture.proof.supportBoxCount >= 1, `${capture.case} missing support boxes`);
    assert(capture.proof.supportCollapsedByDefault === true, `${capture.case} support is not collapsed by default`);
    assert(capture.proof.correctionModelSupportVisibleByDefault === false, `${capture.case} correction support is visible by default`);
    assert(capture.proof.plainSequenceTextareaCount === 0, `${capture.case} renders plain sequence textareas`);
    assert(capture.proof.taskInstructionCount === transform.taskSet.tasks.length, `${capture.case} missing concrete task instructions`);
    assert(capture.proof.sourcePanePresent === true, `${capture.case} missing source pane`);
    assert(capture.proof.taskPanePresent === true, `${capture.case} missing task pane`);
    assert(capture.proof.sourcePaneIndependentScroll === true, `${capture.case} source pane does not scroll independently`);
    assert(capture.proof.questionVisibleAfterSourceScroll === true, `${capture.case} prompt is not visible after source scroll`);
    assert(
      capture.proof.interactiveControlCount >= transform.taskSet.tasks.length,
      `${capture.case} missing interactive controls`
    );
    assert(capture.proof.checkButtonCount === transform.taskSet.tasks.length, `${capture.case} missing check buttons`);
    if (capture.case === 'desktop-initial') {
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should start incomplete`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not be complete`);
    } else if (capture.case === 'desktop-wrong-retry') {
      assert(capture.proof.wrongRetryCount > 0, `${capture.case} missing retry state`);
      assert(capture.proof.retryFeedbackCount > 0, `${capture.case} missing retry feedback`);
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should reject wrong attempt`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete after wrong attempt`);
    } else if (capture.case === 'desktop-corrected') {
      assert(capture.proof.completedTaskCount === 1, `${capture.case} should complete exactly one corrected card`);
      assert(capture.proof.wrongRetryCount === 0, `${capture.case} should clear retry state after correction`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete the whole lab`);
    } else {
      assert(capture.proof.completedTaskCount === transform.taskSet.tasks.length, `${capture.case} demo path did not complete all tasks`);
      assert(capture.proof.labCompleted === true, `${capture.case} demo path did not reach completion`);
    }
    assert(capture.proof.familyAffordances.source_value_selection.valueBank === true, `${capture.case} missing source value bank`);
    assert(capture.proof.familyAffordances.source_value_selection.roleBank === true, `${capture.case} missing role bank`);
    assert(capture.proof.familyAffordances.formula_builder.sequenceBuilder === true, `${capture.case} missing formula sequence builder`);
    assert(capture.proof.familyAffordances.step_ordering.sequenceBuilder === true, `${capture.case} missing step sequence builder`);
    assert(capture.proof.familyAffordances.source_chain_builder.sequenceBuilder === true, `${capture.case} missing source-chain sequence builder`);
    assert(capture.proof.familyAffordances.calculation_work_capture.calculationFields === true, `${capture.case} missing calculation fields`);
    assert(capture.proof.familyAffordances.structured_short_response.structuredFields === true, `${capture.case} missing structured fields`);
    for (const family of requiredFamilies) assert(capture.proof.families.includes(family), `${capture.case} missing rendered family ${family}`);
  }
  assert(proof.task_transformation.context_before_tasks === true, 'proof aggregate context ordering failed');
  assert(proof.task_transformation.derived_answer_visible_in_context === false, 'proof aggregate exposes derived answer in context');
  assert(proof.task_transformation.derived_answer_visible_in_task_cards === false, 'proof aggregate exposes derived answer in task cards');
  assert(proof.task_transformation.raw_image_count === 0, 'proof aggregate contains raw images');
  assert(proof.task_transformation.playable_lab.semantic_validation_enabled === true, 'proof aggregate missing semantic validation');
  assert(proof.task_transformation.playable_lab.real_task_family_controls_rendered === true, 'proof aggregate missing real task-family controls');
  assert(proof.task_transformation.playable_lab.source_value_banks_rendered === true, 'proof aggregate missing source value banks');
  assert(proof.task_transformation.playable_lab.sequence_builders_rendered === true, 'proof aggregate missing sequence builders');
  assert(proof.task_transformation.playable_lab.calculation_fields_rendered === true, 'proof aggregate missing calculation fields');
  assert(proof.task_transformation.playable_lab.structured_fields_rendered === true, 'proof aggregate missing structured fields');
  assert(proof.task_transformation.playable_lab.plain_sequence_textareas_absent === true, 'proof aggregate has plain sequence textareas');
  assert(proof.task_transformation.playable_lab.check_buttons_rendered === true, 'proof aggregate missing check buttons');
  assert(proof.task_transformation.playable_lab.task_instructions_rendered === true, 'proof aggregate missing task instructions');
  assert(proof.task_transformation.playable_lab.support_collapsed_by_default === true, 'proof aggregate support is not collapsed');
  assert(proof.task_transformation.playable_lab.initial_state_proven === true, 'proof aggregate missing initial state');
  assert(proof.task_transformation.playable_lab.wrong_retry_state_proven === true, 'proof aggregate missing wrong/retry state');
  assert(proof.task_transformation.playable_lab.corrected_state_proven === true, 'proof aggregate missing corrected state');
  assert(proof.task_transformation.playable_lab.completion_path_reaches_done === true, 'proof aggregate demo path did not complete');
  assert(proof.task_transformation.playable_lab.source_pane_independent_scroll === true, 'proof aggregate source pane is not independently scrollable');
  assert(proof.task_transformation.playable_lab.question_visible_after_source_scroll === true, 'proof aggregate prompt is not retained while sources scroll');

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

  console.log(`OK ${sprintId} actual exam task transformation`);
}

main();
