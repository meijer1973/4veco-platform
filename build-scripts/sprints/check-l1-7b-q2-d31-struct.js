#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');
const { loadConfig } = require('../lib/lib-deploy-config');

const CURRENT_HELD_COPY = 'Je antwoorden zijn lokaal nagekeken. Gebruik de oefenroute als je een onderdeel wilt versterken.';
const FORBIDDEN_COPY = /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt/i;

function fail(message) {
  console.error(`L1.7B-Q2-D31-STRUCT check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  const file = path.join(ROOT, relPath);
  try {
    return JSON.parse(read(file));
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

const data = readJson('source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const advisory = readJson('source-data/book-1/exit-ticket/1.1.2-korte-check.json');
const legacyUnsuffixed112Path = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.2.json');

if (fs.existsSync(legacyUnsuffixed112Path)) {
  fail('legacy unsuffixed 1.1.2 source must remain absent');
}
if (advisory.surface !== 'advisory_short_check') fail('1.1.2 short check must remain advisory');
if (advisory.targetEquivalent?.completionLanguageEligible !== false) fail('1.1.2 short check completion language must remain held');

try {
  ExitTicketEngine.validateData(data);
} catch (error) {
  fail(`1.1.2 source data does not validate: ${error.message}`);
}

if (data.surface !== 'target_equivalent_exit_ticket') fail('1.1.2 must remain target_equivalent_exit_ticket');
if (data.targetEquivalent?.gateApproved !== true) fail('1.1.2 gateApproved must remain true');
if (data.targetEquivalent?.completionLanguageEligible !== false) fail('1.1.2 completionLanguageEligible must remain false');
if (data.completion?.text !== CURRENT_HELD_COPY) fail('1.1.2 must use the neutral held completion copy');

const taskById = Object.fromEntries(data.tasks.map((task) => [task.id, task]));
const d31Task = taskById['indexpunten-uitleg'];
if (!d31Task) fail('missing D31 task indexpunten-uitleg');
if (d31Task.type !== 'task_shell') fail('D31 task must remain task_shell');
if (d31Task.taskShell.family !== 'structured_short_response') fail('D31 task must use structured_short_response');

const d31 = d31Task.taskShell;
if (d31.expected.kind !== 'structured_text_criteria') fail('D31 task must use structured_text_criteria');
if (!Array.isArray(d31.interaction.fields) || d31.interaction.fields.length !== 3) {
  fail('D31 task must expose exactly three structured fields');
}
for (const fieldId of ['indexpunten', 'basis', 'procentuele-stijging']) {
  if (!d31.interaction.fields.some((field) => field.id === fieldId)) fail(`D31 task missing field ${fieldId}`);
  if (!d31.expected.fields.some((field) => field.id === fieldId)) fail(`D31 task missing expected field ${fieldId}`);
}
if (!d31.expected.choice || d31.expected.choice.value !== 'niet-vier-procent') {
  fail('D31 task must require rejecting the 4 percent claim');
}

const correctEngine = new ExitTicketEngine({ data });
if (correctEngine.checkTask('indexpunten-uitleg', correctD31Response()).matched !== true) {
  fail('correct structured D31 response must match');
}
const wrongEngine = new ExitTicketEngine({ data });
if (wrongEngine.checkTask('indexpunten-uitleg', wrongD31Response()).matched !== false) {
  fail('wrong D31 values and claim must not match');
}

const rendered = ExitTicketUI.renderStaticHtml(data, {});
requireText(rendered, /data-task-family="structured_short_response"/, 'structured short-response marker', 'rendered 1.1.2 UI');
requireText(rendered, /data-input-role="structured-field"/, 'structured field controls', 'rendered 1.1.2 UI');
requireText(rendered, /data-field-id="indexpunten"/, 'indexpunten field', 'rendered 1.1.2 UI');
requireText(rendered, /data-choice-id="niet-vier-procent"/, 'claim rejection choice', 'rendered 1.1.2 UI');
rejectText(rendered, FORBIDDEN_COPY, 'forbidden readiness/completion language', 'rendered 1.1.2 UI');

if (!fs.existsSync(LESSON_BOOK_ROOT)) fail(`missing lesson book root ${LESSON_BOOK_ROOT}`);
const config = loadConfig(LESSON_BOOK_ROOT);
const found112 = config.findParagraphFolder('1.1.2');
if (!found112) fail('cannot find 1.1.2 paragraph folder in lesson output');

const shared112Path = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.2-exit-ticket.js');
const shared112 = read(shared112Path);
requireText(shared112, /structured_short_response/, 'generated structured D31 family', shared112Path);
requireText(shared112, /structured_text_criteria/, 'generated structured D31 criteria', shared112Path);
requireText(shared112, /niet-vier-procent/, 'generated claim rejection choice', shared112Path);
requireText(shared112, /"completionLanguageEligible": false/, 'held completion-language flag', shared112Path);
rejectText(shared112, FORBIDDEN_COPY, 'forbidden readiness/completion language', shared112Path);

const shell112Path = findParagraphFile(found112.fullPath, /exit-ticket\.html$/i, '1.1.2 exit-ticket shell');
const shell112 = read(shell112Path);
requireText(shell112, /shared\/exit-ticket\/1\.1\.2-exit-ticket\.js/, 'suffixed 1.1.2 data include', shell112Path);
requireText(shell112, /data-field-id="indexpunten"/, 'rendered D31 indexpunten field', shell112Path);
rejectText(shell112, FORBIDDEN_COPY, 'forbidden readiness/completion language', shell112Path);

console.log('OK L1.7B-Q2-D31-STRUCT');
