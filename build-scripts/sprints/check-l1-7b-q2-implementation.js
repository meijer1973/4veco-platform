#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');
const { loadConfig } = require('../lib/lib-deploy-config');

const OLD_COMPLETION_COPY = 'Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.';
const CURRENT_HELD_COPY = 'Je antwoorden zijn lokaal nagekeken. Gebruik de oefenroute als je een onderdeel wilt versterken.';

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

function validateHeldCompletion(data, label) {
  if (data.targetEquivalent?.completionLanguageEligible !== false) {
    fail(`${label} completionLanguageEligible must remain false`);
  }
  if (data.completion?.text !== CURRENT_HELD_COPY) {
    fail(`${label} must use the current held neutral completion copy`);
  }
  const text = JSON.stringify(data);
  if (text.includes(OLD_COMPLETION_COPY)) fail(`${label} must not contain old approved completion copy`);
  rejectText(text, /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt/i, 'old authority/readiness copy', label);
}

const advisoryShort = readJson('source-data/book-1/exit-ticket/1.1.1-korte-check.json');
const short112 = readJson('source-data/book-1/exit-ticket/1.1.2-korte-check.json');
const data = readJson('source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const graphExit = readJson('source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');

if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.1.json'))) fail('legacy unsuffixed 1.1.1 source must remain absent');
if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.2.json'))) fail('legacy unsuffixed 1.1.2 source must remain absent');
if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3.json'))) fail('legacy unsuffixed 1.1.3 source must remain absent');

if (advisoryShort.surface !== 'advisory_short_check') fail('1.1.1 short check must remain advisory');
if (advisoryShort.metadataAlignment.targetReadinessEvidence !== false) fail('1.1.1 short check must not become target-readiness evidence');
if (short112.surface !== 'advisory_short_check') fail('1.1.2 short check must remain advisory');
if (short112.metadataAlignment.targetReadinessEvidence !== false) fail('1.1.2 short check must not become target-readiness evidence');

for (const [label, source] of [
  ['1.1.2 exit ticket', data],
  ['1.1.3 exit ticket', graphExit],
]) {
  try {
    ExitTicketEngine.validateData(source);
  } catch (error) {
    fail(`${label} source data does not validate: ${error.message}`);
  }
  if (source.surface !== 'target_equivalent_exit_ticket') fail(`${label} must use target_equivalent_exit_ticket surface`);
  if (source.targetEquivalent?.candidate !== true) fail(`${label} must remain a target-equivalent candidate`);
  if (source.targetEquivalent?.gateApproved !== true) fail(`${label} gateApproved must remain true`);
  if (source.metadataAlignment?.targetReadinessEvidence !== true) fail(`${label} must retain target-readiness evidence`);
  validateHeldCompletion(source, label);
}

const requiredSkills = ['A38', 'A39', 'D31'];
for (const id of requiredSkills) {
  if (!data.targetSkillIds.includes(id)) fail(`1.1.2 targetSkillIds missing ${id}`);
  if (!data.skillScopeIds.includes(id)) fail(`1.1.2 skillScopeIds missing ${id}`);
  if (!data.metadataAlignment.targetExerciseSkillIds.includes(id)) fail(`1.1.2 targetExerciseSkillIds missing ${id}`);
}

const taskById = Object.fromEntries(data.tasks.map((task) => [task.id, task]));
const expectedTasks = {
  'prijsstijging-procent': 'calculation_answer_form_capture',
  'index-naar-waarde': 'calculation_work_capture',
  'index-naar-procent': 'calculation_work_capture',
  'indexpunten-uitleg': 'structured_short_response',
};
for (const [id, family] of Object.entries(expectedTasks)) {
  const task = taskById[id];
  if (!task) fail(`missing task ${id}`);
  if (task.type !== 'task_shell') fail(`${id} must use task_shell`);
  if (task.taskShell.family !== family) fail(`${id} must use family ${family}`);
}

const rendered = ExitTicketUI.renderStaticHtml(data, {});
requireText(rendered, /data-task-family="calculation_answer_form_capture"/, 'answer-form calculation family', 'rendered 1.1.2 UI');
requireText(rendered, /data-task-family="structured_short_response"/, 'structured short response family', 'rendered 1.1.2 UI');
rejectText(rendered, /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt/i, 'old authority/readiness copy', 'rendered 1.1.2 UI');
rejectText(rendered, /Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt/i, 'old approved completion copy', 'rendered 1.1.2 UI');

if (!fs.existsSync(LESSON_BOOK_ROOT)) fail(`missing lesson book root ${LESSON_BOOK_ROOT}`);
const config = loadConfig(LESSON_BOOK_ROOT);
const found = config.findParagraphFolder('1.1.2');
if (!found) fail('cannot find 1.1.2 paragraph folder in lesson output');

const sharedDataPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.2-exit-ticket.js');
if (!fs.existsSync(sharedDataPath)) fail('missing generated shared/exit-ticket/1.1.2-exit-ticket.js');
const sharedData = fs.readFileSync(sharedDataPath, 'utf8');
requireText(sharedData, /target_equivalent_exit_ticket/, 'target-equivalent surface', 'shared/exit-ticket/1.1.2-exit-ticket.js');
requireText(sharedData, /"gateApproved": true/, 'held gate approval flag', 'shared/exit-ticket/1.1.2-exit-ticket.js');
requireText(sharedData, /"completionLanguageEligible": false/, 'held completion-language flag', 'shared/exit-ticket/1.1.2-exit-ticket.js');
requireText(sharedData, new RegExp(CURRENT_HELD_COPY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'held neutral completion copy', 'shared/exit-ticket/1.1.2-exit-ticket.js');
rejectText(sharedData, /Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt|doelopgave-niveau|antwoordvorm aankunt/i, 'old completion/readiness claim', 'shared/exit-ticket/1.1.2-exit-ticket.js');

const shellPath = findParagraphFile(found.fullPath, /exit-ticket\.html$/i, '1.1.2 exit-ticket shell');
const shell = fs.readFileSync(shellPath, 'utf8');
requireText(shell, /<title>Percentages en indexcijfers - Exit ticket<\/title>/, 'exit-ticket shell title', shellPath);
requireText(shell, /shared\/exit-ticket\/1\.1\.2-exit-ticket\.js/, 'suffixed 1.1.2 data include', shellPath);
requireText(shell, /shared\/golden-ticket-layout\.js/, 'golden ticket runtime include', shellPath);

const landing = read('index.html', found.fullPath);
requireText(landing, /Exit ticket/, 'exit-ticket landing card', path.join(found.fullPath, 'index.html'));
requireText(landing, /Maak de aparte eindcontrole wanneer je de paragraaf hebt geoefend\./, 'neutral exit-ticket landing description', path.join(found.fullPath, 'index.html'));
requireText(landing, /Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen\./, 'neutral exit-ticket tile copy', path.join(found.fullPath, 'index.html'));
rejectText(landing, /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|Je hebt laten zien dat je de eindopgave/i, 'old completion/readiness claim', path.join(found.fullPath, 'index.html'));

console.log('OK L1.7B-Q2 implementation');
