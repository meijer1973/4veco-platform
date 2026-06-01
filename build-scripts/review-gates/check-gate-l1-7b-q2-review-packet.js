#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const GATE_ID = 'GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof';
const SPRINT_ID = 'GATE-L1.7B-Q2';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);
const PACKET_MD = path.join(GATE_DIR, 'review-packet.md');
const PACKET_JSON = path.join(GATE_DIR, 'review-packet.json');
const LIVE_MD = path.join(GATE_DIR, 'live-output-evidence.md');
const LIVE_JSON = path.join(GATE_DIR, 'live-output-evidence.json');
const HUMAN_MD = path.join(GATE_DIR, 'human-interview.md');
const HUMAN_JSON = path.join(GATE_DIR, 'human-interview.json');
const CLOSURE_MD = path.join(GATE_DIR, 'gate-closure.md');
const CLOSURE_JSON = path.join(GATE_DIR, 'gate-closure.json');

const REQUIRED_SPRINT_FILES = [
  path.join('reports', 'sprints', 'GATE-L1.7B-Q2-plan.md'),
  path.join('references', 'data', 'sprints', 'GATE-L1.7B-Q2.plan.json'),
  path.join('reports', 'sprints', 'GATE-L1.7B-Q2-baseline.md'),
  path.join('reports', 'sprints', 'GATE-L1.7B-Q2-lead-review-assignment.md'),
  path.join('reports', 'sprints', 'GATE-L1.7B-Q2-lead-review-round1.md'),
  path.join('reports', 'sprints', 'GATE-L1.7B-Q2-lead-review-corrections.md'),
  path.join('reports', 'sprints', 'GATE-L1.7B-Q2-lead-review-round2.md')
];

const REQUIRED_EVIDENCE = [
  'reports/sprints/L1.7B-Q2-result.md',
  'reports/sprints/L1.7B-Q2-diff-summary.md',
  'references/data/sprints/L1.7B-Q2.result.json',
  'reports/sprints/L1.7B-Q2-operation-chain.md',
  'reports/sprints/L1.7B-Q2-answer-model.md',
  'reports/sprints/L1.7B-Q2-live-output-evidence.md',
  'reports/sprints/L1.7B-Q2-live-output-evidence.json',
  'reports/sprints/L1.7B-Q2-screenshot-manifest.md',
  'reports/sprints/L1.7B-Q2-lead-review-round2.md',
  'source-data/book-1/exit-ticket/1.1.2.json',
  '../4veco-lessen/specifications/product-end-state.md',
  '../4veco-lessen/specifications/companion-core-specifications.md'
];

function fail(message) {
  console.error(`GATE-L1.7B-Q2 review packet check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1] : '';
}

function assertAllFalse(record, label) {
  assert(record && typeof record === 'object', `missing ${label}`);
  for (const [key, value] of Object.entries(record)) {
    assert(value === false, `${label}.${key} must be false`);
  }
}

function validateLeadReviewPacketStatus(packet) {
  const lead = packet.pre_gate_lead_review;
  assert(lead && lead.required === true, 'pre_gate_lead_review.required must be true');
  assert(lead.status === 'passed', 'pre_gate_lead_review.status must be passed before human interview');
  assert(['PASS', 'PASS WITH FLAGS'].includes(lead.final_verdict), 'pre_gate_lead_review.final_verdict must be PASS or PASS WITH FLAGS');
  for (const key of ['assignment', 'round1', 'corrections', 'round2']) {
    assert(typeof lead[key] === 'string' && lead[key].trim(), `pre_gate_lead_review.${key} missing`);
    assert(fs.existsSync(lead[key]), `missing pre-gate lead-review file: ${lead[key]}`);
  }
}

function validateLeadReviewReport(file, expectedVerdict, roundPattern) {
  const markdown = read(file);
  assert(/^# Lead Review Summary/m.test(markdown), `${file} must start with "# Lead Review Summary"`);
  assert(new RegExp(`Sprint:\\s*\`${SPRINT_ID}\``).test(markdown), `${file} must identify sprint ${SPRINT_ID}`);
  assert(roundPattern.test(markdown), `${file} must identify expected round`);
  assert(
    new RegExp(`Verdict:\\s*${expectedVerdict.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(markdown),
    `${file} verdict mismatch`
  );
  for (const heading of [
    '## Scope',
    '## Review Plan',
    '## Consolidated Verdict',
    '## Blocking Findings',
    '## Specialist Findings',
    '## Test Evidence',
    '## Learning Quality Evidence',
    '## Student Experience Evidence',
    '## Ownership and Handoff',
    '## Required Next Action'
  ]) {
    assert(markdown.includes(heading), `${file} missing ${heading}`);
  }
}

function main() {
  for (const file of [PACKET_MD, PACKET_JSON, LIVE_MD, LIVE_JSON, ...REQUIRED_SPRINT_FILES]) {
    assert(fs.existsSync(file), `missing required artifact: ${file}`);
  }

  assert(!fs.existsSync(HUMAN_MD), 'human-interview.md must not exist before the human interview starts');
  assert(!fs.existsSync(HUMAN_JSON), 'human-interview.json must not exist before the human interview starts');
  assert(!fs.existsSync(CLOSURE_MD), 'gate-closure.md must not exist before explicit human confirmation');
  assert(!fs.existsSync(CLOSURE_JSON), 'gate-closure.json must not exist before explicit human confirmation');

  const packetMd = read(PACKET_MD);
  const packet = readJson(PACKET_JSON);
  const liveMd = read(LIVE_MD);
  const live = readJson(LIVE_JSON);

  assert(packet.gate_id === GATE_ID, 'review packet JSON gate_id mismatch');
  assert(packet.sprint_id === SPRINT_ID, 'review packet JSON sprint_id mismatch');
  assert(packet.human_interview_started === false, 'human_interview_started must be false');
  assert(packet.gate_closed === false, 'gate_closed must be false');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assert(/no_product_authority|no product authority/i.test(packet.status), 'packet status must say no product authority');
  assertAllFalse(packet.authority_boundary, 'authority_boundary');

  validateLeadReviewPacketStatus(packet);
  validateLeadReviewReport(packet.pre_gate_lead_review.round2, packet.pre_gate_lead_review.final_verdict, /Round:\s*lead review round 2/i);

  assert(/^# GATE-L1\.7B-Q2 Exit Ticket Target-Equivalent Proof Review Packet/m.test(packetMd), 'review packet markdown title mismatch');
  for (const heading of [
    '## Review Scope',
    '## Evidence Base',
    '## Planned Review Focus',
    '## Minimum Live-Output Inspection',
    '## Calibration Questions',
    '## Full Planned Review Questions',
    '## Future Interview Protocol',
    '## Current Stop Conditions',
    '## Recommended Next Action'
  ]) {
    assert(packetMd.includes(heading), `review packet missing heading: ${heading}`);
  }

  assert((packetMd.match(/^### L1Q2-Q\d+:/gm) || []).length === 12, 'review packet must include 12 L1Q2 questions');
  assert((packet.calibration_questions || []).length === 3, 'review packet JSON must include 3 calibration questions');
  assert((packet.planned_questions || []).length === 12, 'review packet JSON must include 12 planned questions');
  for (const questionId of ['L1Q2-Q1', 'L1Q2-Q5', 'L1Q2-Q8', 'L1Q2-Q10', 'L1Q2-Q12']) {
    assert(packetMd.includes(questionId), `review packet missing ${questionId}`);
  }
  assert(packetMd.includes('deterministic text-group matcher'), 'packet must explicitly review deterministic matcher limitation');
  assert(packetMd.includes('core-specification failures'), 'packet must include core-specification failure question');
  assert(packetMd.includes('No. This gate authorizes no mutation or product use'), 'product-authority option must be clearly negative');
  assert(!packetMd.includes('Authorize direct implementation'), 'packet must not offer direct implementation authority');
  assert(!packetMd.includes('Yes, but only for explicitly named low-risk'), 'packet must not conflate planning with product authority');

  for (const requiredSurface of [
    '1.1.2` landing page Check card',
    'correct-response completion state',
    'wrong/retry state for a calculation task',
    'contradictory-D31 rejection path',
    '1.1.1` advisory short-check boundary evidence'
  ]) {
    assert(packetMd.includes(requiredSurface), `minimum live-output checklist missing ${requiredSurface}`);
  }
  assert(Array.isArray(packet.minimum_live_output_inspection) && packet.minimum_live_output_inspection.length === 8, 'JSON must include eight live-output inspection items');

  for (const evidence of REQUIRED_EVIDENCE) {
    assert(packet.evidence_base.includes(evidence), `review packet JSON missing evidence: ${evidence}`);
    assert(packetMd.includes(evidence), `review packet markdown missing evidence: ${evidence}`);
  }

  const stop = section(packetMd, '## Current Stop Conditions');
  for (const phrase of ['pre-gate lead review', 'live rendered output', 'deterministic matching', 'advisory short-check', 'Scale Gate 1', 'student/product use']) {
    assert(new RegExp(phrase, 'i').test(stop), `stop conditions missing ${phrase}`);
  }

  assert(live.gate_id === GATE_ID, 'live evidence gate_id mismatch');
  assert(live.implementation.platform_commit === '31e035aaab656f8f64722ac62d26108f829d0f60', 'live evidence platform commit mismatch');
  assert(live.implementation.lesson_commit === '971bf68402e6071804c44d3aa67c67320a987e33', 'live evidence lesson commit mismatch');
  assert(live.target_equivalent_state.candidate === true, 'live evidence must mark candidate true');
  assert(live.target_equivalent_state.gate_approved === false, 'live evidence gate approval must be false');
  assert(live.target_equivalent_state.completion_language_eligible === false, 'live evidence completion eligibility must be false');
  assert(Array.isArray(live.operation_chain) && live.operation_chain.length === 4, 'live evidence must include four operations');
  assert(live.adversarial_checks.bogus_calculation_work_rejected === true, 'bogus-work adversarial check must be true');
  assert(live.adversarial_checks.contradictory_d31_rejected === true, 'contradictory-D31 adversarial check must be true');
  assertAllFalse(live.product_boundaries, 'live.product_boundaries');
  for (const phrase of ['4 index points', 'not 4 percent', 'product Boundary']) {
    assert(new RegExp(phrase, 'i').test(liveMd), `live evidence markdown missing ${phrase}`);
  }

  console.log('GATE-L1.7B-Q2 review packet OK');
}

try {
  main();
} catch (error) {
  fail(error.message);
}
