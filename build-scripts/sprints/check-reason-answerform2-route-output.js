#!/usr/bin/env node
/**
 * Validate REASON-ANSWERFORM-2 generated reasoning answer-form scaffold output.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.argv[2] || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const PARAGRAPHS = [
  { parNr: '1.1.1', dir: '1.1.1 Schaarste en economisch denken' },
  { parNr: '1.1.2', dir: '1.1.2 Percentages en indexcijfers' }
];

const DEPLOYED_REASONING_ENGINE = path.join(bookRoot, 'shared', 'reasoning-engine.js');
const DEPLOYED_REASONING_UI = path.join(bookRoot, 'shared', 'reasoning-ui.js');
const DEPLOYED_REASONING_CSS = path.join(bookRoot, 'shared', 'reasoning.css');
const DEPLOYED_TASK_SHELL_ENGINE = path.join(bookRoot, 'shared', 'task-shell-engine.js');
const DEPLOYED_TASK_SHELL_UI = path.join(bookRoot, 'shared', 'task-shell-ui.js');
const TARGET_EXERCISES = path.join(platformRoot, 'references', 'authored', 'course-target-exercises.json');
const CANDIDATE_STORAGE = path.join(platformRoot, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');
const GENERATOR_READINESS = path.join(platformRoot, 'reports', 'json', 'skilltree-generator-readiness.json');

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(filePath) {
  assert(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireFresh(filePath) {
  const resolved = require.resolve(filePath);
  delete require.cache[resolved];
  return require(resolved);
}

function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkNoStudentCodeLeak(text, label) {
  assert(!/\b(?:A81|A97|A98|A99|A96|MTU|PV|GEN_A\d{2})\b/.test(text), `${label}: visible text leaks internal code`);
}

function checkNoProductClaim(text, label) {
  const prohibited = /Je hebt laten zien dat je de eindopgave|eindopgave.*aankunt|beheerst|bewezen|aangetoond|\bcijfer\b|summatief|adaptief|diagnose|diagnostisch|automatische route|student-facing AI|PV projection|Scale Gate/i;
  assert(!prohibited.test(text), `${label}: prohibited product claim found`);
}

function listFilesRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(full));
    else files.push(full);
  });
  return files;
}

function shellPath(item) {
  const dir = path.join(bookRoot, CHAPTER, item.dir);
  const matches = listFilesRecursive(dir).filter((file) => /redeneer-spel\.html$/i.test(file));
  assert(matches.length === 1, `${item.parNr}: expected one redeneer-spel HTML file, found ${matches.length}`);
  return matches[0];
}

function loadReasoningData(parNr) {
  const dataPath = path.join(bookRoot, 'shared', 'reasoning', `${parNr}.js`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(read(dataPath), context, { filename: dataPath });
  return { csv: context.REASONING_CSV, meta: context.REASONING_META, dataPath };
}

function checkTargetFieldsStillAbsent() {
  const data = JSON.parse(read(TARGET_EXERCISES));
  const records = data.exercises || data.paragraphs || data;
  ['1.1.1', '1.1.2', '1.1.3'].forEach((parNr) => {
    const record = records.find((item) => item.id === parNr);
    assert(record, `missing target-exercise record ${parNr}`);
    assert(record.question_type === undefined, `${parNr} target exercise must not receive question_type`);
    assert(record.answer_form === undefined, `${parNr} target exercise must not receive answer_form`);
  });
}

function checkNoSourceDataWrites() {
  const status = execFileSync('git', [
    'status',
    '--short',
    '--',
    'source-data/book-1/reasoning',
    'source-data/book-1/exit-ticket',
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion/answer-skill-candidates.json'
  ], { cwd: platformRoot, encoding: 'utf8' }).trim();
  assert(!status, `REASON-ANSWERFORM-2 must not mutate protected/source data; git status:\n${status}`);
}

function checkGeneratorBlocked() {
  const readiness = JSON.parse(read(GENERATOR_READINESS));
  ['A81', 'A97', 'A98', 'A99'].forEach((unitId) => {
    const row = readiness.rows.find((item) => item.unit_id === unitId);
    assert(row, `missing generator readiness row ${unitId}`);
    assert(row.generator_blocked === true, `${unitId} must remain generator-blocked`);
    assert(row.student_facing_skilltree_use_allowed === false, `${unitId} must not be student-facing skill-tree enabled`);
  });
}

function checkTask(ReasoningEngine, TaskShellEngine, TaskShellUI, item, mode) {
  const data = loadReasoningData(item.parNr);
  const engine = new ReasoningEngine({
    csvString: data.csv,
    domain: data.meta.domain,
    parNr: data.meta.parNr,
    roundsPerGame: 3
  });
  engine.startGame(mode);
  const round = engine.getRound();
  assert(round, `${item.parNr} mode ${mode}: missing round`);
  assert(round.answerFormScaffold, `${item.parNr} mode ${mode}: missing answer-form scaffold`);
  assert(round.answerFormScaffold.visibility === 'practice_scaffold', `${item.parNr} mode ${mode}: scaffold must be practice-only`);
  assert(round.answerFormScaffold.boundaryFlags.targetEquivalentProof === false, `${item.parNr} mode ${mode}: target proof flag must be false`);
  assert(!round.answerFormScaffold.unitIds.includes('A81'), `${item.parNr} mode ${mode}: live task must not silently add A81 modifier without source proof`);

  if (round.taskShellTask) {
    assert(round.taskShellTask.answerFormScaffold, `${item.parNr} mode ${mode}: taskShellTask missing scaffold metadata`);
    TaskShellEngine.validateTask(round.taskShellTask);
    assert(TaskShellEngine.findStudentTextViolations(round.taskShellTask).length === 0, `${item.parNr} mode ${mode}: student text violation`);
    const rendered = TaskShellUI.renderTask(round.taskShellTask, 0);
    checkNoStudentCodeLeak(visibleText(rendered), `${item.parNr} mode ${mode} rendered task`);
    checkNoProductClaim(visibleText(rendered), `${item.parNr} mode ${mode} rendered task`);
  }
}

function checkScaffoldMap(ReasoningEngine, item) {
  const data = loadReasoningData(item.parNr);
  const engine = new ReasoningEngine({
    csvString: data.csv,
    domain: data.meta.domain,
    parNr: data.meta.parNr,
    roundsPerGame: 3
  });
  const map = engine.getAnswerFormScaffoldMap();
  assert(map.routeStatus === 'local_practice_scaffold', `${item.parNr}: scaffold map must be practice-only`);
  ['A97', 'A98', 'A99', 'A81'].forEach((unitId) => {
    assert(map.availableScaffolds[unitId], `${item.parNr}: scaffold catalog missing ${unitId}`);
  });
  assert(map.availableScaffolds.A97.lane !== map.availableScaffolds.A98.lane, `${item.parNr}: A97/A98 lanes collapsed`);
  assert(map.availableScaffolds.A98.lane !== map.availableScaffolds.A99.lane, `${item.parNr}: A98/A99 lanes collapsed`);
  assert(map.availableScaffolds.A81.requiresUnderlyingAnswerForm === true, `${item.parNr}: A81 must require underlying answer form`);
  assert(map.sourceUsePattern.sourceUseModifier === true, `${item.parNr}: source-use pattern missing modifier proof`);
  assert(map.sourceUsePattern.modifierUnitIds.includes('A81'), `${item.parNr}: source-use pattern must include A81 as modifier`);
  assert(map.sourceUsePattern.underlyingAnswerFormUnitId !== 'A81', `${item.parNr}: A81 cannot be its own underlying answer form`);
  assert(map.boundaryFlags.targetEquivalentProof === false, `${item.parNr}: map target proof flag must be false`);
  assert(map.modeDisposition.some((row) => row.mode === 2 && row.answerFormRoute === 'local_error_repair_only'), `${item.parNr}: mode 2 disposition missing`);
  assert(map.modeDisposition.some((row) => row.mode === 4 && row.answerFormRoute === 'held_for_classification_with_explanation_design'), `${item.parNr}: mode 4 disposition missing`);
}

function main() {
  const ReasoningEngine = requireFresh(DEPLOYED_REASONING_ENGINE);
  const TaskShellEngine = requireFresh(DEPLOYED_TASK_SHELL_ENGINE);
  const TaskShellUI = requireFresh(DEPLOYED_TASK_SHELL_UI);

  const deployedUi = read(DEPLOYED_REASONING_UI);
  assert(deployedUi.includes('renderAnswerFormCue'), 'deployed UI must render answer-form scaffold cue');
  assert(deployedUi.includes('data-answer-form-scaffold="practice"'), 'deployed UI missing scaffold DOM marker');
  assert(!/\bA(?:81|96|97|98|99)\b/.test(deployedUi), 'deployed UI source must not hard-code visible unit IDs');

  const deployedCss = read(DEPLOYED_REASONING_CSS);
  assert(deployedCss.includes('.r-answer-form-cue'), 'deployed CSS must style answer-form cue');

  assert(typeof ReasoningEngine.getAnswerFormScaffoldCatalog === 'function', 'engine missing scaffold catalog');
  assert(typeof ReasoningEngine.buildSourceUseScaffold === 'function', 'engine missing source-use builder');
  assert((() => {
    try {
      ReasoningEngine.buildSourceUseScaffold('A81');
      return false;
    } catch (_error) {
      return true;
    }
  })(), 'A81 standalone source-use scaffold must be rejected');

  checkNoSourceDataWrites();
  assert(!fs.existsSync(CANDIDATE_STORAGE), 'must not create answer-skill candidate storage');
  checkTargetFieldsStillAbsent();
  checkGeneratorBlocked();

  PARAGRAPHS.forEach((item) => {
    const pageText = visibleText(read(shellPath(item)));
    checkNoStudentCodeLeak(pageText, `${item.parNr} static page`);
    checkNoProductClaim(pageText, `${item.parNr} static page`);
    checkScaffoldMap(ReasoningEngine, item);
    [0, 1, 2, 3, 5].forEach((mode) => checkTask(ReasoningEngine, TaskShellEngine, TaskShellUI, item, mode));
  });

  console.log(`REASON-ANSWERFORM-2 route output OK (${PARAGRAPHS.length} paragraphs; answer-form scaffolds practice-only; A81 modifier guarded)`);
}

try {
  main();
} catch (error) {
  console.error(`REASON-ANSWERFORM-2 route output check failed: ${error.message}`);
  process.exit(1);
}
