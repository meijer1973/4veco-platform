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
  assert(deepEqual(families, ['source_value_selection', 'calculation_work_capture', 'structured_short_response']), 'actual exam families must be source values -> calculation -> conclusion');
  for (const forbiddenFamily of ['formula_builder', 'step_ordering', 'source_chain_builder']) {
    assert(!families.includes(forbiddenFamily), `${forbiddenFamily} must not be a required exam card`);
  }
  for (const task of transform.taskSet.tasks) {
    assert(Array.isArray(task.contextRefs) && task.contextRefs.length === 4, `${task.id} must reference all context blocks`);
  }

  const sourceValues = taskById(transform.taskSet, 'q3-source-values');
  const calculation = taskById(transform.taskSet, 'q3-calculation');
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

  expectMatch(calculation, {
    work: '12 x 108,25 = 1299; 1299 + 385 = 1684; 12 x 86,25 = 1035; 1684 - 1035 = 649',
    finalAnswer: '649',
    unitNotation: 'euro per jaar',
  }, 'calculation correct response');
  expectReject(calculation, { work: '', finalAnswer: '649', unitNotation: 'euro per jaar' }, 'final-answer-only calculation');
  expectReject(calculation, { work: 'ik kies de laagste premie', finalAnswer: '649', unitNotation: 'euro per jaar' }, 'bogus calculation work');

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
  for (const op of ['select_source_values', 'calculate_threshold_with_visible_work', 'state_threshold_with_direction']) {
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
  assert(transform.antiReductionChecks.target_task_economy_enforced === true, 'target task economy must be enforced');
  assert(transform.antiReductionChecks.final_answer_field_alone_rejected === true, 'final-answer-only reduction must be rejected');

  for (const doc of [paths.operationTrace, paths.answerTrace, paths.familyMap, paths.reviewerNotes]) {
    const text = readText(doc);
    assert(text.includes(sprintId), `${rel(doc)} missing sprint id`);
  }
  assert(readText(paths.familyMap).includes('source_value_selection -> calculation_work_capture -> structured_short_response'), 'task-family map must show target-first three-card sequence');
  assert(readText(paths.reviewerNotes).includes('target-task economy'), 'reviewer notes must cite target-task economy');

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
  assert(labHtml.includes('source_value_selection'), 'lab HTML must render source value controls');
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

  const expectedCases = new Map([
    ['desktop-initial', { width: 1280, theme: 'light', action: 'initial', renderedContextBlocks: 3 }],
    ['desktop-wrong-retry', { width: 1280, theme: 'light', action: 'wrong', renderedContextBlocks: 3 }],
    ['desktop-corrected', { width: 1280, theme: 'light', action: 'corrected', renderedContextBlocks: 3 }],
    ['desktop-completed', { width: 1280, theme: 'light', action: 'complete', renderedContextBlocks: 3 }],
    ['mobile-completed', { width: 390, theme: 'light', action: 'complete', renderedContextBlocks: 3 }],
    ['mobile-dark-completed', { width: 390, theme: 'dark', action: 'complete', renderedContextBlocks: 3 }],
  ]);
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 6, 'proof must include six screenshots');
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
    assert(capture.proof.familyAffordances.source_value_selection.valueBank === true, `${capture.case} missing source value bank`);
    assert(capture.proof.familyAffordances.calculation_work_capture.calculationFields === true, `${capture.case} missing calculation fields`);
    assert(capture.proof.familyAffordances.structured_short_response.structuredFields === true, `${capture.case} missing structured fields`);
    if (capture.case === 'desktop-initial') {
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should start incomplete`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not be complete`);
    } else if (capture.case === 'desktop-wrong-retry') {
      assert(capture.proof.wrongRetryCount > 0, `${capture.case} missing retry state`);
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should reject wrong attempt`);
    } else if (capture.case === 'desktop-corrected') {
      assert(capture.proof.completedTaskCount === 1, `${capture.case} should complete exactly one corrected card`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete the whole lab`);
    } else {
      assert(capture.proof.completedTaskCount === 3, `${capture.case} demo path did not complete all tasks`);
      assert(capture.proof.labCompleted === true, `${capture.case} demo path did not reach completion`);
    }
    assert(capture.proof.visibleInternalIds === false, `${capture.case} exposes internal ids`);
    assert(capture.proof.derivedAnswerVisibleInContext === false, `${capture.case} exposes derived answer signal in context`);
    assert(capture.proof.derivedAnswerVisibleInTaskCards === false, `${capture.case} exposes derived answer signal in task cards`);
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
