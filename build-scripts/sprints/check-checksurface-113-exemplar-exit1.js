#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod'));
const SOURCE_PATH = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3-exit-ticket.json');
const EXEMPLAR_DIR = path.join(ROOT, 'references', 'exemplars', 'product-excellence', 'check-surfaces', '1.1.3-exit-ticket');
const PROOF_PATH = path.join(ROOT, 'reports', 'json', 'checksurface-113-exemplar-exit1-proof.json');
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');

function fail(message) {
  console.error(`CHECKSURFACE-113-EXEMPLAR-EXIT-1 failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function taskShells(data) {
  return (data.tasks || [])
    .filter((task) => task && task.taskShell)
    .map((task) => task.taskShell);
}

function findShell(data, family) {
  const shell = taskShells(data).find((entry) => entry.family === family);
  assert(shell, `missing task family: ${family}`);
  return shell;
}

function collectPlaceholders(value, pathParts, out) {
  if (value == null) return;
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectPlaceholders(item, pathParts.concat(String(idx)), out));
    return;
  }
  if (typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const nextPath = pathParts.concat(key);
    if (/placeholder/i.test(key) && typeof child === 'string') {
      out.push({ path: nextPath.join('.'), value: child });
    }
    collectPlaceholders(child, nextPath, out);
  }
}

function assertNoAnswerGivingPlaceholders(data) {
  const placeholders = [];
  collectPlaceholders(data, [], placeholders);
  const forbidden = [
    { token: '225', label: 'graph read-off answer' },
    { token: '-50', label: 'percentage answer' },
    { token: '150', label: 'new quantity answer' },
    { token: '300', label: 'old quantity answer' },
  ];
  for (const placeholder of placeholders) {
    for (const item of forbidden) {
      assert(!placeholder.value.includes(item.token), `answer-giving placeholder for ${item.label}: ${placeholder.path}`);
    }
  }
  return placeholders;
}

function findParagraphDir() {
  assert(fs.existsSync(CHAPTER_ROOT), `missing chapter root: ${CHAPTER_ROOT}`);
  const entry = fs.readdirSync(CHAPTER_ROOT, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith('1.1.3 '));
  assert(entry, 'missing generated 1.1.3 paragraph directory');
  return path.join(CHAPTER_ROOT, entry.name);
}

function findGeneratedExitPage() {
  const dir = findParagraphDir();
  const entry = fs.readdirSync(dir, { withFileTypes: true })
    .find((item) => item.isFile() && /exit-ticket\.html$/i.test(item.name));
  assert(entry, 'missing generated 1.1.3 exit-ticket HTML page');
  return path.join(dir, entry.name);
}

function requireExemplarFiles() {
  const required = [
    'README.md',
    'candidate-data.json',
    'implementation-handoff.md',
    'package-readme.md',
    'policy-extract.md',
    'prototype.html',
    'quality-brief.md',
    path.join('reviews', 'teacher-learning-quality-review.md'),
    path.join('reviews', 'student-experience-review.md'),
    path.join('reviews', 'visual-interaction-review.md'),
    path.join('reviews', 'testing-regression-review.md'),
    path.join('reviews', 'lead-synthesis.md'),
  ];
  for (const relPath of required) {
    assert(fs.existsSync(path.join(EXEMPLAR_DIR, relPath)), `missing exemplar file: ${relPath}`);
  }
  const lead = read(path.join(EXEMPLAR_DIR, 'reviews', 'lead-synthesis.md'));
  const pending = /PENDING_REVIEW/.test(lead) && /hold_for_exemplar_review/.test(lead);
  const reviewed = /Status:\s*`COMPLETE`/.test(lead) && /Verdict:\s*PASS WITH FLAGS/.test(lead) && /reviewed_with_flags/.test(lead);
  assert(pending || reviewed, 'lead synthesis must be pending hold or reviewed with flags');
  if (reviewed) {
    assert(/target-readiness evidence/i.test(lead), 'reviewed lead synthesis must preserve target-readiness boundary');
    assert(/completion language/i.test(lead), 'reviewed lead synthesis must preserve completion-language boundary');
  }
  return {
    required,
    review_state: reviewed ? 'COMPLETE_PASS_WITH_FLAGS' : 'PENDING_REVIEW',
    next_state: reviewed ? 'reviewed_with_flags' : 'hold_for_exemplar_review',
  };
}

function checkSource() {
  const data = readJson(SOURCE_PATH);
  assert(ExitTicketEngine.validateData(data), '1.1.3 exit-ticket source must validate');
  assert(data.surface === 'target_equivalent_exit_ticket', 'surface must be target_equivalent_exit_ticket');
  assert(data.targetEquivalent && data.targetEquivalent.gateApproved === false, 'targetEquivalent gateApproved must remain false');
  assert(data.targetEquivalent.completionLanguageEligible === false, 'completion language must remain held');
  assert(data.metadataAlignment && data.metadataAlignment.targetReadinessEvidence === false, 'target readiness evidence must remain false');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length === 2, 'context must contain exactly source and table');
  assert(data.contextBlocks.some((block) => block.type === 'source_excerpt'), 'context must include source excerpt');
  assert(data.contextBlocks.some((block) => block.type === 'table'), 'context must include table');
  assert(!data.contextBlocks.some((block) => block.type === 'formula'), 'context must not include static formula block');

  const placeholders = assertNoAnswerGivingPlaceholders(data);
  const graph = findShell(data, 'graph_construction_substitute');
  assert(graph.interaction.hideAxisLabelsUntilAxisSelection === true, 'graph task must hide axis labels until selection');
  assert(graph.interaction.pointCount === 2, 'graph task must require two points');
  assert(graph.interaction.pointSnapMode === 'magnetic_table_point', 'graph task must use magnetic snapping');
  assert(graph.interaction.pointSnapTolerancePx >= 35, 'graph snap tolerance must be forgiving');
  assert(Array.isArray(graph.interaction.axisOptions) && graph.interaction.axisOptions.length >= 4, 'graph axis options must include plausible distractors');
  assert(graph.expected.pointPolicy === 'straight_line_two_distinct_table_points', 'graph task must use straight-line two-point policy');
  assert(Array.isArray(graph.expected.acceptedTablePoints) && graph.expected.acceptedTablePoints.length >= 5, 'graph task must accept all table points');

  const reading = findShell(data, 'graph_reading');
  assert(Array.isArray(reading.interaction.stepOrder), 'graph reading must define stepOrder');
  assert(reading.interaction.stepOrder.join('|') === 'interval_selection|read_q_value', 'graph reading order must be interval then read-off');
  assert(reading.interaction.intervalOptions.some((option) => option.correct === true), 'graph reading must include a correct interval');
  assert(reading.interaction.intervalOptions.some((option) => option.correct === false), 'graph reading must include interval distractors');
  assert(reading.expected.interval && reading.expected.interval.value === '200-250', 'graph reading expected interval must be 200-250');

  const formula = findShell(data, 'formula_builder');
  assert(formula.interaction.tokens.some((token) => token.kind === 'answer'), 'formula builder must include answer tokens');
  assert(formula.interaction.tokens.some((token) => token.kind === 'distractor'), 'formula builder must include distractor tokens');

  const calculation = findShell(data, 'calculation_work_capture');
  assert(!calculation.interaction.selectionMode, 'calculation must not use interval-halving dropdown substitute');
  assert(calculation.expected.finalAnswer.kind === 'number', 'calculation final answer must be numeric');
  assert(calculation.expected.finalAnswer.acceptedNotations.includes('-50%'), 'calculation must accept -50%');
  assert(calculation.expected.finalAnswer.acceptedNotations.includes('50% daling'), 'calculation must accept 50% daling');

  return {
    task_families: taskShells(data).map((shell) => shell.family),
    context_blocks: data.contextBlocks.map((block) => `${block.id}:${block.type}`),
    placeholder_count: placeholders.length,
  };
}

function checkGeneratedOutput() {
  const sharedPath = path.join(BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3-exit-ticket.js');
  const shared = read(sharedPath);
  const pagePath = findGeneratedExitPage();
  const page = read(pagePath);
  assert(shared.includes('graph_construction_substitute'), 'generated shared data missing graph construction task');
  assert(shared.includes('graph_reading'), 'generated shared data missing graph reading task');
  assert(shared.includes('formula_builder'), 'generated shared data missing formula builder task');
  assert(shared.includes('calculation_work_capture'), 'generated shared data missing calculation task');
  assert(shared.includes('magnetic_table_point'), 'generated shared data missing magnetic snapping metadata');
  assert(!shared.includes('ctx-stationbroodjes-formula'), 'generated shared data must not include formula context');
  assert(page.includes('shared/exit-ticket/1.1.3-exit-ticket.js'), 'generated page must load 1.1.3 exit-ticket data');
  return {
    shared_data: path.relative(ROOT, sharedPath).replace(/\\/g, '/'),
    exit_page: path.relative(ROOT, pagePath).replace(/\\/g, '/'),
  };
}

function main() {
  const source = checkSource();
  const exemplarFiles = requireExemplarFiles();
  const generated = checkGeneratedOutput();
  const proof = {
    schema_version: 1,
    sprint_id: 'CHECKSURFACE-113-EXEMPLAR-EXIT-1',
    generated: new Date().toISOString(),
    status: 'passed',
    source,
    generated_output: generated,
    exemplar: {
      directory: path.relative(ROOT, EXEMPLAR_DIR).replace(/\\/g, '/'),
      required_files: exemplarFiles.required.map((file) => file.replace(/\\/g, '/')),
      review_state: exemplarFiles.review_state,
      next_state: exemplarFiles.next_state,
    },
    authority: {
      target_readiness_evidence_authorized: false,
      completion_language_authorized: false,
      human_review_completed: false,
    },
  };
  fs.mkdirSync(path.dirname(PROOF_PATH), { recursive: true });
  fs.writeFileSync(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`CHECKSURFACE-113-EXEMPLAR-EXIT-1 passed; proof written to ${path.relative(ROOT, PROOF_PATH)}`);
}

main();
