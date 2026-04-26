#!/usr/bin/env node
/**
 * build-alignment-graph.js
 *
 * Projects validated R5.1 claims into a draft R5.2 alignment graph.
 * The graph is not authoritative until R5.3 closes.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EVIDENCE_FILE = path.join(REPO_ROOT, 'references/data/evidence-anchors.json');
const OUT = path.join(REPO_ROOT, 'references/data/alignment-graph.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function edgeId(...parts) {
  return 'EDGE-' + parts
    .join('-')
    .replace(/[^A-Za-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase();
}

function sourceLayersFor(claim, evidenceById) {
  return [...new Set((claim.evidence_ids || []).map((id) => evidenceById.get(id) && evidenceById.get(id).source_layer).filter(Boolean))].sort();
}

function strengthFor(claim, evidenceById) {
  if (claim.status === 'diagnostic') return 'diagnostic';
  const evidence = (claim.evidence_ids || []).map((id) => evidenceById.get(id)).filter(Boolean);
  if (evidence.some((item) => item.source_layer === 'external_authority') || evidence.length >= 2) return 'strong';
  if (claim.status === 'hold') return 'medium';
  return 'medium';
}

function addEdge(edges, edge) {
  edges.push({
    ...edge,
    review_status: edge.review_status || 'pending_r5_3_review',
  });
}

function relationForClaim(claim) {
  switch (claim.claim_type) {
    case 'unit_prerequisite':
      return 'prerequisite';
    case 'term_definition':
      return 'explains';
    case 'unit_design_decision':
    case 'source_policy':
    case 'blueprint_flag_decision':
      return 'supports';
    case 'exam_question_gap':
      return 'assesses';
    default:
      return 'supports';
  }
}

function namespacedSubject(claim) {
  if (claim.claim_type === 'term_definition') return `term:${claim.subject_id}`;
  if (claim.claim_type === 'exam_question_gap') return `source:${claim.subject_id}`;
  if (claim.claim_type === 'source_policy') return `policy:${claim.subject_id}`;
  return `unit:${claim.subject_id}`;
}

function namespacedObject(claim) {
  if (claim.claim_type === 'unit_prerequisite') return `unit:${claim.object_id}`;
  if (claim.claim_type === 'term_definition') return `registry:${claim.object_id}`;
  if (claim.claim_type === 'exam_question_gap') return `issue:${claim.object_id}`;
  if (claim.claim_type === 'source_policy') return `policy:${claim.object_id}`;
  return `decision:${claim.object_id}`;
}

function buildGraph(data) {
  const evidenceById = new Map((data.evidence_anchors || []).map((item) => [item.evidence_id, item]));
  const edges = [];

  for (const claim of data.claims || []) {
    const relation = relationForClaim(claim);
    const from = namespacedSubject(claim);
    const to = namespacedObject(claim);
    const sourceLayers = sourceLayersFor(claim, evidenceById);
    const strength = strengthFor(claim, evidenceById);

    addEdge(edges, {
      edge_id: edgeId(relation, claim.subject_id, claim.object_id),
      from,
      to,
      relation,
      evidence_ids: claim.evidence_ids,
      claim_id: claim.claim_id,
      strength,
      source_layers: sourceLayers,
      notes: claim.review_required_before_use
        ? 'Underlying claim requires review before use.'
        : 'Projected from validated R5.1 claim; graph still awaits R5.3 review.',
    });

    for (const evidenceId of claim.evidence_ids || []) {
      addEdge(edges, {
        edge_id: edgeId('derived-from', claim.claim_id, evidenceId),
        from: `claim:${claim.claim_id}`,
        to: `evidence:${evidenceId}`,
        relation: 'derived_from',
        evidence_ids: [evidenceId],
        claim_id: claim.claim_id,
        strength: evidenceById.get(evidenceId) && evidenceById.get(evidenceId).source_layer === 'generated_report'
          ? 'diagnostic'
          : 'strong',
        source_layers: evidenceById.get(evidenceId) ? [evidenceById.get(evidenceId).source_layer] : [],
        review_status: evidenceById.get(evidenceId) && evidenceById.get(evidenceId).source_layer === 'generated_report'
          ? 'diagnostic_only'
          : 'pending_r5_3_review',
        notes: 'Traceability edge from claim to evidence anchor.',
      });
    }
  }

  return {
    schema_version: '0.1',
    sprint_id: 'R5.2',
    generated_on: new Date().toISOString().slice(0, 10),
    graph_status: 'draft_pending_r5_3_review',
    source: 'references/data/evidence-anchors.json',
    edge_count: edges.length,
    edges,
  };
}

function main() {
  const data = readJson(EVIDENCE_FILE);
  const graph = buildGraph(data);
  fs.writeFileSync(OUT, JSON.stringify(graph, null, 2) + '\n');
  console.log(`OK  wrote ${path.relative(REPO_ROOT, OUT)} (${graph.edge_count} edge(s))`);
}

if (require.main === module) main();

module.exports = { buildGraph, main };
