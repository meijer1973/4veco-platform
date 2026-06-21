const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PACKET = 'THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1';

const DOCS = [
  'reports/sprints/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-plan.md',
  'reports/sprints/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-result.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-architecture-matrix.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-count-model.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-evidence-wave-overlay.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-assessment-retrieval-spine.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-operation-coverage-matrix.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-official-evidence-coverage-matrix.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-candidate-status-index.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-target-mtu-backlog.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-book11-full-paper-repair-protocol.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-production-order-roadmap.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-maturity-change-control.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-quality-log.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-review-packet.md',
  'reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-subagent-review.md',
  'reports/review-gates/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1/review-packet.json',
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

function checkFindingClassifications(relPath) {
  const text = readText(relPath);
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.startsWith('| TYBM-')) continue;
    const cells = line.split('|').map((cell) => cell.trim());
    const id = cells[1];
    const classification = (cells[2] || '').replace(/`/g, '');
    assert(ALLOWED_FINDING_CLASSIFICATIONS.has(classification), `${relPath} finding ${id} invalid classification ${classification}`);
  }
}

function checkDocs() {
  for (const relPath of DOCS) {
    const text = readText(relPath);
    assertIncludes(text, '../4veco-lessen/specifications/product-end-state.md', relPath);
    assertIncludes(text, 'references/owned/course-blueprint-v6-three-year.md', relPath);
    assert(!/student-facing product end state ready/i.test(text), `${relPath} must not claim student-facing product end state`);
  }

  const architecture = readText('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-architecture-matrix.md');
  for (const required of [
    'Final 4+4+3 Route',
    '| 11 | Year 3 TW3 | Integrated policy and final exam training | 9 count-bearing modules plus 4 timed-paper/repair cycles |',
    'Book 8 does not absorb macro stabilization',
    'Book 11 does not introduce a large new theory domain',
  ]) assertIncludes(architecture, required, 'architecture matrix');

  const count = readText('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-count-model.md');
  for (const required of [
    '| 5 | 13 | 0 | `Y2-B5-P06` absorbed',
    '| 6 | 13 | 0 | `Y2-B6-P13` stays deferred/non-count-bearing',
    '| 11 | 9 | 4 | `M01-M08` and `M13` are count-bearing',
    '| Full course | 148 | 152 |',
  ]) assertIncludes(count, required, 'count model');

  const evidence = readText('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-evidence-wave-overlay.md');
  for (const required of [
    'vw-1022-a-24-2-o:q6-q15',
    'vw-1022-a-25-1-o:q23-q24',
    'vw-1022-a-23-2-o:q21-q24',
    'vw-1022-a-24-2-o:q27-q28',
    'Q19 does not block',
  ]) assertIncludes(evidence, required, 'evidence overlay');

  const candidate = readText('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-candidate-status-index.md');
  for (const required of [
    'Y2-B5-P01',
    'Y2-B6-P13',
    'Y3-B10-P15',
    'Y3-B11-M13',
    'No candidate has unknown maturity status',
  ]) assertIncludes(candidate, required, 'candidate status index');

  const change = readText('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-maturity-change-control.md');
  assertIncludes(change, 'BLUEPRINT-CHANGE-REVIEW', 'change control');

  checkOperationRowParity();

  checkFindingClassifications('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-quality-log.md');
  checkFindingClassifications('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-review-packet.md');
}

function operationIdsFromAnchorMatrix() {
  const anchor = readText('reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md');
  const ids = new Set();
  for (const match of anchor.matchAll(/\|\s*(OP-[A-Z0-9]+)\s/g)) ids.add(match[1]);
  return [...ids].sort();
}

function checkOperationRowParity() {
  const coverage = readText('reports/reference-planning/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1-operation-coverage-matrix.md');
  const missing = operationIdsFromAnchorMatrix().filter((id) => !coverage.includes(`\`${id}\``));
  assert(missing.length === 0, `operation coverage missing ids: ${missing.join(', ')}`);
  assertIncludes(coverage, '`OP-A3`', 'operation coverage');
  assertIncludes(coverage, '`OP-G3`', 'operation coverage');
  assertIncludes(coverage, 'Book 5/6 real-nominal/deflator target work', 'operation coverage');
  assertIncludes(coverage, 'Q19-specific repair where applicable', 'operation coverage');
}

function checkPacket() {
  const packet = readJson('reports/review-gates/THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1/review-packet.json');
  assert(packet.packet_id === PACKET, 'packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'throughput class mismatch');
  assert(packet.authority_class === 'high_authority', 'authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet must remain L4');
  assert(packet.human_decision_required === true, 'human review required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must remain false');
  assert(packet.authority_claims?.three_year_blueprint_planning_end_state_ready === true, 'planning readiness flag missing');
  assertFalseFields(packet.authority_claims, FALSE_AUTHORITY_KEYS, 'authority_claims');

  const summary = packet.maturity_summary || {};
  assert(summary.route === '4+4+3', 'route mismatch');
  assert(summary.book_count === 11, 'book count mismatch');
  assert(summary.year1_count_bearing === 54, 'year1 count mismatch');
  assert(summary.year2_count_bearing === 56, 'year2 count mismatch');
  assert(summary.year3_count_bearing === 38, 'year3 count mismatch');
  assert(summary.full_course_count_bearing === 148, 'full course count mismatch');
  assert(summary.full_course_scheduled === 152, 'full course scheduled mismatch');
  assert(summary.book5_count_bearing === 13, 'Book 5 count mismatch');
  assert(summary.book6_count_bearing === 13, 'Book 6 count mismatch');
  assert(summary.book11_count_bearing_modules === 9, 'Book 11 count mismatch');
  assert(summary.book11_practice_repair_cycles === 4, 'Book 11 cycle count mismatch');
  assert(summary.y2_b5_p06_decision === 'absorbed_non_standalone', 'Y2-B5-P06 decision mismatch');
  assert(summary.y2_b6_p13_decision === 'deferred_non_count_bearing', 'Y2-B6-P13 decision mismatch');
  assert(summary.q19_status === 'exact_hold_narrow_boundary', 'Q19 status mismatch');

  for (const relPath of DOCS) {
    assert((packet.changed_paths || []).includes(relPath), `changed_paths missing ${relPath}`);
  }

  const status = packet.decision?.status;
  assert(['ready_for_read_only_lead_review', 'ready_for_human_review'].includes(status), 'invalid decision status');
  const checklist = packet.core_requirement_checklist || [];
  assert(checklist.length >= 10, 'core checklist too short');
  const leadItem = checklist.find((item) => item.requirement === 'Read-only lead review complete');
  assert(leadItem, 'lead review checklist item missing');
  if (status === 'ready_for_human_review') {
    assert(packet.review_autonomy?.lead_review_result.includes('NO_MISSING_CORE_REQUIREMENTS'), 'final packet must record no missing core requirements');
    for (const item of checklist) assert(item.status === 'met', `core requirement must be met: ${item.requirement}`);
    assert(Object.keys(packet.proof?.lead_reviews || {}).length >= 8, 'final packet needs eight lead reviews');
  }
}

function main() {
  for (const relPath of DOCS) assert(fs.existsSync(path.join(ROOT, relPath)), `missing ${relPath}`);
  checkDocs();
  checkPacket();
  if (!process.exitCode) console.log(`OK ${PACKET}: maturity packet validated`);
}

main();
