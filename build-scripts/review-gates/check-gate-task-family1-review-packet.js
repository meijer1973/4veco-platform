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
const PLAYABLE_LAB = path.join(GATE_DIR, 'gate-playable-task-family-lab.html');
const PLAYABLE_DATA = path.join(GATE_DIR, 'gate-playable-task-family-data.json');
const PLAYABLE_PROOF = path.join(GATE_DIR, 'playable-proof.json');
const GALLERY_CAPTURE_SCRIPT = path.join('build-scripts', 'review-gates', 'capture-gate-task-family1-gallery-screenshots.js');

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
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-feedback-detail.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-playable-initial.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-playable-retry-feedback.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-playable-next-action-focus.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-playable-completed.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-task-family1-playable-mobile-dark-completed.png')
];

const REQUIRED_USABILITY_ARTIFACTS = [
  path.join('reports', 'sprints', `${SPRINT_ID}-usability-agent-round1.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-usability-agent-corrections.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-usability-agent-round2.md`),
  path.join('reports', 'sprints', `${SPRINT_ID}-usability-agent-analysis.md`)
];

const REQUIRED_HUMAN_PRECHECK_ARTIFACTS = [
  path.join('reports', 'sprints', `${SPRINT_ID}-human-precheck-corrections.md`)
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
  assert(packet.human_interview_started === false, 'legacy interview flag must remain false in packet-prep stage');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assertAllFalse(packet.authority_boundary, 'packet authority_boundary');
  assert(live.gate_id === GATE_ID, 'live evidence gate_id mismatch');
  assert(live.sprint_id === SPRINT_ID, 'live evidence sprint_id mismatch');
  assertAllFalse(live.product_boundaries, 'live evidence product_boundaries');

  [
    '## Review Scope',
    '## Evidence Base',
    '## Planned Review Focus',
    '## Minimum Playable Evidence Inspection',
    '## Calibration Checks',
    '## Full Planned Review Comment Prompts',
    '## Direct Review Comment Protocol',
    '## Current Stop Conditions',
    '## Recommended Next Action'
  ].forEach((heading) => {
    assert(packetMd.includes(heading), `review packet missing ${heading}`);
  });
  assert((packetMd.match(/^### TASKFAM1-Q\d+:/gm) || []).length === 12, 'packet must include 12 planned questions');
  assert((packet.calibration_questions || []).length === 3, 'packet JSON must include 3 calibration questions');
  assert((packet.planned_questions || []).length === 12, 'packet JSON must include 12 planned questions');
  assert(packet.human_review_mode === 'direct_packet_comments', 'packet JSON must use direct packet comments');
  assert(packet.human_review_comments_started === false, 'human review comments must not be started in packet-prep stage');
  assert(packet.direct_review_comment_protocol && packet.direct_review_comment_protocol.default_mode === true, 'direct review comment protocol missing');
  assert(!/Future Interview Protocol/.test(packetMd), 'packet must not use old future interview protocol');
  assert(/directly on this packet/i.test(packetMd), 'packet must instruct direct packet comments');

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

  const playableLab = read(PLAYABLE_LAB);
  const playableData = readJson(PLAYABLE_DATA);
  const playableProof = readJson(PLAYABLE_PROOF);
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_LAB)), 'packet JSON missing playable lab');
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_DATA)), 'packet JSON missing playable data');
  assert(packet.evidence_base.includes(toPosix(PLAYABLE_PROOF)), 'packet JSON missing playable proof');
  assert(packet.evidence_base.includes(toPosix(GALLERY_CAPTURE_SCRIPT)), 'packet JSON missing gallery screenshot capture script');
  assert(playableLab.includes('Ga naar volgende taak'), 'playable lab must expose next-task action');
  assert(playableLab.includes('Review-only routeplaceholder'), 'playable lab must keep review-only route placeholder explicit');
  assert(playableLab.includes('oorzaak, context, gevolg'), 'playable lab must include repaired sentence-builder instruction');
  assert(Array.isArray(playableData.tasks) && playableData.tasks.length === 12, 'playable data must contain 12 tasks');
  const sentence = playableData.tasks.find((task) => task.id === 'sentence-demand');
  assert(sentence, 'playable data missing sentence-demand task');
  assert(
    sentence.expected.acceptedSequences.some((sequence) => sequence.join('|') === 'prijs-stijgt|hogere-prijs|vraag-daalt'),
    'sentence builder must accept natural cause-context-effect order'
  );
  const matching = playableData.tasks.find((task) => task.id === 'matching-concepts');
  assert(matching, 'playable data missing matching-concepts task');
  assert(
    !matching.interaction.leftItems.some((item) => item.id === 'omzet') &&
      !matching.interaction.rightItems.some((item) => item.id === 'prijs-keer-afzet'),
    'matching-concepts distractors must not form a correct economic pair outside the expected set'
  );
  const sourceValues = playableData.tasks.find((task) => task.id === 'source-values-percent');
  assert(sourceValues, 'playable data missing source-values-percent task');
  const sourceValueText = JSON.stringify(sourceValues.interaction);
  assert(!/oude prijs|nieuwe prijs/i.test(sourceValueText), 'source-values-percent must not label source rows as old/new price');
  assert(/fietsenwinkel|e-bike/i.test(sourceValues.prompt), 'source-values-percent must include real context before source selection');
  assert(
    sourceValues.expected.selections.some((item) => item.valueId === 'model-stad-2024' && item.role === 'old') &&
      sourceValues.expected.selections.some((item) => item.valueId === 'model-stad-2025' && item.role === 'new'),
    'source-values-percent must require the student to map same-product source rows to begin/eind roles'
  );
  const sourceChain = playableData.tasks.find((task) => task.id === 'source-chain-percent');
  assert(sourceChain, 'playable data missing source-chain-percent task');
  assert(/Bron 1/i.test(sourceChain.prompt) && /2024/.test(sourceChain.prompt) && /2025/.test(sourceChain.prompt), 'source-chain-percent must introduce the source data in the prompt');
  assert(
    sourceChain.interaction.nodes.some((node) => /2024 EUR 800 en 2025 EUR 920/.test(node.label)),
    'source-chain-percent must show the values instead of requiring number guessing'
  );
  const labelPlacement = playableData.tasks.find((task) => task.id === 'label-placement-graph');
  assert(labelPlacement, 'playable data missing label-placement-graph task');
  const labelTargetText = JSON.stringify(labelPlacement.interaction.targets);
  assert(
    !/prijslabel|hoeveelheidlabel/i.test(labelTargetText),
    'label-placement target labels/descriptions must not give away the answer'
  );
  assert(
    labelPlacement.expected.placements.some((item) => item.labelId === 'prijs' && item.targetId === 'axis-left') &&
      labelPlacement.expected.placements.some((item) => item.labelId === 'hoeveelheid' && item.targetId === 'axis-bottom'),
    'label-placement must use neutral graph target ids after repair'
  );
  assert(
    labelPlacement.interaction.visual && labelPlacement.interaction.visual.showLine === false,
    'label-placement repaired visual must suppress the default graph line'
  );
  assert(
    labelPlacement.interaction.visual && labelPlacement.interaction.visual.showGrid === false,
    'label-placement repaired visual must suppress the center guide grid'
  );
  assert(playableProof.all_playable_tasks_completed === true, 'playable proof must complete all tasks');
  assert(playableProof.required_task_count === 12, 'playable proof required task count must be 12');
  assert(playableProof.completed_task_count === 12, 'playable proof completed task count must be 12');
  const proofCases = new Map((playableProof.cases || []).map((item) => [item.id, item]));
  ['desktop-initial', 'desktop-retry-feedback', 'desktop-next-action-focus', 'desktop-completed', 'mobile-dark-completed'].forEach((id) => {
    assert(proofCases.has(id), `playable proof missing case ${id}`);
  });
  assert(proofCases.get('desktop-completed').result.matched === 12, 'desktop completed proof must match 12 tasks');
  assert(proofCases.get('mobile-dark-completed').result.matched === 12, 'mobile dark proof must match 12 tasks');
  assert(proofCases.get('desktop-next-action-focus').next_action.after.activeTask === 'multi-select-schaarste', 'next-action proof must focus next task');

  REQUIRED_USABILITY_ARTIFACTS.forEach((file) => {
    const artifact = read(file);
    assert(packet.evidence_base.includes(toPosix(file)), `packet JSON missing usability artifact ${file}`);
    assert(/usability|agent|review|REVISE|READY|Ready/i.test(artifact), `${file} must record usability-agent evidence`);
  });
  const round1 = read(path.join('reports', 'sprints', `${SPRINT_ID}-usability-agent-round1.md`));
  const round2 = read(path.join('reports', 'sprints', `${SPRINT_ID}-usability-agent-round2.md`));
  assert(/REVISE/i.test(round1), 'usability round 1 must record REVISE');
  assert(/Ready for sending to direct-comment human review/i.test(round2), 'usability round 2 must approve direct-comment review');
  assert(packet.usability_agent_review && packet.usability_agent_review.round2_status === 'ready_for_direct_comment_review', 'packet JSON usability review must be ready');

  REQUIRED_HUMAN_PRECHECK_ARTIFACTS.forEach((file) => {
    const artifact = read(file);
    assert(packet.evidence_base.includes(toPosix(file)), `packet JSON missing human-precheck artifact ${file}`);
    assert(/Task 3/i.test(artifact) && /Task 10/i.test(artifact) && /Task 11/i.test(artifact) && /Task 12/i.test(artifact), `${file} must record the human-precheck task corrections`);
    assert(/proof presentation policy/i.test(artifact), `${file} must record the proof presentation policy carry-forward`);
  });

  REQUIRED_GALLERIES.forEach((file) => {
    const html = read(file);
    assert(html.includes('target-proof boundary held'), `${file} missing review boundary`);
    assert(html.includes('Open validated fixture'), `${file} missing fixture link`);
    assert(!/oude prijs|nieuwe prijs|Lees de prijstabel|prijslabel|hoeveelheidlabel|Prijs keer afzet|Opbrengst min kosten/i.test(html), `${file} still contains stale answer-giving or invalid-distractor text`);
    if (/label_placement/.test(html)) {
      assert(!html.includes('ts-label-visual-line'), `${file} still renders the old default graph line in label-placement proof`);
      assert(html.includes('ts-label-target-region-clean'), `${file} label-placement proof must suppress the center guide grid`);
    }
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
    'playable lab',
    'usability',
    'target-equivalent',
    'generated lesson output',
    'engine implementation',
    'Scale Gate 1',
    'old exit-ticket archive'
  ].forEach((phrase) => {
    assert(new RegExp(phrase, 'i').test(stop), `stop conditions missing ${phrase}`);
  });

  assert(packet.pre_gate_lead_review.required === true, 'lead review must be required');
  assert(
    ['passed', 'passed_before_direct_review_comments'].includes(packet.pre_gate_lead_review.status),
    'lead review status must be passed before human review comments'
  );
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
  [...REQUIRED_SPRINT_FILES, ...REQUIRED_USABILITY_ARTIFACTS, ...REQUIRED_HUMAN_PRECHECK_ARTIFACTS, PACKET_MD, PACKET_JSON, LIVE_MD, LIVE_JSON, MANIFEST_MD, PLAYABLE_LAB, PLAYABLE_DATA, PLAYABLE_PROOF, GALLERY_CAPTURE_SCRIPT].forEach(exists);
  validatePacket();
} catch (error) {
  fail(error.message);
}
