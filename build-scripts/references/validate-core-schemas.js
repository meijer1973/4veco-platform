#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SCHEMA_DIR = path.join(REPO_ROOT, 'references', 'schemas');
const REQUIRED = [
  'unit.schema.json',
  'term.schema.json',
  'exam-question.schema.json',
  'target-exercise.schema.json',
  'syllabus-code.schema.json',
  'source-document.schema.json',
  'evidence-anchor.schema.json',
  'claim.schema.json',
  'alignment-edge.schema.json',
  'quality-issue.schema.json',
  'report.schema.json',
  'rag-chunk.schema.json',
  'feedback.schema.json',
  'misconception.schema.json',
  'worked-example.schema.json',
  'game-item.schema.json',
  'simulation.schema.json',
];

function fail(message) {
  console.error(`Core schema validation failed: ${message}`);
  process.exit(1);
}

function main() {
  if (!fs.existsSync(SCHEMA_DIR)) fail('missing references/schemas/');
  for (const file of REQUIRED) {
    const full = path.join(SCHEMA_DIR, file);
    if (!fs.existsSync(full)) fail(`missing ${file}`);
    const schema = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') fail(`${file} missing draft 2020-12 marker`);
    if (!schema.$id || !schema.$id.includes(file)) fail(`${file} missing useful $id`);
    if (schema.type !== 'object') fail(`${file} must describe an object`);
    if (!schema.properties || typeof schema.properties !== 'object') fail(`${file} missing properties`);
    if (!Array.isArray(schema.required)) fail(`${file} missing required array`);
    if (schema.additionalProperties !== false) fail(`${file} must set additionalProperties:false`);
  }
  console.log(`OK core schemas: ${REQUIRED.length} files`);
}

if (require.main === module) main();
