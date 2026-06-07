#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DESIGN_PATH = path.join('reports', 'sprints', 'MTU-ANS-GEN-DESIGN-1-generator-proof-design.md');
const HANDOFF_PATH = path.join('reports', 'sprints', 'MTU-ANS-GEN-DESIGN-1-implementation-handoff.md');
const READINESS_PATH = path.join('reports', 'json', 'skilltree-generator-readiness.json');

const UNITS = ['A80', 'A81', 'A96', 'A97', 'A98', 'A99'];
const REQUIRED_FIELDS = [
  'Classification:',
  'Student action:',
  'Underlying dependency:',
  'Validation owner:',
  'Route behavior:',
  'Later proof:',
  'Stop condition:',
];

function fail(message) {
  console.error(`Answer-form generator design check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function section(markdown, unit) {
  const match = markdown.match(new RegExp(`### ${unit}\\s+([\\s\\S]*?)(?=\\n### |\\n## |$)`));
  return match ? match[1] : '';
}

const design = read(DESIGN_PATH);
const handoff = read(HANDOFF_PATH);
const readiness = JSON.parse(read(READINESS_PATH));

for (const unit of UNITS) {
  if (!design.includes(`| \`${unit}\` |`)) {
    fail(`design matrix missing row for ${unit}`);
  }
  const unitSection = section(design, unit);
  if (!unitSection) fail(`missing unit detail section for ${unit}`);
  for (const field of REQUIRED_FIELDS) {
    if (!unitSection.includes(field)) fail(`${unit} missing required field: ${field}`);
  }
}

const a81 = section(design, 'A81');
if (!/modifier/i.test(a81) || !/underlying answer form/i.test(a81) || /may appear as standalone|standalone route row allowed|standalone proof allowed/i.test(a81)) {
  fail('A81 must be modifier-only with an underlying answer form and no standalone route row');
}

const a99 = section(design, 'A99');
if (!/held pending live evidence/i.test(a99) || !/do not implement from generic examples alone/i.test(a99)) {
  fail('A99 must remain held pending a reviewed live evidence case');
}

for (const forbidden of [
  /diagnostics\s+authorized/i,
  /mastery\s+authorized/i,
  /Scale Gate 1\s+authorized/i,
  /product-route adoption\s+authorized/i,
  /student\/product use\s+authorized/i,
]) {
  if (forbidden.test(design) || forbidden.test(handoff)) {
    fail(`forbidden authority language matched: ${forbidden}`);
  }
}

for (const required of [
  /desktop, mobile, and dark-mode screenshots/i,
  /zero blocked leaks/i,
  /human review if any student-facing product-route adoption/i,
  /not generic skill-tree generator expansion/i,
]) {
  if (!required.test(handoff)) fail(`handoff missing required proof/boundary: ${required}`);
}

if (!readiness.summary || readiness.summary.blocked_interactive_leak_count !== 0) {
  fail('readiness summary must report zero blocked interactive leaks');
}
if (readiness.summary.blocked_route_leak_count !== 0) {
  fail('readiness summary must report zero blocked route leaks');
}

const rows = Array.isArray(readiness.rows) ? readiness.rows : [];
for (const unit of UNITS) {
  const row = rows.find((entry) => entry.unit_id === unit);
  if (!row) fail(`readiness row missing for ${unit}`);
  if (!row.generator_blocked) fail(`${unit} must remain generator-blocked during design`);
  if (row.student_facing_route_use_allowed !== false) {
    fail(`${unit} must not allow student-facing route use during design`);
  }
}

console.log('OK MTU answer-form generator design');
