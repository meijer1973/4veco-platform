#!/usr/bin/env node
/**
 * check-evidence-anchors.js
 *
 * Validates the governed evidence-anchor layer and writes status reports.
 * This is intentionally small and deterministic; it does not construct the
 * R5.2 alignment graph.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DATA_FILE = path.join(REPO_ROOT, 'references/data/evidence-anchors.json');
const REPORT_MD = path.join(REPO_ROOT, 'reports/evidence-anchor-status.md');
const REPORT_JSON = path.join(REPO_ROOT, 'reports/json/evidence-anchor-status.json');

const SOURCE_LAYERS = new Set([
  'external_authority',
  'authored_judgement',
  'machine_registry',
  'human_gate_decision',
  'governance_data',
  'generated_report',
]);

const CLAIM_TYPES = new Set([
  'unit_prerequisite',
  'unit_design_decision',
  'exam_question_gap',
  'term_definition',
  'blueprint_flag_decision',
  'source_policy',
]);

const CLAIM_STATUSES = new Set(['accepted', 'review_ready', 'hold', 'rejected', 'diagnostic']);

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} evidence-anchor validation error(s).`);
  process.exit(1);
}

function rel(file) {
  return path.relative(REPO_ROOT, file).replace(/\\/g, '/');
}

function sourceExists(sourcePath) {
  return fs.existsSync(path.join(REPO_ROOT, sourcePath));
}

function validate(data) {
  const errors = [];
  if (data.schema_version !== '0.1') errors.push('schema_version must be 0.1');
  if (!Array.isArray(data.source_rank_policy) || data.source_rank_policy.length === 0) {
    errors.push('source_rank_policy must be a non-empty array');
  }
  if (!Array.isArray(data.evidence_anchors)) errors.push('evidence_anchors must be an array');
  if (!Array.isArray(data.claims)) errors.push('claims must be an array');

  const rankByLayer = new Map();
  const seenRanks = new Set();
  for (const policy of data.source_rank_policy || []) {
    if (!SOURCE_LAYERS.has(policy.source_layer)) errors.push(`unknown source_rank_policy layer: ${policy.source_layer}`);
    if (!Number.isInteger(policy.authority_rank)) errors.push(`source_rank_policy ${policy.source_layer} missing integer authority_rank`);
    if (seenRanks.has(policy.authority_rank)) errors.push(`duplicate authority_rank: ${policy.authority_rank}`);
    seenRanks.add(policy.authority_rank);
    rankByLayer.set(policy.source_layer, policy.authority_rank);
  }

  const evidenceIds = new Set();
  const sourceLayerCounts = {};
  const authorityRankCounts = {};
  let primaryCount = 0;
  let generatedReportCount = 0;

  for (const anchor of data.evidence_anchors || []) {
    if (!/^EV-[A-Z0-9.-]+$/.test(anchor.evidence_id || '')) errors.push(`invalid evidence_id: ${anchor.evidence_id}`);
    if (evidenceIds.has(anchor.evidence_id)) errors.push(`duplicate evidence_id: ${anchor.evidence_id}`);
    evidenceIds.add(anchor.evidence_id);

    if (!sourceExists(anchor.source_path)) errors.push(`${anchor.evidence_id}: source_path does not exist: ${anchor.source_path}`);
    if (!SOURCE_LAYERS.has(anchor.source_layer)) errors.push(`${anchor.evidence_id}: invalid source_layer ${anchor.source_layer}`);
    if (rankByLayer.get(anchor.source_layer) !== anchor.authority_rank) {
      errors.push(`${anchor.evidence_id}: authority_rank ${anchor.authority_rank} does not match policy for ${anchor.source_layer}`);
    }
    if (!anchor.locator || typeof anchor.locator !== 'object' || Array.isArray(anchor.locator) || Object.keys(anchor.locator).length === 0) {
      errors.push(`${anchor.evidence_id}: locator must be a non-empty object`);
    }
    if (typeof anchor.supports !== 'string' || anchor.supports.trim().length < 12) {
      errors.push(`${anchor.evidence_id}: supports must be descriptive`);
    }
    if (!['direct_record', 'manual_locator', 'scripted_extraction', 'generated_report_summary'].includes(anchor.extraction_method)) {
      errors.push(`${anchor.evidence_id}: invalid extraction_method`);
    }
    if (!['high', 'medium', 'low'].includes(anchor.confidence)) {
      errors.push(`${anchor.evidence_id}: invalid confidence`);
    }
    if (anchor.source_layer === 'generated_report') {
      generatedReportCount++;
      if (anchor.primary === true) errors.push(`${anchor.evidence_id}: generated reports cannot be primary evidence`);
    }
    if (anchor.primary === true) primaryCount++;
    sourceLayerCounts[anchor.source_layer] = (sourceLayerCounts[anchor.source_layer] || 0) + 1;
    authorityRankCounts[anchor.authority_rank] = (authorityRankCounts[anchor.authority_rank] || 0) + 1;
  }

  const claimIds = new Set();
  const claimTypeCounts = {};
  const claimStatusCounts = {};
  for (const claim of data.claims || []) {
    if (!/^CL-[A-Z0-9.-]+$/.test(claim.claim_id || '')) errors.push(`invalid claim_id: ${claim.claim_id}`);
    if (claimIds.has(claim.claim_id)) errors.push(`duplicate claim_id: ${claim.claim_id}`);
    claimIds.add(claim.claim_id);
    if (!CLAIM_TYPES.has(claim.claim_type)) errors.push(`${claim.claim_id}: invalid claim_type ${claim.claim_type}`);
    if (!CLAIM_STATUSES.has(claim.status)) errors.push(`${claim.claim_id}: invalid status ${claim.status}`);
    if (!Array.isArray(claim.evidence_ids) || claim.evidence_ids.length === 0) {
      errors.push(`${claim.claim_id}: evidence_ids must be non-empty`);
    }
    for (const evidenceId of claim.evidence_ids || []) {
      if (!evidenceIds.has(evidenceId)) errors.push(`${claim.claim_id}: missing evidence_id ${evidenceId}`);
    }
    if (claim.decision_source && !sourceExists(claim.decision_source)) {
      errors.push(`${claim.claim_id}: decision_source does not exist: ${claim.decision_source}`);
    }
    if (typeof claim.review_required_before_use !== 'boolean') {
      errors.push(`${claim.claim_id}: review_required_before_use must be boolean`);
    }
    claimTypeCounts[claim.claim_type] = (claimTypeCounts[claim.claim_type] || 0) + 1;
    claimStatusCounts[claim.status] = (claimStatusCounts[claim.status] || 0) + 1;
  }

  return {
    errors,
    summary: {
      evidence_anchor_count: (data.evidence_anchors || []).length,
      claim_count: (data.claims || []).length,
      primary_evidence_count: primaryCount,
      generated_report_anchor_count: generatedReportCount,
      by_source_layer: sourceLayerCounts,
      by_authority_rank: authorityRankCounts,
      by_claim_type: claimTypeCounts,
      by_claim_status: claimStatusCounts,
    },
  };
}

function writeReports(data, result) {
  const report = {
    schema_version: '0.1',
    sprint_id: 'R5.1',
    generated_on: new Date().toISOString().slice(0, 10),
    status: result.errors.length === 0 ? 'pass' : 'fail',
    source: rel(DATA_FILE),
    summary: result.summary,
    errors: result.errors,
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2) + '\n');

  const lines = [];
  lines.push('# Evidence Anchor Status');
  lines.push('');
  lines.push(`Generated: ${report.generated_on}`);
  lines.push(`Status: ${report.status.toUpperCase()}`);
  lines.push(`Source: \`${report.source}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Evidence anchors: ${result.summary.evidence_anchor_count}`);
  lines.push(`- Claims: ${result.summary.claim_count}`);
  lines.push(`- Primary evidence anchors: ${result.summary.primary_evidence_count}`);
  lines.push(`- Generated-report anchors: ${result.summary.generated_report_anchor_count}`);
  lines.push('');
  lines.push('## By Source Layer');
  lines.push('');
  for (const [layer, count] of Object.entries(result.summary.by_source_layer).sort()) {
    lines.push(`- ${layer}: ${count}`);
  }
  lines.push('');
  lines.push('## By Claim Type');
  lines.push('');
  for (const [type, count] of Object.entries(result.summary.by_claim_type).sort()) {
    lines.push(`- ${type}: ${count}`);
  }
  lines.push('');
  lines.push('## Errors');
  lines.push('');
  if (result.errors.length === 0) {
    lines.push('None.');
  } else {
    for (const error of result.errors) lines.push(`- ${error}`);
  }
  fs.writeFileSync(REPORT_MD, lines.join('\n').replace(/\n+$/g, '') + '\n');
}

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`missing: ${rel(DATA_FILE)}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const result = validate(data);
  writeReports(data, result);
  if (result.errors.length > 0) fail(result.errors);
  console.log(`OK  ${result.summary.evidence_anchor_count} evidence anchor(s), ${result.summary.claim_count} claim(s). Report: ${rel(REPORT_MD)}`);
}

if (require.main === module) main();

module.exports = { main, validate };
