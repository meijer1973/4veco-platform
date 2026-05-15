#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(REPO_ROOT, 'references/data/rag/chunk_index.jsonl');
const MISCONCEPTION_REPORT = path.join(REPO_ROOT, 'reports/json/misconception-registry.json');
const UNIT_DESIGN_REPORT = path.join(REPO_ROOT, 'reports/json/unit-design-status.json');
const SOURCE_TYPES = new Set(['external_source', 'machine_unit', 'machine_term', 'exam_question', 'target_exercise', 'authored_reference', 'quality_report', 'alignment_edge', 'owned_content_edge', 'evidence_anchor']);
const AUTHORITY = new Set(['external_primary', 'machine_registry', 'authored_judgement', 'generated_report', 'diagnostic']);

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} chunk validation error(s).`);
  process.exit(1);
}

function main() {
  const errors = [];
  if (!fs.existsSync(FILE)) fail(['missing references/data/rag/chunk_index.jsonl']);
  const lines = fs.readFileSync(FILE, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  const seen = new Set();
  let previous = '';
  let generatedReportChunks = 0;
  let misconceptionReportChunk = null;
  let unitDesignReportChunk = null;
  for (const [index, line] of lines.entries()) {
    let chunk;
    try {
      chunk = JSON.parse(line);
    } catch (error) {
      errors.push(`line ${index + 1}: invalid JSON ${error.message}`);
      continue;
    }
    for (const field of ['chunk_id', 'source_path', 'source_type', 'authority_level', 'entity_ids', 'evidence_ids', 'edge_statuses', 'allowed_for_public_citation', 'curriculum_authority', 'text', 'generated_by', 'generated_on', 'source_hash']) {
      if (!(field in chunk)) errors.push(`${chunk.chunk_id || `line ${index + 1}`}: missing ${field}`);
    }
    if (seen.has(chunk.chunk_id)) errors.push(`duplicate chunk_id: ${chunk.chunk_id}`);
    seen.add(chunk.chunk_id);
    if (previous && previous.localeCompare(chunk.chunk_id) > 0) errors.push(`chunk order is not deterministic at ${chunk.chunk_id}`);
    previous = chunk.chunk_id;
    if (!SOURCE_TYPES.has(chunk.source_type)) errors.push(`${chunk.chunk_id}: invalid source_type ${chunk.source_type}`);
    if (!AUTHORITY.has(chunk.authority_level)) errors.push(`${chunk.chunk_id}: invalid authority_level ${chunk.authority_level}`);
    if (!Array.isArray(chunk.entity_ids)) errors.push(`${chunk.chunk_id}: entity_ids must be array`);
    if (!Array.isArray(chunk.evidence_ids)) errors.push(`${chunk.chunk_id}: evidence_ids must be array`);
    if (!Array.isArray(chunk.edge_statuses)) errors.push(`${chunk.chunk_id}: edge_statuses must be array`);
    if (typeof chunk.allowed_for_public_citation !== 'boolean') errors.push(`${chunk.chunk_id}: allowed_for_public_citation must be boolean`);
    if (typeof chunk.curriculum_authority !== 'boolean') errors.push(`${chunk.chunk_id}: curriculum_authority must be boolean`);
    if (typeof chunk.text !== 'string' || chunk.text.trim().length === 0) errors.push(`${chunk.chunk_id}: text must be non-empty`);
    if (chunk.authority_level === 'generated_report') {
      generatedReportChunks++;
      if (chunk.primary_evidence !== false) errors.push(`${chunk.chunk_id}: generated-report chunks must set primary_evidence=false`);
      if (chunk.curriculum_authority !== false) errors.push(`${chunk.chunk_id}: generated-report chunks must set curriculum_authority=false`);
    }
    if (chunk.chunk_id === 'quality-report:misconception-registry.json') misconceptionReportChunk = chunk;
    if (chunk.chunk_id === 'quality-report:unit-design-status.json') unitDesignReportChunk = chunk;
  }
  if (lines.length === 0) errors.push('chunk index must not be empty');
  if (generatedReportChunks === 0) errors.push('chunk index should include generated-report chunks marked non-authoritative');
  if (fs.existsSync(MISCONCEPTION_REPORT)) {
    if (!misconceptionReportChunk) {
      errors.push('chunk index should include generated misconception-registry report chunk');
    } else {
      if (misconceptionReportChunk.authority_level !== 'generated_report') {
        errors.push('misconception-registry report chunk must be generated_report authority');
      }
      if (misconceptionReportChunk.primary_evidence !== false) {
        errors.push('misconception-registry report chunk must set primary_evidence=false');
      }
      if (misconceptionReportChunk.curriculum_authority !== false) {
        errors.push('misconception-registry report chunk must set curriculum_authority=false');
      }
      if (!/diagnostic_design_context/.test(misconceptionReportChunk.text)) {
        errors.push('misconception-registry report chunk must preserve diagnostic_design_context label');
      }
    }
  }
  if (fs.existsSync(UNIT_DESIGN_REPORT)) {
    if (!unitDesignReportChunk) {
      errors.push('chunk index should include generated unit-design-status report chunk');
    } else {
      if (unitDesignReportChunk.authority_level !== 'generated_report') {
        errors.push('unit-design-status report chunk must be generated_report authority');
      }
      if (unitDesignReportChunk.primary_evidence !== false) {
        errors.push('unit-design-status report chunk must set primary_evidence=false');
      }
      if (unitDesignReportChunk.curriculum_authority !== false) {
        errors.push('unit-design-status report chunk must set curriculum_authority=false');
      }
      if (!/internal_design_status/.test(unitDesignReportChunk.text)) {
        errors.push('unit-design-status report chunk must preserve internal_design_status label');
      }
      if (!/promotion_blocked_count/.test(unitDesignReportChunk.text)) {
        errors.push('unit-design-status report chunk must preserve promotion_blocked_count label');
      }
    }
  }
  if (errors.length) fail(errors);
  console.log(`OK chunk index: ${lines.length} chunk(s), ${generatedReportChunks} generated-report chunk(s)`);
}

if (require.main === module) main();
