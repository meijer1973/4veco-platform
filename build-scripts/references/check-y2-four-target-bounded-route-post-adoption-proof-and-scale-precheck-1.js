#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  REQUIRED_FALSE_FLAGS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  PLATFORM_ADOPTION_MERGE_COMMIT,
  LESSON_ADOPTION_MERGE_COMMIT,
  postAdoptionPacket
} = require('./build-y2-four-target-bounded-route-post-adoption-proof-and-scale-precheck-1');
const {
  REGISTRY_FILE,
  LESSON_OUTPUT_ROOT
} = require('./build-y2-four-target-bounded-route-adoption-1');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);

function fail(message) {
  console.error(`Y2 four-target post-adoption proof / Scale precheck failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
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

function checkCoreChecklist(checklist, context) {
  assert(checklist && typeof checklist === 'object', `${context} missing core requirement checklist`);
  const missing = Object.entries(checklist)
    .filter(([, value]) => value !== true)
    .map(([key]) => key);
  assert(missing.length === 0, `${context} has missing core requirements: ${missing.join(', ')}`);
}

function markdownFindingClassifications(markdown) {
  const classifications = [];
  let inFindingsTable = false;
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('| Finding |') || trimmed.startsWith('| Issue |')) {
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

function checkMarkdown(file) {
  const markdown = readText(file);
  for (const needle of [
    'Product End-State And Original Sprint/Gate Spec',
    'Non-Negotiable Requirements',
    'Post-Adoption Proof Surface',
    'Scale Gate Precheck',
    'Core-Requirement Checklist',
    'Findings Classification',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'Authority Boundary',
    'Recommended Next Action'
  ]) {
    assert(markdown.includes(needle), `${relFromPlatform(file)} missing required section/text: ${needle}`);
  }
  const classifications = markdownFindingClassifications(markdown);
  assert(classifications.length > 0, `${relFromPlatform(file)} missing findings/precheck classification rows`);
  for (const classification of classifications) {
    assertRevStdClassification(classification, `${relFromPlatform(file)} finding row`);
  }
}

function checkIssue(item, context) {
  assertRevStdClassification(item.classification, context);
  assert(item.blocks, `${context} missing blocks`);
  assert(item.does_not_block, `${context} missing does_not_block`);
  assert(item.proof_required_to_close, `${context} missing proof_required_to_close`);
}

function checkLessonIndexes(lessonRoot, packet) {
  const rootIndex = path.join(lessonRoot, 'index.html');
  const bundleIndex = path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'index.html');
  assert(exists(rootIndex), 'lesson root index missing');
  assert(exists(bundleIndex), 'lesson bundle index missing');
  const rootHtml = readText(rootIndex);
  const bundleHtml = readText(bundleIndex);
  assert(rootHtml.includes(`href="${LESSON_OUTPUT_ROOT}/index.html"`), 'lesson root missing bounded route link');
  assert(rootHtml.includes('data-route-adoption-id="Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1"'), 'lesson root missing adoption marker');
  assert(bundleHtml.includes('data-adoption-state="bounded-route-adopted"'), 'lesson bundle index missing bounded adoption state');
  assert(bundleHtml.includes('Bounded Year 2 routepreview'), 'lesson bundle index missing bounded route heading');
  assert(packet.lesson_index_evidence.root_index.adoption_marker_present === true, 'packet root index marker evidence false');
  assert(packet.lesson_index_evidence.bundle_index.bounded_state_marker_present === true, 'packet bundle index marker evidence false');
}

function checkPacket(lessonRoot) {
  const packetPath = path.join(REPORT_DIR, 'post-adoption-proof-and-scale-precheck.json');
  const packetMdPath = path.join(REPORT_DIR, 'post-adoption-proof-and-scale-precheck.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-scale-precheck.html');
  for (const file of [packetPath, packetMdPath, reviewPath, reviewMdPath, renderedPath]) {
    assert(exists(file), `missing ${relFromPlatform(file)}`);
  }

  const packet = readJson(packetPath);
  const expected = postAdoptionPacket({ lessonRoot });
  assert(packet.schema_version === 1, 'schema_version must be 1');
  assert(packet.sprint_id === SPRINT_ID, 'sprint_id mismatch');
  assert(packet.status === 'post_adoption_proof_and_scale_precheck_ready_for_human_review', 'status mismatch');
  assert(packet.product_end_state.includes('bounded Year 2 route preview'), 'product end-state must name bounded preview');
  assert(packet.original_sprint_gate_spec.bounded_adoption_registry === REGISTRY_FILE, 'registry citation mismatch');
  assert(packet.original_sprint_gate_spec.product_proof_packet, 'product proof packet citation missing');
  assert(packet.original_sprint_gate_spec.adoption_prep_packet, 'adoption prep packet citation missing');
  assert(packet.merged_state.platform_adoption_merge_commit === PLATFORM_ADOPTION_MERGE_COMMIT, 'platform adoption merge commit mismatch');
  assert(packet.merged_state.lesson_adoption_merge_commit === LESSON_ADOPTION_MERGE_COMMIT, 'lesson adoption merge commit mismatch');
  assert(packet.merged_state.platform_adoption_merge_commit_is_ancestor === true, 'platform adoption merge commit must be ancestor of origin/main');
  assert(packet.merged_state.lesson_adoption_merge_commit_is_ancestor === true, 'lesson adoption merge commit must be ancestor of origin/main');
  assert(JSON.stringify(packet.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(packet.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }
  assert(packet.authority_claims.bounded_product_route_preview_authorized === true, 'bounded preview authority must be true');
  assert(JSON.stringify(packet.core_requirement_checklist) === JSON.stringify(expected.core_requirement_checklist), 'core checklist drifted');
  checkCoreChecklist(packet.core_requirement_checklist, 'packet');

  assert(packet.inherited_product_proof.screenshot_count === 48, 'inherited product proof screenshot count must be 48');
  assert(packet.inherited_product_proof.expected_screenshot_count === 48, 'inherited expected screenshot count must be 48');
  assert(Array.isArray(packet.records) && packet.records.length === 4, 'packet must include four route records');
  for (const record of packet.records) {
    checkCoreChecklist(record.core_requirement_checklist, record.route_id);
    assert(record.route_contract.generated_candidate_boundary_retained === true, `${record.route_id} route contract boundary not retained`);
    assert(record.inherited_product_proof.screenshot_count === 12, `${record.route_id} must inherit 12 screenshots`);
    assert(Array.isArray(record.carried_issues) && record.carried_issues.length > 0, `${record.route_id} carried issue missing`);
    for (const issue of record.carried_issues) checkIssue(issue, `${record.route_id} carried issue`);
  }

  assert(packet.scale_gate_precheck.status === 'not_ready_for_scale_gate_authority', 'scale precheck must remain blocked');
  assert(packet.scale_gate_precheck.result === 'PRECHECK_ONLY_BLOCKED_FOR_SCALE_GATE', 'scale precheck result mismatch');
  assert(packet.scale_gate_precheck.ready_inputs.bounded_route_preview_live === true, 'bounded route preview ready input missing');
  assert(Array.isArray(packet.scale_gate_precheck.blockers) && packet.scale_gate_precheck.blockers.length >= 3, 'scale blockers missing');
  for (const blocker of packet.scale_gate_precheck.blockers) checkIssue(blocker, `scale precheck ${blocker.issue_id}`);
  for (const finding of packet.findings) checkIssue(finding, 'packet finding');
  assert(!packet.findings.some((finding) => finding.classification === 'core_spec_failure'), 'packet may not carry missing core requirements');
  checkLessonIndexes(lessonRoot, packet);
  checkMarkdown(packetMdPath);
  checkMarkdown(reviewMdPath);

  const review = readJson(reviewPath);
  assert(review.post_adoption_proof_packet === relFromPlatform(packetPath), 'review packet post-adoption pointer mismatch');
  assert(review.rendered_scale_precheck === relFromPlatform(renderedPath), 'review packet rendered pointer mismatch');
  assert(review.scale_gate_precheck.result === packet.scale_gate_precheck.result, 'review packet scale precheck mismatch');

  const rendered = readText(renderedPath);
  assert(rendered.includes('Post-adoption proof / Scale Gate precheck'), 'rendered precheck missing heading');
  assert(rendered.includes('Scale Gate, CP-6, diagnostics'), 'rendered precheck missing authority boundary');

  return {
    packet: relFromPlatform(packetPath),
    review: relFromPlatform(reviewPath),
    rendered: relFromPlatform(renderedPath)
  };
}

function main() {
  const lessonRoot = resolveLessonRoot();
  assert(lessonRoot, 'LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  const output = checkPacket(lessonRoot);
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    output,
    expected_return: 'YEAR 2 FOUR-TARGET POST-ADOPTION PROOF AND SCALE PRECHECK READY'
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkPacket
};
