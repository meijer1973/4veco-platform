#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  productProofPacket,
  qaPagePaths
} = require('./build-y2-four-target-product-proof-gate-1');
const {
  checkLessonArtifacts,
  checkPlatformArtifacts,
  visibleTextViolations
} = require('./check-y2-four-target-cross-repo-lesson-production-1');

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
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
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

function checkCoreChecklist(checklist, context) {
  assert(checklist && typeof checklist === 'object', `${context} missing core requirement checklist`);
  const missing = Object.entries(checklist)
    .filter(([, value]) => value !== true)
    .map(([key]) => key);
  assert(missing.length === 0, `${context} has missing core requirements: ${missing.join(', ')}`);
}

function checkStudentVisibleFiles(lessonRoot, packet) {
  const root = path.resolve(lessonRoot);
  const htmlFiles = [path.join(root, LESSON_OUTPUT_ROOT, 'index.html')];
  for (const record of packet.records) {
    htmlFiles.push(path.join(root, record.lesson_output.index));
    htmlFiles.push(path.join(root, record.lesson_output.route));
    htmlFiles.push(path.join(root, record.lesson_output.short_check));
    htmlFiles.push(path.join(root, record.lesson_output.exit_ticket));
  }

  const violations = [];
  for (const file of htmlFiles) {
    assert(exists(file), `missing lesson HTML ${file}`);
    violations.push(...visibleTextViolations(file, fs.readFileSync(file, 'utf8')));
  }
  assert(violations.length === 0, violations.join('\n'));
  return htmlFiles.length;
}

function checkScreenshotProof(packet) {
  const proof = packet.rendered_screenshot_proof;
  assert(proof && proof.status === 'captured', 'product proof must have captured screenshots');
  assert(proof.expected_count === 48, 'product proof expected screenshot count must be 48');
  assert(proof.screenshot_count === proof.expected_count, 'product proof screenshot count mismatch');
  assert(JSON.stringify(proof.qa_page_paths_from_lesson_repo_root) === JSON.stringify(qaPagePaths()), 'product proof QA page paths drifted');
  assert(!proof.qa_command.includes('<twelve'), 'product proof QA command must not use placeholder pages');
  assert(exists(path.join(PLATFORM_ROOT, proof.manifest_json)), 'missing product proof screenshot manifest json');
  assert(exists(path.join(PLATFORM_ROOT, proof.manifest_md)), 'missing product proof screenshot manifest markdown');
  for (const item of proof.cases) {
    assert(exists(path.join(PLATFORM_ROOT, item.file)), `missing screenshot ${item.file}`);
  }
}

function checkProductProofPacket(lessonRoot) {
  const packetPath = path.join(REPORT_DIR, 'product-proof-packet.json');
  const packetMdPath = path.join(REPORT_DIR, 'product-proof-packet.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const proofHtmlPath = path.join(REPORT_DIR, 'rendered-product-proof.html');
  assert(exists(packetPath), `missing ${relFromPlatform(packetPath)}`);
  assert(exists(packetMdPath), `missing ${relFromPlatform(packetMdPath)}`);
  assert(exists(reviewPath), `missing ${relFromPlatform(reviewPath)}`);
  assert(exists(reviewMdPath), `missing ${relFromPlatform(reviewMdPath)}`);
  assert(exists(proofHtmlPath), `missing ${relFromPlatform(proofHtmlPath)}`);

  const packet = readJson(packetPath);
  const expected = productProofPacket({ lessonRoot });
  assert(packet.schema_version === 1, 'product proof schema_version must be 1');
  assert(packet.sprint_id === SPRINT_ID, 'product proof sprint_id mismatch');
  assert(packet.status === 'prepared_for_human_product_proof_review', 'product proof status mismatch');
  assert(packet.product_end_state && packet.product_end_state.includes('Human-reviewable'), 'product end-state missing');
  assert(packet.original_sprint_gate_spec.production_bundle, 'original sprint/gate spec must cite production bundle');
  assert(packet.original_sprint_gate_spec.original_governed_support_gate, 'original sprint/gate spec must cite governed support gate');
  assert(SHA_PATTERN.test(packet.merged_state.platform_current_head_sha), 'platform current head must be a SHA');
  assert(SHA_PATTERN.test(packet.merged_state.lesson_current_head_sha), 'lesson current head must be a SHA');
  assert(packet.merged_state.platform_production_merge_commit_is_ancestor === true, 'platform production merge commit must be ancestor');
  assert(packet.merged_state.lesson_production_merge_commit_is_ancestor === true, 'lesson production merge commit must be ancestor');
  assert(JSON.stringify(packet.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  assert(JSON.stringify(packet.core_requirement_checklist) === JSON.stringify(expected.core_requirement_checklist), 'core checklist drifted');
  checkCoreChecklist(packet.core_requirement_checklist, 'packet');

  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(packet.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }

  assert(Array.isArray(packet.records) && packet.records.length === 4, 'packet must contain four records');
  for (const record of packet.records) {
    checkCoreChecklist(record.core_requirement_checklist, record.record_id);
    assert(record.screenshot_evidence.count === 12, `${record.record_id} must have 12 screenshots`);
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
  assert(!packet.findings.some((finding) => finding.classification === 'core_spec_failure'), 'product proof may not carry missing core requirements');

  checkMarkdownFindingTable(packetMdPath);
  checkMarkdownFindingTable(reviewMdPath);
  checkScreenshotProof(packet);

  const html = fs.readFileSync(proofHtmlPath, 'utf8');
  assert(html.includes('<img '), 'rendered proof HTML must embed screenshot thumbnails');
  assert(html.includes('Merged product-proof preparation'), 'rendered proof HTML missing product-proof heading');

  return {
    packet: relFromPlatform(packetPath),
    review: relFromPlatform(reviewPath),
    proof: relFromPlatform(proofHtmlPath)
  };
}

function main() {
  const lessonRoot = resolveLessonRoot();
  assert(lessonRoot, 'LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required for product-proof validation');
  const productionPlatform = checkPlatformArtifacts();
  const productionLesson = checkLessonArtifacts(lessonRoot);
  const product = checkProductProofPacket(lessonRoot);
  const htmlFilesChecked = checkStudentVisibleFiles(lessonRoot, readJson(path.join(REPORT_DIR, 'product-proof-packet.json')));
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    production_platform: productionPlatform,
    production_lesson: productionLesson,
    product,
    html_files_checked: htmlFilesChecked
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkProductProofPacket
};
