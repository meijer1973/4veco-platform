#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const AUDIT_PATH = 'references/data/audits/empty-needs-audit.json';
const REPORT_PATH = 'reports/reference-audits/empty-needs-audit.md';

function fail(message) {
  console.error(`Empty-needs audit check failed: ${message}`);
  process.exit(1);
}

function readJson(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(full)) fail(`missing ${relPath}`);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function isDeprecated(unit) {
  return unit.deprecated === true || unit.status === 'deprecated';
}

function main() {
  const units = readJson(UNITS_PATH);
  const audit = readJson(AUDIT_PATH);
  if (!fs.existsSync(path.join(REPO_ROOT, REPORT_PATH))) fail(`missing ${REPORT_PATH}`);

  const expected = units.filter((unit) => !isDeprecated(unit) && (unit.needs || []).length === 0);
  if (audit.empty_needs_count !== expected.length) {
    fail(`expected ${expected.length} empty-needs units, got ${audit.empty_needs_count}`);
  }
  const auditIds = new Set(audit.entries.map((entry) => entry.unit_id));
  for (const unit of expected) {
    if (!auditIds.has(unit.id)) fail(`missing audited unit ${unit.id}`);
  }
  for (const entry of audit.entries) {
    for (const field of ['unit_id', 'recommended_status', 'recommended_needs', 'severity', 'review_status', 'rationale']) {
      if (entry[field] === undefined || entry[field] === null) fail(`${entry.unit_id} missing ${field}`);
    }
    if (!Array.isArray(entry.recommended_needs)) fail(`${entry.unit_id} recommended_needs must be array`);
    if (entry.review_status !== 'machine_suggested') fail(`${entry.unit_id} should remain machine_suggested in R2.1`);
  }
  console.log(`OK empty-needs audit: ${audit.entries.length} entries`);
}

if (require.main === module) main();
