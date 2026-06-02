#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'GATE-TASK-FAMILY-1';
const GATE_ID = 'GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);
const PACKET_MD = path.join(GATE_DIR, 'review-packet.md');
const PACKET_JSON = path.join(GATE_DIR, 'review-packet.json');
const LIVE_MD = path.join(GATE_DIR, 'live-output-evidence.md');
const LIVE_JSON = path.join(GATE_DIR, 'live-output-evidence.json');
const MANIFEST_MD = path.join(GATE_DIR, 'screenshot-manifest.md');

const REQUIRED_SPRINT_FILES = [
  path.join('reports', 'sprints', `${SPRINT_ID}-plan.md`),
  path.join('references', 'data', 'sprints', `${SPRINT_ID}.plan.json`),
  path.join('reports', 'sprints', `${SPRINT_ID}-baseline.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-assignment.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-round1.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-corrections.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-round2.md`)
];

const REQUIRED_GALLERIES = [
  path.join(GATE_DIR, 'gate-rendered-family-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-construction-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-construction-detail-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-feedback-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-feedback-detail-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-dark-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-mobile-gallery.html'),
  path.join(GATE_DIR, 'gate-rendered-mobile-controls-gallery.html')
];

const REQUIRED_SCREENSHOTS = [
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-desktop-overview.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-construction-overview.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-construction-detail.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-mobile-narrow.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-mobile-controls.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-dark-mode.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-feedback-states.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-feedback-detail.png')
];

const REQUIRED_FAMILIES = [
  'cloze_text',
  'multi_select',
  'matching_pairs',
  'step_ordering',
  'two_tier_choice',
  'assertion_reason',
  'cloze_tile_select',
  'sentence_builder',
  'formula_builder',
  'source_value_selection',
  'source_chain_builder',
  'label_placement'
];

const REQUIRED_PROOF_JSON = [
  'reports/json/task-family-cloze-tile1-proof.json',
  'reports/json/task-family-sentence1-proof.json',
  'reports/json/task-family-formula1-proof.json',
  'reports/json/task-family-cloze1-proof.json',
  'reports/json/task-family-multi1-proof.json',
  'reports/json/task-family-order1-proof.json',
  'reports/json/task-family-source1-proof.json',
  'reports/json/task-family-label1-proof.json',
  'reports/json/task-family-match1-proof.json',
  'reports/json/task-family-two-tier1-proof.json',
  'reports/json/task-family-assertion1-proof.json'
];

function fail(message) {
  console.error(`GATE-TASK-FAMILY-1 review packet check failed: ${message}`);
  process.exit(1);
}

function resolve(file) {
  return path.join(ROOT, file);
}

function toPosix(file) {
  return file.replace(/\\/g, '/');
}

function exists(file) {
  if (!fs.existsSync(resolve(file))) fail(`missing required artifact: ${file}`);
}

function read(file) {
  exists(file);
  return fs.readFileSync(resolve(file), 'utf8');
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
  return match ? match[1].trim() : '';
}

function assertAllFalse(object, label) {
  assert(object && typeof object === 'object', `${label} missing`);
  Object.entries(object).forEach(([key, value]) => {
    assert(value === false, `${label}.${key} must be false`);
  });
}

function validateLeadReviewReport(file, expectedRound) {
  const markdown = read(file);
  assert(/^# Lead Review Summary/m.test(markdown), `${file} must start with lead-review summary`);
  assert(new RegExp(`Sprint:\\s*\`${SPRINT_ID}\``).test(markdown), `${file} must identify sprint`);
  assert(new RegExp(`Round:\\s*${expectedRound}`, 'i').test(markdown), `${file} must identify ${expectedRound}`);
  [
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
  ].forEach((heading) => {
    assert(markdown.includes(heading), `${file} missing ${heading}`);
  });
  assert(/Evidence inspected:/i.test(section(markdown, '## Scope')), `${file} must state evidence inspected`);
  const verdict = section(markdown, '## Consolidated Verdict').match(/Verdict:\s*(PASS WITH FLAGS|PASS|REVISE|FAIL|PAUSE)/i);
  assert(verdict, `${file} must record verdict`);
  return verdict[1].toUpperCase();
}

function validatePacket() {
  const packetMd = read(PACKET_MD);
  const packet = readJson(PACKET_JSON);
  const liveMd = read(LIVE_MD);
  const live = readJson(LIVE_JSON);
  const manifest = read(MANIFEST_MD);

  assert(packet.gate_id === GATE_ID, 'packet gate_id mismatch');
  assert(packet.sprint_id === SPRINT_ID, 'packet sprint_id mismatch');
  assert(packet.human_interview_started === false, 'human interview must not be started in packet-prep stage');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assertAllFalse(packet.authority_boundary, 'packet authority_boundary');
  assert(live.gate_id === GATE_ID, 'live evidence gate_id mismatch');
  assert(live.sprint_id === SPRINT_ID, 'live evidence sprint_id mismatch');
  assertAllFalse(live.product_boundaries, 'live evidence product_boundaries');

  [
    '## Review Scope',
    '## Evidence Base',
    '## Planned Review Focus',
    '## Minimum Rendered Evidence Inspection',
    '## Calibration Questions',
    '## Full Planned Review Questions',
    '## Future Interview Protocol',
    '## Current Stop Conditions',
    '## Recommended Next Action'
  ].forEach((heading) => {
    assert(packetMd.includes(heading), `review packet missing ${heading}`);
  });
  assert((packetMd.match(/^### TASKFAM1-Q\d+:/gm) || []).length === 12, 'packet must include 12 planned questions');
  assert((packet.calibration_questions || []).length === 3, 'packet JSON must include 3 calibration questions');
  assert((packet.planned_questions || []).length === 12, 'packet JSON must include 12 planned questions');

  REQUIRED_FAMILIES.forEach((family) => {
    assert(packetMd.includes(family), `packet missing family ${family}`);
    assert(live.families_reviewed.includes(family), `live evidence missing family ${family}`);
  });

  [
    'generated lesson output',
    'source-data mutation',
    'product-route adoption',
    'target-equivalent',
    'diagnostics',
    'mastery',
    'Scale Gate 1',
    'student/product use'
  ].forEach((phrase) => {
    assert(new RegExp(phrase, 'i').test(packetMd), `packet missing boundary phrase ${phrase}`);
  });

  REQUIRED_SCREENSHOTS.forEach((file) => {
    exists(file);
    const size = fs.statSync(resolve(file)).size;
    assert(size > 20000, `screenshot looks blank or too small: ${file}`);
    assert(packetMd.includes(toPosix(file)), `packet missing screenshot path ${file}`);
    assert(manifest.includes(path.basename(file)), `manifest missing screenshot ${file}`);
  });

  REQUIRED_GALLERIES.forEach((file) => {
    const html = read(file);
    assert(html.includes('target-proof boundary held'), `${file} missing review boundary`);
    assert(html.includes('Open validated fixture'), `${file} missing fixture link`);
    assert(packet.evidence_base.includes(toPosix(file)), `packet JSON missing gallery ${file}`);
  });

  const mainGallery = read(path.join(GATE_DIR, 'gate-rendered-family-gallery.html'));
  REQUIRED_FAMILIES.forEach((family) => {
    assert(mainGallery.includes(family), `main gallery missing ${family}`);
  });
  assert(!mainGallery.includes('<iframe'), 'main gallery must embed fixture fragments, not iframe them');

  REQUIRED_PROOF_JSON.forEach((file) => {
    const proof = readJson(file);
    assert(packet.evidence_base.includes(file), `packet JSON missing proof ${file}`);
    assert(live.proof_inputs.proof_json.includes(file), `live evidence missing proof ${file}`);
    if (proof.boundary_flags) {
      [
        'target_equivalent_reliance',
        'diagnostics',
        'adaptive_routing',
        'mastery',
        'sequencing',
        'student_facing_ai',
        'summative_use',
        'pv_projection',
        'pv_machine_promotion',
        'scale_gate_1'
      ].forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(proof.boundary_flags, key)) {
          assert(proof.boundary_flags[key] === false, `${file} boundary flag ${key} must be false`);
        }
      });
    }
  });

  const stop = section(packetMd, '## Current Stop Conditions');
  [
    'pre-gate lead review',
    'screenshots',
    'target-equivalent',
    'generated lesson output',
    'engine implementation',
    'Scale Gate 1',
    'old exit-ticket archive'
  ].forEach((phrase) => {
    assert(new RegExp(phrase, 'i').test(stop), `stop conditions missing ${phrase}`);
  });

  assert(packet.pre_gate_lead_review.required === true, 'lead review must be required');
  assert(packet.pre_gate_lead_review.status === 'passed', 'lead review status must be passed before human interview');
  assert(['PASS', 'PASS WITH FLAGS'].includes(packet.pre_gate_lead_review.final_verdict), 'lead review final verdict must pass');
  const round1Verdict = validateLeadReviewReport(packet.pre_gate_lead_review.round1, 'lead review round 1');
  const round2Verdict = validateLeadReviewReport(packet.pre_gate_lead_review.round2, 'lead review round 2');
  assert(['PASS', 'PASS WITH FLAGS', 'REVISE'].includes(round1Verdict), 'round 1 verdict must be valid');
  assert(['PASS', 'PASS WITH FLAGS'].includes(round2Verdict), 'round 2 must pass');
  exists(packet.pre_gate_lead_review.assignment);
  exists(packet.pre_gate_lead_review.corrections);

  console.log('GATE-TASK-FAMILY-1 review packet OK');
}

try {
  [...REQUIRED_SPRINT_FILES, PACKET_MD, PACKET_JSON, LIVE_MD, LIVE_JSON, MANIFEST_MD].forEach(exists);
  validatePacket();
} catch (error) {
  fail(error.message);
}
