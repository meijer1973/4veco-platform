#!/usr/bin/env node
/**
 * validate-report-json.js
 *
 * Validates the normalized JSON-first report contract.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const JSON_DIR = path.join(REPO_ROOT, 'reports/json');
const REQUIRED = [
  'dag-integrity',
  'terminology-drift',
  'unresolved-refs',
  'needs-coverage',
  'terms-coverage',
  'procedure-coverage',
  'aspects-coverage',
  'dead-units',
  'begrippen-coverage',
  'empty-needs-audit-summary',
];
const STATUSES = new Set(['pass', 'warn', 'fail', 'info']);
const SEVERITIES = new Set(['info', 'low', 'medium', 'high', 'critical']);

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} report JSON validation error(s).`);
  process.exit(1);
}

function isIso(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(Date.parse(value));
}

function validateReport(report, file) {
  const errors = [];
  for (const field of ['report_id', 'generated_by', 'generated_on', 'source_files', 'schema_version', 'status', 'issues']) {
    if (!(field in report)) errors.push(`${file}: missing ${field}`);
  }
  if (!/^[a-z0-9.-]+$/.test(report.report_id || '')) errors.push(`${file}: invalid report_id`);
  if (typeof report.generated_by !== 'string' || report.generated_by.length === 0) errors.push(`${file}: generated_by must be string`);
  if (!isIso(report.generated_on)) errors.push(`${file}: generated_on must be ISO date`);
  if (!Array.isArray(report.source_files)) errors.push(`${file}: source_files must be array`);
  if (report.schema_version !== 1) errors.push(`${file}: schema_version must be 1`);
  if (!STATUSES.has(report.status)) errors.push(`${file}: invalid status ${report.status}`);
  if (!Array.isArray(report.issues)) errors.push(`${file}: issues must be array`);

  for (const [index, issue] of (report.issues || []).entries()) {
    for (const field of ['issue_id', 'severity', 'affected_entity', 'category', 'evidence_path', 'next_action', 'proof_required_to_close']) {
      if (!(field in issue)) errors.push(`${file}: issues[${index}] missing ${field}`);
    }
    if (!SEVERITIES.has(issue.severity)) errors.push(`${file}: issues[${index}] invalid severity ${issue.severity}`);
    for (const field of ['issue_id', 'affected_entity', 'category', 'evidence_path', 'next_action', 'proof_required_to_close']) {
      if (typeof issue[field] !== 'string' || issue[field].trim().length === 0) {
        errors.push(`${file}: issues[${index}].${field} must be non-empty string`);
      }
    }
  }

  return errors;
}

function main() {
  const errors = [];
  for (const id of REQUIRED) {
    const file = path.join(JSON_DIR, `${id}.json`);
    if (!fs.existsSync(file)) {
      errors.push(`missing reports/json/${id}.json`);
      continue;
    }
    const report = JSON.parse(fs.readFileSync(file, 'utf8'));
    errors.push(...validateReport(report, `reports/json/${id}.json`));
    const markdown = path.join(REPO_ROOT, 'reports/markdown', `${id}.md`);
    if (!fs.existsSync(markdown)) errors.push(`missing reports/markdown/${id}.md`);
  }
  if (errors.length) fail(errors);
  console.log(`OK report JSON contract: ${REQUIRED.length} report(s)`);
}

if (require.main === module) main();
