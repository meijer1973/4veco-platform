#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  REQUIRED_FALSE_FLAGS,
  REQUIRED_LEAD_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  LEAD_REVIEW_FILE,
  readinessBundle
} = require('./build-y2-four-target-cp6-scale-gate-readiness-bundle-1');
const { LESSON_OUTPUT_ROOT } = require('./build-y2-four-target-bounded-route-adoption-1');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);

function fail(message) {
  console.error(`Y2 four-target CP-6 / Scale Gate readiness check failed: ${message}`);
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

function checkIssue(item, context) {
  assertRevStdClassification(item.classification, context);
  assert(item.blocks, `${context} missing blocks`);
  assert(item.does_not_block, `${context} missing does_not_block`);
  assert(item.proof_required_to_close, `${context} missing proof_required_to_close`);
}

function markdownFindingClassifications(markdown) {
  const classifications = [];
  let inTable = false;
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('| Finding |') || trimmed.startsWith('| Issue |')) {
      inTable = true;
      continue;
    }
    if (inTable && trimmed.startsWith('## ')) inTable = false;
    if (!inTable) continue;
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
    'Current-Main Proof',
    'Core Route Review',
    'Completion-Language Decision',
    'Lead Reviews',
    'Core-Requirement Checklist',
    'Findings Classification',
    'Carried Issues',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'Authority Boundary',
    'Rollback',
    'Recommended Next Action'
  ]) {
    assert(markdown.includes(needle), `${relFromPlatform(file)} missing required section/text: ${needle}`);
  }
  const classifications = markdownFindingClassifications(markdown);
  assert(classifications.length > 0, `${relFromPlatform(file)} missing REV-STD-1 classification rows`);
  for (const classification of classifications) {
    assertRevStdClassification(classification, `${relFromPlatform(file)} finding row`);
  }
}

function checkLeadReviews() {
  const file = path.join(PLATFORM_ROOT, LEAD_REVIEW_FILE);
  assert(exists(file), `${LEAD_REVIEW_FILE} missing`);
  const text = readText(file);
  assert(text.includes('Verdict: PASS') || text.includes('Verdict: PASS WITH FLAGS'), 'lead review file missing acceptable consolidated verdict');
  for (const scope of REQUIRED_LEAD_REVIEW_SCOPES) {
    assert(text.includes(scope), `lead review file missing scope: ${scope}`);
  }
  assert(text.includes('Subagent:'), 'lead review file must include subagent evidence');
  assert(text.includes('authority boundaries'), 'lead review file must include authority boundary review');
  assert(text.includes('CP-6') && text.includes('Scale Gate'), 'lead review file must name CP-6 and Scale Gate');
}

function checkPacket(lessonRoot) {
  const bundlePath = path.join(REPORT_DIR, 'cp6-scale-gate-readiness-bundle.json');
  const bundleMdPath = path.join(REPORT_DIR, 'cp6-scale-gate-readiness-bundle.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-readiness-bundle.html');
  for (const file of [bundlePath, bundleMdPath, reviewPath, reviewMdPath, renderedPath]) {
    assert(exists(file), `missing ${relFromPlatform(file)}`);
  }

  const packet = readJson(bundlePath);
  const expected = readinessBundle({ lessonRoot });
  assert(packet.schema_version === 1, 'schema_version must be 1');
  assert(packet.sprint_id === SPRINT_ID, 'sprint_id mismatch');
  assert(packet.status === 'cp6_scale_gate_readiness_bundle_ready_for_human_review', 'status mismatch');
  assert(packet.route === 'READY_FOR_HUMAN_REVIEW', 'route must be READY_FOR_HUMAN_REVIEW');
  assert(packet.product_end_state.includes('CP-6') && packet.product_end_state.includes('Scale Gate'), 'product end-state must name CP-6 and Scale Gate');
  assert(packet.original_sprint_gate_spec.product_end_state_baseline, 'product end-state baseline citation missing');
  assert(packet.original_sprint_gate_spec.mtu_task_family_governed_proof, 'MTU proof citation missing');
  assert(packet.original_sprint_gate_spec.post_adoption_precheck_packet, 'post-adoption precheck citation missing');
  assert(JSON.stringify(packet.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(packet.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }
  assert(packet.authority_claims.ready_for_human_cp6_scale_gate_review === true, 'human review readiness flag missing');
  assert(JSON.stringify(packet.core_requirement_checklist) === JSON.stringify(expected.core_requirement_checklist), 'core checklist drifted');
  checkCoreChecklist(packet.core_requirement_checklist, 'readiness bundle');

  assert(packet.current_main_evidence.platform_bounded_adoption_is_ancestor === true, 'platform bounded adoption lineage missing');
  assert(packet.current_main_evidence.lesson_bounded_adoption_is_ancestor === true, 'lesson bounded adoption lineage missing');
  assert(packet.current_main_evidence.platform_post_adoption_is_ancestor === true, 'platform post-adoption lineage missing');
  assert(packet.current_main_evidence.lesson_route_output_unchanged_since_bounded_adoption === true, 'lesson route output changed; screenshot refresh decision must be revisited');
  assert(packet.screenshot_refresh_decision.refreshed_screenshots_required === false, 'screenshot refresh decision should be false only while route output is unchanged');
  assert(packet.screenshot_refresh_decision.inherited_screenshot_count === 48, 'inherited screenshot count must be 48');

  assert(Array.isArray(packet.records) && packet.records.length === 4, 'packet must include four route records');
  for (const record of packet.records) {
    checkCoreChecklist(record.core_requirement_checklist, record.route_id);
    assert(record.completion_language_decision.target_equivalent_completion_language_authorized === false, `${record.route_id} completion language must remain false`);
    assert(record.governed_mtu_task_family_review.proof_cases_complete === true, `${record.route_id} governed MTU proof incomplete`);
    assert(record.exit_ticket_target_equivalence_review.target_equivalent_requirements_visible === true, `${record.route_id} exit-ticket requirements not visible`);
    for (const issue of record.carried_issues) checkIssue(issue, `${record.route_id} carried issue`);
  }

  for (const finding of packet.findings) checkIssue(finding, 'packet finding');
  for (const issue of packet.carried_issues) checkIssue(issue, 'packet carried issue');
  assert(!packet.findings.some((finding) => finding.classification === 'core_spec_failure'), 'packet may not carry missing core requirements');
  assert(!packet.carried_issues.some((issue) => issue.classification === 'core_spec_failure'), 'carried issues may not carry missing core requirements');

  const review = readJson(reviewPath);
  assert(review.readiness_bundle === relFromPlatform(bundlePath), 'review packet readiness pointer mismatch');
  assert(review.rendered_readiness_bundle === relFromPlatform(renderedPath), 'review packet rendered pointer mismatch');
  assert(review.lead_review_evidence === LEAD_REVIEW_FILE, 'review packet lead-review pointer mismatch');
  checkMarkdown(bundleMdPath);
  checkMarkdown(reviewMdPath);
  checkLeadReviews();

  const rendered = readText(renderedPath);
  assert(rendered.includes('CP-6 / Scale Gate readiness bundle'), 'rendered readiness missing heading');
  assert(rendered.includes('Authority Boundary'), 'rendered readiness missing authority boundary');

  return {
    bundle: relFromPlatform(bundlePath),
    review: relFromPlatform(reviewPath),
    rendered: relFromPlatform(renderedPath),
    lead_reviews: LEAD_REVIEW_FILE
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
    expected_return: 'YEAR 2 FOUR-TARGET CP6 SCALE GATE READINESS BUNDLE READY FOR HUMAN REVIEW'
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkPacket
};
