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
  sourceProofContract: path.join(platformRoot, 'reports/json/task-family-source1-proof.json'),
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
  if (result.status !== 0) fail(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
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

function main() {
  const transform = readJson(paths.transform);
  const proof = readJson(paths.proof);
  const authority = readJson(paths.authority);
  const reconstruction = readJson(paths.reconstruction);
  const sourceProof = readJson(paths.sourceProof);
  const sourceFamilyProof = readJson(paths.sourceProofContract);
  const shellProof = readJson(paths.shellProof);

  assert(transform.schema_version === 1, 'transform schema_version must be 1');
  assert(transform.sprint_id === sprintId, 'wrong transform sprint id');
  assert(transform.status === 'actual_exam_task_transformation_ready_for_review', 'wrong transform status');
  assert(deepEqual(transform.sourceAuthority, authority.sourceAuthority), 'sourceAuthority does not match authority contract');
  assert(deepEqual(transform.sourceAuthority, reconstruction.sourceAuthority), 'sourceAuthority does not match source reconstruction');
  assert(sourceProof.status === 'source_reconstruction_rendering_proof_complete', 'source reconstruction proof is not complete');
  assert(sourceFamilyProof.runtime_support.source_value_selection.exact_value_role_set === true, 'source value runtime proof missing exact set');
  assert(shellProof.unit_notation.wrappers_collect_unit_notation === true, 'task shell proof missing unit notation support');

  const platformRoadmap = readText(paths.roadmap);
  const lessonRoadmap = readText(paths.lessonRoadmap);
  for (const prereq of ['EXAM-SOURCE-AUTH-1', 'TASK-CONTEXT-SPEC-1', 'TASK-CONTEXT-RUNTIME-1', 'CONTEXT-VISUAL-STD-1', 'SOURCE-RECONSTRUCT-2-ACTUAL-EXAM']) {
    assertClosed(platformRoadmap, prereq, 'platform roadmap');
    assertClosed(lessonRoadmap, prereq, 'lesson roadmap');
  }
  assert(roadmapLine(platformRoadmap, 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-2'), 'platform roadmap missing repair2 row');
  assert(roadmapLine(lessonRoadmap, 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-2'), 'lesson roadmap missing repair2 row');

  assert(deepEqual(transform.sourceMaterialRefs, [authority.sourceAuthority.source_material_id]), 'wrong sourceMaterialRefs');
  assert(transform.officialCorrectionComparison.required_threshold === authority.answerModelAuthority.required_threshold, 'wrong threshold');

  assert(TaskShellEngine.validateTaskSet(transform.taskSet) === true, 'transform taskSet must validate');
  assert(transform.taskSet.contextBlocks.length === 4, 'expected four context blocks in the transform contract');
  assert(deepEqual(transform.taskSet.contextBlocks, reconstruction.contextBlocks), 'taskSet contextBlocks must exactly match source reconstruction');
  assert(transform.taskSet.tasks.length === 3, 'actual exam task set must have three required cards');

  const families = transform.taskSet.tasks.map((task) => task.family);
  assert(deepEqual(families, ['choice', 'calculation_work_capture', 'structured_short_response']), 'actual exam families must be conceptual setup -> calculation -> conclusion');
  for (const forbiddenFamily of ['formula_builder', 'step_ordering', 'source_chain_builder']) {
    assert(!families.includes(forbiddenFamily), `${forbiddenFamily} must not be a required exam card`);
  }
  for (const task of transform.taskSet.tasks) {
    assert(Array.isArray(task.contextRefs) && task.contextRefs.length === 4, `${task.id} must reference all context blocks`);
  }

  const sourceValues = taskById(transform.taskSet, 'q3-source-values');
  const calculation = taskById(transform.taskSet, 'q3-calculation');
  const direction = taskById(transform.taskSet, 'q3-threshold-direction');
  assert(sourceValues.family === 'choice', 'task 1 must be a conceptual choice, not source-value selection');
  assert(sourceValues.expected.value === 'annual_premium_plus_exposure', 'task 1 must ask for annual premium plus deductible exposure');
  assert(!sourceValues.interaction.selectionMode, 'task 1 must not use compact source-cell selection after repair4');
  assert(!sourceValues.interaction.values, 'task 1 must not render a select-all-numbers value bank');
  assert(direction.interaction.carryForward && direction.interaction.carryForward.fromTaskIndex === 1, 'direction task must carry forward the calculation result');
  assert(Array.isArray(direction.interaction.directionOptions) && direction.interaction.directionOptions.length >= 3, 'direction task must use constrained direction options');

  expectMatch(sourceValues, { value: 'annual_premium_plus_exposure' }, 'conceptual setup correct response');
  expectReject(sourceValues, { value: 'monthly_premiums_only' }, 'conceptual setup rejects lowest-premium shortcut');

  expectMatch(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: 'euro per jaar',
  }, 'calculation correct response');
  expectMatch(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: 'euros',
  }, 'calculation accepts 649 plus euros');
  expectMatch(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: 'euros per year',
  }, 'calculation accepts English yearly unit');
  assert(Array.isArray(calculation.expected.acceptedWorkPaths) && calculation.expected.acceptedWorkPaths.length === 2, 'calculation must declare two accepted work paths');
  assert(calculation.expected.acceptedWorkPaths.some((item) => item.id === 'premium-difference-shortcut'), 'calculation must accept premium-difference shortcut path');
  expectMatch(calculation, {
    work: '22x12 = 264, 264 + 385 = 649',
    finalAnswer: '649',
    unitNotation: 'euro per jaar',
  }, 'calculation accepts premium-difference shortcut without spaces');
  expectMatch(calculation, {
    work: '22 x 12 = 264; 264 + 385 = 649',
    finalAnswer: '649',
    unitNotation: 'euros',
  }, 'calculation accepts reviewer shortcut with euros');
  expectReject(calculation, { work: '', finalAnswer: '649', unitNotation: 'euro per jaar' }, 'final-answer-only calculation');
  expectReject(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: 'euro per maand',
  }, 'calculation rejects wrong period unit for targeted feedback');
  expectReject(calculation, { work: 'ik kies de laagste premie', finalAnswer: '649', unitNotation: 'euro per jaar' }, 'bogus calculation work');
  assert(calculation.interaction.targetedFeedback?.unitOnly === 'Het bedrag klopt. Controleer alleen de eenheid.', 'calculation must define unit-only feedback');
  assert(calculation.interaction.progressiveSupport?.solutionButton === 'Toon uitwerking', 'calculation must define progressive solution support');

  expectMatch(direction, {
    fields: {
      threshold: '649 euro per jaar',
      direction: 'tot dat bedrag is verhoogd eigen risico voordeliger',
    },
  }, 'direction correct response');
  expectMatch(direction, {
    fields: {
      threshold: 'EUR 649 per jaar',
      direction: 'lager dan',
    },
  }, 'direction constrained carry-forward response');
  expectReject(direction, {
    fields: {
      threshold: '649 euro per jaar',
      direction: '',
    },
  }, 'direction missing direction text');

  const operationIds = new Set(transform.operationChainTrace.map((item) => item.operation_id));
  for (const op of ['identify_comparison_basis', 'calculate_threshold_with_visible_work', 'state_threshold_with_direction']) {
  assert(operationIds.has(op), `missing operation ${op}`);
  }
  for (const entry of transform.operationChainTrace) {
    assert(Array.isArray(entry.task_ids) && entry.task_ids.length > 0, `${entry.operation_id} missing task ids`);
    for (const taskId of entry.task_ids) taskById(transform.taskSet, taskId);
  }

  assert(transform.answerFormTrace.collapsed_support_policy.formula_builder_required_card === false, 'formula builder must not be required');
  assert(transform.answerFormTrace.collapsed_support_policy.step_ordering_required_card === false, 'step ordering must not be required');
  assert(transform.answerFormTrace.collapsed_support_policy.source_chain_builder_required_card === false, 'source chain must not be required');
  assert(transform.answerFormTrace.not_target_equivalent === true, 'answer-form trace must not claim target equivalence');
  assert(transform.taskFamilyMap.length === 3, 'taskFamilyMap must map the three required cards');
  assert(transform.taskFamilyMap[0].family === 'choice', 'taskFamilyMap must show conceptual choice setup');
  assert(transform.antiReductionChecks.target_task_economy_enforced === true, 'target task economy must be enforced');
  assert(transform.antiReductionChecks.final_answer_field_alone_rejected === true, 'final-answer-only reduction must be rejected');
  assert(transform.antiReductionChecks.select_all_numbers_task_removed === true, 'select-all-numbers task must be removed');
  assert(transform.antiReductionChecks.accepts_649_with_reasonable_unit_variants === true, 'unit-variant guard missing');
  assert(transform.antiReductionChecks.accepts_premium_difference_shortcut_work === true, 'premium-difference shortcut guard missing');
  assert(transform.antiReductionChecks.progressive_support_after_failed_attempts === true, 'progressive support guard missing');

  for (const doc of [paths.operationTrace, paths.answerTrace, paths.familyMap, paths.reviewerNotes]) {
    const text = readText(doc);
    assert(text.includes(sprintId), `${rel(doc)} missing sprint id`);
  }
  assert(readText(paths.familyMap).includes('choice -> calculation_work_capture -> structured_short_response'), 'task-family map must show repair4 three-card sequence');
  assert(readText(paths.reviewerNotes).includes('target-task economy'), 'reviewer notes must cite target-task economy');

  const boundary = transform.productBoundary;
  assert(boundary.task_transformation_authorized === true, 'task transformation must be authorized');
  for (const [key, value] of Object.entries(boundary)) {
    if (key !== 'task_transformation_authorized') assert(value === false, `boundary ${key} must be false`);
  }

  assert(fs.existsSync(paths.lab), `missing ${rel(paths.lab)}`);
  assert(fs.existsSync(paths.manifest), `missing ${rel(paths.manifest)}`);
  const labHtml = readText(paths.lab);
  const taskGridStart = labHtml.indexOf('<section class="task-grid">');
  const taskGridEnd = labHtml.indexOf('<aside class="review-panel">');
  const taskMarkup = taskGridStart >= 0 && taskGridEnd > taskGridStart
    ? labHtml.slice(taskGridStart, taskGridEnd)
    : labHtml;
  for (const forbidden of ['ctx-zoohee', 'q3-', 'Keuze A', 'Keuze B']) {
    assert(!labHtml.includes(forbidden), `lab HTML source contains forbidden detector value ${forbidden}`);
  }
  assert(labHtml.includes('data-semantic-validation="required"'), 'lab HTML must require semantic validation');
  assert(labHtml.includes('choice'), 'lab HTML must render conceptual setup choice controls');
  assert(!taskMarkup.includes('data-source-cell-selection="compact"'), 'lab task markup must not render select-all source-cell controls');
  assert(!taskMarkup.includes('source-cell-select'), 'lab task markup must not render source-cell select inputs');
  assert(labHtml.includes('calculation_work_capture'), 'lab HTML must render calculation controls');
  assert(labHtml.includes('structured_short_response'), 'lab HTML must render conclusion controls');
  assert(labHtml.includes('support-box'), 'lab HTML must render collapsed support boxes');

  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === sprintId, 'wrong proof sprint_id');
  assert(proof.status === 'playable_repair_proof_complete', 'wrong proof status');
  assert(proof.task_transformation.task_count === 3, 'proof must record three required task cards');
  assert(proof.task_transformation.playable_lab.target_task_economy_enforced === true, 'proof must enforce target-task economy');
  assert(proof.task_transformation.playable_lab.sequence_builders_removed_as_required_cards === true, 'proof must show support builders removed as required cards');
  assert(proof.task_transformation.playable_lab.prompt_not_in_source_pane === true, 'proof must show prompt not in source pane');
  assert(proof.task_transformation.playable_lab.right_pane_original_question_visible === true, 'proof must show original exam question in right task pane');
  assert(proof.task_transformation.playable_lab.conceptual_setup_choice_rendered === true, 'proof must show conceptual setup choice');
  assert(proof.task_transformation.playable_lab.select_all_numbers_task_removed === true, 'proof must show source-cell select-all task removed');
  assert(proof.task_transformation.playable_lab.targeted_unit_feedback_proven === true, 'proof must show unit-only targeted feedback');
  assert(proof.task_transformation.playable_lab.targeted_number_feedback_proven === true, 'proof must show number-wrong targeted feedback');
  assert(proof.task_transformation.playable_lab.progressive_support_proven === true, 'proof must show progressive support path');
  assert(proof.task_transformation.playable_lab.constrained_carry_forward_conclusion_rendered === true, 'proof must show constrained carry-forward conclusion');
  assert(proof.task_transformation.playable_lab.task3_carries_task2_value_when_complete === true, 'proof must show task 3 carries task 2 value after completion');
  assert(proof.task_transformation.playable_lab.task3_requires_task2_before_value === true, 'proof must show task 3 blocks carried value before task 2');
  assert(proof.task_transformation.playable_lab.source_pane_readability_pass === true, 'proof must show source-pane readability pass');
  assert(proof.task_transformation.playable_lab.duplicate_visible_labels_removed === true, 'proof must show duplicate Bron/Tabel labels removed');

  const expectedCases = new Map([
    ['desktop-initial', { width: 1280, theme: 'light', action: 'initial', renderedContextBlocks: 3 }],
    ['desktop-wrong-retry', { width: 1280, theme: 'light', action: 'wrong-calculation', renderedContextBlocks: 3 }],
    ['desktop-unit-feedback', { width: 1280, theme: 'light', action: 'unit-feedback', renderedContextBlocks: 3 }],
    ['desktop-support', { width: 1280, theme: 'light', action: 'support', renderedContextBlocks: 3 }],
    ['desktop-corrected', { width: 1280, theme: 'light', action: 'corrected', renderedContextBlocks: 3 }],
    ['desktop-completed', { width: 1280, theme: 'light', action: 'complete', renderedContextBlocks: 3 }],
    ['mobile-completed', { width: 390, theme: 'light', action: 'complete', renderedContextBlocks: 3 }],
    ['mobile-dark-completed', { width: 390, theme: 'dark', action: 'complete', renderedContextBlocks: 3 }],
  ]);
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 8, 'proof must include eight screenshots');
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
    assert(capture.proof.semanticValidationEnabled === true, `${capture.case} missing semantic validation`);
    assert(capture.proof.genericOptionLabelVisible === false, `${capture.case} renders generic controls`);
    assert(capture.proof.supportBoxCount >= 1, `${capture.case} missing collapsed support`);
    assert(capture.proof.supportCollapsedByDefault === true, `${capture.case} support is not collapsed`);
    assert(capture.proof.sourcePaneIndependentScroll === true, `${capture.case} source pane does not scroll independently`);
    assert(capture.proof.questionVisibleAfterSourceScroll === true, `${capture.case} prompt is not visible after source scroll`);
    const setupAffordance = capture.proof.familyAffordances.choice;
    assert(setupAffordance.choiceOptions === true, `${capture.case} missing conceptual setup choice`);
    assert(!capture.proof.familyAffordances.source_value_selection, `${capture.case} still renders source-value selection as task 1`);
    assert(capture.proof.familyAffordances.calculation_work_capture.calculationFields === true, `${capture.case} missing calculation fields`);
    assert(capture.proof.familyAffordances.calculation_work_capture.progressiveSupport === true, `${capture.case} missing progressive support surface`);
    const conclusionAffordance = capture.proof.familyAffordances.structured_short_response;
    assert(conclusionAffordance.structuredCarryForward === true, `${capture.case} missing carry-forward conclusion`);
    assert(conclusionAffordance.constrainedDirectionControl === true, `${capture.case} missing constrained direction control`);
    assert(conclusionAffordance.freeTextDirectionAbsent === true, `${capture.case} still has free-text direction input`);
    assert(capture.proof.rightPaneQuestionVisible === true, `${capture.case} missing right-pane original question`);
    assert(capture.proof.examQuestionTextVisibleInTaskPane === true, `${capture.case} missing actual exam question text in task pane`);
    assert(capture.proof.sourceRefsVisible === false, `${capture.case} shows long source refs`);
    assert(capture.proof.duplicateVisibleSourceLabels === false, `${capture.case} has duplicate visible Bron/Tabel labels`);
    assert(capture.proof.sourceTableVisibleAtTop === true, `${capture.case} source table is not visible at source-pane top`);
    if (capture.viewport.width >= 900) assert(capture.proof.sourcePaneComfortableInitial === true, `${capture.case} desktop source pane is not comfortable at initial layout`);
    if (capture.case === 'desktop-initial') {
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should start incomplete`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not be complete`);
      assert(conclusionAffordance.carryRequiresPreviousTask === true, `${capture.case} should require task 2 before carry-forward value`);
    } else if (capture.case === 'desktop-wrong-retry') {
      assert(capture.proof.wrongRetryCount > 0, `${capture.case} missing retry state`);
      assert(capture.proof.targetedNumberFeedbackVisible === true, `${capture.case} missing number-wrong feedback`);
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should reject wrong attempt`);
    } else if (capture.case === 'desktop-unit-feedback') {
      assert(capture.proof.targetedUnitFeedbackVisible === true, `${capture.case} missing unit-only feedback`);
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should not complete with wrong unit`);
    } else if (capture.case === 'desktop-support') {
      assert(capture.proof.progressiveSupportVisible === true, `${capture.case} missing visible support`);
      assert(capture.proof.supportComplete === true, `${capture.case} support path should be marked complete`);
      assert(capture.proof.familyAffordances.structured_short_response.carryRequiresPreviousTask === false, `${capture.case} support path should unlock carry-forward`);
    } else if (capture.case === 'desktop-corrected') {
      assert(capture.proof.completedTaskCount === 1, `${capture.case} should complete exactly one corrected card`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete the whole lab`);
    } else {
      assert(capture.proof.completedTaskCount === 3, `${capture.case} demo path did not complete all tasks`);
      assert(capture.proof.labCompleted === true, `${capture.case} demo path did not reach completion`);
      assert(conclusionAffordance.carriedValueReady === true, `${capture.case} should carry the calculated value`);
    }
    assert(capture.proof.visibleInternalIds === false, `${capture.case} exposes internal ids`);
    assert(capture.proof.derivedAnswerVisibleInContext === false, `${capture.case} exposes derived answer signal in context`);
    if (capture.action !== 'complete' && capture.action !== 'support') assert(capture.proof.derivedAnswerVisibleInTaskCards === false, `${capture.case} exposes derived answer before completion/support`);
    if (capture.action === 'complete' || capture.action === 'support') assert(capture.proof.derivedAnswerVisibleInTaskCards === true, `${capture.case} should show carried/support answer after completion or support`);
    assert(capture.proof.rawImageCount === 0, `${capture.case} contains raw images`);
    assert(capture.proof.overflowingCount === 0, `${capture.case} has non-table overflow`);
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

  console.log(`OK ${sprintId} actual exam target-task transformation`);
}

main();
