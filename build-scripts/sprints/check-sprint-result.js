#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_HEADINGS = [
  '## Plan reference',
  '## Summary',
  '## Acceptance test results',
  '## Changed files',
  '## Data integrity notes',
  '## Open follow-ups',
  '## Rollback instructions',
];

function fail(message) {
  console.error(`Sprint result check failed: ${message}`);
  process.exit(1);
}

const file = process.argv[2];
if (!file) fail('missing result path');
if (!fs.existsSync(file)) fail(`file not found: ${file}`);

const markdown = fs.readFileSync(file, 'utf8');
if (!/^# Sprint\s+\S+:\s+Result/m.test(markdown)) {
  fail('missing title in form "# Sprint <id>: Result"');
}

for (const heading of REQUIRED_HEADINGS) {
  if (!markdown.includes(heading)) fail(`missing required heading: ${heading}`);
}

const planMatch = markdown.match(/## Plan reference\s+([\s\S]*?)(?=\n## |$)/);
if (!planMatch) fail('missing plan reference section');
const planPathMatch = planMatch[1].match(/`([^`]+-plan\.md)`/);
if (!planPathMatch) fail('plan reference must include a backticked *-plan.md path');
const planPath = planPathMatch[1];
if (!fs.existsSync(planPath)) fail(`referenced plan does not exist: ${planPath}`);

const dataNotes = markdown.match(/## Data integrity notes\s+([\s\S]*?)(?=\n## |$)/);
if (!dataNotes || !/protected reference data|No protected reference data|references\/machine|references\/external/i.test(dataNotes[1])) {
  fail('data integrity notes must mention protected reference data status');
}

console.log(`OK sprint result: ${path.normalize(file)}`);
