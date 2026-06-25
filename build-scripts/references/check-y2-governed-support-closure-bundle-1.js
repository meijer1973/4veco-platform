#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const data = require('./build-y2-governed-support-closure-bundle-1');

function fail(message) {
  console.error(`ERROR ${data.SPRINT}: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.join(ROOT, file);
}

function exists(file) {
  assert(fs.existsSync(rel(file)), `missing required file: ${file}`);
}

function read(file) {
  exists(file);
  return fs.readFileSync(rel(file), 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
    return {};
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function sameMembers(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((item) => actual.includes(item)) &&
    actual.every((item) => expected.includes(item))
  );
}

function assertSameMembers(actual, expected, label) {
  assert(sameMembers(actual, expected), `${label} must be [${expected.join(', ')}], got [${asArray(actual).join(', ')}]`);
}

function gitStatus(paths, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...paths], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
    return;
  }
  assert(!result.stdout.trim(), `${label} has forbidden changes:\n${result.stdout.trim()}`);
}

const REQUIRED_TRUE_AUTHORITY = [
  'protected_year2_support_overlay_created_for_review',
  'route_specific_runtime_support_closed_for_review',
  'route_specific_extension_support_closed_for_review',
  'answer_skill_equivalent_support_closed_for_review',
  'lesson_production_eligibility_overlay_ready_for_review',
  'cross_repo_lesson_production_input_ready_after_human_merge',
];

const REQUIRED_FALSE_AUTHORITY = [
  'active_v5_registry_mutated',
  'external_source_mutation_authorized',
  'live_mtu_registry_mutated',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'candidate_storage_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'generated_lesson_output_authorized',
  'product_route_adoption_authorized',
  'product_authority',
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
  'autonomous_merge_authorized',
];

function assertAuthority(claims, label) {
  assert(claims && typeof claims === 'object', `${label} authority claims missing`);
  for (const key of REQUIRED_TRUE_AUTHORITY) {
    assert(claims[key] === true, `${label}.${key} must be true`);
  }
  for (const key of REQUIRED_FALSE_AUTHORITY) {
    assert(claims[key] === false, `${label}.${key} must be false`);
  }
}

function validateRuntimeEvaluation(fixturesJson) {
  const taskSet = fixturesJson.task_set;
  assert(TaskShellEngine.validateTaskSet(taskSet) === true, 'rendered proof task set must validate');
  const taskById = new Map(taskSet.tasks.map((task) => [task.id, task]));
  for (const fixture of asArray(fixturesJson.runtime_fixtures).concat(asArray(fixturesJson.extension_fixtures))) {
    const task = taskById.get(fixture.fixture_id);
    assert(task, `${fixture.fixture_id} missing from task set`);
    const positive = TaskShellEngine.evaluateTask(task, fixture.passing_response);
    assert(positive.matched === true, `${fixture.fixture_id} passing response must match`);
    for (const [name, response] of Object.entries(fixture.negative_responses || {})) {
      const result = TaskShellEngine.evaluateTask(task, response);
      assert(result.matched === false, `${fixture.fixture_id}.${name} negative response must fail`);
    }
  }
}

function validateSemanticChecks(fixturesJson) {
  const byCase = new Map(asArray(fixturesJson.runtime_fixtures).map((fixture) => [fixture.case_id, fixture]));
  const d1 = byCase.get('Y2-B6-P12:OP-D1').semantic_checks;
  assert((d1.formula === 'Q = (2150 - P) / 0.125'), 'OP-D1 formula mismatch');
  assert((2150 - d1.max_rent_eur) / 0.125 === d1.demand_at_max_rent, 'OP-D1 demand semantic check mismatch');
  assert(d1.demand_at_max_rent - d1.housing_stock === d1.waiting_list, 'OP-D1 waiting-list semantic check mismatch');

  const c1 = byCase.get('Y2-B6-P12:OP-C1').semantic_checks;
  assert(c1.q * c1.p === c1.total_revenue_eur, 'OP-C1 revenue semantic check mismatch');

  const c2 = byCase.get('Y2-B6-P12:OP-C2').semantic_checks;
  assert(c2.marginal_revenue === 'MO = -0.25Q + 2150', 'OP-C2 marginal revenue formula mismatch');
  assert(2150 / 0.25 === c2.chosen_output, 'OP-C2 chosen output semantic check mismatch');
  assert(c2.rejected_capacity_only_choice === 6800, 'OP-C2 capacity-only guard mismatch');
}

function normalizeText(value) {
  return String(value == null ? '' : value).toLowerCase();
}

function textPassesStructure(text, structure) {
  const normalized = normalizeText(text);
  if ((structure.rejectText || []).some((item) => normalized.includes(normalizeText(item)))) return false;
  return (structure.requiredTextGroups || []).every((group) => {
    return group.some((needle) => normalized.includes(normalizeText(needle)));
  });
}

function validateAnswerSkills(answerSkillJson) {
  assert(answerSkillJson.status === 'answer_skill_equivalent_support_ready_for_human_review_no_registry_mutation', 'answer skill status mismatch');
  assertAuthority(answerSkillJson.authority_claims, 'answer skills');
  const records = asArray(answerSkillJson.records);
  assert(records.length === 4, 'expected four minimal answer-skill support records');
  const requiredAnswerCases = Object.entries(data.priorDispositionByCase)
    .filter(([, outcome]) => outcome === 'new_answer_skill_record_required')
    .map(([caseId]) => caseId);
  const closed = records.flatMap((record) => record.closes_answer_skill_dispositions || []);
  assertSameMembers(closed, requiredAnswerCases, 'answer-skill disposition closure set');
  for (const record of records) {
    assert(record.registry_mutation_authorized === false, `${record.answer_skill_id} must not authorize registry mutation`);
    assert(record.generator_exposure_authorized === false, `${record.answer_skill_id} must not authorize generator exposure`);
    assert(record.student_use_authorized === false, `${record.answer_skill_id} must not authorize student use`);
    assert(asArray(record.point_logic).length >= 3, `${record.answer_skill_id} point logic incomplete`);
    assert(asArray(record.negative_guards).length >= 3, `${record.answer_skill_id} negative guards incomplete`);
  }
  const testById = new Map(asArray(answerSkillJson.tests).map((test) => [test.answer_skill_id, test]));
  for (const record of records) {
    const test = testById.get(record.answer_skill_id);
    assert(test, `${record.answer_skill_id} missing answer-skill test`);
    assert(textPassesStructure(test.passing, record.accepted_answer_structure), `${record.answer_skill_id} positive answer-structure test must pass`);
    for (const negative of asArray(test.negatives)) {
      assert(!textPassesStructure(negative, record.accepted_answer_structure), `${record.answer_skill_id} negative answer-structure test must fail: ${negative}`);
    }
  }
}

function validateClosure(closure, priorDisposition) {
  assert(closure.sprint_id === data.SPRINT, 'closure sprint mismatch');
  assert(closure.status === 'support_closure_ready_for_human_review_not_active_until_merge', 'closure status mismatch');
  assertAuthority(closure.authority_claims, 'closure');
  assert(closure.summary.prior_blockers_closed === 18, 'closure must close 18 prior blockers');
  assert(closure.summary.runtime_cases_closed === 4, 'closure must close four runtime cases');
  assert(closure.summary.extension_cases_closed === 7, 'closure must close seven extension cases');
  assert(closure.summary.answer_skill_dispositions_closed === 7, 'closure must close seven answer-skill dispositions');
  assert(closure.summary.prior_sufficient_cases_confirmed === 1, 'closure must confirm one sufficient prior support case');
  assert(closure.summary.broad_operation_rows_closed === 0, 'closure must not close broad operation rows');
  assert(closure.summary.generated_lesson_outputs === 0, 'closure must not generate lessons');

  const expectedCases = Object.keys(data.priorDispositionByCase).concat(['Y2-B7-P13:OP-M1']);
  assertSameMembers(asArray(closure.cases).map((item) => item.case_id), expectedCases, 'closure cases');
  for (const item of closure.cases) {
    assert(item.blocks && item.does_not_block && item.proof_required_to_close, `${item.case_id} missing REV-STD-1 carried fields`);
    if (data.priorDispositionByCase[item.case_id]) {
      assert(item.prior_disposition === data.priorDispositionByCase[item.case_id], `${item.case_id} prior disposition mismatch`);
    }
  }

  assert(priorDisposition.status === 'all_19_op_rows_have_exact_disposition_no_runtime_mutation', 'prior disposition status mismatch');
  const priorCases = priorDisposition.records.flatMap((record) => record.disposition_cases || []);
  assert(priorCases.length === 19, 'prior disposition must still carry 19 OP rows');
}

function validateOverlay(overlay, closure, candidates, priorReadiness) {
  assert(overlay.overlay_id === `${data.SPRINT}-lesson-production-eligibility-overlay`, 'overlay id mismatch');
  assert(overlay.status === 'ready_for_human_review_not_active_until_merge', 'overlay status mismatch');
  assertAuthority(overlay.authority_claims, 'overlay');
  assert(asArray(overlay.records).length === 4, 'overlay must include four records');
  const candidateIds = new Set(asArray(candidates.records).map((record) => record.id));
  const priorIds = new Set(asArray(priorReadiness.records).map((record) => record.record_id));
  for (const record of overlay.records) {
    assert(candidateIds.has(record.record_id), `${record.record_id} candidate record missing`);
    assert(priorIds.has(record.record_id), `${record.record_id} prior readiness record missing`);
    assert(record.candidate_record_present === true, `${record.record_id} candidate presence flag mismatch`);
    assert(record.production_readiness_record_present === true, `${record.record_id} readiness presence flag mismatch`);
    assert(record.generator_status_before_human_merge === 'blocked_pending_support_closure_merge', `${record.record_id} pre-merge generator status mismatch`);
    assert(record.generator_status_after_human_merge === 'eligible_as_cross_repo_lesson_production_input_only', `${record.record_id} post-merge generator status mismatch`);
    assert(asArray(record.unresolved_platform_support_blockers_after_human_merge).length === 0, `${record.record_id} unresolved blockers must be empty`);
    assert(record.product_route_adoption_authorized === false, `${record.record_id} product route must remain false`);
    assert(record.generated_lesson_output_authorized_by_this_pr === false, `${record.record_id} lesson output must remain false`);
    assert(record.student_product_use_authorized === false, `${record.record_id} student use must remain false`);
  }
  const closureCaseIds = new Set(closure.cases.map((item) => item.case_id));
  for (const record of overlay.records) {
    for (const caseId of record.completed_support_case_ids_after_human_merge) {
      assert(closureCaseIds.has(caseId), `${record.record_id} overlay references unknown closure case ${caseId}`);
    }
  }
}

function validateHandoffs(handoffs, overlay) {
  assert(handoffs.sprint_id === data.SPRINT, 'handoff sprint mismatch');
  assert(handoffs.status === 'generator_handoff_support_closure_ready_for_human_review_no_lesson_output', 'handoff status mismatch');
  assertAuthority(handoffs.authority_claims, 'handoffs');
  assert(asArray(handoffs.records).length === 4, 'handoffs must include four records');
  const overlayByRecord = new Map(overlay.records.map((record) => [record.record_id, record]));
  for (const record of handoffs.records) {
    assert(record.support_closure_status_after_human_merge === 'platform_support_blockers_closed_for_cross_repo_lesson_production_input', `${record.record_id} support closure status mismatch`);
    assert(record.eligibility_overlay.path === data.paths.overlay, `${record.record_id} overlay path mismatch`);
    assert(record.eligibility_overlay.generator_status_after_human_merge === overlayByRecord.get(record.record_id).generator_status_after_human_merge, `${record.record_id} overlay generator status mismatch`);
    assert(asArray(record.remaining_blockers).length === data.carriedIssues().length, `${record.record_id} carried issue count mismatch`);
    assert(record.authority_boundary.includes('no_lesson_generation'), `${record.record_id} must preserve no lesson generation boundary`);
  }
}

function validateRenderedProof(rendered, fixturesJson) {
  assert(rendered.includes(`data-y2-governed-support-closure-proof="${data.SPRINT}"`), 'rendered proof marker missing');
  assert(rendered.includes('Review-only rendered support proof'), 'rendered proof boundary missing');
  assert(rendered.includes('data-task-shell="GAME-UX-3A"'), 'rendered proof shell missing');
  assert(!/student\/product use are authorized/i.test(rendered.replace('no student/product use are authorized', '')), 'rendered proof must not authorize student/product use');
  for (const fixture of asArray(fixturesJson.runtime_fixtures).concat(asArray(fixturesJson.extension_fixtures))) {
    assert(rendered.includes(`data-task="${fixture.fixture_id}"`), `rendered proof missing task ${fixture.fixture_id}`);
  }
  for (const family of ['calculation_answer_form_capture', 'source_chain_builder', 'source_value_selection', 'step_ordering', 'assertion_reason']) {
    assert(rendered.includes(`data-task-family="${family}"`), `rendered proof missing family ${family}`);
  }
}

function validatePacket(packet, packetMd) {
  assert(packet.packet_id === data.SPRINT, 'packet id mismatch');
  assert(packet.review_autonomy.level === 'L4', 'packet review level mismatch');
  assert(packet.decision.route === 'READY_FOR_HUMAN_REVIEW', 'packet route mismatch');
  assert(packet.human_decision_required === true, 'packet must require human decision');
  assert(packet.auto_merge_allowed_after_ci === false, 'packet must forbid auto merge');
  assertAuthority(packet.authority_claims, 'packet');
  for (const changedPath of data.changedPaths) {
    assert(packet.changed_paths.includes(changedPath), `packet changed_paths missing ${changedPath}`);
    exists(changedPath);
  }
  for (const item of packet.core_requirement_checklist) {
    assert(['met', 'pending_remote_pr'].includes(item.status), `invalid checklist status ${item.status}`);
  }
  const pending = packet.core_requirement_checklist.filter((item) => item.status === 'pending_remote_pr');
  assert(pending.length === 1 && pending[0].requirement === 'Current-head PR proof', 'only current-head PR proof may be pending');
  assert(packet.proof.branch_protection.includes('ok: true'), 'packet proof must require branch protection ok:true');
  const pilot = packet.single_account_pr_governance_pilot.pilot_data_record;
  assert(pilot.router_route_vs_retrospective_human_judgment.router_route === 'READY_FOR_HUMAN_REVIEW', 'pilot router route mismatch');
  assert(pilot.lead_review_sufficient, 'pilot lead review sufficiency missing');
  assert(Array.isArray(pilot.stale_head_or_incomplete_evidence_failures), 'pilot stale-head failures must be array');
  for (const needle of [
    'Product End-State And Original Specs',
    'Non-Negotiable Requirements',
    'Core-Requirement Checklist',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'Pilot Data Record',
    'ok: true',
  ]) {
    assert(packetMd.includes(needle), `review packet markdown missing ${needle}`);
  }
}

function validateMarkdownFiles() {
  const closureMd = read(data.paths.closureMd);
  const handoffMd = read(data.paths.handoffMd);
  const planMd = read(data.paths.planMd);
  const resultMd = read(data.paths.resultMd);
  for (const needle of ['Product End-State And Original Specs', 'Non-Negotiable Requirements', 'Core-Requirement Checklist', 'Carried Issues']) {
    assert(closureMd.includes(needle), `closure markdown missing ${needle}`);
  }
  assert(handoffMd.includes('Generator Handoff Manifests'), 'handoff markdown title missing');
  assert(handoffMd.includes('Remaining blockers'), 'handoff markdown blockers missing');
  assert(planMd.includes('READY_FOR_HUMAN_REVIEW'), 'plan markdown route missing');
  assert(resultMd.includes('Authority Boundary'), 'result markdown authority boundary missing');
}

function validatePackageScript() {
  const pkg = readJson('package.json');
  assert(
    pkg.scripts && pkg.scripts['check:y2-governed-support-closure-bundle-1'] === 'node build-scripts/references/check-y2-governed-support-closure-bundle-1.js',
    'package.json missing check:y2-governed-support-closure-bundle-1 script'
  );
}

function validateForbiddenDiffs() {
  gitStatus(['references/machine', 'references/external'], 'external and machine references');
  gitStatus(['references/authored/course-target-exercises.json'], 'active target-exercise registry');
  gitStatus(['references/data/exam-ingestion/answer-skill-candidates.json'], 'answer-skill candidate storage');
  gitStatus(['source-data'], 'generated lesson source data');
  gitStatus(['engines/skilltree/base-elements.js', 'engines/skilltree/generators.js'], 'skilltree route/generator exposure');
}

function main() {
  Object.values(data.paths).forEach((file) => exists(file));

  const closure = readJson(data.paths.closureJson);
  const fixturesJson = readJson(data.paths.fixturesJson);
  const answerSkillJson = readJson(data.paths.answerSkillJson);
  const overlay = readJson(data.paths.overlay);
  const handoffs = readJson(data.paths.handoffJson);
  const packet = readJson(data.paths.reviewPacketJson);
  const priorDisposition = readJson(data.paths.priorDisposition);
  const candidates = readJson(data.paths.candidates);
  const priorReadiness = readJson(data.paths.priorReadiness);
  const rendered = read(data.paths.renderedHtml);
  const packetMd = read(data.paths.reviewPacketMd);

  validateClosure(closure, priorDisposition);
  validateRuntimeEvaluation(fixturesJson);
  validateSemanticChecks(fixturesJson);
  validateAnswerSkills(answerSkillJson);
  validateOverlay(overlay, closure, candidates, priorReadiness);
  validateHandoffs(handoffs, overlay);
  validateRenderedProof(rendered, fixturesJson);
  validatePacket(packet, packetMd);
  validateMarkdownFiles();
  validatePackageScript();
  validateForbiddenDiffs();

  if (!process.exitCode) {
    console.log(`OK ${data.SPRINT}: governed support closure bundle validated`);
  }
}

if (require.main === module) main();
