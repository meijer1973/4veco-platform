#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add explicit IDs in EXPLICIT_DOCUMENT_IDS when a document is cited by
 *   evidence anchors, review gates, or roadmap decisions.
 * - Keep this registry under references/data/ until a CLI-backed machine
 *   registry exists.
 * - Do not use this script to mutate references/machine/ or references/external/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SOURCE_MANIFEST_PATH = 'references/data/source_manifest.json';
const DOCUMENT_INVENTORY_PATH = 'references/data/document_inventory.json';
const EVIDENCE_ANCHORS_PATH = 'references/data/evidence-anchors.json';
const REGISTRY_PATH = 'references/data/source-document-registry.json';
const REPORT_JSON_PATH = 'reports/json/source-document-registry.json';
const REPORT_MD_PATH = 'reports/markdown/source-document-registry.md';

const SELF_OUTPUTS = new Set([
  REGISTRY_PATH,
  REPORT_JSON_PATH,
  REPORT_MD_PATH,
]);

const EXPLICIT_DOCUMENT_IDS = {
  'references/SOURCE_OF_TRUTH.md': 'source-of-truth',
  'references/authored/course-target-exercises.json': 'course-target-exercises-v5',
  'references/authored/archive/course-target-exercises-v4.json': 'course-target-exercises-v4',
  'references/machine/micro-teaching-units.json': 'micro-teaching-units',
  'references/machine/begrippen.json': 'begrippen',
  'references/external/exam-questions.json': 'exam-questions',
  'reports/review-gates/GATE-R2-empty-needs/human-interview.md': 'gate-r2-human-interview',
  'reports/json/exam-question-extraction-gaps.json': 'r4.2-exam-question-extraction-gaps',
  'references/owned/course-blueprint-v5.md': 'course-blueprint-v5',
  'references/owned/course-blueprint-v5.meta.json': 'course-blueprint-v5-meta',
  'references/owned/course-blueprint-v4.md': 'course-blueprint-v4',
  'references/owned/course-blueprint-v4.meta.json': 'course-blueprint-v4-meta',
  'references/external/syllabus-economie-vwo-2026-versie-2.pdf': 'syllabus-economie-vwo-2026-versie-2',
  'references/external/syllabus-eindtermen.json': 'syllabus-eindtermen',
  'references/external/syllabus-eindtermen.md': 'syllabus-eindtermen-md',
  'references/external/inspectie-standaarden.md': 'inspectie-standaarden',
  'references/external/amstelveencollege_quality_standards.md': 'amstelveencollege-quality-standards',
};

const EXPLICIT_TITLES = {
  'source-of-truth': 'References Source Of Truth',
  'course-target-exercises-v5': 'Course Target Exercises v5',
  'course-target-exercises-v4': 'Course Target Exercises v4 Archive',
  'micro-teaching-units': 'Micro Teaching Units',
  begrippen: 'Begrippen Registry',
  'exam-questions': 'Extracted Exam Questions',
  'gate-r2-human-interview': 'R2 Empty Needs Human Interview',
  'r4.2-exam-question-extraction-gaps': 'R4.2 Exam Question Extraction Gaps',
  'course-blueprint-v5': 'Course Blueprint v5',
  'course-blueprint-v5-meta': 'Course Blueprint v5 Metadata',
  'course-blueprint-v4': 'Course Blueprint v4',
  'course-blueprint-v4-meta': 'Course Blueprint v4 Metadata',
};

const ALWAYS_BLOCKED_PRODUCT_USES = [
  'student_diagnostics',
  'adaptive_routing',
  'student_facing_ai',
  'automatic_lesson_sequencing',
  'automatic_mastery_decisions',
  'summative_assessment_decisions',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function slashPath(value) {
  return value.replace(/\\/g, '/');
}

function slug(value) {
  return String(value)
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function basenameNoExt(relPath) {
  return path.basename(relPath).replace(/\.[^.]+$/, '');
}

function titleFromPath(relPath) {
  return basenameNoExt(relPath)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pathExists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function by(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || '<missing>';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function sourceVersionFor(entry) {
  const relPath = entry.path;
  const hash = entry.sha256 ? `sha256:${entry.sha256}` : 'version:unhashed-generated-inventory';
  if (relPath === 'references/owned/course-blueprint-v5.md') return 'owned:course-blueprint-v5';
  if (relPath === 'references/owned/course-blueprint-v5.meta.json') return 'owned:course-blueprint-v5-meta';
  if (relPath === 'references/owned/course-blueprint-v4.md') return 'owned:course-blueprint-v4';
  if (relPath === 'references/owned/course-blueprint-v4.meta.json') return 'owned:course-blueprint-v4-meta';
  if (relPath === 'references/external/syllabus-economie-vwo-2026-versie-2.pdf') return 'CvTE:syllabus-economie-vwo-2026-v2';
  if (/^references\/external\/exams\/.+\.pdf$/.test(relPath)) return `CvTE:${basenameNoExt(relPath)}`;
  return hash;
}

function statusFor(entry) {
  if (entry.path === 'references/authored/archive/course-target-exercises-v4.json') return 'archived';
  if (entry.path === 'references/owned/course-blueprint-v4.md' || entry.path === 'references/owned/course-blueprint-v4.meta.json') return 'superseded';
  if (entry.path === 'references/external/README.md' || entry.path === 'references/external/exams/README.md') return 'active';
  if (entry.path.startsWith('references/external/exams/') || entry.path.endsWith('.pdf') && entry.path.startsWith('references/external/')) return 'mirrored';
  if (entry.path === 'references/external/exam-questions.json' || entry.source_type === 'external_reference') return 'extracted';
  if (entry.path.startsWith('references/machine/')) return 'active';
  if (entry.path.startsWith('references/data/')) return 'governance_data';
  if (entry.path.startsWith('reports/')) return 'generated_diagnostic';
  if (entry.path.startsWith('references/schemas/')) return 'schema_contract';
  if (entry.path.startsWith('build-scripts/')) return 'tooling';
  if (entry.path === 'references/reference-team-roadmap.md') return 'planning';
  if (entry.authority_level === 'unknown') return 'review_required';
  return 'active';
}

function authorityLevelFor(entry) {
  if (entry.path === 'references/external/README.md' || entry.path === 'references/external/exams/README.md') return 'governance_data';
  if (entry.path.startsWith('references/data/')) return 'governance_data';
  if (entry.path.startsWith('references/qc-prompts/')) return 'quality_protocol';
  if (entry.path === 'references/reference-team-roadmap.md') return 'planning';
  return entry.authority_level || 'unknown';
}

function citationPolicyFor(authorityLevel, status) {
  if (authorityLevel === 'external_primary') return 'cite_external_primary_source';
  if (authorityLevel === 'machine_registry') return 'cite_machine_registry_for_ids_and_dependencies';
  if (authorityLevel === 'owned_curriculum_design') return 'cite_as_owned_curriculum_design_not_external_authority';
  if (authorityLevel === 'authored_judgement') return 'cite_as_human_authored_judgement';
  if (authorityLevel === 'governance_data') return 'cite_as_governance_record_only';
  if (authorityLevel === 'generated_report' || status === 'generated_diagnostic') return 'cite_as_diagnostic_projection_not_primary_evidence';
  if (authorityLevel === 'tooling' || authorityLevel === 'machine_contract') return 'cite_as_implementation_contract_not_curriculum_evidence';
  return 'citation_requires_review';
}

function publicCitationPolicyFor(authorityLevel, status) {
  if (authorityLevel === 'external_primary') return 'public_citation_allowed_with_source_name';
  if (authorityLevel === 'generated_report' || status === 'generated_diagnostic') return 'internal_diagnostic_only';
  if (['tooling', 'machine_contract', 'planning', 'governance_data', 'quality_protocol'].includes(authorityLevel)) {
    return 'not_public_citation_source';
  }
  return 'internal_only';
}

function primaryEvidenceFor(entry, authorityLevel, status) {
  if (status === 'generated_diagnostic' || authorityLevel === 'generated_report' || authorityLevel === 'governance_data') return false;
  if (authorityLevel === 'external_primary') return true;
  if (authorityLevel === 'machine_registry') return true;
  if (entry.path === 'references/authored/course-target-exercises.json') return true;
  return false;
}

function curriculumAuthorityFor(entry, authorityLevel, primaryEvidence) {
  if (authorityLevel === 'generated_report' || authorityLevel === 'governance_data') return false;
  if (authorityLevel === 'external_primary') return true;
  if (authorityLevel === 'machine_registry') return true;
  if (authorityLevel === 'owned_curriculum_design') return true;
  return primaryEvidence;
}

function allowedUsesFor(authorityLevel, status, primaryEvidence) {
  if (status === 'generated_diagnostic' || authorityLevel === 'generated_report') {
    return ['diagnostic_review', 'internal_quality_tracking', 'rag_retrieval_with_diagnostic_warning'];
  }
  if (authorityLevel === 'external_primary') {
    return ['external_alignment_evidence', 'exam_question_grounding', 'rag_retrieval', 'teacher_facing_non_authoritative_lookup'];
  }
  if (authorityLevel === 'machine_registry') {
    return ['unit_id_lookup', 'dependency_lookup', 'term_lookup', 'rag_retrieval', 'reference_health'];
  }
  if (authorityLevel === 'owned_curriculum_design') {
    return ['course_design_review', 'owned_source_projection', 'target_exercise_alignment', 'rag_retrieval'];
  }
  if (primaryEvidence) return ['owned_exercise_evidence', 'gap_discovery', 'rag_retrieval'];
  return ['internal_reference_context', 'rag_retrieval_with_authority_label'];
}

function blockedUsesFor(authorityLevel, status) {
  const blocked = [...ALWAYS_BLOCKED_PRODUCT_USES];
  if (status === 'generated_diagnostic' || authorityLevel === 'generated_report') {
    blocked.push('primary_curriculum_evidence', 'external_authority', 'source_mutation_authority');
  }
  if (authorityLevel !== 'external_primary') blocked.push('external_authority');
  if (authorityLevel !== 'machine_registry') blocked.push('override_machine_registry');
  return [...new Set(blocked)];
}

function notesFor(entry, authorityLevel, status) {
  const notes = [];
  if (status === 'archived') notes.push('Archived historical source retained for evidence anchors and migration traceability; not the active source.');
  if (status === 'superseded') notes.push('Superseded by the active v5 blueprint; retained for historical comparison only.');
  if (status === 'generated_diagnostic') notes.push('Generated diagnostics are not primary evidence.');
  if (entry.path.startsWith('references/machine/')) notes.push('Machine registry records must be changed through reference CLI scripts.');
  if (entry.path.startsWith('references/external/')) notes.push('External references must be refreshed or extracted from outside authority; do not hand-edit.');
  if (entry.path.startsWith('references/data/')) notes.push('Governance data is canonical only for its declared governance artifact.');
  if (authorityLevel === 'owned_curriculum_design') notes.push('Owned curriculum design is strong course-intent evidence, not external authority.');
  return notes;
}

function recordFor(entry, evidenceByDocument) {
  const relPath = slashPath(entry.path);
  const documentId = EXPLICIT_DOCUMENT_IDS[relPath] || (
    /^references\/external\/exams\/.+\.pdf$/.test(relPath)
      ? basenameNoExt(relPath)
      : `path-${slug(relPath)}`
  );
  const authorityLevel = authorityLevelFor(entry);
  const status = statusFor(entry);
  const primaryEvidence = primaryEvidenceFor(entry, authorityLevel, status);
  return {
    document_id: documentId,
    path: relPath,
    title: EXPLICIT_TITLES[documentId] || titleFromPath(relPath),
    source_type: entry.source_type || 'unknown',
    authority_level: authorityLevel,
    source_version: sourceVersionFor(entry),
    status,
    owner: entry.owner || 'references_team',
    citation_policy: citationPolicyFor(authorityLevel, status),
    public_citation_policy: publicCitationPolicyFor(authorityLevel, status),
    layer: entry.layer || 'unknown',
    generated_status: entry.generated_status || 'unknown',
    edit_policy: entry.edit_policy || 'review_required',
    refresh_policy: entry.refresh_policy || 'review_required',
    source_hash: entry.sha256 || null,
    size_bytes: entry.size_bytes === undefined ? null : entry.size_bytes,
    primary_evidence: primaryEvidence,
    curriculum_authority: curriculumAuthorityFor(entry, authorityLevel, primaryEvidence),
    allowed_downstream_uses: allowedUsesFor(authorityLevel, status, primaryEvidence),
    blocked_downstream_uses: blockedUsesFor(authorityLevel, status),
    evidence_anchor_ids: evidenceByDocument.get(documentId) || [],
    notes: notesFor(entry, authorityLevel, status),
  };
}

function collectEntries() {
  const sourceManifest = readJson(SOURCE_MANIFEST_PATH);
  const documentInventory = readJson(DOCUMENT_INVENTORY_PATH);
  const evidence = readJson(EVIDENCE_ANCHORS_PATH);
  const byPath = new Map();
  for (const file of sourceManifest.files || []) byPath.set(file.path, file);
  for (const file of documentInventory.files || []) {
    if (!byPath.has(file.path)) byPath.set(file.path, file);
  }

  const evidencePaths = new Set((evidence.evidence_anchors || []).map((anchor) => anchor.source_path));
  const paths = new Set([
    ...(sourceManifest.files || []).map((file) => file.path),
    ...evidencePaths,
  ]);

  const entries = [];
  for (const relPath of [...paths].sort()) {
    if (SELF_OUTPUTS.has(relPath)) continue;
    const entry = byPath.get(relPath);
    if (!entry) {
      entries.push({
        path: relPath,
        file_name: path.basename(relPath),
        extension: path.extname(relPath).replace(/^\./, '') || 'none',
        size_bytes: pathExists(relPath) ? fs.statSync(repoPath(relPath)).size : null,
        sha256: null,
        layer: relPath.startsWith('reports/') ? 'generated_report' : 'unknown',
        authority_level: relPath.startsWith('reports/') ? 'generated_report' : 'unknown',
        source_type: relPath.startsWith('reports/') ? 'report' : 'unknown',
        generated_status: relPath.startsWith('reports/') ? 'generated_projection' : 'unknown',
        edit_policy: relPath.startsWith('reports/') ? 'generated_by_script' : 'review_required',
        owner: relPath.startsWith('reports/') ? 'platform_team' : 'references_team',
        refresh_policy: relPath.startsWith('reports/') ? 'regenerate' : 'review_required',
      });
    } else {
      entries.push(entry);
    }
  }

  return { sourceManifest, documentInventory, evidence, entries };
}

function buildRegistry() {
  const { sourceManifest, evidence, entries } = collectEntries();
  const evidenceByDocument = new Map();
  for (const anchor of evidence.evidence_anchors || []) {
    if (!evidenceByDocument.has(anchor.document_id)) evidenceByDocument.set(anchor.document_id, []);
    evidenceByDocument.get(anchor.document_id).push(anchor.evidence_id);
  }

  const recordsById = new Map();
  for (const entry of entries) {
    const record = recordFor(entry, evidenceByDocument);
    if (!recordsById.has(record.document_id)) recordsById.set(record.document_id, record);
  }
  const records = [...recordsById.values()].sort((a, b) => a.document_id.localeCompare(b.document_id));

  const evidenceDocumentIds = [...new Set((evidence.evidence_anchors || []).map((anchor) => anchor.document_id))].sort();
  const registeredIds = new Set(records.map((record) => record.document_id));
  const evidenceCoverage = {
    required_document_ids: evidenceDocumentIds,
    covered_document_ids: evidenceDocumentIds.filter((id) => registeredIds.has(id)),
    missing_document_ids: evidenceDocumentIds.filter((id) => !registeredIds.has(id)),
  };

  return {
    schema_version: 1,
    registry_id: 'source-document-registry',
    generated_by: 'build-scripts/references/build-source-document-registry.js',
    generated_on: new Date().toISOString(),
    storage_decision: {
      registry_location: 'references/data/source-document-registry.json',
      machine_registry_created: false,
      reason: 'Sprint 6 creates a governed data overlay. A references/machine registry remains blocked until a CLI-backed mutation path exists.',
      protected_surface_policy: 'No hand edits to references/machine/ or references/external/.',
    },
    source_files: [
      SOURCE_MANIFEST_PATH,
      DOCUMENT_INVENTORY_PATH,
      EVIDENCE_ANCHORS_PATH,
      'references/SOURCE_OF_TRUTH.md',
    ],
    summary: {
      record_count: records.length,
      source_manifest_file_count: sourceManifest.summary ? sourceManifest.summary.file_count : null,
      by_authority_level: by(records, 'authority_level'),
      by_source_type: by(records, 'source_type'),
      by_status: by(records, 'status'),
      by_public_citation_policy: by(records, 'public_citation_policy'),
      evidence_anchor_coverage: evidenceCoverage,
      generated_reports_not_primary_evidence: records
        .filter((record) => record.status === 'generated_diagnostic' || record.authority_level === 'generated_report')
        .every((record) => record.primary_evidence === false && record.curriculum_authority === false),
    },
    records,
  };
}

function markdownReport(registry) {
  const lines = [];
  lines.push('# Source Document Registry');
  lines.push('');
  lines.push(`Generated by: \`${registry.generated_by}\``);
  lines.push(`Generated on: \`${registry.generated_on}\``);
  lines.push('');
  lines.push('## Storage Decision');
  lines.push('');
  lines.push(`Registry location: \`${registry.storage_decision.registry_location}\``);
  lines.push(`Machine registry created: \`${registry.storage_decision.machine_registry_created}\``);
  lines.push('');
  lines.push(registry.storage_decision.reason);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`Record count: \`${registry.summary.record_count}\``);
  lines.push('');
  lines.push('### Authority Levels');
  lines.push('');
  lines.push('| Authority level | Count |');
  lines.push('|---|---:|');
  for (const [key, value] of Object.entries(registry.summary.by_authority_level).sort()) {
    lines.push(`| \`${key}\` | ${value} |`);
  }
  lines.push('');
  lines.push('### Statuses');
  lines.push('');
  lines.push('| Status | Count |');
  lines.push('|---|---:|');
  for (const [key, value] of Object.entries(registry.summary.by_status).sort()) {
    lines.push(`| \`${key}\` | ${value} |`);
  }
  lines.push('');
  lines.push('## Evidence Anchor Coverage');
  lines.push('');
  lines.push(`Covered document IDs: \`${registry.summary.evidence_anchor_coverage.covered_document_ids.length}\``);
  lines.push(`Missing document IDs: \`${registry.summary.evidence_anchor_coverage.missing_document_ids.length}\``);
  if (registry.summary.evidence_anchor_coverage.missing_document_ids.length) {
    lines.push('');
    for (const id of registry.summary.evidence_anchor_coverage.missing_document_ids) lines.push(`- \`${id}\``);
  }
  lines.push('');
  lines.push('## Critical Records');
  lines.push('');
  lines.push('| Document ID | Authority | Status | Primary evidence | Public citation | Path |');
  lines.push('|---|---|---|---:|---|---|');
  const critical = registry.records.filter((record) => (
    record.evidence_anchor_ids.length > 0 ||
    record.authority_level === 'external_primary' ||
    record.authority_level === 'machine_registry' ||
    record.path === 'references/owned/course-blueprint-v5.md' ||
    record.path === 'references/authored/course-target-exercises.json' ||
    record.path === 'references/owned/course-blueprint-v4.md'
  ));
  for (const record of critical) {
    lines.push(`| \`${record.document_id}\` | \`${record.authority_level}\` | \`${record.status}\` | \`${record.primary_evidence}\` | \`${record.public_citation_policy}\` | \`${record.path}\` |`);
  }
  lines.push('');
  lines.push('## Boundary Notes');
  lines.push('');
  lines.push('- Generated diagnostics are listed for traceability but remain non-primary evidence.');
  lines.push('- External and machine-reference boundaries remain intact.');
  lines.push('- This registry is a governed data overlay, not a hand-maintained machine registry.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function main() {
  const registry = buildRegistry();
  writeJson(REGISTRY_PATH, registry);
  writeJson(REPORT_JSON_PATH, {
    generated_by: registry.generated_by,
    generated_on: registry.generated_on,
    status: registry.summary.evidence_anchor_coverage.missing_document_ids.length === 0 ? 'pass' : 'warn',
    summary: registry.summary,
    storage_decision: registry.storage_decision,
    records: registry.records,
  });
  writeText(REPORT_MD_PATH, markdownReport(registry));
  console.log(`Wrote ${REGISTRY_PATH} with ${registry.records.length} records`);
}

if (require.main === module) main();
