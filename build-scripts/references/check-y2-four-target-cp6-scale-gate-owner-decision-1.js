#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  AUTHORITY_CLAIMS,
  EXPECTED_OWNER_RETURNS,
  REQUIRED_FALSE_FLAGS,
  REQUIRED_LEAD_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  LEAD_REVIEW_FILE,
  ownerDecisionPacket,
} = require('./build-y2-four-target-cp6-scale-gate-owner-decision-1');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);

function fail(message) {
  console.error(`Y2 four-target CP-6 / Scale Gate owner decision check failed: ${message}`);
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
    'Source Decision Bundle',
    'Owner Decision State',
    'Owner Return Effects',
    'Lead Reviews',
    'Core-Requirement Checklist',
    'Findings Classification',
    'Carried Issues',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'Authority Boundary',
    'False Authority Flags',
    'Recommended Next Action',
  ]) {
    assert(markdown.includes(needle), `${relFromPlatform(file)} missing required section/text: ${needle}`);
  }
  const classifications = markdownFindingClassifications(markdown);
  assert(classifications.length > 0, `${relFromPlatform(file)} missing REV-STD-1 classification rows`);
  for (const classification of classifications) {
    assertRevStdClassification(classification, `${relFromPlatform(file)} finding row`);
  }
  assert(
    !/PASS WITH FLAGS[\s\S]*core requirement missing/i.test(markdown),
    `${relFromPlatform(file)} carries a missing core requirement under PASS WITH FLAGS wording`
  );
}

function checkLeadReviews() {
  const file = path.join(PLATFORM_ROOT, LEAD_REVIEW_FILE);
  assert(exists(file), `${LEAD_REVIEW_FILE} missing`);
  const text = readText(file);
  assert(
    text.includes('Verdict: PASS') || text.includes('Verdict: PASS WITH FLAGS'),
    'lead review file missing acceptable consolidated verdict'
  );
  assert(text.includes('Subagent:'), 'lead review file must include subagent evidence');
  for (const scope of REQUIRED_LEAD_REVIEW_SCOPES) {
    assert(text.includes(scope), `lead review file missing scope: ${scope}`);
  }
  for (const expected of EXPECTED_OWNER_RETURNS) {
    assert(text.includes(expected), `lead review file missing expected owner return: ${expected}`);
  }
  assert(text.includes('Authority Boundary') || text.includes('authority boundary'), 'lead review file must include authority boundary review');
}

function checkPacket() {
  const packetPath = path.join(REPORT_DIR, 'owner-decision-intake.json');
  const packetMdPath = path.join(REPORT_DIR, 'owner-decision-intake.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-owner-decision.html');
  for (const file of [packetPath, packetMdPath, reviewPath, reviewMdPath, renderedPath]) {
    assert(exists(file), `missing ${relFromPlatform(file)}`);
  }

  const packet = readJson(packetPath);
  const expected = ownerDecisionPacket();
  assert(packet.schema_version === 1, 'schema_version must be 1');
  assert(packet.sprint_id === SPRINT_ID, 'sprint_id mismatch');
  assert(packet.status === 'owner_decision_intake_ready_for_human_review', 'status mismatch');
  assert(packet.route === 'READY_FOR_HUMAN_REVIEW', 'route must be READY_FOR_HUMAN_REVIEW');
  assert(packet.product_end_state.includes('CP-6') && packet.product_end_state.includes('Scale Gate'), 'product end-state must name CP-6 and Scale Gate');
  assert(packet.original_sprint_gate_spec.product_end_state_baseline, 'product end-state baseline citation missing');
  assert(packet.original_sprint_gate_spec.source_decision_bundle, 'source decision bundle citation missing');
  assert(packet.original_sprint_gate_spec.readiness_bundle, 'readiness bundle citation missing');
  assert(JSON.stringify(packet.authority_claims) === JSON.stringify(AUTHORITY_CLAIMS), 'authority claims drifted');
  for (const flag of REQUIRED_FALSE_FLAGS) {
    assert(packet.authority_claims[flag] === false, `authority flag must remain false: ${flag}`);
  }

  checkCoreChecklist(packet.core_requirement_checklist, 'owner decision intake');
  assert(JSON.stringify(packet.core_requirement_checklist) === JSON.stringify(expected.core_requirement_checklist), 'core checklist drifted');
  assert(packet.source_decision_bundle_summary.route_count === 4, 'source decision bundle must include four routes');
  assert(packet.source_decision_bundle_summary.cp6_and_scale_gate_lanes_ready_for_owner_decision === true, 'source CP-6/Scale Gate owner-decision readiness missing');
  assert(packet.source_decision_bundle_summary.source_decision_merge_is_ancestor === true, 'source decision merge must be ancestor of current head');
  assert(packet.current_main_evidence.source_decision_bundle_merge_is_ancestor === true, 'current evidence missing source merge ancestry');
  assert(packet.current_main_evidence.owner_decision_packet_protected_surface_mutation === false, 'intake packet must not mutate protected surfaces');
  assert(packet.owner_decision_state.decision_received === false, 'owner decision must remain unreceived in this intake packet');
  assert(packet.owner_decision_state.decision_recorded_by_this_packet === false, 'owner decision must not be recorded by this intake packet');
  assert(packet.owner_decision_state.accepted_owner_return === null, 'accepted owner return must remain null');
  assert(JSON.stringify(packet.owner_decision_state.allowed_owner_returns) === JSON.stringify(EXPECTED_OWNER_RETURNS), 'allowed owner returns drifted');
  assert(Array.isArray(packet.owner_return_effects) && packet.owner_return_effects.length === 2, 'owner return effects must include READY and BLOCKED');
  for (const effect of packet.owner_return_effects) {
    assert(EXPECTED_OWNER_RETURNS.includes(effect.owner_return), `unknown owner return effect: ${effect.owner_return}`);
    assert(effect.status === 'ACCEPTABLE_OWNER_INPUT_NOT_PRESENT', `${effect.owner_return} must remain absent`);
    assert(effect.does_not_authorize_without_separate_decision, `${effect.owner_return} missing downstream boundary`);
  }

  for (const finding of packet.findings) checkIssue(finding, 'packet finding');
  for (const item of packet.carried_issues) checkIssue(item, 'packet carried issue');
  assert(!packet.findings.some((finding) => finding.classification === 'core_spec_failure'), 'packet may not carry missing core requirements');
  assert(!packet.carried_issues.some((item) => item.classification === 'core_spec_failure'), 'carried issues may not carry missing core requirements');

  const review = readJson(reviewPath);
  assert(review.owner_decision_intake === relFromPlatform(packetPath), 'review packet intake pointer mismatch');
  assert(review.rendered_owner_decision === relFromPlatform(renderedPath), 'review packet rendered pointer mismatch');
  assert(review.source_decision_bundle === packet.original_sprint_gate_spec.source_decision_bundle, 'review packet source pointer mismatch');
  assert(review.lead_review_evidence === LEAD_REVIEW_FILE, 'review packet lead-review pointer mismatch');
  assert(JSON.stringify(review.expected_human_return) === JSON.stringify(EXPECTED_OWNER_RETURNS), 'review packet expected owner returns drifted');

  checkMarkdown(packetMdPath);
  checkMarkdown(reviewMdPath);
  checkLeadReviews();

  const rendered = readText(renderedPath);
  assert(rendered.includes('Owner decision intake'), 'rendered owner decision missing heading');
  assert(rendered.includes('Authority Boundary'), 'rendered owner decision missing authority boundary');

  return {
    packet: relFromPlatform(packetPath),
    review: relFromPlatform(reviewPath),
    rendered: relFromPlatform(renderedPath),
    lead_reviews: LEAD_REVIEW_FILE,
  };
}

function main() {
  const output = checkPacket();
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    output,
    expected_owner_returns: EXPECTED_OWNER_RETURNS,
  }, null, 2));
}

if (require.main === module) {
  main();
}
