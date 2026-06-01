#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');
const { loadConfig } = require('../lib/lib-deploy-config');

const APPROVED_COPY = 'Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.';

function fail(message) {
  console.error(`L1.7B-Q2-D31-STRUCT check failed: ${message}`);
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

function checkNoUnauthorizedCompletionLanguage(content, file) {
  const withoutApproved = content.replaceAll(APPROVED_COPY, '');
  rejectText(
    withoutApproved,
    /bewezen|aangetoond|beheerst|\bcijfer\b|voldoende|summatief|diagnose|diagnostisch|adaptief|automatisch door|automatische route|mastery|sequencing|student-facing AI|PV projection|PV machine/i,
    'unauthorized completion/product language',
    file
  );
}

function correctD31Response() {
  return {
    fields: {
      indexpunten: '4 indexpunten',
      basis: '108',
      'procentuele-stijging': '3,7%'
    },
    choice: 'niet-vier-procent'
  };
}

function wrongD31Response() {
  return {
    fields: {
      indexpunten: '4 procent',
      basis: '100',
      'procentuele-stijging': '4%'
    },
    choice: 'wel-vier-procent'
  };
}

function partialD31Response() {
  return {
    fields: {
      indexpunten: '4 indexpunten',
      basis: '',
      'procentuele-stijging': '3,7%'
    },
    choice: 'niet-vier-procent'
  };
}

const advisory = readJson('source-data/book-1/exit-ticket/1.1.1.json');
const data = readJson('source-data/book-1/exit-ticket/1.1.2.json');

if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3.json'))) {
  fail('1.1.3 exit-ticket source must remain absent until a separate graph/table proof sprint');
}

if (advisory.surface === 'target_equivalent_exit_ticket') fail('1.1.1 must remain advisory, not target-equivalent');
if (advisory.metadataAlignment.targetReadinessEvidence !== false) fail('1.1.1 must not become target-readiness evidence');
if (advisory.targetEquivalent) fail('1.1.1 must not gain targetEquivalent metadata');

try {
  ExitTicketEngine.validateData(data);
} catch (error) {
  fail(`1.1.2 source data does not validate: ${error.message}`);
}

if (data.surface !== 'target_equivalent_exit_ticket') fail('1.1.2 must remain target_equivalent_exit_ticket');
if (!data.targetEquivalent || data.targetEquivalent.gateApproved !== true) fail('1.1.2 gateApproved must remain true');
if (data.targetEquivalent.completionLanguageEligible !== true) fail('1.1.2 completionLanguageEligible must remain true');
if (!data.completion || data.completion.text !== APPROVED_COPY) fail('1.1.2 approved completion copy changed');

const taskById = Object.fromEntries(data.tasks.map((task) => [task.id, task]));
const expectedFamilies = {
  'prijsstijging-procent': 'calculation_work_capture',
  'index-naar-waarde': 'calculation_work_capture',
  'index-naar-procent': 'calculation_work_capture',
  'indexpunten-uitleg': 'structured_short_response'
};
for (const [id, family] of Object.entries(expectedFamilies)) {
  const task = taskById[id];
  if (!task) fail(`missing task ${id}`);
  if (task.type !== 'task_shell') fail(`${id} must remain a task_shell task`);
  if (task.taskShell.family !== family) fail(`${id} must use family ${family}`);
}

const d31 = taskById['indexpunten-uitleg'].taskShell;
if (d31.expected.kind !== 'structured_text_criteria') fail('Task 4 must use structured_text_criteria');
if (!Array.isArray(d31.interaction.fields) || d31.interaction.fields.length !== 3) {
  fail('Task 4 must expose exactly three structured fields');
}
if (!Array.isArray(d31.interaction.options) || d31.interaction.options.length < 2) {
  fail('Task 4 must expose a claim judgment option set');
}
for (const fieldId of ['indexpunten', 'basis', 'procentuele-stijging']) {
  if (!d31.interaction.fields.some((field) => field.id === fieldId)) fail(`Task 4 missing field ${fieldId}`);
  if (!d31.expected.fields.some((field) => field.id === fieldId)) fail(`Task 4 missing expected field ${fieldId}`);
}
if (!d31.expected.choice || d31.expected.choice.value !== 'niet-vier-procent') {
  fail('Task 4 must require rejecting the 4 percent claim');
}

const engine = new ExitTicketEngine({ data });
engine.checkTask('prijsstijging-procent', { work: '(920 - 800) / 800 x 100', finalAnswer: '15%' });
engine.checkTask('index-naar-waarde', { work: '162/150*100', finalAnswer: '108' });
engine.checkTask('index-naar-procent', { work: '(112 - 108) / 108 x 100', finalAnswer: '3,7%' });
if (engine.checkTask('indexpunten-uitleg', correctD31Response()).matched !== true) {
  fail('correct structured D31 response must match');
}
const progress = engine.getProgress();
if (progress.proofCandidate !== true) fail('complete correct 1.1.2 attempt must become proofCandidate');
if (progress.completionLanguageEligible !== true) fail('complete correct 1.1.2 attempt must remain completionLanguageEligible');

const wrongEngine = new ExitTicketEngine({ data });
if (wrongEngine.checkTask('indexpunten-uitleg', wrongD31Response()).matched !== false) {
  fail('wrong D31 values and claim must not match');
}
if (wrongEngine.checkTask('indexpunten-uitleg', partialD31Response()).matched !== false) {
  fail('partial D31 response must not match');
}

const rendered = ExitTicketUI.renderStaticHtml(data, {});
requireText(rendered, /data-task-family="structured_short_response"/, 'structured short-response marker', 'rendered 1.1.2 UI');
requireText(rendered, /data-input-role="structured-field"/, 'structured field controls', 'rendered 1.1.2 UI');
requireText(rendered, /data-field-id="indexpunten"/, 'indexpunten field', 'rendered 1.1.2 UI');
requireText(rendered, /data-choice-id="niet-vier-procent"/, 'claim rejection choice', 'rendered 1.1.2 UI');
requireText(rendered, /<section class="et-completion" id="et-completion" hidden>/, 'hidden completion section before proof', 'rendered 1.1.2 UI');
rejectText(rendered, /\b(?:A\d{2}|D\d{2}|PV|MTU)\b/, 'internal code', 'rendered 1.1.2 UI');
checkNoUnauthorizedCompletionLanguage(rendered, 'rendered 1.1.2 UI');

if (!fs.existsSync(LESSON_BOOK_ROOT)) fail(`missing lesson book root ${LESSON_BOOK_ROOT}`);
const config = loadConfig(LESSON_BOOK_ROOT);
const found112 = config.findParagraphFolder('1.1.2');
if (!found112) fail('cannot find 1.1.2 paragraph folder in lesson output');

const shared112Path = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.2.js');
if (!fs.existsSync(shared112Path)) fail('missing generated shared/exit-ticket/1.1.2.js');
const shared112 = fs.readFileSync(shared112Path, 'utf8');
requireText(shared112, /structured_short_response/, 'generated structured Task 4 family', 'shared/exit-ticket/1.1.2.js');
requireText(shared112, /structured_text_criteria/, 'generated structured Task 4 criteria', 'shared/exit-ticket/1.1.2.js');
requireText(shared112, /niet-vier-procent/, 'generated claim rejection choice', 'shared/exit-ticket/1.1.2.js');
requireText(shared112, /Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt\./, 'approved copy', 'shared/exit-ticket/1.1.2.js');
checkNoUnauthorizedCompletionLanguage(shared112, 'shared/exit-ticket/1.1.2.js');

const shell112Path = findParagraphFile(found112.fullPath, /exit-ticket\.html$/i, '1.1.2 exit-ticket shell');
const shell112 = fs.readFileSync(shell112Path, 'utf8');
requireText(shell112, /shared\/exit-ticket\/1\.1\.2\.js/, '1.1.2 data include', shell112Path);
rejectText(shell112, /\b(?:A\d{2}|D\d{2}|PV|MTU)\b/, 'internal code', shell112Path);

const shared111Path = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.1.js');
if (!fs.existsSync(shared111Path)) fail('missing generated shared/exit-ticket/1.1.1.js');
const shared111 = fs.readFileSync(shared111Path, 'utf8');
rejectText(shared111, /target_equivalent_exit_ticket|targetEquivalent|Je hebt laten zien|aankunt|bewezen|aangetoond|beheerst/i, 'target-equivalent or completion claim', 'shared/exit-ticket/1.1.1.js');

const generated113Path = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3.js');
if (fs.existsSync(generated113Path)) fail('generated shared/exit-ticket/1.1.3.js must remain absent');
const found113 = config.findParagraphFolder('1.1.3');
if (found113) {
  const exit113 = fs.readdirSync(found113.fullPath).find((file) => /exit-ticket\.html$/i.test(file));
  if (exit113) fail('1.1.3 generated exit-ticket shell must remain absent');
}

console.log('OK L1.7B-Q2-D31-STRUCT');
