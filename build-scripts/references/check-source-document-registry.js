#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Extend REQUIRED_DOCUMENT_IDS when evidence anchors or gates begin citing
 *   new stable source-document IDs.
 * - Keep source/evidence boundary checks explicit.
 * - This checker must fail if Sprint 6 accidentally creates a hand-maintained
 *   references/machine source-document registry.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = 'references/data/source-document-registry.json';
const REPORT_JSON_PATH = 'reports/json/source-document-registry.json';
const REPORT_MD_PATH = 'reports/markdown/source-document-registry.md';
const MACHINE_REGISTRY_PATH = 'references/machine/source-document-registry.json';
const EVIDENCE_ANCHORS_PATH = 'references/data/evidence-anchors.json';
const SCHEMA_PATH = 'references/schemas/source-document.schema.json';

const REQUIRED_RECORD_FIELDS = [
  'document_id',
  'path',
  'title',
  'source_type',
  'authority_level',
  'source_version',
  'status',
  'owner',
  'citation_policy',
  'public_citation_policy',
];

function fail(message) {
  console.error(`Source document registry check failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function main() {
  if (!exists(REGISTRY_PATH)) fail(`missing ${REGISTRY_PATH}`);
  if (!exists(REPORT_JSON_PATH)) fail(`missing ${REPORT_JSON_PATH}`);
  if (!exists(REPORT_MD_PATH)) fail(`missing ${REPORT_MD_PATH}`);
  if (exists(MACHINE_REGISTRY_PATH)) fail(`unexpected machine registry ${MACHINE_REGISTRY_PATH}`);

  const schema = readJson(SCHEMA_PATH);
  const required = new Set(schema.required || []);
  for (const field of REQUIRED_RECORD_FIELDS) {
    if (!required.has(field)) fail(`${SCHEMA_PATH} must require ${field}`);
  }

  const registry = readJson(REGISTRY_PATH);
  const report = readJson(REPORT_JSON_PATH);
  const evidence = readJson(EVIDENCE_ANCHORS_PATH);

  if (registry.schema_version !== 1) fail('schema_version must be 1');
  if (registry.registry_id !== 'source-document-registry') fail('registry_id must be source-document-registry');
  if (!registry.storage_decision) fail('missing storage_decision');
  if (registry.storage_decision.registry_location !== REGISTRY_PATH) fail('storage_decision must point to references/data registry');
  if (registry.storage_decision.machine_registry_created !== false) fail('machine_registry_created must be false');
  if (!Array.isArray(registry.records) || registry.records.length < 30) fail('expected at least 30 source document records');

  const ids = new Set();
  const paths = new Set();
  for (const [index, record] of registry.records.entries()) {
    for (const field of REQUIRED_RECORD_FIELDS) {
      if (record[field] === undefined || record[field] === null || record[field] === '') {
        fail(`records[${index}] missing ${field}`);
      }
    }
    if (ids.has(record.document_id)) fail(`duplicate document_id ${record.document_id}`);
    ids.add(record.document_id);
    if (paths.has(record.path)) fail(`duplicate path ${record.path}`);
    paths.add(record.path);
    if (!exists(record.path)) fail(`${record.document_id} path does not exist: ${record.path}`);

    if (record.path.startsWith('references/machine/') && record.edit_policy !== 'cli_only') {
      fail(`${record.document_id} machine record must have cli_only edit policy`);
    }
    if (record.path.startsWith('references/external/') && record.edit_policy !== 'external_refresh_only') {
      fail(`${record.document_id} external record must have external_refresh_only edit policy`);
    }
    if ((record.status === 'generated_diagnostic' || record.authority_level === 'generated_report') && record.primary_evidence !== false) {
      fail(`${record.document_id} generated diagnostic must not be primary evidence`);
    }
    if ((record.status === 'generated_diagnostic' || record.authority_level === 'generated_report') && record.curriculum_authority !== false) {
      fail(`${record.document_id} generated diagnostic must not be curriculum authority`);
    }
    if (record.authority_level !== 'external_primary' && record.blocked_downstream_uses && !record.blocked_downstream_uses.includes('external_authority')) {
      fail(`${record.document_id} non-external record must block external_authority`);
    }
    if (!Array.isArray(record.allowed_downstream_uses) || !Array.isArray(record.blocked_downstream_uses)) {
      fail(`${record.document_id} must include allowed and blocked downstream uses`);
    }
  }

  const evidenceDocumentIds = [...new Set((evidence.evidence_anchors || []).map((anchor) => anchor.document_id))];
  for (const documentId of evidenceDocumentIds) {
    if (!ids.has(documentId)) fail(`missing evidence-anchor document_id ${documentId}`);
  }

  for (const anchor of evidence.evidence_anchors || []) {
    if (!paths.has(anchor.source_path)) fail(`missing evidence-anchor source_path ${anchor.source_path}`);
  }

  if (!registry.summary || registry.summary.evidence_anchor_coverage.missing_document_ids.length !== 0) {
    fail('evidence anchor coverage must have zero missing document IDs');
  }
  if (registry.summary.generated_reports_not_primary_evidence !== true) {
    fail('generated_reports_not_primary_evidence summary must be true');
  }
  if (report.status !== 'pass') fail(`${REPORT_JSON_PATH} status must be pass`);
  if (report.summary.record_count !== registry.records.length) {
    fail(`${REPORT_JSON_PATH} record count must match registry`);
  }

  const markdown = fs.readFileSync(repoPath(REPORT_MD_PATH), 'utf8');
  for (const phrase of ['Storage Decision', 'Evidence Anchor Coverage', 'Critical Records', 'Generated diagnostics']) {
    if (!markdown.includes(phrase)) fail(`${REPORT_MD_PATH} missing phrase: ${phrase}`);
  }

  console.log(`OK source document registry: ${registry.records.length} records`);
}

if (require.main === module) main();
