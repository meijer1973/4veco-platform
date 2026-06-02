#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'GATE-REASON-STD-1';
const GATE_ID = 'GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);
const PACKET_MD = path.join(GATE_DIR, 'review-packet.md');
const PACKET_JSON = path.join(GATE_DIR, 'review-packet.json');
const LIVE_MD = path.join(GATE_DIR, 'live-output-evidence.md');
const LIVE_JSON = path.join(GATE_DIR, 'live-output-evidence.json');
const MANIFEST_MD = path.join(GATE_DIR, 'screenshot-manifest.md');
const PLAYABLE_LAB = path.join(GATE_DIR, 'gate-playable-reasoning-lab.html');
const PLAYABLE_DATA = path.join(GATE_DIR, 'gate-playable-reasoning-data.json');
const PLAYABLE_PROOF = path.join(GATE_DIR, 'playable-proof.json');
const PLAYABLE_RECHECK = path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-playable-proof-recheck.md`);

const REQUIRED_SPRINT_FILES = [
  path.join('reports', 'sprints', `${SPRINT_ID}-plan.md`),
  path.join('references', 'data', 'sprints', `${SPRINT_ID}.plan.json`),
  path.join('reports', 'sprints', `${SPRINT_ID}-baseline.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-assignment.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-round1.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-corrections.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-round2.md`),
  PLAYABLE_RECHECK
];

const REQUIRED_SCREENSHOTS = [
  path.join(GATE_DIR, 'screenshots', 'reason-adopt-mode0-initial.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-adopt-mode1-matched.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-adopt-mobile-mode3.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-play-mode0-retry-feedback.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-play-mode1-next-action.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-play-dark-mode5.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-play-mobile-route-placement.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-answerform-a98-cue.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-answerform-a97-index-cue.png'),
  path.join(GATE_DIR, 'screenshots', 'reason-answerform-mobile-mode3.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-reason-std1-playable-initial.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-reason-std1-playable-retry-feedback.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-reason-std1-playable-next-action-focus.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-reason-std1-playable-completed.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-reason-std1-playable-mobile-dark-completed.png')
];

const REQUIRED_PROOF_JSON = [
  'reports/json/reason-std1-proof.json',
  'reports/json/reason-std1-standard-family-map.json',
  'reports/json/reason-adopt1-proof.json',
  'reports/json/reason-play1-screenshot-proof.json',
  'reports/json/reason-play1-usability.json',
  'reports/json/reason-answerform2-proof.json',
  'reports/json/reason-answerform2-scaffold-map.json'
];

const REQUIRED_SOURCE_EVIDENCE = [
  'reports/sprints/REASON-STD-1-result.md',
  'reports/sprints/REASON-ADOPT-1-result.md',
  'reports/sprints/REASON-PLAY-1-result.md',
  'reports/sprints/REASON-PLAY-1-usability-analysis.md',
  'reports/sprints/REASON-ANSWERFORM-2-result.md',
  'reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md'
];

function fail(message) {
  console.error(`GATE-REASON-STD-1 review packet check failed: ${message}`);
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
  for (const [key, value] of Object.entries(object)) {
    assert(value === false, `${label}.${key} must be false`);
  }
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
  assert(packet.human_interview_started === false, 'legacy interview flag must remain false');
  assert(packet.human_review_comments_started === false, 'human comments must not be started in packet-prep stage');
  assert(packet.human_review_mode === 'direct_packet_comments', 'packet must use direct packet comments');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assertAllFalse(packet.authority_boundary, 'packet authority_boundary');
  assert(live.gate_id === GATE_ID, 'live evidence gate_id mismatch');
  assert(live.sprint_id === SPRINT_ID, 'live evidence sprint_id mismatch');
  assertAllFalse(live.product_boundaries, 'live evidence product_boundaries');

  [
    '## Review Scope',
    '## Evidence Base',
    '## Planned Review Focus',
    '## Minimum Evidence Inspection',
    '## Calibration Checks',
    '## Full Planned Review Comment Prompts',
    '## Direct Review Comment Protocol',
    '## Current Stop Conditions',
    '## Recommended Next Action'
  ].forEach((heading) => {
    assert(packetMd.includes(heading), `review packet missing ${heading}`);
  });

  assert((packetMd.match(/^### REASONSTD1-Q\d+:/gm) || []).length === 11, 'packet must include 11 planned questions');
  assert((packet.calibration_questions || []).length === 3, 'packet JSON must include 3 calibration questions');
  assert((packet.planned_questions || []).length === 11, 'packet JSON must include 11 planned questions');
  assert(packet.direct_review_comment_protocol && packet.direct_review_comment_protocol.default_mode === true, 'direct review comment protocol missing');
  assert(!/Future Interview Protocol/.test(packetMd), 'packet must not use old future interview protocol');
  assert(/comments directly on this packet/i.test(packetMd), 'packet must instruct direct packet comments');
  assert(!/one-question-at-a-time interview is the default/i.test(packetMd), 'packet must not default to interactive interview');

  ['mode 2', 'mode 3', 'mode 4', 'mode 5', 'A97', 'A98', 'A99', 'A81'].forEach((phrase) => {
    assert(packetMd.includes(phrase), `packet missing boundary phrase ${phrase}`);
  });

  [
    'target-equivalent reasoning proof',
    'generated lesson output',
    'source-data mutation',
    'diagnostics',
    'mastery',
    'sequencing',
    'Scale Gate 1',
    'student/product use'
  ].forEach((phrase) => {
    assert(new RegExp(phrase, 'i').test(packetMd), `packet missing authority phrase ${phrase}`);
  });

  REQUIRED_SCREENSHOTS.forEach((file) => {
    exists(file);
    const size = fs.statSync(resolve(file)).size;
    assert(size > 20000, `screenshot looks blank or too small: ${file}`);
    assert(packetMd.includes(toPosix(file)), `packet missing screenshot path ${file}`);
    assert(manifest.includes(path.basename(file)), `manifest missing screenshot ${file}`);
  });

  exists(PLAYABLE_LAB);
  exists(PLAYABLE_DATA);
  exists(PLAYABLE_PROOF);
  assert(packetMd.includes(toPosix(PLAYABLE_LAB)), 'packet missing playable lab path');
  assert(packetMd.includes(toPosix(PLAYABLE_DATA)), 'packet missing playable data path');
  assert(packetMd.includes(toPosix(PLAYABLE_PROOF)), 'packet missing playable proof path');
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_LAB)), 'packet JSON missing playable lab');
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_DATA)), 'packet JSON missing playable data');
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_PROOF)), 'packet JSON missing playable proof');
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_RECHECK)), 'packet JSON missing playable-proof recheck');
  assert(packetMd.includes(toPosix(PLAYABLE_RECHECK)), 'packet missing playable-proof recheck path');

  const playableLab = read(PLAYABLE_LAB);
  const playableData = readJson(PLAYABLE_DATA);
  const playableProof = readJson(PLAYABLE_PROOF);
  assert(playableLab.includes('window.gateReasonStd1'), 'playable lab must expose gateReasonStd1 test API');
  assert(playableLab.includes('Controleer case'), 'playable lab must expose visible check controls');
  assert(playableLab.includes('Speel correct pad automatisch'), 'playable lab must expose auto-correct proof action');
  assert(playableLab.includes('Held lanes'), 'playable lab must show held lanes');
  assert(Array.isArray(playableData.cases) && playableData.cases.length === 4, 'playable data must include four cases');
  assert(playableData.cases.some((entry) => entry.paragraph === '1.1.3' && entry.provenance === 'generated_lesson_reasoning_data'), 'playable data must include 1.1.3 generated lesson-data case');
  assert(playableData.cases.some((entry) => entry.task && entry.task.family === 'structured_reasoning'), 'playable data must include structured_reasoning self-check case');
  assert(Array.isArray(playableData.heldLanes) && playableData.heldLanes.some((entry) => entry.mode === 2) && playableData.heldLanes.some((entry) => entry.mode === 4), 'playable data must show modes 2 and 4 held/local status');
  assertAllFalse(playableData.boundaries, 'playable data boundaries');
  assert(playableProof.status === 'passed', 'playable proof must pass');
  assert(playableProof.summary && playableProof.summary.required_case_count === 4, 'playable proof must require four cases');
  assert(playableProof.summary.desktop_initial_case_count === 4, 'playable proof must show four initial cases');
  assert(playableProof.summary.desktop_initial_check_buttons === 4, 'playable proof must show four check buttons');
  assert(playableProof.summary.retry_state_proved === true, 'playable proof must prove retry state');
  assert(playableProof.summary.next_action_focus_proved === true, 'playable proof must prove next-action focus');
  assert(playableProof.summary.desktop_completed_count === 4 && playableProof.summary.desktop_completed_visible === true, 'playable proof must prove desktop completion');
  assert(playableProof.summary.mobile_dark_completed_count === 4 && playableProof.summary.mobile_dark_completed_visible === true, 'playable proof must prove mobile/dark completion');
  assert(playableProof.summary.hidden_expected_state_lookup_required_after_repair === false, 'playable proof must not require hidden expected-state lookup');
  assert((playableProof.screenshots || []).length >= 5, 'playable proof must record playable screenshots');
  assert(/manually (try|test) at least one case/i.test(packetMd), 'packet must instruct human reviewer to manually test at least one playable case');
  assert(/local static server/i.test(packetMd) && /127\.0\.0\.1/.test(packetMd), 'packet must include localhost/static-server fallback for playable lab');
  assert(live.supplemental_playable_proof_recheck && live.supplemental_playable_proof_recheck.manual_case_test_instruction === true, 'live evidence must require manual playable case test');
  assert(live.supplemental_playable_proof_recheck.autoplay_helper_may_not_replace_human_review === true, 'live evidence must not let autoplay replace human review');
  assert(live.supplemental_playable_proof_recheck.localhost_static_server_fallback_required === true, 'live evidence must require localhost/static-server fallback');

  REQUIRED_PROOF_JSON.forEach((file) => {
    exists(file);
    assert(packet.evidence_base.includes(file), `packet JSON missing proof JSON ${file}`);
  });

  REQUIRED_SOURCE_EVIDENCE.forEach((file) => {
    exists(file);
    assert(packet.evidence_base.includes(file), `packet JSON missing source evidence ${file}`);
  });

  const adopt = readJson('reports/json/reason-adopt1-proof.json');
  assert(adopt.mode_adoption.some((entry) => entry.mode === 0 && entry.shared_shell_family === 'step_ordering'), 'adopt proof missing mode 0 step_ordering');
  assert(adopt.mode_adoption.some((entry) => entry.mode === 3 && /ordered/i.test(entry.status)), 'adopt proof missing mode 3 ordered bridge');
  assert(adopt.mode_adoption.some((entry) => entry.mode === 5 && entry.shared_shell_family === 'structured_reasoning'), 'adopt proof missing mode 5 structured reasoning');
  assertAllFalse(adopt.authority, 'reason-adopt authority');

  const usability = readJson('reports/json/reason-play1-usability.json');
  assert(usability.status === 'pass_with_flags', 'usability status must be pass_with_flags');
  assert(usability.repair_decision && usability.repair_decision.blocking_repair_required === false, 'usability proof must have no blocking repair');
  assertAllFalse(usability.authority, 'reason-play usability authority');

  const answerForm = readJson('reports/json/reason-answerform2-proof.json');
  assert(answerForm.cases.some((entry) => /a98/i.test(entry.name) && entry.internalCodeLeak === false), 'answer-form proof missing A98 no-code-leak case');
  assert(answerForm.cases.some((entry) => /a97/i.test(entry.name) && entry.productClaimLeak === false), 'answer-form proof missing A97 no-product-claim case');
  assert(answerForm.cases.some((entry) => /mode2/i.test(entry.name) && entry.taskFamily === null), 'answer-form proof must keep mode 2 local');
  assertAllFalse(answerForm.authority, 'reason-answerform authority');

  const scaffoldMap = readJson('reports/json/reason-answerform2-scaffold-map.json');
  const sourceText = JSON.stringify(scaffoldMap);
  assert(/requiresUnderlyingAnswerForm/.test(sourceText), 'scaffold map must record underlying answer-form requirement');
  assert(/future_source_use_pattern/.test(sourceText), 'scaffold map must carry future source-use pattern');

  REQUIRED_SPRINT_FILES.forEach(exists);
  const round1Verdict = validateLeadReviewReport(path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-round1.md`), 'round 1');
  const round2Verdict = validateLeadReviewReport(path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-round2.md`), 'round 2');
  const playableRecheckVerdict = validateLeadReviewReport(PLAYABLE_RECHECK, 'playable proof recheck');
  assert(['PASS', 'PASS WITH FLAGS'].includes(round2Verdict), 'lead review round 2 must pass before human review');
  assert(['PASS', 'PASS WITH FLAGS'].includes(playableRecheckVerdict), 'playable-proof recheck must pass before human review');
  const playableRecheck = read(PLAYABLE_RECHECK);
  assert(/GATE-TASK-FAMILY-1/i.test(playableRecheck), 'playable-proof recheck must compare to GATE-TASK-FAMILY-1 pattern');
  assert(/human reviewers should still test at least one case manually/i.test(playableRecheck), 'playable-proof recheck must require manual case testing');

  const corrections = read(path.join('reports', 'sprints', `${SPRINT_ID}-lead-review-corrections.md`));
  assert(corrections.includes(SPRINT_ID), 'corrections log must identify sprint');
  if (round1Verdict === 'REVISE' || round1Verdict === 'PAUSE' || round1Verdict === 'FAIL') {
    assert(/correction|resolved|repaired/i.test(corrections), 'corrections log must describe corrections after non-pass round 1');
  } else {
    assert(/no blocking corrections/i.test(corrections), 'corrections log must record no blocking corrections when round 1 passes');
  }

  assert(/Status: direct-comment review packet/i.test(packetMd), 'packet status must be direct-comment packet');
  assert(/ready after pre-gate lead review/i.test(packetMd), 'packet must state lead-review readiness state');
  assert(/supplemental playable-proof recheck PASS WITH FLAGS/i.test(packetMd), 'packet must state supplemental playable-proof recheck status');
  assert(/no product authority/i.test(packetMd), 'packet status must deny product authority');
  assert(/pre-gate lead review|supplemental lead review/i.test(liveMd), 'live evidence must mention lead review context or packet flow');
}

validatePacket();
console.log('GATE-REASON-STD-1 review packet check passed.');
