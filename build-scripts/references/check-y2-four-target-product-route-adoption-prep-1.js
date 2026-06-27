#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  REQUIRED_SUBAGENT_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  adoptionPrepPacket
} = require('./build-y2-four-target-product-route-adoption-prep-1');
const {
  checkProductProofPacket
} = require('./check-y2-four-target-product-proof-gate-1');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const LESSON_OUTPUT_ROOT = 'year2-candidate-lessons/four-target-lesson-production-1';
const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const REQUIRED_FALSE_FLAGS = [
  'product_route_adoption_authorized',
  'product_authority',
  'protected_mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
  'autonomous_merge_authorized'
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function exists(file) {
  return fs.existsSync(file);
}

function relFromPlatform(file) {
  return path.relative(PLATFORM_ROOT, file).replace(/\\/g, '/');
}

function defaultLessonRoot() {
  const candidate = path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
  return fs.existsSync(path.join(candidate, ...LESSON_OUTPUT_ROOT.split('/'))) ? candidate : '';
}

function resolveLessonRoot() {
  return process.env.LESSON_REPO_ROOT ||
    process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length) ||
    defaultLessonRoot();
}

function assertRevStdClassification(value, context) {
  assert(
    REV_STD_FINDING_CLASSIFICATIONS.has(value),
    `${context} invalid REV-STD-1 classification: ${value}`
  );
}

function markdownFindingClassifications(markdown) {
  const classifications = [];
  let inFindingsTable = false;
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('| Finding |')) {
      inFindingsTable = true;
      continue;
    }
    if (inFindingsTable && trimmed.startsWith('## ')) break;
    if (!inFindingsTable) continue;
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) continue;
    if (trimmed.includes('---') || trimmed.includes('Classification')) continue;
    const cells = trimmed.slice(1, -1).split('|').map((cell) => cell.trim().replace(/`/g, ''));
    if (cells.length === 5) classifications.push(cells[1]);
  }
  return classifications;
}

function checkMarkdownFindingTable(file) {
  const classifications = markdownFindingClassifications(fs.readFileSync(file, 'utf8'));
  assert(classifications.length > 0, `${relFromPlatform(file)} missing findings classification rows`);
  for (const classification of classifications) {
    assertRevStdClassification(classification, `${relFromPlatform(file)} finding row`);
  }
}

function checkRequiredMarkdownSections(file) {
  const markdown = fs.readFileSync(file, 'utf8');
  for (const needle of [
    'Product End-State And Original Sprint/Gate Spec',
    'Non-Negotiable Requirements',
    'Exact Adoption Surface',
    'Cross-Repo Route Registry / Index Changes',
    'Product-Boundary Proof',
    'Safety And Quality Proof',
    'Read-Only Subagent Reviews',
    'Core-Requirement Checklist',
    'Findings Classification',
    'blocks',
    'does_not_block',
    'proof_required_to_close'
  ]) {
    assert(markdown.includes(needle), `${relFromPlatform(file)} missing required section/text: ${needle}`);
  }
}

function checkCoreChecklist(checklist, context) {
  assert(checklist && typeof checklist === 'object', `${context} missing core requirement checklist`);
  const missing = Object.entries(checklist)
    .filter(([, value]) => value !== true)
    .map(([key]) => key);
  assert(missing.length === 0, `${context} has missing core requirements: ${missing.join(', ')}`);
}

function checkLessonExposure(lessonRoot, packet) {
  const rootIndex = path.join(lessonRoot, 'index.html');
  assert(exists(rootIndex), 'lesson root index.html missing');
  const rootHtml = fs.readFileSync(rootIndex, 'utf8');
  assert(!rootHtml.includes(LESSON_OUTPUT_ROOT), 'lesson root index silently exposes Year 2 candidate bundle');
  assert(exists(path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'index.html')), 'candidate bundle index missing');
  assert(exists(path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'manifest.json')), 'candidate bundle manifest missing');
  assert(exists(path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'route-contracts.json')), 'candidate route-contract aggregate missing');
  for (const record of packet.records) {
    for (const key of ['current_candidate_entry_point', 'current_route_path', 'current_short_check_path', 'current_exit_ticket_path', 'route_contract_path']) {
      assert(exists(path.join(lessonRoot, record[key])), `${record.record_id} missing lesson path ${record[key]}`);
    }
  }
}

function checkSubagentReviews() {
  const file = path.join(REPORT_DIR, 'read-only-subagent-reviews.md');
  assert(exists(file), `${relFromPlatform(file)} is required before adoption-prep checker can pass`);
  const text = fs.readFileSync(file, 'utf8');
  assert(/Verdict:\s*(PASS|PASS WITH FLAGS)/i.test(text), 'read-only subagent review must record PASS or PASS WITH FLAGS');
  assert(!/REQUEST CHANGES/i.test(text), 'read-only subagent review must not carry REQUEST CHANGES');
  for (const scope of REQUIRED_SUBAGENT_REVIEW_SCOPES) {
    assert(text.toLowerCase().includes(scope.toLowerCase()), `read-only subagent review missing scope: ${scope}`);
  }
}

function checkAdoptionPrepPacket(lessonRoot) {
  const packetPath = path.join(REPORT_DIR, 'route-adoption-prep-packet.json');
  const packetMdPath = path.join(REPORT_DIR, 'route-adoption-prep-packet.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-adoption-map.html');
  assert(exists(packetPath), `missing ${relFromPlatform(packetPath)}`);
  assert(exists(packetMdPath), `missing ${relFromPlatform(packetMdPath)}`);
  assert(exists(reviewPath), `missing ${relFromPlatform(reviewPath)}`);
  assert(exists(reviewMdPath), `missing ${relFromPlatform(reviewMdPath)}`);
  assert(exists(renderedPath), `missing ${relFromPlatform(renderedPath)}`);

  const packet = readJson(packetPath);
  const expected = adoptionPrepPacket({ lessonRoot });
  assert(packet.schema_version === 1, 'adoption prep schema_version must be 1');
  assert(packet.sprint_id === SPRINT_ID, 'adoption prep sprint_id mismatch');
  assert(packet.status === 'product_route_adoption_prep_ready_for_human_review', 'adoption prep status mismatch');
  assert(packet.expected_return === 'YEAR 2 FOUR-TARGET PRODUCT-ROUTE ADOPTION PREP READY', 'expected return mismatch');
  assert(packet.product_end_state.includes('bounded product-route surface'), 'product end-state missing bounded route language');
  assert(packet.original_sprint_gate_spec.product_proof_packet, 'product proof packet citation missing');
  assert(packet.original_sprint_gate_spec.original_governed_support_gate, 'original sprint/gate spec citation missing');
  assert(SHA_PATTERN.test(packet.merged_state.platform_current_main_head_sha), 'platform main head must be a SHA');
  assert(SHA_PATTERN.test(packet.merged_state.lesson_current_main_head_sha), 'lesson main head must be a SHA');
  assert(packet.merged_state.product_proof_merge_commit_is_ancestor === true, 'product proof merge commit must be ancestor of platform main');
  assert(packet.merged_state.lesson_production_merge_commit_is_ancestor === true, 'lesson production merge commit must be ancestor of lesson main');
  assert(JSON.stringify(packet.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  assert(JSON.stringify(packet.core_requirement_checklist) === JSON.stringify(expected.core_requirement_checklist), 'core checklist drifted');
  checkCoreChecklist(packet.core_requirement_checklist, 'packet');

  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(packet.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }
  assert(packet.adoption_surface.visibility_rules.current_root_index_contains_candidate_link === false, 'root index exposure must be false');
  assert(Array.isArray(packet.adoption_surface.proposed_future_navigation_files), 'future navigation files must be named');
  assert(packet.adoption_surface.proposed_future_navigation_files.some((item) => item.path === 'index.html' && item.authorized_in_this_pr === false), 'future root index file must be pinned and unauthorized in this PR');
  assert(packet.adoption_surface.proposed_future_navigation_files.some((item) => item.path === `${LESSON_OUTPUT_ROOT}/index.html` && item.authorized_in_this_pr === false), 'candidate bundle index file must be pinned and unauthorized in this PR');
  assert(packet.adoption_surface.visibility_rules.no_silent_exposure_to_students === true, 'no silent exposure proof must be true');
  assert(packet.cross_repo_route_registry_index_plan.root_student_index_mutated_in_this_pr === false, 'root index mutation must remain false');
  assert(packet.cross_repo_route_registry_index_plan.active_book_indexes_mutated_in_this_pr === false, 'active book index mutation must remain false');
  assert(JSON.stringify(packet.cross_repo_route_registry_index_plan.exact_future_lesson_navigation_files) === JSON.stringify(['index.html', `${LESSON_OUTPUT_ROOT}/index.html`]), 'exact future lesson navigation files drifted');
  assert(packet.product_boundary_proof.product_route_adoption_allowed_by_this_packet === false, 'packet must not authorize adoption');
  assert(packet.safety_quality_proof.screenshot_count === 48, 'adoption prep must inherit 48 screenshots');
  assert(packet.safety_quality_proof.desktop_mobile_screenshots_present === true, 'desktop/mobile screenshot proof missing');
  assert(packet.safety_quality_proof.light_dark_screenshots_present === true, 'light/dark screenshot proof missing');
  assert(packet.safety_quality_proof.advisory_short_check_not_completion_proof === true, 'short check boundary missing');
  assert(packet.safety_quality_proof.exit_ticket_target_equivalent_candidate_only === true, 'exit-ticket candidate boundary missing');

  assert(Array.isArray(packet.records) && packet.records.length === 4, 'packet must contain four route records');
  for (const record of packet.records) {
    checkCoreChecklist(record.core_requirement_checklist, record.record_id);
    assert(record.visibility_rules.root_student_navigation_exposed_now === false, `${record.record_id} root exposure must be false`);
    assert(record.visibility_rules.active_book_navigation_exposed_now === false, `${record.record_id} active book exposure must be false`);
    assert(record.safety_contract.advisory_short_check_is_not_completion_proof === true, `${record.record_id} short-check boundary missing`);
    assert(record.safety_contract.exit_ticket_is_target_equivalent_candidate_only === true, `${record.record_id} exit-ticket boundary missing`);
    assert(record.rollback && record.rollback.registry_rollback && record.rollback.navigation_rollback, `${record.record_id} rollback missing`);
    assert(Array.isArray(record.carried_issues) && record.carried_issues.length > 0, `${record.record_id} carried issues missing`);
    for (const issue of record.carried_issues) {
      assertRevStdClassification(issue.classification, `${record.record_id} carried issue`);
      assert(issue.blocks && issue.does_not_block && issue.proof_required_to_close, `${record.record_id} carried issue lacks REV-STD-1 fields`);
    }
  }

  assert(Array.isArray(packet.findings) && packet.findings.length > 0, 'packet findings missing');
  for (const finding of packet.findings) {
    assertRevStdClassification(finding.classification, 'packet finding');
    assert(finding.blocks && finding.does_not_block && finding.proof_required_to_close, 'packet finding lacks REV-STD-1 fields');
  }
  assert(!packet.findings.some((finding) => finding.classification === 'core_spec_failure'), 'adoption prep may not carry missing core requirements');

  checkRequiredMarkdownSections(packetMdPath);
  checkRequiredMarkdownSections(reviewMdPath);
  checkMarkdownFindingTable(packetMdPath);
  checkMarkdownFindingTable(reviewMdPath);
  checkLessonExposure(lessonRoot, packet);
  checkSubagentReviews();

  const html = fs.readFileSync(renderedPath, 'utf8');
  assert(html.includes('Bounded adoption prep'), 'rendered adoption map missing heading');
  assert(html.includes('Product-route adoption'), 'rendered adoption map missing authority boundary');

  return {
    packet: relFromPlatform(packetPath),
    review: relFromPlatform(reviewPath),
    rendered: relFromPlatform(renderedPath),
    subagent_reviews: `reports/review-gates/${SPRINT_ID}/read-only-subagent-reviews.md`
  };
}

function main() {
  const lessonRoot = resolveLessonRoot();
  assert(lessonRoot, 'LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required for adoption-prep validation');
  const product = checkProductProofPacket(lessonRoot);
  const adoption = checkAdoptionPrepPacket(lessonRoot);
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    product_proof: product,
    adoption,
    expected_return: 'YEAR 2 FOUR-TARGET PRODUCT-ROUTE ADOPTION PREP READY'
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkAdoptionPrepPacket
};
