#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  SPRINT_ID,
  generatedRoutes,
  platformBundle,
  routeOutput
} = require('./build-y2-four-target-cross-repo-lesson-production-1');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const LESSON_OUTPUT_ROOT = 'year2-candidate-lessons/four-target-lesson-production-1';
const REV_STD_FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'quality_improvement_available',
  'minor_carry_flag',
  'scale_blocker',
  'core_spec_failure'
]);
const REQUIRED_FALSE_FLAGS = [
  'active_v5_registry_mutated',
  'external_source_mutation_authorized',
  'live_mtu_registry_mutated',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'product_route_adoption_authorized',
  'product_authority',
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

const STUDENT_BLOCKED_TERMS = [
  'mastery',
  'score',
  'grade',
  'summative',
  'diagnose',
  'diagnostic',
  'adaptive',
  'evidence',
  'toets',
  'cijfer',
  'beoordeling',
  'summatief',
  'diagnostisch',
  'adaptief'
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

function qaPagePaths(routes = generatedRoutes()) {
  return routes.flatMap((route) => [
    route.output.route,
    route.output.short_check,
    route.output.exit_ticket
  ]);
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

function stripHtml(raw) {
  return String(raw)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleTextViolations(file, raw) {
  const text = stripHtml(raw);
  const lower = text.toLowerCase();
  const violations = [];
  for (const term of STUDENT_BLOCKED_TERMS) {
    const pattern = new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    if (pattern.test(lower)) violations.push(`${file}: blocked student term ${term}`);
  }
  if (/\bY2-[A-Z0-9-]+\b/.test(text)) violations.push(`${file}: visible Year 2 internal id`);
  if (/\bOP-[A-Z0-9]+\b/.test(text)) violations.push(`${file}: visible operation id`);
  if (/\b(?:MTU|PV)\b/.test(text)) violations.push(`${file}: visible internal acronym`);
  return violations;
}

function checkPlatformArtifacts() {
  const bundlePath = path.join(REPORT_DIR, 'lesson-production-bundle.json');
  const bundleMarkdownPath = path.join(REPORT_DIR, 'lesson-production-bundle.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMarkdownPath = path.join(REPORT_DIR, 'review-packet.md');
  const proofPath = path.join(REPORT_DIR, 'rendered-product-proof.html');
  assert(exists(bundlePath), `missing ${relFromPlatform(bundlePath)}`);
  assert(exists(bundleMarkdownPath), `missing ${relFromPlatform(bundleMarkdownPath)}`);
  assert(exists(reviewPath), `missing ${relFromPlatform(reviewPath)}`);
  assert(exists(reviewMarkdownPath), `missing ${relFromPlatform(reviewMarkdownPath)}`);
  assert(exists(proofPath), `missing ${relFromPlatform(proofPath)}`);

  const actual = readJson(bundlePath);
  const expected = platformBundle(generatedRoutes());
  const proofHtml = fs.readFileSync(proofPath, 'utf8');
  assert(actual.schema_version === 1, 'bundle schema_version must be 1');
  assert(actual.sprint_id === SPRINT_ID, 'bundle sprint_id mismatch');
  assert(Array.isArray(actual.records) && actual.records.length === 4, 'bundle must contain four records');
  assert(JSON.stringify(actual.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  assert(actual.rendered_screenshot_proof, 'bundle missing rendered screenshot proof field');
  if (actual.rendered_screenshot_proof.status === 'captured') {
    assert(actual.rendered_screenshot_proof.screenshot_count === 48, 'rendered screenshot proof must contain 48 screenshots');
    assert(actual.rendered_screenshot_proof.expected_count === 48, 'rendered screenshot expected count must be 48');
    assert(!actual.rendered_screenshot_proof.qa_command.includes('<twelve'), 'rendered screenshot proof command must not use placeholder pages');
    assert(
      JSON.stringify(actual.rendered_screenshot_proof.qa_page_paths_from_lesson_repo_root) === JSON.stringify(qaPagePaths()),
      'rendered screenshot proof must record the exact 12 lesson page paths'
    );
    assert(exists(path.join(PLATFORM_ROOT, actual.rendered_screenshot_proof.manifest_json)), 'missing screenshot manifest json');
    assert(exists(path.join(PLATFORM_ROOT, actual.rendered_screenshot_proof.manifest_md)), 'missing screenshot manifest markdown');
    assert(proofHtml.includes('<img '), 'rendered product proof must embed screenshot thumbnails');
    for (const item of actual.rendered_screenshot_proof.cases) {
      assert(exists(path.join(PLATFORM_ROOT, item.file)), `missing screenshot ${item.file}`);
      assert(proofHtml.includes(item.file.replace(`reports/review-gates/${SPRINT_ID}/`, '')), `rendered product proof missing screenshot ${item.file}`);
    }
  }

  checkMarkdownFindingTable(bundleMarkdownPath);
  checkMarkdownFindingTable(reviewMarkdownPath);

  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(actual.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }

  const expectedIds = new Set(expected.records.map((record) => record.record_id));
  for (const record of actual.records) {
    assert(expectedIds.has(record.record_id), `unexpected record ${record.record_id}`);
    assert(record.core_requirement_checklist.paragraph_plan_target_alignment === true, `${record.record_id} missing paragraph plan alignment`);
    assert(record.core_requirement_checklist.student_facing_explanation_practice_route === true, `${record.record_id} missing route`);
    assert(record.core_requirement_checklist.advisory_short_check === true, `${record.record_id} missing short check`);
    assert(record.core_requirement_checklist.target_equivalent_exit_ticket_candidate === true, `${record.record_id} missing exit ticket`);
    assert(record.core_requirement_checklist.source_first_layout === true, `${record.record_id} missing source-first layout`);
    assert(record.core_requirement_checklist.authority_boundary_preserved === true, `${record.record_id} authority boundary not preserved`);
    assert(Array.isArray(record.carried_issues) && record.carried_issues.length > 0, `${record.record_id} carried issues missing`);
    for (const issue of record.carried_issues) {
      assertRevStdClassification(issue.classification, `${record.record_id} carried issue`);
      assert(issue.blocks && issue.does_not_block && issue.proof_required_to_close, `${record.record_id} carried issue lacks REV-STD-1 fields`);
    }
  }

  return {
    bundle: relFromPlatform(bundlePath),
    review: relFromPlatform(reviewPath),
    proof: relFromPlatform(proofPath)
  };
}

function checkLessonArtifacts(lessonRoot) {
  const root = path.resolve(lessonRoot);
  const routes = generatedRoutes();
  const bundleRoot = path.join(root, ...LESSON_OUTPUT_ROOT.split('/'));
  const manifestPath = path.join(bundleRoot, 'manifest.json');
  const contractsPath = path.join(bundleRoot, 'route-contracts.json');
  assert(exists(manifestPath), `missing lesson manifest ${manifestPath}`);
  assert(exists(contractsPath), `missing route contracts ${contractsPath}`);
  const manifest = readJson(manifestPath);
  assert(manifest.sprint_id === SPRINT_ID, 'lesson manifest sprint_id mismatch');
  assert(manifest.records.length === 4, 'lesson manifest must contain four records');
  assert(manifest.authority_claims.student_product_use_authorized === false, 'lesson manifest must not authorize student product use');

  const htmlFiles = [path.join(bundleRoot, 'index.html')];
  for (const route of routes) {
    const output = routeOutput(route);
    for (const key of ['plan', 'index', 'route', 'short_check', 'exit_ticket', 'contract']) {
      const file = path.join(root, output[key]);
      assert(exists(file), `missing lesson output ${file}`);
      if (file.endsWith('.html')) htmlFiles.push(file);
    }
    const contract = readJson(path.join(root, output.contract));
    assert(contract.record_id === route.record_id, `${route.record_id} contract record mismatch`);
    assert(contract.required_surfaces.length === 3, `${route.record_id} contract required surfaces mismatch`);
    assert(contract.authority_boundary.includes('no_product_route_adoption'), `${route.record_id} contract authority boundary missing`);
  }

  const violations = [];
  for (const file of htmlFiles) {
    violations.push(...visibleTextViolations(file, fs.readFileSync(file, 'utf8')));
  }
  assert(violations.length === 0, violations.join('\n'));

  return {
    manifest: path.relative(root, manifestPath).replace(/\\/g, '/'),
    contracts: path.relative(root, contractsPath).replace(/\\/g, '/'),
    html_files_checked: htmlFiles.length
  };
}

function main() {
  const platform = checkPlatformArtifacts();
  const lessonRoot = process.env.LESSON_REPO_ROOT || process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length);
  const lesson = lessonRoot ? checkLessonArtifacts(lessonRoot) : null;
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    platform,
    lesson
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkLessonArtifacts,
  checkPlatformArtifacts,
  visibleTextViolations
};
