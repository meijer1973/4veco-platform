#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNIT_SCHEMA = path.join(REPO_ROOT, 'references', 'schemas', 'unit.schema.json');
const REVIEW_SCHEMA = path.join(REPO_ROOT, 'references', 'schemas', 'prior-knowledge-review.schema.json');

function fail(message) {
  console.error(`Prior-knowledge schema validation failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing ${path.relative(REPO_ROOT, file)}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main() {
  const unit = readJson(UNIT_SCHEMA);
  const review = readJson(REVIEW_SCHEMA);
  const unitProps = unit.properties || {};
  for (const field of ['assumed_prior_knowledge', 'zero_needs_status', 'zero_needs_review']) {
    if (!unitProps[field]) fail(`unit schema missing ${field}`);
  }
  const statuses = unitProps.zero_needs_status.enum || [];
  for (const value of ['true_zero', 'underbouw_assumed', 'false_zero', 'ambiguous', 'not_reviewed']) {
    if (!statuses.includes(value)) fail(`unit schema missing zero_needs_status ${value}`);
  }
  if (!review.properties || !review.properties.recommended_status) fail('review schema missing recommended_status');
  if (!review.required.includes('human_question')) {
    console.log('OK prior-knowledge schema: human_question is optional');
  }
  console.log('OK prior-knowledge schema extension');
}

if (require.main === module) main();
