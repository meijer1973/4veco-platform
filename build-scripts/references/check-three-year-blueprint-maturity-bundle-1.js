const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PACKET = 'THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1';
const CANONICAL_V6 = 'references/owned/course-blueprint-v6-three-year.md';
const CANONICAL_V6_META = 'references/owned/course-blueprint-v6-three-year.meta.json';

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

function rejectIncludes(text, needle, label) {
  assert(!text.includes(needle), `${label} must not contain stale phrase: ${needle}`);
}

function checkCanonicalV6Source() {
  const text = readText(CANONICAL_V6);
  for (const stale of [
    'Draft Load Envelopes',
    'Exact Year 2 and Year 3 paragraph counts are not set',
    '| 11 | To decide |',
    'Book 11 design remain unresolved',
    'Book 11 must be designed as exam operation training, not only a practice-paper folder',
  ]) rejectIncludes(text, stale, CANONICAL_V6);

  for (const required of [
    'Status: owned three-year umbrella planning end-state authority',
    'Maturity packet: `THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1`',
    '## Final Planning Count Model',
    '| 5 | 13 | 13 |',
    '| 6 | 13 | 13 |',
    '| 7 | 14 | 14 |',
    '| 8 | 16 | 16 |',
    '| 9 | 14 | 14 |',
    '| 10 | 15 | 15 |',
    '| 11 | 9 | 13 |',
    'Full course: 148 count-bearing lessons/modules / 152 scheduled',
    'Book 11 is final exam training: 9 count-bearing modules plus 4 scheduled',
    'Q19 remains an exact HOLD only for its own source/graph reconstruction',
    'It does not block Book 10 architecture, q23/q24,',
    '## Production Critical Path',
    'Book 5 pension/time/stock-flow source-family target packet',
    'Book 6 housing finance and rent-market mixed-case target packet',
    'Book 7 credit insurance, moral hazard, adverse selection, principal-agent',
    'Book 8 Q15/Q16 dominant-strategy, prisoner',
    'Book 9 fiscal/output-gap target packet',
    'Book 10 q23/q24 monetary-effectiveness target packet',
    'Book 11 `M01-M04` answer-operation training packet',
    'BLUEPRINT-CHANGE-REVIEW',
    'This source does not authorize:',
    'editing `references/machine/*`',
    'editing `references/external/*`',
    'editing `references/authored/course-target-exercises.json`',
    'claiming CP-6, Scale Gate 1, product-readiness, or student/product-use',
  ]) assertIncludes(text, required, CANONICAL_V6);
}

function assertNumber(value, expected, label) {
  assert(value === expected, `${label} expected ${expected}, got ${value}`);
}

function checkCanonicalV6Meta() {
  const meta = readJson(CANONICAL_V6_META);
  assert(meta.source_id === 'owned:course-blueprint-v6-three-year', 'v6 meta source id mismatch');
  assert(meta.canonical_owned_source === true, 'v6 meta must remain canonical owned source');
  assert(meta.completion_status === 'planning_end_state_frozen_by_three_year_blueprint_maturity_bundle_1', 'v6 meta completion status mismatch');
  assert(meta.planning_end_state_status === 'frozen_planning_baseline', 'v6 meta planning end-state status mismatch');
  assert(meta.maturity_packet_id === PACKET, 'v6 meta maturity packet mismatch');
  assert(meta.active_year_1_baseline === 'owned:course-blueprint-v5', 'v6 meta must preserve v5 as Year 1 baseline');
  assert(meta.does_not_replace_year_1_detail_until_explicit_migration === true, 'v6 meta must preserve v5 detail boundary');

  const model = meta.final_planning_count_model || {};
  assert(model.status === 'accepted_planning_end_state', 'v6 meta count model status mismatch');
  assert(model.route === '4+4+3', 'v6 meta route mismatch');
  assertNumber(model.count_bearing_total, 148, 'v6 meta count-bearing total');
  assertNumber(model.scheduled_total, 152, 'v6 meta scheduled total');
  const counts = model.count_bearing_by_book || {};
  const scheduled = model.scheduled_by_book || {};
  for (const [book, expected] of Object.entries({
    1: 12,
    2: 12,
    3: 14,
    4: 16,
    5: 13,
    6: 13,
    7: 14,
    8: 16,
    9: 14,
    10: 15,
    11: 9,
  })) assertNumber(counts[book], expected, `v6 meta count-bearing Book ${book}`);
  for (const [book, expected] of Object.entries({
    1: 12,
    2: 12,
    3: 14,
    4: 16,
    5: 13,
    6: 13,
    7: 14,
    8: 16,
    9: 14,
    10: 15,
    11: 13,
  })) assertNumber(scheduled[book], expected, `v6 meta scheduled Book ${book}`);
  assertNumber(model.count_bearing_by_year?.['1'], 54, 'v6 meta Year 1 count');
  assertNumber(model.count_bearing_by_year?.['2'], 56, 'v6 meta Year 2 count');
  assertNumber(model.count_bearing_by_year?.['3'], 38, 'v6 meta Year 3 count');
  assertNumber(model.scheduled_by_year?.['3'], 42, 'v6 meta Year 3 scheduled');
  assertNumber(model.book_11_model?.count_bearing_modules, 9, 'v6 meta Book 11 count-bearing modules');
  assertNumber(model.book_11_model?.scheduled_timed_paper_repair_cycles, 4, 'v6 meta Book 11 cycles');
  assertNumber(model.book_11_model?.scheduled_total, 13, 'v6 meta Book 11 scheduled total');
  assert(model.year_2_decisions?.y2_b5_p06 === 'absorbed_non_standalone', 'v6 meta Y2-B5-P06 decision mismatch');
  assert(model.year_2_decisions?.y2_b6_p13 === 'deferred_non_count_bearing', 'v6 meta Y2-B6-P13 decision mismatch');

  const control = meta.frozen_baseline_change_control || {};
  assert(control.status === 'frozen_planning_baseline', 'v6 meta change-control status mismatch');
  assert(control.rule === 'BLUEPRINT-CHANGE-REVIEW', 'v6 meta change-control rule mismatch');
  for (const required of [
    'route_change',
    'book_role_change',
    'book_count_change',
    'book_11_model_change',
    'q19_hold_boundary_change',
    'production_critical_path_change',
  ]) assert((control.requires_review_for || []).includes(required), `v6 meta change-control missing ${required}`);
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
  assert(packet.authority_claims?.owned_blueprint_source_mutation_reviewed === true, 'owned v6 source mutation must be reviewed');
  assert(packet.authority_claims?.owned_blueprint_metadata_mutation_reviewed === true, 'owned v6 metadata mutation must be reviewed');
  assertIncludes(packet.authority_claims?.owned_blueprint_mutation_scope || '', 'course-blueprint-v6-three-year', 'owned blueprint mutation scope');

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
  for (const relPath of [CANONICAL_V6, CANONICAL_V6_META]) {
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
    assert(packet.proof?.lead_reviews?.canonical_source_report_parity, 'canonical source/report parity lead review missing');
  }
}

function main() {
  for (const relPath of DOCS) assert(fs.existsSync(path.join(ROOT, relPath)), `missing ${relPath}`);
  for (const relPath of [CANONICAL_V6, CANONICAL_V6_META]) assert(fs.existsSync(path.join(ROOT, relPath)), `missing ${relPath}`);
  checkCanonicalV6Source();
  checkCanonicalV6Meta();
  checkDocs();
  checkPacket();
  if (!process.exitCode) console.log(`OK ${PACKET}: maturity packet validated`);
}

main();
