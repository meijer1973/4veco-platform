#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-R2-empty-needs';
const REQUIRED = [
  'subagent-pedagogy.json',
  'subagent-data-integrity.json',
  'subagent-evidence.json',
  'review-packet.md',
];

function fail(message) {
  console.error(`Empty-needs review check failed: ${message}`);
  process.exit(1);
}

function main() {
  for (const name of REQUIRED) {
    const full = path.join(REPO_ROOT, GATE_DIR, name);
    if (!fs.existsSync(full)) fail(`missing ${GATE_DIR}/${name}`);
  }
  for (const name of REQUIRED.filter((name) => name.endsWith('.json'))) {
    const rel = path.join(GATE_DIR, name).replace(/\\/g, '/');
    const review = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8'));
    for (const field of ['gate_id', 'sprint_id', 'reviewer', 'status', 'findings', 'human_questions', 'residual_risks']) {
      if (review[field] === undefined) fail(`${rel} missing ${field}`);
    }
    if (review.gate_id !== 'GATE-R2-empty-needs') fail(`${rel} has wrong gate_id`);
    if (review.sprint_id !== 'R2.2') fail(`${rel} has wrong sprint_id`);
    if (!Array.isArray(review.findings) || review.findings.length === 0) fail(`${rel} needs findings`);
  }
  const packet = fs.readFileSync(path.join(REPO_ROOT, GATE_DIR, 'review-packet.md'), 'utf8');
  if (!packet.includes('Human Review Required')) fail('review packet must contain Human Review Required section');
  console.log('OK empty-needs review packet');
}

if (require.main === module) main();
