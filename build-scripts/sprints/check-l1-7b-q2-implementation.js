#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const { loadConfig } = require('../lib/lib-deploy-config');

function fail(message) {
  console.error(`L1.7B-Q2 implementation check failed: ${message}`);
  process.exit(1);
}

function read(relPath, cwd = ROOT) {
  const file = path.join(cwd, relPath);
  if (!fs.existsSync(file)) fail(`missing ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath, cwd = ROOT) {
  try {
    return JSON.parse(read(relPath, cwd));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function requireText(content, pattern, label, file) {
  if (!pattern.test(content)) fail(`${file} missing ${label}`);
}

function rejectText(content, pattern, label, file) {
  if (pattern.test(content)) fail(`${file} contains ${label}`);
}

function findParagraphFile(paragraphPath, pattern, label) {
  const files = fs.readdirSync(paragraphPath);
  const match = files.find((file) => pattern.test(file));
  if (!match) fail(`missing ${label} in ${paragraphPath}`);
  return path.join(paragraphPath, match);
}

const advisory = readJson('source-data/book-1/exit-ticket/1.1.1.json');
const data = readJson('source-data/book-1/exit-ticket/1.1.2.json');

if (advisory.surface === 'target_equivalent_exit_ticket') fail('1.1.1 must remain advisory, not target-equivalent');
if (advisory.metadataAlignment.targetReadinessEvidence !== false) fail('1.1.1 must not become target-readiness evidence');

try {
  ExitTicketEngine.validateData(data);
} catch (error) {
  fail(`1.1.2 source data does not validate: ${error.message}`);
}

if (data.surface !== 'target_equivalent_exit_ticket') fail('1.1.2 must use target_equivalent_exit_ticket surface');
if (!data.targetEquivalent || data.targetEquivalent.candidate !== true) fail('1.1.2 must be a target-equivalent candidate');
if (data.targetEquivalent.gateApproved !== false) fail('1.1.2 gateApproved must remain false before GATE-L1.7B-Q2');
if (data.targetEquivalent.completionLanguageEligible !== false) fail('1.1.2 completionLanguageEligible must remain false before GATE-L1.7B-Q2');
if (data.metadataAlignment.status !== 'target_equivalent_aligned') fail('1.1.2 metadata status must be target_equivalent_aligned');
if (data.metadataAlignment.targetReadinessEvidence !== true) fail('1.1.2 must carry reviewed target-readiness evidence as candidate input');

const requiredSkills = ['A38', 'A39', 'D31'];
for (const id of requiredSkills) {
  if (!data.targetSkillIds.includes(id)) fail(`1.1.2 targetSkillIds missing ${id}`);
  if (!data.skillScopeIds.includes(id)) fail(`1.1.2 skillScopeIds missing ${id}`);
  if (!data.metadataAlignment.targetExerciseSkillIds.includes(id)) fail(`1.1.2 targetExerciseSkillIds missing ${id}`);
}

const taskById = Object.fromEntries(data.tasks.map((task) => [task.id, task]));
const expectedTasks = {
  'prijsstijging-procent': 'calculation_work_capture',
  'index-naar-waarde': 'calculation_work_capture',
  'index-naar-procent': 'calculation_work_capture',
  'indexpunten-uitleg': 'short_constructed_response',
};
for (const [id, family] of Object.entries(expectedTasks)) {
  const task = taskById[id];
  if (!task) fail(`missing task ${id}`);
  if (task.type !== 'task_shell') fail(`${id} must use task_shell`);
  if (task.taskShell.family !== family) fail(`${id} must use family ${family}`);
}

const engine = new ExitTicketEngine({ data });
engine.checkTask('prijsstijging-procent', { work: '(920 - 800) / 800 x 100', finalAnswer: '15%' });
engine.checkTask('index-naar-waarde', { work: '162 / 150 x 100', finalAnswer: '108' });
engine.checkTask('index-naar-procent', { work: '(112 - 108) / 108 x 100', finalAnswer: '3,7%' });
engine.checkTask(
  'indexpunten-uitleg',
  'Het is niet 4 procent. Het zijn 4 indexpunten; de basis is 108 en de stijging is ongeveer 3,7 procent.'
);
const progress = engine.getProgress();
if (progress.proofCandidate !== true) fail('correct 1.1.2 responses must become proofCandidate true');
if (progress.completionLanguageEligible !== false) fail('proofCandidate must not authorize completion language before gate approval');

const adversarialEngine = new ExitTicketEngine({ data });
if (adversarialEngine.checkTask('prijsstijging-procent', { work: 'ik gok', finalAnswer: '15%' }).matched !== false) {
  fail('bogus calculation work must not match with only a correct final answer');
}
adversarialEngine.checkTask('index-naar-waarde', { work: '162 / 150 x 100', finalAnswer: '108' });
adversarialEngine.checkTask('index-naar-procent', { work: '(112 - 108) / 108 x 100', finalAnswer: '3,7%' });
if (
  adversarialEngine.checkTask(
    'indexpunten-uitleg',
    'Het is niet fout: 4 procent is indexpunten, 108 en 3,7.'
  ).matched !== false
) {
  fail('contradictory D31 answer must not match');
}
if (adversarialEngine.getProgress().proofCandidate !== false) {
  fail('adversarial responses must not become proofCandidate true');
}

const sourceText = JSON.stringify(data);
rejectText(sourceText, /Je hebt laten zien|aankunt|bewezen|aangetoond|beheerst/i, 'unauthorized completion claim', '1.1.2 source');

if (!fs.existsSync(LESSON_BOOK_ROOT)) fail(`missing lesson book root ${LESSON_BOOK_ROOT}`);
const config = loadConfig(LESSON_BOOK_ROOT);
const found = config.findParagraphFolder('1.1.2');
if (!found) fail('cannot find 1.1.2 paragraph folder in lesson output');

const sharedDataPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.2.js');
if (!fs.existsSync(sharedDataPath)) fail('missing generated shared/exit-ticket/1.1.2.js');
const sharedData = fs.readFileSync(sharedDataPath, 'utf8');
requireText(sharedData, /target_equivalent_exit_ticket/, 'target-equivalent surface', 'shared/exit-ticket/1.1.2.js');
requireText(sharedData, /"gateApproved": false/, 'held gate approval flag', 'shared/exit-ticket/1.1.2.js');
requireText(sharedData, /"completionLanguageEligible": false/, 'held completion-language flag', 'shared/exit-ticket/1.1.2.js');
rejectText(sharedData, /Je hebt laten zien|aankunt|bewezen|aangetoond|beheerst/i, 'unauthorized completion claim', 'shared/exit-ticket/1.1.2.js');

const shellPath = findParagraphFile(found.fullPath, /exit-ticket\.html$/i, '1.1.2 exit-ticket shell');
const shell = fs.readFileSync(shellPath, 'utf8');
requireText(shell, /<title>Percentages en indexcijfers - Exit ticket<\/title>/, 'exit-ticket shell title', shellPath);
requireText(shell, /shared\/exit-ticket\/1\.1\.2\.js/, '1.1.2 data include', shellPath);

const landing = read('index.html', found.fullPath);
requireText(landing, /Exit ticket/, 'exit-ticket landing card', path.join(found.fullPath, 'index.html'));
requireText(landing, /Maak de volledige paragraaf-check/, 'target-equivalent landing description', path.join(found.fullPath, 'index.html'));
requireText(landing, /Rond af met de paragraaf-check/, 'target-equivalent section hint', path.join(found.fullPath, 'index.html'));

console.log('OK L1.7B-Q2 implementation');
