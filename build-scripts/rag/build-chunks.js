#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(REPO_ROOT, 'references/data/rag/chunk_index.jsonl');
const GENERATED_BY = 'build-scripts/rag/build-chunks.js';

function readJson(relPath, fallback) {
  const file = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(relPath) {
  return fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
}

function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function now() {
  return new Date().toISOString();
}

function chunk({ chunkId, sourcePath, sourceType, authorityLevel, entityIds = [], evidenceIds = [], edgeStatuses = [], allowedForPublicCitation = false, curriculumAuthority = false, text, primaryEvidence = true }) {
  return {
    chunk_id: chunkId,
    source_path: sourcePath,
    source_type: sourceType,
    authority_level: authorityLevel,
    entity_ids: [...new Set(entityIds)].sort(),
    evidence_ids: [...new Set(evidenceIds)].sort(),
    edge_statuses: [...new Set(edgeStatuses)].sort(),
    allowed_for_public_citation: allowedForPublicCitation,
    curriculum_authority: curriculumAuthority,
    primary_evidence: primaryEvidence,
    text: String(text || '').replace(/\s+/g, ' ').trim(),
    generated_by: GENERATED_BY,
    generated_on: now(),
    source_hash: hash(String(text || '')),
  };
}

function sourceRankToAuthority(edge) {
  if (edge.source_rank === 'external_primary') return 'external_primary';
  if (edge.source_rank === 'machine_registry') return 'machine_registry';
  if (edge.source_rank === 'authored_judgement') return 'authored_judgement';
  if (edge.source_rank === 'generated_report') return 'generated_report';
  return 'diagnostic';
}

function main() {
  const units = readJson('references/machine/micro-teaching-units.json', []);
  const terms = readJson('references/machine/begrippen.json', { terms: {} }).terms || {};
  const exams = readJson('references/external/exam-questions.json', []);
  const targets = readJson('references/authored/course-target-exercises.json', {});
  const graph = readJson('references/data/alignment-graph.json', { edges: [] });
  const evidence = readJson('references/data/evidence-anchors.json', { evidence_anchors: [] });
  const chunks = [];

  for (const unit of units) {
    chunks.push(chunk({
      chunkId: `machine-unit:${unit.id}`,
      sourcePath: 'references/machine/micro-teaching-units.json',
      sourceType: 'machine_unit',
      authorityLevel: 'machine_registry',
      entityIds: [unit.id, ...(unit.terms || []), ...(unit.exam_codes || [])],
      evidenceIds: [],
      edgeStatuses: [],
      curriculumAuthority: !unit.deprecated,
      text: `${unit.id} ${unit.name}. ${unit.kern || ''} Needs: ${(unit.needs || []).join(', ') || 'none'}. Terms: ${(unit.terms || []).join(', ') || 'none'}. Exam codes: ${(unit.exam_codes || []).join(', ') || 'none'}.`,
    }));
  }

  for (const [id, term] of Object.entries(terms).sort(([a], [b]) => a.localeCompare(b))) {
    chunks.push(chunk({
      chunkId: `machine-term:${id}`,
      sourcePath: 'references/machine/begrippen.json',
      sourceType: 'machine_term',
      authorityLevel: 'machine_registry',
      entityIds: [id, ...(term.teaching_units || []), term.syllabus_clause].filter(Boolean),
      evidenceIds: [],
      edgeStatuses: [],
      curriculumAuthority: !term.deprecated,
      text: `${id} ${term.term_nl || ''}. ${term.definition_nl || ''} Formula: ${(term.formulas || []).join('; ') || 'none'}. Pitfall: ${term.pitfall_nl || 'none'}.`,
    }));
  }

  const examItems = Array.isArray(exams) ? exams : (exams.questions || []);
  for (const item of examItems) {
    const qid = item.id || item.question_id || `${item.exam_code || item.exam || 'exam'}-${item.question || item.number || chunks.length}`;
    const required = item.required_skills || item.skill_ids || [];
    chunks.push(chunk({
      chunkId: `exam-question:${slug(qid)}`,
      sourcePath: 'references/external/exam-questions.json',
      sourceType: 'exam_question',
      authorityLevel: 'external_primary',
      entityIds: [qid, ...(item.exam_codes || []), item.exam_code, ...required].filter(Boolean),
      evidenceIds: [],
      edgeStatuses: [],
      allowedForPublicCitation: true,
      curriculumAuthority: true,
      text: `${qid}. ${(item.title || item.prompt || item.summary || item.text || '').toString()} Required skills: ${required.join(', ') || 'unknown'}. Exam codes: ${(item.exam_codes || [item.exam_code]).filter(Boolean).join(', ') || 'unknown'}.`,
    }));
  }

  chunks.push(chunk({
    chunkId: 'target-exercise:course-target-exercises',
    sourcePath: 'references/authored/course-target-exercises.json',
    sourceType: 'target_exercise',
    authorityLevel: 'authored_judgement',
    entityIds: [],
    evidenceIds: [],
    edgeStatuses: [],
    curriculumAuthority: true,
    text: JSON.stringify(targets).slice(0, 20000),
  }));

  const authoredPaths = [
    'references/authored/didactiek-principes.md',
    'references/authored/economic_mathematical_precision_reference.md',
    'references/authored/economie-terminologie.md',
    'references/authored/skill-categories.md',
    'references/authored/vraagtypen-en-opgaveontwerp.md',
  ];
  for (const sourcePath of authoredPaths.filter(exists)) {
    chunks.push(chunk({
      chunkId: `authored-reference:${slug(sourcePath)}`,
      sourcePath,
      sourceType: 'authored_reference',
      authorityLevel: 'authored_judgement',
      entityIds: [],
      evidenceIds: [],
      edgeStatuses: [],
      curriculumAuthority: false,
      text: readText(sourcePath).slice(0, 20000),
    }));
  }

  const externalPaths = [
    'references/external/syllabus-eindtermen.md',
    'references/external/inspectie-standaarden.md',
    'references/external/amstelveencollege_quality_standards.md',
  ];
  for (const sourcePath of externalPaths.filter(exists)) {
    chunks.push(chunk({
      chunkId: `external-source:${slug(sourcePath)}`,
      sourcePath,
      sourceType: 'external_source',
      authorityLevel: 'external_primary',
      entityIds: [],
      evidenceIds: [],
      edgeStatuses: [],
      allowedForPublicCitation: true,
      curriculumAuthority: true,
      text: readText(sourcePath).slice(0, 20000),
    }));
  }

  for (const edge of graph.edges || []) {
    chunks.push(chunk({
      chunkId: `alignment-edge:${slug(edge.edge_id)}`,
      sourcePath: 'references/data/alignment-graph.json',
      sourceType: 'alignment_edge',
      authorityLevel: sourceRankToAuthority(edge),
      entityIds: [edge.edge_id, edge.from, edge.to, edge.claim_id].filter(Boolean),
      evidenceIds: edge.evidence_ids || [],
      edgeStatuses: [edge.review_status],
      curriculumAuthority: edge.curriculum_authority === true,
      primaryEvidence: edge.source_rank !== 'generated_report',
      text: `${edge.edge_id}: ${edge.from} ${edge.relation} ${edge.to}. Status: ${edge.review_status}. Governance: ${edge.governance_use || 'none'}. Notes: ${edge.notes || ''}`,
    }));
  }

  for (const anchor of evidence.evidence_anchors || []) {
    chunks.push(chunk({
      chunkId: `evidence-anchor:${slug(anchor.evidence_id)}`,
      sourcePath: 'references/data/evidence-anchors.json',
      sourceType: 'evidence_anchor',
      authorityLevel: anchor.source_layer === 'external_authority' ? 'external_primary'
        : anchor.source_layer === 'machine_registry' ? 'machine_registry'
          : anchor.source_layer === 'generated_report' ? 'generated_report'
            : anchor.source_layer === 'authored_judgement' || anchor.source_layer === 'human_gate_decision' ? 'authored_judgement'
              : 'diagnostic',
      entityIds: [anchor.evidence_id, anchor.document_id].filter(Boolean),
      evidenceIds: [anchor.evidence_id],
      edgeStatuses: [],
      allowedForPublicCitation: anchor.source_layer === 'external_authority',
      curriculumAuthority: anchor.primary === true && anchor.source_layer !== 'generated_report',
      primaryEvidence: anchor.primary === true && anchor.source_layer !== 'generated_report',
      text: `${anchor.evidence_id}: ${anchor.supports}. ${anchor.summary || ''} Source: ${anchor.source_path}.`,
    }));
  }

  const reportDir = path.join(REPO_ROOT, 'reports/json');
  for (const name of fs.readdirSync(reportDir).filter((name) => name.endsWith('.json')).sort()) {
    const sourcePath = `reports/json/${name}`;
    const report = readJson(sourcePath, {});
    chunks.push(chunk({
      chunkId: `quality-report:${slug(name.replace(/\\.json$/, ''))}`,
      sourcePath,
      sourceType: 'quality_report',
      authorityLevel: 'generated_report',
      entityIds: [report.report_id || name.replace(/\\.json$/, '')],
      evidenceIds: [],
      edgeStatuses: [],
      curriculumAuthority: false,
      primaryEvidence: false,
      text: `${report.report_id || name}: status ${report.status || 'unknown'}; issues ${(report.issues || []).length}; summary ${JSON.stringify(report.summary || {}).slice(0, 2000)}`,
    }));
  }

  const deduped = new Map();
  for (const item of chunks) if (item.text) deduped.set(item.chunk_id, item);
  const sorted = [...deduped.values()].sort((a, b) => a.chunk_id.localeCompare(b.chunk_id));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, sorted.map((item) => JSON.stringify(item)).join('\n') + '\n');
  console.log(`OK chunks: ${sorted.length} -> references/data/rag/chunk_index.jsonl`);
}

if (require.main === module) main();
