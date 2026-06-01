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
  console.error(`L1.7B-Q2-COPY check failed: ${message}`);
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

const advisory = readJson('source-data/book-1/exit-ticket/1.1.1.json');
const data = readJson('source-data/book-1/exit-ticket/1.1.2.json');

if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3.json'))) {
  fail('1.1.3 exit-ticket source must remain absent until a separate graph/table proof sprint');
}

if (advisory.surface === 'target_equivalent_exit_ticket') fail('1.1.1 must remain advisory, not target-equivalent');
if (advisory.metadataAlignment.targetReadinessEvidence !== false) fail('1.1.1 must not become target-readiness evidence');
if (advisory.targetEquivalent) fail('1.1.1 must not gain targetEquivalent metadata in COPY sprint');

try {
  ExitTicketEngine.validateData(data);
} catch (error) {
  fail(`1.1.2 source data does not validate: ${error.message}`);
}

if (data.surface !== 'target_equivalent_exit_ticket') fail('1.1.2 must use target_equivalent_exit_ticket surface');
if (!data.targetEquivalent || data.targetEquivalent.candidate !== true) fail('1.1.2 must remain a target-equivalent candidate');
if (data.targetEquivalent.gateApproved !== true) fail('1.1.2 gateApproved must be true after GATE-L1.7B-Q2-COPY');
if (data.targetEquivalent.completionLanguageEligible !== true) {
  fail('1.1.2 completionLanguageEligible must be true after GATE-L1.7B-Q2-COPY');
}
if (!data.completion || data.completion.text !== APPROVED_COPY) {
  fail('1.1.2 completion text must exactly match the approved GATE-L1.7B-Q2 copy');
}
if (data.completion.title !== 'Check afgerond') {
  fail('1.1.2 completion title must remain local and non-summative: Check afgerond');
}
if (data.metadataAlignment.status !== 'target_equivalent_aligned') fail('1.1.2 metadata status must remain target_equivalent_aligned');
if (data.metadataAlignment.targetReadinessEvidence !== true) fail('1.1.2 must retain reviewed target-readiness evidence');

const requiredSkills = ['A38', 'A39', 'D31'];
for (const id of requiredSkills) {
  if (!data.targetSkillIds.includes(id)) fail(`1.1.2 targetSkillIds missing ${id}`);
  if (!data.skillScopeIds.includes(id)) fail(`1.1.2 skillScopeIds missing ${id}`);
  if (!data.metadataAlignment.targetExerciseSkillIds.includes(id)) fail(`1.1.2 targetExerciseSkillIds missing ${id}`);
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
if (progress.gateApproved !== true) fail('correct 1.1.2 progress must report gateApproved true');
if (progress.completionLanguageEligible !== true) fail('correct 1.1.2 progress must report completionLanguageEligible true');

const compactTask2Engine = new ExitTicketEngine({ data });
const compactTask2Result = compactTask2Engine.checkTask('index-naar-waarde', {
  work: '162/150*100',
  finalAnswer: '108'
});
if (compactTask2Result.matched !== true) {
  fail('1.1.2 task 2 must accept compact visible work 162/150*100 with final answer 108');
}

const partialEngine = new ExitTicketEngine({ data });
partialEngine.checkTask('prijsstijging-procent', { work: '(920 - 800) / 800 x 100', finalAnswer: '15%' });
if (partialEngine.getProgress().completionLanguageEligible !== false) {
  fail('partial responses must not authorize student-level completion language');
}
if (partialEngine.getProgress().proofCandidate !== false) {
  fail('partial responses must not become proofCandidate true');
}

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

const rendered = ExitTicketUI.renderStaticHtml(data, {});
if (!rendered.includes(APPROVED_COPY)) fail('rendered 1.1.2 UI must include the approved completion copy');
requireText(rendered, /<section class="et-completion" id="et-completion" hidden>/, 'hidden completion section before proof', 'rendered 1.1.2 UI');
rejectText(rendered, /\b(?:A\d{2}|D\d{2}|PV|MTU)\b/, 'internal code', 'rendered 1.1.2 UI');
checkNoUnauthorizedCompletionLanguage(rendered, 'rendered 1.1.2 UI');

if (!fs.existsSync(LESSON_BOOK_ROOT)) fail(`missing lesson book root ${LESSON_BOOK_ROOT}`);
const config = loadConfig(LESSON_BOOK_ROOT);
const found = config.findParagraphFolder('1.1.2');
if (!found) fail('cannot find 1.1.2 paragraph folder in lesson output');

const sharedDataPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.2.js');
if (!fs.existsSync(sharedDataPath)) fail('missing generated shared/exit-ticket/1.1.2.js');
const sharedData = fs.readFileSync(sharedDataPath, 'utf8');
requireText(sharedData, /target_equivalent_exit_ticket/, 'target-equivalent surface', 'shared/exit-ticket/1.1.2.js');
requireText(sharedData, /"gateApproved": true/, 'approved gate flag', 'shared/exit-ticket/1.1.2.js');
requireText(sharedData, /"completionLanguageEligible": true/, 'completion-language flag', 'shared/exit-ticket/1.1.2.js');
if (!sharedData.includes(APPROVED_COPY)) fail('generated shared data must include approved copy exactly');
checkNoUnauthorizedCompletionLanguage(sharedData, 'shared/exit-ticket/1.1.2.js');

const advisorySharedPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.1.js');
if (!fs.existsSync(advisorySharedPath)) fail('missing generated shared/exit-ticket/1.1.1.js');
const advisoryShared = fs.readFileSync(advisorySharedPath, 'utf8');
requireText(advisoryShared, /"targetReadinessEvidence": false/, 'non-readiness evidence flag', 'shared/exit-ticket/1.1.1.js');
rejectText(advisoryShared, /target_equivalent_exit_ticket|targetEquivalent|Je hebt laten zien|aankunt|bewezen|aangetoond|beheerst/i, 'target-equivalent or completion claim', 'shared/exit-ticket/1.1.1.js');

const graphSharedPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3.js');
if (fs.existsSync(graphSharedPath)) fail('generated shared/exit-ticket/1.1.3.js must remain absent');

const shellPath = findParagraphFile(found.fullPath, /exit-ticket\.html$/i, '1.1.2 exit-ticket shell');
const shell = fs.readFileSync(shellPath, 'utf8');
requireText(shell, /<title>Percentages en indexcijfers - Exit ticket<\/title>/, 'exit-ticket shell title', shellPath);
requireText(shell, /shared\/exit-ticket\/1\.1\.2\.js/, '1.1.2 data include', shellPath);
rejectText(shell, /\b(?:A\d{2}|D\d{2}|PV|MTU)\b/, 'internal code', shellPath);

const landing = read('index.html', found.fullPath);
requireText(landing, /Exit ticket/, 'exit-ticket landing card', path.join(found.fullPath, 'index.html'));
requireText(landing, /Maak de volledige paragraaf-check/, 'target-equivalent landing description', path.join(found.fullPath, 'index.html'));
requireText(landing, /Rond af met de paragraaf-check/, 'target-equivalent section hint', path.join(found.fullPath, 'index.html'));
checkNoUnauthorizedCompletionLanguage(landing, path.join(found.fullPath, 'index.html'));

const advisoryFound = config.findParagraphFolder('1.1.1');
if (!advisoryFound) fail('cannot find 1.1.1 paragraph folder in lesson output');
const advisoryShellPath = findParagraphFile(advisoryFound.fullPath, /exit-ticket\.html$/i, '1.1.1 advisory check shell');
const advisoryShell = fs.readFileSync(advisoryShellPath, 'utf8');
requireText(advisoryShell, /Schaarste en economisch denken - Korte check/, 'advisory shell title', advisoryShellPath);
rejectText(advisoryShell, /Je hebt laten zien|aankunt|bewezen|aangetoond|beheerst/i, 'target-equivalent completion claim', advisoryShellPath);

const graphFound = config.findParagraphFolder('1.1.3');
if (!graphFound) fail('cannot find 1.1.3 paragraph folder in lesson output');
const graphExitTickets = fs.readdirSync(graphFound.fullPath).filter((file) => /exit-ticket\.html$/i.test(file));
if (graphExitTickets.length > 0) fail('1.1.3 generated exit-ticket page must remain absent');

console.log('OK L1.7B-Q2-COPY');
