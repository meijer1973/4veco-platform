#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  REQUIRED_FALSE_FLAGS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  REGISTRY_FILE,
  LESSON_OUTPUT_ROOT,
  adoptionRegistry
} = require('./build-y2-four-target-bounded-route-adoption-1');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

function checkMarkdown(file) {
  const markdown = readText(file);
  for (const needle of [
    'Product End-State And Original Sprint/Gate Spec',
    'Non-Negotiable Requirements',
    'Exact Registry / Index Adoption Surface',
    'Core-Requirement Checklist',
    'Findings Classification',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'Authority Boundary',
    'Rollback'
  ]) {
    assert(markdown.includes(needle), `${relFromPlatform(file)} missing required section/text: ${needle}`);
  }
  const classifications = markdownFindingClassifications(markdown);
  assert(classifications.length > 0, `${relFromPlatform(file)} missing findings classification rows`);
  for (const classification of classifications) {
    assertRevStdClassification(classification, `${relFromPlatform(file)} finding row`);
  }
}

function checkLessonIndexes(lessonRoot, registry) {
  const rootIndex = path.join(lessonRoot, 'index.html');
  const bundleIndex = path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'index.html');
  assert(exists(rootIndex), '4veco-lessen root index.html missing');
  assert(exists(bundleIndex), '4veco-lessen Year 2 bundle index missing');

  const rootHtml = readText(rootIndex);
  const bundleHtml = readText(bundleIndex);
  assert(rootHtml.includes(`href="${LESSON_OUTPUT_ROOT}/index.html"`), 'root index missing bounded Year 2 bundle link');
  assert(rootHtml.includes('data-route-adoption-id="Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1"'), 'root index missing adoption id marker');
  assert(rootHtml.includes('Docentpreview Year 2'), 'root index missing bounded preview label');
  assert(rootHtml.includes('geen CP-6, Scale Gate, diagnostiek of summatieve status'), 'root index missing downstream boundary copy');

  assert(bundleHtml.includes('data-adoption-state="bounded-route-adopted"'), 'bundle index missing bounded adoption state marker');
  assert(bundleHtml.includes('Bounded Year 2 routepreview'), 'bundle index missing bounded route heading');
  assert(bundleHtml.includes('Advisory short checks blijven oefenfeedback'), 'bundle index missing short-check boundary copy');
  assert(bundleHtml.includes('geen CP-6, Scale Gate, diagnostiek, mastery, PV, summatieve inzet of student-productgebruik'), 'bundle index missing authority boundary copy');

  for (const record of registry.records) {
    assert(bundleHtml.includes(record.route_label), `bundle index missing route label: ${record.route_label}`);
    assert(exists(path.join(lessonRoot, record.bounded_entry_point)), `${record.route_id} missing bounded entry point`);
    assert(exists(path.join(lessonRoot, record.surfaces.route)), `${record.route_id} missing route surface`);
    assert(exists(path.join(lessonRoot, record.surfaces.advisory_short_check)), `${record.route_id} missing short check`);
    assert(exists(path.join(lessonRoot, record.surfaces.target_equivalent_exit_ticket_candidate)), `${record.route_id} missing exit ticket`);
    assert(exists(path.join(lessonRoot, record.surfaces.route_contract)), `${record.route_id} missing route contract`);
  }
}

function checkRegistry(lessonRoot) {
  const registryPath = path.join(PLATFORM_ROOT, REGISTRY_FILE);
  const packetPath = path.join(REPORT_DIR, 'bounded-route-adoption-packet.json');
  const packetMdPath = path.join(REPORT_DIR, 'bounded-route-adoption-packet.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-registry-map.html');

  for (const file of [registryPath, packetPath, packetMdPath, reviewPath, reviewMdPath, renderedPath]) {
    assert(exists(file), `missing ${relFromPlatform(file)}`);
  }

  const registry = readJson(registryPath);
  const packet = readJson(packetPath);
  const review = readJson(reviewPath);
  const expected = adoptionRegistry({ lessonRoot });
  assert(JSON.stringify(registry) === JSON.stringify(packet), 'registry and review-gate packet must match exactly');
  assert(registry.schema_version === 1, 'registry schema_version must be 1');
  assert(registry.sprint_id === SPRINT_ID, 'registry sprint_id mismatch');
  assert(registry.status === 'bounded_product_route_adoption_ready_for_human_review', 'registry status mismatch');
  assert(registry.product_end_state.includes('bounded'), 'product end-state must name bounded route adoption');
  assert(registry.original_sprint_gate_spec.adoption_prep_packet, 'adoption prep packet citation missing');
  assert(registry.adoption_surface.registry_file === REGISTRY_FILE, 'registry file mismatch');
  assert(registry.adoption_surface.lesson_root_index === 'index.html', 'lesson root index not named');
  assert(registry.adoption_surface.lesson_bundle_index === `${LESSON_OUTPUT_ROOT}/index.html`, 'lesson bundle index not named');
  assert(registry.adoption_surface.route_count === 4, 'adoption route count must be four');
  assert(Array.isArray(registry.records) && registry.records.length === 4, 'registry must contain four route records');
  assert(JSON.stringify(registry.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  assert(JSON.stringify(registry.core_requirement_checklist) === JSON.stringify(expected.core_requirement_checklist), 'core checklist drifted');
  checkCoreChecklist(registry.core_requirement_checklist, 'registry');

  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(registry.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }
  assert(registry.authority_claims.product_route_adoption_authorized_on_owner_merge === true, 'bounded route adoption must be the reviewed merge effect');

  for (const record of registry.records) {
    assert(record.adoption_state === 'bounded_product_route_adopted_after_owner_merge', `${record.route_id} adoption state mismatch`);
    assert(record.visibility.root_year2_bounded_entry === true, `${record.route_id} root bounded entry missing`);
    assert(record.visibility.default_book_navigation === false, `${record.route_id} default book navigation must remain false`);
    assert(record.visibility.broad_student_rollout === false, `${record.route_id} broad rollout must remain false`);
    assert(record.safety_contract.advisory_short_check_is_not_completion_proof === true, `${record.route_id} short-check boundary missing`);
    assert(record.safety_contract.exit_ticket_is_target_equivalent_candidate_only === true, `${record.route_id} exit-ticket boundary missing`);
    assert(record.rollback.registry && record.rollback.lesson_root_index && record.rollback.lesson_bundle_index, `${record.route_id} rollback incomplete`);
    assert(Array.isArray(record.carried_issues) && record.carried_issues.length > 0, `${record.route_id} carried issue missing`);
    for (const issue of record.carried_issues) {
      assertRevStdClassification(issue.classification, `${record.route_id} carried issue`);
      assert(issue.blocks && issue.does_not_block && issue.proof_required_to_close, `${record.route_id} carried issue lacks REV-STD-1 fields`);
    }
  }

  for (const finding of registry.findings) {
    assertRevStdClassification(finding.classification, 'registry finding');
    assert(finding.blocks && finding.does_not_block && finding.proof_required_to_close, 'registry finding lacks REV-STD-1 fields');
  }
  assert(!registry.findings.some((finding) => finding.classification === 'core_spec_failure'), 'bounded adoption may not carry a missing core requirement');
  checkMarkdown(packetMdPath);
  checkMarkdown(reviewMdPath);

  assert(review.product_route_adoption_registry === REGISTRY_FILE, 'review packet registry pointer mismatch');
  assert(JSON.stringify(review.lesson_index_files) === JSON.stringify(['index.html', `${LESSON_OUTPUT_ROOT}/index.html`]), 'review packet must name both lesson index files');

  const rendered = readText(renderedPath);
  assert(rendered.includes('Bounded route adoption'), 'rendered registry missing heading');
  assert(rendered.includes('Authority Boundary'), 'rendered registry missing boundary');
  checkLessonIndexes(lessonRoot, registry);

  return {
    registry: relFromPlatform(registryPath),
    packet: relFromPlatform(packetPath),
    review: relFromPlatform(reviewPath),
    rendered: relFromPlatform(renderedPath)
  };
}

function main() {
  const lessonRoot = resolveLessonRoot();
  assert(lessonRoot, 'LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  const adoption = checkRegistry(lessonRoot);
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    adoption,
    expected_return: 'YEAR 2 FOUR-TARGET BOUNDED ROUTE ADOPTION READY'
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkRegistry
};
