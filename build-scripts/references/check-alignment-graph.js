#!/usr/bin/env node
/**
 * check-alignment-graph.js
 *
 * Validates the R5.2 alignment graph projection and writes integrity reports.
 * The graph remains draft-only until the R5.3 human review gate closes.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GRAPH_FILE = path.join(REPO_ROOT, 'references/data/alignment-graph.json');
const EVIDENCE_FILE = path.join(REPO_ROOT, 'references/data/evidence-anchors.json');
const REPORT_MD = path.join(REPO_ROOT, 'reports/alignment-graph-integrity.md');
const REPORT_JSON = path.join(REPO_ROOT, 'reports/json/alignment-graph-integrity.json');

const RELATIONS = new Set(['prerequisite', 'supports', 'assesses', 'explains', 'contradicts', 'derived_from']);
const STRENGTHS = new Set(['strong', 'medium', 'weak', 'diagnostic']);
const REVIEW_STATUSES = new Set(['pending_r5_3_review', 'human_approved', 'rejected', 'diagnostic_only']);

function rel(file) {
  return path.relative(REPO_ROOT, file).replace(/\\/g, '/');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const value = selector(item);
    if (Array.isArray(value)) {
      for (const inner of value) counts[inner] = (counts[inner] || 0) + 1;
    } else {
      counts[value] = (counts[value] || 0) + 1;
    }
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function validate(graph, evidenceData) {
  const errors = [];
  const evidenceById = new Map((evidenceData.evidence_anchors || []).map((item) => [item.evidence_id, item]));
  const claimsById = new Map((evidenceData.claims || []).map((claim) => [claim.claim_id, claim]));

  if (graph.schema_version !== '0.1') errors.push('schema_version must be 0.1');
  if (graph.sprint_id !== 'R5.2') errors.push('sprint_id must be R5.2');
  if (graph.graph_status !== 'draft_pending_r5_3_review') {
    errors.push('graph_status must be draft_pending_r5_3_review');
  }
  if (graph.source !== 'references/data/evidence-anchors.json') {
    errors.push('source must be references/data/evidence-anchors.json');
  }
  if (!Array.isArray(graph.edges)) errors.push('edges must be an array');
  if (graph.edge_count !== (graph.edges || []).length) {
    errors.push(`edge_count ${graph.edge_count} does not match edge array length ${(graph.edges || []).length}`);
  }

  const edgeIds = new Set();
  let humanApprovedCount = 0;
  let generatedReportEdgeCount = 0;
  let pendingMainEdgeCount = 0;

  for (const edge of graph.edges || []) {
    if (!/^EDGE-[A-Z0-9.-]+$/.test(edge.edge_id || '')) errors.push(`invalid edge_id: ${edge.edge_id}`);
    if (edgeIds.has(edge.edge_id)) errors.push(`duplicate edge_id: ${edge.edge_id}`);
    edgeIds.add(edge.edge_id);

    if (!/^[a-z_]+:.+/.test(edge.from || '')) errors.push(`${edge.edge_id}: invalid from node ${edge.from}`);
    if (!/^[a-z_]+:.+/.test(edge.to || '')) errors.push(`${edge.edge_id}: invalid to node ${edge.to}`);
    if (!RELATIONS.has(edge.relation)) errors.push(`${edge.edge_id}: invalid relation ${edge.relation}`);
    if (!STRENGTHS.has(edge.strength)) errors.push(`${edge.edge_id}: invalid strength ${edge.strength}`);
    if (!REVIEW_STATUSES.has(edge.review_status)) errors.push(`${edge.edge_id}: invalid review_status ${edge.review_status}`);
    if (edge.review_status === 'human_approved') humanApprovedCount++;
    if (!Array.isArray(edge.evidence_ids) || edge.evidence_ids.length === 0) {
      errors.push(`${edge.edge_id}: evidence_ids must be non-empty`);
    }
    if (!Array.isArray(edge.source_layers)) errors.push(`${edge.edge_id}: source_layers must be an array`);
    if (!claimsById.has(edge.claim_id)) errors.push(`${edge.edge_id}: missing claim_id ${edge.claim_id}`);

    const claim = claimsById.get(edge.claim_id);
    const claimEvidenceIds = new Set((claim && claim.evidence_ids) || []);
    for (const evidenceId of edge.evidence_ids || []) {
      if (!evidenceById.has(evidenceId)) errors.push(`${edge.edge_id}: missing evidence_id ${evidenceId}`);
      if (!claimEvidenceIds.has(evidenceId)) errors.push(`${edge.edge_id}: evidence_id ${evidenceId} not attached to ${edge.claim_id}`);
    }

    const edgeSources = (edge.evidence_ids || []).map((id) => evidenceById.get(id)).filter(Boolean);
    if (edgeSources.some((anchor) => anchor.source_layer === 'generated_report')) generatedReportEdgeCount++;
    if (edge.review_status === 'diagnostic_only' && !edgeSources.some((anchor) => anchor.source_layer === 'generated_report')) {
      errors.push(`${edge.edge_id}: diagnostic_only status is reserved for generated-report traceability`);
    }
    if (edge.review_status === 'pending_r5_3_review' && edge.relation !== 'derived_from') pendingMainEdgeCount++;
    if (edge.relation !== 'derived_from' && edge.review_status !== 'pending_r5_3_review') {
      errors.push(`${edge.edge_id}: non-traceability edges must remain pending R5.3 review`);
    }
  }

  if (humanApprovedCount > 0) errors.push('R5.2 graph must not contain human_approved edges');
  if (pendingMainEdgeCount === 0) errors.push('graph must contain pending main alignment edges');

  return {
    errors,
    summary: {
      edge_count: (graph.edges || []).length,
      claim_count: claimsById.size,
      evidence_anchor_count: evidenceById.size,
      human_approved_edge_count: humanApprovedCount,
      generated_report_edge_count: generatedReportEdgeCount,
      pending_main_edge_count: pendingMainEdgeCount,
      by_relation: countBy(graph.edges || [], (edge) => edge.relation),
      by_review_status: countBy(graph.edges || [], (edge) => edge.review_status),
      by_strength: countBy(graph.edges || [], (edge) => edge.strength),
      by_source_layer: countBy(graph.edges || [], (edge) => edge.source_layers || []),
    },
  };
}

function writeReports(result) {
  const report = {
    schema_version: '0.1',
    sprint_id: 'R5.2',
    generated_on: new Date().toISOString().slice(0, 10),
    status: result.errors.length === 0 ? 'pass' : 'fail',
    source: rel(GRAPH_FILE),
    evidence_source: rel(EVIDENCE_FILE),
    summary: result.summary,
    errors: result.errors,
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2) + '\n');

  const lines = [];
  lines.push('# Alignment Graph Integrity');
  lines.push('');
  lines.push(`Generated: ${report.generated_on}`);
  lines.push(`Status: ${report.status.toUpperCase()}`);
  lines.push(`Source: \`${report.source}\``);
  lines.push(`Evidence source: \`${report.evidence_source}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Edges: ${result.summary.edge_count}`);
  lines.push(`- Claims: ${result.summary.claim_count}`);
  lines.push(`- Evidence anchors: ${result.summary.evidence_anchor_count}`);
  lines.push(`- Pending main alignment edges: ${result.summary.pending_main_edge_count}`);
  lines.push(`- Human-approved edges: ${result.summary.human_approved_edge_count}`);
  lines.push('');
  lines.push('## By Relation');
  lines.push('');
  for (const [relation, count] of Object.entries(result.summary.by_relation)) lines.push(`- ${relation}: ${count}`);
  lines.push('');
  lines.push('## By Review Status');
  lines.push('');
  for (const [status, count] of Object.entries(result.summary.by_review_status)) lines.push(`- ${status}: ${count}`);
  lines.push('');
  lines.push('## By Source Layer');
  lines.push('');
  for (const [layer, count] of Object.entries(result.summary.by_source_layer)) lines.push(`- ${layer}: ${count}`);
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
  if (!fs.existsSync(GRAPH_FILE)) {
    console.error(`missing: ${rel(GRAPH_FILE)}`);
    process.exit(1);
  }
  if (!fs.existsSync(EVIDENCE_FILE)) {
    console.error(`missing: ${rel(EVIDENCE_FILE)}`);
    process.exit(1);
  }

  const graph = readJson(GRAPH_FILE);
  const evidenceData = readJson(EVIDENCE_FILE);
  const result = validate(graph, evidenceData);
  writeReports(result);

  if (result.errors.length > 0) {
    for (const error of result.errors) console.error(`ERROR  ${error}`);
    console.error(`${result.errors.length} alignment graph validation error(s).`);
    process.exit(1);
  }

  console.log(`OK  ${result.summary.edge_count} alignment edge(s). Report: ${rel(REPORT_MD)}`);
}

if (require.main === module) main();

module.exports = { main, validate };
