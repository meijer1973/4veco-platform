#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REQUIRED_HEADINGS = [
  '## Goal',
  '## Context',
  '## Quality Standard',
  '## Specification Fulfilment Matrix',
  '## Quality Improvement Candidates',
  '## Allowed paths',
  '## Forbidden paths',
  '## Inputs',
  '## Outputs',
  '## Operationalized sprint procedure',
  '## Acceptance tests',
  '## Proof Required to Close',
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

const scopeLanguageResult = spawnSync(
  process.execPath,
  [path.join(__dirname, 'check-scope-language.js'), file],
  { cwd: process.cwd(), encoding: 'utf8' }
);
if (scopeLanguageResult.status !== 0) {
  process.stderr.write(scopeLanguageResult.stdout || '');
  process.stderr.write(scopeLanguageResult.stderr || '');
  fail('scope-language checker failed');
}

const markdown = fs.readFileSync(file, 'utf8');
if (!/^# Sprint\s+\S+:/m.test(markdown)) {
  fail('missing title in form "# Sprint <id>: <name>"');
}

for (const heading of REQUIRED_HEADINGS) {
  if (!markdown.includes(heading)) fail(`missing required heading: ${heading}`);
}

function section(heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1].trim() : '';
}

const qualitySection = section('## Quality Standard');
for (const term of [
  'specification',
  'quality floor',
  'rendered output',
  'student-facing',
  'proof',
  'follow-up',
]) {
  if (!new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(qualitySection)) {
    fail(`Quality Standard must mention ${term}`);
  }
}

const fulfilmentMatrix = section('## Specification Fulfilment Matrix');
if (!/\|\s*Specification requirement\s*\|\s*Implementation evidence required\s*\|\s*Review\/proof required\s*\|\s*Status\s*\|/i.test(fulfilmentMatrix)) {
  fail('Specification Fulfilment Matrix must include requirement/evidence/review-proof/status columns');
}
if ((fulfilmentMatrix.match(/^\|/gm) || []).length < 3) {
  fail('Specification Fulfilment Matrix must include at least one concrete requirement row');
}

const improvementSection = section('## Quality Improvement Candidates');
for (const label of ['include_now', 'defer_named_follow_up', 'reject_scope_creep']) {
  if (!improvementSection.includes(label)) {
    fail(`Quality Improvement Candidates must classify ${label}`);
  }
}

const proofSection = section('## Proof Required to Close');
if (!/proof/i.test(proofSection) || !/close/i.test(proofSection) || !/review|validator|test/i.test(proofSection)) {
  fail('Proof Required to Close must name closure proof and review/validator/test evidence');
}

if (!/```(?:bash)?[\s\S]*?node\s+build-scripts[\\/]sprints[\\/]check-sprint-/m.test(markdown)) {
  fail('acceptance tests must include at least one sprint checker command');
}
if (!/^# Sprint EXAMPLE:/m.test(markdown) && !/```(?:bash)?[\s\S]*?node\s+build-scripts[\\/]sprints[\\/]check-sprint-bundle\.js\s+\S+/m.test(markdown)) {
  fail('acceptance tests must include the deterministic sprint bundle checker');
}

const procedureSection = markdown.match(/## Operationalized sprint procedure\s+([\s\S]*?)(?=\n## |$)/);
if (!procedureSection || procedureSection[1].trim().length < 120) {
  fail('operationalized sprint procedure must contain concrete execution steps');
}
if (!/stop|human review|decision|validator|acceptance/i.test(procedureSection[1])) {
  fail('operationalized sprint procedure must include decision/stop/review/validator details');
}
const procedure = procedureSection[1];
const stepCount = (procedure.match(/^\s*(?:\d+\.|-)\s+/gm) || []).length;
if (stepCount < 3) {
  fail('operationalized sprint procedure must include at least three explicit steps');
}

const isGatePlan = /(?:human-interview\.md|gate-closure\.json|Human Review And Gate Closure)/i.test(markdown);
if (isGatePlan) {
  const requiredGateTerms = [
    ['calibration questions', /calibration question/i],
    ['answer recording', /record.*answer|answer.*record/i],
    ['pattern analysis', /analy[sz]e.*pattern|pattern analysis/i],
    ['targeted follow-ups', /targeted follow-up|follow-ups/i],
    ['closure proposal', /closure proposal/i],
    ['explicit human confirmation', /explicit human confirmation|explicit confirmation/i],
  ];
  for (const [label, pattern] of requiredGateTerms) {
    if (!pattern.test(procedure)) {
      fail(`human gate procedure must include ${label}`);
    }
  }
}

const forbiddenSection = markdown.match(/## Forbidden paths\s+([\s\S]*?)(?=\n## |$)/);
if (!forbiddenSection || !/references\/(?:machine|external)\//.test(forbiddenSection[1])) {
  fail('forbidden paths must mention protected reference surfaces');
}

console.log(`OK sprint plan: ${path.normalize(file)}`);
