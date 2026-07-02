#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const REVIEW_PACKET = 'reports/review-gates/Y2-ROOT-MAPPING-1/review-packet.json';

const DOCS = [
  'reports/sprints/Y2-ROOT-MAPPING-1-plan.md',
  'reports/sprints/Y2-ROOT-MAPPING-1-result.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-book-architecture.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-paragraph-candidate-matrix.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-exam-anchor-backlog.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-book8-compression-review.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-assessment-retrieval-spine.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-quality-log.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-review-packet.md',
  'reports/reference-planning/Y2-ROOT-MAPPING-1-subagent-review.md',
];

const FALSE_AUTHORITY_KEYS = [
  'official_exam_operation_closure_authorized',
  'broad_operation_row_closure_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'source_annex_extraction_execution_authorized',
  'target_registry_mutation_in_scope',
  'target_registry_records_created',
  'mtus_minted',
  'machine_sources_mutated',
  'external_sources_mutated',
  'authored_sources_mutated',
  'generated_lesson_output_authorized',
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

const REQUIRED_CHANGED_PATHS = [
  'build-scripts/references/check-y2-root-mapping-1.js',
  'references/data/document_inventory.json',
  'references/data/source-document-registry.json',
  'references/data/source_manifest.json',
  'reports/github-agent-index-lessen.json',
  'reports/github-agent-index-lessen.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
  'reports/internal-dashboard/dashboard-data.json',
  'reports/internal-dashboard/index.html',
  'reports/json/source-document-registry.json',
  'reports/markdown/source-document-registry.md',
  ...DOCS,
  REVIEW_PACKET,
];

function fail(message) {
  console.error(`Y2-ROOT-MAPPING-1 check failed: ${message}`);
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

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function countMatrixRows(text, prefix) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.startsWith(`| ${prefix}`)).length;
}

function assertIncludes(text, needle, relPath) {
  assert(text.includes(needle), `${relPath} missing ${needle}`);
}

function assertAuthorityFalse(packet) {
  const claims = packet.authority_claims || {};
  for (const key of FALSE_AUTHORITY_KEYS) {
    assert(claims[key] === false, `authority_claims.${key} must be false`);
  }
}

function assertReviewPacket(packet) {
  assert(packet.packet_id === 'Y2-ROOT-MAPPING-1', 'packet id mismatch');
  assert(packet.sprint_id === 'Y2-ROOT-MAPPING-1', 'sprint id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'packet must be high authority');
  assert(packet.authority_class === 'high_authority', 'authority class must be high authority');
  assert(packet.review_autonomy?.level === 'L4', 'packet must remain L4');
  assert(packet.review_autonomy?.lead_review_result === 'PASS_WITH_FLAGS_READ_ONLY_LEAD_REVIEW_NO_MISSING_CORE_REQUIREMENTS', 'lead review result must be final and non-pending');
  assert(packet.human_decision_required === true, 'human decision required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must remain false');
  assert(packet.authority_claims?.year2_root_mapping_ready === true, 'year2 root mapping readiness must be true');
  assert(packet.authority_claims?.curriculum_mapping_only === true, 'curriculum mapping flag must be true');
  assertAuthorityFalse(packet);

  const counts = packet.count_model || {};
  assert(counts.book_5 === 14, 'Book 5 count must be 14');
  assert(counts.book_6 === 14, 'Book 6 count must be 14');
  assert(counts.book_7 === 14, 'Book 7 count must be 14');
  assert(counts.book_8 === 16, 'Book 8 count must be 16');
  assert(counts.total === 58, 'Year 2 total count must be 58');

  assert(packet.q3_grouping_decision?.planning_anchor_id === 'Y2-Q3-COMPOUND-INSURANCE-THRESHOLD', 'Q3 compound planning anchor missing');
  assert(packet.q3_grouping_decision?.storage_mutation_authorized === false, 'Q3 storage mutation must be false');
  assert(Array.isArray(packet.q3_grouping_decision?.broad_rows_closed), 'Q3 broad rows closed must be an array');
  assert(packet.q3_grouping_decision.broad_rows_closed.length === 0, 'Q3 must not close broad rows');
  assert(packet.q15_integration?.decision === 'two_link_planning_anchor', 'Q15 integration decision missing');
  assert(packet.q15_integration?.storage_mutation_authorized === false, 'Q15 storage mutation must be false');
  assert(Array.isArray(packet.q15_integration?.broad_rows_closed), 'Q15 broad rows closed must be an array');
  assert(packet.q15_integration.broad_rows_closed.length === 0, 'Q15 must not close broad rows');
  assert(packet.q19_hold?.status === 'hold', 'Q19 must remain hold');
  assert((packet.q19_hold?.does_not_block || []).includes('year2_root_mapping'), 'Q19 must not block Year 2 root mapping');
  assert(packet.decision?.status === 'ready_for_human_review', 'decision status must be ready_for_human_review');

  const checklist = packet.core_requirement_checklist || [];
  assert(checklist.length > 0, 'core requirement checklist must be non-empty');
  for (const item of checklist) {
    assert(item.status === 'met', `core requirement must be met: ${item.requirement || 'unnamed'}`);
  }

  const leadReviews = packet.proof?.lead_reviews || {};
  assert(Object.keys(leadReviews).length >= 6, 'proof.lead_reviews must include all six read-only lead reviews');
  for (const [key, review] of Object.entries(leadReviews)) {
    assert(Array.isArray(review.blockers), `lead review ${key} must list blockers`);
    assert(review.blockers.length === 0, `lead review ${key} must have no unresolved blockers`);
  }

  const checkerProof = packet.proof?.checkers || [];
  assert(checkerProof.length >= 3, 'proof.checkers must include recorded checker proof');
  for (const command of [
    'node --check build-scripts/references/check-y2-root-mapping-1.js',
    'node build-scripts/references/check-y2-root-mapping-1.js',
    'npm.cmd run check:review-throughput -- reports/review-gates/Y2-ROOT-MAPPING-1/review-packet.json',
  ]) {
    assert(
      checkerProof.some((item) => item.command === command && item.status === 'passed'),
      `proof.checkers missing passed command: ${command}`
    );
  }

  for (const relPath of REQUIRED_CHANGED_PATHS) {
    assert((packet.changed_paths || []).includes(relPath), `changed_paths missing ${relPath}`);
  }

  for (const relPath of packet.changed_paths || []) {
    assert(!/^references\/(authored|machine|external)\//i.test(relPath), `protected source path must not be changed: ${relPath}`);
    assert(!/^references\/data\/course-target-exercises/i.test(relPath), `target registry path must not be changed: ${relPath}`);
    assert(!/(^|\/)Boek\s+\d+\s+-\s+/i.test(relPath), `generated lesson path must not be changed: ${relPath}`);
  }
}

function assertDocs() {
  for (const relPath of DOCS) {
    const text = readText(relPath);
    assertIncludes(text, '../4veco-lessen/specifications/product-end-state.md', relPath);
    assertIncludes(text, 'references/owned/course-blueprint-v6-three-year.md', relPath);
  }

  for (const relPath of [
    'reports/reference-planning/Y2-ROOT-MAPPING-1-book-architecture.md',
    'reports/reference-planning/Y2-ROOT-MAPPING-1-paragraph-candidate-matrix.md',
    'reports/reference-planning/Y2-ROOT-MAPPING-1-exam-anchor-backlog.md',
    'reports/reference-planning/Y2-ROOT-MAPPING-1-book8-compression-review.md',
    'reports/reference-planning/Y2-ROOT-MAPPING-1-review-packet.md',
  ]) {
    const text = readText(relPath);
    assertIncludes(text, 'reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md', relPath);
    assertIncludes(text, 'reports/reference-planning/EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1-atomic-status.md', relPath);
  }

  const matrix = readText('reports/reference-planning/Y2-ROOT-MAPPING-1-paragraph-candidate-matrix.md');
  assert(countMatrixRows(matrix, 'Y2-B5-P') === 14, 'matrix must have 14 Book 5 rows');
  assert(countMatrixRows(matrix, 'Y2-B6-P') === 14, 'matrix must have 14 Book 6 rows');
  assert(countMatrixRows(matrix, 'Y2-B7-P') === 14, 'matrix must have 14 Book 7 rows');
  assert(countMatrixRows(matrix, 'Y2-B8-P') === 16, 'matrix must have 16 Book 8 rows');

  for (const disposition of ['mapping_ready', 'evidence_needed', 'decomposition_needed', 'deferred']) {
    assertIncludes(matrix, disposition, 'paragraph candidate matrix');
  }

  for (const required of [
    'Y2-Q3-COMPOUND-INSURANCE-THRESHOLD',
    'Q15-ATOM-DOMINANT-STRATEGY-REASONING',
    'Q15-ATOM-MUTUALLY-WORSE-PRISONERS-DILEMMA-CONCLUSION',
    'Q19 remains HOLD',
  ]) {
    assertIncludes(matrix, required, 'paragraph candidate matrix');
  }

  const backlog = readText('reports/reference-planning/Y2-ROOT-MAPPING-1-exam-anchor-backlog.md');
  for (const id of [
    'vw-1022-a-25-1-o:q7',
    'vw-1022-a-25-2-o:q7',
    'vw-1022-a-23-2-o:q26',
    'vw-1022-a-24-1-o:q7',
    'vw-1022-a-25-1-o:q3',
    'vw-1022-a-25-1-o:q15',
    'vw-1022-a-25-1-o:q22',
  ]) {
    assertIncludes(backlog, id, 'exam anchor backlog');
  }

  const compression = readText('reports/reference-planning/Y2-ROOT-MAPPING-1-book8-compression-review.md');
  assertIncludes(compression, 'Book 8 should use 16 paragraph candidates', 'Book 8 compression review');
  assertIncludes(compression, 'Keynesian multiplier', 'Book 8 compression review');
  assertIncludes(compression, 'Monetary-policy transmission', 'Book 8 compression review');

  const quality = readText('reports/reference-planning/Y2-ROOT-MAPPING-1-quality-log.md');
  for (const field of ['blocks:', 'does_not_block:', 'proof_required_to_close:']) {
    assertIncludes(quality, field, 'quality log');
  }

  const combined = DOCS.map((relPath) => readText(relPath)).join('\n');
  assert(!/production-ready/i.test(combined), 'docs must not call candidates production-ready');
  assert(!/auto[- ]?merge allowed/i.test(combined), 'docs must not allow auto merge');
}

function main() {
  const packet = readJson(REVIEW_PACKET);
  assertReviewPacket(packet);
  assertDocs();
  console.log('OK Y2-ROOT-MAPPING-1: Year 2 root mapping packet validated');
}

main();
