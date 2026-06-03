#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const TaskShellEngine = require('../../engines/task-shell-engine.js');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'GATE-SHARED-TASK-INGEST-1';
const GATE_ID = 'GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);

const REQUIRED = [
  path.join(GATE_DIR, 'review-packet.md'),
  path.join(GATE_DIR, 'review-packet.json'),
  path.join(GATE_DIR, 'live-output-evidence.md'),
  path.join(GATE_DIR, 'live-output-evidence.json'),
  path.join(GATE_DIR, 'screenshot-manifest.md'),
  path.join(GATE_DIR, 'gate-playable-shared-task-ingest-exam-lab.html'),
  path.join(GATE_DIR, 'gate-playable-shared-task-ingest-textbook-lab.html'),
  path.join(GATE_DIR, 'gate-playable-shared-task-ingest-data.json'),
  path.join(GATE_DIR, 'playable-proof.json'),
  'reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md',
  'reports/sprints/CONTEXT-VISUAL-STD-1-standard.md',
  'reports/sprints/SOURCE-RECONSTRUCT-1-reconstruction-map.md',
  'reports/sprints/TASK-INGEST-TRANSFORM-1-transformation-map.md',
  'reports/json/task-context-spec1-contract.json',
  'reports/json/task-ingest-transform1-operation-trace.json',
  'build-scripts/review-gates/capture-gate-shared-task-ingest1-playable-proof.js',
];

const REQUIRED_SCREENSHOTS = [
  path.join(GATE_DIR, 'screenshots', 'gate-shared-task-ingest1-exam-initial.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-shared-task-ingest1-exam-retry-feedback.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-shared-task-ingest1-exam-completed.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-shared-task-ingest1-textbook-initial.png'),
  path.join(GATE_DIR, 'screenshots', 'gate-shared-task-ingest1-textbook-mobile-dark-completed.png'),
];

function fail(message) {
  console.error(`GATE-SHARED-TASK-INGEST-1 review packet check failed: ${message}`);
  process.exit(1);
}

function resolve(file) {
  return path.join(ROOT, file);
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
    '## Required Next Action',
  ].forEach((heading) => assert(markdown.includes(heading), `${file} missing ${heading}`));
  assert(/Evidence inspected:/i.test(markdown), `${file} must state evidence inspected`);
  assert(/Verdict:\s*(PASS WITH FLAGS|PASS)/i.test(markdown), `${file} must record pass verdict`);
}

function main() {
  REQUIRED.forEach(exists);
  REQUIRED_SCREENSHOTS.forEach((file) => {
    exists(file);
    const size = fs.statSync(resolve(file)).size;
    assert(size > 20000, `screenshot looks blank or too small: ${file}`);
  });

  const packetMd = read(path.join(GATE_DIR, 'review-packet.md'));
  const packet = readJson(path.join(GATE_DIR, 'review-packet.json'));
  const live = readJson(path.join(GATE_DIR, 'live-output-evidence.json'));
  const manifest = read(path.join(GATE_DIR, 'screenshot-manifest.md'));
  const proof = readJson(path.join(GATE_DIR, 'playable-proof.json'));
  const data = readJson(path.join(GATE_DIR, 'gate-playable-shared-task-ingest-data.json'));
  const examLab = read(path.join(GATE_DIR, 'gate-playable-shared-task-ingest-exam-lab.html'));
  const textbookLab = read(path.join(GATE_DIR, 'gate-playable-shared-task-ingest-textbook-lab.html'));

  assert(packet.gate_id === GATE_ID, 'packet gate id mismatch');
  assert(packet.sprint_id === SPRINT_ID, 'packet sprint id mismatch');
  assert(packet.human_review_mode === 'direct_packet_comments', 'packet must use direct packet comments');
  assert(packet.human_review_comments_started === false, 'human comments must not be started');
  assert(packet.reviewed_remote_commit === null, 'reviewed_remote_commit must remain null before closure');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assertAllFalse(packet.authority_boundary, 'packet authority boundary');
  assertAllFalse(live.product_boundaries, 'live product boundaries');

  [
    '## Review Scope',
    '## Evidence Base',
    '## Planned Review Focus',
    '## Minimum Evidence Inspection',
    '## Calibration Checks',
    '## Full Planned Review Comment Prompts',
    '## Direct Review Comment Protocol',
    '## Current Stop Conditions',
    '## Recommended Next Action',
  ].forEach((heading) => assert(packetMd.includes(heading), `review packet missing ${heading}`));
  assert((packetMd.match(/^### SHAREDINGEST1-Q\d+:/gm) || []).length === 10, 'packet must include 10 planned questions');
  assert(!/Future Interview Protocol/.test(packetMd), 'packet must not use old interview protocol');
  assert(/directly on this packet/i.test(packetMd), 'packet must instruct direct packet comments');
  assert(/manually try at least one task/i.test(packetMd), 'packet must require manual human lab test');

  [
    'generated lesson output',
    'source-data mutation',
    'product-route adoption',
    'target-equivalent',
    'diagnostics',
    'mastery',
    'Scale Gate 1',
    'student/product use',
  ].forEach((phrase) => assert(new RegExp(phrase, 'i').test(packetMd), `packet missing boundary phrase ${phrase}`));

  assert(proof.status === 'passed', 'playable proof must pass');
  assert(proof.exam.completed.matched === proof.exam.completed.total, 'exam lab must reach completion');
  assert(proof.textbook.mobileDark.completed.matched === proof.textbook.mobileDark.total, 'textbook mobile/dark lab must reach completion');
  assert(proof.exam.initial.contextBlocks >= 4, 'exam initial proof must count context blocks');
  assert(proof.textbook.initial.contextBlocks >= 4, 'textbook initial proof must count context blocks');
  assert(proof.exam.retry.progressText.includes('0 /'), 'retry proof must remain incomplete before repair');
  assert(proof.facts.context_blocks_before_tasks === true, 'proof must record context-before-task fact');

  REQUIRED_SCREENSHOTS.forEach((file) => {
    assert(packetMd.includes(file.replace(/\\/g, '/')), `packet missing screenshot path: ${file}`);
    assert(manifest.includes(path.basename(file)), `manifest missing screenshot: ${file}`);
  });

  assert(examLab.includes('data-gate-autoplay'), 'exam lab missing autoplay support');
  assert(textbookLab.includes('data-gate-autoplay'), 'textbook lab missing autoplay support');
  assert(examLab.includes('TaskShellUI.renderStaticHtml'), 'exam lab must render through task shell UI');
  assert(textbookLab.includes('TaskShellUI.renderStaticHtml'), 'textbook lab must render through task shell UI');
  assert(examLab.includes('geen productautoriteit'), 'exam lab must label no product authority');
  assert(textbookLab.includes('geen productautoriteit'), 'textbook lab must label no product authority');

  assert(TaskShellEngine.validateTaskSet(data.examTaskSet) === true, 'exam task set must validate through engine');
  assert(TaskShellEngine.validateTaskSet(data.textbookTaskSet) === true, 'textbook task set must validate through engine');
  assert(data.examTaskSet.contextBlocks.some((block) => block.type === 'table'), 'exam must include table context');
  assert(data.examTaskSet.contextBlocks.some((block) => block.type === 'graph'), 'exam must include graph context');
  assert(data.textbookTaskSet.contextBlocks.some((block) => block.type === 'flowchart'), 'textbook must include flowchart context');
  assert(data.examTaskSet.tasks.some((task) => task.family === 'calculation_work_capture'), 'exam must include calculation work task');
  assert(data.textbookTaskSet.tasks.some((task) => task.family === 'graph_reading'), 'textbook must include graph reading task');
  assert(data.textbookTaskSet.tasks.some((task) => task.family === 'label_placement'), 'textbook must include label placement task');

  const sourceSelection = data.examTaskSet.tasks.find((task) => task.id === 'exam-source-values');
  const sourceText = JSON.stringify(sourceSelection.interaction);
  assert(!/oude prijs|nieuwe prijs/i.test(sourceText), 'source selection rows must not give away old/new labels');
  assert(/januari|mei/i.test(sourceText), 'source selection must use source periods/context instead');
  const allContextText = JSON.stringify(data.examTaskSet.contextBlocks.concat(data.textbookTaskSet.contextBlocks));
  assert(!/!\[[^\]]*\]\(|<img\b|<image\b/i.test(allContextText), 'context must not contain copied image shortcuts');

  validateLeadReviewReport(`reports/sprints/${SPRINT_ID}-lead-review-round1.md`, 'lead review round 1');
  validateLeadReviewReport(`reports/sprints/${SPRINT_ID}-lead-review-round2.md`, 'lead review round 2');

  console.log('OK GATE-SHARED-TASK-INGEST-1 review packet');
}

main();
