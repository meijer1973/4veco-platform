#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add new owned lesson roots in the owned-source registry first.
 * - Extend classifyLessonFile when new companion artifact families appear.
 * - Keep generated artifacts as implementation_trace/projection only.
 * - Do not write to references/machine/, references/external/, or lesson targets.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GRAPH_PATH = 'references/data/owned-content-graph.json';
const REPORT_JSON_PATH = 'reports/json/owned-content-coverage.json';
const REPORT_MD_PATH = 'reports/owned-content-coverage.md';
const REGISTRY_PATH = 'references/data/owned-source-registry.json';
const TARGETS_PATH = 'references/authored/course-target-exercises.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const TERMS_PATH = 'references/machine/begrippen.json';
const BLUEPRINT_PATH = 'references/owned/course-blueprint-v4.md';
const CP2_CLOSURE_PATH = 'reports/review-gates/GATE-CP2-owned-source-scope/gate-closure.json';

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

function slashPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function resolveMaybeOutside(relPath) {
  return path.resolve(REPO_ROOT, relPath);
}

function sha(text) {
  return crypto.createHash('sha256').update(String(text)).digest('hex');
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160);
}

function edgeId(...parts) {
  return `OCG-${parts.join('-')}`
    .replace(/[^A-Za-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase();
}

function walkFiles(rootFull) {
  if (!fs.existsSync(rootFull)) return [];
  const out = [];
  const stack = [rootFull];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile()) out.push(full);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function paragraphIdFromPath(relPath) {
  const match = slashPath(relPath).match(/(?:^|\/)(\d+\.\d+\.\d+)(?:\s|[-_]|\/)/);
  return match ? match[1] : null;
}

function extension(fileName) {
  return path.extname(fileName).toLowerCase();
}

function classifyLessonFile(relPath) {
  const name = path.basename(relPath);
  const ext = extension(name);
  if (/chapter-plan/i.test(name)) return 'chapter_plan';
  if (/quality-ref\.ya?ml$/i.test(name)) return 'quality_reference_yaml';
  if (/review\.md$/i.test(name)) return 'review_note';
  if (/paragraaf\.md$/i.test(name)) return 'paragraph_markdown';
  if (/paragraaf\.html$/i.test(name)) return 'paragraph_html';
  if (/paragraaf\.pdf$/i.test(name)) return 'paragraph_pdf';
  if (/opgaven\.md$/i.test(name)) return 'opgaven_markdown';
  if (/opgaven\.html$/i.test(name)) return 'opgaven_html';
  if (/opgaven\.pdf$/i.test(name)) return 'opgaven_pdf';
  if (/antwoorden\.md$/i.test(name)) return 'answer_model_markdown';
  if (/antwoorden\.html$/i.test(name)) return 'answer_model_html';
  if (/antwoorden\.pdf$/i.test(name)) return 'answer_model_pdf';
  if (/samenvatting/i.test(name)) return 'summary_surface';
  if (/presentatie|\.pptx$/i.test(name)) return 'presentation_surface';
  if (/voorkennis/i.test(name)) return 'voorkennis_surface';
  if (/vaardigheden/i.test(name)) return 'vaardigheden_surface';
  if (/inoefening/i.test(name)) return 'guided_practice_surface';
  if (/nieuws/i.test(name)) return 'nieuws_met_visual';
  if (/youtube/i.test(name)) return 'youtube_videos';
  if (relPath.includes('/shared/') && (ext === '.js' || ext === '.css')) return 'shared_engine_output';
  if (ext === '.svg') return 'visual_svg_source';
  if (ext === '.png') return 'visual_png_projection';
  if (ext === '.docx') return 'companion_docx';
  if (ext === '.html') return 'generated_html_surface';
  if (ext === '.pdf') return 'generated_pdf_surface';
  if (ext === '.md') return 'owned_markdown_surface';
  if (ext === '.js') return 'generated_js_surface';
  if (ext === '.yaml' || ext === '.yml') return 'quality_yaml_surface';
  if (ext === '.py') return 'local_build_helper';
  return 'other_owned_lesson_file';
}

function statusForSurfaceType(type) {
  if (type === 'opgaven_markdown') return 'exercise_evidence';
  if (type === 'answer_model_markdown') return 'answer_model';
  if (['paragraph_markdown', 'book_markdown', 'visual_svg_source'].includes(type)) return 'authored_source';
  if (type === 'chapter_plan') return 'planning_artifact';
  if (['local_build_helper', 'shared_engine_output'].includes(type)) return 'implementation_output';
  if (type.includes('html') || type.includes('pdf') || type.includes('png') || type.includes('docx') || type.includes('pptx') || type.includes('generated') || ['quality_reference_yaml', 'review_note', 'visual_png_projection', 'summary_surface', 'presentation_surface', 'voorkennis_surface', 'vaardigheden_surface', 'guided_practice_surface', 'companion_docx'].includes(type)) {
    return 'generated_projection';
  }
  return 'generated_projection';
}

function authorityForStatus(status) {
  if (status === 'exercise_evidence') return { level: 'owned_lesson_exercise', weight: 65 };
  if (status === 'answer_model') return { level: 'owned_answer_model', weight: 55 };
  if (status === 'authored_source') return { level: 'owned_lesson_exposition', weight: 50 };
  if (status === 'planning_artifact') return { level: 'owned_curriculum_design', weight: 45 };
  if (status === 'implementation_output') return { level: 'implementation_output', weight: 10 };
  return { level: 'generated_projection', weight: 20 };
}

function isGeneratedStatus(status) {
  return status === 'generated_projection' || status === 'implementation_output';
}

function termsForUnits(unitIds, unitById) {
  const terms = new Set();
  for (const unitId of unitIds || []) {
    const unit = unitById.get(unitId);
    for (const term of (unit && unit.terms) || []) terms.add(term);
  }
  return [...terms].sort();
}

function addEdge(edges, edge) {
  edges.push({
    ...edge,
    review_status: edge.review_status || 'projected',
    curriculum_authority: false,
    retrieval_authority: true,
    source_hash: sha(`${edge.from}|${edge.to}|${edge.relation}|${edge.source_path}|${(edge.unit_ids || []).join(',')}`),
  });
}

function baseEdge({ from, to, relation, edgeType, sourcePath, sourceSurfaceType, sourceStatus, authorityLevel, authorityWeight, paragraphId, recordId, unitIds = [], termIds = [], notes }) {
  const generated = isGeneratedStatus(sourceStatus);
  return {
    edge_id: edgeId(relation, from, to, paragraphId || 'no-paragraph', recordId || 'no-record', sourcePath || 'no-source'),
    from,
    to,
    relation,
    edge_type: edgeType,
    source_path: sourcePath,
    source_surface_type: sourceSurfaceType,
    source_status: sourceStatus,
    authority_level: authorityLevel,
    authority_weight: authorityWeight,
    paragraph_id: paragraphId || null,
    record_id: recordId || null,
    unit_ids: [...new Set(unitIds)].sort(),
    term_ids: [...new Set(termIds)].sort(),
    primary_evidence: edgeType === 'owned_exercise_evidence',
    evidence_status: edgeType === 'owned_exercise_evidence' ? 'explicit_owned_evidence'
      : edgeType === 'implementation_trace' ? 'implementation_trace_only'
        : 'projection_only',
    generated_artifact_warning: generated,
    not_external_authority: true,
    not_machine_registry_authority: true,
    notes,
  };
}

function discoverLessonFiles(registry) {
  const files = [];
  for (const root of registry.lesson_roots || []) {
    if (!root.exists) continue;
    const full = resolveMaybeOutside(root.path);
    for (const fileFull of walkFiles(full)) {
      const rel = slashPath(path.relative(full, fileFull));
      const sourceSurfaceType = classifyLessonFile(rel);
      const sourceStatus = statusForSurfaceType(sourceSurfaceType);
      const authority = authorityForStatus(sourceStatus);
      files.push({
        root_id: root.root_id,
        root_path: root.path,
        source_path: slashPath(path.join(root.path, rel)),
        rel_path: rel,
        paragraph_id: paragraphIdFromPath(rel),
        source_surface_type: sourceSurfaceType,
        source_status: sourceStatus,
        authority_level: authority.level,
        authority_weight: authority.weight,
      });
    }
  }
  return files;
}

function chapterNodeId(exercise) {
  return `blueprint_chapter:${exercise.module}.${exercise.chapter}`;
}

function paragraphNodeId(id) {
  return `paragraph:${id}`;
}

function targetNodeId(id) {
  return `target_exercise:${id}`;
}

function sourceNodeId(pathValue) {
  return `owned_source:${slug(pathValue)}`;
}

function unitNodeId(id) {
  return `unit:${id}`;
}

function termNodeId(id) {
  return `term:${id}`;
}

function buildGraph() {
  const generatedOn = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const registry = readJson(REGISTRY_PATH);
  const targets = readJson(TARGETS_PATH);
  const units = readJson(UNITS_PATH);
  const termsData = readJson(TERMS_PATH);
  const cp2 = readJson(CP2_CLOSURE_PATH);
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const termIds = new Set(Object.keys(termsData.terms || {}));
  const lessonFiles = discoverLessonFiles(registry);
  const filesByParagraph = new Map();
  for (const file of lessonFiles) {
    if (!file.paragraph_id) continue;
    if (!filesByParagraph.has(file.paragraph_id)) filesByParagraph.set(file.paragraph_id, []);
    filesByParagraph.get(file.paragraph_id).push(file);
  }

  const edges = [];
  const nodes = new Map();
  function node(id, type, label, attrs = {}) {
    if (!nodes.has(id)) nodes.set(id, { node_id: id, node_type: type, label, ...attrs });
  }

  node('blueprint:course-blueprint-v4', 'course_blueprint', 'Course Blueprint v4', { source_path: BLUEPRINT_PATH });

  for (const exercise of targets.exercises || []) {
    const paragraphId = exercise.id;
    const requiredUnits = exercise.required_skills || [];
    const relatedTerms = termsForUnits(requiredUnits, unitById).filter((term) => termIds.has(term));
    const chapterId = chapterNodeId(exercise);
    const paragraphNode = paragraphNodeId(paragraphId);
    const targetNode = targetNodeId(paragraphId);

    node(chapterId, 'blueprint_chapter', `${exercise.module}.${exercise.chapter}`);
    node(paragraphNode, 'paragraph', `${paragraphId} ${exercise.paragraph_title}`, {
      paragraph_id: paragraphId,
      difficulty: exercise.difficulty,
    });
    node(targetNode, 'target_exercise', `${paragraphId} target exercise`, {
      paragraph_id: paragraphId,
      source_path: TARGETS_PATH,
    });

    addEdge(edges, baseEdge({
      from: 'blueprint:course-blueprint-v4',
      to: chapterId,
      relation: 'blueprint_projects_to_chapter',
      edgeType: 'projection',
      sourcePath: BLUEPRINT_PATH,
      sourceSurfaceType: 'course_blueprint',
      sourceStatus: 'authored_source',
      authorityLevel: 'owned_curriculum_design',
      authorityWeight: 70,
      paragraphId,
      recordId: paragraphId,
      unitIds: requiredUnits,
      termIds: relatedTerms,
      notes: 'Owned blueprint projection; not external authority.',
    }));

    addEdge(edges, baseEdge({
      from: chapterId,
      to: paragraphNode,
      relation: 'chapter_projects_to_paragraph',
      edgeType: 'projection',
      sourcePath: BLUEPRINT_PATH,
      sourceSurfaceType: 'course_blueprint',
      sourceStatus: 'authored_source',
      authorityLevel: 'owned_curriculum_design',
      authorityWeight: 70,
      paragraphId,
      recordId: paragraphId,
      unitIds: requiredUnits,
      termIds: relatedTerms,
      notes: 'Owned blueprint paragraph projection; not a sequencing authority edge.',
    }));

    addEdge(edges, baseEdge({
      from: paragraphNode,
      to: targetNode,
      relation: 'paragraph_has_target_exercise',
      edgeType: 'owned_exercise_evidence',
      sourcePath: TARGETS_PATH,
      sourceSurfaceType: 'target_exercise_index',
      sourceStatus: 'exercise_evidence',
      authorityLevel: 'owned_curriculum_design',
      authorityWeight: 75,
      paragraphId,
      recordId: paragraphId,
      unitIds: requiredUnits,
      termIds: relatedTerms,
      notes: 'Owned target exercise evidence; not CvTE or external authority.',
    }));

    for (const unitId of requiredUnits) {
      const unitTerms = termsForUnits([unitId], unitById).filter((term) => termIds.has(term));
      node(unitNodeId(unitId), 'unit', unitId);
      addEdge(edges, baseEdge({
        from: targetNode,
        to: unitNodeId(unitId),
        relation: 'target_exercise_requires_unit',
        edgeType: 'owned_exercise_evidence',
        sourcePath: TARGETS_PATH,
        sourceSurfaceType: 'target_exercise_index',
        sourceStatus: 'exercise_evidence',
        authorityLevel: 'owned_curriculum_design',
        authorityWeight: 75,
        paragraphId,
        recordId: paragraphId,
        unitIds: [unitId],
        termIds: unitTerms,
        notes: 'Owned target-exercise required unit; supports owned alignment, not external authority.',
      }));
      for (const term of unitTerms) {
        node(termNodeId(term), 'term', term);
        addEdge(edges, baseEdge({
          from: unitNodeId(unitId),
          to: termNodeId(term),
          relation: 'projected_unit_uses_term',
          edgeType: 'projection',
          sourcePath: UNITS_PATH,
          sourceSurfaceType: 'machine_unit_term_projection',
          sourceStatus: 'generated_projection',
          authorityLevel: 'machine_registry',
          authorityWeight: 80,
          paragraphId,
          recordId: paragraphId,
          unitIds: [unitId],
          termIds: [term],
          notes: 'Term projection copied from machine unit metadata for owned-content navigation; not a new machine edit.',
        }));
      }
    }

    for (const [index, flag] of (exercise.missing_units_flagged || []).entries()) {
      const issueNode = `quality_issue:${paragraphId}:missing-unit-${index + 1}`;
      node(issueNode, 'quality_issue', `${paragraphId} missing unit flag ${index + 1}`, { flag });
      addEdge(edges, baseEdge({
        from: targetNode,
        to: issueNode,
        relation: 'target_exercise_has_missing_unit_flag',
        edgeType: 'projection',
        sourcePath: TARGETS_PATH,
        sourceSurfaceType: 'target_exercise_index',
        sourceStatus: 'exercise_evidence',
        authorityLevel: 'owned_curriculum_design',
        authorityWeight: 75,
        paragraphId,
        recordId: `${paragraphId}:flag-${index + 1}`,
        unitIds: requiredUnits,
        termIds: relatedTerms,
        notes: `Owned target exercise missing-unit flag: ${flag}`,
      }));
    }

    for (const file of filesByParagraph.get(paragraphId) || []) {
      const sourceNode = sourceNodeId(file.source_path);
      node(sourceNode, 'owned_source', file.rel_path, {
        paragraph_id: paragraphId,
        source_path: file.source_path,
        source_surface_type: file.source_surface_type,
        source_status: file.source_status,
      });
      const generated = isGeneratedStatus(file.source_status);
      const edgeType = file.source_status === 'exercise_evidence' ? 'owned_exercise_evidence'
        : generated ? 'implementation_trace'
          : 'projection';

      addEdge(edges, baseEdge({
        from: sourceNode,
        to: paragraphNode,
        relation: file.source_status === 'implementation_output' ? 'source_implements_paragraph'
          : generated ? 'generated_artifact_projects_to_paragraph'
            : 'owned_source_projects_to_paragraph',
        edgeType,
        sourcePath: file.source_path,
        sourceSurfaceType: file.source_surface_type,
        sourceStatus: file.source_status,
        authorityLevel: file.authority_level,
        authorityWeight: file.authority_weight,
        paragraphId,
        recordId: file.rel_path,
        unitIds: requiredUnits,
        termIds: relatedTerms,
        notes: generated
          ? 'Generated or implementation artifact: retrieval context or trace only, not primary evidence.'
          : 'Owned lesson source projection for navigation and retrieval context.',
      }));

      if (edgeType === 'owned_exercise_evidence') {
        for (const unitId of requiredUnits) {
          const unitTerms = termsForUnits([unitId], unitById).filter((term) => termIds.has(term));
          addEdge(edges, baseEdge({
            from: sourceNode,
            to: unitNodeId(unitId),
            relation: 'owned_exercise_source_supports_unit',
            edgeType: 'owned_exercise_evidence',
            sourcePath: file.source_path,
            sourceSurfaceType: file.source_surface_type,
            sourceStatus: file.source_status,
            authorityLevel: file.authority_level,
            authorityWeight: file.authority_weight,
            paragraphId,
            recordId: file.rel_path,
            unitIds: [unitId],
            termIds: unitTerms,
            notes: 'Owned exercise markdown evidence for lesson alignment; not external authority.',
          }));
        }
      }
    }
  }

  const sortedEdges = edges.sort((a, b) => a.edge_id.localeCompare(b.edge_id));
  const graph = {
    schema_version: 1,
    graph_id: 'owned-content-graph',
    sprint_id: 'R9.2',
    generated_by: 'build-scripts/references/build-owned-content-graph.js',
    generated_on: generatedOn,
    source_files: [
      REGISTRY_PATH,
      TARGETS_PATH,
      BLUEPRINT_PATH,
      UNITS_PATH,
      TERMS_PATH,
      CP2_CLOSURE_PATH,
    ],
    cp2_gate_status: cp2.status,
    policy: {
      default_edge_type_for_owned_sources: 'projection',
      evidence_edges_require_explicit_evidence_qualified_source: true,
      generated_artifacts_are_primary_evidence: false,
      generated_artifacts_allowed_use: 'retrieval_context_or_implementation_trace_only',
      external_authority_edges_created: false,
      student_facing_uses_blocked: true,
    },
    node_count: nodes.size,
    edge_count: sortedEdges.length,
    nodes: [...nodes.values()].sort((a, b) => a.node_id.localeCompare(b.node_id)),
    edges: sortedEdges,
  };
  return graph;
}

function countBy(items, field) {
  const out = {};
  for (const item of items) out[item[field]] = (out[item[field]] || 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function buildReport(graph) {
  const paragraphs = new Set(graph.edges.map((edge) => edge.paragraph_id).filter(Boolean));
  const units = new Set(graph.edges.flatMap((edge) => edge.unit_ids || []));
  const terms = new Set(graph.edges.flatMap((edge) => edge.term_ids || []));
  const generatedWarningCount = graph.edges.filter((edge) => edge.generated_artifact_warning).length;
  const ownedEvidenceCount = graph.edges.filter((edge) => edge.edge_type === 'owned_exercise_evidence').length;
  const report = {
    report_id: 'owned-content-coverage',
    generated_by: graph.generated_by,
    generated_on: graph.generated_on,
    source_files: graph.source_files,
    schema_version: 1,
    status: 'info',
    issues: [],
    summary: {
      node_count: graph.node_count,
      edge_count: graph.edge_count,
      paragraph_count: paragraphs.size,
      unit_count: units.size,
      term_count: terms.size,
      owned_exercise_evidence_edge_count: ownedEvidenceCount,
      generated_artifact_warning_edge_count: generatedWarningCount,
      by_edge_type: countBy(graph.edges, 'edge_type'),
      by_relation: countBy(graph.edges, 'relation'),
      by_source_surface_type: countBy(graph.edges, 'source_surface_type'),
      by_source_status: countBy(graph.edges, 'source_status'),
      cp2_gate_status: graph.cp2_gate_status,
      generated_artifacts_are_primary_evidence: graph.policy.generated_artifacts_are_primary_evidence,
    },
  };
  return report;
}

function markdownReport(report) {
  const lines = [];
  lines.push('# Owned Content Coverage');
  lines.push('');
  lines.push(`Generated: ${report.generated_on}`);
  lines.push(`Status: ${report.status.toUpperCase()}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Nodes: ${report.summary.node_count}`);
  lines.push(`- Edges: ${report.summary.edge_count}`);
  lines.push(`- Paragraphs linked: ${report.summary.paragraph_count}`);
  lines.push(`- Units linked: ${report.summary.unit_count}`);
  lines.push(`- Terms linked: ${report.summary.term_count}`);
  lines.push(`- Owned exercise evidence edges: ${report.summary.owned_exercise_evidence_edge_count}`);
  lines.push(`- Generated-artifact warning edges: ${report.summary.generated_artifact_warning_edge_count}`);
  lines.push(`- Generated artifacts are primary evidence: ${report.summary.generated_artifacts_are_primary_evidence}`);
  lines.push('');
  lines.push('## By Edge Type');
  lines.push('');
  for (const [type, count] of Object.entries(report.summary.by_edge_type)) lines.push(`- ${type}: ${count}`);
  lines.push('');
  lines.push('## By Source Surface Type');
  lines.push('');
  for (const [type, count] of Object.entries(report.summary.by_source_surface_type)) lines.push(`- ${type}: ${count}`);
  lines.push('');
  lines.push('## Authority Boundary');
  lines.push('');
  lines.push('Owned-source edges default to projection. Generated artifacts are retrieval context or implementation trace only. Evidence edges are limited to explicitly evidence-qualified owned exercise records and remain separate from external authority.');
  return `${lines.join('\n')}\n`;
}

function main() {
  const graph = buildGraph();
  const report = buildReport(graph);
  writeJson(GRAPH_PATH, graph);
  writeJson(REPORT_JSON_PATH, report);
  writeText(REPORT_MD_PATH, markdownReport(report));
  console.log(`Wrote ${GRAPH_PATH} (${graph.edge_count} edges)`);
  console.log(`Wrote ${REPORT_JSON_PATH}`);
  console.log(`Wrote ${REPORT_MD_PATH}`);
}

if (require.main === module) main();
