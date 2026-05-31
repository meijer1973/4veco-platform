#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const GATE_ID = 'GATE-ENGINE-1-four-engine-operational-integration';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);
const PACKET_MD = path.join(GATE_DIR, 'review-packet.md');
const PACKET_JSON = path.join(GATE_DIR, 'review-packet.json');
const LIVE_MD = path.join(GATE_DIR, 'live-output-evidence.md');
const LIVE_JSON = path.join(GATE_DIR, 'live-output-evidence.json');
const LIVE_INSPECTION_MD = path.join(GATE_DIR, 'live-output-inspection.md');
const LIVE_INSPECTION_JSON = path.join(GATE_DIR, 'live-output-inspection.json');
const HUMAN_MD = path.join(GATE_DIR, 'human-interview.md');
const HUMAN_JSON = path.join(GATE_DIR, 'human-interview.json');
const CLOSURE_MD = path.join(GATE_DIR, 'gate-closure.md');
const CLOSURE_JSON = path.join(GATE_DIR, 'gate-closure.json');
const SPRINT_ID = 'GATE-ENGINE-1';

const REQUIRED_SPRINT_FILES = [
  path.join('reports', 'sprints', 'GATE-ENGINE-1-plan.md'),
  path.join('references', 'data', 'sprints', 'GATE-ENGINE-1.plan.json'),
  path.join('reports', 'sprints', 'GATE-ENGINE-1-baseline.md'),
  path.join('reports', 'sprints', 'GATE-ENGINE-1-lead-review-assignment.md'),
  path.join('reports', 'sprints', 'GATE-ENGINE-1-lead-review-round1.md'),
  path.join('reports', 'sprints', 'GATE-ENGINE-1-lead-review-corrections.md'),
  path.join('reports', 'sprints', 'GATE-ENGINE-1-lead-review-round2.md'),
  path.join('reports', 'sprints', 'GATE-ENGINE-1-lead-review-round2-recheck1.md')
];

const REQUIRED_EVIDENCE = [
  'reports/sprints/GAME-ARCH-2-architecture-map.md',
  'reports/sprints/GAME-ARCH-2-route-api.md',
  'reports/sprints/GAME-ARCH-2-task-shell-api.md',
  'reports/sprints/GAME-ARCH-2-file-disposition.md',
  'reports/sprints/GAME-ARCH-2-state-ownership.md',
  'reports/sprints/GAME-ARCH-2-feedback-ownership.md',
  'reports/sprints/GAME-ARCH-2-target-operation-coverage.md',
  'reports/sprints/GRAPH-UX-2-student-route-proof.md',
  'reports/sprints/MATH-UX-2-student-route-proof.md',
  'reports/sprints/REASON-UX-2-student-route-proof.md'
];

function fail(message) {
  console.error(`GATE-ENGINE-1 review packet check failed: ${message}`);
  process.exit(1);
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

function assert(condition, message) {
  if (!condition) fail(message);
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1] : '';
}

function assertFalseAuthority(authority) {
  assert(authority && typeof authority === 'object', 'missing authority_boundary');
  for (const [key, value] of Object.entries(authority)) {
    if (key.endsWith('_authorized') || key.includes('use') || key.includes('scale_gate')) {
      assert(value === false, `authority flag must be false: ${key}`);
    }
  }
}

function validateLeadReviewPacketStatus(packet) {
  const lead = packet.pre_gate_lead_review;
  assert(lead && lead.required === true, 'pre_gate_lead_review.required must be true');
  assert(lead.status === 'passed', 'pre_gate_lead_review.status must be passed before human interview');
  assert(['PASS', 'PASS WITH FLAGS'].includes(lead.final_verdict), 'pre_gate_lead_review.final_verdict must be PASS or PASS WITH FLAGS');
  for (const key of ['assignment', 'round1', 'corrections', 'round2']) {
    assert(typeof lead[key] === 'string' && lead[key].trim(), `pre_gate_lead_review.${key} missing`);
    assert(fs.existsSync(lead[key]), `missing pre-gate lead review file: ${lead[key]}`);
  }
  assert(typeof lead.recheck1 === 'string' && lead.recheck1.trim(), 'pre_gate_lead_review.recheck1 missing');
  assert(fs.existsSync(lead.recheck1), `missing pre-gate lead review recheck file: ${lead.recheck1}`);
  assert(['PASS', 'PASS WITH FLAGS'].includes(lead.recheck1_verdict), 'pre_gate_lead_review.recheck1_verdict must be PASS or PASS WITH FLAGS');
}

function validateLeadReviewReport(file, expectedVerdict, roundPattern) {
  const markdown = read(file);
  assert(/^# Lead Review Summary/m.test(markdown), `${file} must start with lead-review summary`);
  assert(new RegExp(`Sprint:\\s*\`${SPRINT_ID}\``).test(markdown), `${file} must identify sprint ${SPRINT_ID}`);
  assert(roundPattern.test(markdown), `${file} must identify expected round`);
  assert(new RegExp(`Verdict:\\s*${expectedVerdict.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(markdown), `${file} verdict mismatch`);
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

  const packetMd = read(PACKET_MD);
  const packet = readJson(PACKET_JSON);
  const liveMd = read(LIVE_MD);
  const live = readJson(LIVE_JSON);
  const hasHumanInterview = fs.existsSync(HUMAN_MD) || fs.existsSync(HUMAN_JSON);
  const hasGateClosure = fs.existsSync(CLOSURE_MD) || fs.existsSync(CLOSURE_JSON);

  assert(packet.gate_id === GATE_ID, 'review packet JSON gate_id mismatch');
  assert(packet.sprint_id === SPRINT_ID, 'review packet JSON sprint_id mismatch');
  if (packet.human_interview_started === false) {
    assert(!hasHumanInterview, 'human interview files must not exist before interview starts');
    assert(!hasGateClosure, 'gate closure files must not exist before human confirmation');
  } else {
    assert(fs.existsSync(HUMAN_MD), 'human-interview.md must exist after interview starts');
    assert(fs.existsSync(HUMAN_JSON), 'human-interview.json must exist after interview starts');
    assert(fs.existsSync(CLOSURE_MD), 'gate-closure.md must exist after closure');
    assert(fs.existsSync(CLOSURE_JSON), 'gate-closure.json must exist after closure');
    assert(fs.existsSync(LIVE_INSPECTION_MD), 'live-output-inspection.md must exist after closure');
    assert(fs.existsSync(LIVE_INSPECTION_JSON), 'live-output-inspection.json must exist after closure');
    const interview = readJson(HUMAN_JSON);
    const closure = readJson(CLOSURE_JSON);
    const inspection = readJson(LIVE_INSPECTION_JSON);
    assert(interview.closure_confirmation && interview.closure_confirmation.confirmed_by_human === true, 'human interview must record closure confirmation');
    assert(closure.status === 'pass_with_flags', 'GATE-ENGINE-1 closure must be pass_with_flags');
    assert(closure.reviewed_remote_commit === packet.reviewed_remote_commit, 'closure reviewed commit must match packet');
    assert(inspection.status === 'pass_minimum_live_output_inspection', 'live-output inspection must pass');
    assert(inspection.reviewed_remote_commit === packet.reviewed_remote_commit, 'inspection reviewed commit must match packet');
    assert(closure.authority_boundary && Object.values(closure.authority_boundary).every(value => value === false), 'closure authority boundary must remain false');
  }
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assert(/no[_ ]product[_ ]authority/i.test(packet.status), 'packet status must state no product authority');
  assertFalseAuthority(packet.authority_boundary);
  validateLeadReviewPacketStatus(packet);
  validateLeadReviewReport(packet.pre_gate_lead_review.round2, packet.pre_gate_lead_review.final_verdict, /Round:\s*lead review round 2/i);
  validateLeadReviewReport(packet.pre_gate_lead_review.recheck1, packet.pre_gate_lead_review.recheck1_verdict, /Round:\s*lead review round 2 recheck 1/i);

  assert(/^# GATE-ENGINE-1 Four-Engine Operational Integration Review Packet/m.test(packetMd), 'review packet markdown title mismatch');
  for (const heading of [
    '## Review Scope',
    '## Evidence Base',
    '## Planned Review Focus',
    '## Calibration Questions',
    '## Full Planned Review Questions',
    '## Future Interview Protocol',
    '## Current Stop Conditions',
    '## Recommended Next Action'
  ]) {
    assert(packetMd.includes(heading), `review packet missing heading: ${heading}`);
  }
  assert((packetMd.match(/^### ENGINE1-Q\d+:/gm) || []).length === 13, 'review packet must include 13 ENGINE1 questions');
  assert((packet.calibration_questions || []).length === 3, 'review packet JSON must include 3 calibration questions');
  assert((packet.planned_questions || []).length === 13, 'review packet JSON must include 13 planned questions');
  for (const questionId of ['ENGINE1-Q1', 'ENGINE1-Q7', 'ENGINE1-Q8', 'ENGINE1-Q11', 'ENGINE1-Q13']) {
    assert(packetMd.includes(questionId), `review packet missing ${questionId}`);
  }
  assert(packetMd.includes('core-specification failures'), 'review packet must include core-specification failure question');
  assert(!packetMd.includes('Authorize controlled engine implementation for accepted components'), 'review packet must not offer direct implementation authority');
  assert(!packetMd.includes('Yes, but only for explicitly named low-risk implementation planning'), 'product-authority question must not conflate planning with product authority');
  assert(packetMd.includes('not yet implemented for 1.1.1, 1.1.2, or 1.1.3'), 'target-equivalent row must cover all three paragraphs');
  assert(packetMd.includes('## Minimum Live-Output Inspection'), 'review packet must include minimum live-output inspection checklist');
  for (const requiredSurface of [
    '1.1.1` landing page and advisory Check route',
    '1.1.2` landing page and Rekenen/math route',
    '1.1.3` landing page and Grafieken route',
    'one mobile or narrow-viewport route-panel state',
    'one dark-mode route/task state',
    'one task-shell feedback state each for graph, math, and reasoning'
  ]) {
    assert(packetMd.includes(requiredSurface), `minimum live-output checklist missing ${requiredSurface}`);
  }
  assert(Array.isArray(packet.minimum_live_output_inspection) && packet.minimum_live_output_inspection.length === 7, 'JSON must include seven minimum live-output inspection items');
  for (const required of [
    'Show the full question list',
    'Ask calibration questions',
    'Ask one question at a time',
    'Run pattern analysis',
    'targeted follow-ups',
    'explicit human confirmation'
  ]) {
    assert(packetMd.includes(required), `review packet missing protocol phrase: ${required}`);
  }

  const stop = section(packetMd, '## Current Stop Conditions');
  for (const phrase of [
    'pre-gate lead review',
    'live rendered output',
    'short check',
    'target-equivalent',
    'diagnostics',
    'Scale Gate 1'
  ]) {
    assert(new RegExp(phrase, 'i').test(stop), `stop conditions missing ${phrase}`);
  }

  for (const evidence of REQUIRED_EVIDENCE) {
    assert(packet.evidence_base.includes(evidence), `review packet JSON missing evidence: ${evidence}`);
    assert(packetMd.includes(evidence), `review packet markdown missing evidence: ${evidence}`);
  }

  assert(live.gate_id === GATE_ID, 'live evidence gate_id mismatch');
  assert(Array.isArray(live.route_output_validators) && live.route_output_validators.length === 3, 'live evidence must include three route validators');
  assert(Array.isArray(live.paragraph_routes) && live.paragraph_routes.length === 3, 'live evidence must include three paragraph routes');
  for (const paragraph of ['1.1.1', '1.1.2', '1.1.3']) {
    assert(live.paragraph_routes.some((item) => item.paragraph === paragraph), `live evidence missing paragraph ${paragraph}`);
  }
  assert(live.product_boundaries && Object.values(live.product_boundaries).every((value) => value === false), 'live evidence product boundaries must all be false');
  for (const phrase of ['GRAPH-UX-2 route output OK', 'MATH-UX-2 route output OK', 'REASON-UX-2 route output OK']) {
    assert(liveMd.includes(phrase), `live evidence markdown missing validator result: ${phrase}`);
  }

  console.log('GATE-ENGINE-1 review packet OK');
}

try {
  main();
} catch (error) {
  fail(error.message);
}
