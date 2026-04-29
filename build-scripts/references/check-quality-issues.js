#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update CATEGORY_VALUES only after references/schemas/quality-issue.schema.json
 *   is intentionally expanded.
 * - Keep this checker read-only. It validates governance issue logs and the
 *   authority boundary that prevents QC records from becoming curriculum proof.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LOG_PATH = 'references/data/qc/reference-quality-issues.json';
const SCHEMA_PATH = 'references/schemas/quality-issue.schema.json';
const CATEGORY_VALUES = [
  'reference_quality',
  'evidence_sufficiency',
  'unit_design',
  'extraction_integrity',
  'report_drift',
  'source_version_drift',
  'term_link_gap',
  'needs_gap',
  'production_readiness_warning',
];
const STATUSES = new Set(['open', 'blocked', 'in_review', 'deferred', 'resolved']);
const SEVERITIES = new Set(['info', 'low', 'medium', 'high', 'critical']);
const OWNERS = new Set(['references_team', 'content_strategy', 'platform_team', 'lessons_team', 'cross_team']);

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} quality issue validation error(s).`);
  process.exit(1);
}

function isDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function boundaryIsSafe(boundary) {
  return boundary &&
    boundary.internal_only === true &&
    boundary.curriculum_authority === false &&
    boundary.student_facing_exposure === false &&
    boundary.primary_evidence === false;
}

function main() {
  const errors = [];
  if (!fs.existsSync(repoPath(LOG_PATH))) errors.push(`missing ${LOG_PATH}`);
  if (!fs.existsSync(repoPath(SCHEMA_PATH))) errors.push(`missing ${SCHEMA_PATH}`);
  if (errors.length) fail(errors);

  const schema = readJson(SCHEMA_PATH);
  const log = readJson(LOG_PATH);
  const schemaCategories = schema.properties.quality_category.enum || [];
  if (JSON.stringify(schemaCategories) !== JSON.stringify(CATEGORY_VALUES)) {
    errors.push('quality-issue schema category enum does not match R8.1 category values');
  }

  if (log.schema_version !== 1) errors.push('schema_version must be 1');
  if (log.artifact_id !== 'reference-quality-issues') errors.push('artifact_id must be reference-quality-issues');
  if (!boundaryIsSafe(log.authority_boundary)) errors.push('top-level authority_boundary must be internal-only and non-authoritative');
  if (!Array.isArray(log.category_registry) || log.category_registry.length !== CATEGORY_VALUES.length) {
    errors.push('category_registry must define every R8.1 category');
  }
  const registryCategories = new Set((log.category_registry || []).map((item) => item.quality_category));
  for (const category of CATEGORY_VALUES) {
    if (!registryCategories.has(category)) errors.push(`category_registry missing ${category}`);
  }

  if (!Array.isArray(log.issues) || log.issues.length === 0) errors.push('issues must be a non-empty array');
  const seen = new Set();
  for (const [index, issue] of (log.issues || []).entries()) {
    const prefix = `issues[${index}] ${issue.issue_id || '<missing-id>'}`;
    for (const field of [
      'issue_id',
      'title',
      'quality_category',
      'status',
      'severity',
      'owner_team',
      'affected_surface',
      'evidence_refs',
      'next_action',
      'proof_required_to_close',
      'authority_boundary',
      'created_on',
    ]) {
      if (!(field in issue)) errors.push(`${prefix}: missing ${field}`);
    }
    if (seen.has(issue.issue_id)) errors.push(`${prefix}: duplicate issue_id`);
    seen.add(issue.issue_id);
    if (!CATEGORY_VALUES.includes(issue.quality_category)) errors.push(`${prefix}: invalid quality_category ${issue.quality_category}`);
    if (!STATUSES.has(issue.status)) errors.push(`${prefix}: invalid status ${issue.status}`);
    if (!SEVERITIES.has(issue.severity)) errors.push(`${prefix}: invalid severity ${issue.severity}`);
    if (!OWNERS.has(issue.owner_team)) errors.push(`${prefix}: invalid owner_team ${issue.owner_team}`);
    if (!isDate(issue.created_on)) errors.push(`${prefix}: created_on must be YYYY-MM-DD`);
    if (issue.updated_on && !isDate(issue.updated_on)) errors.push(`${prefix}: updated_on must be YYYY-MM-DD`);
    if (issue.closed_on && !isDate(issue.closed_on)) errors.push(`${prefix}: closed_on must be YYYY-MM-DD`);
    if (!boundaryIsSafe(issue.authority_boundary)) errors.push(`${prefix}: authority_boundary must be internal-only and non-authoritative`);
    if (!Array.isArray(issue.evidence_refs) || issue.evidence_refs.length === 0) {
      errors.push(`${prefix}: evidence_refs must be non-empty`);
    } else {
      for (const [evidenceIndex, evidence] of issue.evidence_refs.entries()) {
        if (!evidence.path || !evidence.role) errors.push(`${prefix}: evidence_refs[${evidenceIndex}] must include path and role`);
        if (evidence.path && !fs.existsSync(repoPath(evidence.path))) {
          errors.push(`${prefix}: evidence path does not exist: ${evidence.path}`);
        }
      }
    }
    if (typeof issue.next_action !== 'string' || issue.next_action.trim().length < 8) errors.push(`${prefix}: next_action too short`);
    if (typeof issue.proof_required_to_close !== 'string' || issue.proof_required_to_close.trim().length < 8) {
      errors.push(`${prefix}: proof_required_to_close too short`);
    }
  }

  const hasBlockingIssue = (log.issues || []).some((issue) =>
    ['blocked', 'open'].includes(issue.status) &&
    ['high', 'critical'].includes(issue.severity)
  );
  if (!hasBlockingIssue) errors.push('R8.1 seed log should preserve at least one high/critical open or blocked issue');

  if (errors.length) fail(errors);
  console.log(`OK quality issues: ${(log.issues || []).length} issue(s), ${CATEGORY_VALUES.length} categories`);
}

if (require.main === module) main();
