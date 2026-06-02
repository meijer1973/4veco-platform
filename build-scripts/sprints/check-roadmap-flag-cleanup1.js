#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const platformRoadmap = fs.readFileSync(
  path.join(root, 'references/reference-team-roadmap.md'),
  'utf8'
);
const lessonRoadmap = fs.readFileSync(
  path.join(root, '..', '4veco-lessen', 'lessen-team-roadmap.md'),
  'utf8'
);

const failures = [];

function requireText(name, text, expected) {
  if (!text.includes(expected)) {
    failures.push(`${name} missing expected text: ${expected}`);
  }
}

function forbidText(name, text, forbidden) {
  if (text.includes(forbidden)) {
    failures.push(`${name} still contains forbidden text: ${forbidden}`);
  }
}

for (const [name, text] of [
  ['platform roadmap', platformRoadmap],
  ['lesson roadmap', lessonRoadmap]
]) {
  requireText(name, text, 'A flag blocks only the claim or authority it names.');
  requireText(
    name,
    text,
    'Route-specific rendered proof required before product-route adoption.'
  );
  requireText(
    name,
    text,
    'Many-to-one matching unsupported; conditional capability note only.'
  );
  requireText(name, text, 'Historical archive remains read-only.');
  requireText(
    name,
    text,
    'GATE-TASK-FAMILY-1 | Structured Choice And Construction Task-Family Review'
  );
  forbidText(
    name,
    text,
    'GATE-TASK-FAMILY-1 | Structured Choice And Construction Task-Family Review | no'
  );
}

forbidText(
  'lesson roadmap',
  lessonRoadmap,
  'open Product Proof Track:\n  GATE-TASK-FAMILY-1'
);
forbidText(
  'lesson roadmap',
  lessonRoadmap,
  'Complete the remaining\n  Product Proof Track\n  through GATE-TASK-FAMILY-1'
);

if (failures.length) {
  console.error('ROADMAP-FLAG-CLEANUP-1 check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('ROADMAP-FLAG-CLEANUP-1 check OK');
