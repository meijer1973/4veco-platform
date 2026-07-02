const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PACKET = 'Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1';
const SCHEMA_SURFACE = 'year2_v6_target_family_candidate_surface_v1';
const PROPOSED_STORAGE_SURFACE = 'references/authored/year2-v6-target-foundation-candidates.json';
const ALLOWED_RECORD_STATUS = 'candidate_for_governed_year2_v6_target_foundation';
const AUTHORITY_BOUNDARY = 'proposal_only_no_registry_write_no_mtu_no_lesson_no_product_use';

const DOCS = [
  'reports/sprints/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-plan.md',
  'reports/sprints/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-result.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book5-pension-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book6-housing-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book8-strategic-target-package.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-cross-book-consistency-review.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-governed-mutation-plan.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-quality-log.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-review-packet.md',
  'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-subagent-review.md',
  'reports/review-gates/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1/review-packet.json',
];

const PACKAGE_SPECS = [
  {
    relPath: 'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book5-pension-target-package.md',
    recordId: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    official: 'vw-1022-a-25-2-o:q7-q11',
    book: 5,
    module: 2,
    chapter: 5,
    paragraph: 13,
    owner: 'Y2-B5-P13',
    prerequisites: ['Y2-B5-P08', 'Y2-B5-P09', 'Y2-B5-P10', 'Y2-B5-P11'],
    integrates: ['Y2-B5-P08', 'Y2-B5-P09', 'Y2-B5-P10', 'Y2-B5-P11'],
    markers: [],
    opRows: ['OP-T1', 'OP-H1', 'OP-ANS2', 'OP-ANS3'],
    forbiddenOps: ['OP-F1'],
    subquestionCount: 5,
    sourceRequirements: [
      'mixed bar/line structure',
      '2024-2044',
      'annual inflation = 2%',
      'annual real economic growth = 0.5%',
      'annual pension-asset return = 3.5%',
      'premium pressure as percentage of GDP stays constant',
      'number of premium payers stays constant',
      'capital incomes stay constant',
      'Do not substitute a generic pension diagram',
    ],
  },
  {
    relPath: 'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book6-housing-target-package.md',
    recordId: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    official: 'vw-1022-a-23-2-o:q26-q29',
    book: 6,
    module: 2,
    chapter: 6,
    paragraph: 12,
    owner: 'Y2-B6-P12',
    prerequisites: ['Y2-B6-P08', 'Y2-B6-P09', 'Y2-B6-P11'],
    integrates: ['Y2-B6-P08', 'Y2-B6-P09', 'Y2-B6-P11'],
    markers: ['Y2-B6-P14'],
    opRows: ['OP-P1', 'OP-D1', 'OP-C1', 'OP-C2', 'OP-F1', 'OP-E1', 'OP-ANS2', 'OP-ANS3'],
    forbiddenOps: ['OP-D2'],
    subquestionCount: 5,
    sourceRequirements: [
      'maximum rent = EUR 850',
      'housing stock = 6,800',
      'TK = 450Q + 1,400,000',
      'GO = -0.125Q + 2,150',
      'number of released rental dwellings = -9.9%',
      'average rent = +6%',
      'middle incomes = +3%',
      'income elasticity of private rental housing',
      'Book 2 cost, revenue, marginal reasoning, and output choice',
      'Do not substitute generic housing-market tables',
    ],
  },
  {
    relPath: 'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md',
    recordId: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    official: 'vw-1022-a-23-1-o:q12-q15',
    book: 7,
    module: 2,
    chapter: 7,
    paragraph: 13,
    owner: 'Y2-B7-P13',
    prerequisites: ['Y2-B7-P02', 'Y2-B7-P09', 'Y2-B7-P10', 'Y2-B7-P11', 'Y2-B7-P12'],
    integrates: ['Y2-B7-P02', 'Y2-B7-P09', 'Y2-B7-P10', 'Y2-B7-P11', 'Y2-B7-P12'],
    markers: ['Y2-B7-P14'],
    opRows: ['OP-R1', 'OP-M1', 'OP-ANS2', 'OP-ANS3'],
    forbiddenOps: ['OP-F1'],
    subquestionCount: 5,
    sourceRequirements: [
      'pijl 1 = delivered sold product x',
      'pijl 2 = invoice amount',
      'pijl 3 = credit-insurance premium',
      'pijl 4 = amount paid out',
      'pijl 5 = possible collection service',
      'pijl 6 = collection costs plus surcharge',
      'pijl 7 = outstanding debt to be paid',
      '90% indemnity',
      '20 contracts, average turnover EUR 1 million, 90-day payment term',
      '30 contracts, average turnover EUR 0.5 million, 60-day payment term',
      '80 contracts, average turnover EUR 0.25 million, 60-day payment term',
      '20% markup',
      'Do not substitute a generic insurance diagram',
    ],
  },
  {
    relPath: 'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book8-strategic-target-package.md',
    recordId: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    official: 'vw-1022-a-25-1-o:q15-q16',
    book: 8,
    module: 2,
    chapter: 8,
    paragraph: 4,
    owner: 'Y2-B8-P04',
    prerequisites: ['Y2-B8-P02', 'Y2-B8-P03'],
    integrates: ['Y2-B8-P02', 'Y2-B8-P03'],
    markers: ['Y2-B8-P16'],
    opRows: ['OP-S1', 'OP-ANS1', 'OP-ANS3'],
    forbiddenOps: [],
    subquestionCount: 4,
    sourceRequirements: [
      'beginning of 2025 Guarda loses its monopoly position',
      'Orso Bianco opens',
      'same production costs as Guarda',
      'Orso Bianco enters with a lower price',
      'perfect substitutes',
      'fixed sales price for 2025',
      'lowest-price guarantee',
      'discount of 25% on that lower price',
      'Do not substitute a generic duopoly',
    ],
  },
];

const FALSE_AUTHORITY_KEYS = [
  'target_registry_ready_proposals_created',
  'target_registry_mutation_in_scope',
  'target_registry_records_created',
  'authored_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'mtus_minted',
  'mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'operation_candidate_storage_created',
  'answer_skill_candidate_storage_created',
  'generated_lesson_output_authorized',
  'official_exam_operation_closure_authorized',
  'broad_operation_row_closure_authorized',
  'product_authority',
  'product_route_adoption_authorized',
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
];

const ALLOWED_FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'quality_improvement_available',
  'minor_carry_flag',
  'scale_blocker',
  'core_spec_failure',
]);

function fail(message) {
  console.error(`ERROR ${PACKET}: ${message}`);
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

function assertIncludes(text, needle, label) {
  assert(text.includes(needle), `${label} missing ${needle}`);
}

function assertFalseFields(object, keys, label) {
  for (const key of keys) {
    assert(object && object[key] === false, `${label}.${key} must be false`);
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

function assertNonEmptyString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`);
}

function extractRecord(text, relPath) {
  const heading = '## Year 2/v6 Target-Family Candidate Record';
  const start = text.indexOf(heading);
  assert(start >= 0, `${relPath} missing ${heading}`);
  const afterHeading = text.slice(start + heading.length);
  const match = afterHeading.match(/```json\s*([\s\S]*?)\s*```/);
  assert(match, `${relPath} missing JSON record block after ${heading}`);
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    fail(`${relPath} candidate record JSON is invalid: ${error.message}`);
    return {};
  }
}

function checkFindingClassifications(relPath) {
  const text = readText(relPath);
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.startsWith('| Y2TFW-')) continue;
    const cells = line.split('|').map((cell) => cell.trim());
    const id = cells[1];
    const classification = (cells[2] || '').replace(/`/g, '');
    assert(ALLOWED_FINDING_CLASSIFICATIONS.has(classification), `${relPath} finding ${id} invalid classification ${classification}`);
  }
}

function checkOperationMapping(record, spec) {
  assertSameMembers(record.op_rows, spec.opRows, `${spec.recordId}.op_rows`);
  for (const forbidden of spec.forbiddenOps) {
    assert(!record.op_rows.includes(forbidden), `${spec.recordId}.op_rows must not include ${forbidden}`);
  }
  assert(Array.isArray(record.operation_mapping), `${spec.recordId}.operation_mapping must be an array`);
  assert(record.operation_mapping.length === spec.subquestionCount, `${spec.recordId}.operation_mapping length mismatch`);
  for (const mapping of record.operation_mapping) {
    assertNonEmptyString(mapping.subquestion, `${spec.recordId}.operation_mapping.subquestion`);
    assert(Array.isArray(mapping.op_rows) && mapping.op_rows.length > 0, `${spec.recordId}.operation_mapping.${mapping.subquestion}.op_rows missing`);
    for (const op of mapping.op_rows) {
      assert(record.op_rows.includes(op), `${spec.recordId}.operation_mapping.${mapping.subquestion} uses undeclared ${op}`);
      assert(!spec.forbiddenOps.includes(op), `${spec.recordId}.operation_mapping.${mapping.subquestion} must not use ${op}`);
    }
  }
}

function checkRecordSchema(record, spec) {
  assert(record.schema_surface === SCHEMA_SURFACE, `${spec.recordId}.schema_surface mismatch`);
  assert(record.proposed_storage_surface === PROPOSED_STORAGE_SURFACE, `${spec.recordId}.proposed_storage_surface mismatch`);
  assert(record.id === spec.recordId, `${spec.recordId}.id mismatch`);
  assert(record.book === spec.book, `${spec.recordId}.book mismatch`);
  assert(record.module === spec.module, `${spec.recordId}.module mismatch`);
  assert(record.chapter === spec.chapter, `${spec.recordId}.chapter mismatch`);
  assert(record.paragraph === spec.paragraph, `${spec.recordId}.paragraph mismatch`);
  assert(record.target_owner_candidate_id === spec.owner, `${spec.recordId}.target_owner_candidate_id mismatch`);
  assertSameMembers(record.prerequisite_candidate_ids, spec.prerequisites, `${spec.recordId}.prerequisite_candidate_ids`);
  assertSameMembers(record.integrates_candidate_ids, spec.integrates, `${spec.recordId}.integrates_candidate_ids`);
  assertSameMembers(record.bounded_retrieval_marker_ids, spec.markers, `${spec.recordId}.bounded_retrieval_marker_ids`);
  assert(record.record_status === ALLOWED_RECORD_STATUS, `${spec.recordId}.record_status mismatch`);
  assert(!Object.prototype.hasOwnProperty.call(record, 'candidate_ids'), `${spec.recordId} must not use ambiguous candidate_ids`);
  assertSameMembers(record.official_evidence, [spec.official], `${spec.recordId}.official_evidence`);
  assert(record.source_reconstruction_required === true, `${spec.recordId}.source_reconstruction_required must be true`);
  assert(record.no_new_theory === true, `${spec.recordId}.no_new_theory must be true`);
  assert(record.authority_boundary === AUTHORITY_BOUNDARY, `${spec.recordId}.authority_boundary mismatch`);
  assertNonEmptyString(record.source_reference?.prompt_pdf, `${spec.recordId}.source_reference.prompt_pdf`);
  assertNonEmptyString(record.source_reference?.correction_model_pdf, `${spec.recordId}.source_reference.correction_model_pdf`);
  assertNonEmptyString(record.lesson_goal, `${spec.recordId}.lesson_goal`);
  assertNonEmptyString(record.target_exercise?.context, `${spec.recordId}.target_exercise.context`);
  assert(Array.isArray(record.target_exercise?.subquestions), `${spec.recordId}.target_exercise.subquestions must be an array`);
  assert(record.target_exercise.subquestions.length === spec.subquestionCount, `${spec.recordId}.target_exercise.subquestion count mismatch`);
  for (const subquestion of record.target_exercise.subquestions) {
    assertNonEmptyString(subquestion.label, `${spec.recordId}.target_exercise.subquestion.label`);
    assertNonEmptyString(subquestion.prompt, `${spec.recordId}.target_exercise.subquestion.prompt`);
  }
  assert(asArray(record.answer_form?.point_allocation).length >= spec.subquestionCount, `${spec.recordId}.answer_form.point_allocation incomplete`);
  assert(asArray(record.answer_form?.short_answer_model).length >= spec.subquestionCount, `${spec.recordId}.answer_form.short_answer_model incomplete`);
  assert(asArray(record.prior_skills).length > 0, `${spec.recordId}.prior_skills missing`);
  assert(asArray(record.required_task_families).length > 0, `${spec.recordId}.required_task_families missing`);
  assert(asArray(record.review_evidence).length > 0, `${spec.recordId}.review_evidence missing`);
  assert(asArray(record.blockers).length > 0, `${spec.recordId}.blockers missing`);
  for (const blocker of record.blockers) {
    assertNonEmptyString(blocker.blocker, `${spec.recordId}.blockers.blocker`);
    assertNonEmptyString(blocker.blocks, `${spec.recordId}.blockers.blocks`);
    assertNonEmptyString(blocker.does_not_block, `${spec.recordId}.blockers.does_not_block`);
    assertNonEmptyString(blocker.proof_required_to_close, `${spec.recordId}.blockers.proof_required_to_close`);
  }
  checkOperationMapping(record, spec);
}

function checkPackage(spec) {
  const text = readText(spec.relPath);
  for (const required of [
    '../4veco-lessen/specifications/product-end-state.md',
    'references/owned/course-blueprint-v6-three-year.md',
    spec.recordId,
    spec.official,
    'Supersession guard',
    'is used here only as original official-family provenance',
    'Later mutation must use the repaired package JSON record',
    SCHEMA_SURFACE,
    PROPOSED_STORAGE_SURFACE,
    'target_owner_candidate_id',
    'prerequisite_candidate_ids',
    'integrates_candidate_ids',
    'bounded_retrieval_marker_ids',
    '## Paragraph Candidate And Prerequisite Chain',
    '## Official Prompt, Source, And Correction-Model Provenance',
    '## Source Reconstruction Requirements',
    '## Target Exercise And Subquestions',
    '## Operation Chain And OP-Row Mapping',
    '## Answer Form And Point Allocation Requirements',
    '## Required Prior Skills And MTU/Task-Family Compatibility',
    '## No-New-Theory Rationale',
    '## Year 2/v6 Target-Family Candidate Record',
    '## Exact Missing-Unit Or Task-Family Blockers',
    '## Proof Required Before Lesson Production',
    AUTHORITY_BOUNDARY,
  ]) assertIncludes(text, required, spec.relPath);
  assert(!text.includes('## Target-Registry-Ready Proposed Record'), `${spec.relPath} must not use the rejected registry-ready heading`);
  assert(!text.includes('target-registry-ready record'), `${spec.relPath} must not claim target-registry-ready record`);
  for (const candidate of [spec.owner, ...spec.prerequisites, ...spec.integrates, ...spec.markers]) assertIncludes(text, candidate, spec.relPath);
  for (const op of spec.opRows) assertIncludes(text, op, spec.relPath);
  for (const sourceRequirement of spec.sourceRequirements) assertIncludes(text, sourceRequirement, spec.relPath);
  for (const forbidden of spec.forbiddenOps) {
    const record = extractRecord(text, spec.relPath);
    assert(!record.op_rows.includes(forbidden), `${spec.relPath} record must not include ${forbidden}`);
  }
  assert(!/does authorize product/i.test(text), `${spec.relPath} must not authorize product use`);
  checkRecordSchema(extractRecord(text, spec.relPath), spec);
}

function checkDocs() {
  for (const relPath of DOCS) {
    const text = readText(relPath);
    assertIncludes(text, '../4veco-lessen/specifications/product-end-state.md', relPath);
    assert(!/student-facing product end state ready/i.test(text), `${relPath} must not claim student-facing product end state`);
    assert(!text.includes('target-registry-ready'), `${relPath} must not use target-registry-ready language`);
  }
  for (const spec of PACKAGE_SPECS) checkPackage(spec);

  const cross = readText('reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-cross-book-consistency-review.md');
  for (const required of [
    'Book 5 pension/time/stock-flow',
    'Book 6 housing finance and rent-market',
    'Book 7 credit insurance and information problems',
    'Book 8 Q15/Q16 strategic answer form',
    'Only the owner candidate in each row receives paragraph-local target ownership',
    'OP-C1',
    'OP-C2',
    'Q19 exact HOLD preserved',
    'Product/Scale/student-use authority false',
  ]) assertIncludes(cross, required, 'cross-book consistency review');

  const plan = readText('reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-governed-mutation-plan.md');
  for (const spec of PACKAGE_SPECS) {
    assertIncludes(plan, spec.recordId, 'governed mutation plan');
    assertIncludes(plan, spec.owner, 'governed mutation plan');
  }
  assertIncludes(plan, 'This file proposes exact Year 2/v6 target-family candidate records for a later governed mutation.', 'governed mutation plan');
  assertIncludes(plan, PROPOSED_STORAGE_SURFACE, 'governed mutation plan');
  assertIncludes(plan, SCHEMA_SURFACE, 'governed mutation plan');
  assertIncludes(plan, 'not registry-ready for that validator', 'governed mutation plan');
  assertIncludes(plan, 'schema-valid record JSON blocks', 'governed mutation plan');
  assertIncludes(plan, 'provenance only for this packet', 'governed mutation plan');
  assertIncludes(plan, 'older OP-row route is superseded', 'governed mutation plan');
  assertIncludes(plan, 'bounded target markers', 'governed mutation plan');
  assertIncludes(plan, 'not treated as implicit lesson coverage', 'governed mutation plan');
  assertIncludes(plan, 'not a complete OP-row family union', 'governed mutation plan');
  assert(!plan.includes('current registry or to the next approved Year 2 target-registry surface'), 'governed mutation plan must not leave storage surface unresolved');

  const targetRegistry = readText('references/authored/course-target-exercises.json');
  for (const spec of PACKAGE_SPECS) {
    assert(!targetRegistry.includes(spec.recordId), `active v5 target registry must not already contain ${spec.recordId}`);
  }

  const subagent = readText('reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-subagent-review.md');
  assertIncludes(subagent, 'registry-contract repair', 'subagent repair review');
  assertIncludes(subagent, 'economics/operation repair', 'subagent repair review');
  assertIncludes(subagent, 'PASS', 'subagent repair review');

  checkFindingClassifications('reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-quality-log.md');
  checkFindingClassifications('reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-review-packet.md');
}

function checkPacket() {
  const packet = readJson('reports/review-gates/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1/review-packet.json');
  assert(packet.packet_id === PACKET, 'packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'throughput class mismatch');
  assert(packet.authority_class === 'high_authority', 'authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet must remain L4');
  assert(packet.human_decision_required === true, 'human review required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must remain false');
  assert(packet.authority_claims?.target_family_candidate_proposals_created === true, 'candidate proposal readiness flag missing');
  assert(packet.authority_claims?.schema_valid_year2_candidate_records_created === true, 'schema-valid candidate flag missing');
  assertFalseFields(packet.authority_claims, FALSE_AUTHORITY_KEYS, 'authority_claims');

  const summary = packet.target_foundation_summary || {};
  assert(summary.record_count === 4, 'record count mismatch');
  assert(summary.schema_surface === SCHEMA_SURFACE, 'schema surface mismatch');
  assert(summary.proposed_storage_surface === PROPOSED_STORAGE_SURFACE, 'proposed storage surface mismatch');
  assert(JSON.stringify(summary.books_covered) === JSON.stringify([5, 6, 7, 8]), 'books covered mismatch');
  assert(summary.q19_status === 'exact_hold_unchanged', 'Q19 status mismatch');
  assert(summary.registry_mutation === 'not_executed', 'registry mutation must not be executed');
  for (const spec of PACKAGE_SPECS) {
    assert((summary.proposed_record_ids || []).includes(spec.recordId), `summary missing ${spec.recordId}`);
    assert((summary.official_anchor_families || []).includes(spec.official), `summary missing ${spec.official}`);
    assert((summary.target_owner_candidate_ids || []).includes(spec.owner), `summary missing owner ${spec.owner}`);
  }
  for (const marker of ['Y2-B6-P14', 'Y2-B7-P14', 'Y2-B8-P16']) {
    assert((summary.bounded_retrieval_marker_ids || []).includes(marker), `summary missing marker ${marker}`);
  }
  for (const repair of ['Book 6 q27 uses OP-C1 + OP-C2 + OP-P1 + OP-ANS2.', 'Book 5 removes OP-F1 from pension-wealth/GDP-share reasoning.', 'Book 7 removes OP-F1 from expected-premium calculation.']) {
    assert((summary.operation_mapping_repairs || []).includes(repair), `summary missing repair: ${repair}`);
  }
  for (const relPath of DOCS) {
    assert((packet.changed_paths || []).includes(relPath), `changed_paths missing ${relPath}`);
  }
  const checkerPath = 'build-scripts/references/check-y2-evidence-backed-target-foundation-wave-1.js';
  assert((packet.changed_paths || []).includes(checkerPath), `changed_paths missing ${checkerPath}`);

  const status = packet.decision?.status;
  assert(['ready_for_conditional_merge_after_repair'].includes(status), 'invalid decision status');
  const checklist = packet.core_requirement_checklist || [];
  assert(checklist.length >= 12, 'core checklist too short');
  const recordItem = checklist.find((item) => item.requirement === 'Schema-valid candidate records present without mutation');
  assert(recordItem?.status === 'met', 'schema-valid candidate checklist item missing or not met');
  const leadItem = checklist.find((item) => item.requirement === 'Read-only lead review complete');
  assert(leadItem?.status === 'met', 'lead review must be met');
  for (const item of checklist) assert(item.status === 'met', `core requirement must be met: ${item.requirement}`);
  assert(packet.review_autonomy?.lead_review_result.includes('NO_MISSING_CORE_REQUIREMENTS'), 'final packet must record no missing core requirements');
  assert(Object.keys(packet.proof?.lead_reviews || {}).length >= 6, 'final packet needs original lead reviews');
  assert(packet.proof?.repair_leads?.registry_contract_repair?.status === 'PASS', 'registry-contract repair lead missing or not pass');
  assert(packet.proof?.repair_leads?.economics_operation_repair?.status === 'PASS', 'economics/operation repair lead missing or not pass');
}

function main() {
  for (const relPath of DOCS) assert(fs.existsSync(path.join(ROOT, relPath)), `missing ${relPath}`);
  checkDocs();
  checkPacket();
  if (!process.exitCode) console.log(`OK ${PACKET}: target foundation packet validated`);
}

main();
