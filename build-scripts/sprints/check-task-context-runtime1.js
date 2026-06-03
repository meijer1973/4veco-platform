#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine.js'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui.js'));

function fail(message) {
  console.error(`TASK-CONTEXT-RUNTIME-1 check failed: ${message}`);
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

function assertThrows(fn, pattern, label) {
  try {
    fn();
  } catch (error) {
    if (pattern.test(error.message)) return;
    fail(`${label} threw wrong error: ${error.message}`);
  }
  fail(`${label} did not throw`);
}

function validateTaskSet(file) {
  const taskSet = readJson(file);
  assert(TaskShellEngine.validateTaskSet(taskSet) === true, `${file} must validate`);
  const html = TaskShellUI.renderStaticHtml(taskSet);
  assert(html.includes('class="ts-context"'), `${file} rendered HTML missing context section`);
  assert(html.includes('data-context-block-id='), `${file} rendered HTML missing context block markers`);
  assert(html.includes('class="ts-context-ref"'), `${file} rendered HTML missing task context refs`);
  assert(html.indexOf('class="ts-context"') < html.indexOf('class="ts-task-list"'), `${file} context must render before task list`);
  assert(!/>bron-ebikes</.test(html), `${file} leaks internal context id`);
  assert(!/>figuur-ijs-vraag</.test(html), `${file} leaks internal context id`);
  return taskSet;
}

function main() {
  [
    'engines/task-shell-engine.js',
    'engines/task-shell-ui.js',
    'engines/task-shell.css',
    'engines/tests/task-shell-engine.test.js',
    'engines/tests/task-shell-ui.test.js',
    'reports/json/task-context-spec1-contract.json',
    'reports/json/task-context-spec1-valid-fixture.json',
    'reports/json/source-reconstruct1-exam-context.blocks.json',
    'reports/json/source-reconstruct1-textbook-context.blocks.json',
    'reports/json/task-ingest-transform1-exam-task-set.json',
    'reports/json/task-ingest-transform1-textbook-task-set.json',
    'reports/json/task-ingest-transform1-operation-trace.json',
    'reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md',
    'reports/sprints/CONTEXT-VISUAL-STD-1-standard.md',
    'reports/sprints/SOURCE-RECONSTRUCT-1-reconstruction-map.md',
    'reports/sprints/TASK-INGEST-TRANSFORM-1-transformation-map.md',
  ].forEach(exists);

  assert(TaskShellEngine.CONTEXT_BLOCK_TYPES.markdown === true, 'engine must export context block types');
  assert(TaskShellEngine.CONTEXT_BLOCK_TYPES.graph === true, 'engine must support graph context blocks');

  const engine = read('engines/task-shell-engine.js');
  const ui = read('engines/task-shell-ui.js');
  const css = read('engines/task-shell.css');
  assert(engine.includes('validateContextBlocks'), 'engine missing validateContextBlocks');
  assert(engine.includes('validateContextRefs'), 'engine missing validateContextRefs');
  assert(ui.includes('renderContextBlocks'), 'UI missing renderContextBlocks');
  assert(ui.includes('ts-context-ref'), 'UI missing task context refs');
  assert(css.includes('.ts-context-block'), 'CSS missing context block style');
  assert(css.includes('.ts-context-table'), 'CSS missing context table style');
  assert(css.includes('.ts-context-svg'), 'CSS missing context SVG style');

  const exam = validateTaskSet('reports/json/task-ingest-transform1-exam-task-set.json');
  const textbook = validateTaskSet('reports/json/task-ingest-transform1-textbook-task-set.json');
  assert(exam.contextBlocks.length >= 4, 'exam task set must include at least four context blocks');
  assert(textbook.contextBlocks.length >= 4, 'textbook task set must include at least four context blocks');
  assert(exam.tasks.length >= 4, 'exam task set must include at least four tasks');
  assert(textbook.tasks.length >= 4, 'textbook task set must include at least four tasks');

  const badMissingRef = JSON.parse(JSON.stringify(exam));
  delete badMissingRef.tasks[0].contextRefs;
  assertThrows(() => TaskShellEngine.validateTaskSet(badMissingRef), /contextRefs/, 'missing task context refs');

  const badUnreferenced = JSON.parse(JSON.stringify(exam));
  badUnreferenced.contextBlocks.push({
    id: 'bron-los',
    type: 'info',
    label: 'Bron 9',
    sourceRef: 'Reconstructed local source, 2026',
    body: 'Deze bron wordt niet gebruikt.',
  });
  assertThrows(() => TaskShellEngine.validateTaskSet(badUnreferenced), /not referenced/, 'unreferenced context block');

  const badAlt = JSON.parse(JSON.stringify(textbook));
  delete badAlt.contextBlocks.find((block) => block.type === 'graph').altText;
  assertThrows(() => TaskShellEngine.validateTaskSet(badAlt), /altText/, 'missing visual alt text');

  const badImage = JSON.parse(JSON.stringify(exam));
  badImage.contextBlocks[0].body = '![kopie](source.png)';
  assertThrows(() => TaskShellEngine.validateTaskSet(badImage), /raw images/, 'raw markdown image');

  const badSvg = JSON.parse(JSON.stringify(textbook));
  const graph = badSvg.contextBlocks.find((block) => block.type === 'graph');
  graph.svg = '<svg viewBox="0 0 10 10"><image href="copy.png" /></svg>';
  assertThrows(() => TaskShellEngine.validateTaskSet(badSvg), /copied bitmap/, 'bitmap SVG dependency');

  const trace = readJson('reports/json/task-ingest-transform1-operation-trace.json');
  assert(trace.exam_case.cognitive_level_preserved === true, 'exam trace must preserve cognitive level');
  assert(trace.textbook_case.cognitive_level_preserved === true, 'textbook trace must preserve cognitive level');
  assert(trace.exam_case.transformed_chain.includes('calculation_work_capture'), 'exam trace must include calculation work');
  assert(trace.textbook_case.transformed_chain.includes('graph_reading'), 'textbook trace must include graph reading');

  console.log('OK TASK-CONTEXT-RUNTIME-1 context/runtime/ingestion evidence');
}

main();
