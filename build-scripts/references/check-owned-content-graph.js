#!/usr/bin/env node
/**
 * Validates the R9.2 owned-content projection graph.
 *
 * This protects the CP-2 condition that owned-source edges are projection by
 * default and generated artifacts never become primary evidence.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GRAPH_PATH = 'references/data/owned-content-graph.json';
const REPORT_JSON_PATH = 'reports/json/owned-content-coverage.json';

const EDGE_TYPES = new Set(['projection', 'owned_exercise_evidence', 'implementation_trace']);
const EVIDENCE_ALLOWED_SURFACES = new Set(['target_exercise_index', 'opgaven_markdown']);
const GENERATED_STATUSES = new Set(['generated_projection', 'implementation_output']);

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} owned-content graph validation error(s).`);
  process.exit(1);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function countBy(items, field) {
  const out = {};
  for (const item of items) out[item[field]] = (out[item[field]] || 0) + 1;
  return out;
}

function main() {
  const errors = [];
  if (!fs.existsSync(repoPath(GRAPH_PATH))) fail([`missing ${GRAPH_PATH}`]);
  if (!fs.existsSync(repoPath(REPORT_JSON_PATH))) fail([`missing ${REPORT_JSON_PATH}`]);
  const graph = readJson(GRAPH_PATH);
  const report = readJson(REPORT_JSON_PATH);

  if (graph.schema_version !== 1) errors.push('schema_version must be 1');
  if (graph.graph_id !== 'owned-content-graph') errors.push('graph_id must be owned-content-graph');
  if (graph.sprint_id !== 'R9.2') errors.push('sprint_id must be R9.2');
  if (graph.cp2_gate_status !== 'pass_with_conditions') errors.push('cp2_gate_status must be pass_with_conditions');
  if (!graph.policy || graph.policy.default_edge_type_for_owned_sources !== 'projection') {
    errors.push('policy.default_edge_type_for_owned_sources must be projection');
  }
  if (graph.policy && graph.policy.generated_artifacts_are_primary_evidence !== false) {
    errors.push('generated_artifacts_are_primary_evidence must be false');
  }
  if (!Array.isArray(graph.edges)) errors.push('edges must be an array');
  if (graph.edge_count !== (graph.edges || []).length) errors.push('edge_count mismatch');

  const seen = new Set();
  let projectionCount = 0;
  let evidenceCount = 0;
  let implementationTraceCount = 0;
  let generatedWarningCount = 0;
  for (const edge of graph.edges || []) {
    if (!edge.edge_id || seen.has(edge.edge_id)) errors.push(`duplicate or missing edge_id: ${edge.edge_id}`);
    seen.add(edge.edge_id);
    for (const field of ['from', 'to', 'relation', 'edge_type', 'source_path', 'source_surface_type', 'source_status', 'authority_level', 'authority_weight', 'primary_evidence', 'evidence_status', 'generated_artifact_warning', 'not_external_authority', 'not_machine_registry_authority']) {
      if (edge[field] === undefined || edge[field] === null || edge[field] === '') {
        errors.push(`${edge.edge_id}: missing ${field}`);
      }
    }
    if (!EDGE_TYPES.has(edge.edge_type)) errors.push(`${edge.edge_id}: invalid edge_type ${edge.edge_type}`);
    if (edge.curriculum_authority !== false) errors.push(`${edge.edge_id}: curriculum_authority must be false`);
    if (edge.not_external_authority !== true) errors.push(`${edge.edge_id}: not_external_authority must be true`);
    if (edge.not_machine_registry_authority !== true) errors.push(`${edge.edge_id}: not_machine_registry_authority must be true`);
    if (!Array.isArray(edge.unit_ids)) errors.push(`${edge.edge_id}: unit_ids must be array`);
    if (!Array.isArray(edge.term_ids)) errors.push(`${edge.edge_id}: term_ids must be array`);

    if (edge.edge_type === 'projection') {
      projectionCount++;
      if (edge.primary_evidence !== false) errors.push(`${edge.edge_id}: projection edge cannot be primary evidence`);
      if (edge.evidence_status !== 'projection_only') errors.push(`${edge.edge_id}: projection edge must use evidence_status projection_only`);
    }
    if (edge.edge_type === 'implementation_trace') {
      implementationTraceCount++;
      if (edge.primary_evidence !== false) errors.push(`${edge.edge_id}: implementation_trace cannot be primary evidence`);
      if (edge.evidence_status !== 'implementation_trace_only') errors.push(`${edge.edge_id}: implementation_trace must use evidence_status implementation_trace_only`);
    }
    if (edge.edge_type === 'owned_exercise_evidence') {
      evidenceCount++;
      if (!EVIDENCE_ALLOWED_SURFACES.has(edge.source_surface_type)) {
        errors.push(`${edge.edge_id}: owned evidence edge from disallowed source_surface_type ${edge.source_surface_type}`);
      }
      if (edge.evidence_status !== 'explicit_owned_evidence') errors.push(`${edge.edge_id}: owned evidence edge must use explicit_owned_evidence`);
      if (edge.authority_level === 'external_primary') errors.push(`${edge.edge_id}: owned evidence cannot be external_primary`);
    }
    if (GENERATED_STATUSES.has(edge.source_status)) {
      generatedWarningCount++;
      if (edge.generated_artifact_warning !== true) errors.push(`${edge.edge_id}: generated/implementation source must set generated_artifact_warning=true`);
      if (edge.primary_evidence !== false) errors.push(`${edge.edge_id}: generated/implementation source cannot be primary evidence`);
      if (edge.edge_type === 'owned_exercise_evidence') errors.push(`${edge.edge_id}: generated source cannot be owned_exercise_evidence`);
    }
  }

  if (projectionCount === 0) errors.push('expected projection edges');
  if (evidenceCount === 0) errors.push('expected owned_exercise_evidence edges');
  if (implementationTraceCount === 0) errors.push('expected implementation_trace edges');
  if (generatedWarningCount === 0) errors.push('expected generated artifact warnings');

  if (report.report_id !== 'owned-content-coverage') errors.push('coverage report_id must be owned-content-coverage');
  if (report.summary && report.summary.edge_count !== graph.edge_count) errors.push('coverage edge_count must match graph');

  if (errors.length) fail(errors);
  const byEdgeType = countBy(graph.edges, 'edge_type');
  console.log(`OK owned content graph: ${graph.edge_count} edges (${Object.entries(byEdgeType).map(([k, v]) => `${k}=${v}`).join(', ')})`);
}

if (require.main === module) main();
