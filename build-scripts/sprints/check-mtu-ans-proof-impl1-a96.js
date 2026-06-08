#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require('../../engines/task-shell-engine');
const data = require('./mtu-ans-proof-impl1-a96-data');
const elements = require('../../engines/skilltree/base-elements');
const generators = require('../../engines/skilltree/generators');

const proofPath = path.join(ROOT, 'reports', 'json', 'mtu-ans-proof-impl1-a96-proof.json');
const labPath = path.join(ROOT, 'reports', 'sprints', `${data.sprintId}-rendered-lab.html`);
const screenshotManifestPath = path.join(ROOT, 'reports', 'sprints', `${data.sprintId}-screenshot-manifest.md`);
const screenshotManifestJsonPath = path.join(ROOT, 'reports', 'sprints', `${data.sprintId}-screenshots`, 'manifest.json');
const blockFilePath = path.join(ROOT, 'references', 'data', 'sprints', 'RX.6-generator-blocked-units.json');
const readinessPath = path.join(ROOT, 'reports', 'json', 'skilltree-generator-readiness.json');

function fail(message) {
  console.error(`${data.sprintId} check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file).replace(/\\/g, '/')}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${path.relative(ROOT, file).replace(/\\/g, '/')}: ${error.message}`);
  }
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function gitStatus(paths, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...paths], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  assert(!result.stdout.trim(), `${label} has forbidden changes:\n${result.stdout.trim()}`);
}

function ids(rows) {
  return (rows || []).map((row) => row.id || row.unit_id).filter(Boolean);
}

function evaluateCases() {
  const matched = TaskShellEngine.evaluateTask(data.strictA96Task, data.passingResponse);
  assert(matched.matched === true, 'complete A96 response must pass');
  const outcomes = { passing: true };
  for (const [name, response] of Object.entries(data.negativeResponses)) {
    const result = TaskShellEngine.evaluateTask(data.strictA96Task, response);
    outcomes[name] = result.matched === true;
    assert(result.matched === false, `${name} negative response must fail`);
  }
  for (const [name, fixture] of Object.entries(data.invalidTaskFixtures || {})) {
    let rejected = false;
    let message = '';
    try {
      TaskShellEngine.validateTask(fixture);
    } catch (error) {
      rejected = true;
      message = error.message;
    }
    assert(rejected === true, `${name} invalid task fixture must be rejected`);
    assert(/visually identical answer tokens/.test(message), `${name} must be rejected by answer-token visual identity policy`);
  }
  return outcomes;
}

function checkTaskContract() {
  assert(TaskShellEngine.validateTaskSet(data.taskSet) === true, 'A96 proof task set must validate');
  assert(data.strictA96Task.family === 'calculation_answer_form_capture', 'A96 proof must use structured answer-form capture family');
  assert(data.strictA96Task.prompt === data.sourceTask.prompt, 'proof prompt must match reviewed 1.1.2 source task');
  assert(data.reviewedRoute.source_task_id === data.sourceTaskId, 'reviewed route source task mismatch');
  assert(data.reviewedRoute.adoption_authorized === false, 'route adoption must remain false');
  assert(data.reviewedRoute.target_equivalent_claim === false, 'target-equivalent claim must remain false');
  assert(data.reviewedRoute.product_route_adoption === false, 'product route adoption must remain false');

  const proofMeta = data.strictA96Task.expected.answerFormProof;
  assert(proofMeta.unit_id === 'A96', 'proof task must be for A96');
  assert(proofMeta.route_specific === true, 'proof task must be route-specific');
  assert(Array.isArray(proofMeta.modifier_units) && proofMeta.modifier_units.length === 0, 'A96 proof must not depend on standalone modifiers');
  assert(proofMeta.standalone_modifier_pass_allowed === false, 'standalone modifier pass must be false');
  assert(
    JSON.stringify(proofMeta.required_action_parts) === JSON.stringify(data.requiredActionParts),
    'required action parts must match proof metadata'
  );
  for (const part of [
    'formula_or_calculation_method',
    'labelled_substitution',
    'intermediate_work',
    'final_answer',
    'unit_or_notation',
    'short_contextual_conclusion'
  ]) {
    assert(data.requiredActionParts.includes(part), `missing required A96 action part: ${part}`);
  }
  const formula = data.strictA96Task.interaction.formula;
  const oldPriceTokens = formula.tokens.filter((token) => token.label === 'oude prijs' && token.kind === 'answer');
  assert(oldPriceTokens.length === 1, 'old price must be one reusable visible answer token');
  assert(oldPriceTokens[0].id === 'oldPrice' && oldPriceTokens[0].maxUses === 2, 'old price answer token must be reusable exactly twice');
  assert(JSON.stringify(formula.tokens.map((token) => token.id)) !== JSON.stringify(data.strictA96Task.expected.methodTokens), 'token bank display order must not equal answer method order');
  assert(data.strictA96Task.interaction.substitution.fields.length === 3, 'A96 proof must expose three labelled substitution fields');
  for (const requiredNegative of [
    'finalAnswerOnly',
    'sourceOnly',
    'directionFree',
    'exampleOnly',
    'notationOmitted',
    'standaloneA81',
    'wrongDenominator',
    'missingSubstitutionField',
    'leftToRightTokenClickOrder'
  ]) {
    assert(Object.prototype.hasOwnProperty.call(data.negativeResponses, requiredNegative), `missing negative proof case: ${requiredNegative}`);
  }
}

function checkSkilltreeBoundaries() {
  const generatorMap = generators.GEN || generators;
  assert(!generatorMap.A96 && !generatorMap.GEN_A96, 'GEN_A96 must not be implemented');

  assert(!ids(elements.SKILLS).includes('A96'), 'A96 must not be an interactive SKILLS row');
  assert(!ids(elements.ROUTE_SKILLS).includes('A96'), 'A96 must not be a generic ROUTE_SKILLS row');
  assert(ids(elements.GENERATOR_BLOCKED_SKILLS).includes('A96'), 'A96 must remain generator-blocked');
  assert(ids(elements.GENERATOR_BLOCKED_SKILLS).includes('A81'), 'A81 must remain generator-blocked');
  assert(ids(elements.GENERATOR_BLOCKED_SKILLS).includes('A99'), 'A99 must remain generator-blocked');

  const blockFile = readJson(blockFilePath);
  for (const unitId of ['A96', 'A81', 'A99']) {
    assert((blockFile.generator_blocked_units || []).includes(unitId), `${unitId} must be listed in RX.6 block file`);
  }
  assert(blockFile.student_facing_route_use_allowed === false, 'blocked-unit route use must remain false');
  assert(blockFile.product_authority_authorized === false, 'blocked-unit product authority must remain false');

  const readiness = readJson(readinessPath);
  const rows = readiness.rows || [];
  const a96 = rows.find((row) => row.unit_id === 'A96');
  const a81 = rows.find((row) => row.unit_id === 'A81');
  const a99 = rows.find((row) => row.unit_id === 'A99');
  for (const row of [a96, a81, a99]) {
    assert(row, 'readiness rows must include A96, A81, and A99');
    assert(row.generator_blocked === true, `${row.unit_id} must remain generator-blocked`);
    assert(row.base_route_export === 'not_exported', `${row.unit_id} must not be route exported`);
    assert(row.student_facing_route_use_allowed === false, `${row.unit_id} route use must remain false`);
  }
}

function checkRenderedProof(expectedCases) {
  const lab = read(labPath);
  assert(lab.includes('data-a96-proof-lab'), 'rendered lab must include proof marker');
  assert(lab.includes('data-action="run-final-answer-only"'), 'rendered lab must expose retry action control');
  assert(lab.includes('data-action="complete-proof"'), 'rendered lab must expose completion control');
  assert(lab.includes('no GEN_A96'), 'rendered lab must state GEN_A96 boundary');
  assert(lab.includes('data-task-family="calculation_answer_form_capture"'), 'rendered lab must render structured answer-form family');
  assert(lab.includes('data-answer-form-task="a96-112-prijsstijging-procent"'), 'rendered lab must include answer-form task marker');
  assert(lab.includes('data-formula-max-uses="2"'), 'rendered lab must expose reusable old-price token cap');
  assert(lab.includes('data-field-id="oldPriceDenominator"'), 'rendered lab must expose denominator substitution field');
  assert(!lab.includes('data-input-role="work"'), 'rendered lab must not use old single work textarea proof');

  const manifestMd = read(screenshotManifestPath);
  assert(manifestMd.includes('desktop-initial'), 'screenshot manifest missing desktop initial case');
  assert(manifestMd.includes('mobile-dark-completed'), 'screenshot manifest missing mobile dark case');
  assert(manifestMd.includes('not generated lesson output'), 'screenshot manifest must preserve generated-output boundary');

  const manifest = readJson(screenshotManifestJsonPath);
  assert(manifest.sprint_id === data.sprintId, 'screenshot manifest JSON sprint mismatch');
  const cases = new Map((manifest.cases || []).map((item) => [item.case, item]));
  for (const caseName of expectedCases) {
    const item = cases.get(caseName);
    assert(item, `missing screenshot case: ${caseName}`);
    const file = path.join(ROOT, item.file);
    assert(fs.existsSync(file), `missing screenshot file: ${item.file}`);
    assert(item.screenshot_dimensions && item.screenshot_dimensions.width > 0, `${caseName} missing screenshot dimensions`);
    assert(item.proof && item.proof.taskFamily === 'calculation_answer_form_capture', `${caseName} must render calculation_answer_form_capture`);
    assert(item.proof.workFieldCount === 0, `${caseName} must not render old work textarea`);
    assert(item.proof.answerFormStepCount === 4, `${caseName} must render all answer-form steps`);
    assert(item.proof.formulaTokenButtonCount >= 10, `${caseName} must render formula token bank`);
    assert(item.proof.formulaOldPriceMaxUses === '2', `${caseName} must render old-price max-use proof`);
    assert(item.proof.substitutionFieldCount === 3, `${caseName} must render labelled substitution fields`);
    assert(item.proof.unitNotationFieldCount === 1, `${caseName} must render required notation field`);
    assert(item.proof.finalAnswerFieldCount === 1, `${caseName} must render final answer field`);
    assert(item.proof.conclusionFieldCount === 1, `${caseName} must render conclusion field`);
    assert(item.proof.criteriaVisibleBeforeCheck === false, `${caseName} must hide pre-check criteria`);
    assert(item.proof.overflowingCount === 0, `${caseName} must not have overflowing rendered text`);
  }
  assert(cases.get('desktop-initial').proof.state === 'initial', 'desktop initial state mismatch');
  assert(cases.get('desktop-retry-feedback').proof.state === 'retry-feedback', 'desktop retry state mismatch');
  assert(cases.get('desktop-retry-feedback').proof.feedbackState === 'retry', 'desktop retry feedback missing');
  assert(cases.get('desktop-retry-feedback').proof.answerFormFeedbackVisible === true, 'desktop retry must show answer-form feedback');
  assert(cases.get('desktop-next-action').proof.state === 'next-action', 'desktop next-action state mismatch');
  assert(cases.get('desktop-next-action').proof.methodSequenceItemCount === data.strictA96Task.expected.methodTokens.length, 'desktop next-action must show complete method sequence');
  assert(cases.get('desktop-next-action').proof.nextActionVisible === true, 'next action must be visible');
  assert(cases.get('desktop-completed').proof.state === 'completed', 'desktop completed state mismatch');
  assert(cases.get('desktop-completed').proof.completedVisible === true, 'completed panel must be visible');
  assert(cases.get('mobile-completed').viewport.width === 390, 'mobile completed viewport must be narrow');
  assert(cases.get('mobile-dark-completed').theme === 'dark', 'mobile dark screenshot must use dark theme');
}

function checkProofJson(caseOutcomes) {
  const proof = readJson(proofPath);
  assert(proof.sprint_id === data.sprintId, 'proof JSON sprint mismatch');
  assert(proof.answer_form_unit === 'A96', 'proof JSON must identify A96');
  assert(proof.answer_form_task_family === 'calculation_answer_form_capture', 'proof JSON must record structured answer-form family');
  assert(proof.source_task.prompt_matches_reviewed_source === true, 'proof JSON must record source prompt match');
  assert(JSON.stringify(proof.required_action_parts) === JSON.stringify(data.requiredActionParts), 'proof JSON action parts mismatch');
  assert(proof.structured_answer_form_surface.formula_token_count >= 10, 'proof JSON must record formula token bank');
  assert(proof.structured_answer_form_surface.old_price_token_max_uses === 2, 'proof JSON must record reusable old-price token');
  assert(JSON.stringify(proof.structured_answer_form_surface.substitution_field_ids) === JSON.stringify(['newPrice', 'oldPriceNumerator', 'oldPriceDenominator']), 'proof JSON substitution fields mismatch');
  assert(proof.checker_cases.passing === true, 'proof JSON must record passing case');
  for (const name of Object.keys(data.negativeResponses)) {
    assert(proof.checker_cases[name] === false, `proof JSON must record ${name} rejection`);
    assert(caseOutcomes[name] === false, `${name} runtime rejection mismatch`);
  }
  for (const name of Object.keys(data.invalidTaskFixtures || {})) {
    assert(proof.invalid_task_fixtures[name] && proof.invalid_task_fixtures[name].rejected === true, `proof JSON must record invalid fixture rejection: ${name}`);
  }
  assert(proof.non_regression.a96_generic_route_exposure === false, 'proof JSON must block A96 route exposure');
  assert(proof.non_regression.gen_a96_implemented === false, 'proof JSON must block GEN_A96');
  assert(proof.non_regression.a81_standalone_pass_allowed === false, 'proof JSON must keep A81 modifier-only');
  assert(proof.non_regression.a99_unblocked === false, 'proof JSON must keep A99 blocked');
  for (const key of [
    'generated_lesson_output_changed',
    'protected_reference_data_changed',
    'source_data_changed',
    'product_route_adoption',
    'target_equivalent_claim',
    'diagnostics',
    'mastery',
    'sequencing',
    'pv_projection',
    'scale_gate_1',
    'student_product_use'
  ]) {
    assert(proof.product_boundaries[key] === false, `proof JSON boundary ${key} must remain false`);
  }
}

function checkForbiddenDiffs() {
  gitStatus(['references/machine', 'references/external'], 'protected reference data');
  gitStatus(['references/authored/course-target-exercises.json'], 'target-exercise registry');
  gitStatus(['source-data/book-1/exit-ticket'], 'exit-ticket source data');
  gitStatus(['engines/skilltree/base-elements.js', 'engines/skilltree/generators.js'], 'skilltree generic route/generator files');
}

function main() {
  checkTaskContract();
  const outcomes = evaluateCases();
  checkSkilltreeBoundaries();
  checkRenderedProof([
    'desktop-initial',
    'desktop-retry-feedback',
    'desktop-next-action',
    'desktop-completed',
    'mobile-completed',
    'mobile-dark-completed'
  ]);
  checkProofJson(outcomes);
  checkForbiddenDiffs();
  console.log('OK MTU-ANS-PROOF-IMPL-1 A96 proof');
}

main();
