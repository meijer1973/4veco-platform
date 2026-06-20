#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ReasoningComposer = require('../../engines/reasoning-composer');
const { allCompositions, blindTransfer } = require('../exemplars/reasoning-golden-family-data');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.join(ROOT, '..', '4veco-lessen');
const GOAL = 'GOAL-REASONING-GOLDEN-FAMILY-1';
const GATE = 'GATE-REASONING-GOLDEN-FAMILY-1';
const REQUIRED_STATES = [
  'initial',
  'partial',
  'wrong_retry',
  'correct',
  'answer_preview',
  'next_action',
  'mobile_dark_correct',
  'keyboard_focus'
];
const RESTRICTED_AUTHORITY_FLAGS = [
  'student_product_adoption',
  'target_equivalent_proof',
  'diagnostics',
  'mastery_or_sequencing',
  'summative_use',
  'scale_gate'
];

function fail(message) {
  console.error(`Reasoning golden family gate check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(rel) {
  const file = path.join(ROOT, rel);
  assert(fs.existsSync(file), `missing required file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function readLesson(rel) {
  const file = path.join(LESSON_ROOT, rel);
  assert(fs.existsSync(file), `missing required lesson file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    fail(`${rel} is not valid JSON: ${error.message}`);
  }
}

function assertAuthority(authority, label) {
  assert(authority && typeof authority === 'object', `${label} authority is required`);
  assert(authority.golden_reference === true, `${label} authority.golden_reference must be true`);
  RESTRICTED_AUTHORITY_FLAGS.forEach((flag) => {
    assert(authority[flag] === false, `${label} authority.${flag} must remain false`);
  });
}

function assertContains(text, pattern, label) {
  assert(pattern.test(text), `${label} missing required pattern ${pattern}`);
}

function validateReviews() {
  const files = [
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-plan.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-baseline.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-planning-review.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-specialist-review.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-lead-review-round1.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-lead-review-corrections.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-lead-review-round2.md',
    'reports/sprints/REASONING-GOLDEN-FAMILY-1-result.md',
    `reports/review-gates/${GATE}/human-review-packet.md`
  ];
  files.forEach(read);

  assertContains(read('reports/sprints/REASONING-GOLDEN-FAMILY-1-specialist-review.md'), /REVISE/, 'specialist review');
  assertContains(read('reports/sprints/REASONING-GOLDEN-FAMILY-1-lead-review-round1.md'), /REVISE/, 'lead review round 1');
  assertContains(read('reports/sprints/REASONING-GOLDEN-FAMILY-1-lead-review-round2.md'), /PASS WITH FLAGS|PASS/, 'lead review round 2');
  const gatePacket = read(`reports/review-gates/${GATE}/human-review-packet.md`);
  assertContains(gatePacket, new RegExp(GATE), 'human gate packet');
  assertContains(gatePacket, /Human decision required|Awaiting human decision/i, 'human gate packet');
  assertContains(gatePacket, /copy product grammar/i, 'human gate packet');
  assertContains(gatePacket, /re-derive reasoning grammar/i, 'human gate packet');
  assertContains(gatePacket, /student product adoption.*false/i, 'human gate packet');
}

function validateScriptsAndCi() {
  const pkg = readJson('package.json');
  [
    'check:reasoning-golden:exemplars',
    'check:reasoning-golden:skill',
    'check:reasoning-golden:gallery',
    'check:reasoning-golden:gate',
    'check:reasoning-golden',
    'capture:reasoning-golden'
  ].forEach((script) => assert(pkg.scripts && pkg.scripts[script], `package.json missing ${script}`));
  const ci = read('.github/workflows/platform-ci.yml');
  assert(ci.includes('npm run check:reasoning-golden'), 'platform CI must run reasoning golden guardrails');
}

function validateCompositions() {
  allCompositions.forEach((composition) => {
    assert(ReasoningComposer.validateComposition(composition), `${composition.composition_id} must validate`);
    assertAuthority(composition.authority, composition.composition_id);
  });
  const bad = JSON.parse(JSON.stringify(allCompositions[0]));
  bad.authority.student_product_adoption = true;
  let rejected = false;
  try {
    ReasoningComposer.validateComposition(bad);
  } catch (error) {
    rejected = /student_product_adoption/.test(error.message);
  }
  assert(rejected, 'composer must reject elevated authority flags');
}

function validateProof() {
  const proof = readJson('reports/json/reasoning-golden-family-proof.json');
  assert(proof.goal === GOAL, 'proof goal mismatch');
  assert(proof.rule === 'copy product grammar; re-derive reasoning grammar', 'proof transfer rule mismatch');
  assertAuthority({ golden_reference: true, ...proof.authority }, 'proof');
  assert(Array.isArray(proof.generated_pages) && proof.generated_pages.length === allCompositions.length, 'proof must list all compositions');

  const screenshotManifest = readJson('reports/reasoning-golden-family/screenshots/manifest.json');
  assert(screenshotManifest.goal === GOAL, 'screenshot manifest goal mismatch');
  assert(screenshotManifest.cases.length === allCompositions.length * REQUIRED_STATES.length, 'screenshot manifest state count mismatch');
  allCompositions.forEach((composition) => {
    REQUIRED_STATES.forEach((state) => {
      const item = screenshotManifest.cases.find((candidate) => (
        candidate.composition_id === composition.composition_id && candidate.state === state
      ));
      assert(item, `${composition.composition_id} missing screenshot ${state}`);
      assert(fs.existsSync(path.join(ROOT, item.screenshot)), `${item.name} screenshot file missing`);
      if (state === 'answer_preview') {
        assert(item.proof.answerPreview.some((preview) => preview.complete && preview.visible), `${item.name} must visibly show completed answer preview`);
      }
      if (state === 'next_action') {
        assert(item.proof.nextActions.some((action) => action.visible && action.text), `${item.name} must visibly show next action`);
      }
      if (state === 'keyboard_focus') {
        assert(item.proof.focusProof.activeMatches === true, `${item.name} must prove keyboard focus`);
      }
    });
  });

  const blindEntry = proof.generated_pages.find((entry) => entry.composition_id === blindTransfer.composition_id);
  assert(blindEntry && blindEntry.blind_transfer, 'blind transfer proof missing');
  assert(blindEntry.blind_transfer.unseenParagraph === '1.2.2 Vraagfactoren', 'blind transfer target mismatch');
  assert(
    fs.existsSync(path.join(LESSON_ROOT, blindEntry.blind_transfer.sourceChecked)),
    'blind transfer sourceChecked path must exist in lesson repo'
  );
}

function validateLessonSpecs() {
  const companion = readLesson('specifications/companion-core-specifications.md');
  const endState = readLesson('specifications/product-end-state.md');
  [companion, endState].forEach((text, index) => {
    const label = index === 0 ? 'companion spec' : 'product end-state spec';
    assertContains(text, /GOAL-REASONING-GOLDEN-FAMILY-1/, label);
    assertContains(text, /copy product grammar/i, label);
    assertContains(text, /re-derive reasoning grammar/i, label);
    assertContains(text, /GATE-REASONING-GOLDEN-FAMILY-1/, label);
  });
}

function main() {
  validateReviews();
  validateScriptsAndCi();
  validateCompositions();
  validateProof();
  validateLessonSpecs();
  console.log('Reasoning golden family gate check OK');
}

main();
