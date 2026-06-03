#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-REASON-REVISION-1-reasoning-revision-evidence-review';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);
const PACKET_MD = path.join(GATE_DIR, 'review-packet.md');
const PACKET_JSON = path.join(GATE_DIR, 'review-packet.json');
const LIVE_MD = path.join(GATE_DIR, 'live-output-evidence.md');
const LIVE_JSON = path.join(GATE_DIR, 'live-output-evidence.json');
const MANIFEST_MD = path.join(GATE_DIR, 'screenshot-manifest.md');
const LAB = path.join(GATE_DIR, 'gate-playable-reasoning-revision-lab.html');
const DATA = path.join(GATE_DIR, 'gate-playable-reasoning-revision-data.json');
const PROOF = path.join(GATE_DIR, 'playable-proof.json');

const REQUIRED_SCREENSHOTS = [
  'gate-reason-revision1-playable-initial.png',
  'gate-reason-revision1-playable-retry-feedback.png',
  'gate-reason-revision1-playable-next-action-focus.png',
  'gate-reason-revision1-playable-completed.png',
  'gate-reason-revision1-playable-mobile-dark-completed.png',
].map((name) => path.join(GATE_DIR, 'screenshots', name));

const REQUIRED_SPRINTS = [
  'REASON-REVISION-0',
  'REASON-CONTEXT-1',
  'REASON-REPLACE-AUDIT-1',
];

const REQUIRED_GATE_LEAD_REVIEW = [
  path.join('reports', 'sprints', 'GATE-REASON-REVISION-1-lead-review-assignment.md'),
  path.join('reports', 'sprints', 'GATE-REASON-REVISION-1-lead-review-round1.md'),
  path.join('reports', 'sprints', 'GATE-REASON-REVISION-1-lead-review-corrections.md'),
  path.join('reports', 'sprints', 'GATE-REASON-REVISION-1-lead-review-round2.md'),
];

function fail(message) {
  console.error(`GATE-REASON-REVISION-1 check failed: ${message}`);
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

function assertAllFalse(object, label) {
  assert(object && typeof object === 'object', `${label} missing`);
  for (const [key, value] of Object.entries(object)) {
    assert(value === false, `${label}.${key} must be false`);
  }
}

function validateSprintArtifacts(sprintId) {
  [
    path.join('reports', 'sprints', `${sprintId}-plan.md`),
    path.join('references', 'data', 'sprints', `${sprintId}.plan.json`),
    path.join('reports', 'sprints', `${sprintId}-baseline.md`),
    path.join('reports', 'sprints', `${sprintId}-result.md`),
    path.join('reports', 'sprints', `${sprintId}-lead-review-assignment.md`),
    path.join('reports', 'sprints', `${sprintId}-lead-review-round1.md`),
    path.join('reports', 'sprints', `${sprintId}-lead-review-corrections.md`),
    path.join('reports', 'sprints', `${sprintId}-lead-review-round2.md`),
    path.join('references', 'data', 'sprints', `${sprintId}.result.json`),
  ].forEach(exists);
}

const packetMd = read(PACKET_MD);
const packet = readJson(PACKET_JSON);
const liveMd = read(LIVE_MD);
const live = readJson(LIVE_JSON);
const manifest = read(MANIFEST_MD);
const lab = read(LAB);
const data = readJson(DATA);
const proof = readJson(PROOF);

assert(packet.gate_id === GATE_ID, 'packet gate_id mismatch');
assert(packet.human_review_mode === 'direct_packet_comments', 'packet must use direct packet comments');
assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
assert(packet.reviewed_remote_commit === null, 'reviewed_remote_commit must stay null before closure');
assertAllFalse(packet.authority_boundary, 'packet authority_boundary');
assert(live.gate_id === GATE_ID, 'live evidence gate_id mismatch');
assertAllFalse(live.product_boundaries, 'live product_boundaries');

[
  '## Review Scope',
  '## Evidence Base',
  '## Revision Evidence',
  '## Minimum Evidence Inspection',
  '## Full Planned Review Comment Prompts',
  '## Direct Review Comment Protocol',
  '## Current Stop Conditions',
].forEach((heading) => assert(packetMd.includes(heading), `packet missing ${heading}`));

assert(packetMd.includes(toPosix(LAB)), 'packet missing playable lab path');
assert(packetMd.includes(toPosix(DATA)), 'packet missing playable data path');
assert(packetMd.includes(toPosix(PROOF)), 'packet missing playable proof path');
assert(packet.evidence_base.includes(toPosix(LAB)), 'packet JSON missing playable lab');
assert(packet.evidence_base.includes(toPosix(DATA)), 'packet JSON missing playable data');
assert(packet.evidence_base.includes(toPosix(PROOF)), 'packet JSON missing playable proof');
assert(/manually try at least one case/i.test(packetMd), 'packet must require manual case testing');
assert(/127\.0\.0\.1/.test(packetMd), 'packet must include localhost/static-server fallback');

REQUIRED_SCREENSHOTS.forEach((file) => {
  exists(file);
  assert(fs.statSync(resolve(file)).size > 20000, `screenshot looks too small: ${file}`);
  assert(packetMd.includes(toPosix(file)), `packet missing screenshot path ${file}`);
  assert(manifest.includes(path.basename(file)), `manifest missing screenshot ${file}`);
});

assert(lab.includes('window.gateReasonStd1'), 'lab must expose gate API');
assert(lab.includes('data-case-context'), 'lab must render case context boxes');
assert(lab.includes('vervangt de reasoning game niet'), 'lab must deny reasoning-game replacement');
assert(lab.includes('Water kan in Nederland niet schaars zijn'), 'lab must show water-scarcity wrong answer context');
assert(lab.includes('Redeneerketen ordenen'), 'lab must use softened mode 3 label');
assert(!lab.includes('1.1.3 mode 3 - Stroomdiagram bouwen bridge'), 'lab must not use old mode 3 overclaim label');

assert(Array.isArray(data.cases) && data.cases.length === 4, 'data must include four cases');
assert(data.revisionFocus && data.revisionFocus.adoption_replacement_status === 'revise_required', 'data must record replacement revision status');
assert(data.revisionFocus.local_practice_evidence_status === 'accepted_with_flags', 'data must preserve local-evidence status');
assert(data.boundaries.reasoning_game_replacement_authorized === false, 'data must deny replacement authority');
const waterCase = data.cases.find((entry) => entry.id === 'play-p111-mode0-order');
assert(waterCase && /Water kan in Nederland niet schaars zijn/.test(waterCase.context || ''), 'water case must include visible wrong-answer context');
assert(/leerlinguitspraak/.test(waterCase.task.prompt), 'water task prompt must mention the student statement');
const mode3Case = data.cases.find((entry) => entry.id === 'play-p113-mode3-flow-bridge');
assert(mode3Case && /Redeneerketen ordenen/.test(mode3Case.title), 'mode 3 case title must use softened label');
assert(mode3Case.task.skillLabel === 'Redeneerketen ordenen', 'mode 3 task skill label must be softened');
assert(mode3Case.task.interaction.sequenceLabel === 'Jouw redeneerketen', 'mode 3 sequence label must be softened');
assert(!/Jouw stroomdiagram|Stroomdiagram bouwen/.test(JSON.stringify(data)), 'data must not retain visual-flow overclaim labels');
assert(/geen visueel stroomdiagram|geen visuele flow-builder|tekent hier nog geen visueel/.test(JSON.stringify(mode3Case)), 'mode 3 case must preserve visual-flow boundary');

assert(proof.status === 'passed', 'playable proof must pass');
assert(proof.revision_facts && proof.revision_facts.waterContextVisible === true, 'proof must prove water context visible');
assert(proof.revision_facts.mode3SoftLabelVisible === true, 'proof must prove mode 3 soft label visible');
assert(proof.revision_facts.visualFlowOverclaimAbsent === true, 'proof must prove visual-flow overclaim absent');
assert(proof.revision_facts.replacementDeniedVisible === true, 'proof must prove replacement denial visible');
assert(proof.summary.desktop_completed_count === 4 && proof.summary.mobile_dark_completed_count === 4, 'proof must reach 4/4 in desktop and mobile/dark');
assert(proof.summary.context_repair_proved === true, 'proof summary must record context repair');
assert(proof.summary.mode3_label_repair_proved === true, 'proof summary must record mode 3 label repair');
assert(proof.summary.replacement_authority_denied === true, 'proof summary must deny replacement authority');

REQUIRED_SPRINTS.forEach(validateSprintArtifacts);
REQUIRED_GATE_LEAD_REVIEW.forEach(exists);

const disposition = read('reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md');
assert(!/closure blocked until real\s+planning\/lead-review artifacts are available/i.test(disposition), 'mode disposition stale blocker text must be removed');
assert(/Status: current after REASON-ANSWERFORM-2 closure/i.test(disposition), 'mode disposition must state current status');

[
  'target-equivalent reasoning proof',
  'product-route adoption',
  'diagnostics',
  'mastery',
  'sequencing',
  'Scale Gate 1',
  'student/product use',
].forEach((phrase) => assert(new RegExp(phrase, 'i').test(packetMd), `packet missing boundary phrase ${phrase}`));

console.log('GATE-REASON-REVISION-1 review packet check passed.');
