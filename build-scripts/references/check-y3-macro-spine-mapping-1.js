#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const REVIEW_PACKET = 'reports/review-gates/Y3-MACRO-SPINE-MAPPING-1/review-packet.json';

const DOCS = [
  'reports/sprints/Y3-MACRO-SPINE-MAPPING-1-plan.md',
  'reports/sprints/Y3-MACRO-SPINE-MAPPING-1-result.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-architecture.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-candidate-matrix.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-evidence-routing.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-retrieval-spine.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-quality-log.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-review-packet.md',
  'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-subagent-review.md',
];

const REQUIRED_CHANGED_PATHS = [
  'build-scripts/references/check-y3-macro-spine-mapping-1.js',
  ...DOCS,
  REVIEW_PACKET,
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

const ALLOWED_FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'quality_improvement_available',
  'minor_carry_flag',
  'scale_blocker',
  'core_spec_failure',
]);

function fail(message) {
  console.error(`Y3-MACRO-SPINE-MAPPING-1 check failed: ${message}`);
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

function assertIncludes(text, needle, label) {
  assert(text.includes(needle), `${label} missing ${needle}`);
}

function assertFalseFields(object, keys, label) {
  for (const key of keys) assert(object?.[key] === false, `${label}.${key} must be false`);
}

function assertNoForbiddenPath(relPath) {
  assert(!/^references\/(authored|machine|external)\//i.test(relPath), `protected source path must not be changed: ${relPath}`);
  assert(!/^references\/data\/course-target-exercises/i.test(relPath), `target registry path must not be changed: ${relPath}`);
  assert(!/(^|\/)Boek\s+\d+\s+-\s+/i.test(relPath), `generated lesson path must not be changed: ${relPath}`);
}

function checkFindingClassifications(relPath, text) {
  const findingLines = text.split(/\r?\n/).filter((line) => /^\|\s*Y3MS-\d{3}\s*\|/.test(line));
  assert(findingLines.length > 0, `${relPath} must include Y3MS finding rows`);
  for (const line of findingLines) {
    const cells = line.split('|').map((cell) => cell.trim());
    const id = cells[1];
    const classification = (cells[2] || '').replace(/`/g, '');
    assert(ALLOWED_FINDING_CLASSIFICATIONS.has(classification), `${relPath} finding ${id} invalid classification ${classification}`);
  }
}

function checkCandidateMatrix() {
  const matrix = readText('reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-candidate-matrix.md');
  const lines = matrix.split(/\r?\n/);
  const book9 = lines.filter((line) => /^\|\s*Y3-B9-P\d{2}\s/.test(line)).length;
  const book10 = lines.filter((line) => /^\|\s*Y3-B10-P\d{2}\s/.test(line)).length;
  const book11 = lines.filter((line) => /^\|\s*Y3-B11-M\d{2}\s/.test(line)).length;
  assert(book9 === 14, `Book 9 candidate count must be 14, found ${book9}`);
  assert(book10 === 15, `Book 10 candidate count must be 15, found ${book10}`);
  assert(book11 === 13, `Book 11 module count must be 13, found ${book11}`);
  for (const disposition of ['mapping_ready', 'evidence_needed', 'decomposition_needed', 'deferred']) {
    assertIncludes(matrix, disposition, 'candidate matrix');
  }
  for (const required of [
    'Y3-B10-P04 IS-curve slope and monetary effectiveness',
    'vw-1022-a-25-1-o:q23',
    'Y3-B11-M09 Timed full-paper cycle A',
    'Y3-B11-M13 Final synthesis and exam plan',
    'missing; count-bearing capstone',
    'not a target paragraph',
    'Q19 still held',
  ]) {
    assertIncludes(matrix, required, 'candidate matrix');
  }
}

function checkDocs() {
  for (const relPath of DOCS) {
    const text = readText(relPath);
    assertIncludes(text, '../4veco-lessen/specifications/product-end-state.md', relPath);
    assertIncludes(text, 'references/owned/course-blueprint-v6-three-year.md', relPath);
    assert(!/production-ready/i.test(text), `${relPath} must not use production-ready language`);
  }

  const architecture = readText('reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-architecture.md');
  for (const required of [
    'Book 9: Keynesian Macro And Fiscal Policy',
    'Book 10: Monetary Policy, IS-MB-GA, And Open Economy',
    'Book 11: Integrated Policy And Final Exam Training',
    'Book 9 = 14',
    'Book 10 = 15',
    '9 count-bearing modules: `M01-M08` and `M13`',
    '13 total scheduled modules/cycles',
    'timed paper cycles, not ordinary textbook paragraphs',
    'Book 8 keeps growth, green GDP, public finance, and strategy foundations; macro stabilization starts in Book 9',
  ]) {
    assertIncludes(architecture, required, 'architecture');
  }

  const evidence = readText('reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-evidence-routing.md');
  for (const required of [
    'vw-1022-a-25-1-o:q23',
    'vw-1022-a-24-2-o:q6-q15',
    'vw-1022-a-24-2-o:q27-q28',
    'full exam PDFs',
    'Q19 remains on exact HOLD',
    'Q19 does not block Book 10 architecture',
    'q23/q24 monetary-policy evidence',
  ]) {
    assertIncludes(evidence, required, 'evidence routing');
  }

  const quality = readText('reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-quality-log.md');
  for (const field of ['blocks:', 'does_not_block:', 'proof_required_to_close:']) {
    assertIncludes(quality, field, 'quality log');
  }
  assertIncludes(quality, 'Q19-specific source/graph reconstruction', 'quality log');
  assertIncludes(quality, 'Book 10 architecture, q23/q24 monetary-policy evidence', 'quality log');
  assert(!quality.includes('monetary-policy closure'), 'quality log must narrow Q19 blocker wording');
  checkFindingClassifications('reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-quality-log.md', quality);
  checkFindingClassifications(
    'reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-review-packet.md',
    readText('reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-review-packet.md')
  );
}

function checkReviewPacket(packet) {
  assert(packet.packet_id === 'Y3-MACRO-SPINE-MAPPING-1', 'packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'packet throughput class mismatch');
  assert(packet.authority_class === 'high_authority', 'authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet must remain L4');
  assert(packet.human_decision_required === true, 'human decision required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must remain false');
  assert(packet.authority_claims?.year3_macro_spine_ready === true, 'Year 3 readiness flag missing');
  assertFalseFields(packet.authority_claims, FALSE_AUTHORITY_KEYS, 'packet.authority_claims');
  assert(packet.wave_summary?.book_9_candidate_count === 14, 'Book 9 count mismatch');
  assert(packet.wave_summary?.book_10_candidate_count === 15, 'Book 10 count mismatch');
  assert(packet.wave_summary?.book_11_module_count === 13, 'Book 11 module count mismatch');
  assert(packet.wave_summary?.book_11_count_bearing_modules === 9, 'Book 11 count-bearing module count mismatch');
  assert(packet.wave_summary?.q23_status === 'routed_to_book_10_monetary_policy_effectiveness', 'q23 status mismatch');
  assert(packet.wave_summary?.q19_status === 'hold', 'Q19 status mismatch');

  for (const relPath of REQUIRED_CHANGED_PATHS) {
    assert((packet.changed_paths || []).includes(relPath), `changed_paths missing ${relPath}`);
  }
  for (const relPath of packet.changed_paths || []) assertNoForbiddenPath(relPath);

  const status = packet.decision?.status;
  assert(['ready_for_read_only_lead_review', 'ready_for_human_review'].includes(status), 'invalid decision status');
  const checklist = packet.core_requirement_checklist || [];
  assert(checklist.length > 0, 'core requirement checklist must be non-empty');
  if (status === 'ready_for_human_review') {
    assert(packet.review_autonomy?.lead_review_result.includes('NO_MISSING_CORE_REQUIREMENTS'), 'final packet must record no missing core requirement');
    for (const item of checklist) assert(item.status === 'met', `core requirement must be met: ${item.requirement}`);
    const leadReviews = packet.proof?.lead_reviews || {};
    assert(Object.keys(leadReviews).length >= 7, 'final packet must include read-only lead reviews');
    for (const [key, review] of Object.entries(leadReviews)) {
      assert(Array.isArray(review.blockers), `lead review ${key} must list blockers`);
      assert(review.blockers.length === 0, `lead review ${key} must have no unresolved blockers`);
    }
    const checkers = packet.proof?.checkers || [];
    assert(checkers.some((item) => item.command === 'node build-scripts/references/check-y3-macro-spine-mapping-1.js' && item.status === 'passed'), 'final packet missing checker proof');
  } else {
    assert(packet.review_autonomy?.lead_review_result === 'PENDING_READ_ONLY_LEAD_REVIEW', 'pre-review packet must mark lead review pending');
  }
}

function main() {
  checkReviewPacket(readJson(REVIEW_PACKET));
  checkDocs();
  checkCandidateMatrix();
  console.log('OK Y3-MACRO-SPINE-MAPPING-1: Year 3 macro spine packet validated');
}

main();
