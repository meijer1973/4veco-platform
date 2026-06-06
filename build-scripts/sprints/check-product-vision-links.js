#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const lessenRoot = path.resolve(root, '..', '4veco-lessen');

function fail(message) {
  console.error(`Product vision link check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

const visionMd = path.join(lessenRoot, 'specifications', 'product-vision.md');
const visionJson = path.join(lessenRoot, 'specifications', 'product-vision.json');

read(visionMd);

let data;
try {
  data = JSON.parse(read(visionJson));
} catch (error) {
  fail(`${rel(visionJson)} does not parse as JSON: ${error.message}`);
}

for (const key of [
  'schema_version',
  'vision_id',
  'strategic_pillars',
  'non_negotiable_constraints',
  'future_sprint_checklist',
]) {
  if (!(key in data)) fail(`${rel(visionJson)} missing key: ${key}`);
}

if (!Array.isArray(data.strategic_pillars) || data.strategic_pillars.length < 3) {
  fail(`${rel(visionJson)} strategic_pillars must be a non-empty array`);
}
if (!Array.isArray(data.non_negotiable_constraints) || data.non_negotiable_constraints.length < 3) {
  fail(`${rel(visionJson)} non_negotiable_constraints must be a non-empty array`);
}
if (!Array.isArray(data.future_sprint_checklist) || data.future_sprint_checklist.length < 3) {
  fail(`${rel(visionJson)} future_sprint_checklist must be a non-empty array`);
}

const requiredMentions = [
  path.join(root, 'AGENTS.md'),
  path.join(root, 'BUILD-PARAGRAPH.md'),
  path.join(root, 'AGENT_GITHUB_ENTRY.md'),
  path.join(root, 'RESEARCH_AGENT_MAP.md'),
  path.join(root, 'references', 'reference-team-roadmap.md'),
  path.join(lessenRoot, 'AGENTS.md'),
  path.join(lessenRoot, 'specifications', 'product-end-state.md'),
  path.join(lessenRoot, 'specifications', 'companion-core-specifications.md'),
  path.join(lessenRoot, 'lessen-team-roadmap.md'),
  path.join(lessenRoot, 'RESEARCH_AGENT_MAP.md'),
];

for (const file of requiredMentions) {
  const text = read(file);
  if (!text.includes('product-vision.md')) {
    fail(`${rel(file)} must mention product-vision.md`);
  }
}

console.log('OK product vision links and JSON keys');
