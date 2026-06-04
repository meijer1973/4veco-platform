#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const TaskShellEngine = require('../../engines/task-shell-engine');
const TaskShellUI = require('../../engines/task-shell-ui');
const fixture = require('./task-context-runtime1-fixture');

const sprintId = 'TASK-CONTEXT-RUNTIME-1';
const proofPath = path.join('reports', 'json', 'task-context-runtime1-proof.json');
const labPath = path.join('reports', 'sprints', `${sprintId}-rendered-lab.html`);
const manifestPath = path.join('reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const screenshotDir = path.join('reports', 'sprints', `${sprintId}-screenshots`);
const specContractPath = path.join('reports', 'json', 'task-context-spec1-contract.json');

const requiredBlockTypes = [
  'markdown',
  'source_excerpt',
  'table',
  'svg_figure',
  'graph',
  'flowchart',
  'formula',
  'info_box',
];

const expectedScreenshots = [
  'desktop-light-initial.png',
  'desktop-light-feedback.png',
  'mobile-light-initial.png',
  'mobile-dark-initial.png',
];

function fail(message) {
  console.error(`Task context runtime check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function stripTags(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    fail(`not a PNG file: ${file}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function expectThrows(label, buildFixture, expectedText) {
  try {
    TaskShellEngine.validateTaskSet(buildFixture());
  } catch (error) {
    if (String(error.message).includes(expectedText)) return;
    fail(`${label} threw wrong error. Expected "${expectedText}", got "${error.message}"`);
  }
  fail(`${label} did not throw`);
}

function runGitStatus(args, label) {
  const result = spawnSync('git', args, { cwd: process.cwd(), encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`${label} git status failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function checkRuntimeContract() {
  const contract = readJson(specContractPath);
  assert(contract.sprint_id === 'TASK-CONTEXT-SPEC-1', 'spec contract must come from TASK-CONTEXT-SPEC-1');
  assert(JSON.stringify(contract.allowedBlockTypes) === JSON.stringify(requiredBlockTypes), 'runtime must keep TASK-CONTEXT-SPEC-1 block type set');
  assert(JSON.stringify(fixture.sourceAuthority) === JSON.stringify(contract.sourceAuthority), 'runtime fixture sourceAuthority must match the prior contract');

  const data = fixture.taskSet();
  assert(TaskShellEngine.validateTaskSet(data) === true, 'runtime fixture must validate');
  assert(Object.keys(TaskShellEngine.CONTEXT_BLOCK_TYPES).sort().join('|') === requiredBlockTypes.slice().sort().join('|'), 'engine must expose supported context block types');
  requiredBlockTypes.forEach((type) => {
    assert(data.contextBlocks.some((block) => block.type === type), `fixture missing block type ${type}`);
  });

  const html = TaskShellUI.renderStaticHtml(data);
  assert(html.indexOf('data-task-context') !== -1, 'rendered html must include context region');
  assert(html.indexOf('data-task-context') < html.indexOf('class="ts-task-list"'), 'context region must appear before task list');
  requiredBlockTypes.forEach((type) => {
    assert(html.includes(`data-context-type="${type}"`), `rendered html missing context type ${type}`);
  });
  data.contextBlocks.forEach((block) => {
    assert(html.includes(`data-context-block="${block.id}"`), `rendered html missing stable block id attribute ${block.id}`);
    const label = block.caption || block.title || block.sourceLabel;
    assert(html.includes(TaskShellUI.escapeHtml(label)), `rendered html missing label/caption for ${block.id}`);
    if (block.altText) assert(html.includes(TaskShellUI.escapeHtml(block.altText)), `rendered html missing alt text for ${block.id}`);
    if (block.accessibilitySummary) {
      assert(html.includes(TaskShellUI.escapeHtml(block.accessibilitySummary)), `rendered html missing accessibility summary for ${block.id}`);
    }
  });
  data.tasks[0].contextRefs.forEach((ref) => {
    assert(html.includes(`data-context-ref="${ref}"`), `task reference missing stable ref ${ref}`);
  });
  assert(html.includes('Gebruik:'), 'task reference label must be student-facing');
  assert(!/\bctx-[a-z0-9-]+\b/.test(stripTags(html)), 'visible text must not expose raw context ids');
  assert(!/<script>alert/i.test(TaskShellUI.renderContextBlocks([
    {
      id: 'ctx-escape-proof',
      type: 'markdown',
      title: 'Escape proof',
      bodyMarkdown: '<script>alert("x")</script>',
      accessibilitySummary: 'Veilige tekst.',
    },
  ])), 'markdown context rendering must escape script-like text');

  const result = TaskShellEngine.evaluateTask(data.tasks[0], {
    selections: [
      { valueId: 'premium-standard', role: 'standard-premium' },
      { valueId: 'premium-raised', role: 'raised-premium' },
    ],
  });
  assert(result.matched === true && result.state === 'matched', 'runtime fixture must be deterministically completable');
}

function checkNegativeFixtures() {
  const negatives = fixture.negativeFixtures();
  expectThrows('missing_alt_text', negatives.missing_alt_text, 'altText');
  expectThrows('missing_context_refs', negatives.missing_context_refs, 'contextRefs is required');
  expectThrows('unknown_context_ref', negatives.unknown_context_ref, 'unknown block');
  expectThrows('unreferenced_source_block', negatives.unreferenced_source_block, 'not referenced');
  expectThrows('answer_hint_leakage', negatives.answer_hint_leakage, 'answer hints');
  expectThrows('raw_copied_image', negatives.raw_copied_image, 'rawCopiedImage must be false');
  expectThrows('inconsistent_caption', negatives.inconsistent_caption, 'caption must start');
  expectThrows('internal_code_exposure', negatives.internal_code_exposure, 'blocked terms or internal codes');
  expectThrows('unsafe_svg', negatives.unsafe_svg, 'script tags');
  expectThrows('exit_ticket_hints', negatives.exit_ticket_hints, 'exit_ticket tasks must not include hints');
}

function checkProofArtifacts() {
  assert(fs.existsSync(labPath), `missing rendered lab: ${labPath}`);
  const lab = fs.readFileSync(labPath, 'utf8');
  assert(lab.includes('../../engines/task-shell-engine.js'), 'lab must load shared task-shell engine');
  assert(lab.includes('../../engines/task-shell-ui.js'), 'lab must load shared task-shell UI');
  assert(lab.includes('TaskShellUI.renderStaticHtml'), 'lab must render through shared UI runtime');
  assert(lab.includes('TaskContextRuntime1Lab'), 'lab must expose deterministic proof helper');

  assert(fs.existsSync(manifestPath), `missing screenshot manifest: ${manifestPath}`);
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  expectedScreenshots.forEach((file) => {
    const screenshot = path.join(screenshotDir, file);
    assert(fs.existsSync(screenshot), `missing screenshot: ${screenshot}`);
    assert(fs.statSync(screenshot).size > 5000, `screenshot too small or blank: ${screenshot}`);
    assert(manifest.includes(`${sprintId}-screenshots/${file}`), `manifest missing screenshot ${file}`);
  });

  const proof = readJson(proofPath);
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === sprintId, 'proof has wrong sprint id');
  assert(proof.lab === labPath.replace(/\\/g, '/'), 'proof must point to rendered lab');
  assert(proof.screenshot_manifest === manifestPath.replace(/\\/g, '/'), 'proof must point to screenshot manifest');
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === expectedScreenshots.length, 'proof must list all screenshots');
  assert(proof.context_runtime.context_before_tasks === true, 'proof must show context before tasks in every capture');
  assert(proof.context_runtime.context_block_count === requiredBlockTypes.length, 'proof must show all context block types');
  assert(proof.context_runtime.task_ref_count >= requiredBlockTypes.length, 'proof must show task references');
  assert(proof.context_runtime.visible_internal_context_ids === false, 'proof must show no visible internal context ids');
  assert(proof.context_runtime.feedback_completion_captured === true, 'proof must include completed feedback state');
  assert(proof.context_runtime.hint_count === 0, 'proof must show no rendered hints in the lab');
  proof.screenshots.forEach((item) => {
    const screenshotPath = item.file.replace(/\//g, path.sep);
    const dimensions = pngDimensions(screenshotPath);
    assert(item.screenshot_dimensions, `${item.case} must record screenshot dimensions`);
    assert(item.screenshot_dimensions.width === dimensions.width, `${item.case} recorded width must match PNG width`);
    assert(item.screenshot_dimensions.height === dimensions.height, `${item.case} recorded height must match PNG height`);
    assert(item.proof.viewport.width === item.viewport.width, `${item.case} browser viewport width must match requested width`);
    assert(item.proof.viewport.height === item.viewport.height, `${item.case} browser viewport height must match requested height`);
    assert(dimensions.width === item.viewport.width, `${item.case} PNG width must match requested viewport width`);
    if (item.viewport.width < 500) {
      assert(item.proof.viewport.width <= 420, `${item.case} must use a responsive mobile-width viewport`);
      assert(dimensions.width <= 420, `${item.case} PNG width must stay mobile-sized`);
    }
    assert(item.proof.contextBeforeTasks === true, `${item.case} must prove context before tasks`);
    assert(item.proof.visibleInternalContextId === false, `${item.case} must not expose visible context ids`);
    assert(item.proof.roleImgCount >= 4, `${item.case} must expose visual/formula accessibility labels`);
    assert(item.proof.tableCount >= 1, `${item.case} must render a table context block`);
  });
  assert(Array.isArray(proof.context_runtime.responsive_mobile_viewports), 'proof must record responsive mobile viewport evidence');
  assert(proof.context_runtime.responsive_mobile_viewports.length === 2, 'proof must include two mobile viewport captures');
  assert(proof.fixture_metadata_note && /did not ingest sources or reconstruct/i.test(proof.fixture_metadata_note), 'proof must explain inherited reconstruction metadata boundary');
  const boundaryEvidence = proof.boundary_evidence || {};
  assert(boundaryEvidence.protected_reference_status === '', 'proof boundary evidence must show protected references clean');
  assert(boundaryEvidence.source_data_status === '', 'proof boundary evidence must show source-data clean');
  assert(boundaryEvidence.book1_generated_output_status === '', 'proof boundary evidence must show Book 1 output clean');
  const boundaries = proof.product_boundaries || {};
  Object.entries(boundaries).forEach(([key, value]) => {
    assert(value === false, `product boundary ${key} must be false`);
  });
}

function checkBoundaryStatus() {
  const protectedStatus = runGitStatus(['status', '--short', '--', 'references/machine', 'references/external'], 'protected reference');
  assert(!protectedStatus, `protected references changed unexpectedly: ${protectedStatus}`);
  const sourceDataStatus = runGitStatus(['status', '--short', '--', 'source-data'], 'source-data');
  assert(!sourceDataStatus, `source-data changed unexpectedly: ${sourceDataStatus}`);
  const lessonBookStatus = runGitStatus(
    [
      '-c',
      'safe.directory=C:/Projects/4veco/4veco-lessen',
      '-C',
      '../4veco-lessen',
      'status',
      '--short',
      '--',
      'Boek 1 - Grondslagen, vraag en aanbod',
    ],
    'Book 1 generated output'
  );
  assert(!lessonBookStatus, `generated Book 1 output changed unexpectedly: ${lessonBookStatus}`);
}

checkRuntimeContract();
checkNegativeFixtures();
checkProofArtifacts();
checkBoundaryStatus();

console.log('OK task context runtime: shared-shell context rendering, proof lab, screenshots, and boundaries pass');
