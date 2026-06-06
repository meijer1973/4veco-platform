#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`MERGE-HANDOFF-CHECKSURFACE-1 check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const root = process.cwd();

const markerPattern = [
  `^${'<'.repeat(7)}`,
  `^${'='.repeat(7)}$`,
  `^${'>'.repeat(7)}`,
].join('|');
const grep = spawnSync('git', ['grep', '-n', '-I', '-E', markerPattern, '--', ':!build-scripts/sprints/check-merge-handoff-checksurface1.js'], {
  cwd: root,
  encoding: 'utf8',
});
if (grep.status === 0) {
  fail(`conflict markers remain:\n${grep.stdout}`);
}
if (grep.status !== 1) {
  fail(`git grep failed:\n${grep.stderr || grep.stdout}`);
}

const excellentGateDir = path.join(
  root,
  'reports',
  'review-gates',
  'GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review'
);
for (const name of [
  'gate-closure.md',
  'gate-closure.json',
  'closure-proposal.md',
  'closure-proposal.json',
  'direct-review-comments.md',
  'direct-review-comments.json',
  'comment-resolution-log.md',
  'comment-resolution-log.json',
]) {
  assert(!fs.existsSync(path.join(excellentGateDir, name)), `premature gate artifact exists: ${name}`);
}

const packet = fs.readFileSync(path.join(excellentGateDir, 'review-packet.md'), 'utf8');
assert(/human review comments have\s+not started/i.test(packet), 'packet must say human review comments have not started');
assert(/no closure or product authority exists/i.test(packet), 'packet must say no closure or product authority exists');
assert(/superseded/i.test(packet), 'packet must mark the earlier retry packet as superseded');

const roadmap = fs.readFileSync(path.join(root, 'references', 'reference-team-roadmap.md'), 'utf8');
assert(/GATE-CHECK-SURFACE-EXCELLENT-1[^|\n]*`?[^|\n]*packet/i.test(roadmap) || /Renewed Excellent Check-Surface Gate Packet/i.test(roadmap), 'roadmap must retain excellent gate packet-prepared state');
assert(/MERGE-HANDOFF-CHECKSURFACE-1/.test(roadmap), 'roadmap must include merge handoff row');
assert(/not a human gate closure/i.test(roadmap), 'roadmap handoff row must say this is not a human gate closure');

const expectedFlags = new Map([
  ['1.1.1', false],
  ['1.1.2', true],
  ['1.1.3', false],
]);
for (const [parNr, expected] of expectedFlags.entries()) {
  const data = readJson(path.join(root, 'source-data', 'book-1', 'exit-ticket', `${parNr}-exit-ticket.json`));
  const actual = data.targetEquivalent && data.targetEquivalent.completionLanguageEligible;
  assert(actual === expected, `${parNr} completionLanguageEligible must be ${expected}`);
}

console.log('OK MERGE-HANDOFF-CHECKSURFACE-1 boundary checks');
