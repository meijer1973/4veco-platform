#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPRINT = 'Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1';
const WAVE = 'Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1';
const SCHEMA_SURFACE = 'year2_v6_target_family_candidate_surface_v1';
const STORAGE_SURFACE = 'references/authored/year2-v6-target-foundation-candidates.json';
const RECORD_STATUS = 'candidate_for_governed_year2_v6_target_foundation';
const RECORD_AUTHORITY = 'proposal_only_no_registry_write_no_mtu_no_lesson_no_product_use';
const SURFACE_AUTHORITY = 'candidate_surface_only_no_active_v5_registry_mutation_no_mtu_no_lesson_no_product_use';

const PACKAGE_FILES = [
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book5-pension-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book6-housing-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book8-strategic-target-package.md',
];

const REQUIRED_PATHS = [
  'build-scripts/references/check-y2-target-registry-and-task-foundation-implementation-1.js',
  'references/authored/year2-v6-target-foundation-candidates.json',
  'references/data/year2-target-foundation/answer-contracts.json',
  'references/data/year2-target-foundation/source-reconstruction-foundation.json',
  'references/schemas/year2-v6-target-foundation-candidates.schema.json',
  'reports/reference-planning/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-mtu-task-family-review.json',
  'reports/reference-planning/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-mtu-task-family-review.md',
  'reports/reference-planning/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-review-packet.md',
  'reports/review-gates/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1/review-packet.json',
  'reports/sprints/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-plan.md',
  'reports/sprints/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-result.md',
];

const EXPECTED = [
  {
    id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    book: 5,
    chapter: 5,
    paragraph: 13,
    owner: 'Y2-B5-P13',
    opRows: ['OP-T1', 'OP-H1', 'OP-ANS2', 'OP-ANS3'],
    forbiddenOps: ['OP-F1'],
    official: 'vw-1022-a-25-2-o:q7-q11',
    subquestions: 5,
    sourceNeedles: ['figuur-1-pensioenmodel-2024-2044', 'annual inflation = 2%', 'annual real economic growth = 0.5%', 'annual pension-asset return = 3.5%'],
  },
  {
    id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    book: 6,
    chapter: 6,
    paragraph: 12,
    owner: 'Y2-B6-P12',
    opRows: ['OP-P1', 'OP-D1', 'OP-C1', 'OP-C2', 'OP-F1', 'OP-E1', 'OP-ANS2', 'OP-ANS3'],
    forbiddenOps: ['OP-D2'],
    official: 'vw-1022-a-23-2-o:q26-q29',
    subquestions: 5,
    sourceNeedles: ['tabel-1-vastwonen-financial-data', 'maximum_rent', 'TK = 450Q + 1400000', 'GO = -0.125Q + 2150'],
  },
  {
    id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    book: 7,
    chapter: 7,
    paragraph: 13,
    owner: 'Y2-B7-P13',
    opRows: ['OP-R1', 'OP-M1', 'OP-ANS2', 'OP-ANS3'],
    forbiddenOps: ['OP-F1'],
    official: 'vw-1022-a-23-1-o:q12-q15',
    subquestions: 5,
    sourceNeedles: ['figuur-1-kredietverzekering-en-voorwaarden', '90% indemnity', 'total_premium_eur', '96000'],
  },
  {
    id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    book: 8,
    chapter: 8,
    paragraph: 4,
    owner: 'Y2-B8-P04',
    opRows: ['OP-S1', 'OP-ANS1', 'OP-ANS3'],
    forbiddenOps: [],
    official: 'vw-1022-a-25-1-o:q15-q16',
    subquestions: 4,
    sourceNeedles: ['ijssalon-guarda-orso-bianco-context', 'lowest-price-guarantee-self-binding-source', 'derived-payoff-representation'],
  },
];

const ALLOWED_FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'minor_carry_flag',
  'scale_blocker',
  'proof_required_to_close',
  'quality_improvement_available',
]);

function fail(message) {
  console.error(`ERROR ${SPRINT}: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '');
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

function assertNonEmptyString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`);
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function extractPackageRecord(relPath) {
  const text = readText(relPath);
  const heading = '## Year 2/v6 Target-Family Candidate Record';
  const start = text.indexOf(heading);
  assert(start >= 0, `${relPath} missing ${heading}`);
  const match = text.slice(start + heading.length).match(/```json\s*([\s\S]*?)\s*```/);
  assert(match, `${relPath} missing JSON candidate record block`);
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    fail(`${relPath} candidate record block is invalid JSON: ${error.message}`);
    return {};
  }
}

function assertFileExists(relPath) {
  assert(fs.existsSync(path.join(ROOT, relPath)), `missing required file ${relPath}`);
}

function checkSchemaFile() {
  const schema = readJson('references/schemas/year2-v6-target-foundation-candidates.schema.json');
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'schema missing draft marker');
  assert(schema.$id && schema.$id.includes('year2-v6-target-foundation-candidates.schema.json'), 'schema id mismatch');
  assert(schema.type === 'object', 'schema must describe an object');
  assert(schema.additionalProperties === false, 'schema must forbid additional properties');
  assert(asArray(schema.required).includes('records'), 'schema must require records');
  assert(schema.$defs && schema.$defs.candidateRecord, 'schema must define candidateRecord');
}

function checkRecord(record, spec, expectedRecord) {
  assert(deepEqual(record, expectedRecord), `${spec.id} must exact-match approved package JSON block`);
  assert(record.schema_surface === SCHEMA_SURFACE, `${spec.id}.schema_surface mismatch`);
  assert(record.proposed_storage_surface === STORAGE_SURFACE, `${spec.id}.proposed_storage_surface mismatch`);
  assert(record.record_status === RECORD_STATUS, `${spec.id}.record_status mismatch`);
  assert(record.authority_boundary === RECORD_AUTHORITY, `${spec.id}.authority_boundary mismatch`);
  assert(record.id === spec.id, `${spec.id}.id mismatch`);
  assert(record.book === spec.book, `${spec.id}.book mismatch`);
  assert(record.chapter === spec.chapter, `${spec.id}.chapter mismatch`);
  assert(record.paragraph === spec.paragraph, `${spec.id}.paragraph mismatch`);
  assert(record.target_owner_candidate_id === spec.owner, `${spec.id}.target_owner_candidate_id mismatch`);
  assert(!Object.prototype.hasOwnProperty.call(record, 'candidate_ids'), `${spec.id} must not carry ambiguous candidate_ids`);
  assertSameMembers(record.official_evidence, [spec.official], `${spec.id}.official_evidence`);
  assertSameMembers(record.op_rows, spec.opRows, `${spec.id}.op_rows`);
  for (const forbidden of spec.forbiddenOps) {
    assert(!record.op_rows.includes(forbidden), `${spec.id}.op_rows must not include forbidden ${forbidden}`);
  }
  assert(record.source_reconstruction_required === true, `${spec.id}.source_reconstruction_required must be true`);
  assert(record.no_new_theory === true, `${spec.id}.no_new_theory must be true`);
  assert(asArray(record.target_exercise?.subquestions).length === spec.subquestions, `${spec.id}.subquestion count mismatch`);
  assert(asArray(record.answer_form?.point_allocation).length >= spec.subquestions, `${spec.id}.point_allocation incomplete`);
  assert(asArray(record.answer_form?.short_answer_model).length >= spec.subquestions, `${spec.id}.short_answer_model incomplete`);
  assert(asArray(record.operation_mapping).length === spec.subquestions, `${spec.id}.operation_mapping count mismatch`);
  for (const mapping of record.operation_mapping) {
    assertNonEmptyString(mapping.subquestion, `${spec.id}.operation_mapping.subquestion`);
    assert(Array.isArray(mapping.op_rows) && mapping.op_rows.length > 0, `${spec.id}.operation_mapping.${mapping.subquestion}.op_rows missing`);
    for (const op of mapping.op_rows) {
      assert(record.op_rows.includes(op), `${spec.id}.operation_mapping.${mapping.subquestion} uses undeclared ${op}`);
    }
  }
  for (const blocker of asArray(record.blockers)) {
    assertNonEmptyString(blocker.blocker, `${spec.id}.blocker.blocker`);
    assertNonEmptyString(blocker.blocks, `${spec.id}.blocker.blocks`);
    assertNonEmptyString(blocker.does_not_block, `${spec.id}.blocker.does_not_block`);
    assertNonEmptyString(blocker.proof_required_to_close, `${spec.id}.blocker.proof_required_to_close`);
  }
}

function checkCandidateSurface() {
  const surface = readJson(STORAGE_SURFACE);
  assert(surface.schema_version === 1, 'candidate surface schema_version mismatch');
  assert(surface.schema_surface === SCHEMA_SURFACE, 'candidate surface schema_surface mismatch');
  assert(surface.storage_surface === STORAGE_SURFACE, 'candidate surface storage_surface mismatch');
  assert(surface.authority_boundary === SURFACE_AUTHORITY, 'candidate surface authority boundary mismatch');
  assert(surface.implementation_sprint === SPRINT, 'candidate surface implementation_sprint mismatch');
  assert(surface.approved_source_packet?.packet_id === WAVE, 'candidate surface source packet mismatch');
  assert(surface.approved_source_packet?.source_record_policy === 'records_reproduced_from_approved_package_json_blocks_without_substantive_change', 'candidate surface source policy mismatch');
  assert(surface.active_v5_registry_preserved?.path === 'references/authored/course-target-exercises.json', 'active v5 registry path mismatch');
  assert(surface.active_v5_registry_preserved?.blueprint_version === 'v5', 'active v5 registry version mismatch');
  assertSameMembers(surface.active_v5_registry_preserved?.books, [1, 2, 3, 4], 'active_v5_registry_preserved.books');
  assert(Array.isArray(surface.records) && surface.records.length === 4, 'candidate surface must contain exactly four records');

  const expectedRecords = PACKAGE_FILES.map(extractPackageRecord);
  for (const [index, spec] of EXPECTED.entries()) {
    checkRecord(surface.records[index], spec, expectedRecords[index]);
  }

  const ids = surface.records.map((record) => record.id);
  assert(new Set(ids).size === ids.length, 'candidate record ids must be unique');
  const owners = surface.records.map((record) => record.target_owner_candidate_id);
  assert(new Set(owners).size === owners.length, 'target owner ids must be unique across this wave');

  const activeRegistryText = readText('references/authored/course-target-exercises.json');
  const activeRegistry = JSON.parse(activeRegistryText);
  assert(activeRegistry.blueprint_version === 'v5', 'active target registry must remain v5');
  for (const id of ids) assert(!activeRegistryText.includes(id), `active v5 registry must not include ${id}`);
}

function checkSourceReconstruction(surfaceIds) {
  const data = readJson('references/data/year2-target-foundation/source-reconstruction-foundation.json');
  assert(data.sprint_id === SPRINT, 'source reconstruction sprint mismatch');
  assert(data.status === 'foundation_ready_not_rendered', 'source reconstruction status mismatch');
  assert(data.authority_boundary === 'source_reconstruction_foundation_only_no_external_mutation_no_lesson_output', 'source reconstruction authority mismatch');
  assert(Array.isArray(data.records) && data.records.length === 4, 'source reconstruction must carry four records');
  assertSameMembers(data.records.map((record) => record.record_id), surfaceIds, 'source reconstruction record ids');
  for (const spec of EXPECTED) {
    const record = data.records.find((item) => item.record_id === spec.id);
    assert(record, `source reconstruction missing ${spec.id}`);
    assert(record.source_family === spec.official, `${spec.id} source family mismatch`);
    assert(asArray(record.required_artifacts).length > 0, `${spec.id} source artifacts missing`);
    assert(record.render_blocker?.blocks && record.render_blocker?.does_not_block && record.render_blocker?.proof_required_to_close, `${spec.id} source blocker incomplete`);
    const text = JSON.stringify(record);
    for (const needle of spec.sourceNeedles) assert(text.includes(needle), `${spec.id} source reconstruction missing ${needle}`);
  }
}

function checkAnswerContracts(surface) {
  const data = readJson('references/data/year2-target-foundation/answer-contracts.json');
  assert(data.sprint_id === SPRINT, 'answer contracts sprint mismatch');
  assert(data.status === 'machine_readable_foundation_ready_not_product_closed', 'answer contracts status mismatch');
  assert(data.authority_boundary === 'answer_contract_foundation_only_no_answer_skill_registry_mutation_no_product_use', 'answer contracts authority mismatch');
  assertSameMembers(data.records.map((record) => record.record_id), surface.records.map((record) => record.id), 'answer contract record ids');
  for (const record of surface.records) {
    const contract = data.records.find((item) => item.record_id === record.id);
    assert(contract, `answer contracts missing ${record.id}`);
    assertNonEmptyString(contract.official_correction_model, `${record.id}.official_correction_model`);
    assert(asArray(contract.answer_contracts).length === record.target_exercise.subquestions.length, `${record.id}.answer_contract count mismatch`);
    const labels = record.target_exercise.subquestions.map((item) => item.label);
    assertSameMembers(contract.answer_contracts.map((item) => item.subquestion), labels, `${record.id}.answer_contract subquestions`);
    for (const item of contract.answer_contracts) {
      assertNonEmptyString(item.answer_form, `${record.id}.${item.subquestion}.answer_form`);
      assert(asArray(item.point_logic).length > 0, `${record.id}.${item.subquestion}.point_logic missing`);
      assertNonEmptyString(item.short_answer_model, `${record.id}.${item.subquestion}.short_answer_model`);
    }
  }
}

function checkMtuReview(surface) {
  const review = readJson('reports/reference-planning/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-mtu-task-family-review.json');
  assert(review.sprint_id === SPRINT, 'MTU review sprint mismatch');
  assert(review.status === 'full_op_row_task_family_review_foundation_ready', 'MTU review status mismatch');
  assert(review.authority_boundary === 'review_only_no_mtu_mutation_no_operation_closure_no_product_use', 'MTU review authority mismatch');
  assertSameMembers(review.records.map((record) => record.record_id), surface.records.map((record) => record.id), 'MTU review record ids');
  for (const record of surface.records) {
    const mtu = review.records.find((item) => item.record_id === record.id);
    assert(mtu, `MTU review missing ${record.id}`);
    assert(asArray(mtu.complete_op_row_family_union).length === record.op_rows.length, `${record.id} complete_op_row_family_union length mismatch`);
    assertSameMembers(mtu.complete_op_row_family_union.map((item) => item.op_row), record.op_rows, `${record.id}.complete_op_row_family_union op rows`);
    assert(asArray(mtu.provisional_label_resolution).length > 0, `${record.id}.provisional_label_resolution missing`);
    assert(mtu.protected_mtu_change_plan?.required === true, `${record.id}.protected_mtu_change_plan.required must be true`);
    assert(mtu.protected_mtu_change_plan?.status === 'companion_plan_required_later', `${record.id}.protected_mtu_change_plan status mismatch`);
    assert(mtu.protected_mtu_change_plan.blocks && mtu.protected_mtu_change_plan.does_not_block, `${record.id}.protected_mtu_change_plan blockers incomplete`);
  }
  for (const finding of asArray(review.global_findings)) {
    assert(ALLOWED_FINDING_CLASSIFICATIONS.has(finding.classification), `invalid MTU finding classification ${finding.classification}`);
    assert(finding.blocks && finding.does_not_block && finding.proof_required_to_close, `${finding.id} missing carried-issue fields`);
  }
}

function checkReviewPacket() {
  const packet = readJson('reports/review-gates/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1/review-packet.json');
  assert(packet.packet_id === SPRINT, 'review packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'throughput class mismatch');
  assert(packet.authority_class === 'protected_reference', 'authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'review autonomy level mismatch');
  assert(packet.human_decision_required === true, 'human_decision_required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must be false');
  assert(packet.decision?.route === 'READY_FOR_HUMAN_REVIEW', 'decision route must be READY_FOR_HUMAN_REVIEW');
  assert(packet.decision?.mark_ready_allowed === false, 'mark ready must remain false until readiness proof is applied');
  assert(packet.decision?.merge_allowed === false, 'merge must remain false until owner authorization');
  assert(packet.authority_claims?.year2_v6_candidate_surface_created === true, 'candidate surface authority claim missing');
  for (const [key, value] of Object.entries(packet.authority_claims || {})) {
    if (key === 'year2_v6_candidate_surface_created' || key === 'approved_candidate_records_installed') continue;
    assert(value === false, `authority_claims.${key} must be false`);
  }
  for (const relPath of REQUIRED_PATHS) {
    assert(packet.changed_paths.map(normalizePath).includes(relPath), `packet.changed_paths missing ${relPath}`);
  }
  for (const relPath of packet.changed_paths || []) {
    assert(fs.existsSync(path.join(ROOT, normalizePath(relPath))), `packet.changed_paths includes missing path ${relPath}`);
  }
  const checklist = asArray(packet.core_requirement_checklist);
  assert(checklist.length >= 12, 'core checklist too short');
  for (const item of checklist) {
    assert(['met', 'pending_remote_pr'].includes(item.status), `invalid checklist status ${item.requirement}: ${item.status}`);
  }
  const pending = checklist.filter((item) => item.status === 'pending_remote_pr');
  assert(pending.length === 1 && pending[0].requirement === 'Exact-head PR proof', 'only exact-head PR proof may be pending before draft PR');
  for (const flag of asArray(packet.carried_flags)) {
    assert(ALLOWED_FINDING_CLASSIFICATIONS.has(flag.classification), `invalid carried flag classification ${flag.classification}`);
    assert(asArray(flag.blocks).length > 0, `${flag.id} blocks missing`);
    assert(asArray(flag.does_not_block).length > 0, `${flag.id} does_not_block missing`);
    assertNonEmptyString(flag.proof_required_to_close, `${flag.id}.proof_required_to_close`);
  }

  const pilot = packet.single_account_pr_governance_pilot || {};
  assert(pilot.expected_route === 'READY_FOR_HUMAN_REVIEW', 'pilot expected route mismatch');
  assert(pilot.owner_authorization_required_to_merge === true, 'pilot must require owner authorization');
  assert(pilot.branch_protection_ok_required === true, 'pilot must require branch protection ok');
  if (pilot.pilot_status === 'pending_remote_pr') {
    assert(pilot.remote_head_sha === null, 'pending pilot must not claim a remote head sha');
    assert(pilot.branch_protection_checker_output === null, 'pending pilot must not claim branch protection output');
  } else if (pilot.pilot_status === 'remote_head_validated') {
    assert(/^[a-f0-9]{40}$/i.test(pilot.remote_head_sha || ''), 'validated pilot requires remote head sha');
    assert(pilot.branch_protection_checker_output?.ok === true, 'validated pilot requires branch protection ok:true output');
    assert(pilot.pr_readiness_decision?.route === 'READY_FOR_HUMAN_REVIEW', 'validated pilot requires readiness human route');
    assert(pilot.lead_review?.result === 'PASS', 'validated pilot requires PASS lead review');
    assert(pilot.lead_review?.reviewed_commit_sha === pilot.remote_head_sha, 'lead review sha must match remote head');
  } else {
    fail(`invalid pilot_status ${pilot.pilot_status}`);
  }
}

function checkMarkdownPacket() {
  const text = readText('reports/reference-planning/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-review-packet.md');
  for (const required of [
    '../4veco-lessen/specifications/product-end-state.md',
    'references/owned/course-blueprint-v6-three-year.md',
    'Non-Negotiable Requirements',
    'Core-Requirement Checklist',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'READY_FOR_HUMAN_REVIEW',
    'ok: true',
  ]) {
    assert(text.includes(required), `review packet markdown missing ${required}`);
  }
}

function main() {
  for (const relPath of [...REQUIRED_PATHS, ...PACKAGE_FILES]) assertFileExists(relPath);
  checkSchemaFile();
  checkCandidateSurface();
  const surface = readJson(STORAGE_SURFACE);
  const surfaceIds = surface.records.map((record) => record.id);
  checkSourceReconstruction(surfaceIds);
  checkAnswerContracts(surface);
  checkMtuReview(surface);
  checkReviewPacket();
  checkMarkdownPacket();
  if (!process.exitCode) console.log(`OK ${SPRINT}: candidate surface, source, answer, MTU, and review packet validated`);
}

if (require.main === module) main();
