#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const { loadConfig } = require('../lib/lib-deploy-config');

const OLD_COMPLETION_COPY = 'Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.';
const CURRENT_HELD_COPY = 'Je antwoorden zijn lokaal nagekeken. Gebruik de oefenroute als je een onderdeel wilt versterken.';
const FORBIDDEN_COPY = /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt/i;

function fail(message) {
  console.error(`L1.7B-Q2-COPY check failed: ${message}`);
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

function validateHeldExitTicket(parNr) {
  const relPath = `source-data/book-1/exit-ticket/${parNr}-exit-ticket.json`;
  const data = readJson(relPath);
  try {
    ExitTicketEngine.validateData(data);
  } catch (error) {
    fail(`${relPath} does not validate: ${error.message}`);
  }
  if (data.surface !== 'target_equivalent_exit_ticket') fail(`${relPath} must be target_equivalent_exit_ticket`);
  if (data.targetEquivalent?.gateApproved !== true) fail(`${relPath} gateApproved must remain true`);
  if (data.targetEquivalent?.completionLanguageEligible !== false) fail(`${relPath} completionLanguageEligible must remain false`);
  if (data.completion?.text !== CURRENT_HELD_COPY) fail(`${relPath} must use the neutral held completion copy`);
  const text = JSON.stringify(data);
  if (text.includes(OLD_COMPLETION_COPY)) fail(`${relPath} must not contain the old completion copy`);
  rejectText(text, FORBIDDEN_COPY, 'forbidden readiness/completion language', relPath);
}

function validateAdvisoryShortCheck(parNr) {
  const relPath = `source-data/book-1/exit-ticket/${parNr}-korte-check.json`;
  const data = readJson(relPath);
  if (data.surface !== 'advisory_short_check') fail(`${relPath} must remain advisory_short_check`);
  if (data.targetEquivalent?.candidate !== false) fail(`${relPath} must not become a target-equivalent candidate`);
  if (data.targetEquivalent?.completionLanguageEligible !== false) fail(`${relPath} completionLanguageEligible must remain false`);
  if (data.metadataAlignment?.targetReadinessEvidence !== false) fail(`${relPath} targetReadinessEvidence must remain false`);
  rejectText(JSON.stringify(data), FORBIDDEN_COPY, 'forbidden readiness/completion language', relPath);
}

for (const parNr of ['1.1.1', '1.1.2', '1.1.3']) {
  validateHeldExitTicket(parNr);
  validateAdvisoryShortCheck(parNr);
  if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', `${parNr}.json`))) {
    fail(`legacy unsuffixed ${parNr} source must remain absent`);
  }
}

if (!fs.existsSync(LESSON_BOOK_ROOT)) fail(`missing lesson book root ${LESSON_BOOK_ROOT}`);
const config = loadConfig(LESSON_BOOK_ROOT);
for (const parNr of ['1.1.1', '1.1.2', '1.1.3']) {
  const found = config.findParagraphFolder(parNr);
  if (!found) fail(`cannot find ${parNr} paragraph folder in lesson output`);

  const sharedExitPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', `${parNr}-exit-ticket.js`);
  const sharedShortPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', `${parNr}-korte-check.js`);
  const exitPagePath = findParagraphFile(found.fullPath, /exit-ticket\.html$/i, `${parNr} exit-ticket shell`);
  const shortPagePath = findParagraphFile(found.fullPath, /korte-check\.html$/i, `${parNr} short-check shell`);
  const landingPath = path.join(found.fullPath, 'index.html');

  for (const file of [sharedExitPath, sharedShortPath, exitPagePath, shortPagePath, landingPath]) {
    const content = read(file);
    rejectText(content, FORBIDDEN_COPY, 'forbidden readiness/completion language', file);
  }

  const sharedExit = read(sharedExitPath);
  requireText(sharedExit, /"completionLanguageEligible": false/, `${parNr} held completion-language flag`, sharedExitPath);
  requireText(sharedExit, new RegExp(CURRENT_HELD_COPY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${parNr} neutral held completion copy`, sharedExitPath);

  const landing = read(landingPath);
  requireText(landing, /Maak de aparte eindcontrole wanneer je de paragraaf hebt geoefend\./, `${parNr} neutral row copy`, landingPath);
  requireText(landing, /Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen\./, `${parNr} neutral tile copy`, landingPath);
}

console.log('OK L1.7B-Q2-COPY');
