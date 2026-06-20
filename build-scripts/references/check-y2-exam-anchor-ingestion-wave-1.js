#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OVERLAY = 'references/data/exam-ingestion/y2-exam-anchor-ingestion-wave-1.json';
const REVIEW_PACKET = 'reports/review-gates/Y2-EXAM-ANCHOR-INGESTION-WAVE-1/review-packet.json';
const OPERATION_SPINE = 'references/owned/course-blueprint-v6-three-year.md';

const DOCS = [
  'reports/sprints/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-plan.md',
  'reports/sprints/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-result.md',
  'reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-evidence-packet.md',
  'reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-integrated-update.md',
  'reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-quality-log.md',
  'reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-review-packet.md',
  'reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-subagent-review.md',
];

const REQUIRED_CHANGED_PATHS = [
  'build-scripts/references/check-y2-exam-anchor-ingestion-wave-1.js',
  OVERLAY,
  ...DOCS,
  REVIEW_PACKET,
];

const REQUIRED_CASES = new Map([
  ['Y2-W1-B5-PENSIONMODEL-Q7-Q11', 5],
  ['Y2-W1-B6-HOUSING-Q26-Q29', 4],
  ['Y2-W1-B7-NONPAYMENT-Q12-Q15', 4],
  ['Y2-W1-B8-STRATEGIC-IJSSALON-Q15-Q16', 2],
  ['Y2-W1-B8-GREEN-GROWTH-Q22-Q23', 2],
]);

const EXPECTED_TASK_FAMILY_STATUS = {
  'Y2-W1-B5-PENSIONMODEL-Q7-Q11': {
    status: 'mirrored_skill_ids_only_not_mtu_closure',
    source_required_skill_ids: ['E02', 'E06'],
  },
  'Y2-W1-B6-HOUSING-Q26-Q29': {
    status: 'mirrored_skill_ids_only_not_mtu_closure',
    source_required_skill_ids: ['A14', 'A06', 'A25', 'D11'],
  },
  'Y2-W1-B7-NONPAYMENT-Q12-Q15': {
    status: 'mirrored_skill_ids_only_not_mtu_closure',
    source_required_skill_ids: ['G02', 'F09', 'G04', 'A04'],
  },
  'Y2-W1-B8-STRATEGIC-IJSSALON-Q15-Q16': {
    status: 'Q15_partial_support_plus_Q16_followup_not_broad_closure',
    source_required_skill_ids: ['D27', 'F03', 'F09'],
  },
  'Y2-W1-B8-GREEN-GROWTH-Q22-Q23': {
    status: 'official_anchor_family_has_no_mirrored_required_skill_ids',
    source_required_skill_ids: [],
  },
};

const ALLOWED_FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'quality_improvement_available',
  'minor_carry_flag',
  'scale_blocker',
  'core_spec_failure',
]);

const FORBIDDEN_OLD_FINDING_CLASSIFICATIONS = [
  'implementation_complete',
  'evidence_improved',
  'boundary_risk',
  'count_caution',
  'precise_hold',
  'downstream_blocker',
  'checker_coverage_gap',
];

const FALSE_AUTHORITY_KEYS = [
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'authored_reference_mutation_authorized',
  'target_registry_mutation_in_scope',
  'target_registry_records_created',
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

const OVERLAY_FALSE_AUTHORITY_KEYS = [
  'external_source_mutated',
  'machine_reference_mutated',
  'authored_reference_mutated',
  'target_registry_mutation_authorized',
  'unit_minting_authorized',
  'mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'generated_lesson_output_authorized',
  'official_operation_closure_authorized',
  'product_route_adoption_authorized',
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'student_product_use_authorized',
];

function fail(message) {
  console.error(`Y2-EXAM-ANCHOR-INGESTION-WAVE-1 check failed: ${message}`);
  process.exit(1);
}

function file(relPath) {
  return path.join(ROOT, relPath);
}

function readText(relPath) {
  try {
    return fs.readFileSync(file(relPath), 'utf8');
  } catch (error) {
    fail(`cannot read ${relPath}: ${error.message}`);
  }
}

function readJson(relPath) {
  try {
    return JSON.parse(readText(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(text, needle, relPath) {
  assert(text.includes(needle), `${relPath} missing ${needle}`);
}

function sortedStrings(value) {
  return [...value].sort();
}

function assertSameStrings(actual, expected, label) {
  assertArray(actual, label);
  const actualSorted = sortedStrings(actual);
  const expectedSorted = sortedStrings(expected);
  assert(
    JSON.stringify(actualSorted) === JSON.stringify(expectedSorted),
    `${label} expected ${expectedSorted.join(',')} but found ${actualSorted.join(',')}`
  );
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
}

function assertFalseFields(object, keys, label) {
  for (const key of keys) {
    assert(object?.[key] === false, `${label}.${key} must be false`);
  }
}

function assertBlocker(blocker, label) {
  assert(typeof blocker.id === 'string' && blocker.id.length > 0, `${label} blocker missing id`);
  for (const key of ['blocks', 'does_not_block']) {
    assertArray(blocker[key], `${label}.${blocker.id}.${key}`);
    assert(blocker[key].length > 0, `${label}.${blocker.id}.${key} must not be empty`);
  }
  assert(
    typeof blocker.proof_required_to_close === 'string' && blocker.proof_required_to_close.length > 0,
    `${label}.${blocker.id}.proof_required_to_close missing`
  );
}

function assertNoForbiddenPath(relPath) {
  assert(!/^references\/(authored|machine|external)\//i.test(relPath), `protected source path must not be changed: ${relPath}`);
  assert(!/^references\/data\/course-target-exercises/i.test(relPath), `target registry path must not be changed: ${relPath}`);
  assert(!/(^|\/)Boek\s+\d+\s+-\s+/i.test(relPath), `generated lesson path must not be changed: ${relPath}`);
}

function extractOperationSpineRows() {
  const text = readText(OPERATION_SPINE);
  const rows = new Set();
  for (const match of text.matchAll(/\|\s*(OP-[A-Z0-9]+)\s*\|/g)) rows.add(match[1]);
  return rows;
}

function checkTaskFamilyStatus(item) {
  const expected = EXPECTED_TASK_FAMILY_STATUS[item.case_id];
  assert(expected, `missing expected task-family contract for ${item.case_id}`);
  assert(
    item.mtu_task_family_status.some((record) => {
      return (
        record.status === expected.status &&
        Array.isArray(record.source_required_skill_ids) &&
        JSON.stringify(sortedStrings(record.source_required_skill_ids)) ===
          JSON.stringify(sortedStrings(expected.source_required_skill_ids)) &&
        typeof record.gap === 'string' &&
        record.gap.length > 0
      );
    }),
    `${item.case_id} missing expected MTU/task-family status ${expected.status}`
  );
}

function checkOverlay(overlay) {
  assert(overlay.overlay_id === 'Y2-EXAM-ANCHOR-INGESTION-WAVE-1', 'overlay id mismatch');
  assert(overlay.overlay_status === 'review_wave', 'overlay status mismatch');
  assertFalseFields(overlay.authority_boundary, OVERLAY_FALSE_AUTHORITY_KEYS, 'overlay.authority_boundary');

  assert(overlay.wave_scope?.selected_case_count === 5, 'selected case count must be 5');
  assert(overlay.wave_scope?.selected_question_count === 17, 'selected question count must be 17');
  assert(overlay.wave_scope?.q19_status === 'hold', 'Q19 must remain hold');
  assert(
    overlay.wave_scope?.complementary_prior_evidence?.some((item) => item.id === 'Q3' && item.broad_rows_closed.length === 0),
    'Q3 complementary evidence must remain non-closing'
  );

  assertArray(overlay.cases, 'overlay.cases');
  assert(overlay.cases.length === REQUIRED_CASES.size, 'overlay must contain five cases');
  const byId = new Map(overlay.cases.map((item) => [item.case_id, item]));
  const operationSpineRows = extractOperationSpineRows();
  for (const [caseId, questionCount] of REQUIRED_CASES.entries()) {
    const item = byId.get(caseId);
    assert(item, `missing case ${caseId}`);
    assertArray(item.question_ids, `${caseId}.question_ids`);
    assert(item.question_ids.length === questionCount, `${caseId} question count mismatch`);
    for (const field of [
      'official_prompt_trace',
      'source_trace',
      'correction_model_trace',
      'operation_decomposition',
      'answer_form_decomposition',
      'op_row_mapping',
      'year2_candidate_mapping',
      'mtu_task_family_status',
      'blockers',
    ]) {
      assertArray(item[field], `${caseId}.${field}`);
      assert(item[field].length > 0, `${caseId}.${field} must not be empty`);
    }
    assert(item.official_prompt_trace.length === questionCount, `${caseId} prompt trace count mismatch`);
    assert(item.correction_model_trace.length === questionCount, `${caseId} correction trace count mismatch`);
    for (const opRow of item.op_row_mapping) {
      assert(operationSpineRows.has(opRow), `${caseId} op_row_mapping ${opRow} is not in ${OPERATION_SPINE}`);
    }
    checkTaskFamilyStatus(item);
    for (const blocker of item.blockers) assertBlocker(blocker, caseId);
    assert(/mapping_only|boundary_split_required/.test(item.review_decision), `${caseId} review decision must be mapping-only or boundary split`);
  }

  const nonpayment = byId.get('Y2-W1-B7-NONPAYMENT-Q12-Q15');
  assert(
    nonpayment.source_trace.some(
      (source) =>
        source.source_id === 'figuur-1-kredietverzekering-en-voorwaarden' &&
        source.locator === 'references/external/exams/vw-1022-a-23-1-o.pdf#page=6' &&
        source.type === 'figure_and_conditions_context' &&
        JSON.stringify(source.needed_for_questions) === JSON.stringify([12, 13, 14])
    ),
    'Book 7 non-payment case must record page 6 credit-insurance figure/conditions source trace'
  );
  assert(
    nonpayment.answer_form_decomposition.includes('adverse_selection_explanation'),
    'Book 7 non-payment case must include adverse_selection_explanation in answer-form decomposition'
  );

  const green = byId.get('Y2-W1-B8-GREEN-GROWTH-Q22-Q23');
  assert(green.op_row_mapping.includes('OP-MP1'), 'green-growth case must expose OP-MP1 boundary');
  assert(
    green.blockers.some((blocker) => blocker.id === 'Y2W1-B8-GREEN-MACRO-BOUNDARY'),
    'green-growth case must carry macro-boundary blocker'
  );

  const update = overlay.integrated_update || {};
  assertArray(update.candidate_dispositions_improved, 'integrated_update.candidate_dispositions_improved');
  for (const id of ['Y2-B5-P09', 'Y2-B6-P08', 'Y2-B7-P10', 'Y2-B8-P04', 'Y2-B8-P14']) {
    assert(update.candidate_dispositions_improved.includes(id), `integrated update missing improved candidate ${id}`);
  }
  assert(
    (update.merge_move_split_or_defer_recommendations || []).some((item) => item.candidate_id === 'Y2-B5-P06'),
    'integrated update must carry Y2-B5-P06 count caution'
  );
  assert(
    (update.merge_move_split_or_defer_recommendations || []).some((item) => item.candidate_id === 'Y2-B6-P13'),
    'integrated update must carry Y2-B6-P13 count caution'
  );
}

function checkFindingClassifications(relPath, text) {
  for (const oldLabel of FORBIDDEN_OLD_FINDING_CLASSIFICATIONS) {
    assert(!text.includes(oldLabel), `${relPath} contains retired finding classification ${oldLabel}`);
  }

  const findingLines = text.split(/\r?\n/).filter((line) => /^\|\s*Y2W1-\d{3}\s*\|/.test(line));
  assert(findingLines.length > 0, `${relPath} must include Y2W1 finding rows`);
  for (const line of findingLines) {
    const cells = line.split('|').map((cell) => cell.trim());
    const id = cells[1];
    const classification = (cells[2] || '').replace(/`/g, '');
    assert(
      ALLOWED_FINDING_CLASSIFICATIONS.has(classification),
      `${relPath} finding ${id} has invalid REV-STD-1 classification ${classification}`
    );
  }
}

function checkReviewPacket(packet) {
  assert(packet.packet_id === 'Y2-EXAM-ANCHOR-INGESTION-WAVE-1', 'packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'packet throughput class mismatch');
  assert(packet.authority_class === 'high_authority', 'authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet must remain L4');
  assert(packet.human_decision_required === true, 'human decision required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must remain false');
  assert(packet.authority_claims?.year2_exam_anchor_wave_ready === true, 'wave readiness flag missing');
  assert(packet.authority_claims?.official_exam_evidence_wave_complete === true, 'wave complete flag missing');
  assertFalseFields(packet.authority_claims, FALSE_AUTHORITY_KEYS, 'packet.authority_claims');

  assert(packet.wave_summary?.selected_case_count === 5, 'packet selected case count mismatch');
  assert(packet.wave_summary?.selected_question_count === 17, 'packet selected question count mismatch');
  assert(packet.wave_summary?.q3_status === 'complementary_planning_evidence_only', 'Q3 packet status mismatch');
  assert(packet.wave_summary?.q19_status === 'hold', 'Q19 packet status mismatch');
  assert(packet.wave_summary?.q23_status === 'macro_boundary_split_required', 'q23 packet status mismatch');

  for (const relPath of REQUIRED_CHANGED_PATHS) {
    assert((packet.changed_paths || []).includes(relPath), `changed_paths missing ${relPath}`);
  }
  for (const relPath of packet.changed_paths || []) assertNoForbiddenPath(relPath);

  const status = packet.decision?.status;
  assert(
    ['ready_for_read_only_lead_review', 'ready_for_human_review'].includes(status),
    'decision status must be ready_for_read_only_lead_review or ready_for_human_review'
  );

  const checklist = packet.core_requirement_checklist || [];
  assert(checklist.length > 0, 'core requirement checklist must be non-empty');
  if (status === 'ready_for_human_review') {
    assert(
      packet.review_autonomy?.lead_review_result === 'PASS_WITH_FLAGS_READ_ONLY_LEAD_REVIEW_NO_MISSING_CORE_REQUIREMENTS' ||
        packet.review_autonomy?.lead_review_result === 'PASS_READ_ONLY_LEAD_REVIEW_NO_BLOCKERS',
      'final packet must record passing read-only lead review'
    );
    for (const item of checklist) {
      assert(item.status === 'met', `core requirement must be met: ${item.requirement || 'unnamed'}`);
    }
    const leadReviews = packet.proof?.lead_reviews || {};
    assert(Object.keys(leadReviews).length >= 5, 'final packet must include read-only lead reviews');
    for (const [key, review] of Object.entries(leadReviews)) {
      assert(Array.isArray(review.blockers), `lead review ${key} must list blockers`);
      assert(review.blockers.length === 0, `lead review ${key} must have no unresolved blockers`);
    }
    const checkers = packet.proof?.checkers || [];
    assert(checkers.some((item) => item.command === 'node build-scripts/references/check-y2-exam-anchor-ingestion-wave-1.js' && item.status === 'passed'), 'final packet missing checker proof');
  } else {
    assert(packet.review_autonomy?.lead_review_result === 'PENDING_READ_ONLY_LEAD_REVIEW', 'pre-review packet must mark lead review pending');
    assert(checklist.some((item) => item.requirement === 'Read-only lead review complete' && item.status === 'pending'), 'pre-review packet must carry pending lead review checklist item');
  }
}

function checkDocs() {
  for (const relPath of DOCS) {
    const text = readText(relPath);
    assertIncludes(text, '../4veco-lessen/specifications/product-end-state.md', relPath);
    assertIncludes(text, 'references/owned/course-blueprint-v6-three-year.md', relPath);
    assert(!/production-ready/i.test(text), `${relPath} must not use production-ready language`);
  }

  const evidence = readText('reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-evidence-packet.md');
  for (const required of [
    'Pensioenmodel',
    'De Woningmarkt In De Knel',
    'Bij Wanbetaling Afrekenen',
    'IJssalon',
    'Groen Ontgroeien',
    'q23 is useful evidence',
    'Q19 remains HOLD',
    'vw-1022-a-23-1-o.pdf#page=6',
    'bonus-malus system',
  ]) {
    assertIncludes(evidence, required, 'evidence packet');
  }

  const quality = readText('reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-quality-log.md');
  for (const field of ['blocks:', 'does_not_block:', 'proof_required_to_close:']) {
    assertIncludes(quality, field, 'quality log');
  }
  checkFindingClassifications('reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-quality-log.md', quality);
  checkFindingClassifications(
    'reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-review-packet.md',
    readText('reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-review-packet.md')
  );
}

function checkForbiddenStorage() {
  assert(!fs.existsSync(file('references/data/exam-ingestion/operation-candidates.json')), 'operation candidate storage must remain absent');
  assert(!fs.existsSync(file('references/data/exam-ingestion/answer-skill-candidates.json')), 'answer-skill candidate storage must remain absent');
}

function main() {
  checkOverlay(readJson(OVERLAY));
  checkReviewPacket(readJson(REVIEW_PACKET));
  checkDocs();
  checkForbiddenStorage();
  console.log('OK Y2-EXAM-ANCHOR-INGESTION-WAVE-1: official exam evidence wave validated');
}

main();
