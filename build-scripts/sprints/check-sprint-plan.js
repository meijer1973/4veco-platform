#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_HEADINGS = [
  '## Goal',
  '## Context',
  '## Allowed paths',
  '## Forbidden paths',
  '## Inputs',
  '## Outputs',
  '## Acceptance tests',
  '## Rollback plan',
  '## Human review required',
];

function fail(message) {
  console.error(`Sprint plan check failed: ${message}`);
  process.exit(1);
}

const file = process.argv[2];
if (!file) fail('missing plan path');
if (!fs.existsSync(file)) fail(`file not found: ${file}`);

const markdown = fs.readFileSync(file, 'utf8');
if (!/^# Sprint\s+\S+:/m.test(markdown)) {
  fail('missing title in form "# Sprint <id>: <name>"');
}

for (const heading of REQUIRED_HEADINGS) {
  if (!markdown.includes(heading)) fail(`missing required heading: ${heading}`);
}

if (!/```(?:bash)?[\s\S]*?node\s+build-scripts[\\/]sprints[\\/]check-sprint-/m.test(markdown)) {
  fail('acceptance tests must include at least one sprint checker command');
}

const forbiddenSection = markdown.match(/## Forbidden paths\s+([\s\S]*?)(?=\n## |$)/);
if (!forbiddenSection || !/references\/(?:machine|external)\//.test(forbiddenSection[1])) {
  fail('forbidden paths must mention protected reference surfaces');
}

console.log(`OK sprint plan: ${path.normalize(file)}`);
